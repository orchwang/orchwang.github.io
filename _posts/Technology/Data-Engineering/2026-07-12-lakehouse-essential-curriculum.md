---
layout: post
title: "Lakehouse Essential Curriculum (Apache Iceberg) — 레이크하우스 에센셜 커리큘럼"
date: 2026-07-12
categories: [Technology, Data-Engineering]
series: Lakehouse-Essential
tags: [iceberg, lakehouse, data-engineering, curriculum]
published: true
banner: wartable
excerpt: "Data-Engineering-Essential 오버뷰의 '저장' 단계에서 개념만 소개한 오픈 테이블 포맷을 Apache Iceberg 중심으로 파고드는 심화 스핀오프. 문제의식부터 메타데이터·매니페스트 구조, ACID·스냅샷·시간여행, 파티션/스키마 진화, compaction·유지보수, REST Catalog·거버넌스, 그리고 Iceberg vs Delta vs Hudi vs Paimon 비교까지 7단계로 정복하는 학습 로드맵입니다. 도장깨기 방식으로 진행 상황을 추적합니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="Lakehouse Essential 시리즈를 한 장으로 정리한 그림. 위 왼쪽은 레이크 위에 얹힌 테이블 계층 피라미드로, 아래에서 위로 오브젝트 스토리지(S3) · 데이터 파일(Parquet) · 매니페스트 · 메타데이터 파일 · 카탈로그가 쌓인다. 위 오른쪽은 커밋마다 새로 생기는 스냅샷 S0·S1·S2가 놓인 타임라인이며, 위쪽으로 되돌아가는 화살표가 시간여행과 롤백을 뜻한다. 메타데이터 계층에서 스냅샷 타임라인으로 점선이 이어져 메타데이터가 스냅샷을 가리킴을 나타낸다. 아래쪽은 문제의식·메타데이터·ACID스냅샷·진화·compaction·카탈로그·비교로 이어지는 7단계 도장깨기 로드맵 타임라인이며, 끝에는 시리즈 완주를 뜻하는 트로피가 놓여 있다." viewBox="0 0 680 360" xmlns="http://www.w3.org/2000/svg">
  <title>Lakehouse Essential — 테이블 계층 피라미드 · 스냅샷 타임라인 · 7단계 도장깨기 로드맵</title>
  <defs>
    <marker id="lh-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--secondary-color)"/>
    </marker>
    <marker id="lh-tt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-color)"/>
    </marker>
  </defs>

  <!-- ===== title ===== -->
  <text x="340" y="24" text-anchor="middle" font-size="17" font-weight="800" fill="currentColor" letter-spacing="1.5">LAKEHOUSE ESSENTIAL</text>

  <!-- ===== SECTION A-left: table-layer pyramid ===== -->
  <text x="30" y="50" text-anchor="start" font-size="11" font-weight="700" fill="currentColor" opacity="0.72">테이블 계층 — 파일 위에 메타데이터를 얹어 스냅샷으로 관리한다</text>

  <!-- catalog (top) -->
  <rect x="108" y="82" width="96" height="22" rx="3" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="2.5"/>
  <text x="156" y="97" text-anchor="middle" font-size="10.5" font-weight="700" fill="currentColor">카탈로그</text>
  <!-- metadata -->
  <rect x="92" y="108" width="128" height="22" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.5"/>
  <text x="156" y="123" text-anchor="middle" font-size="10.5" font-weight="700" fill="currentColor">메타데이터 파일</text>
  <!-- manifest -->
  <rect x="76" y="134" width="160" height="22" rx="3" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2.5"/>
  <text x="156" y="149" text-anchor="middle" font-size="10.5" font-weight="700" fill="currentColor">매니페스트</text>
  <!-- data files -->
  <rect x="60" y="160" width="192" height="22" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <text x="156" y="175" text-anchor="middle" font-size="10.5" font-weight="700" fill="currentColor">데이터 파일 · Parquet</text>
  <!-- object storage (base) -->
  <rect x="44" y="186" width="224" height="24" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="2"/>
  <text x="156" y="202" text-anchor="middle" font-size="10.5" font-weight="700" fill="currentColor">오브젝트 스토리지 · S3</text>

  <!-- physical/logical side hint -->
  <g stroke="currentColor" stroke-width="1.4" opacity="0.4" fill="none">
    <line x1="34" y1="204" x2="34" y2="88" marker-end="url(#lh-arrow)"/>
  </g>
  <text x="26" y="150" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.6" transform="rotate(-90 26 150)">물리 → 논리</text>

  <!-- ===== SECTION A-right: snapshot timeline ===== -->
  <text x="492" y="50" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor" opacity="0.72">스냅샷 타임라인 — 커밋마다 새 스냅샷</text>

  <!-- metadata -> timeline pointer (dashed) -->
  <g stroke="currentColor" stroke-width="1.4" opacity="0.45" fill="none" stroke-dasharray="3 3">
    <line x1="222" y1="119" x2="360" y2="128" marker-end="url(#lh-arrow)"/>
  </g>
  <text x="292" y="112" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">가리킨다</text>

  <!-- time-travel back arc -->
  <path d="M600,116 Q490,78 380,116" fill="none" stroke="var(--accent-color)" stroke-width="1.8" stroke-dasharray="4 3" marker-end="url(#lh-tt)"/>
  <text x="490" y="82" text-anchor="middle" font-size="9" font-weight="700" fill="var(--accent-color)">시간여행 · 롤백</text>

  <!-- baseline + commit arrows -->
  <line x1="364" y1="132" x2="616" y2="132" stroke="currentColor" stroke-width="1.6" opacity="0.35"/>
  <g stroke="var(--secondary-color)" stroke-width="2" fill="none">
    <line x1="398" y1="132" x2="470" y2="132" marker-end="url(#lh-arrow)"/>
    <line x1="508" y1="132" x2="580" y2="132" marker-end="url(#lh-arrow)"/>
  </g>

  <!-- snapshot nodes -->
  <g text-anchor="middle" font-weight="700">
    <!-- S0 -->
    <circle cx="380" cy="132" r="16" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="2.5"/>
    <g stroke="currentColor" stroke-width="1" opacity="0.5"><line x1="372" y1="128" x2="388" y2="128"/><line x1="372" y1="134" x2="388" y2="134"/><line x1="380" y1="124" x2="380" y2="138"/></g>
    <text x="380" y="164" font-size="10" fill="currentColor">S0</text>
    <!-- S1 -->
    <circle cx="490" cy="132" r="16" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="2.5"/>
    <g stroke="currentColor" stroke-width="1" opacity="0.5"><line x1="482" y1="128" x2="498" y2="128"/><line x1="482" y1="134" x2="498" y2="134"/><line x1="490" y1="124" x2="490" y2="138"/></g>
    <text x="490" y="164" font-size="10" fill="currentColor">S1</text>
    <!-- S2 -->
    <circle cx="600" cy="132" r="16" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="3"/>
    <g stroke="currentColor" stroke-width="1" opacity="0.5"><line x1="592" y1="128" x2="608" y2="128"/><line x1="592" y1="134" x2="608" y2="134"/><line x1="600" y1="124" x2="600" y2="138"/></g>
    <text x="600" y="164" font-size="10" fill="currentColor">S2</text>
  </g>
  <text x="490" y="182" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.7">현재 = 최신 스냅샷</text>

  <!-- ===== divider ===== -->
  <line x1="30" y1="216" x2="650" y2="216" stroke="currentColor" stroke-width="1.4" opacity="0.25"/>

  <!-- ===== SECTION B: 7-step roadmap ===== -->
  <text x="30" y="240" text-anchor="start" font-size="11" font-weight="700" fill="currentColor" opacity="0.72">7단계 로드맵 — 왜·무엇으로 → 무엇을 할 수 있나 → 어떻게 운영·선택하나, 그리고 완주</text>

  <!-- act labels + underlines -->
  <g font-size="9" font-weight="700" text-anchor="middle">
    <text x="100" y="266" fill="var(--secondary-color)">왜·무엇으로 (1–2)</text>
    <text x="260" y="266" fill="var(--accent-color)">무엇을 할 수 있나 (3–4)</text>
    <text x="460" y="266" fill="var(--gold)">어떻게 운영·선택하나 (5–7)</text>
  </g>
  <g stroke-width="2" opacity="0.45">
    <line x1="60" y1="272" x2="140" y2="272" stroke="var(--secondary-color)"/>
    <line x1="220" y1="272" x2="300" y2="272" stroke="var(--accent-color)"/>
    <line x1="380" y1="272" x2="540" y2="272" stroke="var(--gold)"/>
  </g>

  <!-- baseline -->
  <line x1="52" y1="304" x2="556" y2="304" stroke="currentColor" stroke-width="2" opacity="0.4"/>

  <!-- stamps -->
  <g font-weight="800" text-anchor="middle">
    <!-- 1 -->
    <circle cx="60" cy="304" r="15" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2.5"/>
    <text x="60" y="308" font-size="12" fill="currentColor">1</text>
    <text x="60" y="334" font-size="8.5" font-weight="700" fill="currentColor">문제의식</text>
    <!-- 2 -->
    <circle cx="140" cy="304" r="15" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2.5"/>
    <text x="140" y="308" font-size="12" fill="currentColor">2</text>
    <text x="140" y="334" font-size="8.5" font-weight="700" fill="currentColor">메타데이터</text>
    <!-- 3 -->
    <circle cx="220" cy="304" r="15" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.5"/>
    <text x="220" y="308" font-size="12" fill="currentColor">3</text>
    <text x="220" y="334" font-size="8.5" font-weight="700" fill="currentColor">ACID·스냅샷</text>
    <!-- 4 -->
    <circle cx="300" cy="304" r="15" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.5"/>
    <text x="300" y="308" font-size="12" fill="currentColor">4</text>
    <text x="300" y="334" font-size="8.5" font-weight="700" fill="currentColor">진화</text>
    <!-- 5 -->
    <circle cx="380" cy="304" r="15" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="2.5"/>
    <text x="380" y="308" font-size="12" fill="currentColor">5</text>
    <text x="380" y="334" font-size="8.5" font-weight="700" fill="currentColor">compaction</text>
    <!-- 6 -->
    <circle cx="460" cy="304" r="15" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="2.5"/>
    <text x="460" y="308" font-size="12" fill="currentColor">6</text>
    <text x="460" y="334" font-size="8.5" font-weight="700" fill="currentColor">카탈로그</text>
    <!-- 7 -->
    <circle cx="540" cy="304" r="15" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="3"/>
    <text x="540" y="308" font-size="12" fill="currentColor">7</text>
    <text x="540" y="334" font-size="8.5" font-weight="700" fill="currentColor">비교</text>
  </g>

  <!-- arrow to trophy -->
  <line x1="558" y1="304" x2="592" y2="304" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#lh-arrow)"/>

  <!-- ===== victory trophy ===== -->
  <g>
    <path d="M602,288 L636,288 Q634,310 619,312 Q604,310 602,288 Z" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="2.5"/>
    <path d="M602,292 q-10,1 -3,13" fill="none" stroke="var(--gold)" stroke-width="2"/>
    <path d="M636,292 q10,1 3,13" fill="none" stroke="var(--gold)" stroke-width="2"/>
    <rect x="615" y="312" width="8" height="8" fill="var(--gold)"/>
    <rect x="606" y="320" width="26" height="5" rx="1" fill="var(--gold)"/>
    <polygon points="619,294 621.8,300 628,300.5 623,304.5 624.8,310.5 619,307 613.2,310.5 615,304.5 610,300.5 616.2,300" fill="var(--gold-bright)"/>
  </g>
  <text x="619" y="340" text-anchor="middle" font-size="9" font-weight="800" fill="var(--gold)">완주</text>
