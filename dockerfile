FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=secret
ENV MYSQL_DATABASE=Pingfin

COPY ./Pingfin.sql /docker-entrypoint-initdb.d/