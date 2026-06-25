---
layout: post
title: "딥러닝의 원리를 '유효 이론'으로 풀다: The Principles of Deep Learning Theory (Roberts·Yaida·Hanin)"
date: 2026-06-25
categories: [Articles, ML-Theory]
tags: [articles, ai, deep-learning, ml-theory, neural-network]
published: true
excerpt: "Daniel A. Roberts, Sho Yaida, Boris Hanin의 책/논문 'The Principles of Deep Learning Theory'(arXiv:2106.10165)를 소개·분석한다. 물리학의 유효 이론(effective theory) 관점에서 깊고 넓은 신경망을 무한폭 가우시안 한계와 1/n 유한폭 보정으로 전개하는 이 작업이 무엇을 주장하는지, 그리고 실무자에게 어떤 함의가 있는지 정리한다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="유효 이론 렌즈로 신경망을 들여다보는 도트 톤 헤더 삽화: 무한히 매끈한 가우시안 구(n→∞)와, 그 위에 1/n 두께로 덧입혀진 유한폭 보정 껍질(상호작용·표현 학습이 사는 층)을 도트 플랫포머풍 오크 전쟁군주가 렌즈로 관측한다." viewBox="0 0 640 300" width="640" height="300" preserveAspectRatio="xMidYMid meet" shape-rendering="crispEdges" style="font-family:var(--font-body)">
  <title>유효 이론 렌즈로 본 신경망 — 가우시안 구 + 1/n 보정 껍질</title>

  <!-- ground line -->
  <rect x="0" y="252" width="640" height="6" fill="currentColor" opacity="0.18"/>
  <!-- platform blocks (platformer tone) -->
  <rect x="24" y="258" width="120" height="10" fill="currentColor" opacity="0.12"/>
  <rect x="500" y="258" width="116" height="10" fill="currentColor" opacity="0.12"/>

  <!-- ===== Grom Hellscream-likeness orc warlord (pixel) on the left, peering through a lens ===== -->
  <g>
    <!-- topknot / black hair -->
    <rect x="60" y="120" width="12" height="12" fill="currentColor"/>
    <rect x="72" y="108" width="12" height="12" fill="currentColor"/>
    <!-- head (orc-green) -->
    <rect x="60" y="132" width="48" height="48" fill="var(--orc-green)"/>
    <!-- crimson war paint -->
    <rect x="66" y="138" width="36" height="6" fill="var(--crimson)"/>
    <!-- eye -->
    <rect x="84" y="150" width="10" height="8" fill="var(--bg-panel)"/>
    <rect x="88" y="152" width="4" height="4" fill="currentColor"/>
    <!-- tusks -->
    <rect x="66" y="174" width="6" height="10" fill="var(--bone)"/>
    <rect x="96" y="174" width="6" height="10" fill="var(--bone)"/>
    <!-- body / shoulders -->
    <rect x="54" y="180" width="60" height="48" fill="var(--orc-green)" opacity="0.85"/>
    <rect x="54" y="180" width="60" height="8" fill="var(--crimson)" opacity="0.6"/>
    <!-- arm holding lens -->
    <rect x="108" y="186" width="34" height="10" fill="var(--orc-green)"/>
  </g>

  <!-- ===== Effective-theory LENS (the scope) ===== -->
  <g>
    <!-- lens barrel -->
    <rect x="142" y="176" width="16" height="30" fill="var(--steel)"/>
    <rect x="142" y="176" width="16" height="6" fill="var(--gold)"/>
    <!-- lens glass ring -->
    <circle cx="178" cy="191" r="22" fill="none" stroke="var(--gold)" stroke-width="4"/>
    <circle cx="178" cy="191" r="22" fill="var(--secondary-color)" opacity="0.12"/>
    <!-- sight-line toward the sphere -->
    <line x1="200" y1="191" x2="372" y2="170" stroke="var(--accent-color)" stroke-width="2" stroke-dasharray="6 6" opacity="0.7"/>
  </g>

  <!-- ===== The neural network as a Gaussian SPHERE + 1/n correction SHELL ===== -->
  <g transform="translate(440 150)">
    <!-- outer 1/n correction shell: a rough, blocky band (interactions / representation learning) -->
    <circle cx="0" cy="0" r="96" fill="none" stroke="var(--accent-color)" stroke-width="14" opacity="0.30"/>
    <!-- shell texture: pixel chips around the rim = the interaction corrections -->
    <g fill="var(--accent-color)" opacity="0.85">
      <rect x="-8" y="-104" width="14" height="14"/>
      <rect x="66" y="-72" width="14" height="14"/>
      <rect x="92" y="-6" width="14" height="14"/>
      <rect x="64" y="64" width="14" height="14"/>
      <rect x="-10" y="92" width="14" height="14"/>
      <rect x="-78" y="60" width="14" height="14"/>
      <rect x="-104" y="-8" width="14" height="14"/>
      <rect x="-78" y="-74" width="14" height="14"/>
    </g>

    <!-- smooth Gaussian core sphere (free theory, n→∞): clean concentric rings -->
    <circle cx="0" cy="0" r="76" fill="var(--secondary-color)" opacity="0.14"/>
    <circle cx="0" cy="0" r="76" fill="none" stroke="var(--secondary-color)" stroke-width="2" opacity="0.8"/>
    <circle cx="0" cy="0" r="54" fill="none" stroke="var(--secondary-color)" stroke-width="2" opacity="0.55"/>
    <circle cx="0" cy="0" r="32" fill="none" stroke="var(--secondary-color)" stroke-width="2" opacity="0.4"/>
    <circle cx="0" cy="0" r="12" fill="var(--secondary-color)" opacity="0.6"/>

    <!-- a few neural nodes/edges inside, hinting "network" -->
    <g stroke="currentColor" stroke-width="1.5" opacity="0.5">
      <line x1="-40" y1="-24" x2="0" y2="0"/>
      <line x1="0" y1="0" x2="42" y2="-18"/>
      <line x1="-30" y1="30" x2="0" y2="0"/>
      <line x1="0" y1="0" x2="34" y2="34"/>
    </g>
    <g fill="currentColor" opacity="0.7">
      <rect x="-44" y="-28" width="8" height="8"/>
      <rect x="38" y="-22" width="8" height="8"/>
      <rect x="-34" y="26" width="8" height="8"/>
      <rect x="30" y="30" width="8" height="8"/>
      <rect x="-4" y="-4" width="8" height="8"/>
    </g>
  </g>

  <!-- ===== labels (simple math notation as plain SVG text) ===== -->
  <text x="440" y="40" text-anchor="middle" font-size="20" font-weight="700" fill="var(--secondary-color)">n → ∞</text>
  <text x="440" y="58" text-anchor="middle" font-size="12" fill="var(--text-light)">매끈한 가우시안 핵</text>

  <text x="565" y="92" text-anchor="middle" font-size="20" font-weight="700" fill="var(--accent-color)">+ 1/n</text>
  <text x="565" y="110" text-anchor="middle" font-size="12" fill="var(--text-light)">보정 껍질</text>

  <text x="150" y="240" text-anchor="middle" font-size="12" fill="var(--text-light)">유효 이론 렌즈</text>
