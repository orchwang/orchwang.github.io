---
layout: post
title: "Stream Processing Essential Curriculum (Apache Flink) — 스트림 처리 심화 커리큘럼"
date: 2026-07-12
categories: [Technology, Data-Engineering]
series: Stream-Processing-Essential
tags: [flink, stream-processing, data-engineering, curriculum]
published: true
banner: wartable
excerpt: "Data-Engineering-Essential 오버뷰의 '처리' 단계에서 개념만 소개한 이벤트 시간·워터마크·윈도잉을 Apache Flink 중심으로 파고드는 심화 스핀오프. 스트림 처리 모델부터 이벤트 시간·워터마크, 상태·체크포인트, exactly-once, 윈도잉·조인·CEP, Flink SQL까지 6단계로 정복하는 학습 로드맵입니다. 도장깨기 방식으로 진행 상황을 추적합니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="Stream-Processing-Essential 시리즈를 한 장으로 정리한 그림. 위쪽은 스트림 처리의 정체성으로, 왼쪽에서 시간축을 따라 이벤트 레코드(작은 사각형들)가 끝없이 흘러 들어오고 하나는 순서가 뒤바뀐 채 늦게 도착한다. 가운데 기울어진 워터마크 선이 마감 시점을 정하면 텀블링 윈도가 닫혀 집계 결과가 나오고, 오른쪽에는 상태 실린더와 체크포인트 스냅샷이 그 상태를 안전하게 지킨다. 아래쪽은 스트림 모델·이벤트 시간과 워터마크·상태와 체크포인트·exactly-once·윈도잉과 조인과 CEP·Flink SQL로 이어지는 6단계 로드맵 타임라인이며, 끝에는 시리즈 완주를 뜻하는 트로피가 놓여 있다." viewBox="0 0 680 360" xmlns="http://www.w3.org/2000/svg">
  <title>Stream Processing Essential — 무한 스트림·워터마크·상태/체크포인트와 6단계 도장깨기 로드맵</title>
  <defs>
    <marker id="stp-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>

  <!-- ===== title ===== -->
  <text x="340" y="24" text-anchor="middle" font-size="17" font-weight="800" fill="currentColor" letter-spacing="1.5">STREAM PROCESSING ESSENTIAL</text>

  <!-- ===== SECTION A: stream identity ===== -->
  <text x="30" y="50" text-anchor="start" font-size="11" font-weight="700" fill="currentColor" opacity="0.72">무한 스트림을 이벤트 시간으로 다루고, 워터마크로 마감하며, 상태를 스냅샷으로 지킨다</text>

  <!-- stream lane + event records -->
  <line x1="28" y1="120" x2="228" y2="120" stroke="var(--secondary-color)" stroke-width="2" opacity="0.55" marker-end="url(#stp-arrow)"/>
  <g fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.4">
    <rect x="36" y="114" width="11" height="11" rx="1.5"/>
    <rect x="62" y="114" width="11" height="11" rx="1.5"/>
    <rect x="88" y="114" width="11" height="11" rx="1.5"/>
    <rect x="150" y="114" width="11" height="11" rx="1.5"/>
    <rect x="178" y="114" width="11" height="11" rx="1.5"/>
    <rect x="204" y="114" width="11" height="11" rx="1.5"/>
  </g>
  <!-- an out-of-order (late) record arriving behind -->
  <rect x="118" y="140" width="11" height="11" rx="1.5" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="1.6" stroke-dasharray="2.5 2"/>
  <path d="M124,140 C124,132 126,128 128,127" fill="none" stroke="var(--accent-color)" stroke-width="1.4" stroke-dasharray="2.5 2" marker-end="url(#stp-arrow)"/>
  <text x="123" y="166" text-anchor="middle" font-size="8" fill="var(--accent-color)" opacity="0.9">지각 도착</text>

  <!-- watermark -->
  <polygon points="248,94 262,99 248,104" fill="var(--secondary-color)"/>
  <line x1="248" y1="96" x2="236" y2="150" stroke="var(--secondary-color)" stroke-width="2.5"/>
  <text x="246" y="88" text-anchor="middle" font-size="10" font-weight="800" fill="var(--secondary-color)">워터마크</text>

  <!-- watermark -> window arrow -->
  <line x1="252" y1="120" x2="272" y2="120" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#stp-arrow)"/>

  <!-- tumbling window (closing) -->
  <rect x="278" y="98" width="66" height="44" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8" stroke-dasharray="4 2.5"/>
  <g fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.2">
    <rect x="288" y="114" width="9" height="9" rx="1"/>
    <rect x="304" y="114" width="9" height="9" rx="1"/>
    <rect x="320" y="114" width="9" height="9" rx="1"/>
  </g>
  <text x="311" y="158" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">텀블링 윈도</text>

  <!-- window -> aggregate arrow -->
  <line x1="346" y1="120" x2="362" y2="120" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#stp-arrow)"/>

  <!-- aggregate result -->
  <rect x="364" y="98" width="66" height="44" rx="4" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2.5"/>
  <text x="397" y="125" text-anchor="middle" font-size="16" font-weight="800" fill="currentColor">&#931;</text>
  <text x="397" y="158" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">집계 결과</text>

  <!-- divider between processing and state -->
  <g stroke="currentColor" stroke-width="0.9" opacity="0.28" stroke-dasharray="2 3">
    <line x1="448" y1="60" x2="448" y2="184"/>
  </g>
  <text x="556" y="50" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor" opacity="0.72">상태 · 체크포인트</text>

  <!-- state cylinder -->
  <path d="M470,98 L470,150 A30,9 0 0 0 530,150 L530,98" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <ellipse cx="500" cy="98" rx="30" ry="9" fill="var(--bg-panel)" stroke="currentColor" stroke-width="2"/>
  <text x="500" y="128" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">상태</text>
  <text x="500" y="172" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">state 저장</text>

  <!-- cylinder -> checkpoint snapshot arrow -->
  <line x1="532" y1="122" x2="570" y2="122" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#stp-arrow)"/>

  <!-- checkpoint snapshot -->
  <rect x="574" y="98" width="52" height="48" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2.5"/>
  <g fill="var(--bg-light)" stroke="var(--gold)" stroke-width="1.3">
    <rect x="584" y="106" width="13" height="13" rx="1.5"/>
    <rect x="603" y="106" width="13" height="13" rx="1.5"/>
    <rect x="584" y="124" width="13" height="13" rx="1.5"/>
    <rect x="603" y="124" width="13" height="13" rx="1.5"/>
  </g>
  <text x="600" y="172" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">체크포인트</text>

  <!-- ===== divider ===== -->
  <line x1="30" y1="216" x2="650" y2="216" stroke="currentColor" stroke-width="1.4" opacity="0.25"/>

  <!-- ===== SECTION B: 6-step roadmap ===== -->
  <text x="30" y="240" text-anchor="start" font-size="11" font-weight="700" fill="currentColor" opacity="0.72">6단계 로드맵 — 본질 → 정확성 → 표현력, 그리고 완주</text>

  <!-- act labels + underlines -->
  <g font-size="9" font-weight="700" text-anchor="middle">
    <text x="114" y="266" fill="var(--secondary-color)">본질 (1–2)</text>
    <text x="306" y="266" fill="var(--accent-color)">정확성 (3–4)</text>
    <text x="498" y="266" fill="var(--gold)">표현력 (5–6)</text>
  </g>
  <g stroke-width="2" opacity="0.45">
    <line x1="52" y1="272" x2="176" y2="272" stroke="var(--secondary-color)"/>
    <line x1="244" y1="272" x2="368" y2="272" stroke="var(--accent-color)"/>
    <line x1="436" y1="272" x2="560" y2="272" stroke="var(--gold)"/>
  </g>

  <!-- baseline -->
  <line x1="50" y1="304" x2="562" y2="304" stroke="currentColor" stroke-width="2" opacity="0.4"/>

  <!-- stamps -->
  <g font-weight="800" text-anchor="middle">
    <!-- 1 -->
    <circle cx="66" cy="304" r="15" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2.5"/>
    <text x="66" y="308" font-size="12" fill="currentColor">1</text>
    <text x="66" y="334" font-size="8.5" font-weight="700" fill="currentColor">스트림 모델</text>
    <!-- 2 -->
    <circle cx="162" cy="304" r="15" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2.5"/>
    <text x="162" y="308" font-size="12" fill="currentColor">2</text>
    <text x="162" y="334" font-size="8.5" font-weight="700" fill="currentColor">이벤트·워터마크</text>
    <!-- 3 -->
    <circle cx="258" cy="304" r="15" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.5"/>
    <text x="258" y="308" font-size="12" fill="currentColor">3</text>
    <text x="258" y="334" font-size="8.5" font-weight="700" fill="currentColor">상태·체크포인트</text>
    <!-- 4 -->
    <circle cx="354" cy="304" r="15" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.5"/>
    <text x="354" y="308" font-size="12" fill="currentColor">4</text>
    <text x="354" y="334" font-size="8.5" font-weight="700" fill="currentColor">exactly-once</text>
    <!-- 5 -->
    <circle cx="450" cy="304" r="15" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="2.5"/>
    <text x="450" y="308" font-size="12" fill="currentColor">5</text>
    <text x="450" y="334" font-size="8.5" font-weight="700" fill="currentColor">윈도·조인·CEP</text>
    <!-- 6 -->
    <circle cx="546" cy="304" r="15" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="3"/>
    <text x="546" y="308" font-size="12" fill="currentColor">6</text>
    <text x="546" y="334" font-size="8.5" font-weight="700" fill="currentColor">Flink SQL</text>
  </g>

  <!-- arrow to trophy -->
  <line x1="564" y1="304" x2="598" y2="304" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#stp-arrow)"/>

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
<figcaption>이 시리즈를 한 장으로 — 무한 스트림·워터마크·윈도 집계와 상태·체크포인트, 그리고 스트림 모델부터 Flink SQL까지 6단계 도장깨기 로드맵과 완주 트로피</figcaption>
</figure>

