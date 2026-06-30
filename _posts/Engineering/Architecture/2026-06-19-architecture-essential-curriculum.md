---
layout: post
title: "Architecture Essential Curriculum"
date: 2026-06-19
categories: [Engineering, Architecture]
series: Architecture-Essential
tags: [engineering, curriculum, architecture, ddd, distributed-systems]
published: true
banner: wartable
excerpt: "소프트웨어 아키텍처를 4권의 고전 명저로 정복하는 마스터 로드맵입니다. 도메인 모델링부터 품질 속성, 분산 시스템, 아키텍트의 역할까지 4단계 도장깨기 방식으로 진행합니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="아키텍처 학습 여정을 네 단계의 오르막 계단으로 그린 그림. 가장 낮은 왼쪽 1단계는 Domain-Driven Design으로 도메인을 중심에 둔 모델을 뜻하는 동심원, 2단계는 Software Architecture in Practice로 품질 속성을 떠받치는 기둥들, 3단계는 Designing Data-Intensive Applications로 복제·분산된 데이터 노드들, 가장 높은 4단계는 The Software Architect Elevator로 기계실(코드)과 임원실(비즈니스)을 오르내리는 엘리베이터를 나타낸다. 네 단계는 기초·핵심·응용의 흐름으로 한 단씩 높아지며 점선 경로로 이어진다." viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg">
  <title>Architecture Essential — 4권 4단계 학습 여정(기초 도메인 사고 → 핵심 이론·분산 시스템 → 응용 아키텍트 역할)</title>

  <!-- ground line -->
  <line x1="24" y1="286" x2="656" y2="286" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- ascending dashed journey path -->
  <path d="M88,238 L208,196 L360,150 L548,96" fill="none" stroke="var(--secondary-color)" stroke-width="2.5" stroke-dasharray="5 5" opacity="0.7" marker-end="url(#arc-arrow)"/>

  <!-- band labels -->
  <text x="88" y="44" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor" opacity="0.7">기초</text>
  <text x="284" y="44" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor" opacity="0.7">핵심</text>
  <text x="548" y="44" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor" opacity="0.7">응용</text>
  <line x1="186" y1="38" x2="186" y2="270" stroke="currentColor" stroke-width="1" opacity="0.15"/>
  <line x1="452" y1="38" x2="452" y2="270" stroke="currentColor" stroke-width="1" opacity="0.15"/>

  <!-- ===== STAGE 1: Domain-Driven Design — concentric domain model ===== -->
  <rect x="34" y="240" width="108" height="46" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <circle cx="68" cy="218" r="20" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="2"/>
  <circle cx="68" cy="218" r="12" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.7"/>
  <circle cx="68" cy="218" r="4" fill="var(--accent-color)"/>
  <text x="88" y="259" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">1 · DDD</text>
  <text x="88" y="274" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">도메인 모델링</text>

  <!-- ===== STAGE 2: Software Architecture in Practice — quality-attribute pillars ===== -->
  <rect x="216" y="194" width="120" height="46" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <rect x="232" y="148" width="88" height="10" rx="2" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <rect x="240" y="158" width="8" height="34" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.6"/>
  <rect x="262" y="158" width="8" height="34" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.6"/>
  <rect x="284" y="158" width="8" height="34" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.6"/>
  <rect x="306" y="158" width="8" height="34" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.6"/>
  <text x="276" y="213" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">2 · SAIP</text>
  <text x="276" y="228" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">품질 속성 · 전술</text>

  <!-- ===== STAGE 3: Designing Data-Intensive Applications — replicated nodes ===== -->
  <rect x="364" y="148" width="116" height="46" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <circle cx="398" cy="112" r="11" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="2"/>
  <circle cx="446" cy="100" r="11" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.8"/>
  <circle cx="446" cy="124" r="11" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.8"/>
  <line x1="409" y1="108" x2="435" y2="102" stroke="var(--secondary-color)" stroke-width="1.6"/>
  <line x1="409" y1="116" x2="435" y2="122" stroke="var(--secondary-color)" stroke-width="1.6"/>
  <line x1="446" y1="111" x2="446" y2="113" stroke="var(--secondary-color)" stroke-width="1.6"/>
  <text x="422" y="167" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">3 · DDIA</text>
  <text x="422" y="182" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">분산 데이터</text>

  <!-- ===== STAGE 4: The Software Architect Elevator — shaft between floors ===== -->
  <rect x="494" y="94" width="116" height="46" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <rect x="528" y="40" width="48" height="50" rx="2" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <line x1="528" y1="65" x2="576" y2="65" stroke="currentColor" stroke-width="1" opacity="0.5"/>
  <text x="552" y="55" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.85">임원실</text>
  <text x="552" y="80" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.85">기계실</text>
  <rect x="544" y="48" width="16" height="34" rx="1.5" fill="none" stroke="var(--accent-color)" stroke-width="2"/>
  <path d="M552,52 L552,78 M547,57 L552,52 L557,57 M547,73 L552,78 L557,73" fill="none" stroke="var(--accent-color)" stroke-width="1.4"/>
  <text x="552" y="113" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">4 · Elevator</text>
  <text x="552" y="128" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">조직 · 리더십</text>

  <defs>
    <marker id="arc-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>4권으로 한 단씩 오르는 아키텍처 학습 여정 — <strong>기초</strong>는 도메인을 중심에 둔 모델링(1 · DDD), <strong>핵심</strong>은 품질 속성을 떠받치는 전술(2 · SAIP)과 복제·분산된 데이터 시스템(3 · DDIA), <strong>응용</strong>은 기계실(코드)과 임원실(비즈니스)을 오르내리는 아키텍트의 역할(4 · Elevator)이다.</figcaption>
