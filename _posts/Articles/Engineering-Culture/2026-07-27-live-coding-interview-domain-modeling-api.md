---
layout: post
title: "라이브 코딩 면접 회고: 30분 만에 도메인 모델링 API를 끝내야 했던 신입의 기록"
date: 2026-07-27
categories: [Articles, Engineering-Culture]
tags: [articles, live-coding, interview, domain-modeling, ddd, spring, backend, retrospective]
published: true
excerpt: "Velog의 hyeoks(@ochhs0829)가 쓴 '라이브 코딩 면접 회고 (도메인 모델링, api)'를 분석한다. 백엔드 신입 1차 면접에서 30분짜리 '결제 시 포인트 차감 API'를 풀며 정적 팩토리·비관적 락·멱등성 키로 도메인을 짜고도 동작 검증 한 번 못 한 채 끝난 기록이다. '내 결정의 이유를 말로 옮길 언어가 준비돼 있었나', 'AI와 함께 짠 코드를 내가 끝까지 설명할 수 있었나'라는 질문이 핵심이다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="30분짜리 라이브 코딩 면접이 의사결정, 정제, 검증 세 구간으로 나뉜 가로 타임라인. 0분에서 10분까지 의사결정 칸에는 도메인 객체 다이어그램과 정적 팩토리 노트가 빼곡히 채워져 있고, 10분에서 25분까지 정제 칸에는 비관적 락, 멱등성 키, 예외 클래스, 응답 분기 코드가 겹겹이 쌓여 있다. 25분에서 30분까지 마지막 5분 동작 검증 칸은 텅 비어 있고 그 위에 큰 X와 'bootRun + curl 없음'이라는 빨간 글자가 적혀 있다. 타임라인 위에는 0, 10, 25, 30분 눈금과 '면접 30분'이라는 제목이 있다." viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg">
  <title>30분 라이브 코딩 면접 — 의사결정·정제에는 시간을 다 쓰고 마지막 5분 동작 검증이 비어 있다</title>

  <!-- ground baseline -->
  <line x1="24" y1="318" x2="736" y2="318" stroke="currentColor" stroke-width="1.5" opacity="0.45"/>

  <!-- ===== TOP TITLE / TIME BAR ===== -->
  <text x="380" y="34" text-anchor="middle" font-size="14" fill="currentColor" font-weight="700">라이브 코딩 면접 30분 · 의사결정 → 정제 → 검증</text>

  <!-- horizontal timeline ruler -->
  <line x1="40" y1="58" x2="720" y2="58" stroke="currentColor" stroke-width="2"/>
  <!-- tick marks -->
  <g stroke="currentColor" stroke-width="2">
    <line x1="40" y1="52" x2="40" y2="64"/>
    <line x1="240" y1="52" x2="240" y2="64"/>
    <line x1="600" y1="52" x2="600" y2="64"/>
    <line x1="720" y1="52" x2="720" y2="64"/>
  </g>
  <g font-size="11" fill="currentColor" text-anchor="middle">
    <text x="40" y="48">0분</text>
    <text x="240" y="48">10분</text>
    <text x="600" y="48">25분</text>
    <text x="720" y="48">30분</text>
  </g>

  <!-- ===== ZONE 1 — DECISION (0 → 10 min) ===== -->
  <rect x="40" y="78" width="200" height="210" rx="3" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2.5"/>
  <text x="140" y="98" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700">의사결정</text>
  <text x="140" y="114" text-anchor="middle" font-size="10" fill="var(--text-light)">0 — 10분</text>

  <!-- domain sketch: Order + UserPoint boxes + static factory note -->
  <g stroke="currentColor" stroke-width="1.6" fill="none">
    <rect x="60" y="130" width="60" height="34"/>
    <rect x="160" y="130" width="60" height="34"/>
    <line x1="120" y1="147" x2="160" y2="147"/>
  </g>
  <text x="90" y="151" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">Order</text>
  <text x="190" y="151" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">UserPoint</text>

  <!-- static factory note (pixel ledger) -->
  <g>
    <rect x="56" y="180" width="170" height="38" rx="2" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.5" stroke-dasharray="4 3"/>
    <text x="64" y="196" font-size="9" fill="currentColor" font-weight="700">create()</text>
    <text x="64" y="210" font-size="8" fill="currentColor" opacity="0.85">usedPoint = 0</text>
  </g>

  <!-- ledger / ledger-noted cue -->
  <text x="140" y="234" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8">정적 팩토리 · 불변 규칙</text>
  <text x="140" y="250" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8">응집된 도메인 검증</text>
  <text x="140" y="266" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8">트랜잭션 경계</text>
  <text x="140" y="282" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8">…질문 4개</text>

  <!-- ===== ZONE 2 — REFINEMENT (10 → 25 min) — densest ===== -->
  <rect x="240" y="78" width="360" height="210" rx="3" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="2.5"/>
  <text x="420" y="98" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700">정제 (over-engineering)</text>
  <text x="420" y="114" text-anchor="middle" font-size="10" fill="var(--text-light)">10 — 25분 · 15분</text>

  <!-- pessimistic lock block -->
  <g>
    <rect x="252" y="128" width="160" height="42" rx="2" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5"/>
    <text x="262" y="144" font-size="9" fill="currentColor" font-weight="700">@Lock(PESSIMISTIC_WRITE)</text>
    <text x="262" y="158" font-size="8" fill="currentColor" opacity="0.85">select ... for update</text>
    <text x="262" y="166" font-size="8" fill="currentColor" opacity="0.85">동시 요청 두 층 방어</text>
  </g>

  <!-- idempotency key block -->
  <g>
    <rect x="420" y="128" width="172" height="42" rx="2" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5"/>
    <text x="430" y="144" font-size="9" fill="currentColor" font-weight="700">UNIQUE(order_id) · 멱등 키</text>
    <text x="430" y="158" font-size="8" fill="currentColor" opacity="0.85">user_id + product_id</text>
    <text x="430" y="166" font-size="8" fill="currentColor" opacity="0.85">point_history 이중 차단</text>
  </g>

  <!-- exception class stack (6개) -->
  <g>
    <text x="256" y="188" font-size="9" fill="currentColor" font-weight="700">예외 클래스 6개</text>
    <g font-size="8" fill="currentColor" opacity="0.9">
      <rect x="256" y="194" width="78" height="14" rx="1" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1"/>
      <text x="295" y="204" text-anchor="middle">PointLack</text>
      <rect x="338" y="194" width="78" height="14" rx="1" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1"/>
      <text x="377" y="204" text-anchor="middle">OrderLocked</text>
      <rect x="420" y="194" width="78" height="14" rx="1" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1"/>
      <text x="459" y="204" text-anchor="middle">OverPoint</text>
      <rect x="502" y="194" width="90" height="14" rx="1" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1"/>
      <text x="547" y="204" text-anchor="middle">AlreadyApplied</text>
    </g>
    <g font-size="8" fill="currentColor" opacity="0.9">
      <rect x="256" y="212" width="78" height="14" rx="1" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1"/>
      <text x="295" y="222" text-anchor="middle">NotPending</text>
      <rect x="338" y="212" width="78" height="14" rx="1" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1"/>
      <text x="377" y="222" text-anchor="middle">LedgerMismatch</text>
    </g>
  </g>

  <!-- response code branches -->
  <g>
    <text x="256" y="244" font-size="9" fill="currentColor" font-weight="700">응답 분기 (400 / 409 / 422 / 500 …)</text>
    <line x1="256" y1="250" x2="378" y2="268" stroke="currentColor" stroke-width="1.4"/>
    <line x1="378" y1="250" x2="478" y2="268" stroke="currentColor" stroke-width="1.4"/>
    <line x1="478" y1="250" x2="588" y2="268" stroke="currentColor" stroke-width="1.4"/>
    <circle cx="378" cy="250" r="3" fill="currentColor"/>
    <circle cx="478" cy="250" r="3" fill="currentColor"/>
    <text x="317" y="282" font-size="8" fill="currentColor" text-anchor="middle" opacity="0.85">HTTP status</text>
    <text x="428" y="282" font-size="8" fill="currentColor" text-anchor="middle" opacity="0.85">error body</text>
    <text x="533" y="282" font-size="8" fill="currentColor" text-anchor="middle" opacity="0.85">retry hint</text>
  </g>

  <!-- ===== ZONE 3 — VERIFICATION (25 → 30 min) — EMPTY ===== -->
  <rect x="600" y="78" width="120" height="210" rx="3" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="2.5" stroke-dasharray="6 5"/>
  <text x="660" y="98" text-anchor="middle" font-size="12" fill="var(--accent-color)" font-weight="700">동작 검증</text>
  <text x="660" y="114" text-anchor="middle" font-size="10" fill="var(--text-light)">25 — 30분</text>

  <!-- "empty" placeholder: faded bootRun + curl lines, struck through -->
  <g font-size="9" fill="currentColor" opacity="0.45" text-decoration="line-through">
    <text x="612" y="148">$ bootRun</text>
    <text x="612" y="166">$ curl POST ...</text>
    <text x="612" y="184">$ 200 OK ?</text>
  </g>

  <!-- BIG X mark over the empty zone -->
  <g stroke="var(--accent-color)" stroke-width="5" stroke-linecap="square">
    <line x1="624" y1="200" x2="700" y2="266"/>
    <line x1="700" y1="200" x2="624" y2="266"/>
  </g>

  <!-- "X bootRun + curl" stamp inside the empty box -->
  <text x="660" y="296" text-anchor="middle" font-size="10.5" fill="var(--accent-color)" font-weight="700">X bootRun + curl</text>

  <!-- ===== TIME LABEL / CAPTION ROW ===== -->
  <text x="380" y="346" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.85">시간 배분의 균형이 무너진 30분 — 정제는 끝까지 했지만, 동작 확인 한 번 없이 끝났다</text>
