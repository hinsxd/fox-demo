module.exports = {
  apps: [
    {
      name: 'booking-demo-server',
      script: './node_modules/.bin/ts-node',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: '--type-check -r tsconfig-paths/register src/index.ts',
      instances: 1,
      autorestart: true,
      cron_restart: '0 0 * * *',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
