# Use a imagem oficial do Go como base
FROM golang:latest

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o código Go para o diretório de trabalho
COPY . .

# Instale dependências
RUN go mod tidy

# Exponha a porta 8080 (se necessário)
EXPOSE 8080

# Comando padrão para executar o aplicativo Go
CMD ["go", "run", "main.go"]
