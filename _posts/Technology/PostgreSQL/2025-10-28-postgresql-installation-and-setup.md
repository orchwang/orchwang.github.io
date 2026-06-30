---
layout: post
title: "PostgreSQL 설치 및 설정: 개발 환경 구축 가이드"
date: 2025-10-28
categories: [Technology, PostgreSQL]
series: PostgreSQL-Essential
tags: [postgresql, installation, setup, configuration]
published: true
excerpt: "PostgreSQL을 다양한 플랫폼에서 설치하고 설정하는 방법을 단계별로 학습합니다. 개발 환경 구축부터 기본 설정까지 다룹니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="PostgreSQL 개발 환경 구축을 한 장으로 묶은 그림. 왼쪽에는 macOS·Linux·Windows·Docker 네 플랫폼에서 설치가 시작되어 가운데의 PostgreSQL 서버(Postmaster 데몬)로 모인다. 가운데 서버 아래에는 postgresql.conf와 pg_hba.conf 두 설정 파일과 PGDATA 데이터 디렉토리가 놓여 있다. 오른쪽에서는 psql 커맨드라인 도구와 GUI 도구가 코끼리 모양의 서버에 접속해 데이터베이스를 다룬다." viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg">
  <title>PostgreSQL 설치·설정 — 플랫폼별 설치 → 서버(Postmaster) → 설정 파일·PGDATA → psql·GUI 접속</title>

  <!-- ===== LEFT: platforms ===== -->
  <text x="78" y="24" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">설치 플랫폼</text>
  <g font-size="9" font-weight="700">
    <rect x="20" y="44" width="116" height="30" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
    <text x="78" y="63" text-anchor="middle" fill="currentColor">macOS · Homebrew</text>
    <rect x="20" y="80" width="116" height="30" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
    <text x="78" y="99" text-anchor="middle" fill="currentColor">Linux · apt/dnf</text>
    <rect x="20" y="116" width="116" height="30" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
    <text x="78" y="135" text-anchor="middle" fill="currentColor">Windows · WSL2</text>
    <rect x="20" y="152" width="116" height="30" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.2"/>
    <text x="78" y="171" text-anchor="middle" fill="currentColor">Docker</text>
  </g>
  <!-- arrows into server -->
  <line x1="138" y1="59" x2="214" y2="104" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#pg-arrow)"/>
  <line x1="138" y1="95" x2="214" y2="110" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#pg-arrow)"/>
  <line x1="138" y1="131" x2="214" y2="120" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#pg-arrow)"/>
  <line x1="138" y1="167" x2="214" y2="126" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#pg-arrow)"/>

  <!-- ===== MIDDLE: server + config + PGDATA ===== -->
  <text x="320" y="24" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">PostgreSQL 서버</text>
  <!-- elephant-ish server core: rounded body + tusk hint -->
  <rect x="218" y="86" width="204" height="58" rx="6" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2.5"/>
  <circle cx="248" cy="108" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="334" y="110" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700">Postmaster (데몬)</text>
  <text x="334" y="127" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.8">Backend · WAL Writer · Autovacuum</text>
  <!-- config files -->
  <rect x="218" y="160" width="98" height="34" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="267" y="176" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700">postgresql.conf</text>
  <text x="267" y="188" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.8">메모리·연결·WAL</text>
  <rect x="324" y="160" width="98" height="34" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="373" y="176" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700">pg_hba.conf</text>
  <text x="373" y="188" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.8">클라이언트 인증</text>
  <!-- PGDATA -->
  <rect x="218" y="208" width="204" height="30" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="320" y="227" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">PGDATA · base / global / pg_wal</text>
  <line x1="320" y1="144" x2="320" y2="158" stroke="currentColor" stroke-width="1.6" opacity="0.6"/>
  <line x1="267" y1="194" x2="290" y2="206" stroke="currentColor" stroke-width="1.4" opacity="0.5"/>
  <line x1="373" y1="194" x2="350" y2="206" stroke="currentColor" stroke-width="1.4" opacity="0.5"/>

  <!-- ===== RIGHT: clients ===== -->
  <text x="568" y="24" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">접속 도구</text>
  <line x1="422" y1="104" x2="494" y2="74" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#pg-arrow)"/>
  <line x1="422" y1="120" x2="494" y2="150" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#pg-arrow)"/>
  <rect x="498" y="50" width="140" height="42" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.8"/>
  <text x="568" y="70" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">psql</text>
  <text x="568" y="84" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">커맨드라인 · 메타 명령</text>
  <rect x="498" y="128" width="140" height="42" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.8"/>
  <text x="568" y="148" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">pgAdmin · DBeaver</text>
  <text x="568" y="162" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">GUI 도구</text>
  <text x="568" y="200" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.7">:5432 로 접속</text>

  <defs>
    <marker id="pg-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>이 글의 한 장 요약 — 왼쪽 <strong>설치 플랫폼</strong>(macOS·Linux·Windows·Docker)에서 시작해 가운데 <strong>PostgreSQL 서버</strong>(Postmaster 데몬)로 모이고, 서버는 <strong>postgresql.conf·pg_hba.conf</strong> 설정 파일과 <strong>PGDATA</strong> 디렉토리로 떠받쳐진다. 오른쪽 <strong>접속 도구</strong>(psql·GUI)가 5432 포트로 서버에 연결해 데이터베이스를 다룬다.</figcaption>