</svg>
<figcaption>이 시리즈를 한 장으로 — 레이크 위 테이블 계층 피라미드(스토리지·데이터파일·매니페스트·메타데이터·카탈로그)와 스냅샷 타임라인(시간여행), 그리고 문제의식부터 비교까지 7단계 도장깨기 로드맵과 완주 트로피</figcaption>
</figure>

## 소개

`Data-Engineering-Essential` 오버뷰 시리즈는 데이터 엔지니어링 수명주기 전체의 **지도**를 그렸습니다. 그 [4단계 데이터 저장(Storage)](/2026/06/25/data-storage.html)에서 우리는 데이터 웨어하우스·레이크·레이크하우스의 차이를 짚고, 레이크 위에 ACID와 시간여행을 얹는 **오픈 테이블 포맷**(Apache Iceberg·Delta Lake·Hudi)을 **개념 소개** 선에서 다뤘습니다. 다만 거기서는 "저장 지도 안에서 테이블 포맷이 어떤 역할을 하는가"까지만 짚고, **메타데이터 구조·트랜잭션·진화·운영의 깊은 이야기는 별도 시리즈로 미뤄** 두었습니다. 이 글이 바로 그 예고된 스핀오프, `Lakehouse-Essential` 시리즈의 **마스터 로드맵**입니다.

