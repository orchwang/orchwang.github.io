---
layout: post
title: "내 홈랩 AI Dev Platform: OpenCode와 GitOps로 안전하게 AI에게 인프라를 맡기기"
date: 2026-06-19
categories: Articles
tags: [articles, ai, coding-agent, gitops, devops]
published: true
excerpt: "Rsgm's Blog의 'My Homelab AI Dev Platform'을 읽고, OpenCode 코딩 에이전트를 격리된 VM에 두고 PR 리뷰와 GitOps로 인프라 변경을 안전하게 흘려보내는 self-hosted AI 개발 파이프라인을 개발자 관점에서 분석·정리한다."
---

## 원문 정보

> - **제목**: My Homelab AI Dev Platform
> - **출처**: Rsgm — Rsgm's Blog ([rsgm.dev](https://rsgm.dev/post/ai-dev-platform/))
> - **발행**: 2026-06-14 · 약 4분 분량
> - **다루는 도구**: OpenCode · Forgejo · Arcane · Truenas · Home Assistant · Cloudflare Pages
> - **원문 링크**: <https://rsgm.dev/post/ai-dev-platform/>

`Articles` 카테고리는 읽을 만한 외부 글을 골라 핵심을 정리하고 내 관점으로 분석하는 공간이다. 앞선 [신뢰할 수 있는 Agentic AI 시스템](/2026/06/19/reliable-agentic-ai-systems.html)이 *프로덕션 LLM 시스템*의 신뢰성을 다뤘다면, 이 글은 한층 더 개인적인 결에서 **코딩 에이전트에게 내 인프라를 어디까지, 어떻게 안전하게 맡길 것인가**를 작은 홈랩 사례로 보여준다.

## 한 줄 요약 (TL;DR)

OpenCode를 격리된 VM에 올려두고, 에이전트는 feature branch에 push만 할 수 있게 권한을 좁힌 뒤, 모든 변경을 사람이 PR에서 리뷰·머지하면 GitOps가 배포를 가져가는 self-hosted AI 개발 플랫폼 — "blast radius를 작게 유지한 채 AI에게 손을 맡기는" 구성이다.

## 왜 이 글을 골랐나

요즘의 AI 개발 논의는 대개 "에이전트가 코드를 얼마나 잘 짜는가"에 쏠려 있다. 이 글은 방향이 다르다. **에이전트의 능력이 아니라 에이전트를 가두는 경계(containment)** 가 주제다.

- vendor-agnostic한 도구 선택, 권한 최소화, human-in-the-loop, GitOps 자동 배포 — AI를 실무 파이프라인에 끼워 넣을 때 반복적으로 마주치는 설계 결정들이 4분짜리 짧은 글에 압축돼 있다.
- 거창한 플랫폼이 아니라 **한 사람이 홈랩에서 직접 굴리는 구성**이라, 우리 위키가 다뤄 온 [Continuous Integration](/2026/06/19/continuous-integration.html)·[바이브 코딩 너머 개발자 생존법](/2026/01/02/바이브-코딩-너머-개발자-생존법.html)의 논의를 아주 구체적인 셋업으로 만져볼 수 있다.

## 핵심 내용

원문은 OpenCode 도구 선택, 플랫폼 구성, 워크플로의 세 절로 짧게 이어진다.

### OpenCode를 고른 이유

저자는 코딩 에이전트로 OpenCode를 골랐다. 웹 UI, 터미널, 파일 브라우저, git diff 보기를 내장한 vendor-agnostic한 환경이라는 점이 핵심이다. 이전에 쓰던 Claude Code를 대체한 계기는 토큰 제한이었다 — 저자는 "AI providers have been really squeezing the value out of customers recently through token limits, so I took the opportunity to look into other options"라고 적는다. 특정 벤더의 토큰 정책에 묶이지 않는 선택지를 찾다가 OpenCode로 옮긴 것이다.

### AI Dev Platform 구성