</figure>

## 소개

PostgreSQL을 효과적으로 사용하기 위해서는 먼저 올바른 설치와 설정이 필요합니다. 이 가이드는 다양한 플랫폼(macOS, Linux, Windows)에서 PostgreSQL을 설치하고, 개발 환경을 구축하며, 기본적인 설정을 수행하는 방법을 다룹니다.

이 포스트를 마치면 로컬 개발 환경에서 PostgreSQL을 실행하고, 기본적인 데이터베이스 작업을 수행할 수 있게 됩니다.

<div class="post-summary-box" markdown="1">

### 📌 이 글에서 다루는 내용

#### 🔍 핵심 주제

- **PostgreSQL 설치**: macOS, Linux, Windows, Docker 환경에서의 설치 방법
- **아키텍처 이해**: PostgreSQL의 주요 구성 요소와 디렉토리 구조
- **기본 설정**: postgresql.conf와 pg_hba.conf 설정 방법
- **개발 환경 구축**: psql, GUI 도구, 초기 데이터베이스 설정

#### 🎯 주요 내용

1. **PostgreSQL 설치**

   - macOS: Homebrew, Postgres.app
   - Linux: Ubuntu/Debian, CentOS/RHEL
   - Windows: 공식 설치 프로그램, WSL2
   - Docker: 플랫폼 독립적 설치

2. **아키텍처와 구조**

   - 클라이언트-서버 모델
   - 주요 프로세스 (Postmaster, Backend, WAL Writer)
   - PGDATA 디렉토리 구조

3. **설정 파일 관리**

   - postgresql.conf: 메모리, 연결, WAL, 로깅 설정
   - pg_hba.conf: 클라이언트 인증 설정
   - 설정 변경 및 적용 방법

4. **개발 도구**

   - psql 커맨드라인 도구와 메타 명령어
   - GUI 도구: pgAdmin, DBeaver
   - 환경 변수와 .pgpass 파일 설정

5. **초기 설정 및 최적화**

   - 사용자 및 데이터베이스 생성
   - 시스템 메모리에 따른 성능 튜닝
   - 샘플 데이터베이스 설치

6. **문제 해결**
   - 연결 거부, 인증 실패, 포트 충돌 해결
   - 로그 확인 방법

#### 💡 학습 후 기대 효과

