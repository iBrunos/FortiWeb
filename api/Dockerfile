FROM ubi8/nodejs-20

# Configura diretório de trabalho
WORKDIR /opt/app-root/src

# Copia apenas os arquivos necessários para instalação
COPY package*.json ./
COPY tsconfig*.json ./

# Instala dependências como root e ajusta permissões
USER 0
RUN npm install --include=dev && \
    chown -R 1001:0 /opt/app-root/src && \
    chmod -R g+rw /opt/app-root/src

# Volta para o usuário não-root padrão (1001)
USER 1001

# Copia o restante do código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Configurações finais
EXPOSE 3001
CMD ["npm", "run", "start:prod"]