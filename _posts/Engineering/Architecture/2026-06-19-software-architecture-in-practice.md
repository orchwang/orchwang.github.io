---
layout: post
title: "Software Architecture in Practice: 품질 속성의 공학 (QA 시나리오·전술·ATAM)"
date: 2026-06-19 00:02:00
categories: [Engineering, Architecture]
tags: [engineering, architecture, quality-attributes, atam]
series: Architecture-Essential
published: true
excerpt: "아키텍처를 측정 가능한 품질 속성으로 다루는 공학 방법론. QA 시나리오 6요소, 전술 카탈로그, ATAM 평가, Views & Beyond 문서화를 정리합니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="품질 속성 중심 아키텍처 공학을 한 장으로 묶은 그림. 왼쪽에는 가용성·성능·보안·수정 가능성이라는 네 개의 품질 속성 기둥이 서 있고, 각 기둥은 QA 시나리오로 측정 가능하게 정량화된다. 가운데에서는 전술 카탈로그가 톱니바퀴처럼 맞물려 그 품질 속성들을 떠받친다. 오른쪽 위에서는 ATAM 평가의 저울이 트레이드오프를 가늠하고, 오른쪽 아래에서는 Views 문서가 세 겹의 관점으로 설계를 기록한다." viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg">
  <title>Software Architecture in Practice — 품질 속성(기둥) · QA 시나리오(측정) · 전술(톱니) · ATAM(저울) · Views(문서)</title>

  <!-- ===== LEFT: four quality-attribute pillars on a measured baseline ===== -->
  <text x="116" y="22" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">품질 속성 (기둥)</text>
  <!-- baseline = QA scenario measurement -->
  <line x1="28" y1="220" x2="208" y2="220" stroke="var(--accent-color)" stroke-width="2.5"/>
  <text x="118" y="236" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="700">QA 시나리오로 측정 (자극→응답→측정값)</text>
  <!-- pillar: availability -->
  <rect x="32" y="96" width="36" height="124" rx="2" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="50" y="160" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700" transform="rotate(-90 50 160)">가용성</text>
  <!-- pillar: performance -->
  <rect x="76" y="76" width="36" height="144" rx="2" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.2"/>
  <text x="94" y="150" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700" transform="rotate(-90 94 150)">성능</text>
  <!-- pillar: security -->
  <rect x="120" y="110" width="36" height="110" rx="2" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="138" y="166" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700" transform="rotate(-90 138 166)">보안</text>
  <!-- pillar: modifiability -->
  <rect x="164" y="88" width="36" height="132" rx="2" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="182" y="156" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700" transform="rotate(-90 182 156)">수정 가능성</text>

  <!-- divider -->
  <line x1="240" y1="40" x2="240" y2="248" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- ===== MIDDLE: tactics as interlocking gears supporting the attributes ===== -->
  <text x="360" y="22" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">전술 (떠받침)</text>
  <!-- gear A -->
  <g transform="translate(318 110)">
    <circle r="34" fill="var(--bg-panel)" stroke="currentColor" stroke-width="2"/>
    <circle r="11" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <g stroke="currentColor" stroke-width="6">
      <line x1="0" y1="-34" x2="0" y2="-44"/><line x1="0" y1="34" x2="0" y2="44"/>
      <line x1="-34" y1="0" x2="-44" y2="0"/><line x1="34" y1="0" x2="44" y2="0"/>
      <line x1="-24" y1="-24" x2="-31" y2="-31"/><line x1="24" y1="24" x2="31" y2="31"/>
      <line x1="-24" y1="24" x2="-31" y2="31"/><line x1="24" y1="-24" x2="31" y2="-31"/>
    </g>
  </g>
  <!-- gear B -->
  <g transform="translate(396 168)">
    <circle r="28" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2.2"/>
    <circle r="9" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <g stroke="var(--gold)" stroke-width="5">
      <line x1="0" y1="-28" x2="0" y2="-37"/><line x1="0" y1="28" x2="0" y2="37"/>
      <line x1="-28" y1="0" x2="-37" y2="0"/><line x1="28" y1="0" x2="37" y2="0"/>
      <line x1="-20" y1="-20" x2="-26" y2="-26"/><line x1="20" y1="20" x2="26" y2="26"/>
      <line x1="-20" y1="20" x2="-26" y2="26"/><line x1="20" y1="-20" x2="26" y2="-26"/>
    </g>
  </g>
  <text x="360" y="232" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="700">검증된 설계 결정이 맞물려 품질을 달성</text>

  <!-- divider -->
  <line x1="452" y1="40" x2="452" y2="248" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- ===== RIGHT TOP: ATAM balance scale (tradeoff) ===== -->
  <text x="566" y="22" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">ATAM · Views</text>
  <line x1="566" y1="58" x2="566" y2="92" stroke="currentColor" stroke-width="2"/>
  <line x1="510" y1="64" x2="622" y2="52" stroke="var(--accent-color)" stroke-width="2.5"/>
  <line x1="510" y1="64" x2="510" y2="80" stroke="currentColor" stroke-width="1.5"/>
  <line x1="622" y1="52" x2="622" y2="68" stroke="currentColor" stroke-width="1.5"/>
  <path d="M500,80 a10,6 0 0 0 20,0 z" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <path d="M612,68 a10,6 0 0 0 20,0 z" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <text x="566" y="106" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="700">트레이드오프 평가</text>

  <!-- RIGHT BOTTOM: three stacked view documents -->
  <rect x="536" y="146" width="64" height="34" rx="2" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.6"/>
  <rect x="528" y="162" width="64" height="34" rx="2" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.6"/>
  <rect x="520" y="178" width="64" height="34" rx="2" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="552" y="199" text-anchor="middle" font-size="8" fill="currentColor" font-weight="700">뷰 3겹</text>
  <text x="566" y="232" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="700">모듈 · C&amp;C · 할당 뷰로 문서화</text>

  <!-- baseline flow arrow tying scenarios → tactics → attributes -->
  <line x1="210" y1="120" x2="280" y2="120" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#sa-arrow)" opacity="0.85"/>
  <line x1="430" y1="120" x2="500" y2="86" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#sa-arrow)" opacity="0.85"/>

  <defs>
    <marker id="sa-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>이 책의 척추 — <strong>품질 속성</strong>(가용성·성능·보안·수정 가능성)을 1차 시민인 <strong>기둥</strong>으로 세우고, 그 높이를 <strong>QA 시나리오</strong>로 측정한다. 가운데 맞물린 <strong>전술</strong>이 그 기둥을 떠받쳐 품질을 달성하고, 오른쪽에서 <strong>ATAM</strong>의 저울이 트레이드오프를 가늠하며 <strong>Views &amp; Beyond</strong>가 세 겹의 관점으로 기록한다.</figcaption>