- 모든 주요 플랫폼에서 PostgreSQL 설치 가능
- 기본 설정 파일을 이해하고 수정 가능
- psql을 활용한 데이터베이스 관리
- 개발 환경 최적화 및 문제 해결 능력

</div>

## 한눈에 보기 — 설치부터 첫 접속까지의 흐름

세부로 들어가기 전에, 이 글이 따라가는 전체 길을 한 줄기로 그려 두면 각 절이 어디에 놓이는지가 분명해집니다. **설치 → (필요 시) 초기화 → 서비스 기동 → 접속 → 설정·인증 → 사용자·DB 생성**의 순서로 환경이 완성됩니다.

```mermaid
flowchart LR
    A["1. 설치<br/>(brew · apt/dnf · Docker)"] --> B{"initdb<br/>필요한가?"}
    B -->|"RHEL/수동 설치"| C["initdb<br/>PGDATA 생성"]
    B -->|"brew · apt · Docker<br/>(자동 초기화)"| D["서비스 기동<br/>systemctl / brew services"]
    C --> D
    D --> E["psql 접속<br/>:5432"]
    E --> F["설정·인증<br/>postgresql.conf · pg_hba.conf"]
    F --> G["사용자·DB 생성<br/>CREATE USER / CREATE DATABASE"]
    G --> H["개발 시작"]
```

## 1. PostgreSQL 설치

### 1.1 macOS에서 설치

**방법 1: Homebrew 사용 (권장)**

```bash
# Homebrew 설치 (이미 설치되어 있다면 건너뛰기)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# PostgreSQL 설치
brew install postgresql@16

# 서비스 시작
brew services start postgresql@16

# PATH 설정 (필요시)
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**방법 2: Postgres.app 사용**

1. [Postgres.app](https://postgresapp.com/) 다운로드
2. 애플리케이션 폴더로 이동
3. Postgres.app 실행
4. Initialize 버튼 클릭

**설치 확인:**

```bash
# PostgreSQL 버전 확인
psql --version

# PostgreSQL 서버 상태 확인
brew services list | grep postgresql
```

### 1.2 Linux에서 설치

**Ubuntu/Debian:**

```bash
# 패키지 목록 업데이트
sudo apt update

# PostgreSQL 설치
sudo apt install postgresql postgresql-contrib

# 서비스 시작 및 활성화
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 서비스 상태 확인
sudo systemctl status postgresql
```

**CentOS/RHEL/Rocky Linux:**

```bash
# PostgreSQL 공식 저장소 추가
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm

# PostgreSQL 16 설치
sudo dnf install -y postgresql16-server postgresql16-contrib

# 데이터베이스 초기화
sudo /usr/pgsql-16/bin/postgresql-16-setup initdb

# 서비스 시작 및 활성화
sudo systemctl start postgresql-16
sudo systemctl enable postgresql-16
```

### 1.3 Windows에서 설치

**방법 1: 공식 설치 프로그램 사용**

1. [PostgreSQL 다운로드 페이지](https://www.postgresql.org/download/windows/) 접속
2. EnterpriseDB 설치 프로그램 다운로드
3. 설치 프로그램 실행:
   - 설치 디렉토리 선택
   - 구성 요소 선택 (PostgreSQL Server, pgAdmin, Command Line Tools)
   - 데이터 디렉토리 선택
   - superuser(postgres) 비밀번호 설정
   - 포트 번호 설정 (기본값: 5432)
   - 로케일 선택

**방법 2: WSL2 사용 (개발자 권장)**

WSL2에서 Ubuntu를 사용하는 경우, Linux 설치 방법을 따릅니다.

### 1.4 Docker를 사용한 설치 (플랫폼 독립적)

```bash
# PostgreSQL 이미지 다운로드 및 실행
docker run --name postgres-dev \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  -d postgres:16

# 컨테이너 상태 확인
docker ps

# PostgreSQL 접속
docker exec -it postgres-dev psql -U myuser -d mydb
```

**Docker Compose 사용:**

```yaml
# docker-compose.yml
version: "3.8"

