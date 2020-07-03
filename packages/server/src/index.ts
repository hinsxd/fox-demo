import { config } from 'dotenv-safe';
const IS_PROD = process.env.NODE_ENV === 'production';
config({ path: `.env.${process.env.NODE_ENV}` });

import { ApolloServer } from 'apollo-server-express';
import * as connectRedis from 'connect-redis';
import * as cors from 'cors';

import * as express from 'express';
import * as session from 'express-session';
import * as fs from 'fs';
import * as https from 'https';
import * as passport from 'passport';
// import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import * as path from 'path';
import { RedisClient } from 'redis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import * as typeorm from 'typeorm';
import { authChecker } from './authChecker';
import { redis } from './redisClient';
import { stripe } from './stripe';
import { findOrCreateUser } from './utils/findOrCreateUser';
import { User, UserRole } from './entity/User';
import * as bcrypt from 'bcrypt';
import { Teacher } from './entity/Teacher';
import { Lesson, LessonStatus } from './entity/Lesson';
import { addDays, startOfDay, addHours, setHours } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { CartItem } from './entity/CartItem';
// import { userLoader } from './loaders/userLoader';

declare global {
  namespace Express {
    interface User {
      user: any;
      token: any;
    }
  }
}

const PORT = parseInt(process.env.PORT as string, 10);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
// const API_URL = process.env.API_URL as string;
// const FACEBOOK_OAUTH_CLIENT_ID = process.env.FACEBOOK_OAUTH_CLIENT_ID as string;
// const FACEBOOK_OAUTH_CLIENT_SECRET = process.env
//   .FACEBOOK_OAUTH_CLIENT_SECRET as string;
// const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID as string;
// const GOOGLE_OAUTH_CLIENT_SECRET = process.env
//   .GOOGLE_OAUTH_CLIENT_SECRET as string;

typeorm.useContainer(Container);

const SESSION_SECRET = process.env.SESSION_SECRET;
const RedisStore = connectRedis(session); // connect node.req.session to redis backing store