</figure>

## 소개

소프트웨어 아키텍처는 단순히 "큰 그림을 그리는 일"이 아닙니다. 시스템의 변경 비용, 확장 가능성, 신뢰성, 그리고 팀이 함께 일하는 방식까지 결정하는, 코드보다 더 오래 살아남는 의사결정의 집합입니다. 기능은 언제든 다시 만들 수 있지만, 잘못된 아키텍처 결정은 수년간 조직 전체를 발목 잡습니다. 그래서 시니어로 성장하려는 엔지니어에게 아키텍처적 사고는 선택이 아니라 필수 역량입니다.

이 시리즈는 검증된 4권의 고전을 뼈대로 삼습니다. 도메인 중심 사고를 정립하는 Eric Evans의 *Domain-Driven Design*, 아키텍처를 학문으로 체계화한 Bass·Clements·Kazman의 *Software Architecture in Practice*, 현대 분산 데이터 시스템의 교과서인 Martin Kleppmann의 *Designing Data-Intensive Applications*, 그리고 기술과 조직을 잇는 아키텍트의 역할을 다룬 Gregor Hohpe의 *The Software Architect Elevator* 입니다. 각 책이 하나의 단계가 되어, 기초 → 핵심 → 응용으로 자연스럽게 이어집니다.

이 글은 `Architecture-Essential` 시리즈의 **마스터 로드맵**입니다. 각 단계의 핵심 항목을 정복할 때마다 체크박스를 채우고 상세 포스트를 연결하는 **도장깨기** 방식으로 진행하며, 학습이 진행될 때마다 진행률을 갱신합니다.

## 학습 흐름

4단계는 아래 순서대로 진행하는 것을 권장합니다. **기초**(도메인 중심 사고)로 문제 공간을 보는 눈을 기르고, **핵심**(아키텍처 이론·분산 시스템 실전)으로 설계 역량을 정복한 뒤, **응용**(아키텍트의 역할·소프트스킬)으로 기술과 조직을 잇는 단계로 마무리합니다.

