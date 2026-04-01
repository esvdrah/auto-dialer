module.exports = {
  apps: [
    {
      name: "auto-dialer-app",
      script: "src/index.js",
      interpreter: "bun",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production"
      },
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      out_file: "logs/out.log",
      error_file: "logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      // Restart every day at 3:00 AM to ensure stability
      cron_restart: "0 3 * * *"
    }
  ]
};