OpenCode 서버는 Truenas 위에 띄운 VM에서 돌아간다. 핵심은 권한을 좁히는 방식이다.

- **전용 Git 사용자**: OpenCode에 별도 Git 계정과 SSH 키를 줬다. clone과 feature branch push는 되지만 **deploy branch에는 push할 수 없다.**
- **네트워크 격리**: VM은 인터넷과 Git 서버에는 닿지만 **실제 서비스에는 접근할 수 없다.** 이렇게 영향 범위(blast radius)를 작게 묶었다.
- **VM 내 root 허용**: 빌드 도구나 테스트 의존성을 설치해야 하므로 VM 안에서는 OpenCode에 root를 줬다. 저자는 "Because the blast radius is small, I am comfortable giving OpenCode root on the VM"이라고 말한다 — 경계가 작으니 그 안에서는 넉넉히 풀어준다는 논리다.

### 7단계 워크플로

변경은 다음 7단계를 따른다.

1. OpenCode에서 기능·개선을 계획한다 (스펙, 구현 계획, 자기 리뷰).
2. 가능하면 변경을 테스트·검증한다.
3. 마음에 안 드는 부분을 OpenCode와 반복(iterate)한다.
4. OpenCode가 feature branch에 변경을 push한다.
5. 그 branch로 PR을 연다.
6. 만족하면 PR을 머지한다.
7. GitOps가 배포를 가져간다 — docker 서비스 변경은 Arcane, Home Assistant 설정 변경은 GitOps 플러그인, 블로그 변경은 Cloudflare Pages worker가 처리한다.

저자의 표현대로 "OpenCode writes the change and I merge it myself in a PR" — 에이전트가 쓰고, 머지는 사람이 한다. 서비스 마이그레이션 흐름은 Truenas에서 Arcane GitOps로 옮겨가는 형태다.

### 남은 한계: CI 피드백 연동

원문이 짚는 주요 한계는 CI 피드백을 에이전트에 물리지 못한다는 점이다. Git 서버는 Actions를 갖춘 Forgejo인데, "Forgejo Actions does not expose job logs through the public API" — 즉 Forgejo Actions가 job 로그를 public API로 노출하지 않아, 코딩 에이전트에게 CI 결과를 진단용으로 넘겨주지 못한다.

## 분석과 인사이트

(아래는 원문 요약이 아니라 내 관점이다.)

- **"능력"이 아니라 "경계"를 설계했다는 점이 핵심이다.** 이 글의 안전성은 모델이 똑똑해서가 아니라, deploy branch push 차단·서비스 네트워크 격리·PR 게이트라는 *구조*에서 나온다. 같은 발상을 [신뢰할 수 있는 Agentic AI 시스템](/2026/06/19/reliable-agentic-ai-systems.html)에서는 harness engineering이라 불렀다. 여기서는 그 harness가 곧 인프라 권한 모델이다.

- **권한 최소화와 root 허용이 모순이 아니다.** 보통 "에이전트에 root"는 위험 신호지만, 여기서는 그 root가 닿는 면적을 먼저 좁혀 두었기에 성립한다. blast radius를 먼저 정의하고 그 안에서 자유를 주는 — 권한 설계의 순서가 정확하다. AI에 권한을 줄 때 흔히 빠지는 함정은 "무엇을 막을까"부터 고민하는 것인데, 이 글은 "영향 범위를 어디로 가둘까"부터 정한다.

- **human-in-the-loop가 PR이라는 익숙한 자리에 들어갔다.** 새로운 검토 도구를 만들지 않고 기존 PR 리뷰를 게이트로 재사용했다. 팀이 이미 가진 리뷰 문화·CI 파이프라인이 그대로 AI 거버넌스 장치가 된다는 점은 실무 적용 비용을 크게 낮춘다. [바이브 코딩 너머 개발자 생존법](/2026/01/02/바이브-코딩-너머-개발자-생존법.html)이 강조한 "에이전트가 짠 코드를 끝까지 책임지는 사람"의 역할이, 여기서는 머지 버튼을 누르는 손으로 구체화된다.

