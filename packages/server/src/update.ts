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
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
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
import { Lesson, LessonStatus } from './entity/Lesson';
import { differenceInMinutes } from 'date-fns';
// import { userLoader } from './loaders/userLoader';

const PORT = parseInt(process.env.PORT as string, 10);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const API_URL = process.env.API_URL as string;
const FACEBOOK_OAUTH_CLIENT_ID = process.env.FACEBOOK_OAUTH_CLIENT_ID as string;
const FACEBOOK_OAUTH_CLIENT_SECRET = process.env
  .FACEBOOK_OAUTH_CLIENT_SECRET as string;
const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID as string;
const GOOGLE_OAUTH_CLIENT_SECRET = process.env
  .GOOGLE_OAUTH_CLIENT_SECRET as string;

typeorm.useContainer(Container);

const SESSION_SECRET = process.env.SESSION_SECRET;
const RedisStore = connectRedis(session); // connect node.req.session to redis backing store

async function bootstrap() {
  const conn = await typeorm.createConnection();
  // await conn.synchronize();

  // Update lessons
  const lessons = await conn.getRepository(Lesson).find();
  lessons.forEach(lesson => {
    if (lesson.cancelReason === null) {
      lesson.cancelReason = '';
    }
  });
  // save lesson
  await conn.getRepository(Lesson).save(lessons);

  // const users = await conn.getRepository(User).find();
  // console.log(users.map(user => user.cart));
  await conn.close();
}

bootstrap();
