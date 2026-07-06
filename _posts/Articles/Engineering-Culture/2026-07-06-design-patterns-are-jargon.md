---
layout: post
title: "\"디자인 패턴\" 소리 한 번만 더 들으면 미쳐버릴 것 같다 — 패턴이라는 용어를 향한 반론 (purplesyringa)"
date: 2026-07-06
categories: [Articles, Engineering-Culture]
tags: [articles, design-patterns, software-design, oop, solid]
published: true
excerpt: "purplesyringa의 'If I hear design pattern one more time, I'll go mad'(2025-09-04)를 정리·분석한다. 'Command 패턴은 그냥 함수'라는 도발로 시작해, 패턴이라는 용어가 코드를 밝혀주기보다 인지 부담과 번역 단계만 늘린다고 주장하는 글이다. 패턴 자체를 부정하는 게 아니라, 패턴을 '따라야 할 목록'으로 가르치는 방식을 겨냥한다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="오크 전사가 'Command'·'Factory'·'Strategy'라는 화려한 이름표가 붙은 무거운 갑옷 껍데기를 벗어던지자, 그 안의 실체는 평범한 함수·인터페이스·변수였다는 대비" viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
  <title>이름표라는 껍데기 vs 평범한 알맹이</title>
  <defs>
    <marker id="shed-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--accent-color)"/>
    </marker>
  </defs>

  <!-- section mini-headers -->
  <text x="128" y="28" text-anchor="middle" font-family="var(--font-body)" font-size="15" font-weight="700" fill="var(--accent-color)">껍데기 · 화려한 이름표</text>
  <text x="452" y="28" text-anchor="middle" font-family="var(--font-body)" font-size="15" font-weight="700" fill="var(--secondary-color)">알맹이 · 평범한 실체</text>

  <!-- shed, ornate, crimson-labeled armor plates (flung off to the left) -->
  <g transform="translate(36 58) rotate(-7)">
    <rect x="0" y="0" width="152" height="46" rx="8" fill="var(--bg-panel)" stroke="currentColor" stroke-width="3"/>
    <rect x="5" y="5" width="142" height="36" rx="5" fill="none" stroke="var(--accent-color)" stroke-width="2" opacity="0.75"/>
    <circle cx="12" cy="12" r="2.4" fill="var(--accent-color)"/><circle cx="140" cy="12" r="2.4" fill="var(--accent-color)"/>
    <circle cx="12" cy="34" r="2.4" fill="var(--accent-color)"/><circle cx="140" cy="34" r="2.4" fill="var(--accent-color)"/>
    <text x="76" y="30" text-anchor="middle" font-family="var(--font-body)" font-size="18" font-weight="700" fill="var(--accent-color)">Command</text>
  </g>
  <g transform="translate(22 148) rotate(4)">
    <rect x="0" y="0" width="152" height="46" rx="8" fill="var(--bg-panel)" stroke="currentColor" stroke-width="3"/>
    <rect x="5" y="5" width="142" height="36" rx="5" fill="none" stroke="var(--accent-color)" stroke-width="2" opacity="0.75"/>
    <circle cx="12" cy="12" r="2.4" fill="var(--accent-color)"/><circle cx="140" cy="12" r="2.4" fill="var(--accent-color)"/>
    <circle cx="12" cy="34" r="2.4" fill="var(--accent-color)"/><circle cx="140" cy="34" r="2.4" fill="var(--accent-color)"/>
    <text x="76" y="30" text-anchor="middle" font-family="var(--font-body)" font-size="18" font-weight="700" fill="var(--accent-color)">Factory</text>
  </g>
  <g transform="translate(44 236) rotate(-4)">
    <rect x="0" y="0" width="152" height="46" rx="8" fill="var(--bg-panel)" stroke="currentColor" stroke-width="3"/>
    <rect x="5" y="5" width="142" height="36" rx="5" fill="none" stroke="var(--accent-color)" stroke-width="2" opacity="0.75"/>
    <circle cx="12" cy="12" r="2.4" fill="var(--accent-color)"/><circle cx="140" cy="12" r="2.4" fill="var(--accent-color)"/>
    <circle cx="12" cy="34" r="2.4" fill="var(--accent-color)"/><circle cx="140" cy="34" r="2.4" fill="var(--accent-color)"/>
    <text x="76" y="30" text-anchor="middle" font-family="var(--font-body)" font-size="18" font-weight="700" fill="var(--accent-color)">Strategy</text>
  </g>

  <!-- shed-motion arcs: the shell flying off the body toward the plates -->
  <g fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-dasharray="2 6" opacity="0.55">
    <path d="M344 158 C 300 110, 252 88, 200 84" marker-end="url(#shed-arrow)"/>
    <path d="M344 182 C 300 180, 252 176, 184 174" marker-end="url(#shed-arrow)"/>
    <path d="M344 206 C 300 250, 252 262, 206 264" marker-end="url(#shed-arrow)"/>
  </g>

  <!-- the body / substance revealed: line-art orc head + plain green-framed plate -->
  <g stroke="currentColor" fill="var(--bg-panel)">
    <path d="M446 74 Q451 60 456 74" fill="var(--secondary-color)" stroke="none"/>
    <path d="M424 96 Q424 74 451 74 Q478 74 478 96 L478 112 Q478 130 451 130 Q424 130 424 112 Z" stroke-width="2.5"/>
    <path d="M435 124 l4 -13 l4 13 z" stroke-width="1.5"/>
    <path d="M459 124 l4 -13 l4 13 z" stroke-width="1.5"/>
  </g>
  <g fill="currentColor">
    <circle cx="440" cy="99" r="2.8"/>
    <circle cx="462" cy="99" r="2.8"/>
  </g>
  <path d="M431 90 L448 96 M471 90 L454 96" stroke="currentColor" stroke-width="2.5" fill="none"/>

  <rect x="348" y="140" width="208" height="176" rx="12" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="3"/>

  <g font-family="var(--font-body)" font-size="13">
    <circle cx="366" cy="186" r="3.6" fill="var(--secondary-color)"/>
    <text x="380" y="191"><tspan font-weight="700" fill="currentColor">함수</tspan><tspan fill="var(--text-light)"> · () => obj.method()</tspan></text>
    <circle cx="366" cy="232" r="3.6" fill="var(--secondary-color)"/>
    <text x="380" y="237"><tspan font-weight="700" fill="currentColor">인터페이스</tspan><tspan fill="var(--text-light)"> · interface</tspan></text>
    <circle cx="366" cy="278" r="3.6" fill="var(--secondary-color)"/>
    <text x="380" y="283"><tspan font-weight="700" fill="currentColor">변수</tspan><tspan fill="var(--text-light)"> · let store</tspan></text>
  </g>