</svg>
<figcaption>30분 면접을 가로로 펼친 한 장 — 의사결정(0–10분)과 정제(10–25분)에 시간을 다 써, 마지막 5분 '동작 검증' 칸이 텅 비어 있다.</figcaption>
</figure>

## 원문 정보

> - **제목**: 라이브 코딩 면접 회고 (도메인 모델링, api)
> - **출처**: hyeoks (@ochhs0829) — Velog
> - **발행**: 2026-05-18 · 약 3분 분량
> - **원문 링크**: <https://velog.io/@ochhs0829/라이브-코딩-면접-회고-도메인-모델링-api>

(같은 작성자(hyeoks)가 직전에 Velog에 쓴 '백엔드 신입 기술 전화면접 복기 — 받은 질문과 놓친 답변들'(2026-07-05)과 짝을 이루는, 라이브 코딩 버전의 회고. 전화면접 편은 위키에는 아직 옮겨 오지 않았다.)

## 한 줄 요약 (TL;DR)

결제 시 포인트 차감 API를 30분 안에 만들어야 하는 라이브 코딩에서, **도메인 모델링은 잘 짰지만 끝까지 동작을 검증하지 못한 채 시간이 끝난** 신입의 솔직한 회고다. 4번의 Q&A에서 드러난 약점은 "내 결정의 이유를 말로 옮길 언어가 정리돼 있지 않았다"는 한 문장으로 수렴한다 — AI와 함께 짠 코드를 끝까지 본인 입으로 설명하지 못했다는 것.