</figure>

## 들어가며

이 글은 `Architecture-Essential` 시리즈의 **2단계**입니다. 전체 학습 경로는 [Architecture Essential Curriculum](/2026/06/19/architecture-essential-curriculum.html)에서 확인할 수 있습니다.

1단계 [Domain-Driven Design: 도메인 중심 사고](/2026/06/19/domain-driven-design.html)에서는 "무엇을 만들 것인가"를 도메인 모델과 Bounded Context로 분해했습니다. 도메인을 잘 나누면 시스템의 **기능적 책임**이 또렷해집니다. 그런데 현장에서 아키텍처가 무너지는 지점은 대개 기능이 아니라 **비기능**입니다. "이 기능은 맞는데 응답이 3초 걸린다", "장애가 나면 복구에 한 시간 걸린다", "권한 모델을 바꾸려니 코드 절반을 손대야 한다" 같은 문제 말입니다.

이번 단계는 바로 그 비기능 영역을 정면으로 다룹니다. 텍스트는 Len Bass, Paul Clements, Rick Kazman의 *Software Architecture in Practice, 4th ed.* 입니다. 이 책의 핵심 주장은 단순합니다. **아키텍처는 예술이 아니라 공학이며, 공학이 되려면 품질을 측정할 수 있어야 한다.** 막연한 "확장성 좋게", "안정적으로" 대신, 자극과 응답과 측정값으로 품질을 정량화하고, 그 품질을 달성하는 설계 결정을 카탈로그(전술)로 다루며, 설계의 트레이드오프를 평가(ATAM)하고, 이해관계자별 관점(View)으로 문서화합니다.