</svg>
<figcaption>화려한 이름표(Command·Factory·Strategy)를 벗겨내면 남는 것은 결국 평범한 함수·인터페이스·변수다. 이 글은 실체가 아니라 그 위에 얹힌 이름표의 비용을 겨냥한다.</figcaption>
</figure>

## 원문 정보

> - **제목**: If I hear "design pattern" one more time, I'll go mad
> - **출처**: purplesyringa's blog (purplesyringa.moe)
> - **발행**: 2025-09-04 · 약 8~10분 분량
> - **원문 링크**: <https://purplesyringa.moe/blog/if-i-hear-design-pattern-one-more-time-ill-go-mad/>

디자인 패턴을 정면으로 다룬 위키 시리즈([OO-Design Essential](/2026/06/19/oo-design-essential-curriculum.html))가 이미 있으니, 그 반대편에서 "패턴이라는 언어를 대체 왜 쓰는가"를 묻는 이 반론을 Articles에 나란히 놓아 균형을 맞춘다.

## 한 줄 요약 (TL;DR)

패턴 자체는 유용하지만, **'패턴'이라는 이름과 용어에 집착하는 순간** 코드가 밝아지기는커녕 사람 말에서 코드로 번역하는 단계와 인지 부담만 늘어난다. 초심자를 위한 임시 기억법 이상으로 대접하지 말고, SOLID 같은 원리를 가르친 뒤 문제와 해법을 직접 설명하라는 도발적 에세이다.