## 왜 이 글을 골랐나

이 위키에는 [DDD](/2026/06/19/domain-driven-design.html)와 [아키텍처](/2026/06/19/architecture-essential-curriculum.html) 관련 정적 콘텐츠는 이미 있지만, **실제 면접에서 DDD 사고방식이 어떻게 작동하고 어떻게 무너지는지**를 1인칭으로 풀어낸 기록은 없었다. 같은 작성자(hyeoks)의 직전 글인 '백엔드 신입 기술 전화면접 복기'(2026-07-05, Velog)가 전화면접 편이었다면, 이 글은 라이브 코딩 편이라 둘을 나란히 두면 "신입 1차 면접"이 어떤 두 트랙으로 굴러가는지 거의 전모가 그려진다.

게다가 이 글은 **2026년 면접관들이 실제로 던지는 질문과, 신입이 실제로 약하게 답하는 부분**을 보여 준다. AI 도구 사용이 허용된 환경에서 코드를 짜는 것보다 *"왜 그렇게 짰는가"*를 끝까지 말하는 것이 더 어려운 문제라는 사실이 면접관-후보 양쪽 모두에게 분명해진다. DDD를 공부하는 사람뿐 아니라 코딩 면접을 준비하는 모든 이에게 실전 노하우로 읽힌다.

## 핵심 내용

### 받은 문제와 채점 기준