이렇게 정량화된 품질 사고는 3단계 [Designing Data-Intensive Applications: 분산 데이터 시스템](/2026/06/19/designing-data-intensive-applications.html)에서 실제 분산 데이터 시스템의 가용성·일관성·지연시간 문제로 곧장 이어집니다. 즉, 2단계는 "품질을 어떻게 설계하고 평가하는가"라는 일반 공학 언어를 익히는 자리입니다.

<div class="post-summary-box" markdown="1">

### 📌 이 글에서 다루는 내용

#### 🔍 핵심 주제

- **품질 속성 (Quality Attributes)**: 가용성·성능·보안·수정 가능성 같은 비기능 요구사항을 1차 시민으로 다루는 사고법
- **품질 속성 시나리오 (QA Scenarios)**: 자극·응답·측정으로 요구사항을 정량적이고 검증 가능하게 기술하는 6요소 템플릿
- **아키텍처 전술 (Tactics)**: 각 품질 속성을 달성하기 위한 검증된 설계 결정 카탈로그
- **아키텍처 패턴 (Architectural Patterns)**: Layered·Microservices·Event-Driven 등 패턴과 전술의 관계
- **아키텍처 평가 (ATAM)**: 트레이드오프·민감점·위험점 분석으로 설계 위험을 조기에 식별하는 방법
- **아키텍처 문서화 (Views & Beyond)**: 모듈·C&C·할당 뷰로 이해관계자와 소통 가능하게 기록하기

</div>

## 품질 속성: 비기능 요구사항을 1차 시민으로

기능 요구사항은 "시스템이 **무엇을** 하는가"를 말합니다. 품질 속성(Quality Attribute, QA)은 "그 일을 **얼마나 잘** 하는가"를 말합니다. 가용성(Availability), 성능(Performance), 보안(Security), 수정 가능성(Modifiability), 테스트 용이성(Testability), 사용성(Usability) 등이 대표적입니다.

이 책의 출발점은 **품질 속성이 아키텍처를 결정한다**는 통찰입니다. 기능은 대부분 어떤 구조 위에서도 구현할 수 있습니다. 하지만 "초당 5만 건을 99.99% 가용성으로 처리하라"는 요구는 구조 자체를 강제합니다. 따라서 품질 속성은 부차적 비기능 항목이 아니라, 설계 결정을 가장 강하게 끌어당기는 **1차 시민(first-class citizen)**으로 다뤄야 합니다.

품질 속성을 다룰 때 흔한 실패 패턴은 두 가지입니다.

- **모호함**: "시스템은 빨라야 한다" — 무엇이 얼마나 빨라야 하는지 검증 불가능합니다.
- **분류 논쟁**: "이건 성능 문제인가 가용성 문제인가" — 라벨 다툼은 가치가 없습니다.

책의 처방은 라벨에 집착하지 말고 **시나리오**로 구체화하라는 것입니다. 시나리오는 모호함과 분류 논쟁을 동시에 해소합니다.

## 품질 속성 시나리오: 6요소로 정량화하기

품질 속성 시나리오는 비기능 요구사항을 검증 가능한 문장으로 바꾸는 표준 템플릿입니다. 6개 요소로 구성됩니다.

| 요소 | 영문 | 의미 |
| --- | --- | --- |
| 자극원 | Source | 자극을 만들어내는 주체 (사용자, 외부 시스템, 내부 컴포넌트 등) |
| 자극 | Stimulus | 시스템에 도달하는 사건 (요청 폭주, 노드 다운, 변경 요구 등) |
| 환경 | Environment | 자극이 발생하는 조건 (정상 운영, 과부하, 장애 상태 등) |
| 아티팩트 | Artifact | 자극을 받는 대상 (전체 시스템, 특정 모듈, 데이터 저장소 등) |
| 응답 | Response | 시스템이 보이는 반응 (로그 기록, 페일오버, 거절 등) |
| 응답 측정 | Response Measure | 응답을 정량적으로 판정하는 기준 (시간, 비율, 비용 등) |