```mermaid
flowchart TD
    Start([학습 시작]) --> S1

    subgraph FOUNDATION["기초 · 도메인 중심 사고"]
        S1["1단계<br/>Domain-Driven Design<br/>도메인 모델링"]
    end

    subgraph CORE["핵심 · 아키텍처 이론과 분산 시스템"]
        S2["2단계<br/>Software Architecture in Practice<br/>품질 속성 · 전술"]
        S3["3단계<br/>Designing Data-Intensive Applications<br/>분산 데이터 시스템"]
    end

    subgraph APPLY["응용 · 아키텍트의 역할"]
        S4["4단계<br/>The Software Architect Elevator<br/>조직과 기술 잇기"]
    end

    S1 --> S2 --> S3 --> S4
    S4 --> Done([시리즈 완주 🎉])
```

## 학습 진행 현황

> 완료한 항목에는 상세 포스트 링크가 연결됩니다. 학습이 진행될 때마다 체크박스와 진행률을 갱신합니다.

- 현재 완료한 항목: **21개**
- 전체 항목: **21개**
- 진행률: **100%** 🎉

## 1단계: Domain-Driven Design — 도메인 중심 사고

Eric Evans의 *Domain-Driven Design: Tackling Complexity in the Heart of Software* 는 소프트웨어의 복잡성이 기술이 아니라 **도메인**에 있다고 선언하며, 도메인을 코드로 옮기는 사고법을 정립한 책입니다. 모든 아키텍처 결정의 출발점인 "무엇을 만드는가"에 대한 언어와 모델을 다룹니다.

- [x] **유비쿼터스 언어 (Ubiquitous Language)**: 개발자와 도메인 전문가가 공유하는 단일 언어를 코드·대화·문서에 일관되게 사용 — [[상세](/2026/06/19/domain-driven-design.html)]
- [x] **도메인 모델 (Domain Model)**: 엔티티(Entity)·값 객체(Value Object)·애그리거트(Aggregate)로 도메인 지식을 구조화 — [[상세](/2026/06/19/domain-driven-design.html)]
- [x] **바운디드 컨텍스트 (Bounded Context)**: 모델이 유효한 경계를 명확히 긋고 컨텍스트 간 관계를 정의 — [[상세](/2026/06/19/domain-driven-design.html)]
- [x] **컨텍스트 맵 (Context Map)**: 여러 바운디드 컨텍스트의 통합 패턴(Shared Kernel, ACL 등)을 지도로 표현 — [[상세](/2026/06/19/domain-driven-design.html)]
- [x] **전술적 설계 (Tactical Design)**: Repository·Factory·Domain Service로 모델의 무결성을 유지 — [[상세](/2026/06/19/domain-driven-design.html)]

## 2단계: Software Architecture in Practice — 아키텍처 이론과 품질 속성

Bass·Clements·Kazman의 *Software Architecture in Practice, 4th ed.* 는 아키텍처를 직관이 아닌 **공학**으로 다룹니다. "좋은 아키텍처"를 측정 가능한 품질 속성으로 정의하고, 이를 달성하는 전술(Tactics)을 체계적으로 제시합니다.

- [x] **품질 속성 (Quality Attributes)**: 가용성·성능·보안·수정 가능성 등 비기능 요구사항을 1차 시민으로 다루기 — [[상세](/2026/06/19/software-architecture-in-practice.html)]
- [x] **품질 속성 시나리오 (QA Scenarios)**: 자극·응답·측정으로 요구사항을 정량적이고 검증 가능하게 기술 — [[상세](/2026/06/19/software-architecture-in-practice.html)]
- [x] **아키텍처 전술 (Tactics)**: 각 품질 속성을 달성하기 위한 설계 결정 카탈로그 활용 — [[상세](/2026/06/19/software-architecture-in-practice.html)]
- [x] **아키텍처 패턴 (Architectural Patterns)**: Layered·Microservices·Event-Driven 등 패턴과 전술의 관계 — [[상세](/2026/06/19/software-architecture-in-practice.html)]
- [x] **아키텍처 평가 (ATAM)**: 트레이드오프 분석으로 설계 위험을 조기에 식별하기 — [[상세](/2026/06/19/software-architecture-in-practice.html)]
- [x] **아키텍처 문서화 (Views & Beyond)**: 이해관계자별 관점(View)으로 아키텍처를 소통 가능하게 기록 — [[상세](/2026/06/19/software-architecture-in-practice.html)]