<figure class="post-figure">
<svg role="img" aria-label="'사람의 의도 → 패턴 이름(Command) → 실제 코드' 세 칸 파이프라인에서, 가운데 '패턴 이름' 정거장에 크게 X가 쳐져 지워지고, 사람의 의도에서 실제 코드로 곧장 잇는 굵은 화살표가 아래로 연결된다" viewBox="0 0 640 288" xmlns="http://www.w3.org/2000/svg">
  <title>가운데 '패턴 이름' 정거장을 지우고 의도에서 코드로 곧장</title>
  <defs>
    <marker id="tl-detour" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--text-light)"/>
    </marker>
    <marker id="tl-direct" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7.5" markerHeight="7.5" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>

  <!-- the costly detour: the path that routes THROUGH the pattern-name stop -->
  <g fill="none" stroke="var(--text-light)" stroke-width="2" stroke-dasharray="2 6" opacity="0.7">
    <path d="M190 118 L233 118" marker-end="url(#tl-detour)"/>
    <path d="M405 118 L448 118" marker-end="url(#tl-detour)"/>
  </g>

  <!-- slot 1: human intent -->
  <rect x="20" y="78" width="170" height="80" rx="10" fill="var(--bg-panel)" stroke="currentColor" stroke-width="2.5"/>
  <text x="105" y="112" text-anchor="middle" font-family="var(--font-body)" font-size="16" font-weight="700" fill="currentColor">사람의 의도</text>
  <text x="105" y="136" text-anchor="middle" font-family="var(--font-body)" font-size="12" fill="var(--text-light)">동작을 값으로 다루기</text>

  <!-- slot 2: pattern name — the ERASED stop -->
  <text x="320" y="60" text-anchor="middle" font-family="var(--font-body)" font-size="13" font-weight="700" fill="var(--accent-color)">번역 비용만 얹는 정거장</text>
  <rect x="235" y="78" width="170" height="80" rx="10" fill="none" stroke="var(--text-light)" stroke-width="2" stroke-dasharray="5 5" opacity="0.65"/>
  <text x="320" y="112" text-anchor="middle" font-family="var(--font-body)" font-size="16" font-weight="700" fill="var(--text-light)" text-decoration="line-through">패턴 이름</text>
  <text x="320" y="136" text-anchor="middle" font-family="var(--font-body)" font-size="12" fill="var(--text-light)" text-decoration="line-through">Command</text>
  <g stroke="var(--accent-color)" stroke-width="4" stroke-linecap="round">
    <line x1="245" y1="88" x2="395" y2="148"/>
    <line x1="395" y1="88" x2="245" y2="148"/>
  </g>

  <!-- slot 3: actual code -->
  <rect x="450" y="78" width="170" height="80" rx="10" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="3"/>
  <text x="535" y="112" text-anchor="middle" font-family="var(--font-body)" font-size="16" font-weight="700" fill="currentColor">실제 코드</text>
  <text x="535" y="136" text-anchor="middle" font-family="var(--font-body)" font-size="12.5" fill="var(--text-light)">() => obj.method()</text>

  <!-- the direct join: intent → code, bypassing the erased stop -->
  <path d="M105 158 L105 224 Q105 232 113 232 L527 232 Q535 232 535 224 L535 158"
        fill="none" stroke="var(--secondary-color)" stroke-width="4" marker-end="url(#tl-direct)"/>
  <text x="320" y="200" text-anchor="middle" font-family="var(--font-body)" font-size="13.5" font-weight="700" fill="var(--secondary-color)">가운데 정거장을 지우고 — 의도에서 코드로 곧장</text>