핵심은 **응답 측정**입니다. 측정값이 있어야 "달성했다/못 했다"를 객관적으로 말할 수 있습니다.

여섯 요소가 어떻게 한 문장으로 흐르는지 그림으로 보면 구조가 또렷해집니다.

<figure class="post-figure">
<svg role="img" aria-label="품질 속성 시나리오의 여섯 요소가 하나의 흐름을 이루는 그림. 왼쪽에서 자극원이 자극을 만들어 시스템으로 보내면, 그 자극은 특정 환경 조건 아래 특정 아티팩트에 도달한다. 아티팩트는 응답을 내놓고, 그 응답은 응답 측정값으로 합격 여부가 판정된다. 환경과 아티팩트는 자극이 도달하는 상황을 규정하는 한 쌍으로 위아래에 묶여 표시되고, 응답 측정은 합격선을 나타내는 강조 박스로 끝에 놓인다." viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg">
  <title>품질 속성 시나리오 6요소 — 자극원→자극→(환경·아티팩트)→응답→응답 측정의 흐름</title>

  <!-- source -->
  <rect x="20" y="98" width="92" height="44" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="66" y="118" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">자극원</text>
  <text x="66" y="133" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">Source</text>
  <line x1="112" y1="120" x2="142" y2="120" stroke="var(--secondary-color)" stroke-width="2.5" marker-end="url(#qa-arrow)"/>

  <!-- stimulus -->
  <rect x="144" y="98" width="92" height="44" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.5"/>
  <text x="190" y="118" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">자극</text>
  <text x="190" y="133" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">Stimulus</text>
  <line x1="236" y1="120" x2="266" y2="120" stroke="var(--secondary-color)" stroke-width="2.5" marker-end="url(#qa-arrow)"/>

  <!-- environment + artifact: the condition pair the stimulus arrives into -->
  <rect x="266" y="58" width="128" height="124" rx="4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="5 4" opacity="0.6"/>
  <text x="330" y="50" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="700">도달 상황</text>
  <rect x="278" y="70" width="104" height="44" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="330" y="90" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">환경</text>
  <text x="330" y="105" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">Environment</text>
  <rect x="278" y="126" width="104" height="44" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="330" y="146" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">아티팩트</text>
  <text x="330" y="161" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">Artifact</text>
  <line x1="394" y1="120" x2="424" y2="120" stroke="var(--secondary-color)" stroke-width="2.5" marker-end="url(#qa-arrow)"/>

  <!-- response -->
  <rect x="426" y="98" width="92" height="44" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="472" y="118" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">응답</text>
  <text x="472" y="133" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">Response</text>
  <line x1="518" y1="120" x2="548" y2="120" stroke="var(--secondary-color)" stroke-width="2.5" marker-end="url(#qa-arrow)"/>

  <!-- response measure (the pass/fail line — emphasized) -->
  <rect x="550" y="92" width="108" height="56" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2.5"/>
  <text x="604" y="112" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">응답 측정</text>
  <text x="604" y="127" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.85">Response Measure</text>
  <text x="604" y="140" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.85" font-weight="700">합격선 (시간·비율)</text>

  <defs>
    <marker id="qa-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>QA 시나리오 6요소의 흐름 — <strong>자극원</strong>이 만든 <strong>자극</strong>이 특정 <strong>환경</strong>에서 특정 <strong>아티팩트</strong>에 도달하면(점선 = 도달 상황), 아티팩트가 <strong>응답</strong>을 내놓고 그 응답을 <strong>응답 측정</strong>(합격선)으로 판정한다. 마지막 칸의 측정값이 있어야 비로소 "달성/미달"을 객관적으로 말할 수 있다.</figcaption>
</figure>

다음은 가용성(Availability) 시나리오의 구체적 예시입니다.