## 소개

`Data-Engineering-Essential` 오버뷰 시리즈는 데이터 엔지니어링 수명주기 전체의 **지도**를 그렸습니다. 그 5단계 [데이터 변환·처리(Processing)](/2026/06/25/data-processing.html)에서 우리는 스트림 처리를 다루며 **이벤트 시간 vs 처리 시간**, **워터마크**, **윈도잉**을 짚었습니다. 다만 거기서는 "처리 지도 안에서 스트림 엔진이 어디에 있는가"까지만, 즉 이 개념들을 **소개 수준**으로만 다루고 그 깊은 이야기는 별도 시리즈로 미뤄 두었습니다. 이 글이 바로 그 예고된 심화 스핀오프, `Stream-Processing-Essential` 시리즈의 **마스터 로드맵**입니다. 스트림 처리의 사실상 표준 엔진인 **Apache Flink**를 중심으로, 오버뷰가 개념만 소개한 것들을 실제로 손에 잡히게 파고듭니다.

배치 처리는 "끝이 있는 데이터"를 다룹니다. 파일이 다 모이면 처리를 시작하고, 다 처리하면 끝납니다. 반면 스트림 처리는 **끝이 없는 데이터** — 계속 흘러 들어오고, 종종 순서가 뒤바뀌며, 언제 "다 왔다"고 말할 수 있는지조차 불분명한 데이터 — 를 다룹니다. 이 근본적인 차이 때문에 스트림 처리에는 배치에 없던 고유한 문제들이 생깁니다. 언제 집계를 마감할 것인가(워터마크), 처리 중인 상태를 어떻게 장애로부터 지킬 것인가(상태·체크포인트), 장애가 나도 결과를 정확히 한 번만 반영하려면 어떻게 해야 하는가(exactly-once)가 그것입니다. 이 시리즈는 바로 그 문제들을 정면으로 다룹니다.

