FROM ubi8/nodejs-20

WORKDIR /opt/app-root/src

# Copia os arquivos do projeto
ADD . .

# Instala o Nest CLI globalmente
RUN npm install -g @nestjs/cli

# Instala as dependências do projeto
RUN npm install

# Inicia a aplicação
CMD ["npm", "run", "start", "--", "--port", "3001"]