## 3단계: Designing Data-Intensive Applications — 분산 데이터 시스템 실전

Martin Kleppmann의 *Designing Data-Intensive Applications* 는 현대 백엔드 아키텍처의 핵심인 분산 데이터 시스템을 신뢰성·확장성·유지보수성이라는 세 축으로 꿰뚫습니다. 이론과 실제 시스템의 동작을 잇는 가장 실전적인 교과서입니다.

- [x] **세 가지 관심사**: 신뢰성(Reliability)·확장성(Scalability)·유지보수성(Maintainability)의 의미와 트레이드오프 — [[상세](/2026/06/19/designing-data-intensive-applications.html)]
- [x] **데이터 모델과 스토리지 엔진**: 관계형·문서·그래프 모델, LSM-Tree와 B-Tree의 차이 — [[상세](/2026/06/19/designing-data-intensive-applications.html)]
- [x] **복제와 파티셔닝 (Replication & Partitioning)**: 단일 리더·다중 리더·리더리스 복제와 샤딩 전략 — [[상세](/2026/06/19/designing-data-intensive-applications.html)]
- [x] **트랜잭션과 격리 수준 (Transactions)**: ACID의 실제 의미, 격리 수준과 동시성 이상 현상 — [[상세](/2026/06/19/designing-data-intensive-applications.html)]
- [x] **분산 시스템의 난제**: 부분 실패, 시계 문제, 합의(Consensus)와 CAP 정리 — [[상세](/2026/06/19/designing-data-intensive-applications.html)]
- [x] **배치와 스트림 처리 (Batch & Stream)**: 데이터 통합과 이벤트 기반 아키텍처의 기초 — [[상세](/2026/06/19/designing-data-intensive-applications.html)]

## 4단계: The Software Architect Elevator — 아키텍트의 역할과 소프트스킬

Gregor Hohpe의 *The Software Architect Elevator* 는 아키텍트가 임원실(비즈니스)과 기계실(코드) 사이의 "엘리베이터"를 오르내리며 양쪽을 잇는 존재임을 강조합니다. 기술 역량만으로는 채울 수 없는 아키텍트의 조직적·전략적 역할을 다룹니다.

- [x] **아키텍트 엘리베이터 (The Elevator)**: 비즈니스 전략과 기술 구현을 오가며 양쪽을 통역하는 역할 — [[상세](/2026/06/19/software-architect-elevator.html)]
- [x] **의사결정과 트레이드오프 소통**: 옵션을 제시하고 결정의 근거와 비용을 이해관계자에게 설명하기 — [[상세](/2026/06/19/software-architect-elevator.html)]
- [x] **조직과 아키텍처 (Conway의 법칙)**: 시스템 구조와 조직 구조의 상호작용을 설계에 반영 — [[상세](/2026/06/19/software-architect-elevator.html)]
- [x] **기술 리더십과 변화 주도**: 표준·플랫폼·문화를 통해 조직의 엔지니어링 수준을 끌어올리기 — [[상세](/2026/06/19/software-architect-elevator.html)]

## 핵심 포인트