```text
[가용성 QA 시나리오]
자극원(Source)        : 내부 클러스터의 한 서버 노드
자극(Stimulus)        : 노드가 응답 불능 상태로 전환됨 (crash)
환경(Environment)     : 정상 운영 중, 평균 트래픽 부하
아티팩트(Artifact)    : 결제 처리 서비스
응답(Response)        : 헬스체크가 장애를 감지하고, 트래픽을
                        정상 노드로 자동 페일오버하며, 운영팀에 알림
응답 측정(Response Measure):
                        - 장애 감지까지 5초 이내
                        - 자동 복구(페일오버) 완료까지 30초 이내
                        - 해당 시간 동안 손실 요청 0건 (재시도로 보장)
                        - 월간 가용성 99.99% 유지
```

성능(Performance) 시나리오도 같은 골격으로 작성합니다.

```text
[성능 QA 시나리오]
자극원(Source)        : 외부 사용자 (모바일 클라이언트)
자극(Stimulus)        : 초당 5,000건의 상품 조회 요청 도착
환경(Environment)     : 피크 타임(프로모션) 부하 상태
아티팩트(Artifact)    : 상품 카탈로그 조회 API
응답(Response)        : 요청을 처리하고 응답을 반환
응답 측정(Response Measure):
                        - p95 응답 지연 200ms 이하
                        - p99 응답 지연 500ms 이하
                        - 처리량 5,000 req/s에서 에러율 0.1% 미만
```

이 두 예시만 봐도, "빠르게/안정적으로"가 얼마나 무력한 표현이었는지 드러납니다. 시나리오는 설계자·테스터·이해관계자 모두가 같은 합격선을 공유하게 만듭니다. 실무에서는 이 시나리오들을 **아키텍처 백로그**로 모아 우선순위를 매기고, 각 시나리오를 만족시키는 설계 결정을 추적합니다.

## 아키텍처 전술: 품질을 달성하는 설계 결정 카탈로그

시나리오가 "목표"라면, 전술(Tactic)은 그 목표를 달성하기 위한 **검증된 설계 결정 단위**입니다. 패턴이 여러 결정을 묶은 큰 구조라면, 전술은 그보다 작은 원자적 결정입니다. 책은 품질 속성별로 전술을 카탈로그화합니다. 대표적인 매핑은 다음과 같습니다.

| 품질 속성 | 전술 범주 | 대표 전술 |
| --- | --- | --- |
| 가용성 (Availability) | 결함 감지 | ping/echo, heartbeat, 예외 감지, 타임아웃 |
| 가용성 (Availability) | 결함 복구 | redundancy(active/passive), 페일오버, rollback, 재시작 |
| 가용성 (Availability) | 결함 예방 | 트랜잭션, 서비스 격리(bulkhead), circuit breaker |
| 수정 가능성 (Modifiability) | 응집/결합 관리 | encapsulation, 모듈 분리, 책임 재할당 |
| 수정 가능성 (Modifiability) | 바인딩 시점 연기 | 지연 바인딩(late binding), 설정 파라미터, 플러그인 |
| 성능 (Performance) | 자원 수요 관리 | 이벤트 비율 제한, 우선순위 부여, 계산량 절감 |
| 성능 (Performance) | 자원 관리 | 병렬 처리, 자원 풀(pool), 캐시(caching), 큐잉 |
| 보안 (Security) | 공격 저항 | 인증·인가, 데이터 암호화, 접근 제한 |
| 보안 (Security) | 공격 탐지·복구 | 침입 탐지, 감사 로그, 상태 복원 |
| 테스트 용이성 (Testability) | 입출력 제어 | 의존성 주입, 기록/재생(record/playback), 인터페이스 분리 |

전술의 가치는 **재사용 가능한 어휘**라는 데 있습니다. "가용성을 올리자"는 추상적이지만, "결제 서비스에 active/passive redundancy와 circuit breaker를 적용하자"는 구체적이고 토론 가능합니다. 위 가용성 시나리오의 "5초 내 감지 / 30초 내 복구"는 heartbeat(감지) + 자동 페일오버(복구)라는 전술 조합으로 직접 연결됩니다. 하나의 품질 속성이 어떻게 여러 전술 범주로 나뉘고, 그 범주가 다시 구체 전술과 시나리오 측정값으로 이어지는지 가용성을 예로 보면 다음과 같습니다.