</svg>
<figcaption>유효 이론의 렌즈로 신경망 보기 — 폭 n→∞의 매끈한 가우시안 핵(자유 이론, 풀 수 있음) 위에 1/n 두께의 보정 껍질(상호작용·표현 학습이 사는 층)이 덧입혀진다.</figcaption>
</figure>

## 원문 정보

> - **제목**: The Principles of Deep Learning Theory: An Effective Theory Approach to Understanding Neural Networks
> - **저자**: Daniel A. Roberts, Sho Yaida, Boris Hanin
> - **소속**: Daniel A. Roberts — 이론물리학 배경의 연구자(MIT 이론물리센터 등에서 활동), Sho Yaida — Meta AI(FAIR) 소속 연구자, Boris Hanin — Princeton University(ORFE) 교수
> - **발표**: 2021년 (arXiv 최초 게재 2021-06), 이후 Cambridge University Press 단행본으로 출간(2022)
> - **arXiv ID**: 2106.10165
> - **주제 분류**: cs.LG(Machine Learning) 중심, stat.ML 교차
> - **원문 링크**: <https://arxiv.org/abs/2106.10165> · 책 사이트 <https://deeplearningtheory.com>

물리학에서 출발한 저자들이 "왜 깊은 신경망이 작동하는가"를 **물리학의 유효 이론 방법론**으로 처음부터 끝까지 전개한, 교과서 분량의 이론 작업이다. AI를 *만드는 실무*나 *산업 논의*가 아니라 **딥러닝의 수학적 기초 원리**를 다루므로, Articles의 새 sub-category인 `ML-Theory`로 분류했다.