- **순서가 곧 사고의 토대입니다**: 도메인을 먼저 이해(1단계)해야 무엇을 위한 아키텍처인지 알 수 있습니다. 문제 공간을 건너뛴 설계는 정교한 오답이 됩니다.
- **품질 속성으로 말하세요**: "좋은 아키텍처"는 모호한 직관이 아니라 가용성·성능·수정 가능성 같은 측정 가능한 목표로 정의되어야 합니다.
- **분산은 트레이드오프의 연속입니다**: 확장성을 얻으면 일관성·복잡성의 대가를 치릅니다. 정답이 아니라 합리적 선택을 찾는 훈련을 하세요.
- **아키텍처는 결국 사람의 일입니다**: 가장 우아한 설계도 조직이 받아들이지 못하면 무의미합니다. 소통과 리더십은 기술만큼 중요한 역량입니다.
- **모든 단계는 서로를 보강합니다**: DDD의 바운디드 컨텍스트는 분산 시스템의 서비스 경계로, 품질 속성은 아키텍트의 의사결정 근거로 이어집니다.

네 단계는 순서대로 쌓일 뿐 아니라, 한 단계의 개념이 다음 단계의 입력이 되며 서로를 보강합니다. 아래는 그 연결 고리를 한 장으로 옮긴 그림입니다.

```mermaid
flowchart LR
    S1["1단계 · DDD<br/>바운디드 컨텍스트"]
    S2["2단계 · SAIP<br/>품질 속성 · 전술"]
    S3["3단계 · DDIA<br/>분산 데이터 시스템"]
    S4["4단계 · Elevator<br/>아키텍트의 역할"]

    S1 -->|"컨텍스트 경계가<br/>서비스 경계로"| S3
    S2 -->|"품질 속성이<br/>설계 결정의 근거로"| S3
    S3 -->|"트레이드오프가<br/>의사결정 소통으로"| S4
    S2 -->|"품질 목표가<br/>이해관계자 언어로"| S4
    S1 -->|"도메인 언어가<br/>조직 소통의 토대로"| S4
```

## 추천 학습 순서

위에 제시한 1 → 2 → 3 → 4단계 순서를 권장합니다. 먼저 *Domain-Driven Design* 으로 "무엇을, 왜 만드는가"를 보는 도메인 중심 사고를 기릅니다. 이 토대가 있어야 이후의 설계 결정이 목적을 잃지 않습니다. 다음으로 *Software Architecture in Practice* 로 아키텍처를 품질 속성과 전술이라는 공학적 언어로 다루는 법을 익히고, 그 위에서 *Designing Data-Intensive Applications* 로 분산 데이터 시스템의 실전 트레이드오프를 체득합니다. 마지막으로 *The Software Architect Elevator* 로 기술 역량을 조직과 비즈니스에 연결하는 아키텍트의 소프트스킬을 완성합니다. 이론(2단계)과 실전(3단계)은 병행해도 좋지만, 도메인 사고(1단계)를 가장 먼저, 조직적 역할(4단계)을 가장 나중에 두는 흐름은 유지하길 권합니다.

## 결론

소프트웨어 아키텍처는 하루아침에 익힐 수 있는 기술이 아니라, 도메인을 읽는 눈·품질을 정의하는 언어·분산 시스템의 트레이드오프·조직을 움직이는 리더십이 겹겹이 쌓여 만들어지는 종합 역량입니다. 이 4권은 그 각각의 층을 단단히 다져 줄 검증된 안내서입니다.

이 커리큘럼을 나침반 삼아 한 단계씩 정복하고, 항목을 완료할 때마다 체크박스를 채우며 진행 상황을 시각적으로 확인해 보세요. 책을 읽는 데서 멈추지 말고, 실제 프로젝트의 경계를 다시 긋고 품질 시나리오를 작성하며 배운 것을 코드와 조직에 적용할 때 비로소 아키텍처적 사고가 체화됩니다.

### 다음 학습 (Next Learning)

- [OO-Design Essential Curriculum](/2026/06/19/oo-design-essential-curriculum.html) — 객체 설계 기초가 DDD·아키텍처의 토대
- [Process Essential Curriculum](/2026/06/19/process-essential-curriculum.html) — 아키텍처를 떠받치는 프로세스·요구사항
- [Testing-Refactoring Essential Curriculum](/2026/06/19/testing-refactoring-essential-curriculum.html) — 진화하는 아키텍처를 지키는 테스트·리팩터링
