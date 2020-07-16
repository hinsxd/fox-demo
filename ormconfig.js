module.exports = {
  type: 'postgres',
  host: 'x.hinsxd.dev',
  port: 5432,
  username: 'admin',
  password: 'password',
  database:
    process.env.NODE_ENV === 'production' ? 'fox-demo-prod' : 'fox-demo-dev',
  synchronize: true,
  dropSchema: true,
  logging: false,
  entities: ['src/entity/**/*.*'],
};