문제는 한 줄이다: **결제 시 사용자가 보유한 포인트를 사용해 주문 금액을 차감하는 API**. DB 모델은 없다고 가정하고, AI 도구 사용은 자유, 시간은 30분. 그런데 채점 포인트는 다섯 가지로 꽤 빡빡하다 — 트랜잭션 경계, 포인트 잔액 차감 방식, 주문 상태 변경 방식, **동시 요청 방어 방식**, **실패 처리 방식**. 30분짜리 문제에 들어 있는 무게는 결코 가볍지 않다.

### 어떻게 풀었나 — 도메인부터 짜는 선택

저자는 즉시 Service 계층부터 짜지 않고 도메인부터 그렸다. `Order`와 `UserPoint`를 **정적 팩토리**(`create()`, `restore()`)로 만들고, 생성자는 `@AllArgsConstructor(access = PRIVATE)`로 막아서 두 정적 팩토리만 외부 진입점이 되게 했다. 이 선택의 의도는 명확하다 — `create()` 안에 *"usedPoint = 0, status = PAYMENT_PENDING"* 같은 **불변 규칙을 코드 차원에서 강제**하기 위해서다. Builder 패턴도 고민했지만, *신규 생성*과 *DB 복원*의 분리는 의미 있는 이름(정적 팩토리)이 더 어울린다는 판단이었다.

```java
public static Order create(Long userId, Long totalAmount) {
    return new Order(null, userId, totalAmount, 0L, OrderStatus.PAYMENT_PENDING);
}
```

검증 로직은 도메인 객체 안에 응집시켰다. Service는 흐름만 조립하고, *"포인트가 0 이하"*, *"이미 PAYMENT_PENDING이 아닌 상태"*, *"이미 포인트가 적용된 주문"*, *"주문 금액을 초과하는 포인트"* 같은 분기는 모두 `Order.applyPoint()` 안에 한 줄씩 들어갔다. **동시 요청 방어는 비관적 락**으로, 같은 주문에 포인트가 두 번 적용되는 것은 도메인의 검증 한 줄로 막았다 — 인프라 락과 도메인 규칙을 두 층으로 분리해 겹쳐둔 설계다.

### 면접에서 받은 네 개의 질문

저자가 회고에서 가장 공을 들여 풀어낸 부분이다. 네 개의 Q&A가 모두 *"결정은 잘 했는데, 그 결정의 이유를 말로 옮길 때 흐려졌다"*는 같은 패턴을 보여 준다.

**1. "왜 정적 팩토리를 썼나요?"** — 저자는 *"유지보수"*라는 모호한 단어로 답했고, 더 나쁜 답은 이어진 *"그러면 롬복은 그냥 게터 세터 때문인가요?"* 에 *"네"*라고 짧게 답한 것이다. 사실은 `create/restore`라는 의미 있는 이름, 불변 규칙 강제, 외부 진입점 차단이 이유였지만 그 핵심을 한 마디로 못 했다.

**2. "동시성/멱등성 이해한 건가요?"** — 첫 답을 *"잘 안 일어날 것 같다"*로 시작해 면접관의 *"사용자가 빠르게 2번 누르면요?"*에 밀렸다. 처음부터 *"비관적 락 + 멱등성 키로 막는다"*로 갔으면 좋았을 부분이다. `user_id + product_id` 조합이라는 답변은 사실 `point_history UNIQUE(order_id)` 같은 **멱등성 키** 발상과 같은 말인데, 그 용어로 정리하지 못한 게 아쉽다.

**3. "의견 반영이 잘 안 된 것 같네요"** — 가장 인상적인 순간이다. 중간에 *"포인트가 보유 잔액을 초과하면 어떻게 처리할까요?"*라고 직접 물어본 뒤 *"UX 측면에서 가진 포인트만큼만 차감"*이라고 답했는데, **그 결정을 `clamp`라는 함수로 코드에 반영했다**는 사실을 본인이 먼저 짚어내지 못했다. AI와 함께 짠 결정이라 더더욱 의식하지 못한 부분이다.

**4. "ledger가 뭔가요?"** — 코드/주석에 등장한 `ledger`라는 단어를 면접관이 짚자 *"방금 AI와 대화하면서 처음 들었습니다"*라고 솔직하게 답했다. 솔직함 자체는 나쁘지 않지만, *의사결정 단계에서 한 줄만 물어봤어도 자신 있게 갈 수 있지 않았을까*라는 회고가 매력적이다. 면접 후 찾아본 저자에 따르면 ledger는 *"모든 거래 내역을 시간 순서로 기록하는 원장"* — 결제 도메인에서 잔액을 컬럼으로 두는 대신 거래 내역으로 표현하는 표준 방식이다.

