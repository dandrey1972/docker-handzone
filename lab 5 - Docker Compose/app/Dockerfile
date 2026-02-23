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