</svg>
<figcaption>하나의 개념은 '사람의 의도 → 패턴 이름 → 실제 코드' 세 칸을 거친다. 저자는 가운데 '패턴 이름' 정거장이 번역 비용만 얹는다고 보고, 그 칸을 지워 의도에서 코드로 곧장 잇자고 말한다.</figcaption>
</figure>

## 왜 이 글을 골랐나

디자인 패턴은 객체지향 교육의 정전(canon)처럼 다뤄진다. 이 위키만 해도 [Head First Design Patterns](/2026/06/19/head-first-design-patterns.html), [GoF의 23개 패턴](/2026/06/19/gof-design-patterns.html)을 정리한 글이 있다. 그런데 현업에서 패턴 용어는 종종 **소통을 돕기보다 방해한다.** "여기 Strategy를 쓰자"는 말이 "인터페이스 하나 두자"보다 더 어렵게 들리는 경험, 위키백과의 Abstract Factory 정의를 읽다가 정작 매일 쓰던 것이 헷갈려지는 경험은 누구에게나 있다.

이 글이 매력적인 건, 패턴 무용론으로 흐르지 않는다는 점이다. 저자는 패턴의 실체(함수, 인터페이스, 합성)를 부정하지 않는다. 부정하는 것은 그 실체에 붙은 **거창한 이름표와, 그 이름표를 외워야 할 목록으로 가르치는 문화**다. 패턴을 배운 사람이라면 한 번쯤 느꼈을 위화감을 정확히 언어화해 준다.

## 핵심 내용

### "이게 뭐냐고? 나는 이걸 함수라고 부른다"

글의 첫 도발은 Command 패턴이다. 저자에 따르면 "행동에 대한 정보를 캡슐화한다"는 Command 패턴의 정의는 결국 `const command = () => object.method(arg1, arg2)` 한 줄, 즉 **클로저 하나**로 끝난다. 마찬가지로 흔히 회자되는 "data store 패턴"은 그냥 **변수**다. 패턴 이름은 사람들이 이미 자기도 모르게 쓰고 있는 기본 개념 위에 낯선 라벨을 덧씌운다는 것이 출발점이다.

### 패턴이라는 범주 자체가 뒤죽박죽이다

저자는 '패턴'이라는 분류가 **본질적으로 다른 것들을 한데 묶는다**고 지적한다. 예를 들어 Iterator는 언어 차원에서 형식화된 인터페이스(구현이 강제되는 엄격한 요구사항)인 반면, Mediator는 그저 권장되는 모범 사례 템플릿(유연한 권고)이다. 성격이 이렇게 다른데도 둘 다 "행동 패턴(behavioral pattern)"이라는 같은 상자에 담긴다. 그렇다면 컬렉션마다 클로저를 받는 `forEach` 메서드를 두는 것은 왜 Iterator만큼 정당한 '패턴'이 아닌가? 범주의 경계가 자의적이라는 것이다.

### 접착제 패턴은 손에 잡히는 개념이 없다

이어서 저자는 상당수 패턴이 **"접착제(glue) 패턴"** — 언어가 이미 제공하는 기능을 다른 이름으로 부른 것에 불과하다고 본다. Strategy 패턴은 "인터페이스를 쓴다"는 것 이상도 이하도 아니며, 이는 애초에 인터페이스가 존재하는 주된 이유다. 그리고 언어 습관 차원에서 **"나는 컬렉션을 순회한다(I iterate over a collection)"**가 **"나는 Iterator를 사용한다(I use an iterator)"**보다 자연스럽고 명확하다고 짚는다. 목표(goal)를 말하면 소통이 되지만, 패턴 이름을 말하면 한 번 더 번역이 필요하다.

### 좋은 설계는 눈에 띄지 않는다

