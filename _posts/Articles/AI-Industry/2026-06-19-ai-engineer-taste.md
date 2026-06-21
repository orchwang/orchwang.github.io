---
layout: post
title: "코드가 공짜가 된 시대의 '취향(taste)': 30x AI 엔지니어가 되는 법 (Pratik Bhavsar)"
date: 2026-06-19
categories: [Articles, AI-Industry]
tags: [articles, ai, career, craftsmanship]
published: true
excerpt: "Pratik Bhavsar의 'How to Be a 30x AI Engineer with a Taste'를 읽고, 코드 생성이 commodity가 된 시대에 '취향(taste = 내부 평가 함수의 품질)'이 왜 가장 값진 엔지니어링 기술이 되었는지, 그것을 어떻게 기르는지 개발자 관점에서 분석·정리한다."
---

## 원문 정보

> - **제목**: How to Be a 30x AI Engineer with a Taste
> - **출처**: Pratik Bhavsar — *Pratik's Pakodas 🍿* (Substack, [pakodas.substack.com](https://pakodas.substack.com/p/how-to-be-a-30x-ai-engineer-with-a-taste))
> - **발행**: 2026-02-19
> - **원문 링크**: <https://pakodas.substack.com/p/how-to-be-a-30x-ai-engineer-with-a-taste>

이 글을 Articles에 담는 맥락: 이 위키에는 "AI가 코드를 쓰는 시대에 엔지니어의 자리는 어디인가"를 다룬 글이 여럿 쌓였는데, 이 글은 그 질문에 **"taste(취향·안목)"** 라는 한 단어로 답을 제시한다.

## 한 줄 요약 (TL;DR)

AI가 코드 생성을 commodity로 만들수록, 차이를 만드는 것은 타이핑 속도가 아니라 **무엇을 만들지·무엇이 좋은지 판단하는 안목(taste)** 이다. 원문은 taste를 "당신의 내부 평가 함수의 품질"(*Taste is the quality of your internal evaluation function.*)이라 정의하고, 그것이 학습 가능한 기술이라며 90일 훈련 계획까지 제시한다.

## 왜 이 글을 골랐나

이 위키의 여러 Articles가 같은 현상을 각자의 각도에서 본다. [AI는 왜 소프트웨어 엔지니어를 대체하지 못했나](/2026/06/19/ai-hasnt-replaced-engineers.html)는 "decide-execute-deliver 중 execute만 자동화됐다"고 보았고, [소프트웨어는 죽는 게 아니라 재평가된다](/2026/06/19/software-is-evolving-not-dead.html)와 [Martin Fowler의 Fragments로 읽는 균형 감각](/2026/06/19/martin-fowler-fragments-llm-era.html)은 "도구가 아니라 판단이 가치를 가른다"고 정리했다. 이 글은 바로 그 "판단·decide"의 정체를 **taste**라는 이름으로 분해하고, 추상적 선언에 그치지 않고 "그래서 어떻게 기르느냐"까지 내려간다는 점에서 골랐다.

특히 개발자에게 유용한 지점은, taste를 "타고난 감각"이 아니라 **반복 가능한 평가 능력**으로 재정의했다는 데 있다. 안목을 신비화하지 않고 훈련의 대상으로 끌어내린다.

## 핵심 내용

원문의 섹션 순서를 따라 정리한다. 사실은 원문에 충실하게 옮긴다.

### 세상은 변했는데 대부분은 눈치채지 못했다

원문은 2025년 말(11~12월)을 기점으로 AI 코드 생성이 어떤 임계치를 넘었다고 본다. 모델이 경험 있는 엔지니어 수준의 코드를 쓰게 되면서, 코드 생성 자체는 commodity가 되고 "그 외 모든 것"이 더 중요해졌다는 주장이다.

원문은 이 변화를 여러 실무자의 발언을 **제3자 인용**으로 끌어와 뒷받침한다. 출처를 분명히 구분해 옮기면 다음과 같다.

