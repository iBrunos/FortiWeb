FROM ubi8/nodejs-20

USER 0

WORKDIR /opt/app-root/src

COPY package*.json ./
COPY tsconfig*.json ./

# Instala dependências (incluindo as de dev como ts-node, @nestjs/cli, etc.)
RUN npm install --include=dev

COPY . .
RUN chown -R 1001:0 /opt/app-root/src && chmod -R g+rw /opt/app-root/src

USER 1001

EXPOSE 8080

CMD ["npm", "run", "start"]