저자의 미학적 논거는 **"좋은 설계는 보이지 않는다(Good design is invisible)"**로 요약된다. 잘 된 설계는 작업을 방해하지 않고 스며든다. 반면 패턴 이름은 사람의 언어를 코드로 옮기는 **머릿속 번역 단계**를 매번 강요한다. 저자는 좋은 구현이 "문제를 카탈로그의 패턴에 맞춰 고르는" 방식이 아니라 오히려 **우연히, 자연스럽게 도출된다**고 본다. 패턴에 끼워 맞추는 학습은 문제를 푼다기보다 숙제 검사를 받는 느낌에 가깝다는 것이다.

### 이름과 실제 코드 사이의 거대한 간극

'Naming' 절에서 저자는 패턴 용어와 실제 구현 사이의 불일치를 나열한다.

- **Factory** → 실제로는 `function newFoo`
- **Adapter** → 실제로는 `interface FooWrapper`
- **Prototype** → 실제로는 `function clone`

뇌의 용량은 유한한데, 이런 동의어들은 인지 자원을 낭비한다는 것이 핵심이다. 특히 JavaScript의 `Class.prototype`은 이름만 같을 뿐 Prototype 패턴의 개념과는 거의 무관해서 혼란을 가중한다. 저자의 처방은 **생태계에 이미 표준으로 자리 잡은 이름만 쓰라**는 것이다. 가령 트리 순회에서 `Visitor`처럼 관용적으로 통하는 이름은 그대로 쓰되, 대부분의 경우 패턴 라벨보다 **문제 상황을 직접 풀어 쓴 설명**이 더 잘 통한다.

### 패턴은 언어를 건너 이식되지 않는다

저자는 패턴이 **언어 의존적**이라는 점도 파고든다. Lazy Initialization은 불변(immutable)을 기본으로 하는 함수형 언어에서는 의미를 잃고, Singleton은 전역 변수가 용인되는 환경에서는 굳이 필요 없다. 서브클래싱 기반 패턴은 상속보다 합성을 선호하는 언어와 어울리지 않으며, Rust의 branded lifetime 같은 패턴은 애초에 다른 패러다임에는 존재할 수조차 없다. 그래서 패턴은 **언어를 가로지르는 보편 어휘로 기능하지 못한다.** 정작 보편적으로 통하는 것은 '무엇을 이루려 하는가'라는 목표(goal)이지 패턴 이름이 아니다.

### 위키백과 정의를 읽다 머리가 아파진다

'My head hurts' 절에서 저자는 위키백과의 Abstract Factory 정의를 예로 든다. 타입 소거된 값을 반환하는 생성자, 이름 붙은 생성 메서드, 메서드 시그니처를 갖춘 팩토리 트레이트… **매일 abstract factory를 쓰면서도 그 정의를 파싱하려 하면 머리가 아프다**는 것이다. 장황한 기술 문서가 오히려 뻔한 구현을 가린다. 아이러니는, 패턴을 설명하는 글 자체가 과잉 설계(overengineered)되어 있다는 점이다.

### 그래서, 원리를 가르쳐야 한다

'Principles' 절이 이 글의 건설적 결론이다. 저자가 보는 좋은 아키텍처는 **필요한 최소한의 구현 + 언어가 이미 제공하는 도구**의 조합이다. 초심자가 원리를 이해하지 않은 채 패턴을 통째로 외우면 카고 컬트(cargo cult)와 과잉 설계로 흐른다. 더 나은 길은 패턴을 **따라야 할 공식이 아니라, SOLID 같은 원리가 현실에 적용된 하나의 예시**로 가르치는 것이다. 그러면 개발자는 반복적인 구현을 거치며 자연스럽게 패턴으로 수렴한다. 저자는 JavaScript에서 document 추상화가 어느새 유기적으로 abstract factory 형태가 되는 과정을 예로 든다 — 아무도 "이제 abstract factory를 적용하자"고 선언하지 않았는데도.

### 결론: 패턴 용어는 역사적 산물이다