### 부족했던 점 — 한 문장으로 수렴

네 번의 Q&A에 공통 원인이 있다. **"내가 내린 결정을 끝까지 설명할 언어가 정리되지 않았던 것."** `clamp`, *비관적 락*, *생성자 차단*, *멱등성 키* 같은 의도는 머리에는 있었지만 말로 옮길 때 흐려졌다.

시간 관리도 문제였다. 30분 중 의사결정 토론과 **정제에 너무 많이 썼고** — 6개 예외 클래스, 세세한 예외 응답 분기 — 결국 동작 검증은 한 번도 못 했다. 회고를 보면 *"처음 생각한 것보다 오버엔지니어링"*이었다는 자기 진단이 나온다. 정제의 본질은 **"내 정책이 코드에 잘 반영됐는지 끝까지 확인하는 것"**이었는데, 그 확인을 건너뛴 게 가장 큰 비용이었다.

### 다음엔 — 4개의 작은 처방

- **본인 결정에 "왜" 한 문장 미리 준비**: `clamp` 한 문장, 비관적 락 한 문장, 정적 팩토리 한 문장. 코드 짜기 전에 본인 입으로 한 번씩 말한다.
- **마지막 5분은 무조건 동작 검증**: `bootRun + curl` 한 번이라도 돌린다.
- **예외 처리는 정제 영역**: MVP에는 표준 `RuntimeException` + 500 fallback. 세세한 분기는 동작 확인 후.
- **모르는 단어는 그 자리에서 한 줄 질문**: 회피하지 말고.

저자의 마지막 한 줄이 깔끔하다 — *"도메인 사고는 그대로 가져가되, 다음엔 동작하는 코드부터."*

## 분석과 인사이트

### 1. "내 언어로 다시 정리하는 시간"의 부재

저자가 짚은 진짜 원인은 사소해 보이지만 무겁다 — *"AI와 대화하면서 결정한 것을 본인 언어로 다시 정리하는 시간이 필요했던 것."* 이건 AI 도구 사용이 면접에 허용된 2026년의 새로운 시험이다. 예전에는 *"내가 직접 친 코드"*가 곧 *"내가 설명할 수 있는 코드"*였지만, 이제는 그 등식이 보장되지 않는다. AI가 작성한 코드를 본인이 끝까지 추적·언어화하지 못하면, 면접관의 *"왜?"* 한 마디에 무너진다. **DDD 사고방식과 AI 활용 능력은 별개의 역량이며, 둘 다 갖춰도 둘을 잇는 "설명 가능성(explainability)"이라는 세 번째 역량이 따라와야 한다.**

이 위키에 있는 [온톨로지 vs DDD](/2026/07/20/ontology-vs-ddd.html)와 [Codex의 agent loop](/2026/06/25/codex-agent-loop.html)를 함께 읽으면, *"도메인을 어떻게 표현하는가"*와 *"에이전트가 어떻게 코드를 짜는가"*는 각각 별개의 글에서 다루고 있지만, 이 라이브 코딩 회고는 **그 두 글의 접점에 있는 문제 — "에이전트가 짠 도메인 코드를 사람이 다시 말로 옮길 수 있는가"**를 한 번에 끌어낸다. 그래서 DDD만 공부하거나 agent harness만 연구하는 것보다 양쪽을 잇는 *설명 가능성* 훈련이 더 큰 레버가 된다.

### 2. 도메인 정제 vs 시간 확보 — 둘은 같은 동전의 양면

저자는 *"오버엔지니어링이 된 느낌"*이라고 자책하지만, 사실 이 글에서 가장 건강한 설계적 선택은 **검증을 도메인 안에 응집**시키고 **동시성 방어를 락과 도메인 규칙 두 층으로 겹친 것**이다. 이건 멘토가 봐도 흔쾌히 통과시킬 결정이다. 문제는 정제가 아니라 **시간 배분**이다.

> *"설계는 빠르게 정하고, 구현은 단순하게, 보완은 동작 확인 후로 갔으면 좋았을 것 같다."*

