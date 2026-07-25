FROM node:24.18.0 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
/Users/amanagrahari/Personal Project/NSS-Attendance-System-main/updated project/NSS-Attendance-System-main/backend/.env