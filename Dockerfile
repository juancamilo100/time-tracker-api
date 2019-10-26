FROM node:12 AS builder

WORKDIR /app

COPY . .
RUN npm install --only=production 
RUN cp -R node_modules prod_node_modules
RUN npm install
RUN npm run build

# -------------

FROM node:12-slim

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app

COPY --from=builder /app/prod_node_modules node_modules
COPY --from=builder /app/build build
COPY --from=builder /app/swagger.yml .
EXPOSE 3000:3000
CMD [ "node", "./build/bin/www.js" ]