async function bootstrap() {
  const conn = await typeorm.createConnection();
  await conn.synchronize();

  // Create Demo Admin
  try {
    await typeorm.getRepository(User).findOneOrFail({ username: 'demo-admin' });
  } catch {
    await typeorm.getRepository(User).save({
      username: 'demo-admin',
      password: bcrypt.hashSync('demo-admin', 5),
      email: 'demo-admin@hinsxd.dev',
      role: UserRole.Admin,
    });
  }

  // Create Demo User
  let student: User;
  try {
    student = await typeorm
      .getRepository(User)
      .findOneOrFail({ username: 'demo-user' });
  } catch {
    student = await typeorm.getRepository(User).save({
      username: 'demo-user',
      password: bcrypt.hashSync('demo-user', 5),
      email: 'demo-user@hinsxd.dev',
      profile: {
        // fill demo user info
        name: 'Demo user',
        email: 'demo-user@hinsxd.dev',
        phone: '11111111',
        emergencyName: 'Parent name',
        emergencyPhone: '22222222',
      },
      role: UserRole.User,
    });
  }

  // Clear and generate test data on each restart
  await typeorm.getRepository(CartItem).delete({});
  await typeorm.getRepository(Lesson).delete({});
  await typeorm.getRepository(Teacher).delete({});
  const teacher = await typeorm.getRepository(Teacher).save({
    name: 'Test Teacher 1',
    color: '#000000',
    hourPrice: 70000,
  });

  const start = zonedTimeToUtc(
    setHours(startOfDay(new Date()), 9),
    'Asia/Hong_Kong'
  );
  await typeorm.getRepository(Lesson).insert(
    Array(30)
      .fill(0)
      .map((z, n) => {
        const day = n / 6 + 2;
        const i = n % 6;
        const booked = i === 3;
        return {
          teacherId: teacher.id,
          start: addDays(addHours(start, i * 2), day),
          end: addDays(addHours(start, (i + 1) * 2), day),
          status: booked ? LessonStatus.Booked : LessonStatus.Bookable,
          studentId: booked ? student.id : undefined,
          comment: '',
        };
      })
  );
  const app = express();

  const schema = await buildSchema({
    resolvers: [__dirname + '/modules/**/resolver.*'],
    // register 3rd party IOC container
    container: Container,
    authChecker,
    validate: false,
    emitSchemaFile: path.resolve(__dirname, 'schema.graphql'),
  });
  const server = new ApolloServer({
    schema,
    context: ({ req }: any) => {
      return {
        req,
        userId: req.session && req.session.userId,
        stripe,
        // userLoader: userLoader()
      };
    },
  });

  app.use(
    cors({
      credentials: true,
      origin: FRONTEND_URL,
    })
  );

  app.use((req, _, next) => {
    const authorization = req.headers.authorization;

    if (authorization) {
      try {
        const qid = authorization.split(' ')[1];
        req.headers.cookie = `qid=${qid}`;
      } catch {}
    }

    return next();
  });
  const client = (redis as unknown) as RedisClient;

  const sessionOption: session.SessionOptions = {
    store: new RedisStore({
      client,
    }),
    name: 'qid',
    secret: SESSION_SECRET || '',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: IS_PROD,
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years,
    },
  };
  client.flushdb();
  app.use(session(sessionOption));

  // passport.use(
  //   new FacebookStrategy(
  //     {
  //       clientID: FACEBOOK_OAUTH_CLIENT_ID,
  //       clientSecret: FACEBOOK_OAUTH_CLIENT_SECRET,
  //       callbackURL: `${API_URL}/auth/facebook/callback`,
  //       profileFields: ['id', 'email']
  //     },
  //     async (token, tokenSecret, { emails, id: fbProviderId }, done) => {
  //       try {
  //         const email = emails && emails[0] && emails[0].value;
  //         if (!email) {
  //           throw new Error('No email retrieved');
  //         }
  //         const user = await findOrCreateUser({
  //           email,
  //           fbProviderId
  //         });
  //         return done(null, { user, token });
  //       } catch (err) {
  //         done(err);
  //       }
  //     }
  //   )
  // );

  // passport.use(
  //   new GoogleStrategy(
  //     {
  //       clientID: GOOGLE_OAUTH_CLIENT_ID,
  //       clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
  //       callbackURL: `${API_URL}/auth/google/callback`
  //     },
  //     async (token, tokenSecret, { emails, id: googleProviderId }, done) => {
  //       try {
  //         const email = emails && emails[0] && emails[0].value;
  //         if (!email) {
  //           throw new Error('No email retrieved');
  //         }
  //         const user = await findOrCreateUser({
  //           email,
  //           googleProviderId
  //         });
  //         return done(null, { user, token });
  //       } catch (err) {
  //         done(err);
  //       }
  //     }
  //   )
  // );
  app.use(passport.initialize());

  app.get(
    '/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['email'],
    })
  );
  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    (req, res) => {
      if (req.user?.user.id && req.session) {
        req.session.userId = req.user.user.id;
        req.session.token = req.user.token;
      }
      res.redirect(FRONTEND_URL);
    }
  );

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: 'profile email',
    })
  );
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
      if ((req.user as any).user.id && req.session) {
        req.session.userId = (req.user as any).user.id;
        req.session.token = (req.user as any).token;
      }
      res.redirect(FRONTEND_URL);
      // res.end();
    }
  );

  server.applyMiddleware({ app, cors: false }); // app is from an existing express app

  if (IS_PROD) {
    https
      .createServer(
        {
          key: fs.readFileSync(
            '/etc/letsencrypt/live/booking-demo-api.hinsxd.dev/privkey.pem',
            'utf8'
          ),
          cert: fs.readFileSync(
            '/etc/letsencrypt/live/booking-demo-api.hinsxd.dev/cert.pem',
            'utf8'
          ),
          ca: fs.readFileSync(
            '/etc/letsencrypt/live/booking-demo-api.hinsxd.dev/chain.pem',
            'utf8'
          ),
        },
        app
      )
      .listen(PORT, function() {
        console.log(`🚀 Server ready at http://:${PORT}${server.graphqlPath}`);
      })
      .on('close', async () => {
        console.log('Closing down server.');
        await conn.close();
      });
    // express()
    //   .use(function(req, res, next) {
    //     if (!req.secure) {
    //       return res.redirect(`https://${req.hostname}${req.url}`);
    //     }
    //     next();
    //   })
    //   .listen(80);
  } else {
    app
      .listen(PORT, () =>
        console.log(`🚀 Server ready at http://:${PORT}${server.graphqlPath}`)
      )
      .on('close', async () => {
        console.log('Closing down server.');
        await conn.close();
      });
  }
}

bootstrap();
