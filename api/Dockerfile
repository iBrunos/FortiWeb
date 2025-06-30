FROM ubi8/nodejs-20

# Configura o usuário e diretório de trabalho
USER 0
WORKDIR /opt/app-root/src

# Copia os arquivos do projeto
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

# Instala as dependências (incluindo devDependencies para build)
RUN npm install --include=dev

# Build da aplicação (se necessário)
RUN npm run build

# Limpa as devDependencies após o build (opcional para produção)
RUN npm prune --omit=dev

# Instala o Nest CLI localmente (não precisa ser global)
RUN npm install @nestjs/cli

# Configura a porta e o comando de inicialização
EXPOSE 3001
CMD ["npm", "run", "start:prod"]