> **범위 구분 — Kafka Streams와의 경계**: 스트림 처리는 자매 시리즈 후보인 `Kafka-Essential`의 "Kafka Streams" 편과 주제가 인접합니다. 두 시리즈의 초점은 다릅니다. Kafka Streams는 Kafka에 밀착한 **라이브러리형** 스트림 처리이고, 이 `Stream-Processing-Essential` 시리즈는 소스·싱크에 얽매이지 않는 **Flink 중심의 범용 스트림 처리 엔진** — 무거운 상태 관리, 정교한 이벤트 시간 처리, exactly-once, CEP까지 아우르는 독립 실행 엔진 — 에 초점을 둡니다. Kafka 시리즈가 "Kafka 생태계 안에서의 스트림 처리"를 맡는다면, 이 시리즈는 "스트림 처리 그 자체의 원리와 엔진"을 맡습니다.

이 시리즈는 그 원리 속으로 들어갑니다. **스트림 처리 모델**(무한 데이터를 어떻게 볼 것인가)에서 출발해, 지연·역순 도착을 다스리는 **이벤트 시간·워터마크**로 "언제 계산하는가"를 잡고, **상태·체크포인트**와 **exactly-once**로 "장애가 나도 정확한가"를 보장한 뒤, **윈도잉·조인·CEP**로 표현력을 넓히고, 마지막으로 **Flink SQL**로 이 모든 것을 선언적으로 다루는 것으로 마무리합니다. 각 단계를 정복할 때마다 상세 딥다이브 포스트를 작성하고 체크박스를 채우는 **도장깨기** 방식으로 진행합니다.