2026년 현재 오픈 테이블 포맷은 더 이상 "선택 사항"이 아니라 레이크하우스의 사실상 표준이 되었고, 그 중심에는 **Apache Iceberg**가 트랜잭션 워크로드의 de facto standard로 자리 잡았습니다(AWS·Google·Snowflake·Databricks·Dremio 등 광범위한 채택, REST Catalog를 중심으로 한 거버넌스). 이 시리즈는 그래서 Iceberg를 축으로 삼되, 마지막 단계에서 Delta·Hudi·Paimon과 나란히 놓고 비교합니다.

이 시리즈는 그 내부로 들어갑니다. **왜 파일 위에 테이블 계층이 필요한가**(문제의식)에서 출발해, Iceberg가 그 계층을 어떻게 구현하는지 — **메타데이터·매니페스트 구조**, 그 위에서 성립하는 **ACID·스냅샷·시간여행**, 재작성 없이 스키마와 파티션을 바꾸는 **진화**, 작은 파일과 스냅샷 누적을 다스리는 **compaction·유지보수**, 카탈로그 표준과 접근 제어를 세우는 **REST Catalog·거버넌스** — 를 차례로 파고든 뒤, 마지막으로 **Iceberg vs Delta vs Hudi vs Paimon** 비교로 전체를 조망합니다. 각 단계를 정복할 때마다 상세 딥다이브 포스트를 작성하고 체크박스를 채우는 **도장깨기** 방식으로 진행합니다.