패턴 용어는 클로저·인터페이스·일급 함수 같은 현대적 언어 기능이 없던 시절의 **역사적 산물**이다. 지금은 자바조차 관련 기능을 10년 넘게 갖추고 있다. 그러니 패턴은 **초심자를 위한 임시 기억법**으로는 여전히 쓸모가 있지만, 반드시 써야 할 필수 용어는 아니다. 저자의 마지막 처방은 간명하다 — 처음 맥락을 잡아준 뒤에는 패턴 이름을 걷어내고, **문제와 해법을 직접 설명하라.**

## 분석과 인사이트

이 글의 힘은 **패턴 무용론과 선을 긋는다**는 데 있다. 저자는 Command·Strategy·Factory의 *실체*(클로저, 인터페이스, 생성 함수)를 한 번도 부정하지 않는다. 겨냥하는 것은 그 실체에 얹힌 *어휘 층위*와, 그 어휘를 암기 목록으로 소비하는 *교육 문화*다. 나는 이 구분이 정확하다고 본다. 흔한 "패턴은 낡았다"류의 글이 실체와 어휘를 뭉뚱그려 논점을 흐리는 데 반해, 이 글은 "실체는 살리고 라벨의 비용을 따지자"는 훨씬 방어 가능한 자리에 선다.

가장 공감이 가는 대목은 **"좋은 설계는 보이지 않는다"**와 번역 비용 논거다. 현업에서 "여기 Strategy 넣자"가 "인터페이스로 뽑아서 갈아 끼우자"보다 팀에 더 빨리 전달되는 경우는 드물다. 목표(무엇을 왜)를 말하면 곧장 통하지만, 패턴 이름을 말하면 듣는 사람이 그 이름을 다시 코드로 되돌려야 한다. 이건 이 위키의 [잘못된 추상화](/2026/06/22/the-wrong-abstraction.html)가 말한 것과 결이 통한다 — 이름이 붙는 순간 그것은 하나의 추상화가 되고, 잘못 고른 추상화는 없느니만 못하다. 패턴 이름을 성급히 박아 넣는 것도 일종의 이른 추상화다.

다만 저자가 다소 과하게 미는 지점도 있다. 패턴 어휘의 진짜 가치는 **1:1 코드 대응이 아니라 팀의 공유된 의도**에 있다. "Observer로 가자"는 단지 콜백을 말하는 게 아니라 "발행-구독으로 결합을 끊고, 구독자 목록·생명주기·해제까지 그 계약대로 관리하자"는 **한 묶음의 트레이드오프 합의**를 부른다. 저자도 `Visitor` 같은 생태계 표준 이름은 남기라고 인정하는데, 그렇다면 문제는 '패턴이라는 범주'가 아니라 '어느 이름이 실제로 공유 어휘로 정착했는가'라는 **경계 긋기**의 문제로 좁혀진다. 이 글은 그 선을 다소 넓게 그어 접착제 패턴 쪽으로 논거를 몰아간 인상이 있다.

'이식되지 않는다'는 논거는 절반만 맞다. 구현 형태가 언어마다 달라지는 것은 사실이지만(상속 vs 합성, 가변 vs 불변), GoF가 말한 것은 애초에 **의도(intent)와 결과(consequences)**이지 구현 코드가 아니었다. 이 위키의 [GoF 정리](/2026/06/19/gof-design-patterns.html)가 강조하듯 패턴 카드의 핵심은 Structure가 아니라 Intent와 Consequences다. 그렇게 읽으면 "Lazy Initialization은 불변 언어에서 무의미하다"는 것은 패턴의 실패가 아니라 **그 의도가 그 맥락에서 불필요하다**는, 오히려 패턴을 제대로 적용한 판단이 된다.

그럼에도 실무 교육에 주는 함의는 뚜렷하다. **패턴을 답이 아니라 예시로 가르쳐라.** 초심자가 [Head First](/2026/06/19/head-first-design-patterns.html)로 직관을 잡는 것과, 시니어가 "여기엔 어떤 패턴을 박을까"를 먼저 묻는 것은 전혀 다른 태도다. 후자는 문제가 아니라 카탈로그에서 출발하는, 이 글이 경계하는 바로 그 과잉 설계다. LLM 시대에는 이 위험이 오히려 커질 수 있다 — 모델은 패턴 이름을 유창하게 뱉지만, [추상화의 본질이 바뀌는 국면](/2026/07/06/llms-new-nature-of-abstraction.html)에서 이름의 유창함과 설계의 적절함은 별개다.