이 한 줄이 라이브 코딩의 시간을 **세 구간 — 의사결정 / 정제 / 검증** — 으로 다시 나누는 좋은 프레임이다. 첫 두 구간을 합쳐서 25분 안에 끝내고, 마지막 5분은 **무조건 `bootRun + curl`**로 동작을 확인한다. 이 시간 상한을 면접 전에 손으로 정해 두면, 저자가 빠진 *"6개 예외 클래스·세세한 응답 분기"* 같은 과잉 정제는 애초에 시도조차 않게 된다.

### 3. 멱등성 키라는 어휘의 무게

*"user_id + product_id 조합으로 차단"*이라는 저자의 답이 `point_history UNIQUE(order_id)` 같은 **멱등성 키** 발상과 같다는 저자의 자기 진단은 매우 정확한데, 사실 이건 실무 결제 시스템에서도 같은 일이 벌어진다 — **결제 도메인에서 가장 표준적인 패턴은 "단일 PK의 결제 내역 테이블" + "잔액은 컬럼 대신 거래 로그에서 계산"이라는 ledger 방식**이다. `Order`라는 aggregate root에 잔액을 두는 설계 자체가 ledger 방식이 아니다. 그래서 저자가 나중에 *"ledger가 뭔가요?"*라는 질문을 맞은 것은 단순 어휘 부족이 아니라, **자기가 짠 결제 도메인이 표준 결제 도메인과 다른 전통 위에 서 있다**는 신호이기도 하다. 면접관 입장에서 ledger를 짚은 것은 *"잔액 컬럼 vs 거래 로그"*라는 더 깊은 설계 토론의 입구를 만든 것이고, 저자가 그 입구를 통과했으면 더 좋은 답을 만들 수 있었다.

이 점에서 [DDD](/2026/06/19/domain-driven-design.html) 글의 *"aggregate root는 일관성의 경계"*라는 원칙과, ledger 방식의 *"이벤트가 곧 상태"*라는 사고방식이 같은 문제를 다른 층에서 풀고 있다는 걸 떠올리게 한다.

### 4. "동작하는 코드부터" — 라이브 코딩의 진짜 메시지

저자의 마지막 한 줄이 이 글의 진짜 메시지다. 라이브 코딩은 *"설계를 잘하는 사람"*이 아니라 *"설계가 잘 동작하는지 끝까지 확인하는 사람"*을 본다. 그래서 정적 팩토리·비관적 락·도메인 검증 같은 정교한 설계보다, **`curl` 한 번으로 API가 도는지 확인하는 습관**이 더 큰 점수를 가져간다. **테스트 우선 개발(TDD)**이나 **계약 주도 설계(contract-driven design)**를 공부하는 이유가 바로 여기에 있다 — *"먼저 통과 기준을 정해 두고, 그 기준에 도달했는지 끝까지 본다"*는 훈련이 라이브 코딩의 시간 압박에서 살아남는 가장 확실한 무기다.

### 5. 회고 형식 자체가 좋은 템플릿

부수적이지만, 저자의 회고 구조 — *받은 문제 → 어떻게 풀었나 → 면접 질문 → 부족했던 점 → 다음엔* — 가 라이브 코딩 회고의 거의 표준 템플릿이다. 이 다섯 섹션을 그대로 빈 종이 위에 두고 회고를 쓰면, *"왜 그렇게 짰는가"*라는 자기 질문을 강제로 통과하게 된다. 같은 작성자의 직전 글인 전화면접 복기 회고도 같은 구조를 따른다. 회고 자체가 다음 면접을 위한 훈련이 되는 셈이다.

## 적용 포인트

