FROM ubi8/nodejs-20

USER 0

WORKDIR /opt/app-root/src

COPY package*.json ./
COPY tsconfig*.json ./

# Instala dependências (incluindo as de dev como ts-node, @nestjs/cli, etc.)
RUN npm install --include=dev

COPY . .

# Permissões opcionais se quiser rodar como 1001 depois
# RUN chown -R 1001:0 /opt/app-root/src && chmod -R g+rw /opt/app-root/src
# USER 1001

EXPOSE 3001

CMD ["npm", "run", "start"]