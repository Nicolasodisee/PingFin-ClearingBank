FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=secret
ENV MYSQL_DATABASE=Pingfin
ENV PORT=3306

COPY ./Pingfin.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
