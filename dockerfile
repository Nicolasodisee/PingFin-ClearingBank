FROM mysql:latest

COPY ./Pingfin.sql /docker-entrypoint-initdb.d/

EXPOSE 3306