services:
  postgres:
    image: postgres:16
    container_name: postgres-dev
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  pgdata:
```

```bash
# 실행
docker-compose up -d

# 중지
docker-compose down
```

## 2. PostgreSQL 아키텍처 이해

### 2.1 주요 구성 요소

**클라이언트-서버 모델:**

- **Postmaster**: 메인 서버 프로세스 (데몬)
- **Backend Processes**: 각 클라이언트 연결마다 생성되는 프로세스
- **Shared Memory**: 프로세스 간 공유 메모리 영역
- **WAL Writer**: Write-Ahead Log를 디스크에 기록
- **Background Writer**: 더티 버퍼를 디스크에 기록
- **Checkpointer**: 체크포인트 수행
- **Autovacuum**: 자동으로 VACUUM 및 ANALYZE 수행

### 2.2 디렉토리 구조

**주요 디렉토리:**

```
PGDATA/
├── base/              # 데이터베이스 파일
├── global/            # 클러스터 전역 데이터
├── pg_wal/            # Write-Ahead Log 파일
├── pg_xact/           # 트랜잭션 커밋 상태
├── pg_stat/           # 통계 정보
├── pg_stat_tmp/       # 임시 통계 파일
├── postgresql.conf    # 메인 설정 파일
├── pg_hba.conf        # 클라이언트 인증 설정
└── pg_ident.conf      # 사용자 이름 매핑
```

**PGDATA 위치 확인:**

```sql
SHOW data_directory;
```

## 3. 기본 설정

### 3.1 설정 파일

**postgresql.conf (주요 설정)**

```conf
# 연결 설정
listen_addresses = 'localhost'    # 접속을 허용할 IP 주소
port = 5432                       # 포트 번호
max_connections = 100             # 최대 동시 연결 수

# 메모리 설정
shared_buffers = 256MB            # 공유 메모리 버퍼 크기
effective_cache_size = 1GB        # 사용 가능한 캐시 크기 추정치
work_mem = 4MB                    # 정렬/해시 작업용 메모리
maintenance_work_mem = 64MB       # VACUUM, CREATE INDEX용 메모리

# WAL 설정
wal_level = replica               # WAL 로깅 레벨
max_wal_size = 1GB               # WAL 최대 크기
min_wal_size = 80MB              # WAL 최소 크기

# 로깅 설정
logging_collector = on            # 로그 수집기 활성화
log_directory = 'log'             # 로그 디렉토리
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_statement = 'none'            # 로깅할 SQL 문 ('none', 'ddl', 'mod', 'all')
log_duration = off                # 각 쿼리 실행 시간 로깅
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '

# 자동 VACUUM
autovacuum = on                   # 자동 VACUUM 활성화
```

**설정 변경 방법:**

```bash
# 방법 1: 파일 직접 편집
sudo nano /var/lib/postgresql/data/postgresql.conf

# 방법 2: ALTER SYSTEM 명령 (PostgreSQL 9.4+)
psql -U postgres -c "ALTER SYSTEM SET shared_buffers = '512MB';"

# 설정 재로드 (재시작 불필요)
sudo systemctl reload postgresql

# 일부 설정은 재시작 필요
sudo systemctl restart postgresql
```

**현재 설정 확인:**

```sql
-- 특정 설정 확인
SHOW shared_buffers;
SHOW max_connections;

-- 모든 설정 확인
SELECT name, setting, unit, context
FROM pg_settings
WHERE name LIKE '%shared%';

-- 변경 가능 여부 확인 (context 컬럼)
-- postmaster: 재시작 필요
-- sighup: 재로드만 필요
-- user: 세션별 변경 가능
```

### 3.2 클라이언트 인증 설정 (pg_hba.conf)

**pg_hba.conf 구조:**

```conf
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# 로컬 연결 (Unix 소켓)
local   all             all                                     peer

# IPv4 로컬 연결
host    all             all             127.0.0.1/32            scram-sha-256

