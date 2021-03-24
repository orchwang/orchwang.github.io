---
layout: post
title: "docker-compose 에 env 세팅하기"
date: 2021-03-24 13:00:00 +0900
categories: docker
tags: docker docker-compose env
published: true
---

# 개요

당연하겠지만, docker-compose 에도 environment variable 을 세팅할 수 있다. 본 포스트 에서는 mariadb 를 세팅해 보았다.

# docker-compose 파일 구성

```
version: '3.8'
services:
  mariadb:
    image: "mariadb:${MARIADB_VERSION}"
    restart: 'always'
    volumes:
      - /var/lib/mysql/data:${MARIADB_DATA_DIR}
      - /var/lib/mysql/logs:${MARIADB_LOG_DIR}
      - /var/docker/mariadb/conf:${MARIADB_CONF_DIR}
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - 3306:3306
```

# .env 파일 구성

```
MARIADB_VERSION=10.3
MARIADB_DATA_DIR=/path
MARIADB_LOG_DIR=/path
MARIADB_CONF_DIR=/path
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=databasename
MYSQL_USER=username
MYSQL_PASSWORD=userpassword
```

# 실행

docker-compose command 입력 후 옵션을 입력하기 전에 env 파일을 지정해준다. 모든 docker-compose command 에 지정해야 오류가 나지 않는다.

```
docker-compose --env-file ./.docker-compose-env up -d
docker-compose --env-file ./.docker-compose-env logs -f
```
