---
layout: post
title: "신뢰할 수 있는 Agentic AI 시스템 만들기: PRINCE 사례로 보는 컨텍스트·하니스 엔지니어링"
date: 2026-06-19
categories: [Articles, AI-Engineering]
tags: [articles, ai, llm, rag, architecture]
published: true
excerpt: "Martin Fowler 사이트에 실린 Thoughtworks의 PRINCE 사례 연구를 읽고, 프로덕션 agentic AI의 신뢰성을 만드는 두 축 — context engineering과 harness engineering — 을 개발자 관점에서 분석·정리한다."
---

## 원문 정보

> - **제목**: Building Reliable Agentic AI Systems
> - **출처**: Sarang Sanjay Kulkarni (Thoughtworks Principal Consultant) — Martin Fowler 사이트 ([martinfowler.com](https://martinfowler.com/articles/reliable-llm-bayer.html))
> - **발행**: 2026-06-16 · 약 20~25분 분량
> - **사례 시스템**: PRINCE — 제약 전임상(preclinical) 연구를 돕는 멀티 에이전트 RAG 플랫폼
> - **원문 링크**: <https://martinfowler.com/articles/reliable-llm-bayer.html>

`Articles` 카테고리는 읽을 만한 외부 아티클을 골라 핵심을 정리하고 내 관점으로 분석하는 공간이다. 앞선 [The Founder's Playbook](/2026/06/19/the-founders-playbook.html)이 "AI 시대에 일하는 방식"을 그렸다면, 이 글은 한 단계 더 안으로 들어가 **LLM 기반 시스템을 실제로 프로덕션에서 신뢰할 수 있게 만드는 엔지니어링**을 구체적인 사례로 보여준다.

## 한 줄 요약 (TL;DR)

프로덕션 수준의 agentic AI는 더 좋은 모델이나 더 좋은 프롬프트만으로 완성되지 않는다. 신뢰성은 **모델이 보는 컨텍스트를 설계하는 일(context engineering)** 과 **모델이 동작하는 골격을 설계하는 일(harness engineering)** 을 함께 엔지니어링할 때 나온다. PRINCE는 이 둘을 멀티 에이전트 RAG 시스템으로 구현한 사례다.

## 왜 이 글을 골랐나

요즘 "LLM 앱"을 만드는 글은 많지만 대부분 프로토타입 단계의 이야기다. 이 글의 가치는 **규제가 강한 도메인(제약 전임상 연구)에서 신뢰성·추적성·복구가 실제로 어떻게 요구되고, 그것을 어떤 구체적 엔지니어링 결정으로 충족시켰는지**를 데모가 아니라 운영 시스템의 언어로 풀어낸다는 점에 있다.

특히 원문은 추상적 조언("RAG를 잘 쓰자")에 머물지 않고, 하이브리드 검색 가중치, 재시도 횟수, 리랭킹 후 상위 청크 수 같은 **실제 운영 파라미터와 아키텍처 컴포넌트**까지 공개한다. 신뢰성·확장성·유지보수성을 다루는 [Designing Data-Intensive Applications](/2026/06/19/designing-data-intensive-applications.html)의 고전적 원칙이 LLM 시스템에서 어떻게 다시 등장하는지를 확인할 수 있다는 점에서, 이 위키의 엔지니어링 시리즈와 자연스럽게 이어진다.

## 핵심 내용

원문은 PRINCE라는 실제 플랫폼의 진화 과정을 따라가며, 신뢰성을 만든 구체적 결정들을 정리한다.

### 문제 — 전임상 데이터의 미로

전임상 연구 데이터는 여러 사일로에 흩어져 있고 검색 능력이 제한적이었다. 원문은 "전통적인 키워드 기반 검색 엔진이 전임상 용어의 복잡성과 변동성에 고전했다"고 지적한다. 결과적으로 연구자가 수작업 분석에 과도한 시간을 쓰고 있었다.

### 해법 — 3단계로 진화한 플랫폼

PRINCE는 한 번에 완성된 시스템이 아니라 세 단계를 거쳐 진화했다.

- **Search 단계**: 흩어진 시스템의 구조화된 메타데이터를 한곳으로 통합한다.
- **Ask 단계**: 비정형 PDF 리포트를 질의하기 위해 RAG를 도입한다.
- **Do 단계**: 멀티 에이전트로 복잡한 작업 수행과 규제 문서 초안 작성까지 확장한다.

### 시스템 아키텍처

원문이 공개한 구성 요소는 다음과 같다. 각 책임이 분리된 저장소로 나뉘어 있는 점이 눈에 띈다.

- **Conversational React UI** — 사용자 인터페이스
- **LangGraph** — 오케스트레이션 계층
- **OpenSearch** — 벡터 데이터베이스(비정형 문서 검색)
- **Athena** — 구조화된 데이터 질의
- **PostgreSQL** — LangGraph checkpointer를 통한 워크플로 상태 영속화
- **DynamoDB** — 애플리케이션 수준 상태/로그
- **Langfuse** — 관측성(observability)
- **CloudWatch** — 시스템 메트릭

### Agentic RAG 워크플로

질의 처리는 단일 프롬프트가 아니라 명시적 단계로 나뉜다.

1. **Clarify User Intent** — 사용자 의도 명확화
2. **Think & Plan** — 작업 계획 수립(process reflection 포함)
3. **Researcher Agent** — RAG + Text-to-SQL로 정보 수집
4. **Reflection Agent** — 수집된 정보의 충분성 검증
5. **Writer Agent** — 답변 합성

RAG 질의 파이프라인은 키워드 추출 → 메타데이터 필터 생성 → **질의 확장(5개 변형 생성)** → 하이브리드 검색(시맨틱 가중치 0.7, 키워드 가중치 0.3) → 리랭킹(상위 7개 청크) → 인용을 포함한 최종 프롬프트 생성으로 이어진다.

Text-to-SQL 경로는 의도 인식 → 동적 스키마 선택 → few-shot 프롬프팅 → SQL 생성·검증 → 실행(최대 50건) → **최대 3회 재시도 오류 처리**의 순서를 따른다.

### 신뢰를 만드는 장치 — 세 종류의 Reflection과 평가

원문은 reflection을 목적이 다른 세 가지로 구분한다.

- **Process reflection (Think & Plan)**: 워크플로 경로 자체가 올바른지 검증한다. 원문은 "다단계 agentic 워크플로, 특히 순차적 행동이 많은 경우 process reflection이 필수"라고 강조한다.
- **Data reflection (Reflection Agent)**: 수집된 정보가 답하기에 충분한지 검증한다.
- **Draft reflection (Writer review loop)**: 답변의 완전성을 검증한다.

평가는 Faithfulness, Answer Relevancy, Context Relevancy, Answer Accuracy, Semantic Similarity 같은 지표로 이뤄지고, **매일 실제 트래픽을 배치로 평가(live traffic evaluation)** 하는 동시에 **큰 변경 후에는 큐레이션된 기준 답변 데이터셋으로 평가(dataset evaluation)** 한다.

### 회복력 — 오류 처리와 복구

신뢰성의 다른 축은 실패를 다루는 방식이다.

- PostgreSQL에 워크플로 상태를 영속화해 **실패 지점부터 재개(node-level recovery)** 한다.
- 시스템 내장 자동 재시도와 사용자 주도 재시도를 모두 제공한다.
- LLM provider fallback으로 특정 모델 장애에 대비한다.

### 데이터 품질 — NER과 어노테이션

PDF에서 개체를 추출하는 Named Entity Recognition 파이프라인을 두고, **신뢰도 점수가 낮은 추출은 격리(quarantine)해 사람이 검토**하게 한다. 자동 어노테이션으로 불완전한 구조화 메타데이터를 보강한다.

### 이어지는 여정 — 반복적 개발

원문은 "충분한 정확도로 먼저 배포하고, 비용 최적화는 나중에, 초기 사용자 피드백으로 개선을 이끈다"는 반복적(iterative) 접근을 강조한다.

## 분석과 인사이트

여기서부터는 원문 요약이 아니라 내 관점이다.

- **"컨텍스트를 늘리는 것"보다 "컨텍스트를 라우팅하는 것"이 핵심이다.** 원문의 가장 인상적인 문장은 "더 큰 컨텍스트 윈도가 각 에이전트가 무엇을 볼지를 선택해야 할 필요를 없애지 못했다"였다. 컨텍스트 윈도가 커질수록 "그냥 다 넣자"는 유혹이 커지지만, PRINCE는 정반대로 간다. 에이전트마다 planning·retrieval·evidence·synthesis 컨텍스트를 분리해서 준다. 이건 단순한 토큰 절약이 아니라 **디버깅 가능성(debuggability)과 조종 가능성(steerability)** 의 문제다. 무엇이 잘못됐을 때 어느 에이전트의 어떤 컨텍스트가 원인인지를 좁힐 수 있어야 운영이 된다.

- **이건 결국 신뢰성·확장성·유지보수성 문제다.** harness engineering이라는 새 용어를 쓰고 있지만, 그 안을 들여다보면 상태 영속화·실패 지점 복구·provider fallback·관측성처럼 분산 시스템 엔지니어링이 수십 년간 다뤄온 주제들이다. [Designing Data-Intensive Applications](/2026/06/19/designing-data-intensive-applications.html)가 말하는 reliability·scalability·maintainability가 LLM 비결정성(non-determinism)이라는 변수를 하나 더 안고 다시 등장한다. LLM은 새로운 패러다임이지만, 그것을 둘러싼 골격은 고전적 엔지니어링의 연장선이다.

- **평가(eval)는 LLM 시스템의 테스트다.** 매일 실제 트래픽을 평가하고 변경 후 기준 데이터셋으로 검증하는 흐름은, [Testing-Refactoring Essential](/2026/06/19/testing-refactoring-essential-curriculum.html)이 다루는 회귀 테스트·지속적 검증의 LLM 버전이다. 결정적 단위 테스트가 없는 세계에서 faithfulness·accuracy 같은 지표가 그 자리를 대신한다. "테스트 없이 리팩터링하지 말라"는 원칙이 "eval 없이 프롬프트/모델을 바꾸지 말라"로 번역된다.

- **세 종류의 reflection은 과한 설계가 아니라 책임의 분리다.** process/data/draft reflection을 나눈 것은, 사실상 "계획이 맞나 / 근거가 충분한가 / 출력이 완전한가"라는 서로 다른 실패 모드에 각각의 검증 지점을 둔 것이다. 모놀리식 프롬프트에서는 이 세 실패가 한 덩어리로 섞여 원인을 가릴 수 없다.

- **규제 도메인이 오히려 좋은 설계를 강제했다.** 모든 주장(claim)을 원본 문서와 페이지 번호로 인용하고, 중간 단계를 사용자에게 노출하고, 사람 검토 지점을 두는 것 — 이건 제약 도메인이라 어쩔 수 없이 한 일이지만, 결과적으로 **추적성(traceability)과 투명성**이라는 모든 LLM 제품에 필요한 자질을 만들어냈다. 제약이 설계를 좋게 만든 좋은 예다.

## 적용 포인트

독자가 바로 적용할 수 있는 실천 항목.

- LLM 시스템을 만들 때 **"프롬프트에 다 넣기"를 기본값으로 두지 말 것.** 단계별로 어떤 컨텍스트가 필요한지를 먼저 나누고, 에이전트/노드마다 필요한 것만 라우팅한다.
- **상태를 영속화**해서 실패 지점부터 재개할 수 있게 한다. 비싼 LLM 호출을 처음부터 다시 돌리는 비용은 곧 운영 비용이다.
- 정형 데이터와 비정형 데이터가 섞여 있으면 **RAG와 Text-to-SQL을 함께** 쓰는 하이브리드 경로를 고려한다. 한 가지 검색 방식으로 모든 질의를 처리하려 하지 않는다.
- **eval을 CI처럼 다룬다.** 프롬프트·모델·리트리버를 바꾸기 전후로 기준 데이터셋 평가를 돌리고, 운영 중에는 실제 트래픽 일부를 주기적으로 평가한다.
- 모든 답변에 **출처 인용과 중간 단계 노출**을 붙여 사용자가 검증할 수 있게 한다. 신뢰는 정답률만이 아니라 검증 가능성에서 나온다.
- 추출/생성에 **신뢰도 점수**를 매기고, 임계값 이하는 자동 통과시키지 말고 사람 검토로 보낸다.

## 마무리

이 글의 메시지는 한 문장으로 압축된다. **"프로덕션 agentic AI의 신뢰성은 모델이 아니라 모델 주변의 엔지니어링에서 나온다."** PRINCE는 멋진 모델 자랑이 아니라, 컨텍스트를 어떻게 나눠 주고(context engineering) 실패·복구·관측·평가의 골격을 어떻게 짜는지(harness engineering)에 대한 성실한 기록이다. LLM이 비결정적이라는 사실은 엔지니어링을 면제해 주는 핑계가 아니라, 오히려 분산 시스템의 고전적 규율을 더 단단히 요구하는 이유가 된다. 모델은 빌려 쓸 수 있어도, 신뢰성은 직접 만들어야 한다.

### 더 읽어보기

- [원문 — Building Reliable Agentic AI Systems (Martin Fowler)](https://martinfowler.com/articles/reliable-llm-bayer.html)
- [The Founder's Playbook: AI 네이티브 스타트업을 만드는 4단계](/2026/06/19/the-founders-playbook.html) — agentic 워크플로를 "일하는 방식"의 관점에서
- [Designing Data-Intensive Applications](/2026/06/19/designing-data-intensive-applications.html) — 신뢰성·확장성·유지보수성, harness engineering의 뿌리
- [Testing-Refactoring Essential Curriculum](/2026/06/19/testing-refactoring-essential-curriculum.html) — eval을 LLM 시스템의 테스트로 다루는 관점
- [바이브 코딩 너머 개발자 생존법](/2026/01/02/바이브-코딩-너머-개발자-생존법.html) — AI 시대 개발자의 역할 변화