## 학습 흐름

7단계는 아래 순서대로 진행하는 것을 권장합니다. 먼저 **왜 테이블 포맷이 필요한가**(문제의식)로 동기를 세우고, 그것을 실제로 구현하는 Iceberg의 **메타데이터 구조**를 익힌 뒤, 그 구조 위에서 성립하는 **ACID·스냅샷·시간여행**과 재작성 없는 **진화**로 "무엇을 할 수 있는가"를 이해합니다. 그다음 실무에서 반드시 부딪히는 **compaction·유지보수**와 **REST Catalog·거버넌스**로 "어떻게 운영하는가"를 다루고, 마지막으로 **다른 포맷과의 비교**로 안목을 완성하는 흐름입니다.

<figure class="post-figure">
<svg role="img" aria-label="이 시리즈의 학습 스파인을 세 막으로 나눈 개념도. 제1막 '왜·무엇으로'는 문제의식과 메타데이터·매니페스트 구조(1~2단계)로 테이블 계층의 동기와 구현을 세우고, 제2막 '무엇을 할 수 있나'는 ACID·스냅샷·시간여행과 파티션·스키마 진화(3~4단계)로 테이블 포맷이 주는 능력을 익히며, 제3막 '어떻게 운영·선택하나'는 compaction·유지보수와 REST Catalog·거버넌스, 그리고 Iceberg·Delta·Hudi·Paimon 비교(5~7단계)로 운영과 선택 안목을 완성한다. 세 막은 왼쪽에서 오른쪽으로 굵은 화살표로 이어진다." viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg">
  <title>세 막으로 보는 Lakehouse 학습 여정 — 왜·무엇으로 → 무엇을 할 수 있나 → 어떻게 운영·선택하나</title>
  <defs>
    <marker id="lh-tl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--gold)"/>
    </marker>
  </defs>

  <!-- title -->
  <text x="340" y="26" text-anchor="middle" font-size="15" font-weight="800" fill="currentColor">세 막으로 보는 학습 여정</text>

  <!-- ===== ACT 1: 왜·무엇으로 (steps 1-2) ===== -->
  <rect x="16" y="52" width="200" height="210" rx="6" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2.5"/>
  <circle cx="34" cy="74" r="12" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="34" y="78" text-anchor="middle" font-size="11" font-weight="800" fill="currentColor">1</text>
  <text x="122" y="78" text-anchor="middle" font-size="13" font-weight="800" fill="var(--secondary-color)">왜·무엇으로</text>
  <text x="122" y="96" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.72">테이블 계층의 동기와 구현</text>
  <!-- layered-table icon -->
  <g>
    <rect x="96" y="122" width="52" height="8" rx="1.5" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="2"/>
    <rect x="90" y="134" width="64" height="8" rx="1.5" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
    <rect x="84" y="146" width="76" height="8" rx="1.5" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2"/>
    <rect x="78" y="158" width="88" height="8" rx="1.5" fill="var(--bg-panel)" stroke="currentColor" stroke-width="2"/>
  </g>
  <!-- step chips -->
  <g font-size="9.5" font-weight="700">
    <rect x="34" y="190" width="164" height="22" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1" opacity="0.9"/>
    <circle cx="48" cy="201" r="7" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.6"/><text x="48" y="204" text-anchor="middle" font-size="8" fill="currentColor">1</text><text x="62" y="204" fill="currentColor">문제의식 — 파일의 한계</text>
    <rect x="34" y="220" width="164" height="22" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1" opacity="0.9"/>
    <circle cx="48" cy="231" r="7" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.6"/><text x="48" y="234" text-anchor="middle" font-size="8" fill="currentColor">2</text><text x="62" y="234" fill="currentColor">메타데이터·매니페스트</text>
  </g>

  <!-- arrow ACT1 -> ACT2 -->
  <polygon points="218,148 232,148 232,141 246,157 232,173 232,166 218,166" fill="currentColor" opacity="0.5"/>

  <!-- ===== ACT 2: 무엇을 할 수 있나 (steps 3-4) ===== -->
  <rect x="248" y="52" width="172" height="210" rx="6" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.5"/>
  <circle cx="266" cy="74" r="12" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="266" y="78" text-anchor="middle" font-size="11" font-weight="800" fill="currentColor">2</text>
  <text x="340" y="78" text-anchor="middle" font-size="12.5" font-weight="800" fill="var(--accent-color)">무엇을 할 수 있나</text>
  <text x="340" y="96" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.72">테이블 포맷이 주는 능력</text>
  <!-- time-travel clock icon -->
  <g>
    <circle cx="334" cy="140" r="20" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.5"/>
    <line x1="334" y1="140" x2="334" y2="126" stroke="var(--accent-color)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="334" y1="140" x2="345" y2="146" stroke="var(--accent-color)" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M318,128 A20,20 0 0 0 315,142" fill="none" stroke="currentColor" stroke-width="1.6" opacity="0.6" marker-end="url(#lh-tl-arrow)"/>
  </g>
  <!-- step chips -->
  <g font-size="9.5" font-weight="700">
    <rect x="266" y="190" width="138" height="22" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1" opacity="0.9"/>
    <circle cx="280" cy="201" r="7" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="1.6"/><text x="280" y="204" text-anchor="middle" font-size="8" fill="currentColor">3</text><text x="294" y="204" font-size="8.5" fill="currentColor">ACID·스냅샷·시간여행</text>
    <rect x="266" y="220" width="138" height="22" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1" opacity="0.9"/>
    <circle cx="280" cy="231" r="7" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="1.6"/><text x="280" y="234" text-anchor="middle" font-size="8" fill="currentColor">4</text><text x="294" y="234" fill="currentColor">파티션·스키마 진화</text>
  </g>

  <!-- arrow ACT2 -> ACT3 -->
  <polygon points="422,148 436,148 436,141 450,157 436,173 436,166 422,166" fill="currentColor" opacity="0.5"/>

  <!-- ===== ACT 3: 어떻게 운영·선택하나 (steps 5-7) ===== -->
  <rect x="452" y="52" width="212" height="210" rx="6" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="2.5"/>
  <circle cx="470" cy="74" r="12" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="470" y="78" text-anchor="middle" font-size="11" font-weight="800" fill="currentColor">3</text>
  <text x="567" y="78" text-anchor="middle" font-size="13" font-weight="800" fill="var(--gold)">어떻게 운영·선택하나</text>
  <text x="558" y="96" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.72">건강하게 운영하고, 골라 쓰기</text>
  <!-- branching / compare icon -->
  <g>
    <circle cx="512" cy="140" r="6" fill="var(--gold)"/>
    <g stroke="var(--gold)" stroke-width="2" fill="none">
      <line x1="518" y1="136" x2="560" y2="124" marker-end="url(#lh-tl-arrow)"/>
      <line x1="519" y1="140" x2="562" y2="140" marker-end="url(#lh-tl-arrow)"/>
      <line x1="518" y1="144" x2="560" y2="156" marker-end="url(#lh-tl-arrow)"/>
    </g>
  </g>
  <!-- step chips -->
  <g font-size="9.5" font-weight="700">
    <rect x="470" y="176" width="178" height="22" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1" opacity="0.9"/>
    <circle cx="484" cy="187" r="7" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="1.6"/><text x="484" y="190" text-anchor="middle" font-size="8" fill="currentColor">5</text><text x="498" y="190" fill="currentColor">compaction·유지보수</text>
    <rect x="470" y="202" width="178" height="22" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1" opacity="0.9"/>
    <circle cx="484" cy="213" r="7" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="1.6"/><text x="484" y="216" text-anchor="middle" font-size="8" fill="currentColor">6</text><text x="498" y="216" fill="currentColor">REST Catalog·거버넌스</text>
    <rect x="470" y="228" width="178" height="22" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1" opacity="0.9"/>
    <circle cx="484" cy="239" r="7" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="1.6"/><text x="484" y="242" text-anchor="middle" font-size="8" fill="currentColor">7</text><text x="498" y="242" font-size="8.5" fill="currentColor">Iceberg·Delta·Hudi·Paimon</text>
  </g>