## 한 줄 요약 (TL;DR)

신경망을 "이상화된 무한폭 모델 + 작은 보정"으로 보자는 책이다. 폭(width) $n$이 무한대인 한계에서 신경망의 출력 분포는 **가우시안(자유 이론)**으로 정확히 풀리고, 현실의 유한폭 신경망은 그 위에 **$1/n$ 차수의 상호작용 보정**을 더한 것으로 체계적으로 전개된다. 이 "거의 가우시안(nearly-Gaussian)" 전개 안에서 비로소 **깊이(depth)에 따른 동역학과 표현 학습**이 살아나며, 이것이 물리학의 **유효 이론(effective theory)** 그대로의 사고법이라는 것이 책의 중심 주장이다.

### 한눈에 보기

```mermaid
flowchart LR
    A["① 실제 유한폭 신경망<br/>(폭 n이 유한)"] -->|"폭 n → ∞<br/>한계로 보내면"| B["② 가우시안 한계<br/>(자유 이론)<br/>풀 수 있으나<br/>표현 학습 없음"]
    B -->|"1/n 보정을<br/>켜면"| C["③ 상호작용·깊이 동역학 복원<br/>(거의 가우시안)<br/>뉴런 간 의존성 · NTK 변화"]
    C -->|"전개를<br/>지배하는 변수"| D["④ depth/width 비율 r<br/>이 유효 전개를 좌우"]
    D -->|"이론적 근거를<br/>제공"| E["⑤ 실무 함의<br/>초기화 · 하이퍼파라미터 · 깊이"]
```


## 왜 이 글을 골랐나

대부분의 딥러닝 자료는 "어떻게 쓰는가"를 가르친다. 이 책은 드물게 **"왜 그렇게 되는가"를 1부터 유도**한다. LLM과 에이전트를 다루는 글들([그것들은 가중치로 만들어졌다](/2026/06/19/made-out-of-weights.html))이 "신경망은 결국 가중치 더미"라는 *현상*을 이야기한다면, 이 책은 그 가중치 더미가 학습 중에 **어떤 통계적 법칙을 따르는지**를 푼다. AI를 도구로 소비하는 시대일수록, 그 도구의 바닥에 깔린 수학을 한 번쯤 들여다볼 가치가 있다고 보아 이 위키의 새 영역(`ML-Theory`)의 첫 글로 골랐다.

또 하나의 이유는 **방법론**이다. 이 책은 물리학자가 복잡계를 다루는 표준 무기 — 섭동 전개(perturbation expansion), 유효 이론, 평균과 요동(fluctuation)의 분리 — 를 신경망에 그대로 가져온다. 다른 분야의 성숙한 사고법을 새 문제에 이식하는 좋은 사례라서, 이론을 직접 전공하지 않는 엔지니어가 읽어도 얻을 게 있다.

## 핵심 내용

> 아래는 이 작업의 **핵심 골자**를 정리한 것이다. 구체적인 유도·수식·정리는 원문과 책 사이트를 참고하기 바란다.

### 출발점: 신경망을 '유효 이론'으로 본다

물리학의 **유효 이론**은 "모든 미시 세부를 다 풀지 말고, 관심 있는 척도(scale)에서 중요한 자유도만 남겨 근사하라"는 전략이다. 책은 신경망의 출력을 이런 유효 이론의 대상으로 놓는다. 즉 수백만 개 파라미터의 정확한 값을 추적하는 대신, **랜덤 초기화에서 출력이 따르는 확률 분포**를 통계적으로 기술한다.