<figure class="post-figure">
<svg role="img" aria-label="가용성이라는 하나의 품질 속성이 결함 감지, 결함 복구, 결함 예방이라는 세 전술 범주로 갈라지고, 각 범주가 구체 전술로 이어지는 그림. 왼쪽에 가용성 노드가 있고 오른쪽으로 세 갈래가 뻗는다. 결함 감지는 heartbeat와 타임아웃 전술로, 결함 복구는 페일오버와 redundancy 전술로, 결함 예방은 circuit breaker와 bulkhead 전술로 이어진다. 결함 감지와 결함 복구 전술은 가용성 시나리오의 측정값인 5초 내 감지와 30초 내 복구로 연결되어, 전술이 곧 측정값을 달성한다는 점이 강조된다." viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg">
  <title>전술이 품질 속성을 달성한다 — 가용성 → 전술 범주(감지·복구·예방) → 구체 전술 → 시나리오 측정값</title>

  <!-- quality attribute -->
  <rect x="20" y="112" width="112" height="56" rx="3" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="2.5"/>
  <text x="76" y="136" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700">가용성</text>
  <text x="76" y="152" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">품질 속성</text>

  <!-- branch lines to three categories -->
  <line x1="132" y1="130" x2="186" y2="58" stroke="var(--secondary-color)" stroke-width="2.2" marker-end="url(#tc-arrow)"/>
  <line x1="132" y1="140" x2="186" y2="140" stroke="var(--secondary-color)" stroke-width="2.2" marker-end="url(#tc-arrow)"/>
  <line x1="132" y1="150" x2="186" y2="222" stroke="var(--secondary-color)" stroke-width="2.2" marker-end="url(#tc-arrow)"/>

  <!-- category: detect -->
  <rect x="188" y="36" width="120" height="44" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="248" y="54" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">결함 감지</text>
  <text x="248" y="69" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">Detect Faults</text>
  <!-- category: recover -->
  <rect x="188" y="118" width="120" height="44" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="248" y="136" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">결함 복구</text>
  <text x="248" y="151" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">Recover</text>
  <!-- category: prevent -->
  <rect x="188" y="200" width="120" height="44" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="248" y="218" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">결함 예방</text>
  <text x="248" y="233" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">Prevent</text>

  <!-- concrete tactics -->
  <line x1="308" y1="58" x2="338" y2="58" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#tc-arrow)"/>
  <rect x="340" y="40" width="150" height="36" rx="3" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="2"/>
  <text x="415" y="62" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="700">heartbeat · 타임아웃</text>

  <line x1="308" y1="140" x2="338" y2="140" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#tc-arrow)"/>
  <rect x="340" y="122" width="150" height="36" rx="3" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="2"/>
  <text x="415" y="144" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="700">페일오버 · redundancy</text>

  <line x1="308" y1="222" x2="338" y2="222" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#tc-arrow)"/>
  <rect x="340" y="204" width="150" height="36" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="415" y="226" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="700">circuit breaker · bulkhead</text>

  <!-- measures (the scenario pass-line the detect/recover tactics achieve) -->
  <line x1="490" y1="58" x2="520" y2="74" stroke="var(--secondary-color)" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#tc-arrow)" opacity="0.8"/>
  <line x1="490" y1="140" x2="520" y2="116" stroke="var(--secondary-color)" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#tc-arrow)" opacity="0.8"/>
  <rect x="522" y="74" width="138" height="44" rx="3" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="2.5"/>
  <text x="591" y="92" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">시나리오 측정값</text>
  <text x="591" y="106" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.85">5초 감지 · 30초 복구</text>

  <defs>
    <marker id="tc-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>전술이 품질 속성을 달성하는 경로 — 하나의 <strong>품질 속성</strong>(가용성)은 <strong>전술 범주</strong>(감지·복구·예방)로 갈라지고, 각 범주는 다시 <strong>구체 전술</strong>로 내려간다. 점선은 감지(heartbeat)·복구(페일오버) 전술이 위 가용성 시나리오의 <strong>측정값</strong>(5초 감지·30초 복구)을 직접 달성함을 가리킨다 — "가용성을 올리자"가 토론 가능한 결정으로 바뀌는 지점이다.</figcaption>