<figure class="post-figure">
<svg role="img" aria-label="이 시리즈의 학습 여정을 세 막으로 나눈 개념도. 제1막 스트림의 본질은 스트림 처리 모델과 이벤트 시간·워터마크(1~2단계)로 무한하고 순서가 흐트러진 데이터를 시간 기준으로 다루고, 제2막 정확성의 기둥은 상태·체크포인트와 exactly-once(3~4단계)로 상태를 저장하고 스냅샷으로 정확히 한 번을 보장하며, 제3막 표현력은 윈도잉·조인·CEP와 Flink SQL(5~6단계)로 무엇을 계산할지를 점점 더 선언적으로 표현한다. 세 막은 왼쪽에서 오른쪽으로 굵은 화살표로 이어진다." viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg">
  <title>세 막으로 보는 스트림 처리 학습 여정 — 스트림의 본질 → 정확성의 기둥 → 표현력</title>
  <defs>
    <marker id="stl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--gold)"/>
    </marker>
  </defs>

  <!-- title -->
  <text x="340" y="26" text-anchor="middle" font-size="15" font-weight="800" fill="currentColor">세 막으로 보는 학습 여정</text>

  <!-- ===== ACT 1: 스트림의 본질 (steps 1-2) ===== -->
  <rect x="16" y="52" width="192" height="210" rx="6" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2.5"/>
  <circle cx="34" cy="74" r="12" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="34" y="78" text-anchor="middle" font-size="11" font-weight="800" fill="currentColor">1</text>
  <text x="124" y="78" text-anchor="middle" font-size="13" font-weight="800" fill="var(--secondary-color)">스트림의 본질</text>
  <text x="112" y="96" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.72">무한·역순 데이터를 시간 기준으로</text>
  <!-- stream + watermark icon -->
  <line x1="72" y1="138" x2="152" y2="138" stroke="currentColor" stroke-width="1.4" opacity="0.4"/>
  <g fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.4">
    <rect x="76" y="133" width="10" height="10" rx="1"/>
    <rect x="94" y="133" width="10" height="10" rx="1"/>
    <rect x="128" y="133" width="10" height="10" rx="1"/>
  </g>
  <rect x="108" y="150" width="10" height="10" rx="1" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="1.4" stroke-dasharray="2 2"/>
  <line x1="150" y1="124" x2="140" y2="156" stroke="var(--secondary-color)" stroke-width="2.5"/>
  <!-- step chips -->
  <g font-size="9.5" font-weight="700">
    <rect x="34" y="180" width="160" height="22" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1" opacity="0.9"/>
    <circle cx="48" cy="191" r="7" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.6"/><text x="48" y="194" text-anchor="middle" font-size="8" fill="currentColor">1</text><text x="62" y="194" fill="currentColor">스트림 처리 모델</text>
    <rect x="34" y="206" width="160" height="22" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1" opacity="0.9"/>
    <circle cx="48" cy="217" r="7" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.6"/><text x="48" y="220" text-anchor="middle" font-size="8" fill="currentColor">2</text><text x="62" y="220" fill="currentColor">이벤트 시간·워터마크</text>
  </g>

  <!-- arrow ACT1 -> ACT2 -->
  <line x1="212" y1="157" x2="238" y2="157" stroke="var(--gold)" stroke-width="3" marker-end="url(#stl-arrow)"/>

  <!-- ===== ACT 2: 정확성의 기둥 (steps 3-4) ===== -->
  <rect x="242" y="52" width="192" height="210" rx="6" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.5"/>
  <circle cx="260" cy="74" r="12" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="260" y="78" text-anchor="middle" font-size="11" font-weight="800" fill="currentColor">2</text>
  <text x="350" y="78" text-anchor="middle" font-size="13" font-weight="800" fill="var(--accent-color)">정확성의 기둥</text>
  <text x="338" y="96" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.72">상태를 저장하고 정확히 한 번</text>
  <!-- state cylinder + check icon -->
  <path d="M312,124 L312,150 A17,5 0 0 0 346,150 L346,124" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="2"/>
  <ellipse cx="329" cy="124" rx="17" ry="5" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <path d="M322,138 l5,6 l10,-12" fill="none" stroke="var(--accent-color)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- step chips -->
  <g font-size="9.5" font-weight="700">
    <rect x="260" y="180" width="160" height="22" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1" opacity="0.9"/>
    <circle cx="274" cy="191" r="7" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="1.6"/><text x="274" y="194" text-anchor="middle" font-size="8" fill="currentColor">3</text><text x="288" y="194" fill="currentColor">상태·체크포인트</text>
    <rect x="260" y="206" width="160" height="22" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1" opacity="0.9"/>
    <circle cx="274" cy="217" r="7" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="1.6"/><text x="274" y="220" text-anchor="middle" font-size="8" fill="currentColor">4</text><text x="288" y="220" fill="currentColor">exactly-once</text>
  </g>

  <!-- arrow ACT2 -> ACT3 -->
  <line x1="438" y1="157" x2="464" y2="157" stroke="var(--gold)" stroke-width="3" marker-end="url(#stl-arrow)"/>

  <!-- ===== ACT 3: 표현력 (steps 5-6) ===== -->
  <rect x="468" y="52" width="192" height="210" rx="6" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="2.5"/>
  <circle cx="486" cy="74" r="12" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="486" y="78" text-anchor="middle" font-size="11" font-weight="800" fill="currentColor">3</text>
  <text x="576" y="78" text-anchor="middle" font-size="13" font-weight="800" fill="var(--gold)">표현력</text>
  <text x="564" y="96" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.72">점점 더 선언적으로 표현</text>
  <!-- window -> SQL icon -->
  <g fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="1.8">
    <rect x="530" y="122" width="22" height="20" rx="2"/>
    <rect x="558" y="122" width="22" height="20" rx="2"/>
  </g>
  <text x="564" y="162" text-anchor="middle" font-size="12" font-weight="800" fill="var(--gold)">SQL</text>
  <!-- step chips -->
  <g font-size="9.5" font-weight="700">
    <rect x="486" y="180" width="160" height="22" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1" opacity="0.9"/>
    <circle cx="500" cy="191" r="7" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="1.6"/><text x="500" y="194" text-anchor="middle" font-size="8" fill="currentColor">5</text><text x="514" y="194" fill="currentColor">윈도잉·조인·CEP</text>
    <rect x="486" y="206" width="160" height="22" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1" opacity="0.9"/>
    <circle cx="500" cy="217" r="7" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="1.6"/><text x="500" y="220" text-anchor="middle" font-size="8" fill="currentColor">6</text><text x="514" y="220" fill="currentColor">Flink SQL</text>
  </g>