### 무한폭 한계: 가우시안(자유 이론)

각 층의 폭 $n$을 무한대로 보내면, 적절한 가정 아래 신경망의 출력은 **가우시안 과정(Gaussian process)** 으로 수렴한다. 이는 물리학으로 치면 상호작용이 없는 **자유 이론(free theory)** 에 해당한다. 깨끗하게 풀리지만, 바로 그 깨끗함 때문에 **표현 학습이 일어나지 않는다** — 무한폭 한계의 신경망은 본질적으로 고정된 커널을 쓰는 선형 모델처럼 행동한다(이 지점이 NTK·gaussian process 한계 논의와 맞닿는다).

### 유한폭 보정: 1/n 전개로 '상호작용'을 켠다

현실의 신경망은 폭이 유한하다. 책의 핵심 기여는 유한폭을 **$1/n$에 대한 섭동 전개**로 체계적으로 다루는 것이다. 무한폭의 가우시안 위에 $1/n$ 차수의 **비가우시안 보정(상호작용)** 을 더하면, 뉴런들 사이의 통계적 의존성과 **깊이에 따른 동역학**이 비로소 나타난다. 저자들은 이를 "거의 가우시안(nearly-Gaussian)" 분포로 부르며, 물리학의 상호작용 이론을 다루는 방식과 정확히 평행하다.

### 깊이/폭 비율이 핵심 변수

이 전개에서 단순히 폭만이 아니라 **깊이와 폭의 비율(depth-to-width ratio)** 이 유효 전개의 행동을 지배하는 변수로 등장한다. 이 비율이 너무 크면 보정 항들이 커져 전개가 통제 불능이 되고(신호 전파가 폭주/소멸), 적절한 영역에 있어야 깊은 망이 안정적으로 학습된다. 이는 **초기화 스케일·하이퍼파라미터 선택**이 왜 그렇게 민감한지에 대한 이론적 설명을 제공한다.

### 학습 동역학과 NTK, 그리고 표현 학습

책은 초기화 시점의 분포에서 멈추지 않고 **gradient descent 학습 동역학**까지 같은 틀로 이어간다. 무한폭에서의 NTK(Neural Tangent Kernel) 그림과, 유한폭에서 NTK가 학습 중에 **변하는(표현이 실제로 학습되는)** 정도를 $1/n$ 보정으로 포착하려는 것이 큰 줄기다. 즉 "왜 유한폭 신경망이 단순한 커널 기계를 넘어 진짜로 *특징을 학습*하는가"를 이론 안에서 설명하려는 시도다.

## 분석과 인사이트

여기서부터는 **원문 요약이 아니라 내 관점**이다.

**1) "이상화 + 보정"은 강력하지만, 보정이 작아야 성립한다.** 이 책의 아름다움은 무한폭의 풀 수 있는 모델을 기준점으로 삼고 현실을 그 주변의 작은 흔들림으로 본다는 데 있다. 다만 섭동 전개의 숙명상 **보정 항이 작을 때만** 유효하다. 깊이/폭 비율이 큰 영역, 즉 *매우 깊고 좁은* 현대적 구조의 일부에서는 이 전개가 자연스럽게 깨질 수 있고, 그 경계 자체가 흥미로운 정보다. 이론은 "어디까지 내 그림이 통하는가"를 스스로 말해 준다는 점에서 정직하다.

**2) 무한폭의 깔끔함은 곧 무한폭의 한계다.** 무한폭에서 표현 학습이 사라진다는 사실은, **실무에서 우리가 신경망을 쓰는 이유(특징을 학습한다) 자체가 '유한폭 효과'** 라는 뜻이다. 이는 직관과 반대로 들린다 — 보통 우리는 "더 크면 더 좋다"고 생각하지만, 이론은 "무한히 넓히면 오히려 단순한 커널 기계로 퇴화한다"고 말한다. 스케일을 키우는 일과 표현을 학습하는 일이 단순 비례가 아니라는 점은, 대형 모델 시대에 곱씹을 만한 긴장이다.