</figure>

다만 모든 전술에는 대가가 따릅니다. 캐시는 성능을 올리지만 일관성과 메모리를 희생합니다. redundancy는 가용성을 올리지만 비용과 복잡도를 늘립니다. 이 **상충**을 다루는 것이 바로 평가 단계의 역할입니다.

## 아키텍처 패턴: 전술의 묶음

패턴(Pattern)은 반복되는 설계 문제에 대한 검증된 구조적 해법으로, 여러 전술을 한데 묶은 큰 단위입니다. 패턴은 특정 품질 속성을 본질적으로 촉진하거나 억제합니다.

```mermaid
flowchart TD
    P["아키텍처 패턴<br/>선택"]

    P --> L["Layered<br/>(계층형)"]
    P --> M["Microservices<br/>(마이크로서비스)"]
    P --> E["Event-Driven<br/>(이벤트 기반)"]

    L --> L1["촉진: 수정 가능성<br/>관심사 분리"]
    L --> L2["억제: 성능<br/>계층 통과 비용"]

    M --> M1["촉진: 배포 독립성<br/>확장성·격리"]
    M --> M2["억제: 운영 복잡도<br/>분산 일관성"]

    E --> E1["촉진: 느슨한 결합<br/>비동기 확장성"]
    E --> E2["억제: 추적성<br/>흐름 디버깅 난이도"]
```

- **Layered**: 책임을 계층으로 나눠 수정 가능성과 이식성을 높입니다. 대신 계층을 가로지르는 호출이 성능 비용을 만듭니다.
- **Microservices**: 서비스를 독립 배포·확장 단위로 쪼개 가용성과 확장성을 높입니다. 대신 네트워크 호출, 분산 트랜잭션, 운영 복잡도가 따라옵니다.
- **Event-Driven**: 컴포넌트를 이벤트로 느슨하게 연결해 확장성과 진화 가능성을 높입니다. 대신 전체 흐름 추적과 디버깅이 어려워집니다.

패턴 선택은 곧 **어떤 품질을 우선하고 어떤 품질을 양보할지** 결정하는 일입니다. 그래서 패턴은 시나리오·전술과 분리해 고를 수 없으며, 늘 트레이드오프와 함께 평가되어야 합니다.

## 아키텍처 평가(ATAM): 위험을 조기에 드러내기

ATAM(Architecture Tradeoff Analysis Method)은 설계가 품질 속성 요구를 만족하는지, 그리고 그 과정에서 어떤 상충이 발생하는지를 **코드 작성 전에** 분석하는 평가 방법입니다. 핵심 산출물은 네 가지입니다.

| 산출물 | 영문 | 의미 |
| --- | --- | --- |
| 민감점 | Sensitivity Point | 특정 결정이 하나의 품질 속성에 크게 영향을 주는 지점 |
| 트레이드오프점 | Tradeoff Point | 하나의 결정이 둘 이상의 품질 속성에 동시에, 상반되게 영향을 주는 지점 |
| 위험 | Risk | 품질 목표 달성을 위협하는, 정당화되지 않은 결정 |
| 비위험 | Non-Risk | 근거가 충분해 안전하다고 판단되는 결정 |

예를 들어 결제 서비스에 캐시를 도입한다고 합시다. 캐시 만료 시간(TTL)은 **민감점**입니다. 짧게 잡으면 일관성이 좋아지고 길게 잡으면 성능이 좋아지므로 성능 시나리오 결과가 이 값에 민감하게 반응합니다. 동시에 이 결정은 성능을 올리고 일관성을 떨어뜨리므로 **트레이드오프점**이기도 합니다. 만약 "TTL을 10분으로 두지만 금액 데이터에도 적용한다"면, 잘못된 잔액을 보여줄 수 있어 **위험**이 됩니다.

