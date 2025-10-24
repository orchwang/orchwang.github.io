---
layout: post
title: "Technical competencies for Python engineer"
date: 2025-10-12
categories: Roadmap
tags: [python, career, engineer, roadmap, backend, competencies, skills]
published: true
excerpt: "10년차 Python 백엔드 엔지니어 기술 역량 로드맵. 언어 코어, 아키텍처, 데이터베이스, 인프라, 운영, 협업 등 전 영역을 체크리스트로 정리했습니다."
---

## Python 엔지니어 기술 역량 로드맵

10년차 파이썬 백엔드 엔지니어라면, 단순히 프레임워크 사용 능력을 넘어서 시스템 아키텍처, 성능 최적화, 운영 자동화, 협업 리더십까지 포함한 전방위적 역량이 요구됩니다.

이 로드맵은 핵심 영역별로 정리한 기술 역량 체크리스트입니다. 각 항목을 학습하면서 체크박스를 업데이트하고 관련 학습 기록을 링크로 연결합니다.

## 🧠 1. 언어 및 코어 역량 (Python Core Competency)

### Python 심화

- [ ] 메모리 구조 이해 (sys.getsizeof, tracemalloc)
- [ ] GIL (Global Interpreter Lock) 동작 원리
- [ ] Garbage Collection 메커니즘
- [ ] weakref와 contextvars 활용

### 성능 최적화

- [ ] cProfile을 활용한 프로파일링
- [ ] line_profiler로 라인별 성능 분석
- [ ] asyncio event loop 튜닝
- [ ] 메모리 프로파일링 및 최적화

### 타입 안정성

- [ ] 타입 힌트 (Type Hints) 마스터
- [ ] mypy를 활용한 정적 타입 체킹
- [ ] pydantic으로 런타임 검증
- [ ] 대규모 코드베이스 타입 안전성 유지

### 동시성/병렬성

- [ ] asyncio 비동기 프로그래밍
- [ ] threading 멀티스레딩
- [ ] multiprocessing 멀티프로세싱
- [ ] I/O bound vs CPU bound 작업 설계

### 테스트 및 품질관리

- [ ] pytest 프레임워크 숙련
- [ ] hypothesis 속성 기반 테스트
- [ ] coverage.py 코드 커버리지
- [ ] fixture 관리 및 모킹
- [ ] TDD/BDD 실천

## 🧱 2. 백엔드 아키텍처 및 프레임워크

### 웹 프레임워크

- [ ] Django 숙련 (ORM, middleware, signals)
- [ ] FastAPI 마스터 (async, dependency injection)
- [ ] Django REST Framework (DRF)
- [ ] 프레임워크 lifecycle hook 이해

### 도메인 설계

- [ ] Domain-Driven Design (DDD)
- [ ] Clean Architecture 적용
- [ ] CQRS 패턴 이해
- [ ] 비즈니스 로직 분리
- [ ] Service layer 설계

### API 설계

- [ ] RESTful API 설계 원칙
- [ ] GraphQL 스키마 설계
- [ ] gRPC 서비스 정의
- [ ] OpenAPI Specification (Swagger)
- [ ] API versioning 전략
- [ ] Schema 관리

### 비동기/이벤트 기반

- [ ] Celery 작업 큐
- [ ] Apache Kafka 이벤트 스트리밍
- [ ] Redis Stream
- [ ] Job orchestration
- [ ] Backpressure 관리

### 서비스 통합

- [ ] gRPC 통신
- [ ] WebSocket 실시간 연결
- [ ] Server-Sent Events (SSE)
- [ ] 마이크로서비스 통신 패턴

## 🧩 3. 데이터베이스 및 스토리지

### RDBMS

- [ ] PostgreSQL 심화 (쿼리 최적화)
- [ ] MySQL 튜닝
- [ ] EXPLAIN ANALYZE 쿼리 플랜 분석
- [ ] 인덱스 전략 (B-tree, Hash, GiST)
- [ ] WAL (Write-Ahead Logging) 구조 이해
- [ ] 트랜잭션 격리 수준