</svg>
<figcaption>학습 스파인을 세 막으로 — ① 왜·무엇으로(문제의식·메타데이터 구조) → ② 무엇을 할 수 있나(ACID·스냅샷·시간여행·진화) → ③ 어떻게 운영·선택하나(compaction·카탈로그·포맷 비교)</figcaption>
</figure>

## 학습 진행 현황

> 완료한 항목에는 상세 포스트 링크가 연결됩니다. 학습이 진행될 때마다 체크박스와 진행률을 갱신합니다.

- 현재 완료한 항목: **0개**
- 전체 항목: **7개**
- 진행률: **0%**

## 1단계: 오픈 테이블 포맷의 문제의식 — 왜 파일 위에 테이블 계층이 필요한가

시리즈의 출발점이자 동기입니다. 오브젝트 스토리지에 Parquet 파일을 잔뜩 쌓는 것만으로는 "테이블"이 되지 않습니다. Hive 테이블처럼 디렉터리와 파일 목록에 의존하면 원자적 커밋이 불가능하고, 동시 쓰기에서 읽는 쪽이 깨진 상태를 보며, 파일 목록을 매번 스캔하느라 느려집니다. 이 단계에서는 이 **파일 기반 레이크의 근본 문제** — 원자성·일관성·성능·메타데이터 확장성 — 를 정리하고, 그 위에 **테이블 계층**(테이블 포맷)을 얹는다는 발상이 무엇을 해결하는지를 이해합니다.