## 적용 포인트

- **패턴 이름 대신 목표를 먼저 말하라.** "Strategy 쓰자"가 아니라 "정렬 기준을 런타임에 갈아 끼우고 싶다"로 시작하면, 팀도 리뷰어도 코드로의 번역 단계를 건너뛴다.
- **패턴은 원리의 예시로만 소환하라.** SOLID를 먼저 세우고 "이게 그 원리가 적용된 한 사례"로 패턴을 붙여라. 외워야 할 목록으로 던지지 마라 — 카고 컬트와 과잉 설계의 지름길이다.
- **생태계 표준 이름은 남기고, 나머지는 풀어 써라.** `Visitor`·`Iterator`처럼 이미 공유 어휘로 정착한 이름은 그대로 쓰되, 그렇지 않은 라벨은 "무엇을 왜 하는지"의 설명으로 대체하라.
- **문제에서 출발하고, 패턴으로 시작하지 마라.** "여기 어떤 패턴을 넣지?"라는 질문이 나오면 방향이 뒤집힌 신호다. 필요한 최소 구현 + 언어가 주는 도구로 풀고, 패턴은 사후에 이름 붙는 결과로 남겨라.
- **이름을 박기 전에 되물어라.** 성급한 패턴 이름은 [잘못된 추상화](/2026/06/22/the-wrong-abstraction.html)와 같다 — 되돌리기 비싼 라벨을 붙이기 전에, 그 추상화가 정말 정착했는지 확인하라.

## 마무리

이 글은 제목의 과장("미쳐버릴 것 같다")과 달리, 속을 들여다보면 꽤 절제된 주장을 편다. 패턴을 버리자는 게 아니라, 패턴을 **말하는 방식**을 바꾸자는 것이다. 실체(함수·인터페이스·합성)는 그대로 두고, 그 위에 얹힌 어휘와 암기 문화의 비용을 정직하게 계산하자는 제안. 디자인 패턴을 이미 배운 사람에게는 자신이 느낀 위화감의 정체를 확인시켜 주고, 이제 배우는 사람에게는 카탈로그가 아니라 원리에서 출발하라는 이정표가 된다. 패턴을 아예 모르는 것과, 패턴을 알되 그 이름에 휘둘리지 않는 것은 다르다 — 이 글은 후자로 가는 길을 가리킨다.

### 더 읽어보기

- [원문 — If I hear "design pattern" one more time, I'll go mad (purplesyringa)](https://purplesyringa.moe/blog/if-i-hear-design-pattern-one-more-time-ill-go-mad/)
- [잘못된 추상화 (Sandi Metz)](/2026/06/22/the-wrong-abstraction.html) — 성급히 붙인 이름/추상화가 왜 중복보다 비싼가, 이 글의 '이른 패턴 이름' 경계와 짝을 이룬다
- [GoF Design Patterns: 23개 패턴의 정전](/2026/06/19/gof-design-patterns.html) — 이 글이 비판하는 범주의 원전. 패턴의 핵심은 Structure가 아니라 Intent·Consequences라는 반론의 근거
- [Head First Design Patterns: 패턴의 직관](/2026/06/19/head-first-design-patterns.html) — "변하는 것을 캡슐화하라"처럼, 이 글이 권하는 '원리 우선' 학습의 좋은 예
- [OO-Design Essential 커리큘럼](/2026/06/19/oo-design-essential-curriculum.html) — 패턴을 원리 위에서 익히는 전체 학습 경로
- [LLM이 가져온 새로운 추상화의 본질 (Martin Fowler)](/2026/07/06/llms-new-nature-of-abstraction.html) — 이름의 유창함과 설계의 적절함이 갈리는 LLM 시대의 추상화 논의