### NoSQL

- [ ] Redis 캐싱 및 세션 저장
- [ ] MongoDB 도큐먼트 DB
- [ ] DynamoDB 키-값 저장소
- [ ] TTL 전략

### OLAP/분석형 DB

- [ ] ClickHouse 컬럼 기반 DB
- [ ] DuckDB 임베디드 분석 DB
- [ ] BigQuery 데이터 웨어하우스
- [ ] 로그/메트릭 분석
- [ ] ETL 파이프라인 설계

### 스토리지

- [ ] S3-compatible 객체 스토리지
- [ ] NFS 파일 시스템
- [ ] Blob storage
- [ ] 파일 versioning
- [ ] Multipart upload

## ⚙️ 4. 인프라 및 DevOps

### CI/CD

- [ ] GitHub Actions 워크플로우
- [ ] ArgoCD GitOps
- [ ] Jenkins 파이프라인
- [ ] 테스트 자동화
- [ ] 배포 자동화
- [ ] 환경별 파이프라인 관리

### 컨테이너/오케스트레이션

- [ ] Docker 컨테이너화
- [ ] Podman 대안 런타임
- [ ] Kubernetes 기초
- [ ] Kubernetes 심화 (Helm, Operators)
- [ ] AWS ECS/EKS
- [ ] Multi-stage build
- [ ] Rollout 전략
- [ ] Health check 설정

### Observability

- [ ] Prometheus 메트릭 수집
- [ ] Grafana 대시보드
- [ ] ELK Stack (Elasticsearch, Logstash, Kibana)
- [ ] Sentry 에러 트래킹
- [ ] Distributed tracing (Jaeger, Zipkin)
- [ ] Logging 설계
- [ ] Metrics 설계

### Infrastructure as Code

- [ ] Terraform 인프라 프로비저닝
- [ ] Ansible 구성 관리
- [ ] Reproducible infrastructure
- [ ] 환경 일관성 유지

### Cloud

- [ ] AWS S3 객체 스토리지
- [ ] AWS ECS 컨테이너 서비스
- [ ] AWS RDS 관리형 데이터베이스
- [ ] AWS MSK (Kafka)
- [ ] GCP 서비스
- [ ] 비용 최적화
- [ ] Multi-region 설계

## 🔒 5. 보안 및 안정성

### 인증/인가

- [ ] JWT (JSON Web Token) 구현
- [ ] OAuth 2.0 프로토콜
- [ ] AWS Cognito
- [ ] Keycloak IdP
- [ ] Multi-tenant 인증 설계
- [ ] RBAC (Role-Based Access Control)
- [ ] ABAC (Attribute-Based Access Control)

### 보안

- [ ] CSRF 방어
- [ ] CORS 정책 설정
- [ ] SQL Injection 방어
- [ ] XSS (Cross-Site Scripting) 방어
- [ ] Rate limiting 구현
- [ ] API Gateway 보안 정책

### 데이터 무결성

- [ ] 트랜잭션 관리
- [ ] Idempotency 설계
- [ ] Retry-safe 작업 설계
- [ ] Job 재실행 안정성

### 백업/복원

- [ ] pgBackRest 백업 도구
- [ ] PITR (Point-In-Time Recovery)
- [ ] Snapshot 백업
- [ ] Disaster recovery 계획 수립

## 🧮 6. 성능 및 확장성

### Scale-out 설계

- [ ] Database sharding
- [ ] Read replica
- [ ] Multi-tenant 아키텍처
- [ ] Plugin 기반 workload 분리

### 캐시 전략

- [ ] Redis 캐싱 패턴
- [ ] CDN 설정
- [ ] Query cache
- [ ] Cold/warm cache 관리

