FROM debian:stable-slim

# Instalação de dependências necessárias
RUN apt-get update && apt-get install -y \
    curl \
    tar \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Configuração do JAVA_HOME
ENV JAVA_HOME=/opt/jdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Download e extração do Oracle JDK 26
RUN mkdir -p /opt/jdk && \
    curl -L https://download.oracle.com/java/26/latest/jdk-26_linux-x64_bin.tar.gz | tar -xz -C /opt/jdk --strip-components=1

# Configuração do diretório de trabalho
WORKDIR /workspace/

# Expondo a porta padrão do Spring Boot
EXPOSE 8080

# Comando para rodar a aplicação Spring Boot
CMD ["sh", "./gradlew", "bootRun"]
