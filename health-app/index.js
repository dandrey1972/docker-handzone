const express = require('express');
const log4js = require('log4js');

const app = express();
const PORT = 3000;

// Настройка логгера log4js
log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: './logs/myapp.log',
      layout: { type: 'pattern', pattern: '[%level] %d{ISO8601} - %m' }
    }
  },
  categories: {
    default: { appenders: ['file'], level: 'info' }
  }
});

const logger = log4js.getLogger();

// GET /health с логами
app.get('/health', (req, res) => {
  const timestamp = new Date().toISOString();
  const response = {
    status: 'OK',
    timestamp: timestamp
  };

  // Записываем в файл logs/myapp.log
  logger.info(`Health check called - ${process.env.APP_ID || 'No ID'} - ${timestamp}`);

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Health app listening on port ${PORT}`);
});
