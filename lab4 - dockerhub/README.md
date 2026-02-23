cd lab4\ -\ dockerhub/
npm init -y
npm install express
docker build -t lab4-dockerhub .
docker run -d -p 8080:3000 --name lab4 lab4-dockerhub
docker tag lab4-dockerhub:v0.1
docker login
docker images
docker tag lab4-dockerhub:latest dandrey1972/lab4-shared:v0.1
docker images
docker push dandrey1972/lab4-shared:v0.1