- **결정마다 한 줄 "왜"를 미리 만든다.** 면접 들어가기 전에 *정적 팩토리, 비관적 락, 멱등성 키, 도메인 검증, 트랜잭션 경계* 같은 단어마다 *"왜 쓰는지"* 한 문장을 손으로 적어 둔다. 코드 짜기 전에 본인 입으로 한 번씩 말한다.
- **30분 라이브 코딩을 세 구간으로 나눈다.** 의사결정 10분, 정제 15분, 검증 5분. 마지막 5분은 무조건 `bootRun + curl`. 이 시간 상한을 손으로 정해 두면 과잉 정제를 시도조차 않게 된다.
- **MVP에는 표준 `RuntimeException` + 500 fallback**만 둔다. *6개 예외 클래스, 응답 분기, 세밀한 상태 코드* 같은 정제는 동작 확인 후의 보완 영역이다. 처음부터 시도하지 않는다.
- **AI가 짠 코드도 "내가 설명할 수 있는 코드"가 아니면 제출하지 않는다.** 도메인 용어 한 줄, 함수 의도 한 줄, 트레이드오프 한 줄 — 이 세 줄을 본인 언어로 적을 수 있을 때만 그 줄을 두른다.
- **모르는 단어를 만나면 회피하지 말고 한 줄 질문한다.** `ledger`처럼 낯선 단어가 나오면 *"이 도메인에서 그게 뭘 의미하는지 한 줄만 설명해 주세요"*라고 그 자리에서 묻는다. 모른다고 답하는 것보다 한 줄 질문한 뒤 이해한 채로 진행하는 게 훨씬 낫다.
- **회고는 *받은 문제 → 어떻게 풀었나 → 받은 질문 → 부족한 점 → 다음엔* 다섯 섹션으로** 쓴다. 매번 같은 템플릿을 강제하면 *"왜 그렇게 짰는가"* 자기 질문을 건너뛰지 않게 된다.
- **DDD 사고방식과 AI 활용 능력은 별개의 역량**으로 보고, 둘을 잇는 *설명 가능성(explainability)* 훈련을 별도로 한다. DDD 책과 agent harness 문서를 교차로 읽는 시간이 가장 큰 레버다.

## 마무리

이 글의 무게는 *"결제를 어떻게 짰는가"*에 있지 않다. **"도메인을 잘 짰는데, 왜 점수가 안 나왔는가"**에 있다. 답은 의외로 단순하다 — *"내 결정의 이유를 끝까지 말로 옮길 언어가 정리돼 있지 않았다."* 이건 DDD 사고방식의 문제가 아니라, AI 도구가 코드 작성과 본인 이해 사이에 끼어들면서 생긴 **2026년형 새로운 시험**이다. 같은 DDD 사고방식을 갖고도 *"본인 언어로 다시 정리하는 시간"*이 없으면 같은 결과를 맞는다.

라이브 코딩을 준비하는 신입들에게 이 글은 두 가지를 동시에 알려 준다. 첫째, **정적 팩토리·비관적 락·멱등성 키** 같은 도메인 어휘를 손에 익혀라. 둘째, 그보다 더 중요한 건 **그 어휘를 *왜* 골랐는지 한 문장으로 설명할 수 있어야 한다**는 것이다. 정제는 동작 확인 후에. 도메인 사고는 그대로 가져가되, 다음엔 동작하는 코드부터.

### 더 읽어보기

- [원문 — 라이브 코딩 면접 회고 (도메인 모델링, api), hyeoks (@ochhs0829), Velog](https://velog.io/@ochhs0829/라이브-코딩-면접-회고-도메인-모델링-api)
- [Domain-Driven Design 정리글](/2026/06/19/domain-driven-design.html) — 이 글에서 등장한 *aggregate root*, *불변 규칙*, *정적 팩토리* 같은 개념의 기본기를 정리한 위키 포스트.
- [아키텍처 이센셜 커리큘럼](/2026/06/19/architecture-essential-curriculum.html) — 트랜잭션 경계·동시성·이벤트 기반 설계가 들어 있는 커리큘럼. 이 라이브 코딩 문제의 채점 포인트 다섯 개를 모두 다룬다.
- [온톨로지 vs 도메인 주도 설계(DDD)](/2026/07/20/ontology-vs-ddd.html) — *aggregate root가 잔액을 갖는 설계 vs ledger 방식처럼 이벤트가 곧 상태인 설계*의 층 차이를 정리한 글. 이 글에서 `ledger`라는 단어가 등장한 이유를 더 깊이 이해할 수 있다.
- [Codex의 agent loop를 펼쳐 보기](/2026/06/25/codex-agent-loop.html) — *에이전트가 코드를 짜는 방식*을 분석한 글. *AI가 짠 코드를 사람이 다시 설명할 수 있어야 한다*는 이 글의 메시지를 agent 설계 관점에서 보강한다.
- [원문 작성자의 전화면접 편 회고 (Velog, 백엔드 신입 기술 전화면접 복기)](https://velog.io/@ochhs0829/백엔드-신입-기술-전화면접-복기-받은-질문과-놓친-답변들) — 같은 hyeoks가 같은 주제(백엔드 신입 1차 면접)로 쓴 전화면접 편. 이 글과 나란히 읽으면 신입 1차 면접의 전화·라이브 두 트랙이 모두 그려진다.
