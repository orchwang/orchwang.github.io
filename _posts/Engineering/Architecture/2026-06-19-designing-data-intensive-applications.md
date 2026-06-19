---
layout: post
title: "Designing Data-Intensive Applications: 분산 데이터 시스템 (신뢰성·확장성·유지보수성)"
date: 2026-06-19 00:03:00
categories: [Engineering, Architecture]
tags: [engineering, architecture, distributed-systems, databases]
series: Architecture-Essential
published: true
excerpt: "Martin Kleppmann의 DDIA로 신뢰성·확장성·유지보수성을 출발점 삼아 스토리지 엔진, 복제·파티셔닝, 트랜잭션 격리, 합의·CAP, 그리고 배치·스트림 처리까지 분산 데이터 시스템의 핵심 트레이드오프를 정리합니다."
---

## 들어가며

이 글은 `Architecture-Essential` 시리즈의 **3단계**입니다. 전체 흐름은 [Architecture Essential Curriculum](/2026/06/19/architecture-essential-curriculum.html)에서 확인할 수 있습니다.

2단계 [Software Architecture in Practice: 품질 속성의 공학](/2026/06/19/software-architecture-in-practice.html)에서는 availability, scalability, performance 같은 품질 속성을 "측정 가능한 시나리오"로 다루는 법을 배웠습니다. 다만 그 단계는 다소 추상적이었습니다. "availability 99.99%를 만족하라"는 요구가 실제 시스템에서 무엇을 의미하는지 — 복제본을 몇 개 두고, 리더가 죽으면 누가 어떻게 승격하며, 그 사이 클라이언트가 보는 데이터는 일관적인지 — 는 데이터 계층의 구체적인 메커니즘을 알아야 답할 수 있습니다.

Martin Kleppmann의 *Designing Data-Intensive Applications*(이하 DDIA)는 바로 그 다리를 놓는 책입니다. 데이터베이스 내부 이론(스토리지 엔진, 트랜잭션, 합의 알고리즘)을 PostgreSQL·Cassandra·Kafka·ZooKeeper 같은 **실제 시스템**과 연결해 설명하기 때문에, 현대 백엔드 엔지니어의 정전(canon)으로 불립니다. 이 단계의 목표는 책을 요약하는 것이 아니라, 분산 데이터 시스템을 설계할 때 반복적으로 마주치는 **트레이드오프의 구조**를 손에 익히는 것입니다.

이 기술적 깊이를 갖추고 나면, 4단계 [The Software Architect Elevator: 아키텍트의 역할](/2026/06/19/software-architect-elevator.html)에서는 시선을 조직으로 돌립니다. 기술 판단을 조직의 의사결정으로 번역하는 일이 아키텍트의 본업이기 때문입니다.

<div class="post-summary-box" markdown="1">

### 📌 이 글에서 다루는 내용

#### 🔍 핵심 주제

- **세 가지 관심사**: 신뢰성·확장성·유지보수성의 의미와 서로 맞물린 트레이드오프
- **데이터 모델과 스토리지 엔진**: 관계형·문서·그래프 모델, LSM-Tree와 B-Tree의 구조적 차이
- **복제와 파티셔닝**: 단일 리더·다중 리더·리더리스 복제와 샤딩 전략의 선택 기준
- **트랜잭션과 격리 수준**: ACID의 실제 의미, 격리 수준별로 허용되는 동시성 이상 현상
- **분산 시스템의 난제**: 부분 실패, 신뢰할 수 없는 시계, 합의(Consensus)와 CAP 정리의 한계
- **배치와 스트림 처리**: 데이터 통합과 이벤트 기반 아키텍처의 기초

</div>

## 세 가지 관심사: Reliability, Scalability, Maintainability

왜 이 셋부터 시작할까요? 데이터 집약적 시스템의 "좋음"은 단일 지표로 잡히지 않기 때문입니다. DDIA는 모든 설계 판단을 이 세 축 위에서 본다는 공통 언어를 먼저 깝니다.

