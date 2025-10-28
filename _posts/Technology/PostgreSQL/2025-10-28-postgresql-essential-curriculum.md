---
layout: post
title: "PostgreSQL Essential Curriculum"
date: 2025-10-28
categories: [Technology, PostgreSQL]
series: PostgreSQL-Essential
tags: [postgresql, curriculum]
published: true
excerpt: "PostgreSQL 기초부터 고급 주제까지 체계적으로 학습할 수 있는 종합 커리큘럼입니다. 아키텍처, 쿼리 최적화, 성능 튜닝을 포함합니다."
---

## 소개

PostgreSQL은 가장 진보된 오픈소스 관계형 데이터베이스 시스템 중 하나로, 견고성, 확장성, 표준 준수로 잘 알려져 있습니다. 이 커리큘럼은 PostgreSQL을 기초부터 마스터하고자 하는 개발자들을 위한 체계적인 학습 경로를 제공합니다.

이 가이드는 기본 설치 및 SQL 기초부터 쿼리 최적화, 복제, 성능 튜닝과 같은 고급 주제까지 모든 것을 다룹니다.

## 1. PostgreSQL 기초

### 1.1 설치 및 설정

- 다양한 플랫폼에서 PostgreSQL 설치하기
- PostgreSQL 아키텍처 이해하기
- 설정 파일 및 기본 설정
- psql 커맨드라인 도구 사용하기
- GUI 도구 (pgAdmin, DBeaver)

### 1.2 데이터베이스 기본

- 데이터베이스 생성 및 관리
- 스키마 이해하기
- 사용자, 역할, 권한
- 연결 관리
- 데이터베이스 인코딩 및 콜레이션

## 2. SQL 필수 개념

### 2.1 데이터 정의 언어 (DDL)

- 적절한 데이터 타입으로 테이블 생성하기
- 기본 키, 외래 키, 제약조건
- 인덱스와 그 종류
- 뷰와 구체화된 뷰 (Materialized Views)
- 시퀀스와 아이덴티티 컬럼

### 2.2 데이터 조작 언어 (DML)

- INSERT, UPDATE, DELETE 연산
- SELECT 쿼리와 필터링
- 조인 (INNER, LEFT, RIGHT, FULL)
- 서브쿼리와 CTE (Common Table Expressions)
- 집계와 GROUP BY

### 2.3 고급 SQL

- 윈도우 함수 (Window Functions)
- 재귀 쿼리 (Recursive Queries)
- JSON 및 JSONB 연산
- 전문 검색 (Full-text Search)
- 배열 연산

## 3. 데이터 모델링

### 3.1 설계 원칙

- 정규화 (1NF, 2NF, 3NF, BCNF)
- 엔티티-관계 모델링
- 적절한 데이터 타입 선택
- 비정규화가 필요한 경우
- 스키마 설계 패턴

### 3.2 PostgreSQL 특화 기능

- 상속 (Inheritance)
- 테이블 파티셔닝
- 사용자 정의 타입과 도메인
- 복합 타입 (Composite Types)
- 범위 타입 (Range Types)

## 4. 쿼리 최적화

### 4.1 EXPLAIN 이해하기

- 실행 계획 읽기
- 비용과 타이밍 이해하기
- 병목 지점 식별하기
- EXPLAIN vs EXPLAIN ANALYZE
- 시각화 도구

### 4.2 인덱스 최적화

- B-tree, Hash, GiST, GIN, BRIN 인덱스
- 각 인덱스 타입을 언제 사용할지
- 커버링 인덱스 (Covering Indexes)
- 부분 인덱스 (Partial Indexes)
- 인덱스 유지보수

### 4.3 쿼리 튜닝

- 더 나은 성능을 위한 쿼리 재작성
- 통계 이해하기
- 일반적인 안티 패턴 피하기
- Prepared Statement 사용
- 커넥션 풀링

## 5. 트랜잭션과 동시성

### 5.1 트랜잭션 관리

- ACID 속성
- 트랜잭션 격리 수준
- SAVEPOINT와 중첩 트랜잭션
- 2단계 커밋 (Two-Phase Commit)
- 교착 상태 감지 및 방지

### 5.2 동시성 제어

- MVCC (Multi-Version Concurrency Control)
- 락 타입과 락 모니터링
- 행 수준 vs 테이블 수준 락킹
- Advisory Locks
- 동시 업데이트 처리

## 6. 성능과 모니터링

### 6.1 성능 튜닝

- 설정 파라미터 (shared_buffers, work_mem 등)
- Autovacuum 설정
- 체크포인트 튜닝
- WAL (Write-Ahead Logging) 최적화
- 리소스 관리