- **CI 피드백 단절은 자동화 루프의 마지막 퍼즐이다.** 에이전트가 push까지 하는데 CI 결과를 다시 읽지 못하면, 빌드 깨짐을 사람이 매번 옮겨 줘야 한다. [Continuous Integration](/2026/06/19/continuous-integration.html)이 말하는 "빠른 피드백 루프"가 사람 단계에서 한 번 끊기는 셈이다. 에이전트 시대의 CI는 *사람만 읽는 로그*가 아니라 *기계도 읽는 로그*를 요구한다는 신호로 읽힌다.

- **vendor lock-in을 도구 선택의 1순위로 둔 점도 시사적이다.** 토큰 정책 한 번에 워크플로 전체가 흔들리지 않도록, 교체 가능한(swappable) 코딩 환경을 고른 결정은 개인 홈랩을 넘어 조직에도 그대로 적용되는 원칙이다.

## 적용 포인트

- 코딩 에이전트를 인프라에 붙이기 전에 **blast radius부터 정의하라**: 어떤 네트워크·브랜치·서비스에 닿을 수 있는지 경계를 먼저 그리고, 그 안에서만 권한을 넉넉히 준다.
- **deploy/main 브랜치 직접 push를 막고 feature branch + PR로만 흐르게** 하라. 에이전트에게는 전용 Git 사용자와 좁힌 SSH 권한을 부여한다.
- 기존 **PR 리뷰를 AI 거버넌스 게이트로 재사용**하라. 별도 검토 체계를 새로 만들 필요가 없다 — 머지는 사람이 한다.
- 에이전트가 실험·빌드할 공간은 **격리된 VM/컨테이너**로 두고, 그 안에서는 도구 설치를 위해 권한을 풀어줘도 외부 영향이 없게 만든다.
- **CI 로그를 기계가 읽을 수 있게** 노출하라(API·아티팩트). 그래야 에이전트가 빌드 실패를 스스로 진단·수정하는 닫힌 루프가 완성된다.
- 코딩 도구는 **교체 가능한 것으로** 골라 한 벤더의 가격·토큰 정책에 워크플로가 인질로 잡히지 않게 한다.

## 마무리

이 글의 미덕은 규모가 아니라 순서에 있다. 영향 범위를 먼저 작게 가두고, 그 경계 안에서 에이전트에게 자유를 주고, 사람이 PR로 한 번 거른 뒤 GitOps가 배포를 마무리한다. "AI에게 인프라를 맡겨도 되는가"라는 질문은 모델 성능이 아니라 이런 **경계 설계와 리뷰 게이트의 문제**라는 점을, 한 사람의 홈랩이 4분 만에 설득력 있게 보여준다. 남은 CI 피드백 연동까지 닫히면, 개인 홈랩 수준에서도 꽤 성숙한 AI 개발 파이프라인이 된다.

### 더 읽어보기

- [원문 — My Homelab AI Dev Platform (Rsgm's Blog)](https://rsgm.dev/post/ai-dev-platform/)
- [신뢰할 수 있는 Agentic AI 시스템 만들기](/2026/06/19/reliable-agentic-ai-systems.html) — agentic 시스템의 신뢰성을 만드는 harness engineering, 이 글의 권한·경계 설계와 같은 결
- [Continuous Integration: 통합 지옥을 없애는 실천](/2026/06/19/continuous-integration.html) — 이 글이 한계로 짚은 "CI 피드백 루프"의 원리
- [바이브 코딩 너머 개발자 생존법](/2026/01/02/바이브-코딩-너머-개발자-생존법.html) — 에이전트가 짠 코드를 책임지는 사람의 역할
- [The Founder's Playbook: AI 네이티브 스타트업을 만드는 4단계](/2026/06/19/the-founders-playbook.html) — AI를 일하는 방식에 끼워 넣는 또 다른 관점
