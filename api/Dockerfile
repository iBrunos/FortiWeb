FROM ubi8/nodejs-20

# Usa root o tempo todo
USER 0

# Diretório de trabalho
WORKDIR /opt/app-root/src

# Copia os arquivos de dependência
COPY package*.json ./
COPY tsconfig*.json ./

# Instala dependências de desenvolvimento
RUN npm install --include=dev

# Copia o restante do código
COPY . .

# Expõe a porta da aplicação
EXPOSE 3001

# Inicia a aplicação
CMD ["npm", "run", "start"]