### 비동기 작업 분산

- [ ] Celery 분산 작업
- [ ] Ray 분산 컴퓨팅
- [ ] Kafka Streams 스트림 처리
- [ ] 대규모 inference orchestration

### 성능 분석

- [ ] pgbouncer 커넥션 풀링
- [ ] Gunicorn 워커 튜닝
- [ ] Uvicorn ASGI 서버 최적화
- [ ] Connection pool 최적화

## 👥 7. 협업 및 리더십

### 리뷰 및 멘토링

- [ ] 코드 리뷰 문화 정착
- [ ] 아키텍처 리뷰 프로세스
- [ ] Junior 성장 피드백
- [ ] 페어 프로그래밍

### 문서화 및 커뮤니케이션

- [ ] ADR (Architecture Decision Records) 작성
- [ ] ERD (Entity Relationship Diagram) 설계
- [ ] Sequence diagram 작성
- [ ] README 및 기술 문서 작성
- [ ] 구조적 전달력 향상

### 기술 의사결정

- [ ] Trade-off 분석 능력
- [ ] Monolith vs Microservice 판단
- [ ] Technology radar 관리
- [ ] PoC (Proof of Concept) 설계

### 조직적 영향력

- [ ] Chapter 운영 (Communities of Practice)
- [ ] 기술 브랜딩
- [ ] 팀 기술 방향성 제시
- [ ] Knowledge sharing 문화 구축

## 🔭 8. 미래 확장 역량 (리더 레벨)

### 시스템 설계

- [ ] SLA/SLO 기반 설계
- [ ] Capacity planning
- [ ] 장애 시뮬레이션 (Chaos Engineering)
- [ ] 시스템 설계 면접 수준의 사고력

### ML/AI 연계 서비스

- [ ] AI inference backend 설계
- [ ] Plugin architecture 구현
- [ ] 모델 서빙 파이프라인
- [ ] MLOps 이해

### 도메인 주도 성장

- [ ] 조직 도메인 모델링
- [ ] 제품 도메인 이해
- [ ] DDD aggregate root 설계
- [ ] Bounded context 정의

### 엔터프라이즈 품질관리

- [ ] ISO 27001 이해
- [ ] ISMS 인증 프로세스
- [ ] Audit log 설계
- [ ] Traceability 확보
- [ ] Enterprise-grade reliability

## 📊 진행 상황

**현재 완료한 항목:** 0개
**전체 항목:** 약 80개
**진행률:** 0%

## 🎯 학습 전략

### 우선순위 추천

**Phase 1: 기초 다지기 (0-2년차)**

1. Python 심화 → 성능 최적화 → 동시성/병렬성
2. 웹 프레임워크 숙련 (Django/FastAPI)
3. 데이터베이스 기초 (PostgreSQL, Redis)

**Phase 2: 실무 숙련 (3-5년차)**

1. 백엔드 아키텍처 설계 패턴
2. 인프라 자동화 (Docker, CI/CD)
3. 성능 최적화 및 모니터링

**Phase 3: 리더십 구축 (6-10년차)**

1. 시스템 설계 및 확장성
2. 팀 협업 및 멘토링
3. 조직 영향력 확대

### 다음 단계

학습을 완료한 항목은 체크박스를 `[x]`로 변경하고, 상세 학습 포스트 링크를 추가하세요.

**예시:**

```markdown
- [x] GIL 동작 원리 - [[Python GIL 완벽 가이드](/YYYY/MM/DD/python-gil.html)]
- [x] PostgreSQL 쿼리 최적화 - [[EXPLAIN ANALYZE 마스터하기](/YYYY/MM/DD/postgres-explain.html)]
```

### 학습 리소스

각 항목에 대한 상세 학습은 별도의 포스트로 작성하고, 이 로드맵에서 링크로 연결하세요.

**함께 성장하며 도장을 하나씩 깨나가봅시다! 🚀**