**3) 물리학 방법론의 이식 사례로서의 가치.** 이 작업의 진짜 메시지는 어쩌면 특정 정리보다 **"성숙한 분야의 사고 도구를 새 문제로 옮기면 멀리 간다"** 는 데 있다. 섭동 전개·유효 이론은 물리학에서 수십 년 검증된 무기다. 그것을 신경망에 적용해 *닫힌 형태에 가까운* 설명을 끌어낸 것은, 분야 간 이식의 좋은 본보기다. 엔지니어에게 주는 메타 교훈: 막힌 문제를 만나면, 인접 분야가 같은 구조의 문제를 어떻게 풀었는지 보라.

**4) 한계도 분명하다.** 이 이론은 주로 MLP(다층 퍼셉트론) 류의 구조와 초기화/초기 학습 영역에 강하고, 책 자체가 **완전히 학습된 현대 대형 Transformer의 실제 행동을 통째로 설명하지는 못한다.** 이론과 SOTA 사이에는 여전히 간극이 있다. 그럼에도 "엔지니어링 휴리스틱(이 초기화, 이 학습률, 이 깊이가 잘 되더라)"에 **원리적 근거**를 부여하려는 방향 자체가 분야에 필요한 작업이다.

## 적용 포인트

- **초기화·정규화를 '주술'이 아니라 '신호 전파'로 이해하라.** 가중치 초기화 스케일이 깊은 망에서 왜 민감한지는, 층을 따라 신호의 평균·분산이 어떻게 전파되는가의 문제다. 이 관점을 알면 초기화/정규화 선택이 덜 임의적으로 느껴진다.
- **'더 넓게'와 '특징을 더 잘 학습'을 동일시하지 마라.** 폭을 키우는 것이 항상 더 풍부한 표현 학습을 뜻하지는 않는다(무한폭 한계의 교훈). 폭·깊이·데이터·학습률을 함께 보는 습관을 들이자.
- **깊이와 폭을 함께 튜닝하라.** 깊이/폭 비율이 안정성에 영향을 준다는 직관을, 매우 깊거나 매우 좁은 구조를 설계할 때 점검 항목으로 삼자.
- **인접 분야의 사고법을 빌려라.** 풀리지 않는 실무 문제에, "어떤 이상화된 한계에서는 풀리는가? 거기서 작은 보정으로 현실에 다가갈 수 있는가?"라는 유효 이론식 질문을 던져 보자.
- **이론서 한 권을 천천히 읽는 투자.** 도구 사용법은 빨리 낡지만, 바닥 원리는 오래 간다. LLM 활용 글들과 함께 이런 기초 한 권을 곁들이면 균형이 잡힌다.

## 마무리

The Principles of Deep Learning Theory는 "딥러닝이 왜 되는가"를 물리학자의 방식 — 풀 수 있는 이상화(무한폭 가우시안)에서 출발해, $1/n$ 보정으로 현실의 깊이·표현 학습을 복원하는 유효 이론 — 으로 끝까지 밀어붙인 보기 드문 작업이다. 모든 현대 모델을 설명하는 만능 열쇠는 아니지만, 엔지니어링 직관에 원리적 토대를 깔아 주고, 무엇보다 **"잘 검증된 사고 도구를 새 문제로 옮긴다"** 는 메타 교훈을 준다. 도구 소비에 치우치기 쉬운 시대에, 바닥을 한 번 들여다보게 하는 책이다. 정확한 수식·정리·전개는 <https://arxiv.org/abs/2106.10165> 와 <https://deeplearningtheory.com> 에서 직접 확인하기를 권한다.