# IPv6 로컬 연결
host    all             all             ::1/128                 scram-sha-256

# 특정 네트워크에서의 연결 허용
host    mydb            myuser          192.168.1.0/24          scram-sha-256

# 모든 호스트에서의 연결 허용 (개발 환경만)
host    all             all             0.0.0.0/0               scram-sha-256
```

**인증 방법:**

- `trust`: 무조건 허용 (개발 환경만)
- `peer`: OS 사용자 이름과 일치 여부 확인 (로컬만)
- `scram-sha-256`: 암호화된 비밀번호 인증 (권장)
- `md5`: MD5 해시 비밀번호 (레거시)
- `password`: 평문 비밀번호 (사용 금지)

`pg_hba.conf`의 규칙은 **위에서 아래로 순서대로** 검사되며, 연결 요청의 (TYPE·DATABASE·USER·ADDRESS)에 **처음 일치한 한 줄**의 METHOD가 적용됩니다. 아래로 더 내려가지 않으므로 규칙의 순서가 곧 우선순위입니다.

<figure class="post-figure">
<svg role="img" aria-label="pg_hba.conf의 클라이언트 인증 매칭 흐름을 보여주는 그림. 왼쪽의 연결 요청(접속 유형·데이터베이스·사용자·주소)이 pg_hba.conf의 규칙 목록을 위에서 아래로 차례로 검사한다. 각 규칙에서 네 가지 조건이 모두 일치하면 그 줄의 인증 방법(peer, scram-sha-256 등)이 적용되어 인증 단계로 넘어가고, 일치하지 않으면 다음 규칙으로 내려간다. 끝까지 일치하는 규칙이 없으면 연결이 거부된다." viewBox="0 0 680 340" xmlns="http://www.w3.org/2000/svg">
  <title>pg_hba.conf 인증 매칭 — 연결 요청이 규칙을 위에서 아래로 검사해 처음 일치한 줄의 METHOD를 적용</title>

  <!-- LEFT: connection request -->
  <rect x="20" y="118" width="136" height="96" rx="4" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="2.2"/>
  <text x="88" y="140" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">연결 요청</text>
  <text x="88" y="160" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.85">TYPE (host/local)</text>
  <text x="88" y="175" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.85">DATABASE</text>
  <text x="88" y="190" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.85">USER</text>
  <text x="88" y="205" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.85">ADDRESS</text>
  <line x1="156" y1="166" x2="196" y2="166" stroke="var(--secondary-color)" stroke-width="2.5" marker-end="url(#hba-arrow)"/>

  <!-- MIDDLE: rule list, checked top to bottom -->
  <text x="330" y="28" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700" opacity="0.75">pg_hba.conf — 위에서 아래로 검사</text>
  <!-- rule 1 -->
  <rect x="200" y="44" width="260" height="36" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.6"/>
  <text x="214" y="66" text-anchor="start" font-size="8.5" fill="currentColor" font-family="monospace">local   all   all              peer</text>
  <text x="500" y="66" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8">불일치 ↓</text>
  <line x1="330" y1="80" x2="330" y2="96" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#hba-arrow)"/>
  <!-- rule 2 -->
  <rect x="200" y="98" width="260" height="36" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.6"/>
  <text x="214" y="120" text-anchor="start" font-size="8.5" fill="currentColor" font-family="monospace">host  all  all  127.0.0.1/32  scram</text>
  <text x="500" y="120" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8">불일치 ↓</text>
  <line x1="330" y1="134" x2="330" y2="150" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#hba-arrow)"/>
  <!-- rule 3 (match) -->
  <rect x="200" y="152" width="260" height="40" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2.6"/>
  <text x="214" y="170" text-anchor="start" font-size="8.5" fill="currentColor" font-family="monospace">host  mydb  myuser  192.168.../24</text>
  <text x="214" y="184" text-anchor="start" font-size="8.5" fill="currentColor" font-family="monospace" font-weight="700">          → scram-sha-256</text>
  <text x="500" y="176" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="700">일치!</text>
  <!-- arrow out to auth -->
  <line x1="460" y1="172" x2="512" y2="172" stroke="var(--secondary-color)" stroke-width="2.5" marker-end="url(#hba-arrow)"/>
  <!-- further rules skipped -->
  <rect x="200" y="208" width="260" height="30" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.2" opacity="0.45" stroke-dasharray="4 4"/>
  <text x="330" y="227" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6">이후 규칙은 검사하지 않음 (건너뜀)</text>

  <!-- RIGHT: apply METHOD -->
  <rect x="516" y="146" width="144" height="52" rx="4" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="2.2"/>
  <text x="588" y="168" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">METHOD 적용</text>
  <text x="588" y="184" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.85">scram-sha-256 인증</text>
  <line x1="588" y1="198" x2="588" y2="234" stroke="var(--secondary-color)" stroke-width="2.5" marker-end="url(#hba-arrow)"/>
  <rect x="524" y="238" width="128" height="32" rx="4" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="2"/>
  <text x="588" y="258" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="700">인증 성공 → 접속</text>

  <!-- no-match path -->
  <line x1="330" y1="238" x2="330" y2="290" stroke="currentColor" stroke-width="1.6" opacity="0.5" stroke-dasharray="4 4"/>
  <text x="330" y="284" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.7">끝까지 일치 없음</text>
  <rect x="248" y="294" width="164" height="30" rx="4" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.8"/>
  <text x="330" y="313" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="700">연결 거부 (rejected)</text>

  <defs>
    <marker id="hba-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>클라이언트 인증 매칭 흐름 — 연결 요청은 <strong>pg_hba.conf의 규칙을 위에서 아래로</strong> 검사하고, (TYPE·DATABASE·USER·ADDRESS) 네 조건이 모두 일치하는 <strong>첫 줄의 METHOD</strong>(예: scram-sha-256)가 적용된다. 일치하면 이후 규칙은 건너뛰며, 끝까지 일치하는 규칙이 없으면 연결이 거부된다. 그래서 규칙의 <strong>순서가 곧 우선순위</strong>다.</figcaption>
</figure>

**설정 변경 후 재로드:**

```bash
sudo systemctl reload postgresql
```

## 4. psql 커맨드라인 도구

### 4.1 psql 접속

```bash
# 기본 연결 (현재 OS 사용자로 연결)
psql