- **Reliability(신뢰성)**: 하드웨어 결함, 소프트웨어 버그, 사람의 실수가 있어도 시스템이 기대대로 동작하는 것. 핵심은 "결함(fault)은 일어난다"를 전제하고 **fault-tolerant**하게 만드는 것입니다. 결함이 시스템 전체 장애(failure)로 번지지 않게 격리합니다.
- **Scalability(확장성)**: 부하가 늘어도 성능을 유지하는 능력. 여기서 중요한 것은 부하와 성능을 **숫자로 기술**하는 것입니다. 평균 응답시간이 아니라 p95·p99 같은 백분위(percentile)로 봐야 tail latency가 드러납니다.
- **Maintainability(유지보수성)**: operability(운영 편의), simplicity(우발적 복잡도 제거), evolvability(변경 용이성). 시스템의 비용 대부분은 초기 개발이 아니라 **지속적 유지보수**에서 발생합니다.

트레이드오프는 명확합니다. 신뢰성을 위해 복제본을 늘리면 일관성 유지 비용과 운영 복잡도가 오르고(유지보수성 ↓), 확장을 위해 파티셔닝하면 트랜잭션 경계가 깨지며 신뢰성 보장이 어려워집니다. 2단계의 품질 속성 트레이드오프가 데이터 계층에서 구체적 형태로 나타나는 셈입니다.

## 데이터 모델과 스토리지 엔진

### 데이터 모델: 관계형 · 문서 · 그래프

왜 모델이 여럿일까요? 데이터 간 관계의 형태가 다르기 때문입니다. 모델 선택은 "내 데이터의 관계가 어떤 모양인가"라는 질문에 대한 답입니다.

| 모델 | 강점 | 약점 | 잘 맞는 형태 |
|---|---|---|---|
| 관계형(Relational) | 다대다(join) 처리, 강한 스키마 | 객체-관계 임피던스 불일치 | 정규화된 정형 데이터 |
| 문서(Document) | locality, 스키마 유연성 | join 취약, 깊은 중첩 갱신 비용 | 트리형 1:N, 자기완결 문서 |
| 그래프(Graph) | 복잡한 다대다, 가변 깊이 탐색 | 운영·쿼리 학습 곡선 | 소셜 그래프, 추천, 경로 |

문서 모델은 "schema-on-read", 관계형은 대체로 "schema-on-write"입니다. 데이터가 강하게 연결될수록 관계형/그래프가, 자기완결적 트리일수록 문서가 유리합니다.

### 스토리지 엔진: LSM-Tree vs B-Tree

모델 아래에는 디스크에 어떻게 읽고 쓰는지를 결정하는 스토리지 엔진이 있습니다. 두 계열의 차이는 **쓰기를 어디에 어떻게 쌓는가**에서 갈립니다.

| 구분 | LSM-Tree | B-Tree |
|---|---|---|
| 쓰기 방식 | append-only 로그 → SSTable, 백그라운드 compaction | 고정 크기 페이지 in-place 갱신 |
| 쓰기 성능 | 순차 쓰기로 높은 throughput | 페이지당 random write, WAL 동반 |
| 읽기 성능 | 여러 SSTable 탐색(블룸필터로 완화) | 페이지 추적으로 예측 가능 |
| 쓰기 증폭 | compaction 비용, 변동성 있음 | WAL + 페이지 쓰기로 상대적 안정 |
| 공간 효율 | 압축 좋음, 단편화 적음 | 페이지 단편화 가능 |
| 대표 사례 | RocksDB, Cassandra, LevelDB | PostgreSQL, MySQL(InnoDB) |

```sql
-- B-Tree: 인덱스 페이지를 제자리에서 갱신 (random I/O)
UPDATE accounts SET balance = balance - 100 WHERE id = 42;

-- LSM-Tree: 갱신도 새 키-값을 로그에 append, 이후 compaction이 옛 값을 정리
-- → 쓰기는 순차적이지만 읽기 시 여러 세그먼트를 병합 조회
```

규칙처럼 외울 점: **쓰기가 많으면 LSM, 읽기가 많고 예측 가능한 지연이 중요하면 B-Tree**가 기본 출발점입니다. 다만 compaction 튜닝(LSM)이나 페이지 분할 비용(B-Tree)처럼 운영상의 함정은 각자 다릅니다.

## 복제와 파티셔닝

### 복제(Replication): 같은 데이터를 여러 노드에

복제는 availability(노드가 죽어도 서비스 지속), latency(사용자 근처에서 읽기), read scalability를 위해 합니다. 핵심 트레이드오프는 **쓰기를 어디서 받느냐**입니다.

