const express = require('express');
const mysql = require('mysql2');

const app = express();

// Retry подключения к БД
function connectWithRetry() {
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  db.connect(err => {
    if (err) {
      console.log('DB not ready, retry in 3s...');
      setTimeout(connectWithRetry, 3000);  // повтор через 3 сек
      return;
    }
    console.log('Connected to MySQL!');

    app.get('/', (req, res) => {
      db.query('SELECT NOW() as time', (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.send(`DB time: ${result[0].time}`);
      });
    });

    app.listen(3000, () => console.log('Running on port 3000'));
  });
}

connectWithRetry();
