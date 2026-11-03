---
layout: post
title: "TDD의 래칫, 가벼운 CI, pstack: 프로젝트 운영체제를 선택하는 법"
date: 2026-11-03
categories: [Engineering, Mindset]
tags: [engineering, mindset, tdd, testing, continuous-integration, regression-testing, spec-driven-development, requirements-engineering, sdd-helper, pstack, agentic-engineering]
published: true
presentation: true
excerpt: "pstack-governed와 SDD-governed 중 하나를 프로젝트·독립 subsystem 경계에서 milestone 동안 선택하고, TDD·CI·ADR·Feature Map 등은 어느 쪽에서도 쓰는 독립 control로 둔다. 선택은 우월성 주장이 아니라 측정할 운영 가설이며, 실패하면 다음 milestone에서 clean cutover한다."
---

<figure class="post-figure post-figure--header">
<svg viewBox="0 0 800 440" role="img" aria-labelledby="tdd-controls-title tdd-controls-desc" xmlns="http://www.w3.org/2000/svg">
  <title id="tdd-controls-title">하나의 프로젝트 계약 기준선과 TDD·CI의 영구 래칫, 독립 product-surface verification을 잇는 안전 모델</title>
  <desc id="tdd-controls-desc">왼쪽의 TDD 크랭크가 설계를 전진시키고, 가운데에는 프로젝트가 선택한 운영체제의 권위 있는 계약 기준선이 있다. 아래 왼쪽에서는 낮고 안정적인 가드가 CI에서 반복되는 래칫이 되고, 아래 오른쪽에서는 독립 검증자가 UI, CLI, API를 직접 실행해 확인한다. 두 종류의 증거는 어느 운영체제에서도 쓰는 독립 control이며 서로 다른 시간축의 신뢰를 만든다.</desc>
  <defs>
    <marker id="tdd-arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0 0 L10 5 L0 10 Z" fill="var(--accent-color)"/>
    </marker>
    <marker id="tdd-arrow-secondary" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0 0 L10 5 L0 10 Z" fill="var(--secondary-color)"/>
    </marker>
  </defs>

  <text x="400" y="28" text-anchor="middle" fill="currentColor" font-family="inherit" font-size="16" font-weight="700">한 계약 기준선을 두 시간축에서 지킨다</text>

  <!-- TDD crank: useful for moving design, not an automatic lifetime commitment -->
  <g>
    <circle cx="92" cy="112" r="43" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="3"/>
    <path d="M66 86 A43 43 0 0 1 124 91" fill="none" stroke="var(--accent-color)" stroke-width="3" marker-end="url(#tdd-arrow-accent)"/>
    <line x1="92" y1="112" x2="125" y2="82" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <circle cx="92" cy="112" r="6" fill="var(--bg-panel)" stroke="currentColor" stroke-width="2"/>
    <circle cx="131" cy="76" r="8" fill="var(--secondary-color)" stroke="currentColor" stroke-width="2"/>
    <text x="92" y="108" text-anchor="middle" fill="currentColor" font-family="inherit" font-size="11" font-weight="700">RED</text>
    <text x="92" y="124" text-anchor="middle" fill="currentColor" font-family="inherit" font-size="10">GREEN</text>
    <text x="92" y="174" text-anchor="middle" fill="currentColor" font-family="inherit" font-size="14" font-weight="700">크랭크</text>
    <text x="92" y="191" text-anchor="middle" fill="var(--text-light)" font-family="inherit" font-size="11">설계를 전진시킨다</text>
  </g>

  <path d="M150 112 H250" fill="none" stroke="var(--secondary-color)" stroke-width="3" marker-end="url(#tdd-arrow-secondary)"/>
  <text x="200" y="99" text-anchor="middle" fill="var(--text-light)" font-family="inherit" font-size="11">모든 exploratory test가 아니라</text>

  <!-- Contract gate: decides what deserves permanent protection -->
  <g>
    <path d="M260 66 H540 V145 L500 180 H300 L260 145 Z" fill="var(--bg-light)" stroke="var(--border-color)" stroke-width="3"/>
    <path d="M278 82 H522" fill="none" stroke="var(--gold)" stroke-width="3"/>
    <text x="400" y="112" text-anchor="middle" fill="currentColor" font-family="inherit" font-size="18" font-weight="700">권위 있는 계약 기준선</text>
    <text x="400" y="136" text-anchor="middle" fill="var(--text-light)" font-family="inherit" font-size="12">project contract 또는 Requirements</text>
    <text x="400" y="159" text-anchor="middle" fill="var(--accent-color)" font-family="inherit" font-size="12" font-weight="700">운영체제마다 하나만 유지</text>
  </g>

  <!-- One contract creates two complementary kinds of evidence -->
  <path d="M400 180 V202 H205 V224" fill="none" stroke="var(--accent-color)" stroke-width="2.5" marker-end="url(#tdd-arrow-accent)"/>
  <path d="M400 180 V202 H595 V224" fill="none" stroke="var(--secondary-color)" stroke-width="2.5" marker-end="url(#tdd-arrow-secondary)"/>
  <text x="205" y="216" text-anchor="middle" fill="var(--accent-color)" font-family="inherit" font-size="11" font-weight="700">미래 변경마다 반복</text>
  <text x="595" y="216" text-anchor="middle" fill="var(--secondary-color)" font-family="inherit" font-size="11" font-weight="700">현재 산출물을 product surface에서 확인</text>

  <!-- Permanent CI ratchet -->
  <g>
    <rect x="30" y="230" width="350" height="128" rx="8" fill="var(--bg-light)" stroke="var(--border-color)" stroke-width="2.5"/>
    <text x="205" y="256" text-anchor="middle" fill="currentColor" font-family="inherit" font-size="15" font-weight="700">영구 래칫 · CI</text>
    <path d="M65 292 H330" fill="none" stroke="var(--accent-color)" stroke-width="3" marker-end="url(#tdd-arrow-accent)"/>
    <text x="197" y="283" text-anchor="middle" fill="var(--text-light)" font-family="inherit" font-size="11">관련 PR마다 같은 계약을 다시 확인</text>
    <path d="M70 334 L92 310 L114 334 L136 310 L158 334 L180 310 L202 334 L224 310 L246 334 L268 310 L290 334 L312 310 L334 334" fill="none" stroke="var(--accent-color)" stroke-width="3" stroke-linejoin="round"/>
    <path d="M174 299 L196 320 L164 323 Z" fill="var(--secondary-color)" stroke="currentColor" stroke-width="1.5"/>
    <text x="205" y="350" text-anchor="middle" fill="currentColor" font-family="inherit" font-size="11" font-weight="700">낮고 안정적인 가드가 역행을 막는다</text>
  </g>

  <!-- Independent real-surface proof -->
  <g>
    <rect x="420" y="230" width="350" height="128" rx="8" fill="var(--bg-light)" stroke="var(--border-color)" stroke-width="2.5"/>
    <text x="595" y="256" text-anchor="middle" fill="currentColor" font-family="inherit" font-size="15" font-weight="700">독립 product-surface verification</text>
    <rect x="450" y="274" width="125" height="62" rx="5" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="2.5"/>
    <line x1="450" y1="290" x2="575" y2="290" stroke="var(--border-color)" stroke-width="2"/>
    <circle cx="461" cy="282" r="3" fill="var(--accent-color)"/>
    <circle cx="472" cy="282" r="3" fill="var(--gold)"/>
    <text x="512" y="314" text-anchor="middle" fill="currentColor" font-family="inherit" font-size="11" font-weight="700">UI · CLI · API</text>
    <circle cx="625" cy="287" r="12" fill="var(--bg-panel)" stroke="currentColor" stroke-width="2"/>
    <path d="M625 299 V326 M608 315 H642" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M667 300 L678 311 L700 284" fill="none" stroke="var(--secondary-color)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="667" y="336" text-anchor="middle" fill="var(--text-light)" font-family="inherit" font-size="10">작성자 밖의 PASS</text>
  </g>

  <!-- Convergence: neither side substitutes for the other -->
  <path d="M205 358 V375 H400 M595 358 V375 H400 M400 375 V388" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.7" marker-end="url(#tdd-arrow-secondary)"/>
  <rect x="285" y="390" width="230" height="36" rx="18" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="3"/>
  <text x="400" y="414" text-anchor="middle" fill="currentColor" font-family="inherit" font-size="14" font-weight="700">가볍고 끊기지 않는 안전망</text>
</svg>
<figcaption>삽화: 프로젝트는 pstack-governed의 project contract와 SDD-governed의 Requirements 추적 사슬 중 하나만 권위 있는 기준선으로 둔다. TDD의 크랭크, CI의 영구 래칫, 독립 product-surface PASS는 두 workflow를 섞는 층이 아니라 어느 운영체제에서도 쓸 수 있는 독립 control이다.</figcaption>
</figure>

<div class="post-summary-box" markdown="1">

### 이 글의 결론

- `pstack-governed`와 `SDD-governed`는 ticket마다 오가는 단계가 아니라 **product·project·독립 subsystem이 milestone 동안 채택하는 서로 다른 운영체제**다. 같은 변경에서 pstack workflow와 SDD 문서 파이프라인을 겹치지 않는다.
- `pstack-governed`는 SDD 문서 파이프라인 없이 project contract, change brief, 선택적 ADR, 실행 가능한 계약, Feature Map을 역할별로 둔다. `SDD-governed`는 Requirements → Specify → Plan을 권위 있는 추적 사슬로 삼고 코드가 문서보다 앞서지 않게 한다.
- TDD·CI·ADR·Feature Map·architecture fitness·cold-start review는 두 운영체제 사이를 잇는 혼합층이 아니라 **어느 쪽에서도 독립적으로 쓰는 engineering controls**다. 좋은 기술을 빌리는 것과 두 workflow의 절차·산출물을 병행하는 것은 다르다.
- 어느 쪽이 우월하다는 공개 근거는 아직 없다. 특히 pstack-governed 선택은 측정 가능한 운영 가설이며, milestone마다 결함 유출률·리드타임·재작업률·리뷰 시간·cold-start 성공률·문서 drift와 유지비를 평가하고 필요하면 다음 경계에서 clean cutover한다.

</div>

## 먼저, pstack은 무엇인가

[pstack](https://github.com/cursor/plugins/tree/main/pstack)은 Cursor agent가 소프트웨어 개발 작업을 수행하는 방식을 묶은 engineering workflow plugin이다. 테스트 도구나 단일 자동 개발 명령이 아니라, 기존 시스템을 이해하고 설계를 탐색하며 구현을 나누고 검증·리뷰·인수인계하는 데 쓰는 **skills, principles, playbooks의 모음**이다. 그중 `poteto-mode`는 Bug fix, Feature, Refactoring, Prototype, Shipping 같은 작업 유형을 판별하고 알맞은 playbook으로 연결하는 중심 workflow router다.

대표적인 흐름은 `/how`와 `/why`로 현재 코드와 결정 배경을 조사하고, `/architect`나 prototype으로 설계 후보를 비교한 뒤, 작은 구현 단위로 작업하는 것이다. 마지막에는 작성자의 설명이나 초록색 테스트만 믿지 않고 UI·CLI·API에서 결과를 직접 실행하며, 작은 ordered PR과 독립 검증으로 변경을 넘긴다. pstack이 강조하는 것은 AI가 코드를 많이 생성하는 속도보다 **실행한 산출물에서 확인할 수 있는 증거**다.

다만 pstack은 모든 작업을 상세한 사전 계획이나 test-first로 시작하지 않는다. 값싼 테스트는 적극 활용하지만, 코드·prototype·product surface 관찰로 불확실성을 줄이는 접근을 선호한다. 바로 이 지점이 Requirements부터 시작하는 나의 경량 SDD와 모든 변경에 영구 회귀 가드를 쌓아 온 TDD·CI 운영 방식에 질문을 던졌다. 이 글은 둘을 한 변경에 결합하는 법이 아니라 **프로젝트 경계에서 하나의 운영체제를 고르고, 방법론과 독립적인 안전장치를 어떻게 유지할지** 검토한다.

## 나는 TDD를 래칫과 크랭크로 써 왔다

내가 여기서 **하드 TDD**라고 부르는 것은 규칙이 강한 형태다. 실패하는 테스트를 확인하기 전에는 제품 코드를 쓰지 않고, Red-Green-Refactor의 보폭을 작게 유지하며, 만들어진 테스트는 기본적으로 CI에 남긴다. 나는 이 규율을 단지 버그를 찾는 기법으로 쓰지 않았다. TDD는 내게 서로 다른 두 기계였다.

첫째는 **래칫(ratchet)**이다. 래칫은 톱니가 한 방향으로만 움직이게 한다. 어제 고친 버그와 어제 합의한 동작을 테스트로 걸어 두면, 오늘의 변경은 그 톱니 아래로 몰래 미끄러질 수 없다. 미래의 모든 PR이 같은 증명을 다시 수행한다. 테스트가 초록이라는 사실이 제품 전체의 정확성을 보장하지는 않지만, 적어도 이미 확보한 계약을 무심코 잃지 않았다는 신뢰를 누적한다.

둘째는 **크랭크(crank)**다. 크랭크는 회전 운동을 전진 운동으로 바꾼다. 아직 없는 API를 테스트에서 먼저 사용해 보고, 가장 작은 Green을 만든 다음, 초록을 유지한 채 구조를 다듬는 한 바퀴가 설계를 한 칸 앞으로 민다. [TDD By Example](/2026/06/19/tdd-by-example.html)이 테스트를 사후 검사가 아니라 API를 먼저 그리는 설계 행위로 다루는 이유다. 테스트는 결과를 확인하는 계기판이면서 다음 설계 결정을 만드는 손잡이다.

하드 TDD를 오래 밀어붙이면 두 기능이 자연스럽게 한데 묶인다. 설계를 전진시키려고 만든 모든 테스트가 회귀 스위트에 남는다. 문제는 **크랭크로 유용했던 테스트가 모두 영구 래칫으로도 가치 있는 것은 아니라는 점**이다. interface discovery를 위해 만든 테스트, 내부 협력 순서를 고정한 mock 테스트, 이미 타입과 구조가 불가능하게 만든 오류를 다시 확인하는 테스트까지 계속 쌓이면, 안전망은 어느 순간 그물보다 갑옷에 가까워진다.

[pstack 분석 글](/2026/10/28/cursor-pstack-poteto-mode.html)을 쓰고 나서 내 질문은 이것이었다.

> 설계를 움직이는 TDD의 힘과 장기 회귀 신뢰를 잃지 않으면서, 정말로 가치 있는 톱니만 남길 수는 없을까?

## pstack 문서가 밝히는 입장부터 정확히 읽어야 한다

pstack을 "테스트 대신 에이전트가 화면을 한 번 눌러 보는 방식"으로 요약하면 중요한 절반을 놓친다. 반대로 pstack을 TDD의 현대적 완성형이라고 부르는 것도 과장이다. 원문 플레이북과 스킬을 함께 읽으면 훨씬 조건부이고 실용적인 입장이 보인다.

- [`/tdd` 스킬](https://github.com/cursor/plugins/blob/main/pstack/skills/tdd/SKILL.md)은 범용 개발 절차가 아니라 **버그 수정 중심의 조건부 도구**다. 사용자가 TDD·실패 테스트·회귀 테스트를 명시적으로 요구했거나, 버그에 값싸고 명확한 로컬 테스트 지점이 있을 때만 쓴다. 테스트 경로가 불분명하거나 비싸고 통합 인프라에 무겁게 기대면 억지로 만들지 않는다.
- [Bug fix 플레이북](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/bug-fix.md)은 같은 사용자 표면에서 직접 재현하고, 원인을 이분 탐색하며, 수정 후 같은 표면에서 다시 증명하라고 한다. 값싼 테스트 경로가 있을 때에만 `/tdd`의 실패-우선 순서를 붙인다. "단위 테스트는 분기 동작을 보여 줄 뿐, 버그의 부재를 증명하지 않는다"는 경고도 명시한다.
- [Feature 플레이북](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/feature.md)은 `how`로 기존 시스템을 이해하고, `architect`로 설계를 탐색하고, 구현을 위임한 뒤, 일치하는 표면에서 검증한다. **기능 개발에 test-first를 의무화하는 단계는 없다.** 그렇다고 테스트를 금지하지도 않는다. 테스트를 모든 기능의 기본 의식으로 삼지 않을 뿐이다.
- [Refactoring 플레이북](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/refactoring.md)은 구조를 움직이기 전에 characterization test, snapshot, equivalence harness 중 하나로 현재 동작을 고정하고, 마지막에는 빌드·실행한 산출물에서 동작 불변을 증명한다. 컴파일과 타입 체크만으로는 동작 pin이 아니라고 선을 긋는다.
- [`Test Behavior, Not Implementation` 원칙](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-test-behavior-not-implementation/SKILL.md)은 좋은 테스트를 두 개의 반사실로 판정한다. 동작을 깨뜨리면 실패해야 하고, 관찰 가능한 동작을 보존한 채 내부만 바꾸면 계속 통과해야 한다. 둘 중 하나를 만족하지 못하면 고치거나 지운다.
- [`/correct` 스킬](https://github.com/cursor/plugins/blob/main/pstack/skills/correct/SKILL.md)은 반복 실수를 막을 때 아키텍처, 타입, 오류가 해법을 알려 주는 lint·CI check, 행동 테스트, 문서 순으로 올라간다. 테스트를 첫 번째 방어선으로 두지 않고, 더 강하고 싼 제약으로 막지 못한 행동을 테스트에 맡긴다.
- [Opening a PR](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/opening-a-pr.md)은 PR에 재현 가능한 실행 경로와 결과를 남기게 하고, [Babysit](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/babysit.md)은 CI와 리뷰를 정리해 merge-ready 상태까지 만든다. 그러나 release는 별도 [Shipping 플레이북](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/shipping.md)이 맡는다. 여기서는 코드를 쓰지 않은 독립 검증자가 사용자처럼 변경을 실행해야 하며, **green CI와 승인한 bot review만으로는 verdict가 아니라고 명시한다.** 다만 Shipping은 각 제품 계약을 어떤 CI 가드가 영구히 덮어야 하는지까지 정의하지 않는다.

이 입장은 반(反)테스트가 아니다. 오히려 테스트를 더 엄격하게 대한다. 구현을 비추는 거울, 값비싼 mock 연극, product surface와 동떨어진 초록 막대를 신뢰하지 않는다. 타입·아키텍처·lint로 막을 수 있는 실수는 거기서 막고, 테스트는 사용자가 관찰할 수 있는 계약에 집중하며, 마지막에는 product surface에서 별도의 증거를 요구한다.

나는 이 방향에 크게 동의한다.

## pstack과 내가 쓰는 경량 SDD는 어디서 충돌하는가

`sdd-helper`는 내가 요구사항부터 구현 계획까지 추적하기 위해 작성해 사용하는 경량 SDD 도구다. 이 글에서 SDD라고 부르는 것은 이 도구로 운용하는 **`Requirements 작성 → Specify → Plan → 구현`** 흐름이다. 내가 `requirements.md`를 직접 작성하고, AI가 이를 `specs.md`의 기술 명세와 `plans.md`의 구현 단계로 변환하며, 각 단계는 사람의 검토를 거친다. 코드 구현은 `sdd-helper`의 범위 밖이다.

이 흐름의 핵심은 문서 수가 아니라 추적 사슬이다. `FR-X → TS-X → Step N`으로 요구사항, 기술 결정, 구현 작업을 연결하고, 요구사항이 바뀌면 `update-requirements`가 명세와 계획의 영향 범위를 연쇄 갱신한다. implementation discovery도 완료된 단계를 몰래 다시 쓰지 않고, 어떤 문서와 남은 계획이 달라졌는지 드러내도록 설계돼 있다.

반면 [pstack README](https://github.com/cursor/plugins/blob/main/pstack/README.md)는 계획을 기본값으로 믿지 않으며 "the best spec is code"라고 선을 긋는다. Feature 플레이북은 현재 시스템을 먼저 읽고, `architect`는 코드에 가까운 타입·시그니처 스케치를 만들며, 불확실한 질문은 prototype으로 실행해 답한다. 복잡한 프로그램에는 매우 상세한 [Multi-phase plan](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/multi-phase-plan.md)을 쓰지만, 한두 파일의 명백한 변경에는 계획을 건너뛴다.

| 축 | `sdd-helper` 기반 경량 SDD | pstack | 충돌 지점 |
| --- | --- | --- | --- |
| 진실의 출발점 | 사람이 작성한 requirements를 원본으로 두고 specs와 plans를 파생한다 | 코드, prototype, product-surface 검증 결과를 우선한다 | implementation discovery가 승인된 요구를 언제 바꿀 수 있는가 |
| 작업 순서 | Requirements → Specify → Plan을 검토한 뒤 구현한다 | 기존 시스템을 읽고 설계 후보와 prototype으로 빠르게 수렴한다 | 앞단 합의와 implementation discovery의 비중 |
| 불확실성 처리 | Specify에서 코드베이스를 조사하고 모호함을 사람에게 질문한다 | 실행 가능한 prototype으로 답하고 잘못된 설계는 폐기한다 | 문서만으로 결정하기 이른 문제를 언제 실험할지 |
| 테스트와 검증 | Plan에 unit·integration·manual testing과 acceptance checklist를 둔다 | 값싼 테스트는 조건부로 쓰고 user-facing surface에서 검증을 강제한다 | 계획한 테스트가 영구 CI 가드로 이어지는지 |
| 구현 중 변경 | requirements → specs → plans를 먼저 갱신하고 구현을 이어 간다 | 코드 마찰과 실행 증거를 설계 변경 신호로 삼는다 | discovery가 권위 있는 기준선을 어떻게 바꾸는가 |

둘은 같은 변경에서 나란히 유지할수록 안전해지는 보완재가 아니다. pstack의 change brief·prototype·decision trail과 SDD의 requirements·specs·plans가 동시에 같은 목표·acceptance·설계 이유를 설명하면 **두 개의 source of truth**가 생긴다. 코드에서 새 제약을 발견할 때마다 SDD 문서를 사후 동기화하면 SDD의 선행 추적 규칙이 무너지고, 반대로 모든 탐색을 먼저 문서에 확정하면 pstack의 경험적 수렴을 막는다. reviewer는 어느 표현이 최신인지 대조해야 하고, 팀은 코드보다 문서 동기화와 중복 승인에 더 많은 피로를 쓴다.

그래서 같은 변경에는 하나의 workflow만 적용한다. `pstack-governed`라면 SDD 문서 파이프라인을 만들지 않고 pstack 쪽 권위 사슬로 끝낸다. `SDD-governed`라면 Requirements → Specify → Plan을 먼저 갱신하고, 승인된 계획에서 구현하며, 코드를 먼저 만든 뒤 문서를 맞추는 사후 동기화를 허용하지 않는다. pstack workflow를 SDD 구현 단계의 부속 절차로 얹는 것도, pstack 변경 뒤에 SDD 문서를 증빙용으로 채우는 것도 하지 않는다.

여기서 **다른 방식의 좋은 기술을 빌리는 것**과 **두 방법론을 병행하는 것**을 구분해야 한다. TDD·CI·ADR·Feature Map·architecture fitness function·동료 cold-start review는 어느 한 workflow의 전용 단계가 아니라 독립적인 engineering controls다. SDD-governed 프로젝트가 TDD와 product-surface verification을 사용해도 pstack workflow를 병행하는 것이 아니며, pstack-governed 프로젝트가 ADR과 테스트를 남겨도 SDD를 실행하는 것이 아니다. 산출물은 각각 계약 실행, 반복 검증, 결정 이유, 사용자 행동, 구조 경계, 맥락 복원이라는 고유 역할만 맡고 다른 운영체제의 권위 문서를 복제하지 않는다.

`plan-with-specs`는 Testing Strategy와 Acceptance Criteria Checklist를 요구하지만, 테스트를 반드시 구현보다 먼저 쓰라고 하거나 그 테스트를 모든 미래 변경에서 CI가 반복하라고 강제하지 않는다. SDD는 **무엇을 검증할지와 어디서 왔는지**를 추적하고, TDD·CI는 그중 어떤 계약을 실행 가능한 가드로 만들고 반복할지 결정한다. 반대로 pstack의 product-surface PASS도 다음 변경의 자동 회귀 가드를 대신하지 않는다.

[바이브 코딩 너머 개발자 생존법](/2026/01/02/바이브-코딩-너머-개발자-생존법.html)에서 SDD를 "무엇을 만들지" 정밀화하는 단계로, [Loop Engineering](/2026/06/19/loop-engineering.html)을 "어떻게 반복해 수렴시킬지" 설계하는 단계로 나눴다. 지금의 결론은 그 둘을 한 변경의 연속 단계로 묶는 것이 아니다.

> 프로젝트 운영체제는 제품 의도와 변경 절차의 권위를 하나로 정한다. TDD는 설계를 움직이고, CI는 계약을 반복하며, ADR·Feature Map·architecture fitness·cold-start review는 각자의 독립된 질문에 답한다.

## SDD를 버리는 선택도 가능하다

가능하다. SDD의 목적은 문서 세 벌을 유지하는 것이 아니라 제품 의도와 기술 결정을 구현까지 잃지 않는 것이다. pstack의 조사·설계·prototype·검증 루프와 기존 코드·테스트·이슈가 그 신뢰를 더 싸게 제공한다는 가설을 세울 수 있다면 `Requirements → Specify → Plan` 파이프라인을 운영체제에서 제거할 수 있다. 다만 이것은 변경 하나의 편의가 아니라 프로젝트·독립 subsystem의 운영 선택이다.

`pstack-governed`에서는 다음 산출물의 역할을 겹치지 않게 둔다.

| 산출물 | 고유한 역할 |
| --- | --- |
| project contract | 목표, 핵심 사용자 결과, 불변식, non-goal, 외부 제약, rollback 원칙이라는 장수명 기준선 |
| change brief | project contract에서 파생한 변경 범위, 관찰 가능한 acceptance, blast radius, shipping evidence |
| 선택적 ADR | 장수명·고위험 결정의 대안, 이유, 가정, 재검토 조건 |
| 실행 가능한 계약 | 타입·스키마·정적 규칙·테스트와 CI가 반복해서 지킬 행동·불변식 |
| Feature Map | 사용자 여정, 진입점, harness, 관찰 가능한 성공을 담은 행동 카탈로그 |

이 운영체제에는 `requirements.md`, `specs.md`, `plans.md` 파이프라인이 없다. 각 변경은 project contract를 상속한 change brief에서 시작하고, `/how`와 `/why`로 현재 시스템과 기존 의도를 읽으며, 불확실하면 `/architect`나 격리 prototype으로 답한다. 배운 장수명 결정은 ADR에, 미래 변경마다 지킬 약속은 실행 가능한 계약에, 사용자 실행 경로는 Feature Map에 반영한다. 작은 ordered PR과 독립 product-surface verification으로 닫되, 같은 사실을 SDD 형식으로 다시 쓰지 않는다.

SDD를 제거했을 때 기대하는 이득도 분명하다.

| 기대 이득 | 줄이려는 비용 |
| --- | --- |
| 문서 동기화 제거 | requirements·specs·plans·code 네 표현이 서로 어긋나는 상태를 관리하지 않는다 |
| 더 빠른 empirical discovery | 사전 추측을 정교하게 쓰는 대신 prototype과 product surface에서 먼저 배운다 |
| 거짓 권위 감소 | 이미 낡았거나 AI가 그럴듯하게 채운 명세를 승인된 진실로 오해하지 않는다 |
| 낮은 context load | agent와 reviewer가 중복 문서를 모두 읽고 차이를 해석하는 비용을 줄인다 |
| 작은 변경의 throughput 향상 | 국소 수정마다 문서 파이프라인을 통과하는 ceremony를 없앤다 |

다른 선택지는 `SDD-governed`다. 여기서는 사람이 승인한 Requirements → Specify → Plan이 권위 있는 추적 사슬이다. ticket은 이 사슬에서 파생되고, 제품 의도가 바뀌면 requirements부터, 기술 해석이 바뀌면 specs부터, 작업 순서가 바뀌면 plans부터 갱신한 뒤 코드를 수정한다. 구현이 먼저 앞서가고 문서를 사후 동기화하는 순간 SDD-governed라는 운영 계약을 어긴다. 작은 변경의 ceremony가 비싸 보여도 ticket 하나만 pstack 방식으로 우회하지 않고, 그 비용을 다음 milestone의 운영체제 재평가 신호로 기록한다.

### 선택 단위는 ticket이 아니라 경계와 milestone이다

운영체제는 product 또는 project 전체에 고른다. subsystem이 public boundary, owner, release cadence, 계약 기준선, 성과 측정을 독립적으로 가질 수 있을 때만 그 subsystem을 별도 선택 단위로 인정한다. 단순 package나 한 팀의 편의상 디렉터리는 독립 경계가 아니다.

`milestone`은 release, program increment처럼 운영 결과를 평가하고 계약 기준선을 바꿀 수 있도록 미리 정한 timebox·release boundary다. 시작 전에 운영체제를 고르고 milestone 동안 유지한다. 그 안의 feature, bug, refactoring, prototype ticket은 모두 같은 운영체제를 상속한다. 위험한 ticket 하나 때문에 SDD를 얹거나, 작은 ticket 하나 때문에 SDD를 건너뛰지 않는다.

이 선택은 방법론 취향이 아니라 **검증 가능한 운영 가설**이다. pstack 또는 SDD 중 어느 쪽이 일반적으로 우월하다는 공개 비교 근거는 확인되지 않았다. 특히 pstack-governed를 택할 때는 "이 경계에서는 중복 문서 없이도 의도·추적·검증을 더 낮은 비용으로 보존한다"를 가설로 적고, milestone마다 다음을 같은 정의로 측정한다.

- 결함 유출률과 심각도
- idea-to-production 리드타임
- acceptance 변경·되돌림을 포함한 재작업률
- 코드·문서·승인에 든 리뷰 시간
- private transcript 없이 수행한 cold-start review 성공률
- 문서와 코드의 drift 건수, 문서 갱신·감사에 든 유지비

### 전환 신호는 양방향이고, 전환은 clean cutover다

| 방향 | 다음 milestone에서 전환을 검토할 관찰 신호 |
| --- | --- |
| pstack-governed → SDD-governed | owner 사이 acceptance 충돌과 재작업이 반복됨, 여러 PR의 요구 영향 추적 실패, 동료 cold-start가 반복해서 실패함, 외부 계약·규제·감사에서 의도와 승인 이력을 입증할 수 없음 |
| SDD-governed → pstack-governed | 문서 검토가 코드 검토보다 지속적으로 비싸짐, requirements·specs·plans와 코드 drift가 반복됨, 같은 사실을 중복 산출물에 씀, 작은 변경의 ceremony가 리드타임을 지배함, 실행으로 답할 문제를 사전 문서 논쟁으로 과도하게 소모함 |

신호 하나가 보였다고 진행 중인 milestone에서 운영체제를 섞지 않는다. 종료 시점에 지표와 사례를 검토해 전환을 결정하고, 다음 milestone에서 **clean cutover**한다. pstack-governed에서 SDD-governed로 갈 때는 장수명 project contract와 승인할 요구만 Requirements 기준선으로 옮기고 ADR·실행 가능한 계약·Feature Map은 독립 control의 역할로 유지한다. 반대 방향에서는 살아 있는 requirements·specs의 장수명 내용만 project contract·ADR·테스트로 압축한다. 두 방향 모두 과거 workflow 문서는 읽기 전용으로 동결하고, 새 방식의 산출물을 그 위에 덧씌우거나 이중 갱신하지 않는다.

전환 뒤의 모든 ticket은 새 기준선만 따른다. clean cutover는 과거를 지우는 일이 아니라 **권위 있는 source of truth를 하나로 다시 세우는 일**이다.


## 더 근본적인 의문: 코드가 제품의 모든 것을 대변할 수 있는가

내 근본적인 질문은 한 문장이다. **코드가 제품의 모든 것을 대변할 수 있는가?** 코드는 현재 실행되는 동작과 구현 경계를 가장 정밀하게 보여 주는 증거다. 그러나 제품은 현재 동작만으로 이루어지지 않는다. 왜 이 결과가 필요한지, 무엇을 의도적으로 만들지 않기로 했는지, 어떤 대안을 왜 버렸는지, 누가 경계와 위험을 책임지는지, 어떤 증거를 미래 변경마다 반복해야 하는지는 코드만 읽어 확정하기 어렵다. 내 답은 **아니다**다. 코드가 약해서가 아니라 제품에 실행 불가능한 계약과 조직적 맥락도 포함되기 때문이다.

pstack의 "the best spec is code"를 계속 밀어붙이면 계획보다 코드가 먼저 쌓인다. 개별 변경이 모두 동작하고 PR마다 증거가 있어도, 전체 프로젝트에는 중복된 개념, 흐려진 도메인 경계, 우회 의존성, 여러 개의 진실 공급원이 남을 수 있다. 내가 두려운 것은 한 번의 엉성한 생성이 아니다. **국소적으로 그럴듯한 결과가 연속해서 합쳐진 뒤에만 보이는 거대한 덩어리**다.

그렇다고 pstack을 곧바로 무계획 바이브 코딩으로 분류하는 것은 정확하지 않다. [Design guide](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/04-design.md)는 production code 전에 `architect`로 여러 설계 후보, 타입, 시그니처, module map을 비교한다. 불확실한 질문은 [Prototype playbook](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/prototype.md)이 production source와 분리된 scratch directory에서 답하며, 산출물을 명시적으로 버리게 한다. `model-the-domain`, `subtract-before-add`, `minimize-reader-load`, `redesign-from-first-principles` 같은 원칙은 복잡성을 줄이는 방향으로 작동한다. [Opening a PR](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/opening-a-pr.md)도 하나의 큰 PR보다 작고 순서가 있는 PR을 요구한다.

따라서 pstack의 기본형은 즉흥적인 코드 생성보다 **증거로 통제하는 code-first development**에 가깝다. 하지만 이 방어선에는 범위 한계가 있다.

- `architect`는 현재 변경의 설계 공간을 넓히지만, 제품 전체의 장기 목표와 도메인 경계를 system of record로 유지하지는 않는다.
- prototype은 질문 하나를 싸게 해결하지만, 그 결론이 프로젝트가 선택한 운영체제의 권위 있는 계약 기준선으로 환류되는지는 외부 운영 규칙에 달려 있다.
- 작은 PR과 product-surface PASS는 각 변경의 검토 가능성과 현재 동작을 높이지만, 수십 개 PR이 향하는 전체 구조까지 증명하지는 않는다.
- `/correct`는 반복된 실패를 타입·lint·CI·테스트·문서로 승격하는 강한 장치지만, 문제가 반복된 뒤에 작동하는 사후 학습이다.
- Multi-phase plan은 복잡한 프로그램을 통제하지만, pstack은 설계가 수렴한 뒤 plan을 쓰는 쪽이고 그 plan을 작업 종료 뒤 영구 보존하라고 강제하지 않는다.

즉 pstack은 **변경 하나의 slop을 줄이는 데 강하지만 변경 여러 개의 구조 엔트로피까지 자동으로 줄이지는 않는다.** product-surface 검증 결과는 "이 기능이 움직이는가"에 답한다. "이 기능을 추가한 뒤에도 시스템의 개념과 경계가 일관적인가"에는 별도의 답이 필요하다.

내 대안은 discovery와 delivery를 분리하되, 프로젝트가 선택한 운영체제 안에서만 결정을 승격하는 것이다. 불확실성이 크면 격리 prototype으로 먼저 배우고 production branch에는 승격하지 않는다. pstack-governed에서는 배운 결정을 project contract·change brief·필요한 ADR·영구 가드 중 고유 역할을 가진 곳에 반영한다. SDD-governed에서는 prototype을 계획된 실험으로 수행하고, 제품 행동은 requirements에, 기술 구조는 specs와 ADR에, 구현 순서는 plans에 **production 코드보다 먼저** 반영한다. 어느 쪽에서도 같은 결정을 두 workflow의 문서에 중복 기록하지 않는다. **코드는 계획을 대신하는 완성품이 아니라 다음 결정을 수정할 수 있는 실험 증거**가 된다.

Feature Map도 이 문제의 단독 대안은 아니다. Feature Map은 사용자가 무엇을 할 수 있고 그 행동을 어떻게 재현할지 보여 주는 행동 카탈로그다. 도메인 경계, 허용 의존성, 데이터 소유권, 결정 이유를 기록하는 architecture map과 ADR의 역할까지 대신하지는 못한다.

## pstack은 협업 도구인가, 한 명의 operator를 위한 도구인가

pstack에는 협업에 유용한 장치가 분명히 있다. `/how`는 새 엔지니어가 subsystem에 합류할 때 필요한 mental model을 만들고, `/why`는 git·issue tracker·문서·team chat·observability에서 결정의 근거를 찾는다. 공유 코드에는 README를 먼저 쓰도록 권하며, PR은 reviewer가 1분 안에 Why·Scope·Blast Radius·Verification을 파악하도록 작성한다. `create-verification-skill`은 사람과 agent가 같은 방식으로 제품을 구동하도록 verification skill을 repository에 commit하게 한다. `pause-safely`와 `session-pickup`은 cold-start agent가 중단 지점부터 이어받게 하고, `show-me-your-work`의 decision trail은 필요할 때 reviewer에게 실행 근거를 넘길 수 있다.

이것은 pstack이 오직 혼자 쓰는 장난감이라는 반증이다. 그러나 **동료가 주 개발자의 맥락을 따라잡느라 시간을 쓰지 않아도 된다는 충분한 증거**는 아니다.

- pstack README는 스스로 "my answer"라고 부르고, [Make it yours](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/09-make-it-yours.md)는 poteto-mode를 "one person's style"이라고 명시한다.
- `/recall`은 개인 chat history와 shared record를 함께 사용한다. 개인 transcript에만 남은 결정은 다른 동료의 공유 지식이 아니다.
- `show-me-your-work`의 decision log는 기본적으로 local artifact이고, reviewer가 필요할 만큼 큰 작업에서만 commit한다.
- [Multi-phase plan](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/multi-phase-plan.md)은 기본 저장 위치를 agent store의 `docs/`로 두어 agent 실행을 이어 준다. 그러나 plan을 repository에 commit된 영구 팀 기록이나 ADR lifecycle로 승격하라고 요구하지는 않는다.
- [Orchestrate playbook](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/orchestrate.md)의 협업 모델은 한 coordinator chat, agent PR owner, 독립 agent verifier를 중심으로 한다. 인간 팀의 module ownership, review quorum, ADR 승인, 온보딩 완료 기준을 정의하는 운영 모델은 아니다.

검토한 공식 guide와 playbook에는 인간 팀을 위한 별도 collaboration chapter나 CODEOWNERS·ADR/RFC lifecycle·bus-factor 기준이 기본 규율로 제시돼 있지 않았다. 반대로 review artifact와 agent handoff 장치는 풍부하다. 따라서 정확한 평가는 **pstack은 실행 인수인계에는 강하지만 공유 권위와 장기 조직 기억까지 완성해 주지는 않는다**다.

나는 여기에 **동료 cold-start test**를 둔다. 구현 대화에 참여하지 않은 동료가 private transcript 없이 repository, issue, PR만 읽고 다음 질문에 답할 수 있어야 한다.

1. 어떤 사용자 요구와 실패 비용 때문에 이 변경이 필요한가?
2. 어느 subsystem과 owner가 이 결정을 책임지는가?
3. 어떤 대안을 버렸고, 어떤 조건에서 결정을 다시 검토하는가?
4. 무엇이 자동 가드이고 무엇이 이번 delivery의 일회성 증거인가?
5. 변경이 실패하면 어디까지 되돌리고 어떤 데이터나 외부 계약을 확인해야 하는가?

동료가 답할 수 없다면 코드는 끝났어도 팀의 작업은 끝나지 않았다. pstack-governed라면 누락된 맥락을 project contract·change brief·ADR·subsystem README·Feature Map·verification skill 중 고유 역할을 가진 곳에 보강한다. SDD-governed라면 requirements·specs·plans의 추적 사슬과 필요한 독립 control에 반영한다. 다른 운영체제의 문서를 새로 만들어 빈칸을 메우지 않는다. 개인 chat과 agent transcript는 탐색 자료일 수 있지만 source of truth가 될 수 없다. 이것이 주 개발자의 기억을 팀의 병목으로 만들지 않는 최소 조건이다.

## 하드 TDD에는 분명한 비용이 따른다

하드 TDD를 옹호할 때 가장 쉽게 외면하는 비용은 **테스트에 자동 폐기 장치가 없다는 사실**이다. 제품 코드는 기능이 사라지면 삭제 압력을 받지만, 테스트는 "안전망"이라는 이름 때문에 존재 자체가 정당화되기 쉽다.

실무에서 비용은 몇 가지 형태로 나타난다.

- 같은 계약을 단위·통합·E2E 층에서 각각 검증한다. 어느 하나가 고유한 실패를 잡는지 설명하지 못한 채 세 벌이 모두 남는다.
- 내부 호출 순서와 private helper를 고정한 테스트가 리팩터링 때마다 깨진다. 제품 동작은 그대로인데 테스트 수정량이 설계 변경량을 압도한다.
- 거대한 fixture와 mock 그래프가 별도의 프로그램처럼 자란다. 테스트를 이해하려면 제품 코드와 테스트용 세계를 함께 해석해야 한다.
- 느리고 가끔 실패하는 테스트가 PR마다 모든 개발자의 피드백 루프를 늦춘다. 원인을 신뢰하지 못하는 빨간 빌드는 결국 재실행 버튼을 누르는 습관을 만든다.
- "이 테스트가 없으면 어떤 미래의 회귀를 놓치는가?"라는 질문에 답하기 어렵다. 지금 스위트가 초록이라는 사실은 그 테스트가 필요하다는 증거도, 불필요하다는 증거도 아니다.

이 문제는 TDD 자체를 부정해야만 인정할 수 있는 것이 아니다. [TDD, 7년 후](/2026/06/19/tdd-seven-years-after.html)도 TDD를 도그마가 아니라 비용과 효과를 따져 쓰는 도구로 정리하고, 구현이 아니라 행동을 검증하며 빠르고 결정적인 테스트를 원한다. [GOOS](/2026/06/19/growing-oo-software-guided-by-tests.html) 역시 테스트를 수년간 함께 사는 회귀 자산으로 보지만, mock이 많고 setup이 거대한 고통을 설계 신호로 읽으라고 한다. "모든 테스트를 영원히 보존하라"가 고전의 결론은 아니다.

[Continuous Integration](/2026/06/19/continuous-integration.html)이 강조하는 것도 테스트 개수가 아니라 **잦은 통합, 자동 빌드, 빠른 피드백**이다. 이 관점에서 CI 경량화의 목표는 단순히 테스트를 덜 돌리는 것이 아니다. 신뢰할 수 있는 실패 신호가 개발자의 작업 맥락이 살아 있을 때 돌아오고, 메인라인을 항상 건강하게 유지할 수 있어야 한다. 회귀를 놓치는 작은 스위트는 가벼운 CI가 아니고, 결과가 너무 늦어 습관적으로 재실행하게 되는 거대한 스위트도 CI의 목적을 잃는다.

## 운영체제를 골라도 두 시간축의 증거는 모두 필요하다

pstack-governed를 선택해도 CI의 영구 래칫을 버릴 수 없는 이유는 테스트 취향이 아니다. **증거가 유효한 시간 범위**가 다르기 때문이다.

| 장치 | 답하는 질문 | 실행 시점과 수명 | 가장 강한 점 | 단독으로 쓸 때의 빈틈 |
| --- | --- | --- | --- | --- |
| 변경 시점의 shipping evidence | "이 변경이 지금 product surface에서 동작하는가?" | 해당 PR·release 시점의 한 실행 | UI·CLI·API와 부수효과를 함께 본다 | 다음 변경에서도 자동으로 다시 실행된다는 보장이 없다 |
| 영구 회귀 가드 | "미래 변경이 이 계약을 깨뜨렸는가?" | 모든 관련 커밋·PR에서 반복 | 한 번 확보한 계약을 자동으로 누적 보호한다 | 잘못된 층·구현 결합·mock 안에서는 product behavior와 멀어질 수 있다 |

pstack의 강점은 첫 번째 줄에 있다. Bug fix는 같은 표면에서 실패와 성공을 요구하고, Refactoring은 빌드·실행한 산출물의 동등성을 요구하며, Shipping은 작성자와 다른 검증자가 사용자처럼 실행하도록 한다. 이것은 보통의 "테스트 통과했습니다"보다 훨씬 강한 **현재 시점의 증명**이다.

하지만 그 증거는 시간이 지나면 만료된다. 오늘 독립 검증자가 결제 재시도 흐름을 직접 통과시켰더라도, 다음 주의 무관해 보이는 큐 설정 변경이 그 동작을 깨뜨릴 수 있다. 다음 PR에서 같은 경로를 누군가 다시 선택해 실행하지 않는다면, 오늘의 영상과 로그는 역사적 기록일 뿐 방어선은 아니다.

반대로 CI의 회귀 테스트는 product surface를 완벽히 대변하지 못해도 **반복 실행 자체가 계약**이다. 누가 작업하든, 무엇을 고치든, 해당 가드는 다시 돈다. 내가 하드 TDD의 래칫을 쉽게 버리지 못하는 이유가 여기에 있다. 한 번의 강한 증거와 약하지만 계속 반복되는 증거는 서로 대체 관계가 아니다.

pstack도 green CI가 충분하지 않다고 정확히 말한다. 나는 거기에 한 문장을 더 붙이고 싶다.

> Green CI만으로는 shipping을 믿기 어렵다. 그러나 한 번의 product-surface PASS만으로는 프로젝트의 다음 달을 믿기 어렵다.

## Feature Map은 행동 카탈로그이지 CI 대체물이 아니다

이 구분은 pstack의 verification skill을 보면 더 선명해진다. [`create-verification-skill`](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md)은 프로젝트 전용 `verify-<app>` 스킬을 만들고, 사용자가 만지는 표면을 직접 구동하는 방법을 적는다. 함께 만드는 **Feature Map**은 각 기능에 대해 다음을 기록한다.

- 사용자의 관점에서 이 기능은 무엇인가
- 어디로 들어가야 하는가
- 어떤 harness로 어떻게 구동하는가
- 어떤 관찰 가능한 최종 상태가 성공을 증명하는가
- 어떤 전제와 함정이 있는가

이것은 매우 유용한 **행동 카탈로그**다. 기능 목록을 라우트나 클래스가 아니라 사용자 여정과 관찰 가능한 결과로 적기 때문이다. 새 검증 스킬을 만들 때는 그중 한 기능을 직접 구동해 스킬 자체를 증명하고, [`maintain-verification-skill`](https://github.com/cursor/plugins/blob/main/pstack/skills/maintain-verification-skill/SKILL.md)은 정기적인 유지 pass에서 모든 기능을 소스와 live surface 양쪽에서 확인한다.

그러나 카탈로그는 실행기가 아니다. 이 두 스킬이 정의하는 것은 **요청 시 수행하는 생성·유지·live pass**이지, 모든 PR에서 각 제품 계약을 자동으로 다시 검증하는 CI coverage 정책이 아니다. Feature Map에 기능이 적혀 있다는 사실만으로 그 기능이 다음 PR에서 보호되지는 않는다.

따라서 나는 Feature Map을 버리지도, CI 테스트 목록과 동일시하지도 않는다. Feature Map은 **무엇을 증명해야 하는지**를 관리한다. CI 가드는 그중 **미래 변경마다 자동으로 지켜야 할 계약**을 반복 실행한다. 독립 product-surface verification은 **이번 산출물이 product surface에서도 그 계약을 만족하는지** 마지막으로 확인한다.

## 두 운영체제: 경계에서는 하나, controls는 공통

프로젝트·독립 subsystem은 milestone을 시작할 때 `pstack-governed`와 `SDD-governed` 중 하나를 고른다. ticket은 그 결정을 상속한다. 아래 장치들은 ticket마다 운영체제를 다시 선택하는 메뉴가 아니라, **선택한 하나의 권위 체계와 독립 controls의 역할을 분리하는 규칙**이다.

| 운영체제 | 권위 있는 사슬 | 같은 변경에서 두지 않는 것 |
| --- | --- | --- |
| `pstack-governed` | project contract → change brief → code와 shipping evidence. ADR·실행 가능한 계약·Feature Map은 고유 역할로 연결 | requirements·specs·plans 문서 파이프라인 |
| `SDD-governed` | Requirements → Specify → Plan → 구현. `FR-X → TS-X → Step N` 추적을 유지 | pstack change workflow와 별도 brief·decision trail을 병렬 source of truth로 운영 |

TDD·CI·ADR·Feature Map·architecture fitness·cold-start review는 이 표의 세 번째 운영체제가 아니다. 어느 쪽에서도 쓸 수 있지만, 제품 의도와 작업 순서를 다시 서술하는 혼합층이 되어서는 안 된다.

### 1. 계약 인벤토리를 만든다

계약 인벤토리는 별도 문서를 하나 더 만드는 것이 아니라 **권위 있는 기준선과 controls를 조회하는 논리적 관점**이다. pstack-governed에서는 project contract를 출발점으로 change brief, 실행 가능한 계약, Feature Map을 연결한다. SDD-governed에서는 `requirements.md`의 FR·acceptance criteria·NFR·constraints·out of scope를 출발점으로 specs와 plans의 추적 관계를 연결한다. 한 인벤토리에서 두 운영체제의 원본을 동시에 유지하지 않는다.

어느 운영체제든 각 계약에는 최소한 다음 정보가 필요하다.

1. **계약**: 사용자가 관찰하는 동작이나 시스템 불변식
2. **의도와 출처**: 왜 지켜야 하는지, 어떤 요구·사고·결정에서 왔는지
3. **실패 비용**: 틀렸을 때 사용자·데이터·금전·운영에 미치는 영향
4. **관찰 신호**: 성공과 실패를 무엇으로 구분할지
5. **영구 가드**: 어느 층의 어떤 자동 검사가 반복해서 지킬지, 또는 왜 두지 않는지
6. **shipping evidence**: product surface에서 누가 어떤 경로로 확인할지
7. **소유자와 변경 조건**: 누가 계약 변경을 승인하고, 언제 폐기할 수 있는지

Feature Map의 사용자 여정은 이 인벤토리의 중요한 입력이지만 전부는 아니다. 데이터 불변식, idempotency, 권한 경계처럼 화면에 직접 드러나지 않는 계약도 있기 때문이다.

여기서 의도와 출처를 빼면 인벤토리는 곧 낡는다. [Intent Debt](/2026/06/21/intent-debt.html)가 지적했듯 에이전트는 시스템이 무엇을 하는지는 추론해도 무엇을 위한 것인지는 대신 정할 수 없다. 내가 [AGENTS.md를 의도 원장으로 쓰는 법](/2026/08/31/intent-debt-agents-md.html)에서 강조했던 것처럼, 에이전트가 정리한 계약도 사람의 의도와 일치하는지 확인해야 한다. 계약 인벤토리는 테스트 도구가 아니라 **사람이 승인한 의도를 검증 가능한 형태로 외부화한 관점**이다.

### 2. 권위 있는 산출물 사슬을 하나만 둔다

pstack-governed의 산출물은 서로 같은 내용을 복제하지 않는다.

| 산출물 | 지키는 것 | 변경 규칙 |
| --- | --- | --- |
| project contract | 프로젝트 목표, 핵심 사용자 결과, 불변식, non-goal, 외부 제약, rollback 원칙 | milestone 기준선이 바뀔 때 owner가 승인한다 |
| change brief | 한 변경의 범위, acceptance, blast radius, 검증·rollback | project contract에서 파생하고 PR과 함께 닫는다 |
| 선택적 ADR | 장수명·고위험 결정의 대안, 이유, 가정, 재검토 조건 | 과거를 덮어쓰지 않고 새 ADR이 기존 결정을 대체한다 |
| 실행 가능한 계약 | 타입·스키마·정적 규칙·테스트로 표현한 행동과 불변식 | 관련 변경마다 CI가 반복하고 폐기에는 대체 가드와 승인이 필요하다 |
| Feature Map·shipping evidence | product surface의 실행법과 현재 PASS | 사용자 여정이 바뀔 때 갱신하고 중요한 release에서 독립 실행한다 |

SDD-governed의 권위 사슬은 다음 세 문서다.

| 산출물 | 지키는 것 | 변경 규칙 |
| --- | --- | --- |
| `requirements.md` | 사람이 승인한 목표, FR, acceptance criteria, NFR, 제약, 제외 범위 | 제품 의도나 관찰 가능한 행동이 바뀌면 가장 먼저 고친다 |
| `specs.md` | FR에서 파생한 TS, 아키텍처, 데이터·API, 오류·보안·성능 해석 | 요구는 그대로지만 기술 해석이 바뀌면 구현 전에 갱신하고 clarification log를 남긴다 |
| `plans.md` | TS에서 파생한 구현 단계, 파일, 검증, 테스트, rollback, 위험 | 구현 전에 남은 단계를 조정하고 완료 단계가 무효화되면 명시적으로 경고한다 |

SDD-governed에서도 ADR은 장수명 결정의 이유, Feature Map은 사용자 실행법, TDD·CI는 실행 가능한 계약이라는 독립 역할만 맡는다. 이들이 requirements·specs·plans를 다시 서술하는 secondary source of truth가 되면 안 된다. 반대로 pstack-governed에서는 requirements·specs·plans를 만들지 않는다.

새 사실이 드러나도 권위는 갈라지지 않는다. pstack-governed는 acceptance 변경을 change brief와 필요시 project contract의 승인으로 처리하고, 장수명 결정만 ADR로 승격한다. SDD-governed는 사용자 결과가 달라지면 `requirements.md`부터, 구현 전략이 달라지면 `specs.md`와 남은 `plans.md`부터 고친 뒤 production 코드를 이어 간다. 코드를 먼저 끝내고 문서를 맞추는 사후 동기화는 허용하지 않는다.

`plans.md`의 Testing Strategy도 빈 양식으로 두지 않는다. 각 acceptance criterion을 `영구 CI 가드`, `일회성 product-surface verification`, `가드 없음과 승인된 이유` 중 하나에 연결한다. 이는 SDD와 pstack을 결합하는 단계가 아니라, SDD의 권위 있는 계약을 방법론 독립적인 TDD·CI·product-surface control에 매핑하는 일이다.

### 3. ADR에 decision rationale을 유지한다

테스트는 계약이 깨졌다는 사실은 알려 주지만, **그 계약을 왜 지켜야 하는지**와 **언제 바꿔도 되는지**는 설명하지 못한다. 이 정보가 없으면 오래된 테스트를 만났을 때 두 극단만 남는다. 이유를 모르니 무조건 보존하거나, 최근 실패하지 않았다는 이유로 지운다. 둘 다 근거 없는 선택이다.

그래서 장수명·고위험 계약의 `의도와 출처`는 가벼운 ADR에 연결한다. ADR에는 선택한 결정, 배제한 대안, 당시의 제약과 가정, 실패 비용, 다시 검토할 조건을 남긴다. 테스트 파일마다 ADR을 만들 필요는 없다. 여러 가드가 공유하는 제품·아키텍처 결정, 되돌리기 비싼 선택, 나중에 다시 논쟁할 가능성이 큰 결정만 기록한다. 세부 작성법은 [AGENTS.md를 의도 원장으로 쓰는 법](/2026/08/31/intent-debt-agents-md.html)의 기록 레이어를 따른다.

운영 규칙도 단순하게 둔다. 승인된 ADR은 과거 결정의 기록이므로 덮어쓰지 않는다. acceptance contract를 바꾸는 PR은 새 ADR을 추가하고 기존 결정을 `Superseded` 처리한다. 계약이 그대로라면 테스트 구현만 바꾼다. 테스트를 삭제할 때는 계약이 폐기됐는지, ADR의 가정이 더는 유효하지 않은지, 다른 가드가 같은 결정을 지키는지를 함께 확인한다. 이렇게 해야 ADR이 죽은 문서가 아니라 **래칫의 톱니를 남기거나 빼는 판단 근거**가 된다.

### 4. prototype을 discovery loop에 가둔다

prototype은 pstack만의 전유물이 아니라 불확실성을 실행으로 줄이는 discovery technique이다. 시각적 방향, 외부 API에서 관찰한 동작, 성능 가설처럼 문서만으로 결정하기 비싼 문제는 별도 scratch directory나 격리 branch에서 확인하고 production code로 merge하지 않는다.

prototype이 끝나면 산출물보다 **배운 결정**을 선택한 운영체제의 기준선으로 승격한다. pstack-governed에서는 change brief의 acceptance, 필요한 project contract·ADR·영구 가드에 반영한다. SDD-governed에서는 실험을 `plans.md`에 명시하고, 사용자 결과가 달라지면 requirements를, 기술 경계가 달라지면 specs와 ADR을, 구현 순서가 달라지면 plans를 production 구현 전에 갱신한다. 어느 쪽이든 prototype은 버리고 production 구현을 새로 시작한다.

좋은 prototype 기법을 빌렸다는 이유로 SDD-governed 프로젝트가 pstack workflow를 실행한 것은 아니다. 반대로 pstack-governed 프로젝트도 ticket의 위험이 커졌다는 이유로 SDD 문서를 얹지 않는다. 운영 비용의 부적합은 기록해 milestone 종료에 평가하고, 필요하면 다음 milestone에서 clean cutover한다.

### 5. 중요한 경계 변경에는 구조 일관성과 동료 cold-start를 요구한다

각 subsystem의 책임, public boundary, 허용한 상·하위 의존성, 데이터 owner, 검증 명령, 담당 owner는 한 권위 있는 위치에서 복원할 수 있어야 한다. pstack-governed에서는 architecture map이나 README가 이 역할을 맡는다. SDD-governed에서는 `specs.md`가 기술 경계의 원본이고 README는 그 위치를 가리키는 얇은 index만 둔다. 같은 경계를 두 문서에 복제하지 않는다. CODEOWNERS 또는 같은 역할의 owner map을 두고, 경계를 넘는 변경은 양쪽 owner가 검토한다.

사람의 리뷰 기억에만 기대지 않는다. 금지 import, dependency cycle, 승인되지 않은 저장 우회 경로, schema·API compatibility처럼 기계가 판정할 수 있는 경계는 architecture fitness function으로 만들어 Tier 0이나 Tier 1 CI에 넣는다. ADR은 왜 그 경계가 필요한지 보존하고, CI는 변경마다 그 경계가 살아 있는지 확인한다.

중요한 계약·경계 변경의 마지막 merge gate는 구현 대화에 참여하지 않은 동료의 cold-start review다. pstack-governed에서는 project contract·change brief·ADR·architecture map·verification skill과 PR 증거를 사용한다. SDD-governed에서는 repository에 commit된 requirements·specs·plans와 같은 독립 controls를 사용한다. reviewer가 private transcript 없이 목적, 경계, 위험, 검증, rollback을 설명할 수 없다면 context debt가 남은 변경으로 본다. 다른 운영체제의 문서를 추가하는 대신 현재 기준선의 누락을 고치고, `decisions.tsv` 같은 실행 감사 자료에서 장수명 결정 이유만 ADR로 압축한다.

### 6. 가장 낮고 안정적인 층에 가드를 둔다

계약마다 무조건 테스트를 추가하지 않는다. `/correct`의 우선순위처럼 먼저 잘못된 상태를 구조적으로 불가능하게 만들 수 있는지 본다. 실행 시점 행동이 남을 때만, 그 행동을 관찰할 수 있는 **가장 낮고 안정적인 층**을 고른다.

1. **아키텍처**: 잘못된 쓰기 경로를 숨기고 하나의 진실 공급원만 남길 수 있다면 코드 구조로 막는다.
2. **타입·스키마**: 불가능한 상태와 잘못된 조합을 표현할 수 없게 만든다.
3. **lint·정적 규칙**: 금지 import, 등록 누락, 위험한 호출 패턴처럼 실행 전 판정 가능한 것은 정적 검사로 막는다.
4. **단위·property 테스트**: 가격 계산, 파서, 상태 전이처럼 순수하고 안정된 계약은 빠른 층에서 넓게 검증한다.
5. **통합·contract 테스트**: 직렬화, DB transaction, 외부 프로토콜처럼 경계 자체가 계약인 경우 mock이 아닌 integration boundary를 포함한다.
6. **좁은 E2E**: 여러 층을 지나야만 의미가 생기는 핵심 사용자 여정만 product surface에서 자동화한다.

"가장 낮다"는 가장 작은 함수라는 뜻이 아니다. **계약을 mock으로 지워 버리지 않고 관찰할 수 있는 가장 싼 층**이라는 뜻이다. 결제 제공자가 받는 payload가 계약이면 그 경계는 테스트해야 한다. 반면 내부 helper가 몇 번 호출됐는지는 사용자가 볼 수 없으므로 영구 계약으로 만들지 않는다.

이 원칙은 E2E를 늘리는 명분이 아니다. 모든 Feature Map 항목을 브라우저 E2E로 옮기면 느리고 취약한 인프라를 CI 안에 만든다. 순수 로직과 정적 제약은 아래층으로 내리고, E2E는 층 사이 연결 자체가 위험인 소수의 여정에만 남긴다.

### 7. 버그는 red-before-green을 기본값으로 한다

버그 수정에는 하드 TDD의 래칫을 가장 강하게 남긴다. 이것은 pstack-governed와 SDD-governed 모두에 같은 기준으로 적용하는 독립 control이다.

1. 수정 전에 **실패하는 증거**를 만든다. 값싸고 결정적인 테스트 경로가 있으면 영구 회귀 테스트를 먼저 작성한다.
2. 그런 경로가 없으면 같은 사용자 표면의 실행, 작은 재현 스크립트, log assertion, snapshot diff 등 가장 가까운 executable repro를 먼저 확보한다.
3. 수정 후에는 정확히 같은 증거가 통과해야 한다. 다른 표면의 초록은 대체 증거로 인정하지 않는다.
4. 버그의 실패 비용이 크거나 같은 종류가 반복될 가능성이 높다면, 일회성 repro로 끝내지 않는다. 안정된 seam을 만들거나 더 낮은 층의 가드로 옮겨 **영구 래칫**을 남긴다.
5. 영구 가드를 만들 수 없으면 PR에 이유, 남는 위험, product-surface verification 경로, 예외 승인자를 기록한다. "테스트가 어려웠다" 한 문장으로 생략하지 않는다.

즉 red-before-green은 기본값이지만, red의 형태가 항상 unit test일 필요는 없다. product-surface executable repro라는 실용성을 받아들이되, 고위험 계약까지 일회성 증거로 휘발되지 않게 하는 것이 내 보강점이다.

### 8. 기능은 운영체제의 권위 있는 acceptance에서 시작한다

Feature 플레이북에 test-first가 없다는 사실은 내게 문제가 아니다. 기능 전체를 테스트부터 쓰지 않아도 된다. pstack-governed에서는 project contract에서 파생하고 사람이 승인한 change brief의 acceptance를 사용한다. SDD-governed에서는 `requirements.md`의 acceptance criteria를 `specs.md`의 기술 명세와 `plans.md`의 구현·검증 단계로 연결한다. ticket이 둘 중 하나를 고르거나 같은 acceptance를 두 형식에 복제하지 않는다.

어느 운영체제든 구현 전에 최소한 다음 질문에는 답해야 한다.

- 누가 어떤 조건에서 기능을 사용한다
- 사용자에게 보여야 할 결과와 절대 일어나면 안 되는 결과는 무엇이다
- 저장·전송·과금 같은 부수효과는 무엇이다
- 재시도·실패·권한 부족에서 지켜야 할 불변식은 무엇이다
- 각 항목을 어떤 자동 가드와 product-surface verification으로 확인한다

이 계약이 명확한 도메인 로직과 API 경계에서는 TDD를 **크랭크**로 쓴다. 테스트로 사용법을 먼저 그리는 것이 설계를 더 빠르게 전진시키기 때문이다. 반면 시각적 탐색, 짧게 버릴 prototype, 사용자 반응을 보고 형태를 정해야 하는 부분에는 test-first를 강요하지 않는다. 이 판단은 운영체제를 바꾸지 않는다.

기능이 끝날 때 모든 크랭크 테스트를 자동으로 영구 보존하지도 않는다. acceptance contract를 유일하게 지키는 행동 테스트는 래칫으로 남긴다. 더 강한 타입·구조·하위 계약 테스트가 같은 약속을 이미 지키거나, 테스트가 탐색 중의 내부 모양만 고정한다면 고치거나 삭제한다. 중요한 변경은 작성자와 다른 사람이 Feature Map의 사용자 실행 경로로 acceptance contract를 확인한다. TDD·CI·Feature Map은 여기서도 운영체제를 섞는 층이 아니라 각기 다른 증거를 만드는 controls다.

### 9. 리팩터링 pin은 영구 테스트와 구분한다

리팩터링 전에 characterization test나 snapshot으로 현재 동작을 고정하는 기법은 어느 운영체제에서도 쓸 수 있는 독립 control이다. 다만 **이동용 난간과 영구 울타리**를 구분한다.

- 이미 계약 인벤토리의 가드가 충분하다면, 리팩터링 중에만 필요했던 세밀한 characterization test는 작업 후 삭제할 수 있다.
- 기존 동작이 중요하지만 어디에도 보호되지 않았다는 사실을 발견했다면, 구현 snapshot을 그대로 남기지 않고 관찰 가능한 계약으로 다시 써서 영구 가드로 승격한다.
- old-vs-new equivalence harness처럼 구조 이동을 위해 만든 도구는 증거를 남긴 뒤 제거한다. 제품이 두 구현을 영원히 함께 운용하지 않는다면 테스트도 두 구현의 공존을 영구 전제로 삼지 않는다.

이 구분이 없으면 모든 리팩터링이 테스트 스위트를 살찌운다. 반대로 pin 자체를 생략하면 구조를 바꾸면서 동작도 바뀌었는지 알 수 없다. 임시 증거를 허용하되, 영구 계약만 CI에 남기는 것이 핵심이다.

## 변경 안전망은 네 층으로 운영한다

운영체제는 다섯 번째 실행 층이 아니다. pstack-governed는 project contract·change brief·기존 행동 계약·과거 버그에서, SDD-governed는 Requirements → Specify → Plan의 추적 사슬에서 각 층이 지킬 입력을 가져온다. 입력의 권위는 하나지만 실행 controls는 같다. 테스트를 선별해도 모든 검증을 PR의 한 파이프라인에 몰아넣으면 CI는 다시 무거워진다. 그래서 Tier 0~2는 반복 가능한 CI 가드로 운영하고, Tier 3은 중요한 변경을 위한 CI 밖의 독립 shipping evidence로 분리한다. 아래 시간은 팀이 측정값에 맞춰 조정할 **초기 운영 예산**이지 보편 법칙은 아니다.

| 층 | 실행 시점 | 포함하는 것 | 기본 예산과 역할 |
| --- | --- | --- | --- |
| Tier 0 구조 게이트 | 모든 push·PR | 타입, 아키텍처 규칙, lint, 가장 작은 deterministic test | 2분 이내. 명백히 불가능한 변경을 가장 싸게 차단한다 |
| Tier 1 계약 게이트 | 모든 PR | 영향받은 unit·property·contract test, 값싼 integration, 버그 회귀 가드 | Tier 0 포함 P95 10분 이내. 영구 래칫의 중심이다 |
| Tier 2 고비용 신뢰 | nightly, release, 위험 label이 붙은 PR | 전체 integration, migration rehearsal, 동시성·복구 검증, 선택적 mutation·fault injection | 모든 PR을 막지 않되 고위험 변경에는 병합 전 요구한다 |
| Tier 3 독립 shipping evidence | 중요한 변경의 release 전, CI 밖에서 수행 | 코드 작성자가 아닌 검증자가 UI·CLI·API를 Feature Map으로 구동하고 행동·결과·부수효과를 보존 | 시간 예산보다 production-like verification을 우선한다. Tier 0~2를 대체하지 않는 최종 층이다 |

Tier 0과 Tier 1을 합친 경로가 이 모델의 **commit build**다. 로컬과 CI에서 같은 단일 명령으로 재현되고, 사람의 개입 없이 모든 push·PR에서 자동으로 실행되어야 한다. 빨강이면 머지를 막고, 이미 메인라인이 깨졌다면 새 기능보다 복구를 먼저 한다. 그래야 시간 예산이 단순한 성능 목표가 아니라 "메인라인은 항상 통합 가능하고 배포 가능한 상태"라는 운영 계약이 된다.

입력 게이트는 운영체제에 따라 하나만 적용한다. SDD-governed PR은 commit build와 별도로 requirements·specs·plans diff의 사람 리뷰와 `FR-X → TS-X → Step N` 추적 감사를 통과한다. pstack-governed PR은 change brief가 project contract에서 올바르게 파생됐는지, 필요한 ADR·가드·Feature Map이 각 역할에 맞게 갱신됐는지 검토하되 SDD 문서를 만들지 않는다. 두 게이트는 코드가 맞다는 행동 증명이 아니라 **구현할 의도와 기술 해석이 끊기지 않았는지** 확인하며, 행동의 정확성은 여전히 Tier 0~3이 증명한다.

agent의 병렬성은 이 규율을 느슨하게 하는 이유가 아니라 더 엄격하게 적용할 이유다. 여러 worktree와 PR에서 변경을 빠르게 생산하면 **변경량 × 분기 시간**도 함께 커진다. 검증 가능한 작은 커밋과 좁은 PR로 나누고, 각 단위를 메인라인에 자주 통합해야 한다. 통합 간격을 줄이지 않은 `fearless parallelism`은 통합 지옥을 없애는 대신 더 빠르게 만든다.

Tier 1에서 affected-test selection을 쓴다면 전체 스위트를 Tier 2에서 정기적으로 돌려 선택 그래프의 누락을 찾는다. 반대로 느린 검사를 무조건 nightly로 밀어 버려서도 안 된다. 데이터 손실·과금·권한처럼 실패 비용이 큰 계약은 느리더라도 해당 변경의 병합 게이트다.

Tier 2가 nightly나 post-merge에서 메인라인 회귀를 발견하면 그것을 다음 스프린트의 경고로 쌓아 두지 않는다. 영향받는 영역의 새 머지와 출하를 멈추고, 원인 변경을 즉시 고치거나 되돌려 green을 복원한다. 그리고 이 실패가 PR 전에 잡혔어야 했다면 누락된 계약을 Tier 1 선택 그래프나 병합 게이트로 승격한다. 느린 검사를 뒤로 미룰 수는 있어도 **깨진 메인라인의 복구 책임까지 뒤로 미룰 수는 없다.**

P95가 예산을 넘으면 가장 먼저 할 일은 runner를 무작정 더 사는 것이 아니다. 중복 계약을 합치고, 잘못된 층의 테스트를 아래로 내리고, fixture와 전역 상태를 줄이고, 독립 작업을 병렬화한다. 중요한 가드를 단지 느리다는 이유로 끄는 것은 마지막 선택이어야 한다.

## 테스트도 계속 임대료를 내야 한다

테스트의 필요성을 완벽하게 증명하는 방법은 없다. 한 번도 실패하지 않은 테스트가 내일의 치명적 회귀를 막을 수도 있고, 삭제한 뒤 스위트가 초록이라는 사실은 미래에도 안전하다는 뜻이 아니다. 그래서 나는 "필요성 증명"을 수학적 확정이 아니라 **가치에 대한 갱신 가능한 증거**로 다룬다.

### 감사 시점

- PR이 테스트를 수정하거나 새로 추가할 때 해당 계약과 층 선택을 함께 검토한다.
- 동작을 보존한 리팩터링인데 테스트가 대량으로 깨질 때 즉시 구현 결합 감사를 한다.
- 매달 느린 테스트와 flaky test 상위 항목을 짧게 검토한다.
- Tier 0·1의 P95가 운영 예산을 5영업일 연속 넘으면 중복·층 배치 감사를 시작한다.

### 각 테스트에 던질 여섯 질문

1. 이 테스트가 권위 있는 기준선의 어떤 acceptance criterion·NFR·불변식·과거 버그를 지키는지 한 문장으로 말할 수 있는가?
2. 그 동작을 의도적으로 깨뜨리면 이 테스트가 올바른 이유로 빨개지는가?
3. 관찰 가능한 동작을 유지한 채 내부만 바꾸면 초록으로 남는가?
4. 같은 계약을 더 낮고 안정적인 층에서 지킬 수 있는가?
5. 다른 가드가 잡지 못하는 고유한 실패 신호가 있는가?
6. 장수명·고위험 계약이라면 그 이유와 폐기 조건을 설명하는 ADR이나 결정 기록에 연결되는가?

두 번째 질문에는 mutation testing과 fault injection이 유용하다. 핵심 계산의 비교 연산을 뒤집거나 경계에서 메시지를 중복·누락시키고, 재시도 중 timeout을 주입했을 때 해당 가드가 빨개지는지 본다. 특히 금액 계산, 권한, idempotency, 상태 전이처럼 실패 비용이 큰 계약에서 **테스트가 해당 위험을 감지하는지** 보여 주는 강한 증거다.

그렇다고 surviving mutant 하나를 곧바로 테스트 삭제 명령으로 해석하면 안 된다. 같은 동작을 만드는 equivalent mutant일 수 있고, 테스트가 아니라 계약 인벤토리가 빠진 것일 수도 있다. mutation과 fault injection은 전 코드베이스에서 매 PR마다 돌릴 의식이 아니라, 고위험·변경 영역과 의심스러운 테스트의 감도를 확인하는 표적 도구로 쓴다.

### 삭제 기준

다음 중 하나를 증거와 함께 만족하면 테스트를 삭제하거나 더 낮은 층으로 옮긴다.

- 제품 계약 자체가 폐기됐고, 연결된 ADR이 있다면 `Superseded` 처리됐으며 없다면 사람 소유자가 계약 인벤토리를 `Retired`로 승인했고, 호출자·문서·Feature Map에서도 제거됐다.
- 같은 관찰 가능한 계약을 더 빠르고 안정적인 가드가 지키며, 이 테스트만의 고유한 실패 신호가 없다.
- 아키텍처·타입·lint가 과거의 잘못된 상태를 만들 수 없게 했고, 그 규칙이 과거에 발생한 실패를 차단하는 것을 확인했다.
- 행동은 다른 가드가 지키는데 이 테스트는 private helper, 내부 호출 순서, fixture 모양만 고정한다.
- 의미 있는 mutation·fault에도 반응하지 않고, 연결된 계약·과거 버그·고유 신호도 없다.
- flaky test를 결정적인 하위 가드나 안정된 경계 테스트로 대체했고, 교체 가드의 red 증거를 확보했다.

반대로 "오래됐다", "최근 실패한 적이 없다", "삭제해도 coverage 숫자가 같다"는 삭제 근거가 아니다. 영구 가드를 지우려면 무엇이 그 계약을 대신 지키는지까지 보여 줘야 한다. 이것이 래칫을 가볍게 만들되 톱니를 몰래 갈아내지 않는 방법이다.

## 프로젝트에 적용할 최종 정책

아래 정책은 두 workflow의 타협안이 아니다. 프로젝트·독립 subsystem은 하나의 운영체제를 milestone 동안 유지하고, 안전장치는 방법론 독립적인 controls로 운영한다.

- [ ] **선택 경계를 먼저 정한다.** product·project 전체를 기본 단위로 삼고, public boundary·owner·release cadence·계약 기준선·측정을 독립적으로 가질 때만 subsystem을 별도 단위로 둔다.
- [ ] **milestone 시작 전에 운영체제를 하나 고른다.** feature·bug·refactoring ticket은 그 결정을 상속하며, 진행 중인 milestone에서 위험도나 크기에 따라 workflow를 바꾸지 않는다.
- [ ] **pstack-governed에는 SDD 문서 파이프라인을 두지 않는다.** project contract에 목표·핵심 사용자 결과·불변식·non-goal·외부 제약·rollback을 두고, change brief·선택적 ADR·실행 가능한 계약·Feature Map을 고유 역할로 유지한다.
- [ ] **SDD-governed에서는 Requirements → Specify → Plan을 권위 있는 추적 사슬로 둔다.** FR → TS → Step을 사람이 검토하고, 코드가 먼저 앞서거나 문서를 사후 동기화하지 않는다.
- [ ] **같은 변경에서 두 workflow를 중첩하지 않는다.** pstack change workflow 뒤에 SDD 문서를 증빙용으로 채우거나, SDD 계획 위에 pstack의 별도 brief·decision trail을 병렬 source of truth로 얹지 않는다.
- [ ] **좋은 기술과 workflow를 구분한다.** TDD·CI·ADR·Feature Map·architecture fitness·cold-start review·격리 prototype·독립 product-surface verification은 어느 운영체제에서도 쓰되, 제품 의도와 작업 순서를 중복 서술하지 않는다.
- [ ] **선택을 운영 가설로 기록한다.** pstack이나 SDD의 보편적 우월성을 전제하지 않고, 이 경계에서 어떤 비용과 실패를 줄일지 반증 가능한 문장으로 남긴다.
- [ ] **milestone마다 같은 지표로 평가한다.** 결함 유출률, 리드타임, 재작업률, 리뷰 시간, cold-start 성공률, 문서 drift와 유지비를 비교한다.
- [ ] **전환 신호를 양방향으로 본다.** acceptance 충돌·여러 PR 영향 추적 실패·반복 cold-start 실패·외부 감사 불가는 pstack-governed의 경고이고, 비싼 문서 리뷰·drift·중복 산출물·작은 변경 ceremony·과도한 사전 논쟁은 SDD-governed의 경고다.
- [ ] **전환은 다음 milestone의 clean cutover로만 한다.** 장수명 계약만 project contract·ADR·테스트 또는 Requirements 기준선으로 옮기고 과거 workflow 문서는 동결한다. 두 체계를 이중 갱신하지 않는다.
- [ ] **prototype은 discovery loop에 가둔다.** production에 직접 승격하지 않고, 배운 결정만 현재 운영체제의 권위 있는 기준선에 반영한 뒤 production 구현을 새로 시작한다.
- [ ] **구조 일관성과 맥락 복원에는 별도 gate를 둔다.** pstack-governed의 architecture map 또는 SDD-governed의 specs를 구조 원본으로 삼고, fitness function으로 경계를 지킨다. 중요한 변경은 private transcript 없는 동료 cold-start review를 통과한다.
- [ ] **Feature Map은 행동 카탈로그로 유지한다.** product surface에서 무엇을 증명할지 적되, 그것만으로 CI coverage가 생겼다고 간주하지 않는다.
- [ ] **가드는 가장 낮고 안정적인 층에 둔다.** 아키텍처 → 타입·스키마 → lint → unit·property → integration·contract → 좁은 E2E 순으로 계약을 표현할 수 있는 첫 층을 택한다.
- [ ] **버그는 red-before-green이 기본이다.** 값싼 회귀 테스트가 있으면 먼저 남기고, 없으면 같은 표면의 executable repro를 먼저 만든다. 고위험·반복 가능 버그는 일회성 증거로 끝내지 않는다.
- [ ] **TDD는 필요한 곳에서 크랭크로 쓴다.** 도메인 로직·상태 전이·API 설계에는 적극 사용하고, 탐색용 테스트가 영구 계약을 표현하지 않으면 작업 후 정리한다.
- [ ] **Tier 0·1과 commit build를 모든 PR에 요구한다.** 무거운 검증은 위험도에 따라 Tier 2로 분리하고, 빨간 메인라인은 새 기능보다 먼저 복구한다.
- [ ] **테스트는 임대료를 낸다.** 계약, 감도, 리팩터링 내성, 고유 신호를 설명하지 못하거나 예산을 넘기는 테스트는 감사하고, 삭제에는 대체 가드와 red 증거를 요구한다.
- [ ] **Tier 3 독립 product-surface verification은 중요한 변경에 적용한다.** 작성자가 아닌 검증자가 UI·CLI·API에서 행동·결과·부수효과를 직접 확인한다. 이 PASS는 CI를 대신하지 않는다.
- [ ] **전수 E2E를 목표로 삼지 않는다.** E2E는 층 사이 연결 자체가 계약인 핵심 여정에만 두고, 나머지는 더 싸고 안정적인 층으로 내린다.

내가 지키고 싶은 것은 특정 방법론의 생존이 아니라 **한 프로젝트에 하나의 권위와, 시간축이 다른 증거를 끊기지 않게 유지하는 것**이다. pstack-governed와 SDD-governed 중 어느 쪽도 공개 근거로 우월성이 입증되지 않았다. 프로젝트는 하나를 운영 가설로 택해 milestone 동안 유지하고, TDD·CI·ADR·Feature Map·architecture fitness·cold-start review를 독립 controls로 둔다. 지표가 가설을 반박하면 진행 중인 변경에 다른 workflow를 얹지 않고 다음 milestone에서 clean cutover한다. 필요한 신뢰의 최저 지속 비용은 혼합 절차가 아니라 **하나의 source of truth, 측정, 명시적 전환**에서 나온다.

<div class="deck-source" hidden aria-hidden="true">

<section class="slide slide--title">
  <p class="deck-kicker">pstack을 처음 보는 개발자를 위한 선택 가이드</p>
  <h1>두 방법을 섞으면<br>더 안전할까?</h1>
  <p class="deck-lead">pstack은 코드베이스에서 배우고, UI·CLI·API 실행 증거로 변경을 닫는 개발 workflow다.</p>
  <p class="deck-note">계획을 없애는 도구가 아니다.</p>
</section>

<section class="slide">
  <p class="deck-kicker">pstack · 한 흐름</p>
  <h2>읽고, 실험하고, 작게 내고, 남이 돌려 본다</h2>
  <ul class="deck-flow">
    <li>코드베이스 조사</li>
    <li>설계·prototype</li>
    <li>작은 PR</li>
    <li>UI·CLI·API 독립 검증</li>
  </ul>
  <p class="deck-lead">완료의 기준은 “코드를 썼다”가 아니라 “product surface에서 확인됐다”다.</p>
  <p class="deck-note">작성자의 설명이나 초록색 테스트만으로 끝내지 않는다.</p>
</section>

<section class="slide">
  <p class="deck-kicker">오해 하나만 지우기</p>
  <h2>계획을 버리는 대신, 증거로 계획을 고친다</h2>
  <p class="deck-lead">“일단 짠다”가 아니라 “먼저 조사하고, 모르는 것만 실험한다.”</p>
  <ul class="deck-chips">
    <li class="deck-chip">필요하면 상세 계획</li>
    <li class="deck-chip">설계 후보 비교</li>
    <li class="deck-chip">격리 prototype</li>
    <li class="deck-chip">값싼 테스트</li>
  </ul>
  <p class="deck-note">pstack은 무계획이 아니라 증거 우선(evidence-first) 흐름이다.</p>
</section>

<section class="slide">
  <p class="deck-kicker">이미 아는 SDD는 짧게</p>
  <h2>SDD는 합의한 문서에서 출발한다</h2>
  <ul class="deck-flow">
    <li>요구사항</li>
    <li>기술 명세</li>
    <li>구현 계획</li>
    <li>코드</li>
  </ul>
  <p class="deck-lead">의도를 먼저 고정하고, 구현이 그 추적 사슬을 따르게 한다.</p>
  <p class="deck-note">강점은 여러 사람과 변경 사이에서 요구와 승인을 잃지 않는 데 있다.</p>
</section>

<section class="slide">
  <p class="deck-kicker">중심 갈등</p>
  <h2>권위가 둘이면, 진실을 맞추는 일이 새 업무가 된다</h2>
  <div class="deck-cols">
    <div class="deck-card">
      <h3>SDD</h3>
      <p>승인 문서가 먼저 바뀌고 코드가 따른다.</p>
    </div>
    <div class="deck-card">
      <h3>pstack</h3>
      <p>코드베이스와 실행 증거에서 먼저 배운다.</p>
    </div>
  </div>
  <p class="deck-lead">둘 다 쓰면 두 배 안전? 대개 두 벌을 맞춰야 한다.</p>
  <p class="deck-note">같은 변경에서 source of truth가 둘이 된다.</p>
</section>

<section class="slide">
  <p class="deck-kicker">반전</p>
  <h2>운영체제는 하나, 안전장치는 여러 개</h2>
  <p class="deck-lead">pstack을 고른다고 TDD·CI를 버리는 것이 아니다.</p>
  <ul class="deck-chips">
    <li class="deck-chip">TDD</li>
    <li class="deck-chip">CI</li>
    <li class="deck-chip">ADR</li>
    <li class="deck-chip">Feature Map</li>
  </ul>
  <p class="deck-note">TDD는 설계와 버그, CI는 반복 회귀, ADR은 이유, Feature Map은 사용자 실행 경로를 지킨다.</p>
</section>

<section class="slide">
  <p class="deck-kicker">증거의 시간축</p>
  <h2>PASS에도 유효기간이 있다</h2>
  <div class="deck-cols">
    <div class="deck-card">
      <h3>지금 · product-surface PASS</h3>
      <p>이번 산출물이 UI·CLI·API에서 직접 움직이는가?</p>
    </div>
    <div class="deck-card">
      <h3>미래 · 회귀 CI</h3>
      <p>다음 변경이 이미 지킨 계약을 깨뜨렸는가?</p>
    </div>
  </div>
  <p class="deck-lead">product-surface PASS와 CI는 서로를 대신하지 못한다.</p>
</section>

<section class="slide">
  <p class="deck-kicker">선택 문제</p>
  <h2>이 경계에서 가장 비싼 실패는 무엇인가?</h2>
  <div class="deck-cols">
    <div class="deck-card">
      <h3>실행에서 먼저 배운다</h3>
      <p><strong>pstack-governed</strong>: 코드 조사·실험·product-surface verification이 사전 문서보다 불확실성을 싸게 줄일 때.</p>
    </div>
    <div class="deck-card">
      <h3>합의를 먼저 추적한다</h3>
      <p><strong>SDD-governed</strong>: 승인된 요구, 여러 변경의 영향, 외부 계약을 끊김 없이 추적하는 일이 더 중요할 때.</p>
    </div>
  </div>
  <p class="deck-lead">보편적 승자 대신, 경계에 맞는 운영 가설을 고른다.</p>
</section>

<section class="slide">
  <p class="deck-kicker">고정 단위</p>
  <h2>ticket이 아니라 경계와 milestone</h2>
  <ul class="deck-flow">
    <li>프로젝트·독립 subsystem</li>
    <li>시작 전에 하나 선택</li>
    <li>모든 ticket이 상속</li>
    <li>끝에서 평가</li>
  </ul>
  <p class="deck-lead">중간에 불안해졌다고 다른 workflow를 덧씌우지 않는다.</p>
  <p class="deck-note">독립 subsystem은 경계·owner·release·계약·측정을 스스로 가져야 한다.</p>
</section>

<section class="slide">
  <p class="deck-kicker">운영 가설</p>
  <h2>좋아 보였는지가 아니라, 덜 실패했는가</h2>
  <ul class="deck-chips">
    <li class="deck-chip">품질 · 결함 유출</li>
    <li class="deck-chip">속도 · 리드타임</li>
    <li class="deck-chip">비용 · 재작업·리뷰</li>
    <li class="deck-chip">공유 · cold-start·drift</li>
  </ul>
  <p class="deck-lead">같은 정의로 milestone마다 측정한다.</p>
  <p class="deck-note">지표가 가설을 반박하면 방식에 충성하지 않는다.</p>
</section>

<section class="slide slide--title">
  <p class="deck-kicker">결론</p>
  <h2>섞지 말고,<br>측정하며 갈아탄다</h2>
  <ul class="deck-flow">
    <li>하나를 고른다</li>
    <li>안전장치를 유지한다</li>
    <li>측정한다</li>
    <li>틀리면 다음 milestone에서 clean cutover</li>
  </ul>
  <p class="deck-lead">과거 방식은 동결하고, 장수명 계약만 옮겨 새 기준선을 하나로 만든다.</p>
  <p class="deck-note">한 프로젝트·독립 subsystem, 한 milestone, 하나의 source of truth.</p>
</section>

</div>
