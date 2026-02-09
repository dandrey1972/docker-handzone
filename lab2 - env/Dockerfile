# nodejs already exist in this image
FROM node:20

# create folder + cd folder
WORKDIR /usr/app 

# copy nodejs configuration file
COPY ./package.json .

# install express based on package.json file
RUN npm install

# copy the application structure
COPY . .

# overwrite .env PORT
ENV PORT=5000

# let the user know the exatclly port
EXPOSE 5000

# start the application
CMD ["npm", "start"]