```mermaid
flowchart LR
  C["클라이언트<br/>writes"] --> L["Leader<br/>(쓰기 수용)"]
  L -->|"복제 로그"| F1["Follower 1<br/>(읽기 전용)"]
  L -->|"복제 로그"| F2["Follower 2<br/>(읽기 전용)"]
  R["클라이언트<br/>reads"] --> F1
  R --> F2
```

| 방식 | 쓰기 처리 | 장점 | 대가 |
|---|---|---|---|
| 단일 리더(Single-leader) | 리더 한 곳만 | 쓰기 충돌 없음, 단순 | 리더 장애 시 failover, 쓰기 SPOF |
| 다중 리더(Multi-leader) | 여러 리더 | 멀티 DC, 오프라인 쓰기 | 쓰기 충돌 → conflict resolution 필요 |
| 리더리스(Leaderless) | 모든 복제본 | 높은 가용성, 무중단 | quorum 읽기/쓰기, read repair, 최종 일관성 |

복제는 동기/비동기 선택도 따라옵니다. 동기 복제는 강한 내구성을 주지만 한 노드만 느려도 전체 쓰기가 막힙니다. 그래서 현실은 보통 **반동기(semi-synchronous)** — 한두 개 follower만 동기로 둡니다. 비동기 복제에서는 복제 지연(replication lag)으로 "내가 방금 쓴 글이 안 보이는" read-your-writes 위반이 생기므로, 읽기 일관성 보장이 별도 과제가 됩니다.

리더리스(Dynamo 계열)에서는 `w + r > n` quorum 조건으로 일관성을 노립니다. n개 복제본 중 쓰기 w개, 읽기 r개의 응답을 요구하면 겹치는 노드가 최신값을 보장하지만, 동시 쓰기 충돌은 버전 벡터(version vector)로 감지하고 애플리케이션이 병합해야 합니다.

### 파티셔닝(Partitioning/Sharding): 데이터를 쪼개기

복제는 같은 데이터를 여러 곳에, 파티셔닝은 **다른 데이터를** 여러 곳에 둡니다. 단일 노드 용량과 처리량의 한계를 넘기 위해서입니다.

```mermaid
flowchart TB
  subgraph 파티셔닝["키 공간을 분할"]
    P0["Partition 0<br/>key a–h"]
    P1["Partition 1<br/>key i–p"]
    P2["Partition 2<br/>key q–z"]
  end
  Req["요청"] --> Router["라우팅<br/>(키→파티션)"]
  Router --> P0
  Router --> P1
  Router --> P2
```

샤딩 전략은 두 갈래입니다.

- **키 범위(range) 분할**: 범위 스캔에 유리하지만, 특정 구간에 쓰기가 몰리면 hot spot이 생깁니다(예: 타임스탬프 키).
- **해시(hash) 분할**: 부하를 고르게 흩뿌리지만 범위 스캔을 잃습니다. 노드 증감 시 재배치를 줄이려 consistent hashing을 씁니다.

여기에 **rebalancing**(노드 추가/제거 시 데이터 이동)과 **secondary index**(문서 기준 vs 텀 기준) 설계가 따라옵니다. 핵심은 hot spot 회피와 scatter/gather 비용 사이의 균형입니다.

## 트랜잭션과 격리 수준

### ACID의 실제 의미

트랜잭션은 "여러 읽기·쓰기를 하나의 논리 단위로 묶어 부분 실패를 감춰주는" 추상화입니다. ACID는 마케팅에 닳은 단어지만, 실제로는 다음을 뜻합니다.

- **Atomicity**: 부분 실패가 없음 — 전부 반영되거나 전부 취소(abort). "동시성"이 아니라 "중단 가능성"에 관한 것입니다.
- **Consistency**: 애플리케이션이 정의한 불변식 유지 — 사실상 DB가 아니라 앱의 책임.
- **Isolation**: 동시 실행 트랜잭션이 서로를 간섭하지 않는 정도. 현실에선 직렬화(serializable)가 비싸서 **격리 수준**으로 타협합니다.
- **Durability**: 커밋된 데이터는 손실되지 않음 — WAL과 복제로 보장.

### 격리 수준과 동시성 이상 현상

