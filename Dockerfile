FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
COPY localhost.key /usr/share/nginx/
COPY localhost.crt /usr/share/nginx/

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
