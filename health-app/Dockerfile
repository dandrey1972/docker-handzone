# 1. Базовый образ Node.js (LTS версия)
FROM node:20-alpine

# 2. Рабочая директория внутри контейнера
WORKDIR /app

# 3. Копируем package.json и устанавливаем зависимости
COPY package.json .
RUN npm install

# 4. Копируем исходный код
COPY . .

# 5. Создаём папку для логов
RUN mkdir -p /app/logs

# 6. Открываем порт
EXPOSE 3000

# 7. Запуск приложения
CMD ["npm", "start"]
