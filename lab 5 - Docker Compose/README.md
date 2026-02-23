# Структура
bash
```
mkdir lab5 && cd lab5
mkdir app
```

# Шаг 1: docker-compose.yml
text
```
cat > docker-compose.yml << 'EOF'
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: mydb
      MYSQL_USER: user
      MYSQL_PASSWORD: userpass
    volumes:
      - db_data:/var/lib/mysql   # данные БД сохраняются между перезапусками
    ports:
      - "3306:3306"

  app:
    build: ./app
    image: node_mysql:v0.1
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db
      DB_USER: user
      DB_PASSWORD: userpass
      DB_NAME: mydb
    depends_on:
      - db

  phpmyadmin:
    image: phpmyadmin:latest
    ports:
      - "8080:80"              # UI на localhost:8080
    environment:
      PMA_HOST: db             # имя сервиса MySQL
      PMA_USER: user
      PMA_PASSWORD: userpass
    depends_on:
      - db

volumes:
  db_data:                       # named volume для MySQL
EOF
```

# Шаг 2: Node приложение
bash
```
cat > app/package.json << 'EOF'
{
  "name": "lab5",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
    "mysql2": "^3.0.0"
  }
}
EOF
```

# Шаг 3. index.js
bash
```
cat > app/index.js << 'EOF'
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
EOF
```

# Шаг 4: Dockerfile
bash
```
cat > app/Dockerfile << 'EOF'
FROM node:18-alpine          
# alpine = минимальный образ (~50MB)

WORKDIR /usr/src/app         
# рабочая директория внутри контейнера

COPY package.json .          
# копируем зависимости отдельно (кэш слоёв)

RUN npm install              
# устанавливаем зависимости

COPY . .                     
# копируем остальной код

EXPOSE 3000                  
# документируем порт

CMD ["node", "index.js"]     
# команда запуска
EOF
```

# Шаги 5-6: Build + Test
bash
```
# Шаг 5: собрать с тегом
docker-compose build
# или: docker build -t node_mysql:v0.1 ./app

# Шаг 6: запустить
docker-compose up -d

# Проверка
docker-compose ps
curl http://localhost:3000
Открой браузер: http://localhost:8080
Логин: user / userpass
```

# Шаг 7: Git
bash
```
git init
echo "node_modules/" > .gitignore
git add .
git commit -m "Lab5: docker-compose MySQL + Node"
git remote add origin <URL>
git push origin main
```