- [ ] **파일 레이크의 한계**: 디렉터리·파일 목록 기반 Hive 테이블의 원자성·일관성 문제, listing 비용
- [ ] **테이블 포맷이 여는 것**: 파일 집합 위에 스냅샷·스키마·통계를 얹어 "테이블"로 만들기
- [ ] **레이크하우스와의 관계**: 오버뷰 4단계에서 본 웨어하우스·레이크·레이크하우스 구도에서 테이블 포맷의 자리

## 2단계: Iceberg 메타데이터 · 매니페스트 구조 — 스냅샷·매니페스트·데이터 파일 계층

Iceberg의 모든 능력이 여기서 나옵니다. Iceberg 테이블은 세 계층으로 구성됩니다 — 테이블의 현재 상태(스키마·파티션 스펙·스냅샷 목록)를 가리키는 **메타데이터 파일**, 어떤 데이터 파일이 어느 스냅샷에 속하는지를 담은 **매니페스트 파일**(과 그것들을 묶는 매니페스트 리스트), 그리고 실제 **데이터 파일**(Parquet/ORC/Avro). 이 계층 구조와 파일마다 저장된 통계(min/max·null count)가 어떻게 파일 프루닝과 빠른 플래닝을 가능하게 하는지를 익힙니다. 이 그림을 손에 쥐면 이후 스냅샷·진화·compaction이 모두 이 구조 위에 얹힙니다.

- [ ] **3계층 구조**: 메타데이터 파일 → 매니페스트 리스트/매니페스트 → 데이터 파일
- [ ] **스냅샷과 매니페스트**: 각 스냅샷이 참조하는 매니페스트 집합, 파일 추가/삭제의 표현
- [ ] **통계와 프루닝**: 파일 수준 통계(min/max·null)로 스캔을 줄이는 플래닝 최적화

## 3단계: ACID · 스냅샷 · 시간여행 — 트랜잭션과 스냅샷 격리

테이블 포맷이 "레이크에 웨어하우스를 얹는다"는 약속을 지키는 핵심 단계입니다. Iceberg는 메타데이터 포인터를 원자적으로 교체(optimistic concurrency)하여 **커밋의 원자성**을 보장하고, 각 커밋이 새로운 **스냅샷**을 만들기 때문에 읽기는 항상 일관된 한 시점을 봅니다(**스냅샷 격리**). 이 스냅샷 이력 덕분에 특정 시점이나 스냅샷 ID로 과거를 조회하는 **시간여행(time travel)**과 이전 스냅샷으로 되돌리는 **롤백**이 가능합니다. 여기에 동시 쓰기가 충돌할 때의 재시도 모델까지 이해합니다.

- [ ] **원자적 커밋과 격리**: 메타데이터 포인터 스왑 기반 optimistic concurrency, 스냅샷 격리
- [ ] **시간여행과 롤백**: 스냅샷 ID/타임스탬프 조회, 잘못된 커밋의 되돌리기
- [ ] **동시성**: 충돌 감지와 커밋 재시도, 여러 writer가 붙을 때의 동작

## 4단계: 파티션 진화 · 스키마 진화 — 재작성 없는 진화

Iceberg가 Hive 테이블과 결정적으로 갈라지는 지점입니다. Iceberg는 컬럼을 이름이 아니라 **고유 ID**로 추적하기 때문에, 컬럼 추가·삭제·이름 변경·순서 변경 같은 **스키마 진화**를 데이터 재작성 없이 안전하게 수행합니다. 파티션도 마찬가지로, 물리 경로에 파티션 값을 박아 넣는 대신 **숨은 파티셔닝(hidden partitioning)**으로 표현하므로, 파티션 전략 자체를 바꾸는 **파티션 진화**가 기존 데이터를 다시 쓰지 않고도 가능합니다. "테이블을 통째로 재작성하지 않고 진화시킨다"는 이 성질이 왜 대규모 운영에서 결정적인지를 익힙니다.

