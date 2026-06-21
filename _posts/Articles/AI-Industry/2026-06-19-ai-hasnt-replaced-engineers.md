---
layout: post
title: "AI는 왜 소프트웨어 엔지니어를 대체하지 못했나: 'AI 워싱' 해고 서사와 decide-execute-deliver 샌드위치"
date: 2026-06-19
categories: [Articles, AI-Industry]
tags: [articles, ai, career, coding-agent]
published: true
excerpt: "Arvind Narayanan과 Sayash Kapoor가 'AI as Normal Technology'에 쓴 글을 읽고, 'AI가 엔지니어를 해고했다'는 서사의 실체(AI 워싱)와 일을 decide-execute-deliver 세 층으로 보는 프레임을 개발자 관점에서 분석·정리한다."
---

## 원문 정보

> - **제목**: Why AI hasn't replaced software engineers, and won't
> - **출처**: Arvind Narayanan · Sayash Kapoor — AI as Normal Technology (Substack, [normaltech.ai](https://www.normaltech.ai/p/why-ai-hasnt-replaced-software-engineers))
> - **발행**: 2026-06-11 · 분량 표기 없음
> - **원문 링크**: <https://www.normaltech.ai/p/why-ai-hasnt-replaced-software-engineers>

`Articles` 카테고리는 읽을 만한 외부 글을 골라 핵심을 정리하고 내 관점으로 분석하는 공간이다. 앞선 글들이 "AI로 어떻게 더 잘 만들 것인가"를 다뤘다면, 이 글은 한 발 더 물러서 **"AI가 정말 엔지니어를 줄였는가"** 라는 노동시장 질문을 데이터로 따진다. 화제는 뜨겁지만 증거는 차분한, 드문 종류의 글이다.

## 한 줄 요약 (TL;DR)

"AI가 엔지니어를 해고했다"는 뉴스 대부분은 재무 압박을 AI로 포장한 **AI 워싱(AI washing)** 이며, 코딩 에이전트는 일의 **실행(execute) 층만 압축**했을 뿐 **결정(decide)과 인도(deliver)·책임(accountability)** 은 인간에게 남기 때문에 소프트웨어 엔지니어 고용은 (둔화됐을지언정) 여전히 늘고 있다.

## 왜 이 글을 골랐나

"개발자는 끝났다"는 도발은 흔하지만, 대부분 일화나 CEO의 발언을 근거로 든다. 이 글은 정반대로 간다. **해고 공시 데이터, 고용 통계, 개발자 로그 데이터셋**을 동원해 서사를 검증하고, "코드를 쓰는 일은 원래 병목이 아니었다"는 오래된 진실을 다시 꺼낸다. 막연한 불안을 "무엇이 실제로 변했고 무엇은 과장인가"로 바꿔 주기 때문에, 개발자가 자기 일의 어느 부분이 압축됐고 어느 부분이 남았는지를 점검하는 지도로 쓸 수 있다. 이 위키가 [소프트웨어는 죽는 게 아니라 재평가된다](/2026/06/19/software-is-evolving-not-dead.html)에서 다룬 "해자의 이동"과, [바이브 코딩 너머 개발자 생존법](/2026/01/02/바이브-코딩-너머-개발자-생존법.html)이 말한 "AI가 못 하는 인간의 몫"이 여기서 노동시장 데이터로 다시 만난다.

## 핵심 내용

원문의 네 섹션을 따라 정리한다. 아래의 수치·인용은 모두 이 글 본문에 실제로 등장하는 내용이며, 이 글이 인용한 제3의 연구·발언인 경우 출처를 함께 밝힌다.

### 1. 소프트웨어 대량 해고 서사는 전형적인 "AI 워싱"

원문은 최근 해고 뉴스의 결을 뜯어본다. **Block**의 해고에서 CEO Jack Dorsey는 AI가 "smaller and flatter teams"를 가능케 한다고 했지만, 실제 동인은 재무 압박이었고, Cash App 직원 Naoko Takeda는 생산성에서 "very limited gains"만 봤다고 전한다. **Snap**의 Evan Spiegel은 AI가 "65% of new code"를 생성했다고 말했지만, 정작 해고는 AI 노출도와 맞지 않는 패턴이었다. **Intuit** CEO는 오히려 AI 프레이밍을 반박하며 "coordination-heavy roles"를 정리한 것이라 했다.

뒤이어 본문은 이 서사를 흔드는 데이터를 쌓는다(괄호 안은 이 글이 인용한 출처).

- 미국 채용 관리자의 **59%** 가 채용 동결·해고를 설명할 때 AI를 강조한다고 인정했다.
- Forrester의 J.P. Gownder: 기업이 그 자리를 채울 "mature, vetted AI app"을 갖췄느냐 물으면 *"nine out of 10 times, the answer is no"* 다.
- HBR 설문(임원 1,000여 명): **21%** 는 AI를 "예상하고(in anticipation of)" 대규모 감원을 했지만, 실제 AI 도입 때문에 대규모 감원을 한 곳은 **2%** 에 그쳤다. 기대와 실행 사이에 10배의 간극이 있다.
- 뉴욕주 WARN 공시: AI 박스를 체크한 회사는 **Nespresso 단 한 곳**, 해고된 약 25,000명 중 **46명**, 약 **0.2%(two-tenths of a percent)** 만이 AI에 귀속됐다.
- 연방준비제도(Federal Reserve) 연구: 소프트웨어 엔지니어 고용은 여전히 늘지만, AI가 없었을 반사실(counterfactual) 대비 ChatGPT 이후 연간 **약 3%포인트** 더 느리게 자란다.

요지는 명확하다. **해고는 잘못된 신호**다. AI 효과는 "increased separations(해고 증가)"가 아니라 "slower hiring(채용 둔화)"으로 나타난다.

### 2. 왜 코딩 에이전트가 노동 대체로 이어지지 않았나: decide-execute-deliver 샌드위치

이 글의 자체 프레임이 여기 있다. 원문은 엔지니어의 일을 *"decide-execute-deliver sandwich"* 로 본다.

- **Decide(결정)** — 문제를 규정하고, 사양을 정하고, 우선순위를 세운다.
- **Execute(실행)** — 설계하고 구현한다. **AI가 압축한 층은 여기뿐이다.**
- **Deliver(인도)** — 테스트·검증·통합·유지보수, 그리고 책임진다.

핵심 논거는 *"writing code wasn't the bottleneck"* — 코드 작성은 애초에 병목이 아니었다는 것이다. 이를 받치는 데이터.

- 개발자가 코딩에 쓰는 시간은 연구에 따라 **9%~61%** 에 불과하다(Microsoft 개발자 6,000명 데이터).
- "Writing Code vs. Shipping Code" 연구: GitHub 개발자 **100,000명**에서, 작성된 코드 줄 수는 **8배** 늘었지만 릴리스는 **30%** 증가에 그쳤다. 인간 쪽 병목이 그대로 남았다는 증거다.
- SWE-chat 데이터셋: 에이전트가 만든 코드의 **44%** 만 사용자 커밋에 살아남고, 바이브 코딩 커밋은 인간 대비 **9배(nine times)** 비율로 취약점을 들이며, 가장 흔한 사용자 의도는 새 코드 생성이 아니라 **기존 코드 이해**다(이해 19% vs 생성 13%).

원문은 미래의 엔지니어를 **크레인 기사**에 비유한다 — 인간이 에이전트를 감독하고 통제 안에 둔다. 역사적 맥락도 짚는다. 미 노동통계국(BLS)은 20여 년 전 "programming"과 "software engineering"을 분리했고, 프로그래밍(grunt work)은 줄고 저임금화하는 반면 엔지니어는 샌드위치의 더 큰 몫을 다룬다. 기계화로 사라진 농업과 달리 프로그래밍 고용은 1950년 거의 0에서 오늘날 수백만으로 늘었다는 대조도 든다.

### 3. 바이브 코딩은 에이전틱 엔지니어링이 아니다

원문은 둘을 분명히 가른다.

- **Vibe coding** — 사용자가 시키기만 하고, 감독하지 않고, 코드를 리뷰하지 않고, 결과를 평가하지 않는다.
- **Agentic engineering** — 인간이 에이전트를 도구로 쓰되 **통제권과 책임을 쥔다.**

둘은 별개의 범주가 아니라 한 스펙트럼의 양 끝이며, 대부분의 프로덕션 소프트웨어는 에이전틱 쪽을 요구한다. 그리고 감독은 의외로 고되다 — Simon Willison은 *"mentally exhausted by 11am from supervising agents"* (에이전트 감독으로 오전 11시면 정신적으로 지친다)고 토로한다. 원문의 결론은 단호하다. 기업이 **자격 없는 바이브 코더로 엔지니어를 대체해 프로덕션 소프트웨어를 출시할 수는 없다.**

### 4. 미래는 어떻게 될까

원문은 실행 층이 이미 거의 압축됐으니, 추가 개선은 현 상태에서 "small change"라고 본다. 그리고 수요 쪽 논리를 편다.

- 소프트웨어는 **가격 탄력적**이다. 만들기가 싸지면 수요가 는다.
- 대체 탄력성(elasticity of substitution)이 낮아, 소프트웨어 수요 증가는 곧 엔지니어에 대한 **파생 수요(derived demand)** 로 이어진다.
- **Jevons' Paradox** — 생산성 향상이 오히려 수요 증가를 부른다. 현대 자동차에는 "a hundred million lines of code"가 들어가며, 코드 수요의 천장은 사실상 없다.

저자들은 Fred Brooks의 *"No Silver Bullet"* 을 빌려 **essential complexity vs accidental complexity**(본질적 복잡성 대 부수적 복잡성)를 구분한다. AI가 줄이는 것은 부수적 복잡성이며, 본질적 복잡성은 남는다. 또한 **민주화(democratization)** 전망에는 회의적이다 — FORTRAN·COBOL·SQL 모두 "이제 누구나 프로그래밍한다"는 약속을 달고 왔지만 실현되지 않았다. 진짜 장벽은 문법 학습이 아니라 *"skilled judgment to make good decisions while maintaining accountability"* (책임을 지면서 좋은 결정을 내리는 숙련된 판단)이기 때문이다.

마지막으로 다음 글을 예고한다. 전체 노동 수요는 견고하겠지만, **firm type·지역·연차·적응 속도**에 따라 어떤 엔지니어가 이득·손해를 볼지 "massive structural shifts"가 온다는 것.

## 분석과 인사이트

여기서부터는 원문 요약이 아니라 내 관점이다.

- **"해고는 잘못된 신호"라는 진단이 이 글의 가장 큰 기여다.** 우리는 뉴스 헤드라인으로 노동시장을 읽는 데 익숙하지만, 헤드라인은 CEO가 투자자에게 들려주고 싶은 이야기다. AI 효과가 "채용 둔화"로 조용히 나타난다는 통찰은, 개인에게 "내 회사가 망했나"가 아니라 "신규 자리가 천천히 열리는 세상에서 나는 어떻게 보일 것인가"로 질문을 바꾼다. 21% vs 2%라는 간극은 **기대가 실행을 한참 앞선다**는 사실 — 즉 지금의 감원 상당수는 AI 성과가 아니라 AI 서사라는 점을 정량으로 보여준다.
- **decide-execute-deliver 프레임은 자기 일을 점검하는 좋은 자다.** 내 하루의 어느 만큼이 execute였나? 그게 압축되는 만큼, 나의 값은 decide와 deliver로 옮겨간다. "코드는 원래 병목이 아니었다"는 말은 시니어에겐 익숙하지만, 코드 생산성을 곧 실력으로 여겨 온 사람에겐 뼈아픈 재정렬이다. 8배 코드 vs 30% 릴리스라는 숫자가 이걸 못 박는다 — **생산이 아니라 인도가 늘 진짜 관문이었다.**
- **vibe coding과 agentic engineering의 구분이 핵심이고, 차이는 "책임"이다.** 같은 에이전트를 써도 통제권과 책임을 쥐면 엔지니어링, 놓으면 바이브 코딩이다. 44% 생존율과 9배 취약점 수치는 "감독 없는 자동화"의 비용을 정확히 가격표로 보여준다. 이는 이 위키의 [신뢰할 수 있는 Agentic AI 시스템](/2026/06/19/reliable-agentic-ai-systems.html)이 말한 "모델이 아니라 모델 주변의 엔지니어링", 그리고 [Loop Engineering](/2026/06/19/loop-engineering.html)이 다룬 "루프를 설계·감독하는 인간"과 정확히 같은 줄기다.
- **Jevons' Paradox 논거에는 조건을 달고 싶다.** "싸지면 수요가 는다"는 거시 평균으로는 맞지만, 그 수요가 **나에게** 오리라는 보장은 없다. 저자들도 마지막에 "구조적 이동"을 예고하며 이 점을 인정한다. 총량이 늘어도 분배가 갈리면, 적응 못 한 개인에겐 위로가 되지 않는다. 낙관의 결론을 개인 전략으로 곧장 번역하지 않는 절제가 필요하다.
- **민주화 회의론은 역사가 받쳐 준다.** SQL이 "비개발자도 데이터를 다룬다"는 약속과 함께 왔지만, 결국 잘 짠 쿼리와 데이터 모델링은 여전히 전문 영역이다. AI도 마찬가지로 **진입 문턱은 낮추되 책임의 문턱은 낮추지 못한다.** 본질적 복잡성은 도구가 아니라 문제 자체에 있기 때문이다 — Brooks가 40년 전 한 말이 그대로 유효하다는 게 인상적이다.
- **유의: 이 글은 미국 데이터·미국 노동시장 중심이다.** WARN 공시, BLS 분류, 연준 연구 모두 미국 맥락이다. 한국·다른 시장의 채용 동학은 다를 수 있으니, 결론(고용은 견고)보다 **방법(서사 말고 데이터로 검증)** 을 가져오는 편이 안전하다.

## 적용 포인트

- 내 한 주의 시간을 **decide / execute / deliver** 세 칸에 나눠 적어 본다. execute 비중이 높다면, 그 부분이 가장 먼저 압축될 자리라는 뜻이다 — 값을 decide·deliver로 옮길 계획을 세운다.
- 에이전트를 쓸 때 **"내가 통제권과 책임을 쥐고 있나"** 를 매번 자문한다. 리뷰·검증 없이 머지하면 그건 엔지니어링이 아니라 바이브 코딩이고, 44%만 살아남는 코드를 떠안는 것이다.
- "코드를 빨리 짠다"를 실력의 지표로 삼지 말고, **요구사항을 규정하고(decide) 안전하게 인도하는(deliver) 능력**을 의도적으로 쌓는다 — 코드 리뷰, 테스트 전략, 시스템·도메인 이해.
- 회사의 해고·동결 뉴스를 볼 때 **"이게 AI 성과인가, AI 서사인가"** 를 구분하는 습관을 들인다. 21% vs 2%를 기억한다.
- AI 시대의 커리어 신호를 **헤드라인이 아니라 채용 속도·신규 포지션의 결**에서 읽는다.

## 마무리

이 글의 미덕은 "AI가 개발자를 대체했다"는 거대한 주장을 **검증 가능한 증거로 분해**한 데 있다. 해고 서사는 대부분 AI 워싱으로 걷히고, 남는 것은 더 차분한 그림이다 — AI는 일의 가운데 층(execute)을 눌렀을 뿐, 양쪽 빵(decide·deliver)과 그 사이의 책임은 사람에게 남았다. 코드가 싸진 세상에서 엔지니어의 값은 **생산에서 판단으로, 작성에서 인도로** 옮겨간다. 빠르게 짜는 능력이 보편화될수록, 무엇을 만들지 정하고 그것을 책임지고 내보낼 줄 아는 사람의 값이 오른다.

### 더 읽어보기

- [원문 — Why AI hasn't replaced software engineers, and won't (AI as Normal Technology)](https://www.normaltech.ai/p/why-ai-hasnt-replaced-software-engineers)
- [소프트웨어는 죽는 게 아니라 재평가된다](/2026/06/19/software-is-evolving-not-dead.html) — 코드가 싸진 세상에서 해자가 어디로 이동하는가
- [바이브 코딩 너머 개발자 생존법](/2026/01/02/바이브-코딩-너머-개발자-생존법.html) — AI가 못 하는 인간의 몫과 "70% 문제"
- [신뢰할 수 있는 Agentic AI 시스템 만들기](/2026/06/19/reliable-agentic-ai-systems.html) — 감독 없는 자동화의 비용, 모델 주변의 엔지니어링
- [Loop Engineering](/2026/06/19/loop-engineering.html) — 에이전트 루프를 설계·감독하는 인간의 역할
- [Architecture Essential Curriculum](/2026/06/19/architecture-essential-curriculum.html) — deliver 층(통합·유지보수·경계)을 다루는 설계 사고