</svg>
<figcaption>학습 스파인을 세 막으로 — ① 스트림의 본질(스트림 모델·이벤트 시간·워터마크) → ② 정확성의 기둥(상태·체크포인트·exactly-once) → ③ 표현력(윈도잉·조인·CEP·Flink SQL)</figcaption>
</figure>

## 학습 진행 현황

> 완료한 항목에는 상세 포스트 링크가 연결됩니다. 학습이 진행될 때마다 체크박스와 진행률을 갱신합니다.

- 현재 완료한 항목: **6개**
- 전체 항목: **6개**
- 진행률: **100%**

## 1단계: 스트림 처리 모델 — 무한 스트림과 배치와의 차이

**무엇을 배우나**: 배치가 다루는 "끝이 있는(bounded) 데이터"와 스트림이 다루는 "끝이 없는(unbounded) 데이터"의 근본적 차이를 잡고, Flink가 스트림을 어떻게 실행 모델로 표현하는지 — 데이터플로우 그래프, 연산자 체이닝, 병렬성 — 를 익힙니다. 배치를 "유한한 스트림"으로 보는 통합 관점까지 이해하면 이후 모든 단계의 토대가 됩니다.

- [x] **스트림 처리 모델**: bounded vs unbounded 데이터, 데이터플로우 그래프와 연산자 병렬성, 배치를 스트림의 특수 사례로 보는 통합 관점 — [[Flink 스트림 처리 모델](/2026/07/22/flink-stream-processing-model.html)]