- [ ] **스키마 진화**: 컬럼 ID 기반 추적, add/drop/rename/reorder의 안전성, full/backfill 없는 변경
- [ ] **숨은 파티셔닝**: 파티션을 물리 경로가 아닌 메타데이터로 표현, 파티션 변환(transform)
- [ ] **파티션 진화**: 기존 데이터 재작성 없이 파티션 전략 바꾸기, 진화 전후 파일의 공존

## 5단계: compaction · 유지보수 — 작은 파일 문제·스냅샷 만료

"돌아가는 테이블"과 "빠르고 저렴하게 운영되는 테이블"은 다릅니다. 스트리밍이나 잦은 소량 쓰기는 **작은 파일**을 양산해 스캔을 느리게 만들고, 커밋마다 쌓이는 스냅샷과 오래된 파일은 스토리지 비용과 메타데이터 부담을 키웁니다. 이 단계에서는 작은 파일을 큰 파일로 합치는 **compaction**(및 데이터 재정렬·클러스터링), 더 이상 필요 없는 스냅샷을 정리하는 **스냅샷 만료(expire snapshots)**, 어떤 스냅샷에서도 참조되지 않는 파일을 지우는 **고아 파일 정리(orphan file removal)** 같은 유지보수 작업을 익힙니다. 이 운영 지식이 있어야 레이크하우스가 오래 건강하게 굴러갑니다.

- [ ] **작은 파일과 compaction**: 작은 파일 문제의 원인과 비용, rewrite/bin-pack·정렬 기반 compaction
- [ ] **스냅샷 만료**: 스냅샷 이력 관리와 만료 정책, 시간여행 보존 기간과의 균형
- [ ] **파일 정리**: 고아 파일 제거, 매니페스트 리라이트, 정기 유지보수 잡 설계

## 6단계: REST Catalog · 거버넌스 — 카탈로그 표준과 접근 제어

테이블이 어디에 있고 누가 무엇을 할 수 있는지를 관리하는 계층입니다. Iceberg 테이블은 **카탈로그**를 통해 이름으로 찾고 커밋을 조율하는데, 초기의 Hive·Hadoop·JDBC·Glue 카탈로그를 넘어 2026년에는 엔진 중립적인 **REST Catalog**가 사실상의 표준 인터페이스로 자리 잡았습니다. 이 단계에서는 카탈로그의 역할, REST Catalog 스펙이 왜 상호운용성의 핵심인지, 그리고 그 위에서 이뤄지는 **거버넌스** — 테이블·네임스페이스 수준의 접근 제어, 자격 증명 벤딩(credential vending), 감사 — 를 다룹니다. 여러 엔진(Spark·Trino·Flink·Snowflake)이 하나의 테이블을 안전하게 공유하는 그림이 여기서 완성됩니다.

- [ ] **카탈로그의 역할**: 테이블 식별·커밋 조율, Hive/Glue/JDBC vs REST Catalog
- [ ] **REST Catalog**: 엔진 중립 표준 인터페이스와 상호운용성, 커밋 프로토콜
- [ ] **거버넌스**: 네임스페이스/테이블 접근 제어, credential vending, 감사와 정책

## 7단계: Iceberg vs Delta vs Hudi vs Paimon — 오픈 테이블 포맷 비교

마지막은 Iceberg를 다른 포맷들과 나란히 놓고 조망하는 단계입니다. 앞선 여섯 단계에서 익힌 개념(메타데이터 구조·트랜잭션·진화·compaction·카탈로그)을 축으로, **Delta Lake**(트랜잭션 로그 기반, Databricks 생태계), **Apache Hudi**(업서트·증분 처리 강점, copy-on-write vs merge-on-read), **Apache Paimon**(스트리밍 레이크하우스, LSM 기반)이 같은 문제를 어떻게 다르게 푸는지를 비교합니다. 어떤 워크로드(배치 vs 스트리밍, 조회 중심 vs 업서트 중심)에서 어떤 포맷이 유리한지, 그리고 포맷 간 상호운용(예: 하나의 데이터에 여러 포맷 메타데이터를 얹는 접근)의 현황까지 정리하며 시리즈를 마무리합니다.

- [ ] **설계 축으로 비교**: 메타데이터/트랜잭션 모델, 진화, 카탈로그 지원의 포맷별 차이
- [ ] **워크로드 적합성**: 배치 vs 스트리밍, 조회 중심 vs 업서트 중심에서의 선택 기준
- [ ] **생태계와 상호운용**: 엔진·클라우드 채택 현황, 포맷 간 호환·전환 접근

