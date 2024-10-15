module.exports = {
  apps: [
    {
      name: 'digistock',
      script: '.next/standalone/server.js',
      args: 'start -p ' + (process.env.PORT || 3000),
      watch: false,
      autorestart: true,
    },
  ],
};