## 2단계: 이벤트 시간·워터마크 심화 — 지연·순서 뒤바뀜 처리

**무엇을 배우나**: 오버뷰에서 개념만 소개한 **이벤트 시간(event time) vs 처리 시간(processing time)**을 실제 문제 수준으로 파고듭니다. 네트워크 지연으로 이벤트가 **늦게, 또 순서가 뒤바뀐 채** 도착할 때, **워터마크**가 어떻게 "이 시각까지의 데이터는 사실상 다 왔다"를 선언하며 집계 마감 시점을 정하는지, 그리고 지각 데이터(late data)와 allowed lateness를 어떻게 처리하는지를 익힙니다.

- [x] **이벤트 시간·워터마크**: event time vs processing time, 워터마크 생성 전략, 순서 뒤바뀜(out-of-order)과 지각 데이터·allowed lateness 처리 — [[Flink 이벤트 시간·워터마크](/2026/07/22/flink-event-time-watermark.html)]

## 3단계: 상태(state)·체크포인트 — 상태 저장과 장애 복구

**무엇을 배우나**: 스트림 처리를 배치와 결정적으로 가르는 지점 — **상태**입니다. 집계·조인·중복 제거는 모두 "지금까지 본 것"을 기억해야 하고, 그 상태는 장애가 나도 사라지면 안 됩니다. keyed state와 operator state, 상태 백엔드(RocksDB 등), 그리고 분산 스냅샷으로 상태를 안전하게 저장·복구하는 **체크포인트(Chandy-Lamport 기반)**와 세이브포인트를 익힙니다.

- [x] **상태·체크포인트**: keyed/operator state와 상태 백엔드, 분산 스냅샷 기반 체크포인트, 세이브포인트와 장애 복구 — [[Flink 상태와 체크포인트](/2026/07/22/flink-state-checkpoint.html)]

## 4단계: exactly-once·정확성 — 체크포인트 기반 정확히 한 번

**무엇을 배우나**: "장애가 나도 결과가 정확한가"에 답하는 단계입니다. at-most-once·at-least-once·**exactly-once**의 차이를 명확히 하고, Flink가 체크포인트와 **트랜잭셔널 싱크(two-phase commit)**를 결합해 어떻게 종단 간(end-to-end) 정확히 한 번을 보장하는지를 익힙니다. "정확히 한 번 처리"와 "정확히 한 번 반영(효과)"의 구분이 핵심입니다.