## 핵심 포인트

- **파일은 테이블이 아니다**: 오브젝트 스토리지에 Parquet를 쌓는 것과 신뢰할 수 있는 테이블을 갖는 것은 다릅니다. 테이블 포맷은 그 파일 집합 위에 스냅샷·스키마·통계라는 **메타데이터 계층**을 얹어 원자성·일관성·성능을 부여합니다.
- **메타데이터 구조가 모든 능력의 뿌리다**: ACID·시간여행·진화·프루닝은 모두 Iceberg의 3계층(메타데이터→매니페스트→데이터) 구조에서 나옵니다. 구조를 알면 나머지 기능이 왜 가능한지가 보입니다.
- **재작성 없는 진화가 결정적이다**: 컬럼 ID 추적과 숨은 파티셔닝 덕분에 스키마·파티션을 데이터 재작성 없이 바꿀 수 있습니다. 대규모 운영에서 이 성질 하나가 유지보수 비용을 가릅니다.
- **테이블은 운영해야 건강하다**: compaction·스냅샷 만료·고아 파일 정리 같은 유지보수 없이는 작은 파일과 누적 스냅샷이 성능과 비용을 갉아먹습니다. 운영은 선택이 아니라 설계의 일부입니다.
- **표준(REST Catalog)이 상호운용을 만든다**: 2026년의 레이크하우스는 여러 엔진이 하나의 테이블을 공유하는 세계이고, 그것을 가능하게 하는 것이 엔진 중립적 카탈로그 표준과 그 위의 거버넌스입니다.

## 추천 학습 순서

위 단계 번호 순서대로 진행하는 것을 권합니다.

1. **왜·무엇으로(1~2단계)** — 왜 테이블 포맷이 필요한지 동기를 세우고, Iceberg가 그것을 구현하는 메타데이터·매니페스트 구조를 익힙니다. 이 구조 없이 기능부터 보면 "왜 가능한지"를 놓칩니다.
2. **무엇을 할 수 있나(3~4단계)** — ACID·스냅샷·시간여행과 재작성 없는 진화로, 테이블 포맷이 실제로 어떤 능력을 주는지를 이해합니다.
3. **어떻게 운영·선택하나(5~7단계)** — compaction·유지보수로 테이블을 건강하게 유지하고, REST Catalog·거버넌스로 여러 엔진이 안전하게 공유하게 만든 뒤, 다른 포맷과 비교하며 선택 안목을 완성합니다.

각 단계는 앞 단계의 토대 위에 쌓이므로, 순서대로 정복하며 체크박스를 채워 나가길 권합니다.

## 결론

오픈 테이블 포맷은 "오브젝트 스토리지 위의 값싼 파일들"에 "웨어하우스의 신뢰성"을 얹으려는 시도이고, Apache Iceberg는 2026년 현재 그 시도의 사실상 표준입니다. 개별 기능은 계속 진화하지만, **파일 집합 위에 메타데이터 계층을 얹어 스냅샷으로 관리한다**는 뼈대와 "스키마·파티션을 재작성 없이 진화시킨다"는 원리는 오래 갑니다. 이 7단계를 순서대로 정복하면, Iceberg 테이블의 내부 구조를 읽고, 진화·유지보수를 설계하며, 여러 포맷 사이에서 워크로드에 맞는 선택을 내리는 안목을 갖추게 됩니다.

이 `Lakehouse-Essential` 시리즈는 `Data-Engineering-Essential` 오버뷰가 예고한 심화 스핀오프 중 저장(4단계) 갈래이며, 처리 갈래인 자매 시리즈 [Spark-Essential](/2026/07/12/spark-essential-curriculum.html)과 이어집니다. Spark 시리즈의 마지막 **Iceberg/Delta 연동** 단계가 바로 이 레이크하우스 테이블 포맷을 Spark에서 읽고 쓰는 지점이니, 두 시리즈를 함께 정복하면 "레이크하우스 위에서 처리하는" 그림이 완성됩니다.

### 다음 학습 (Next Learning)

- [데이터 저장(Storage): 웨어하우스·레이크·레이크하우스와 파일·테이블 포맷](/2026/06/25/data-storage.html) — 이 시리즈가 갈라져 나온 오버뷰 4단계, 테이블 포맷의 위치를 복습
- [Data Engineering Essential Curriculum](/2026/06/25/data-engineering-essential-curriculum.html) — 전체 데이터 엔지니어링 로드맵으로 돌아가기
- [Spark Essential Curriculum](/2026/07/12/spark-essential-curriculum.html) — 자매 심화 시리즈, 마지막 단계에서 Iceberg/Delta를 Spark로 다룸