왜 격리에 "수준"이 있을까요? 완전한 직렬성은 비싸기 때문입니다. 약한 격리는 성능을 얻는 대신 특정 이상 현상을 허용합니다.

| 격리 수준 | dirty read | non-repeatable read | phantom | lost update | write skew |
|---|---|---|---|---|---|
| Read Committed | 방지 | 허용 | 허용 | 허용 | 허용 |
| Snapshot/Repeatable Read | 방지 | 방지 | 대체로 방지 | 구현 따라 | 허용 |
| Serializable | 방지 | 방지 | 방지 | 방지 | 방지 |

대표적인 두 함정을 코드로 보겠습니다.

```sql
-- Lost update: 두 트랜잭션이 같은 값을 읽고 각자 갱신 → 한쪽이 사라짐
-- T1, T2 모두 balance=100을 읽고 +50 → 결과가 200이 아닌 150이 될 수 있음
-- 해결: 원자적 갱신 또는 SELECT ... FOR UPDATE
UPDATE accounts SET balance = balance + 50 WHERE id = 1;  -- atomic, 안전
```

```sql
-- Write skew: 각자 다른 행을 보고 결정하지만, 합쳐진 불변식이 깨짐
-- 규칙: "최소 1명의 의사는 on-call이어야 한다"
-- T1, T2가 각각 "다른 의사가 on-call이니 나는 빠져도 돼"라고 판단 → 둘 다 빠짐
-- 스냅샷 격리로도 못 막음 → Serializable(SSI) 또는 명시적 락 필요
```

규칙처럼 기억할 점: **lost update는 같은 객체, write skew는 여러 객체에 걸친 불변식**입니다. 분산 환경에서는 직렬성 보장 비용이 더 커지므로(2PC 등), 어떤 이상까지 감수할지를 의식적으로 선택해야 합니다.

## 분산 시스템의 난제

단일 노드의 직관은 분산에서 깨집니다. DDIA는 "분산 시스템에서 잘못될 수 있는 모든 것은 잘못된다"는 비관을 기본자세로 가르칩니다.

### 부분 실패(Partial Failure)와 신뢰할 수 없는 시계

- **부분 실패**: 일부 노드만 죽거나, 네트워크가 메시지를 잃거나 지연시키거나 순서를 뒤바꿉니다. 결정적으로, "노드가 죽었는지 느린 건지" 구별할 수 없습니다. 타임아웃은 추측일 뿐이며, 이로부터 합의의 어려움이 시작됩니다.
- **시계 문제**: time-of-day clock은 NTP 동기화로 뒤로 점프할 수 있어 순서 판단에 위험합니다. "last write wins"를 wall clock으로 구현하면 시계 오차로 쓰기가 조용히 소실됩니다. 경과 시간 측정엔 monotonic clock을, 인과 순서엔 논리 시계/버전 벡터를 써야 합니다.
- **프로세스 일시정지**: GC stop-the-world나 VM 마이그레이션이 노드를 수 초간 멈출 수 있어, "리더라고 믿는 동안 이미 리더가 아닌" 상황이 생깁니다 → fencing token으로 방어.

### 합의(Consensus)

여러 노드가 하나의 값에 **동의**하게 만드는 것이 합의입니다. 리더 선출, 분산 락, 멤버십, 원자적 커밋이 모두 합의로 환원됩니다. Paxos·Raft·ZAB 같은 알고리즘은 quorum 기반 투표로 "split-brain 없이 단 하나의 결정"을 보장합니다. 현실에서는 ZooKeeper·etcd가 이 어려움을 캡슐화해 제공하므로, 직접 구현하기보다 빌려 쓰는 것이 정석입니다.

### CAP 정리 — 그리고 그 한계

CAP는 흔히 "Consistency, Availability, Partition tolerance 중 둘만"으로 알려졌지만, 이 요약은 오해를 부릅니다. 정확히는 **네트워크 분단(P)이 발생한 순간, 강한 일관성(linearizability)과 가용성 중 하나를 포기해야 한다**는 정리입니다.

- 분단은 선택지가 아니라 현실이므로 "P를 버린다"는 실제로 불가능합니다.
- 여기서 C는 linearizability라는 **매우 좁은** 정의이며, A도 "모든 비장애 노드가 응답"이라는 엄격한 정의입니다.
- 따라서 CAP는 다양한 일관성 모델(causal, read-your-writes 등)이나 latency 트레이드오프를 설명하지 못합니다. 이 한계 때문에 **PACELC**(분단 시 A/C, 그렇지 않을 때 Latency/Consistency)가 보완 모델로 제시됩니다.

