FROM alpine:latest

# Instalação de dependências necessárias
# gcompat e libstdc++ são essenciais para rodar o JDK da Oracle (glibc) no Alpine (musl)
RUN apk add --no-cache \
    curl \
    tar \
    bash \
    gcompat \
    libstdc++ \
    libc6-compat

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

# Mantém o container rodando (pode ser alterado para ./gradlew bootRun se preferir)
CMD ["tail", "-f", "/dev/null"]
