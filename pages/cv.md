---
layout: cv
title: CV
subtitle: Python Backend Engineer | HHKB & NeoVim
permalink: /pages/cv.html
date: 2025-10-12
---

## Bio

- **Name:** 황 종 택 (Jongtaek Hwang)
- **Email:** orchwang@gmail.com
- **Blog:** [https://wiki.orchwang.dev/](https://wiki.orchwang.dev/)
- **LinkedIn:** [www.linkedin.com/in/orchwang](https://www.linkedin.com/in/orchwang)
- **GitHub:** [https://github.com/orchwang](https://github.com/orchwang)
- **Twitter:** [https://x.com/orchwang](https://x.com/orchwang)

## Professional Summary

11년차 Python 백엔드 엔지니어이자 엔지니어링 리더로서, 서비스 아키텍처 설계와 MLOps/LLMOps 플랫폼 구축, Kubernetes 기반 인프라 운영 경험을 바탕으로 제품 안정성과 개발 효율성 모두를 높여온 전문가입니다.

### 핵심 역량

- **제품 개발 전 과정**: Django 기반 대규모 서비스 개발부터 MLOps·LLMOps 플랫폼 구축, 데이터 파이프라인 설계, Kubernetes 기반 인프라 운영까지 제품 개발 전 과정에 참여
- **Python 전문성**: Python을 주력으로 다양한 제품 개발에 참여하여 10년 이상의 실무 경험 보유
- **코드 품질**: 좋은 코드를 능숙하게 작성하기 위해 지속적으로 노력하며, Clean Code 원칙 준수
- **테스트 주도 개발**: TDD와 지속적인 리팩토링으로 안정적인 서비스를 구축하며, 팀 내 테스트 문화와 개발 프로세스 개선을 주도
- **AI Native Engineering**: AI Agent와 개발 워크플로우를 결합한 AI Native Engineering 환경을 구축하여 개발 생산성과 제품 품질을 함께 향상
- **Product Mindset**: 단순 이슈 해결이 아닌 비즈니스 요구사항을 이해하고, 다양한 직군과 협업하며 실제 사용자 가치를 만드는 제품 개발을 지향

## Tools

- **Keyboard:**
  - [Happy Hacking Professional HYBRID White](https://happyhackingkb.com/jp/products/hybrid/)
  - [Happy Hacking Professional HYBRID Type-S Snow White](https://happyhackingkb.com/jp/products/hybrid_types/)
  - [Keychron Q60 Pro Max](https://www.keychron.com/collections/keychron-q-max-series-keyboard/products/keychron-q60-max-qmk-via-wireless-custom-mechanical-keyboard)
- **IDE:**
  - [NvChad (NeoVim Wrapper)](https://nvchad.com/)
  - VSCode with VimMode

## Work Experience

### 총 경력

- {{ site.career_start_date | career_duration }}

### **데이터메이커** (2024.01 - 재직중, 2년 6개월)

정규직 | 팀장 | 백엔드 엔지니어

**Synapse DevOps** (2026.01 - 2026.06, 인프라 관리)

- Synapse 개발 및 운영을 위한 Kubernetes(K8S) 환경 운영 및 관리
- CloudNativePG(CNPG) 환경 지속 개선

**Synapse 백엔드 서버 개발** (2024.01 - 2026.06)

- Django 기반 백엔드 서버 피처 개발
- Django app/model 기반 권한 시스템으로 사용자 권한을 행 단위로 제어 가능하도록 개선
- Django View + Alpine JS + Tailwind CSS 를 통합한 백오피스 구현
- Django Channels 통합으로 Synapse Agent Job Log 스트리밍 기능 구현
- Django model relation 기반 RBAC로 리소스 단위 권한 기능 구현
- 사내 Synapse 관리자용 MCP 서버 구현 및 제공
- `#Django` `#Channels` `#AlpineJS`

**Synapse Plugin System 개발** (2025.01 - 2026.06)

- Ray 기반 에이전트에서 작동하는 플러그인 시스템 피처 개발
- 플러그인 시스템의 공통 기능을 제공하는 Synapse SDK 개발
- 100,000건 이상의 Ground Truth 데이터 임포트를 분산처리하여 소요시간 60% 이상 단축
- Dataset Import/Export 플러그인 설계 및 개발
- `#SDK` `#Pydantic`

**팀 내 TDD 문화 도입** (2024.01 - 2024.12)

- Synapse Django 백엔드 서버, SDK 등 전반에 걸쳐 TDD 문화 도입
- Clean Code, Continuous Integration 등 서적 소개를 통해 테스트케이스 필요성 전파
- Unit Test 부터 Integration Test 까지 기존 프로젝트에 테스트케이스 도입
- Feature 추가 시 지속적으로 발생하던 side effects 극적 감소
- 도입 6개월 후 커버리지 88% 달성
- `#TDD` `#DjangoUnitTest` `#Pytest`

**AI Native 전환** (2025.01 - 2025.10, 백엔드 파트장)

- Kent Beck의 CLAUDE.md를 참고하여 AI Agent가 TDD를 수행하도록 유도
- Notion 리뷰 DB 바탕으로 단계별 룰 파일 작성 및 코드 리뷰 활용 (코드 리뷰 소요시간 90% 이상 단축)
- SDD(Spec-Driven Development) 개발 문화 도입 및 Jira 통합
- 다양한 설계, 디자인 패턴 적용 결과를 빠르게 확인하여 최적의 선택이 가능해짐
- 팀 내 Harness Engineering 문화 도입
- `#ClaudeCode` `#Codex`

**Docs as Code 전환** (2025.01 - 2025.10, 백엔드 파트장)

- Notion에서 산발적으로 관리되던 개발 문서 통합
- Docusaurus를 백엔드 코드베이스에 통합하여 피처 개발 시 문서도 함께 업데이트할 수 있도록 함
- 문서 작성 접근성 개선을 통해 엔지니어가 활발하게 문서에 기여할 수 있게 됨
- `#Docusaurus`

### **딥네츄럴** (2020.09 - 2024.01, 3년 5개월)

정규직 | 백엔드 엔지니어

- LLMOps 서비스 Lave([lave.ai](https://lave.ai)) 백엔드 서버 개발
- 레이블러 플랫폼 성과측정 데이터 파이프라인 개발 (Terraform / AWS Firehose / SQS / Athena)
- 레이블러 엔터프라이즈(B2B) 백엔드 서버 개발
- 레이블러 플랫폼 백엔드 성능 개선 — AWS RDS Performance Insight 분석, Serverless 마이그레이션, SQS, read/write 라우팅으로 일 100만 건 트래픽 대응 (`#MSA` `#SQS` `#CQRS`)
- 레이블러 플랫폼 백엔드 서버 피처 개발

### **플랜아이** (2015.04 - 2020.09, 5년 6개월)

정규직 | 백엔드 엔지니어

- TechValue Jade 서비스(외주) 백엔드 서버 개발
- AIVORY 추천시스템 백엔드 서버 개발 (Bert 모델 연동)
- AIVORY 검색 솔루션 백엔드 개발 (ElasticSearch 기반)

## Education

### **충남대학교** — 국제무역과 석사 (수료)

2013.09 - 2015.08

### **충남대학교** — 국제무역과 학사 (졸업)

2004.03 - 2013.08

## Technical Skills

### 🐍 Programming Languages & Frameworks

| Level | Technology |
|-------|-----------|
| **Primary** | Python, Django, Django Channels, FastAPI, DRF (Django REST Framework) |
| **Secondary** | JavaScript, Alpine JS, Tailwind CSS, Java |

### 💾 Databases & Caching

| Technology | Type |
|-----------|------|
| MySQL, PostgreSQL | Relational Database |
| Redis | In-Memory Cache |
| Elasticsearch | Search Engine |

### ☁️ Cloud & Infrastructure

| Service | Technologies |
|---------|-------------|
| **AWS** | EC2, ECS, RDS, S3, SQS, Athena, Lambda, Firehose |
| **IaC** | Terraform |
| **Container & Orchestration** | Docker, Kubernetes (K8S), CloudNativePG (CNPG) |

### 🔧 DevOps & Tools

| Tool | Purpose |
|------|---------|
| Git, GitHub | Version Control |
| CI/CD | Continuous Integration/Deployment |
| Linux | Operating System |

### 🤖 AI/ML Related

| Technology | Description |
|-----------|-------------|
| Ray | Distributed Computing Framework |
| Pydantic | Data Validation |
| BERT | NLP Model |
| MLOps, LLMOps | AI Platform Operations |
| AI Model Serving | Model Deployment |

### 📐 Development Practices

| Practice | Description |
|----------|-------------|
| TDD | Test-Driven Development |
| Clean Code | Code Quality Standards |
| CQRS | Command Query Responsibility Segregation |
| MSA | Microservices Architecture |
| SDD | Spec-Driven Development |
| RBAC | Role-Based Access Control |
| API Design | RESTful API, OpenAPI |

### 🚀 AI Coding Tools

| Tool | Purpose |
|------|---------|
| Claude Code | AI-Powered IDE |
| Codex | AI Coding Agent |
| MCP | Model Context Protocol (Server) |
| Harness Engineering | AI Native Engineering Workflow |
| AI Pair Programming | AI-Assisted Development |

### 📝 Documentation

| Tool | Purpose |
|------|---------|
| Docusaurus | Documentation Site Generator |
| Docs as Code | Documentation Methodology |
| Markdown | Markup Language |

## Key Achievements Summary

- ✅ **테스트 커버리지 88% 달성** - TDD 문화 도입 6개월 만에 달성
- ✅ **데이터 처리 성능 60% 개선** - Ray 기반 분산처리 시스템 구축으로 100,000건 이상 데이터 처리 시간 단축
- ✅ **코드 리뷰 소요시간 90% 단축** - AI Coding Assistant 활용 및 자동화 도입
- ✅ **일 100만 건 트래픽 처리** - MSA, CQRS, Message Queue 등을 활용한 성능 최적화
- ✅ **Docs as Code 문화 정착** - Docusaurus 통합을 통한 문서화 활성화 및 접근성 개선
- ✅ **MLOps/LLMOps 플랫폼 구축** - 엔터프라이즈급 AI 플랫폼 백엔드 설계 및 구현 경험
- ✅ **Kubernetes 기반 인프라 운영** - Synapse 운영을 위한 K8S/CNPG 환경 구축 및 지속 개선
- ✅ **AI Native Engineering 도입** - AI Agent 기반 TDD·코드 리뷰 자동화 및 팀 내 Harness Engineering 문화 정착