<figure class="post-figure">
<svg role="img" aria-label="깊이/폭 비율 r에 대한 1차원 상 다이어그램: r이 작은 왼쪽은 보정이 작아 안정적으로 학습되는 영역, 임계점을 넘은 오른쪽은 1/n 보정 항이 커져 전개가 통제 불능이 되고 신호가 폭발·소멸하는 영역이다." viewBox="0 0 640 220" width="640" height="220" preserveAspectRatio="xMidYMid meet" style="font-family:var(--font-body)">
  <title>깊이/폭 비율 r의 상(phase) 다이어그램</title>

  <!-- region fills (token colors, low opacity so both themes read) -->
  <rect x="56" y="70" width="288" height="44" fill="var(--secondary-color)" opacity="0.16"/>
  <rect x="344" y="70" width="240" height="44" fill="var(--accent-color)" opacity="0.18"/>

  <!-- the axis band outline -->
  <rect x="56" y="70" width="528" height="44" fill="none" stroke="currentColor" stroke-width="2" opacity="0.55"/>

  <!-- critical boundary -->
  <line x1="344" y1="58" x2="344" y2="126" stroke="var(--accent-color)" stroke-width="3" stroke-dasharray="5 4"/>
  <text x="344" y="48" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent-color)">임계 비율</text>

  <!-- axis arrow -->
  <line x1="56" y1="150" x2="600" y2="150" stroke="currentColor" stroke-width="2" opacity="0.7"/>
  <path d="M600 150 l-10 -5 l0 10 z" fill="currentColor" opacity="0.7"/>
  <text x="40" y="155" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">r</text>
  <text x="606" y="172" text-anchor="end" font-size="11" fill="var(--text-light)">depth / width 비율 r 증가 →</text>

  <!-- tick: small r -->
  <text x="80" y="172" text-anchor="middle" font-size="11" fill="var(--text-light)">r 작음</text>

  <!-- ===== LEFT: stable region — a clean, steady signal wave ===== -->
  <polyline points="72,92 96,84 120,100 144,84 168,100 192,84 216,100 240,84 264,100 288,84 312,96"
            fill="none" stroke="var(--secondary-color)" stroke-width="2.5"/>
  <text x="200" y="138" text-anchor="middle" font-size="13" font-weight="700" fill="var(--secondary-color)">안정 학습 영역</text>

  <!-- ===== RIGHT: blow-up / vanish — signal exploding & dying ===== -->
  <polyline points="360,92 384,80 408,104 432,72 456,114 480,64 504,120 528,58 552,122 576,72"
            fill="none" stroke="var(--accent-color)" stroke-width="2.5"/>
  <text x="464" y="138" text-anchor="middle" font-size="13" font-weight="700" fill="var(--accent-color)">보정 폭주 · 신호 폭발/소멸</text>

  <!-- header labels -->
  <text x="200" y="30" text-anchor="middle" font-size="13" fill="var(--text-light)">1/n 보정이 작음 → 통제됨</text>
  <text x="464" y="30" text-anchor="middle" font-size="13" fill="var(--text-light)">1/n 보정이 커짐 → 전개 붕괴</text>
</svg>
<figcaption>깊이/폭 비율 r의 상(phase) 다이어그램 — r이 작으면 1/n 보정이 작아 신호가 안정적으로 전파되며 깊은 망이 학습되지만, 임계 비율을 넘으면 보정 항이 커져 전개가 통제 불능이 되고 신호가 폭발하거나 소멸한다.</figcaption>
</figure>

### 더 읽어보기

- [원문 — The Principles of Deep Learning Theory (arXiv:2106.10165)](https://arxiv.org/abs/2106.10165) — Roberts·Yaida·Hanin, 유효 이론으로 본 신경망
- [책 공식 사이트 — deeplearningtheory.com](https://deeplearningtheory.com) — Cambridge University Press 단행본 안내
- [그것들은 가중치로 만들어졌다 (Max Leiter)](/2026/06/19/made-out-of-weights.html) — "신경망은 결국 가중치 더미"라는 현상을, 이 책은 그 가중치의 통계 법칙으로 본다
- [The Untrainable (Sarah Guo)](/2026/06/23/the-untrainable.html) — 학습 가능/불가능의 경계를 산업 관점에서; 이 책은 '학습'을 수학 동역학으로 본다
- [Loop Engineering (Addy Osmani)](/2026/06/19/loop-engineering.html) — AI를 *쓰는* 실무의 대척점에서, AI의 *바닥 원리*를 다루는 글로 짝지어 읽기
