FROM node:20.11.1
WORKDIR /app
COPY . .
RUN npm install
RUN npx tsc -b

EXPOSE 3000

CMD [ "node","dist/index.js" ]