- [x] **exactly-once·정확성**: 전달 보장 3종의 차이, 체크포인트 + 2PC 싱크로 만드는 end-to-end exactly-once, 처리 vs 효과의 정확성 — [[Flink exactly-once](/2026/07/22/flink-exactly-once.html)]

## 5단계: 윈도잉·조인·CEP — 텀블링/슬라이딩/세션·스트림 조인·복합 이벤트

**무엇을 배우나**: 스트림에서 "무엇을 계산할 것인가"의 표현력을 넓히는 단계입니다. 시간을 구간으로 자르는 **윈도잉**(텀블링·슬라이딩·세션 윈도), 두 스트림을 시간 기준으로 잇는 **스트림 조인**(window join·interval join), 그리고 "A 다음 3초 안에 B가 오면 경보" 같은 패턴을 탐지하는 **복합 이벤트 처리(CEP)**를 익힙니다. 이벤트 시간·워터마크·상태가 여기서 하나로 맞물립니다.

- [x] **윈도잉·조인·CEP**: 텀블링/슬라이딩/세션 윈도, window/interval 스트림 조인, 패턴 매칭 기반 복합 이벤트 처리(CEP) — [[Flink 윈도잉·조인·CEP](/2026/07/22/flink-windowing-join-cep.html)]

## 6단계: Flink SQL — 선언적 스트림 처리

**무엇을 배우나**: 마지막은 앞의 모든 개념을 **선언적으로** 다루는 단계입니다. 스트림을 계속 갱신되는 테이블로 보는 **dynamic table**과 stream-table 이원성, 이벤트 시간·워터마크·윈도를 SQL 구문으로 표현하기, 그리고 continuous query가 어떻게 결과를 갱신(changelog)하는지를 익힙니다. 저수준 API로 이해한 원리를 SQL이라는 접근하기 쉬운 표면으로 끌어올리며 시리즈를 마무리합니다.

- [x] **Flink SQL**: dynamic table과 stream-table 이원성, SQL에서의 이벤트 시간·워터마크·윈도, continuous query와 changelog 결과 — [[Flink SQL](/2026/07/22/flink-sql.html)]

## 핵심 포인트

- **끝이 없다는 것이 모든 것을 바꾼다**: 배치와 스트림의 차이는 규모가 아니라 **경계**입니다. 데이터에 끝이 없다는 사실 하나에서 워터마크·상태·exactly-once라는 스트림 고유의 문제가 전부 파생됩니다.
- **시간에는 두 종류가 있다**: 이벤트가 "실제로 일어난 시각"(이벤트 시간)과 "시스템이 본 시각"(처리 시간)은 다릅니다. 정확한 스트림 처리는 거의 항상 이벤트 시간 위에서, 워터마크로 지연을 다스리며 이루어집니다.
- **상태가 스트림 처리의 심장이다**: 의미 있는 스트림 연산은 대부분 상태를 가집니다. 그 상태를 체크포인트로 안전하게 지키는 능력이 곧 장애 복구와 정확성의 토대입니다.
- **exactly-once는 마법이 아니라 설계다**: 정확히 한 번은 체크포인트와 트랜잭셔널 싱크의 협업으로 만들어집니다. "처리를 한 번"이 아니라 "효과를 한 번"이 목표라는 점을 이해하는 것이 핵심입니다.
- **원리를 알면 SQL이 보인다**: Flink SQL의 편리함 뒤에는 dynamic table·워터마크·상태라는 저수준 원리가 그대로 돌아갑니다. 아래를 이해한 사람만이 SQL 스트림 쿼리의 동작을 정확히 예측할 수 있습니다.

## 추천 학습 순서

위 단계 번호 순서대로 진행하는 것을 권합니다.