규칙처럼 기억할 점: CAP은 슬로건이 아니라 좁은 정리입니다. "우리 DB는 CP/AP"라는 라벨에 기대지 말고, **어떤 일관성 보장을, 어떤 장애 상황에서** 제공하는지를 구체적으로 물어야 합니다.

## 배치와 스트림 처리

데이터는 한 시스템에 머물지 않습니다. 검색 인덱스, 분석 웨어하우스, 캐시, 추천 모델로 끊임없이 흘러야 하고, 이 **데이터 통합(data integration)** 문제가 마지막 주제입니다.

```mermaid
flowchart LR
  S["원천 DB<br/>(변경 발생)"] -->|"CDC / 이벤트 로그"| K["로그/메시지<br/>브로커"]
  K --> A["검색 인덱스"]
  K --> B["분석 웨어하우스"]
  K --> D["캐시 / 파생 뷰"]
```

| 구분 | 배치(Batch) | 스트림(Stream) |
|---|---|---|
| 입력 | 유한, 경계 있음 | 무한, 끝없이 도착 |
| 지연 | 분~시간 | 초~밀리초 |
| 모델 | MapReduce, 데이터플로 | 이벤트 스트림, 윈도우 |
| 사례 | Hadoop, Spark | Kafka Streams, Flink |
| 재처리 | 입력 재실행 용이 | 로그 재생(replay)으로 |

핵심 통찰은 **로그(append-only event log)를 진실의 원천으로 삼는 것**입니다. 데이터베이스의 변경을 이벤트로 포착(CDC, change data capture)하면, 모든 파생 데이터(인덱스·캐시·뷰)는 이 이벤트 로그를 결정적으로 재생해 만들어지는 함수가 됩니다. 이것이 event sourcing과 이벤트 기반 아키텍처의 기초입니다. 배치와 스트림은 대립이 아니라 "유한 vs 무한 입력"의 차이일 뿐이며, 같은 데이터플로 사고로 통합됩니다.

## 마무리

DDIA는 분산 데이터 시스템을 **세 관심사(신뢰성·확장성·유지보수성)** 위에서 바라보고, 모든 메커니즘을 트레이드오프로 환원합니다. 스토리지 엔진은 LSM(쓰기 친화)과 B-Tree(읽기 예측성)의 선택이고, 복제는 단일/다중/리더리스 사이에서 충돌 처리 비용과 가용성을 저울질하며, 파티셔닝은 hot spot과 scatter/gather를 균형 잡는 일입니다. 트랜잭션 격리는 직렬성 비용을 줄이는 대신 lost update·write skew 같은 이상을 의식적으로 허용·차단하는 결정이고, 분산의 난제(부분 실패·시계·합의)는 CAP의 좁은 정리 너머로 일관성과 가용성을 구체적으로 명세하게 만듭니다. 마지막으로 배치/스트림은 이벤트 로그를 진실의 원천으로 삼아 파생 데이터를 통합하는 사고를 줍니다.

여기까지가 분산 데이터 시스템의 **기술적 깊이**입니다. 그런데 현실의 아키텍트는 이 판단을 혼자 내리지 않습니다. "어떤 일관성을 포기할 것인가"는 결국 조직이 어떤 위험을 감수할지에 대한 합의이기도 합니다. 다음 4단계에서는 이 기술 판단을 조직의 언어로 번역하고, 경영진과 엔지니어 사이를 오르내리는 아키텍트의 **조직적 역할**로 시선을 옮깁니다.

### 다음 학습

- [Architecture Essential Curriculum](/2026/06/19/architecture-essential-curriculum.html) — 전체 로드맵과 진행 현황
- (다시 보기) [Software Architecture in Practice: 품질 속성의 공학](/2026/06/19/software-architecture-in-practice.html) — DDIA가 구체화한 availability·scalability의 출발점
- (다음 단계) [The Software Architect Elevator: 아키텍트의 역할](/2026/06/19/software-architect-elevator.html) — 기술 깊이에서 조직적 역할로