- 원문이 인용한 Anthropic CEO **Dario Amodei**의 2025년 3월 예측: AI가 "몇 달 안에 코드의 90%를 쓰게 될 것"(*writing 90% of code within months*).
- 원문이 인용한 **Boris Cherny**: 그달 자신이 커밋한 코드의 "100%가 AI가 쓴 것"이었다는 발언.
- 원문이 인용한 **Andrej Karpathy**: "프로그래머로서 이렇게까지 뒤처졌다고 느낀 적이 없다. 이 직업은 극적으로 재설계되고 있다"(*I've never felt this much behind as a programmer. The profession is being dramatically refactored.*).
- 원문이 인용한 Rails 창시자 **DHH**: 예전엔 모델이 "충분히 좋지 않았는데, 이제 그게 뒤집혔다"(*That has now flipped.*).
- 원문이 인용한 Vercel CTO **Malte Ubl**: "소프트웨어 생산의 비용은 0을 향해 가고 있다"(*The cost of software production is trending towards zero.*).

이 인용들은 모두 원문이 *남의 말을 끌어온 것*이며, 원문 자신의 측정값이 아니라는 점을 분명히 해 둔다.

### taste란 정확히 무엇인가

원문은 taste를 세 가지 형태로 나눈다.

- **Recognition taste(인식)**: 완성된 결과물을 평가하는 능력 — 무엇이 좋고 나쁜지 알아보는 눈.
- **Compass taste(나침반)**: 올바른 해법을 향해 길을 찾아가는 능력.
- **Vision taste(비전)**: 미래의 궤적을 이해하는 능력.

원문의 핵심 주장은, 이 셋이 결국 **하나의 메커니즘 — "내부 평가 함수의 품질"** 로 수렴한다는 것이다. 원문의 표현을 그대로 옮기면 "AI가 코드를 생성하는 세상에서, 인간의 일은 평가다"(*In a world where AI generates the code, the human's job is evaluation.*).

이 대목에서 원문이 인용한 OpenAI의 **Emma Tang**의 말이 인상적이다 — "이제 누구나 10x 엔지니어가 될 수 있다. 단, 좋은 소프트웨어 taste를 가진 사람이 있다면"(*Everybody can be a 10x engineer now, as long as you have people with good software taste.*). 이 역시 제3자 인용이다.

### 왜 어떤 엔지니어는 훨씬 더 많이 버는가

원문은 보상 격차가 예전의 약 3x에서 약 10x로 벌어졌다고 본다(이는 원문 저자의 주장이다). 그 근거로 가치가 **선형적 노력이 아니라 복리로 쌓이는 결정**에서 나온다고 말한다. 좋은 아키텍처 결정 하나가 수개월의 작업을 아껴주기 때문이다. 원문의 표현을 빌리면 "더 나은 taste를 가진 사람보다 두 배로 열심히 일하고도 절반의 가치를 낼 수 있다"(*You can work twice as hard as someone with better taste and still produce half the value.*).

### 가치는 실제로 어디서 생기는가

원문은 가치가 생성되는 **다섯 개의 zone**을 제시한다.

- **Zone 1 — 문제 선택(problem selection)**: 무엇을 풀 가치가 있는지 고르는 일.
- **Zone 2 — 시스템 아키텍처(system architecture)**.
- **Zone 3 — 품질 판단(quality judgment)**.
- **Zone 4 — 사용자 공감(user empathy)**.
- **Zone 5 — 커뮤니케이션과 스토리텔링(communication and storytelling)**.

다섯 모두 "코드를 더 빨리 친다"와는 무관한, 평가와 판단의 영역이라는 점이 핵심이다.

### taste가 있는 경우와 없는 경우

원문은 짝지은 예시로 taste의 유무를 보여준다 — 기술 스택 선택, 코드 이해, 기능 요청 해석, AI 에이전트 설계, PR 리뷰 절차에서 안목이 있을 때와 없을 때가 어떻게 다른지를 대비시킨다.

### taste를 기르는 90일 계획

원문은 taste를 "감상만 하는 것"이 아니라 **실제로 개발하는** 계획을 단계로 제시한다.

- **1개월차 — Recognition(인식)**: 구조화된 노출을 통한 훈련. 개발자 도구 10개를 깊이 들여다보고, 연구 논문 10편을 읽는다.
- **2개월차 — Compass(나침반)**: 변별 훈련. 매주 나란히 비교(side-by-side comparison)하고, 매일 알아채는(noticing) 연습을 한다.
- **3개월차 — Vision(비전)**: 생성적 적용. 기존 시스템을 재설계하고, 자신의 최고 작업을 써보고, 처음부터 설계하고, 그 taste를 공유한다.

### taste를 빠르게 길러주는 다섯 프로젝트

원문이 제안하는 실습 프로젝트는 다음과 같다.

- AI가 만든 코드를 위한 **평가 프레임워크(evaluation framework)** 만들기.
- 오픈소스 프로젝트의 **온보딩 재설계**.
- 팀을 위한 **taste test 문서** 작성.
- **48시간 제품 출시** 챌린지.
- 어떤 개념을 다시 풀어 설명하는 **기술 블로그 글** 쓰기.

### taste 중심으로 커리어를 최적화하는 법

원문의 처방은 네 가지다 — 속도로 경쟁하기를 멈출 것, 인접 기술을 키울 것, taste를 보상해 주는 역할을 고를 것, 공개 포트폴리오를 쌓을 것.

### 불편한 진실

원문이 닫는 문장의 핵심은 이렇다. taste 격차는 "전혀 없음"과 "어느 정도 있음" 사이가 가장 크고 또 닫을 수 있는 구간이며, **코드를 쓰는 일은 애초에 진짜 일이 아니었다 — 사고(thinking)가 진짜 일이었다**는 것이다. 원문의 마지막 압축은 "taste가 언제나 일 그 자체였다. 우리가 그걸 코드 안에 숨겨두고 있었을 뿐이다"(*Taste was always the job. We just used to hide it inside the code.*).

> 수치에 대한 주의: 제목의 "30x"는 원문이 productivity multiplier를 가리키는 수사적 표현으로 쓴 것이고, "10x 엔지니어"·"90%"·"100%"·"10x 보상 격차"는 위에서 출처를 구분해 표기한 대로 일부는 제3자 인용, 일부는 저자 주장이다. 원문은 그 외에도 "30/70 rule(손코딩 30% / AI 70%)", 패턴 인식을 위한 최소 데이터 포인트, 평가 실습용 PR 수 같은 세부 수치를 제시하지만, 이 정리에서는 출처가 이 글 본문에 명확히 실재하는 핵심 인용·수치만 옮겼다.

## 분석과 인사이트

여기서부터는 원문 요약이 아니라 내 관점이다.

- **"taste = 내부 평가 함수"라는 정의는 모호한 단어를 측정 가능한 능력으로 끌어내린 점이 탁월하다.** 보통 "감각"이나 "안목"이라고 하면 타고나는 것으로 치부되는데, 이 글은 그것을 "input(작업)을 받아 quality score를 출력하는 함수"로 재정의한다. 함수라면 학습시킬 수 있고, 그래서 90일 계획이 성립한다. 엔지니어에게 이건 위로가 아니라 실행 가능한 메시지다.

- **이 글의 "evaluation이 곧 사람의 일"은 [Loop Engineering](/2026/06/19/loop-engineering.html)의 maker/checker 분리와 정확히 맞물린다.** Loop Engineering은 "모델이 자기 작업을 너무 관대하게 채점한다"며 검증을 별도 에이전트에게 맡기라고 했다. 그런데 그 checker의 평가 기준을 정하고, checker조차 틀렸을 때 그것을 알아채는 최종 평가 함수는 결국 사람이다. taste는 바로 그 *최종 평가 함수*의 이름이다. 두 글은 같은 자리에서 만난다 — 생성은 위임되어도 평가는 위임되지 않는다.

- **다섯 zone은 [AI는 왜 엔지니어를 대체하지 못했나](/2026/06/19/ai-hasnt-replaced-engineers.html)의 decide-execute-deliver 샌드위치와 같은 그림이다.** 그 글이 "AI는 execute만 자동화했다"고 했다면, 이 글의 다섯 zone(문제 선택·아키텍처·품질 판단·사용자 공감·커뮤니케이션)은 모두 decide와 deliver 쪽이다. 같은 통찰을 한쪽은 "어디가 안 자동화됐나"로, 다른 쪽은 "그래서 무엇에 투자하라"로 말한다.

- **다만 "taste"라는 단어가 모든 것을 빨아들이는 위험은 경계해야 한다.** 문제 선택·아키텍처·사용자 공감·커뮤니케이션은 서로 매우 다른 능력인데, 이를 한 단어로 묶으면 "그래서 무엇을 연습할 것인가"가 흐려질 수 있다. 다행히 원문이 zone별·월별로 쪼개 처방을 줘서 이 함정을 어느 정도 피하지만, 읽는 쪽은 "taste를 길러야지"라는 추상에 머물지 말고 다섯 zone 중 *내 약점 하나*를 골라 들어가는 편이 낫다.

- **이 글의 taste는 결국 craftsmanship(장인 정신)의 다른 이름이다.** "무엇이 좋은 코드인지 알아보는 눈"은 새로운 개념이 아니다. 이 위키의 [Craftsmanship Essential Curriculum](/2026/06/19/craftsmanship-essential-curriculum.html)이 다룬 고전들이 수십 년간 말해온 바로 그것이다. AI가 코드 생산을 commodity로 만들면서, 역설적으로 *오래된 장인의 안목*이 다시 전면에 올라온 셈이다. 이 점에서 이 글은 [바이브 코딩 너머 개발자 생존법](/2026/01/02/바이브-코딩-너머-개발자-생존법.html)이 말한 "마법은 실재하지만 마법만으로 프로덕션을 책임질 수 없다"와 같은 결론에 닿는다.

## 적용 포인트

독자가 바로 적용할 수 있는 실천 항목.

- **다섯 zone 중 내 약점 하나를 골라 90일을 건다.** "taste를 기르자"는 막연함 대신, 문제 선택·아키텍처·품질 판단·사용자 공감·커뮤니케이션 중 가장 약한 하나에 집중한다.
- **"인식(recognition)"부터 시작한다.** 만들기 전에 좋은 것을 알아보는 눈을 먼저 기른다 — 잘 만든 도구 10개, 좋은 논문·설계 문서 10편을 의식적으로 분해해 본다.
- **AI가 만든 코드를 위한 나만의 평가 체크리스트를 만든다.** 원문의 첫 프로젝트처럼, "이 PR을 받을지 말지"를 가르는 기준을 글로 적어 evaluation을 명시적·반복 가능하게 만든다.
- **매주 나란히 비교(side-by-side)를 습관화한다.** 같은 문제의 두 해법(예: AI 초안 vs 내 수정본)을 놓고 "왜 이게 더 나은가"를 한 문단으로 적는다. 변별력은 비교에서 자란다.
- **속도가 아니라 판단으로 평가받는 자리·과업을 고른다.** "얼마나 빨리 쳤나"가 아니라 "무엇을 만들지 정했나"로 기여가 측정되는 일에 시간을 옮긴다.
- **배운 것을 공개한다.** 블로그 글·설계 문서로 자신의 taste를 외부화하면, 그 자체가 vision 단계 훈련이자 포트폴리오가 된다. (이 위키도 그 한 형태다.)

## 마무리

이 글의 메시지는 단순하다 — AI가 코드를 거의 공짜로 만들수록, 값은 "무엇을 만들지, 무엇이 좋은지"를 판단하는 안목으로 이동한다. 그리고 그 안목은 타고나는 것이 아니라 인식→나침반→비전의 순서로 훈련할 수 있다. 코드를 치는 일이 commodity가 된 자리에서, 오래된 장인의 질문 — "이게 정말 좋은가?" — 을 던질 줄 아는 사람이 30x의 레버리지를 갖는다. 원문의 말처럼, taste는 언제나 일 그 자체였고 우리가 그것을 코드 안에 숨겨두고 있었을 뿐이다.

### 더 읽어보기

- [원문 — How to Be a 30x AI Engineer with a Taste (Pratik Bhavsar)](https://pakodas.substack.com/p/how-to-be-a-30x-ai-engineer-with-a-taste)
- [AI는 왜 소프트웨어 엔지니어를 대체하지 못했나](/2026/06/19/ai-hasnt-replaced-engineers.html) — taste(decide)가 자동화 밖에 남은 이유를 샌드위치 모델로 본 글
- [Loop Engineering (Addy Osmani)](/2026/06/19/loop-engineering.html) — "생성은 위임, 평가는 사람"이라는 maker/checker 분리
- [소프트웨어는 죽는 게 아니라 재평가된다](/2026/06/19/software-is-evolving-not-dead.html) — 도구가 아니라 판단이 가치를 가른다
- [Martin Fowler의 Fragments로 읽는 균형 감각](/2026/06/19/martin-fowler-fragments-llm-era.html) — LLM 시대에도 변하지 않는 엔지니어링 판단
- [Craftsmanship Essential Curriculum](/2026/06/19/craftsmanship-essential-curriculum.html) — "무엇이 좋은가"를 묻는 장인의 안목, taste의 고전적 뿌리
- [바이브 코딩 너머 개발자 생존법](/2026/01/02/바이브-코딩-너머-개발자-생존법.html) — 마법은 실재하지만 책임은 사람의 몫