# 특정 사용자로 연결
psql -U postgres

# 특정 데이터베이스에 연결
psql -U myuser -d mydb

# 원격 서버 연결
psql -h hostname -p 5432 -U myuser -d mydb

# 연결 문자열 사용
psql "postgresql://myuser:mypassword@localhost:5432/mydb"
```

### 4.2 유용한 psql 명령어

**메타 명령어 (백슬래시 명령어):**

```sql
-- 데이터베이스 목록
\l
\list

-- 테이블 목록
\dt
\dt+  -- 상세 정보 포함

-- 테이블 구조 확인
\d table_name
\d+ table_name  -- 상세 정보 포함

-- 사용자/역할 목록
\du
\du+

-- 스키마 목록
\dn

-- 현재 데이터베이스 전환
\c database_name

-- SQL 파일 실행
\i /path/to/file.sql

-- 결과를 파일로 출력
\o output.txt
SELECT * FROM users;
\o  -- 출력 중지

-- 쿼리 실행 시간 표시
\timing on

-- 확장 출력 모드 (세로 방향)
\x auto

-- psql 종료
\q
```

**환경 설정:**

```bash
# ~/.psqlrc 파일 생성 (psql 시작 시 자동 실행)
\set PROMPT1 '%n@%/%R%# '
\set PROMPT2 '%n@%/%R%# '
\timing on
\x auto
\set VERBOSITY verbose
\set HISTFILE ~/.psql_history- :DBNAME
\set HISTCONTROL ignoredups
\pset null '(null)'
```

## 5. GUI 도구

### 5.1 pgAdmin 4

**설치:**

```bash
# macOS
brew install --cask pgadmin4