### 6.2 모니터링과 진단

- pg_stat 뷰
- 느린 쿼리 식별하기
- 로그 분석
- 모니터링 도구 (pg_stat_statements)
- 알림과 메트릭

## 7. 백업과 복구

### 7.1 백업 전략

- pg_dump와 pg_dumpall
- 파일 시스템 수준 백업
- 연속 아카이빙 (Continuous Archiving)
- 특정 시점 복구 (PITR)
- 백업 모범 사례

### 7.2 고가용성

- 스트리밍 복제 (Streaming Replication)
- 논리 복제 (Logical Replication)
- 장애 조치와 전환 (Failover and Switchover)
- PgBouncer를 이용한 커넥션 풀링
- 로드 밸런싱

### 7.3 Kubernetes에서의 PostgreSQL (CNPG)

- CloudNativePG (CNPG) 소개
- CNPG 아키텍처 이해하기
- Kubernetes에 PostgreSQL 클러스터 배포
- CNPG Operator를 통한 자동화된 관리
- 선언적 설정을 통한 클러스터 구성
- 자동 장애 조치 및 자가 복구
- 롤링 업데이트와 버전 업그레이드
- 백업 및 복구 자동화 (Barman)
- 모니터링 및 메트릭 수집 (Prometheus, Grafana)
- CNPG 플러그인을 통한 kubectl 통합
- 프로덕션 환경에서의 CNPG 운영 패턴
- 스토리지 클래스 및 PVC 관리
- 리소스 제한 및 QoS 설정

## 8. 고급 주제

### 8.1 확장 기능

- 인기 있는 확장 기능 (PostGIS, pg_trgm, hstore)
- 사용자 정의 확장 기능 생성
- 확장 기능 관리
- Foreign Data Wrappers (FDW)

### 8.2 보안

- 인증 방법
- SSL/TLS 설정
- 행 수준 보안 (Row-Level Security, RLS)
- 저장 데이터 암호화 (Encryption at Rest)
- 감사 로깅

### 8.3 고급 기능

- 저장 프로시저와 함수 (PL/pgSQL)
- 트리거와 이벤트 트리거
- Pub-Sub을 위한 Listen/Notify
- 외부 테이블 (Foreign Tables)
- 병렬 쿼리 실행

## 핵심 포인트

- **기초부터 시작**: 고급 주제로 넘어가기 전에 SQL과 기본 데이터베이스 개념을 마스터하세요
- **쿼리 최적화 연습**: 성능을 위해 EXPLAIN과 인덱스를 이해하는 것이 중요합니다
- **MVCC 학습**: PostgreSQL의 동시성 모델은 독특하고 강력합니다
- **확장 기능 탐색**: PostgreSQL의 확장성은 가장 큰 강점 중 하나입니다
- **성능에 집중**: 설정 튜닝과 모니터링은 필수 기술입니다
- **백업/복구 이해**: 데이터 안전은 항상 우선순위여야 합니다
- **실제 패턴 학습**: 프로덕션 사용 사례와 모범 사례에서 배우세요
- **클라우드 네이티브 접근**: Kubernetes에서 CNPG를 사용한 현대적인 PostgreSQL 운영을 이해하세요

## 결론

PostgreSQL 마스터하기는 이론적 지식과 실무 경험을 모두 필요로 하는 여정입니다. 이 커리큘럼은 기초부터 시작해 고급 주제로 진행하는 체계적인 PostgreSQL 학습 접근법을 제공합니다.

성공의 열쇠는 실습입니다. 로컬 PostgreSQL 인스턴스를 설정하고, 각 주제를 체계적으로 학습하며, 배운 것을 실제 시나리오에 적용하세요. 기초를 건너뛰지 마세요—MVCC, 쿼리 플래닝, 인덱싱과 같은 핵심 개념을 이해하는 것이 모든 고급 주제의 기반이 됩니다.

### 다음 학습

- PostgreSQL 개발 환경 구축 - 설치 및 설정 시작하기
- PostgreSQL 아키텍처 심층 분석 - PostgreSQL이 내부적으로 어떻게 작동하는지 이해하기
- SQL 쿼리 최적화 기법 - 효율적인 쿼리 작성을 위한 실용 가이드
- PostgreSQL 성능 튜닝 가이드 - 종합적인 성능 최적화 전략
- PostgreSQL로 고가용성 구현하기 - 복제 및 장애 조치 전략
- CloudNativePG (CNPG) 시작하기 - Kubernetes에서 PostgreSQL 운영하기
