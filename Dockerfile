FROM alpine:latest

WORKDIR /app

# Install miniserve
RUN apk add --no-cache curl
RUN wget "https://github.com/svenstaro/miniserve/releases/download/v0.26.0/miniserve-0.26.0-x86_64-unknown-linux-musl" -O /usr/local/bin/miniserve
RUN chmod +x /usr/local/bin/miniserve

# Expose port
EXPOSE 8080

RUN mkdir -p /data
COPY ./src /data

# Run miniserve
CMD ["miniserve", "/data", "--index", "index.html"]