# Ubuntu
sudo apt install pgadmin4
```

**주요 기능:**

- 데이터베이스 관리 및 모니터링
- 쿼리 도구 (SQL 편집기)
- 테이블/뷰 생성 및 수정
- 백업 및 복원
- 서버 상태 모니터링

### 5.2 DBeaver

**설치:**

```bash
# macOS
brew install --cask dbeaver-community

# Ubuntu
sudo snap install dbeaver-ce
```

**장점:**

- 다양한 데이터베이스 지원
- ER 다이어그램 생성
- 데이터 편집기
- SQL 자동 완성
- 무료 및 오픈소스

### 5.3 기타 도구

- **DataGrip**: JetBrains 제품 (유료, 강력한 IDE)
- **Postico**: macOS 전용 (간결하고 사용하기 쉬움)
- **TablePlus**: macOS/Windows (현대적인 UI)

## 6. 초기 데이터베이스 설정

### 6.1 postgres 사용자 비밀번호 설정

```bash
# postgres 사용자로 전환 (Linux)
sudo -u postgres psql

# 비밀번호 변경
ALTER USER postgres WITH PASSWORD 'new_password';
```

### 6.2 새 사용자 및 데이터베이스 생성

```sql
-- 새 사용자 생성
CREATE USER myuser WITH PASSWORD 'mypassword';

-- 새 데이터베이스 생성
CREATE DATABASE mydb OWNER myuser;

-- 권한 부여
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;

-- 스키마 권한 부여 (PostgreSQL 15+)
\c mydb
GRANT ALL ON SCHEMA public TO myuser;
```

**bash로 한 번에 실행:**

```bash
# createuser 명령어 사용
createuser -U postgres -P myuser

# createdb 명령어 사용
createdb -U postgres -O myuser mydb
```

### 6.3 연결 테스트

```bash
# 새 사용자로 연결 테스트
psql -U myuser -d mydb

# SQL 쿼리 실행
psql -U myuser -d mydb -c "SELECT version();"
```

## 7. 개발 환경 설정

### 7.1 환경 변수 설정

```bash
# ~/.bashrc 또는 ~/.zshrc에 추가
export PGHOST=localhost
export PGPORT=5432
export PGUSER=myuser
export PGDATABASE=mydb
export PGPASSWORD=mypassword  # 보안상 권장하지 않음

# 적용
source ~/.zshrc
```

### 7.2 .pgpass 파일 (비밀번호 자동 입력)

```bash
# ~/.pgpass 파일 생성
echo "localhost:5432:mydb:myuser:mypassword" >> ~/.pgpass

# 권한 설정 (필수)
chmod 600 ~/.pgpass
```

**형식:**

```
hostname:port:database:username:password
```

**와일드카드 사용:**

```
localhost:*:*:myuser:mypassword
*:*:*:myuser:mypassword
```

### 7.3 샘플 데이터베이스 설치

**공식 샘플 데이터베이스 (dvdrental):**

```bash
# 샘플 데이터 다운로드
wget https://www.postgresqltutorial.com/wp-content/uploads/2019/05/dvdrental.zip
unzip dvdrental.zip

# 데이터베이스 생성 및 복원
createdb -U postgres dvdrental
pg_restore -U postgres -d dvdrental dvdrental.tar

# 확인
psql -U postgres -d dvdrental -c "\dt"
```

## 8. 성능 튜닝 기본

### 8.1 초기 메모리 설정

**시스템 메모리에 따른 권장 설정:**

```bash
# 시스템 메모리 확인 (Linux)
free -h