ATAM의 진짜 가치는 이런 위험을 **다이어그램과 토론으로 미리 드러낸다**는 데 있습니다. 이해관계자들이 모여 우선순위가 높은 시나리오를 두고 "이 결정은 어떤 품질에 어떻게 작용하는가"를 따지면, 값비싼 재작업이 발생하기 전에 설계 결함이 노출됩니다. 평가 과정은 대략 (1) 품질 속성 유틸리티 트리 작성 → (2) 시나리오 우선순위 부여 → (3) 아키텍처 접근법 분석 → (4) 민감점·트레이드오프·위험 도출 순으로 진행됩니다.

## 아키텍처 문서화(Views & Beyond): 관점으로 소통하기

아무리 좋은 설계도 전달되지 않으면 소용없습니다. 책은 아키텍처를 단일 그림이 아니라 **여러 뷰(View)의 집합**으로 기록하라고 말합니다. 뷰는 특정 이해관계자의 관심사에 맞춰 시스템을 투영한 것입니다. 크게 세 갈래로 나뉩니다.

| 뷰 범주 | 영문 | 보여주는 것 | 주요 이해관계자 |
| --- | --- | --- | --- |
| 모듈 뷰 | Module View | 코드 단위의 정적 구조, 의존 관계, 책임 | 개발자, 유지보수 담당 |
| 컴포넌트-커넥터 뷰 | C&C View | 런타임 요소와 상호작용(프로세스, 통신) | 성능·가용성 분석가 |
| 할당 뷰 | Allocation View | 소프트웨어가 인프라·팀·파일에 매핑되는 방식 | 운영, 배포, 조직 설계 |

같은 시스템이라도 모듈 뷰는 "수정 가능성"을 논할 때, C&C 뷰는 "성능·가용성"을 논할 때, 할당 뷰는 "배포·운영"을 논할 때 쓰입니다. 즉, **품질 속성마다 자연스럽게 잘 맞는 뷰가 다릅니다.** 위 가용성·성능 시나리오를 검증하려면 C&C 뷰가, 수정 가능성 전술(encapsulation, 지연 바인딩)을 보이려면 모듈 뷰가 가장 효과적입니다.

"Beyond"가 가리키는 것은 뷰들을 묶는 정보입니다. 뷰 간 매핑, 설계 근거(rationale), 용어 사전, 변경 이력 같은 것들이 여기 속합니다. 특히 **설계 근거**는 ATAM에서 도출한 트레이드오프와 위험 판단을 기록하는 자리로, 미래의 유지보수자가 "왜 이렇게 결정했는가"를 추적할 수 있게 해 줍니다.

## 마무리

이번 단계의 핵심은 한 문장으로 압축됩니다. **아키텍처는 측정 가능한 품질 속성을 중심으로 설계·평가·문서화하는 공학이다.** 우리는 비기능 요구를 1차 시민으로 끌어올리고(품질 속성), 그것을 6요소로 정량화하며(QA 시나리오), 검증된 설계 결정으로 달성하고(전술), 그 결정을 묶은 구조를 고르며(패턴), 트레이드오프를 미리 드러내고(ATAM), 관점별로 소통 가능하게 기록(Views & Beyond)했습니다.

이 모든 도구는 추상적인 연습이 아닙니다. 3단계 [Designing Data-Intensive Applications: 분산 데이터 시스템](/2026/06/19/designing-data-intensive-applications.html)에서는 바로 이 품질 속성 언어 — 가용성, 일관성, 지연시간, 확장성 — 를 실제 분산 데이터 시스템의 복제·파티셔닝·합의 문제에 그대로 적용하게 됩니다. 즉, 여기서 익힌 "시나리오로 정량화하고 트레이드오프로 평가한다"는 사고가, 다음 단계에서 다룰 진짜 분산 환경의 어려운 결정들을 정리하는 틀이 됩니다.

### 다음 학습

- [Architecture Essential Curriculum](/2026/06/19/architecture-essential-curriculum.html) — 전체 학습 경로와 진행 현황 확인
- (다시 보기) 1단계: [Domain-Driven Design: 도메인 중심 사고](/2026/06/19/domain-driven-design.html) — 기능적 책임을 도메인으로 분해하기
- (다음 단계) 3단계: [Designing Data-Intensive Applications: 분산 데이터 시스템](/2026/06/19/designing-data-intensive-applications.html) — 품질 속성을 실제 분산 데이터 시스템에 적용하기
