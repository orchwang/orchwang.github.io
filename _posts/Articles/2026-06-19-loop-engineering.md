---
layout: post
title: "Loop Engineering: 에이전트를 프롬프트하는 대신 프롬프트하는 시스템을 설계하라 (Addy Osmani)"
date: 2026-06-19
categories: Articles
tags: [articles, ai, coding-agent, llm]
published: true
excerpt: "Beyond Vibe Coding 저자 Addy Osmani가 쓴 'Loop Engineering'을 읽고, 에이전트를 직접 프롬프트하는 대신 에이전트를 프롬프트하는 루프를 설계한다는 전환과 그 다섯 구성 요소를 개발자 관점에서 분석·정리한다."
---

## 원문 정보

> - **제목**: Loop Engineering
> - **출처**: Addy Osmani ([addyosmani.com](https://addyosmani.com/blog/loop-engineering/))
> - **발행**: 2026-06-07
> - **원문 링크**: <https://addyosmani.com/blog/loop-engineering/>

이 글은 이 위키의 BookLog [바이브 코딩 너머 개발자 생존법](/2026/01/02/바이브-코딩-너머-개발자-생존법.html)에 내가 덧붙인 ["SDD 다음은 loop engineering?"](/2026/01/02/바이브-코딩-너머-개발자-생존법.html#덧붙임-본문-외-sdd-다음은-loop-engineering) 메모의 1차 출처다. 같은 책의 저자(Addy Osmani)가 바로 그 주제를 본격적으로 다뤘기에, Articles 카테고리에 정리해 양쪽을 잇는다.

## 한 줄 요약 (TL;DR)

원문의 정의를 그대로 옮기면, "loop engineering이란 에이전트를 프롬프트하는 사람의 자리를 당신 스스로 대체하는 것이다. 대신 그 일을 하는 시스템을 설계한다"(*Loop engineering is replacing yourself as the person who prompts the agent. You design the system that does it instead.*). 즉 프롬프트를 한 번씩 던지는 일에서, 일을 스스로 발견하고 위임하고 검증하고 다음을 결정하는 **자율 루프를 설계하는 일**로 레버리지가 이동한다는 주장이다.

## 왜 이 글을 골랐나

나는 [바이브 코딩 너머 개발자 생존법](/2026/01/02/바이브-코딩-너머-개발자-생존법.html) 리뷰 끝에, `vibe coding → AI-assisted engineering → SDD` 흐름의 다음은 loop engineering일 것이라고 적었다. 그건 어디까지나 내 추측이었는데, 마침 그 책의 저자가 같은 키워드로 글을 써서 "내가 본 방향이 실제 현장의 언어로 어떻게 정리되는가"를 대조해 볼 수 있는 좋은 기회였다.

특히 이 글의 가치는 추상적 선언에 그치지 않고, 루프를 구성하는 **다섯 개의 구체적 부품(automations, worktrees, skills, plugins/connectors, sub-agents)** 을 Codex와 Claude Code라는 실제 도구의 기능에 매핑해 설명한다는 점에 있다. "에이전트가 알아서 일한다"는 막연한 비전을, 오늘 만질 수 있는 프리미티브로 끌어내린다.

## 핵심 내용

원문은 두 실무자의 주장으로 문을 연다. 원문에 따르면 Peter Steinberger는 "더 이상 코딩 에이전트를 프롬프트하면 안 된다. 에이전트를 프롬프트하는 루프를 설계해야 한다"(*You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents.*)고 했고, Boris Cherny는 "나는 더 이상 Claude를 프롬프트하지 않는다. Claude를 프롬프트하고 무엇을 할지 알아내는 루프들을 돌리고 있다. 내 일은 루프를 짜는 것이다"(*I don't prompt Claude anymore. I have loops running that prompt Claude and figuring out what to do. My job is to write loops*)라고 했다. 원문은 이 두 인용을 X(Twitter)에서 가져온 제3자의 발언으로 분명히 출처를 밝혀 인용한다.

### 루프를 이루는 다섯 부품

원문의 골격은 "루프를 구성하는 다섯 조각"이며, Codex와 Claude Code가 이름만 다를 뿐 같은 능력을 구현한다고 정리한다.

- **Automations (자동화) — 루프의 심장 박동**: 일을 한 번 돌리고 끝내는 게 아니라 정말로 *재귀적으로* 만드는 부분이다. 스케줄에 따라 돌며 발견한 것을 triage 인박스로 올린다. 원문은 검증 가능한 조건이 참이 될 때까지 도는 `/goal` 같은 형태도 대안으로 언급한다.
- **Worktrees (워크트리)**: 여러 에이전트가 병렬로 일할 때 파일 충돌을 막는다. Git worktree로 저장소 히스토리를 공유하면서도 격리된 작업 디렉터리를 준다. 다만 원문은 한계도 짚는다 — 실제로 몇 개를 돌릴 수 있느냐는 결국 **사람의 리뷰 대역폭**이 결정한다.
- **Skills (스킬)**: 세션마다 프로젝트를 처음부터 다시 설명하지 않게 해준다. 의도·관례·빌드 절차·프로젝트 히스토리를 `SKILL.md`에 담아, 매번 0에서 다시 유도하는 대신 사이클을 거치며 지식을 **누적(compound)** 한다. 원문은 skill이 저작(authoring) 형식이고 plugin이 배포(distribution) 메커니즘이라고 구분한다.
- **Plugins / Connectors (플러그인·커넥터)**: 루프가 MCP를 통해 이슈 트래커·데이터베이스·API·메시징 같은 실제 도구에 닿게 한다. 원문은 "고치라고 *제안만* 하는 루프"와 "스스로 PR을 열고 티켓을 연결하고 채널에 알림을 보내는 루프"의 차이라고 표현한다.
- **Sub-agents (서브 에이전트)**: 생성(maker)과 검증(checker)을 분리한다. 원문의 핵심 주장은 **원래 모델은 자기 작업을 너무 관대하게 채점한다**는 것이다. 그래서 다른 모델이 검토하게 하고, 종료 조건(`/goal` 완료 판정)에도 같은 분리를 적용한다. 토큰 비용이 더 들지만 "second opinion"이 중요한 곳에서 정당화된다고 본다.

여기에 더해 진행 상태를 markdown이나 Linear에 기록하는 **State(상태)** 가 루프를 다음 사이클로 이어준다.

### 하나의 루프가 도는 모습

원문이 그리는 예시는 이렇다. 아침에 automation이 triage skill을 돌려 CI 실패·이슈·커밋을 읽고 발견 사항을 markdown 또는 Linear에 적는다. 격리된 worktree를 열어 한 sub-agent가 수정 초안을 만들고, 두 번째 sub-agent가 그것을 리뷰한다. connector가 PR을 열고 티켓을 갱신한다. state 파일이 진행 상황을 추적해 다음 사이클에 루프가 이어서 재개한다.

### 루프가 *대신 해주지 않는* 것

원문이 가장 힘주어 강조하는 부분이다. 검증의 책임은 여전히 사람에게 남는다. 루프 출력을 리뷰하지 않으면 이해가 "썩는다(rots)" — 일종의 comprehension debt(이해 부채)다. 그리고 루프가 내놓는 것을 판단 없이 받아들이는 **"cognitive surrender(인지적 항복)"** 의 위험을 경고한다. 원문의 표현을 빌리면 "방치된 채 도는 루프는 곧 방치된 채 실수를 저지르는 루프이기도 하다"(*A loop running unattended is also a loop making mistakes unattended.*).

마지막으로 원문은 루프 설계가 일을 줄여주는 게 아니라 **레버리지의 지점을 옮기는 것**이라고 정리한다. 같은 루프라도 사용자의 의도에 따라 정반대의 결과를 낸다 — 이미 이해한 일을 더 빠르게 밀어붙이는 데 쓸 수도, 이해를 건너뛰는 데 쓸 수도 있다.

> 참고로 원문은 정량적 통계·수치·퍼센트를 제시하지 않는다. 따라서 이 정리에도 구체 수치는 없으며, 위 내용은 모두 원문 본문의 서술과 인용을 따른 것이다.

## 분석과 인사이트

여기서부터는 원문 요약이 아니라 내 관점이다.

- **"무엇을 만들지" 다음은 "어떻게 수렴시킬지"라는 내 예상과 맞물린다.** 나는 BookLog 덧붙임에서 SDD가 입력(스펙)을 정밀화하는 일이라면 loop engineering은 과정(루프)을 설계하는 일이라고 적었다. 이 글은 정확히 그 "과정"을 다섯 부품으로 부품화한다. 흥미로운 건 저자가 "프롬프트 엔지니어링이 끝난다"고 단정하지 않고 "그 부분은 어느 정도 끝났거나, 적어도 그렇게 될 거라고 보는 사람들이 있다"(*That part is kind of over, or at least some think it's going to be.*)고 한 발 물러선 톤을 쓴다는 점이다. 선언이 아니라 관찰로 쓴 글이라 신뢰가 간다.

- **maker/checker 분리는 새 발명이 아니라 고전 규율의 재등장이다.** "같은 모델은 자기 작업을 너무 관대하게 채점한다"는 주장은, 사람이 자기 코드를 리뷰하면 버그를 못 본다는 오래된 사실의 LLM 버전이다. 코드 리뷰·페어링·독립적 QA가 했던 역할을 다른 모델에게 맡기는 것이다. 이건 [신뢰할 수 있는 Agentic AI 시스템](/2026/06/19/reliable-agentic-ai-systems.html)에서 본 reflection 에이전트(생성과 검증의 분리)와 정확히 같은 발상이고, harness engineering이 이미 loop engineering의 초기 형태라는 내 메모를 뒷받침한다.

- **루프의 연료는 "기계가 읽을 수 있는 피드백 신호"다.** automation이 CI 실패를 읽어 triage하는 예시가 핵심을 드러낸다. 루프가 자율적으로 수렴하려면 테스트 결과·CI 로그·eval처럼 *기계가 파싱할 수 있는* 신호가 있어야 한다. 이건 내가 [홈랩 AI Dev Platform](/2026/06/19/homelab-ai-dev-platform.html) 글에서 한계로 짚었던 "CI 로그를 API로 못 읽는다"는 지점과 같은 문제다. 그래서 [Continuous Integration](/2026/06/19/continuous-integration.html)이 만든 빠르고 자동화된 피드백 루프는, 이제 사람만이 아니라 에이전트의 입력이 된다.

- **가장 솔직한 부분은 "루프가 대신 해주지 않는 것"이다.** 대부분의 자동화 글은 능력을 과장하는데, 이 글은 절반을 한계에 쓴다. comprehension debt와 cognitive surrender라는 표현은, 결국 "검증은 위임되지 않는다"는 한 문장으로 모인다. 루프가 코드를 *쓰는* 일은 위임할 수 있어도, 그 코드를 *이해하고 책임지는* 일은 여전히 엔지니어의 몫이다. 이건 [바이브 코딩 너머 개발자 생존법](/2026/01/02/바이브-코딩-너머-개발자-생존법.html)이 말한 "마법은 실재하지만 마법만으로 프로덕션을 책임질 수 없다"와 같은 결론이다.

- **"같은 루프, 정반대 결과"라는 양면성을 직시한다.** 루프는 도구일 뿐 의도를 갖지 않는다. 이해한 일을 가속하는 데 쓰면 레버리지가 되고, 이해를 건너뛰는 데 쓰면 부채가 된다. 같은 무게의 칼이 무엇이 되느냐는 쥔 사람에게 달렸다는 점에서, [소프트웨어는 죽는 게 아니라 재평가된다](/2026/06/19/software-is-evolving-not-dead.html)와 [Martin Fowler의 Fragments로 읽는 균형 감각](/2026/06/19/martin-fowler-fragments-llm-era.html)이 말한 "도구가 아니라 판단이 가치를 가른다"는 메시지와 같은 자리에 선다.

## 적용 포인트

독자가 바로 적용할 수 있는 실천 항목.

- **프롬프트 한 줄을 다듬기 전에, 그 일이 반복 가능한 루프인지부터 본다.** 일회성 작업이면 그냥 프롬프트하고, 매일/매 PR마다 반복되는 일이면 automation으로 만들 후보다.
- **프로젝트 컨텍스트를 `SKILL.md`로 외부화한다.** 의도·관례·빌드 절차를 매 세션 다시 설명하는 대신 한곳에 적어두고, 사이클을 거치며 갱신해 지식을 누적시킨다.
- **생성과 검증을 다른 에이전트(또는 다른 모델)로 분리한다.** 자기 작업을 자기가 채점하게 두지 말고, 별도 검토 단계를 둔다. 비용이 들지만 second opinion이 필요한 변경에 선택적으로 적용한다.
- **루프의 연료가 될 기계 판독 가능한 피드백을 먼저 깐다.** 테스트·CI·eval·lint처럼 자동으로 통과/실패를 판정할 신호가 없으면 루프는 수렴하지 못한다. [Continuous Integration](/2026/06/19/continuous-integration.html)·[Testing-Refactoring Essential](/2026/06/19/testing-refactoring-essential-curriculum.html)부터 갖춘다.
- **종료 조건·재시도 한계·비용 예산 같은 가드레일을 명시한다.** `/goal`이 무엇으로 "완료"인지, 몇 번 실패하면 멈추고 사람을 부를지를 루프 설계의 일부로 정의한다.
- **병렬 worktree 수를 도구 한계가 아니라 자신의 리뷰 대역폭에 맞춘다.** 검토하지 못할 만큼 많은 PR을 여는 루프는 속도가 아니라 부채를 생산한다.

## 마무리

이 글의 메시지는 마지막 문장에 압축돼 있다 — "루프를 만들어라. 단, 그저 '실행' 버튼을 누르는 사람이 아니라, 끝까지 엔지니어로 남을 작정인 사람처럼 만들어라"(*Build the loop. But build it like someone who intends to stay the engineer, not just the person who presses go.*). loop engineering은 프롬프트 엔지니어링의 다음 단계처럼 보이지만, 본질은 일을 줄이는 게 아니라 레버리지의 지점을 옮기는 일이다. 자동화할 수 있는 것(발견·위임·반복)과 위임할 수 없는 것(이해·검증·책임)을 가르는 안목 — 그게 루프 시대에도 변하지 않는 엔지니어의 자리다.

### 더 읽어보기

- [원문 — Loop Engineering (Addy Osmani)](https://addyosmani.com/blog/loop-engineering/)
- [바이브 코딩 너머 개발자 생존법 — "SDD 다음은 loop engineering?" 덧붙임](/2026/01/02/바이브-코딩-너머-개발자-생존법.html#덧붙임-본문-외-sdd-다음은-loop-engineering) — 같은 저자의 책 리뷰이자 이 글을 예고한 1차 메모
- [신뢰할 수 있는 Agentic AI 시스템](/2026/06/19/reliable-agentic-ai-systems.html) — harness engineering, loop engineering의 초기 형태
- [내 홈랩 AI Dev Platform](/2026/06/19/homelab-ai-dev-platform.html) — 루프의 연료가 되는 CI 피드백 신호와 그 한계
- [Continuous Integration](/2026/06/19/continuous-integration.html) — 기계가 읽는 빠른 피드백 루프의 토대
- [Testing-Refactoring Essential Curriculum](/2026/06/19/testing-refactoring-essential-curriculum.html) — 루프가 수렴하려면 필요한 자동 검증