# 시스템 메모리 확인 (macOS)
sysctl hw.memsize
```

**4GB 메모리 시스템:**

```conf
shared_buffers = 1GB              # 시스템 메모리의 25%
effective_cache_size = 3GB        # 시스템 메모리의 50-75%
work_mem = 5MB
maintenance_work_mem = 256MB
```

**16GB 메모리 시스템:**

```conf
shared_buffers = 4GB
effective_cache_size = 12GB
work_mem = 10MB
maintenance_work_mem = 1GB
```

### 8.2 연결 설정

```conf
# 동시 연결 수 (메모리 소비 고려)
max_connections = 100

# 연결 풀링 사용 권장 (PgBouncer)
# max_connections를 낮추고 PgBouncer로 관리
```

## 9. 문제 해결

### 9.1 일반적인 문제

**문제 1: 연결 거부**

```
psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: No such file or directory
```

**해결:**

```bash
# PostgreSQL 서비스 시작 확인
sudo systemctl status postgresql

# 서비스 시작
sudo systemctl start postgresql
```

**문제 2: 인증 실패**

```
psql: error: FATAL:  Peer authentication failed for user "myuser"
```

**해결:**

```bash
# pg_hba.conf 확인 및 수정
sudo nano /etc/postgresql/16/main/pg_hba.conf

# peer를 md5 또는 scram-sha-256로 변경
local   all    all    scram-sha-256

# 재로드
sudo systemctl reload postgresql
```

**문제 3: 포트 충돌**

```
FATAL:  could not create lock file "/var/run/postgresql/.s.PGSQL.5432.lock": Permission denied
```

**해결:**

```bash
# 다른 프로세스가 포트 사용 중인지 확인
sudo lsof -i :5432

# PostgreSQL 재시작
sudo systemctl restart postgresql
```

### 9.2 로그 확인

```bash
# 로그 위치 확인
psql -U postgres -c "SHOW log_directory;"

# 로그 보기 (Ubuntu)
sudo tail -f /var/log/postgresql/postgresql-16-main.log

# 로그 보기 (Homebrew macOS)
tail -f /opt/homebrew/var/log/postgresql@16.log
```

## 핵심 포인트

- **올바른 설치 방법 선택**: 각 플랫폼에 맞는 설치 방법을 사용하세요
- **Docker 활용**: 개발 환경에서는 Docker를 사용하면 격리된 환경을 쉽게 구축할 수 있습니다
- **설정 파일 이해**: postgresql.conf와 pg_hba.conf의 역할과 주요 설정을 이해하세요
- **psql 숙달**: 커맨드라인 도구에 익숙해지면 생산성이 크게 향상됩니다
- **적절한 메모리 설정**: 시스템 메모리에 맞는 초기 설정을 수행하세요
- **보안 설정**: pg_hba.conf를 적절히 설정하여 인증을 관리하세요
- **로그 모니터링**: 문제 해결을 위해 로그 위치와 확인 방법을 알아두세요

## 결론

PostgreSQL을 올바르게 설치하고 설정하는 것은 데이터베이스 학습과 개발의 첫걸음입니다. 이 가이드를 통해 로컬 개발 환경을 구축하고, 기본적인 설정을 이해하며, 문제 해결 방법을 익혔습니다.

이제 PostgreSQL이 정상적으로 실행되고 있다면, SQL 쿼리 작성, 데이터베이스 설계, 성능 최적화 등의 다음 단계로 진행할 준비가 되었습니다. 설정 파일과 psql 명령어에 익숙해지는 것이 앞으로의 학습에 큰 도움이 될 것입니다.

### 다음 학습

- [PostgreSQL 아키텍처 심층 분석](#) - PostgreSQL 내부 동작 원리 이해하기
- [SQL 기초: DDL과 DML](#) - 데이터 정의 및 조작 언어 마스터하기
- [PostgreSQL 사용자 및 권한 관리](#) - 역할과 권한 체계 이해하기
- [psql 고급 사용법](#) - 생산성을 높이는 psql 팁과 트릭