1. **스트림의 본질(1~2단계)** — 무한 스트림을 어떻게 보는가(모델), 그리고 언제 계산하는가(이벤트 시간·워터마크). 이 토대 없이 상태나 정확성부터 손대면 증상만 쫓게 됩니다.
2. **정확성의 기둥(3~4단계)** — 상태·체크포인트로 "장애가 나도 잃지 않는가"를, exactly-once로 "정확히 한 번인가"를 보장합니다. 스트림 처리를 신뢰할 수 있게 만드는 가장 어렵고 가장 중요한 단계입니다.
3. **표현력(5~6단계)** — 윈도잉·조인·CEP로 계산의 표현력을 넓히고, Flink SQL로 그 모든 것을 선언적으로 다루며 마무리합니다.

각 단계는 앞 단계의 토대 위에 쌓이므로, 순서대로 정복하며 체크박스를 채워 나가길 권합니다.

## 결론

스트림 처리는 "데이터를 실시간으로 처리한다"는 매력적인 문장 뒤에, **끝이 없는 데이터를 시간 기준으로, 상태를 지키며, 정확히 한 번 처리한다**는 정교한 공학이 숨어 있는 분야입니다. 개별 API는 계속 진화하지만, 이벤트 시간·워터마크·상태·체크포인트라는 뼈대와 "무한 데이터가 모든 문제를 만든다"는 원리는 오래 갑니다. 이 6단계를 순서대로 정복하면, Flink 잡의 워터마크와 상태·체크포인트를 읽고 지연·정확성 문제를 짚어내는 안목, 그리고 저수준 API에서 Flink SQL까지 스트림 처리를 자유롭게 오르내리는 실무 감각을 갖추게 됩니다.

이 `Stream-Processing-Essential` 시리즈는 `Data-Engineering-Essential` 오버뷰가 예고한 심화 스핀오프 중 **처리(스트림) 축**을 맡습니다. 배치 축을 맡는 자매 시리즈 [Spark-Essential](/2026/07/12/spark-essential-curriculum.html)의 5단계 **Spark Structured Streaming**이 "배치와 통합된 스트림"을 다룬다면, 이 시리즈는 **스트림 네이티브 엔진**의 원리를 다룹니다 — 둘을 함께 보면 스트림 처리의 두 접근을 입체적으로 이해할 수 있습니다. 오버뷰가 함께 약속한 수집의 **Kafka**(Kafka Streams 편에서 이 시리즈와 경계를 나눔) 역시 별도의 `*-Essential` 시리즈로 이어질 예정입니다.

## 6단계 stage 목록

이 시리즈의 6개 stage deep-dive는 모두 작성·완결되었습니다. 단계 번호 순서대로 읽되, 3·4단계(정확성의 기둥)부터는 앞 단계의 토대 위에서 작동하므로 순서를 꼭 지켜 주길 권합니다.

- [1단계 — Flink 스트림 처리 모델](/2026/07/22/flink-stream-processing-model.html)
- [2단계 — Flink 이벤트 시간·워터마크](/2026/07/22/flink-event-time-watermark.html)
- [3단계 — Flink 상태와 체크포인트](/2026/07/22/flink-state-checkpoint.html)
- [4단계 — Flink exactly-once](/2026/07/22/flink-exactly-once.html)
- [5단계 — Flink 윈도잉·조인·CEP](/2026/07/22/flink-windowing-join-cep.html)
- [6단계 — Flink SQL](/2026/07/22/flink-sql.html)

### 다음 학습 (Next Learning)

- [데이터 변환·처리(Processing): 배치·스트림 엔진과 SQL 변환](/2026/06/25/data-processing.html) — 이 시리즈가 갈라져 나온 오버뷰 5단계, 이벤트 시간·워터마크·윈도잉의 개념 소개를 복습
- [Data Engineering Essential Curriculum](/2026/06/25/data-engineering-essential-curriculum.html) — 전체 데이터 엔지니어링 로드맵으로 돌아가기
- [Spark Essential Curriculum](/2026/07/12/spark-essential-curriculum.html) — 자매 시리즈. 5단계 Spark Structured Streaming에서 "배치와 통합된 스트림" 접근을 비교
