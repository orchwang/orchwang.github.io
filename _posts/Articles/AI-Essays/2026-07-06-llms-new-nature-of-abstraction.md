---
layout: post
title: "위로가 아니라 옆으로 — LLM이 가져온 새로운 추상화의 본질 (Martin Fowler)"
date: 2026-07-06
categories: [Articles, AI-Essays]
tags: [articles, ai, llm, abstraction, non-determinism]
published: true
excerpt: "Martin Fowler의 'LLMs bring new nature of abstraction'(2025-06-24)을 정리·분석한다. assembler에서 고급 언어로의 도약처럼 LLM도 추상화의 층을 올리지만, 이번엔 '위로'만이 아니라 '옆으로' — 비결정성(non-determinism)으로 — 움직인다는 관찰을 통해 프로그래밍의 수준이 아니라 본질이 바뀌는 지점을 개발자 관점에서 짚는다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="추상화라는 수직 사다리(아래 assembler·중간 Fortran·위 Ruby)를 오른 오크가, 사다리 꼭대기에서 옆으로 발을 내밀어 안개 낀 '비결정성' 평면으로 첫발을 딛는 장면. 위로 향하는 초록 화살표 옆에서, 옆으로 향하는 붉은 화살표가 새로 갈라진다." viewBox="0 0 640 330" xmlns="http://www.w3.org/2000/svg">
  <title>위로 오르던 여정이 옆으로 갈라지는 순간</title>

  <!-- ── 비결정성 안개 평면 (오른쪽) ── -->
  <g fill="currentColor" opacity="0.06">
    <ellipse cx="440" cy="140" rx="96" ry="52"/>
    <ellipse cx="522" cy="172" rx="88" ry="52"/>
    <ellipse cx="384" cy="184" rx="72" ry="46"/>
    <ellipse cx="486" cy="212" rx="94" ry="44"/>
  </g>
  <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 7" opacity="0.35">
    <ellipse cx="440" cy="140" rx="96" ry="52"/>
    <ellipse cx="522" cy="172" rx="88" ry="52"/>
    <ellipse cx="384" cy="184" rx="72" ry="46"/>
    <ellipse cx="486" cy="212" rx="94" ry="44"/>
  </g>
  <g fill="var(--accent-color)" opacity="0.5" font-family="var(--font-body)" font-size="17" font-weight="700" text-anchor="middle">
    <text x="392" y="130">?</text>
    <text x="560" y="150">?</text>
    <text x="540" y="238">?</text>
    <text x="412" y="246">?</text>
  </g>
  <text x="468" y="170" text-anchor="middle" font-family="var(--font-body)" font-size="20" font-weight="700" fill="var(--accent-color)">비결정성</text>
  <text x="468" y="191" text-anchor="middle" font-family="var(--font-body)" font-size="12.5" fill="var(--text-light)">non-determinism</text>
  <text x="468" y="234" text-anchor="middle" font-family="var(--font-body)" font-size="13" fill="var(--text-light)">같은 프롬프트 → 다른 출력</text>

  <!-- ── 추상화 사다리 (왼쪽) ── -->
  <g stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.85">
    <line x1="154" y1="140" x2="154" y2="298"/>
    <line x1="190" y1="140" x2="190" y2="298"/>
    <line x1="154" y1="150" x2="190" y2="150"/>
    <line x1="154" y1="192" x2="190" y2="192"/>
    <line x1="154" y1="234" x2="190" y2="234"/>
    <line x1="154" y1="276" x2="190" y2="276"/>
  </g>
  <g font-family="var(--font-body)" font-size="13" fill="var(--text-light)" text-anchor="end">
    <text x="136" y="155">Ruby</text>
    <text x="136" y="239">Fortran</text>
    <text x="136" y="281">assembler</text>
  </g>
  <!-- 여태 오른 길: 초록 화살표(위로) -->
  <line x1="145" y1="290" x2="145" y2="156" stroke="var(--secondary-color)" stroke-width="3" stroke-linecap="round"/>
  <path d="M139 166 L145 154 L151 166" fill="none" stroke="var(--secondary-color)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="100" y="140" text-anchor="middle" font-family="var(--font-body)" font-size="13" font-weight="700" fill="var(--secondary-color)">위로 (up)</text>

  <!-- ── 오크: 꼭대기 rung에서 옆으로 스텝 ── -->
  <g stroke="var(--orc-green)" stroke-width="9" stroke-linecap="round" fill="none">
    <line x1="196" y1="140" x2="172" y2="152"/>
    <line x1="196" y1="140" x2="266" y2="162"/>
    <line x1="198" y1="114" x2="176" y2="136"/>
    <line x1="200" y1="114" x2="272" y2="120"/>
  </g>
  <rect x="184" y="106" width="30" height="34" rx="7" fill="var(--orc-green)"/>
  <rect x="180" y="72" width="44" height="38" rx="9" fill="var(--orc-green)"/>
  <rect x="196" y="59" width="13" height="14" rx="2" fill="currentColor"/>
  <line x1="186" y1="86" x2="218" y2="82" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  <circle cx="196" cy="93" r="2.6" fill="var(--accent-color)"/>
  <circle cx="210" cy="92" r="2.6" fill="var(--accent-color)"/>
  <path d="M189 113 L193 100 L197 113 Z" fill="currentColor"/>
  <path d="M207 113 L211 100 L215 113 Z" fill="currentColor"/>

  <!-- ── 옆으로: 붉은 화살표 (사다리를 벗어나 안개로) ── -->
  <line x1="270" y1="150" x2="392" y2="150" stroke="var(--accent-color)" stroke-width="5" stroke-linecap="round"/>
  <path d="M382 142 L398 150 L382 158" fill="none" stroke="var(--accent-color)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="330" y="138" text-anchor="middle" font-family="var(--font-body)" font-size="14" font-weight="700" fill="var(--accent-color)">옆으로 (sideways)</text>
</svg>
<figcaption>추상화 사다리를 assembler에서 Ruby까지 착실히 '위로' 올라온 오크가, 꼭대기에서 처음으로 '옆으로' — 안개 낀 비결정성 평면으로 — 발을 내민다. 다음 칸을 오르는 게 아니라, 새 축으로 첫발을 딛는 순간.</figcaption>
</figure>

## 원문 정보

> - **제목**: LLMs bring new nature of abstraction
> - **출처**: Martin Fowler ([martinfowler.com](https://martinfowler.com/articles/2025-nature-abstraction.html))
> - **발행**: 2025-06-24 · 약 5~7분 분량, 소제목 없이 한 편의 짧은 에세이
> - **원문 링크**: <https://martinfowler.com/articles/2025-nature-abstraction.html>

이 위키에는 이미 Fowler의 fragment를 다룬 글이 여럿 있는데, 이건 그 짧은 메모들과 달리 **하나의 관찰을 끝까지 밀고 나가는 독립 에세이**다. LLM이 프로그래밍에 무엇을 하는지에 대한, 이 위키가 반복해 온 질문에 Fowler가 가장 압축적으로 답한 글이라 Articles에 담는다.

## 한 줄 요약 (TL;DR)

assembler에서 고급 언어로의 도약이 추상화의 층을 **위로** 올렸다면, LLM은 그 층을 올리는 동시에 **옆으로** — 결정론(determinism)에서 비결정성(non-determinism)으로 — 움직인다. 그래서 LLM은 단순히 더 높은 추상화가 아니라 프로그래밍의 **본질(nature)** 자체를 바꾸는 사건이며, "코드를 git에 넣으면 언제나 같은 결과가 나온다"는 우리 직업의 오래된 전제가 처음으로 흔들린다.

<figure class="post-figure">
<svg role="img" aria-label="추상화(세로축)와 비결정성(가로축)의 2차원 평면. 왼쪽 결정론 영역에서 assembler→Fortran→Ruby로 초록 화살표가 곧장 위로 오른 뒤, Ruby에서 붉은 화살표가 오른쪽 비결정성 영역의 'LLM' 지점으로 옆으로 이동한다." viewBox="0 0 640 430" xmlns="http://www.w3.org/2000/svg">
  <title>추상화 × 비결정성 — 위로 오르다 옆으로 이동하는 2차원 평면</title>

  <!-- 영역 배경 tint -->
  <rect x="95" y="58" width="250" height="312" fill="var(--secondary-color)" opacity="0.07"/>
  <rect x="345" y="58" width="256" height="312" fill="currentColor" opacity="0.05"/>

  <!-- 축 -->
  <path d="M95 46 L95 370 L608 370" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>
  <path d="M88 60 L95 46 L102 60" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  <path d="M594 363 L608 370 L594 377" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  <text x="60" y="214" text-anchor="middle" font-family="var(--font-body)" font-size="14" font-weight="700" fill="var(--text-light)" transform="rotate(-90 60 214)">추상화 수준 (abstraction)</text>
  <text x="352" y="404" text-anchor="middle" font-family="var(--font-body)" font-size="14" font-weight="700" fill="var(--text-light)">비결정성 (non-determinism) →</text>

  <!-- 결정론 / 비결정성 구분선 -->
  <line x1="345" y1="58" x2="345" y2="370" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 7" opacity="0.5"/>

  <!-- 영역 라벨 -->
  <text x="210" y="86" text-anchor="middle" font-family="var(--font-body)" font-size="15" font-weight="700" fill="var(--secondary-color)">결정론 (determinism)</text>
  <text x="210" y="106" text-anchor="middle" font-family="var(--font-body)" font-size="12.5" fill="var(--text-light)">컴파일 100번 = 같은 버그</text>
  <text x="475" y="86" text-anchor="middle" font-family="var(--font-body)" font-size="15" font-weight="700" fill="var(--accent-color)">비결정성 (non-determinism)</text>
  <text x="475" y="106" text-anchor="middle" font-family="var(--font-body)" font-size="12.5" fill="var(--text-light)">같은 프롬프트 = 다른 출력</text>

  <!-- 여태 오른 길: assembler→Fortran→Ruby (초록, 위로) -->
  <line x1="170" y1="336" x2="170" y2="164" stroke="var(--secondary-color)" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M162 176 L170 162 L178 176" fill="none" stroke="var(--secondary-color)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <g fill="var(--secondary-color)" stroke="var(--bg-panel)" stroke-width="2">
    <circle cx="170" cy="330" r="6.5"/>
    <circle cx="170" cy="250" r="6.5"/>
    <circle cx="170" cy="162" r="6.5"/>
  </g>
  <g font-family="var(--font-body)" font-size="13" fill="var(--text-color)" text-anchor="start">
    <text x="186" y="335">assembler</text>
    <text x="186" y="255">Fortran</text>
    <text x="186" y="158">Ruby</text>
  </g>

  <!-- LLM: 옆으로 이동 (붉은 화살표) -->
  <line x1="178" y1="160" x2="452" y2="152" stroke="var(--accent-color)" stroke-width="4" stroke-linecap="round"/>
  <path d="M440 143 L456 152 L440 161" fill="none" stroke="var(--accent-color)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="300" y="138" text-anchor="middle" font-family="var(--font-body)" font-size="13.5" font-weight="700" fill="var(--accent-color)">옆으로 (sideways)</text>
  <circle cx="470" cy="150" r="9" fill="none" stroke="var(--accent-color)" stroke-width="3"/>
  <circle cx="470" cy="150" r="3.5" fill="var(--accent-color)"/>
  <text x="470" y="185" text-anchor="middle" font-family="var(--font-body)" font-size="15" font-weight="700" fill="var(--accent-color)">LLM</text>
  <text x="470" y="205" text-anchor="middle" font-family="var(--font-body)" font-size="12" fill="var(--text-light)">처음 보는 평면 위 한 점</text>
</svg>
<figcaption>여태 추상화는 '위로'만 올랐다 — assembler에서 Ruby까지, 모두 결정론(왼쪽) 안에서. LLM은 같은 도약 크기로 '옆으로', 비결정성(오른쪽)으로 움직인다. 그래서 사다리의 다음 칸이 아니라, 처음 보는 평면 위의 한 점이다.</figcaption>
</figure>

## 왜 이 글을 골랐나

"LLM은 그냥 더 높은 프로그래밍 언어일 뿐"이라는 비유는 흔하다. Fowler는 그 비유가 **절반만 맞다**고 짚는다. 추상화의 도약이라는 점에서는 맞지만, 지금까지의 모든 도약이 지켜 온 한 가지 — **결정론** — 을 LLM이 깨뜨린다는 점에서 틀리다. 이 한 끗의 차이가 왜 vibe coding, 검증 비용, 재현성 같은 최근의 모든 논의가 예전과 다르게 느껴지는지를 설명한다. 짧지만, 이 위키가 흩어서 다뤄 온 주제들을 관통하는 **좌표축 하나**를 제시하는 글이다.

## 핵심 내용

원문은 소제목 없이 흐르는 한 편의 에세이다. 아래는 그 논지를 흐름대로 정리한 것이다.

### 추상화의 역사: 결이 바뀌지 않은 도약들

Fowler는 자기 이력에서 출발한다. 그의 첫 직업 프로그래밍은 **Fortran IV**였고, ELSE 절이 없어 조건 분기를 우회해야 했으며 정수 변수 이름은 I~N으로 시작해야 하는 관습이 있었다. 그 뒤로 언어는 블록 구조·명명 변수·고수준 제어문을 얻으며 계속 진화해 Ruby 같은 오늘날의 언어에 이르렀다.

그런데 Fowler가 강조하는 건, 이 긴 여정에서 **결(ambiance)은 바뀌지 않았다**는 점이다. assembler에서 Fortran으로, 다시 Ruby로 오면서 우리는 기계의 명령어 집합에서 점점 멀어져 "문장의 시퀀스, 대안을 고르는 조건문, 반복" 같은 더 높은 개념으로 사고했다. 하지만 Ruby로 코드를 짜는 지금도 "여전히 비슷한 방식으로 기계에게 말하고 있다"고 그는 말한다. 각 단계는 **더 쉽고 더 또렷해졌을 뿐**, 프로그래밍의 성질 자체를 바꾸는 근본적 변화는 아니었다.

### 비결정성이라는 새 좌표축

여기서 핵심 논지가 등장한다. 지금까지의 모든 추상화 도약이 공유한 전제는 **결정론**이다. Fowler의 표현을 빌리면:

> "내가 Fortran 함수를 하나 짜서 백 번 컴파일해도, 결과는 언제나 똑같은 버그를 그대로 드러냈다."

LLM은 이 보장을 깨뜨린다. 같은 프롬프트를 넣어도 매번 다른 출력이 나온다. 그래서 그는 프롬프트로 기계에게 말하는 일이 **"Fortran이 assembler와 다른 만큼 Ruby와도 다르다"**고 본다. 도약의 크기는 assembler→고급 언어에 견줄 만하지만, 방향이 다르다. 동료 **Birgitta Böckeler**의 프레임을 인용해 이를 이렇게 요약한다:

> "우리는 추상화의 층을 **위로(up)** 올라가고 있는 것만이 아니라, **옆으로(sideways)** 비결정성 속으로 움직이고 있다."

추상화가 여태 1차원(위로)이었다면, LLM은 거기에 두 번째 축(옆으로)을 더해 2차원으로 만든다. Fowler는 이 비결정성의 진화가 **"우리 직업의 역사에서 전례 없는 일"**이라고 못 박는다.

### 재현성이라는 오래된 전제가 흔들린다

이 '옆으로의 이동'이 실무에서 가장 먼저 부딪히는 벽이 **재현성**이다. 지금까지 우리는 코드를 버전 관리에 넣어 두면 언제 누가 실행해도 같은 동작을 얻는다는 전제 위에서 일해 왔다. Fowler는 이제 **"프롬프트를 git에 저장해 둔다고 매번 같은 동작을 얻으리라 장담할 수 없다"**고 지적한다. 코드가 신뢰할 수 있고 반복 가능한 산출물이라는, 현대 개발 관행의 밑바닥에 깔린 가정이 흔들리는 것이다. 그는 이 관찰이 자기 혼자의 것이 아니라 동료들의 gen-ai 탐험 기록에서 함께 길어 올린 것임을 밝힌다.

<figure class="post-figure">
<svg role="img" aria-label="결정성이 깨지는 지점 비교. 왼쪽: 같은 Fortran 함수를 100번 컴파일해도 세 번 모두 똑같은 출력(같은 버그)이 나오고 git 재현이 성립(✓). 오른쪽: 같은 프롬프트를 세 번 실행하면 삼각형·원·사각형처럼 매번 다른 출력이 나오고 git 재현이 깨진다(✗)." viewBox="0 0 640 290" xmlns="http://www.w3.org/2000/svg">
  <title>같은 입력, 그러나 — 결정론(Fortran)과 비결정성(프롬프트)의 재현성 대비</title>

  <!-- 가운데 구분선 -->
  <line x1="320" y1="26" x2="320" y2="272" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 7" opacity="0.45"/>

  <!-- ══ 왼쪽: Fortran = 결정론 ══ -->
  <text x="165" y="34" text-anchor="middle" font-family="var(--font-body)" font-size="16" font-weight="700" fill="var(--secondary-color)">Fortran 함수</text>
  <rect x="52" y="48" width="226" height="34" rx="6" fill="var(--secondary-color)" opacity="0.06"/>
  <rect x="52" y="48" width="226" height="34" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
  <text x="165" y="70" text-anchor="middle" font-family="var(--font-body)" font-size="12.5" fill="var(--text-color)">같은 함수 · 컴파일 ×100</text>
  <line x1="165" y1="86" x2="165" y2="112" stroke="currentColor" stroke-width="2" opacity="0.55"/>
  <path d="M159 104 L165 114 L171 104" fill="none" stroke="currentColor" stroke-width="2" opacity="0.55" stroke-linejoin="round"/>

  <!-- 세 번 실행 = 똑같은 출력 (같은 버그): 초록 프레임 + 붉은 ✕, 셋 다 동일 -->
  <rect x="82" y="120" width="46" height="46" rx="7" fill="none" stroke="var(--secondary-color)" stroke-width="2.5"/>
  <path d="M92 130 L118 156 M118 130 L92 156" fill="none" stroke="var(--accent-color)" stroke-width="3" stroke-linecap="round"/>
  <rect x="142" y="120" width="46" height="46" rx="7" fill="none" stroke="var(--secondary-color)" stroke-width="2.5"/>
  <path d="M152 130 L178 156 M178 130 L152 156" fill="none" stroke="var(--accent-color)" stroke-width="3" stroke-linecap="round"/>
  <rect x="202" y="120" width="46" height="46" rx="7" fill="none" stroke="var(--secondary-color)" stroke-width="2.5"/>
  <path d="M212 130 L238 156 M238 130 L212 156" fill="none" stroke="var(--accent-color)" stroke-width="3" stroke-linecap="round"/>
  <g font-family="var(--font-body)" font-size="10.5" fill="var(--text-light)" text-anchor="middle">
    <text x="105" y="182">실행 1</text>
    <text x="165" y="182">실행 2</text>
    <text x="225" y="182">실행 3</text>
  </g>
  <text x="165" y="212" text-anchor="middle" font-family="var(--font-body)" font-size="13" font-weight="700" fill="var(--text-color)">언제나 똑같은 출력 — 같은 버그 그대로</text>
  <rect x="98" y="230" width="134" height="30" rx="6" fill="var(--secondary-color)" opacity="0.1"/>
  <rect x="98" y="230" width="134" height="30" rx="6" fill="none" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="165" y="250" text-anchor="middle" font-family="var(--font-body)" font-size="13" font-weight="700" fill="var(--secondary-color)">git 재현 ✓</text>

  <!-- ══ 오른쪽: LLM 프롬프트 = 비결정성 ══ -->
  <text x="475" y="34" text-anchor="middle" font-family="var(--font-body)" font-size="16" font-weight="700" fill="var(--accent-color)">LLM 프롬프트</text>
  <rect x="362" y="48" width="226" height="34" rx="6" fill="currentColor" opacity="0.04"/>
  <rect x="362" y="48" width="226" height="34" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
  <text x="475" y="70" text-anchor="middle" font-family="var(--font-body)" font-size="12.5" fill="var(--text-color)">같은 프롬프트 · 실행 ×3</text>
  <line x1="475" y1="86" x2="475" y2="112" stroke="currentColor" stroke-width="2" opacity="0.55"/>
  <path d="M469 104 L475 114 L481 104" fill="none" stroke="currentColor" stroke-width="2" opacity="0.55" stroke-linejoin="round"/>

  <!-- 세 번 실행 = 매번 다른 출력: 삼각형·원·사각형 (붉은 프레임) -->
  <rect x="392" y="120" width="46" height="46" rx="7" fill="none" stroke="var(--accent-color)" stroke-width="2.5"/>
  <path d="M415 128 L429 154 L401 154 Z" fill="none" stroke="var(--accent-color)" stroke-width="2.5" stroke-linejoin="round"/>
  <rect x="452" y="120" width="46" height="46" rx="7" fill="none" stroke="var(--accent-color)" stroke-width="2.5"/>
  <circle cx="475" cy="143" r="14" fill="none" stroke="var(--accent-color)" stroke-width="2.5"/>
  <rect x="512" y="120" width="46" height="46" rx="7" fill="none" stroke="var(--accent-color)" stroke-width="2.5"/>
  <rect x="523" y="131" width="24" height="24" rx="2" fill="none" stroke="var(--accent-color)" stroke-width="2.5"/>
  <g font-family="var(--font-body)" font-size="10.5" fill="var(--text-light)" text-anchor="middle">
    <text x="415" y="182">실행 1</text>
    <text x="475" y="182">실행 2</text>
    <text x="535" y="182">실행 3</text>
  </g>
  <text x="475" y="212" text-anchor="middle" font-family="var(--font-body)" font-size="13" font-weight="700" fill="var(--text-color)">매번 다른 출력 — 재현을 장담할 수 없다</text>
  <rect x="408" y="230" width="134" height="30" rx="6" fill="var(--accent-color)" opacity="0.1"/>
  <rect x="408" y="230" width="134" height="30" rx="6" fill="none" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="475" y="250" text-anchor="middle" font-family="var(--font-body)" font-size="13" font-weight="700" fill="var(--accent-color)">git 재현 ✗</text>
</svg>
<figcaption>결정성이 깨지는 바로 그 지점. 같은 Fortran 함수는 100번을 컴파일해도 언제나 같은 출력(같은 버그)을 내놓아, git에 담으면 재현된다. 같은 프롬프트는 실행할 때마다 다른 출력을 내놓아, '코드를 넣어 두면 같은 결과'라는 전제가 처음으로 흔들린다.</figcaption>
</figure>

### 무엇을 잃고 무엇을 얻을지 — 아직 모른다

Fowler는 이 변화의 결과를 단정하지 않는다. 잃을 것과 얻을 것을 **대칭적으로** 열어 둔다:

> "우리가 잃게 될 무언가에 나는 분명 서운해할 것이다. 하지만 우리 중 아직 아무도 잘 이해하지 못한, 얻게 될 무언가도 있을 것이다."

마무리의 어조는 불안보다 **흥미**에 가깝다. 이 전례 없는 비결정성과 "어떻게 함께 살아갈지"를 개발자들이 앞으로 알아내야 한다는, 조심스럽지만 설레는 태도로 글을 닫는다.

## 분석과 인사이트

여기서부터는 원문 요약이 아니라 내 관점이다.

- **이 글의 진짜 기여는 결론이 아니라 '좌표축'이다.** Fowler는 "LLM이 좋다/나쁘다"를 말하지 않는다. 대신 추상화를 **2차원 평면**으로 다시 그린다 — 세로축은 여태 우리가 오르던 추상화 수준, 가로축은 새로 열린 비결정성. 이 한 장의 좌표가 있으면 "LLM은 그냥 더 높은 언어"라는 비유가 왜 어긋나는지 단번에 보인다. 위로만 보면 같은 종류의 도약이지만, 옆으로 보면 완전히 새 영역이다.
- **비결정성은 '버그'가 아니라 '성질'이다.** 여기서 실수하기 쉬운 지점이 있다. 같은 프롬프트가 다른 출력을 내는 걸 우리는 본능적으로 '고쳐야 할 결함'으로 취급한다. 하지만 Fowler의 프레임을 받아들이면, 그건 새 매체의 **본질적 성질**이다. temperature를 0으로 낮춰 억지로 결정론을 흉내 낼 수는 있어도, 그건 assembler 시절의 사고로 새 매체를 다루는 것에 가깝다. 진짜 과제는 비결정성을 *제거*하는 게 아니라 *다루는 법*을 배우는 것이다.
- **"재현성이 깨진다"는 관찰이 최근 담론 전체의 뿌리다.** 왜 요즘 검증 비용, vibe coding의 불편함, 신뢰의 근거 이동 같은 논의가 쏟아지는가. 근본 원인 하나로 수렴한다 — **산출물이 더 이상 결정론적 아티팩트가 아니기 때문**이다. 같은 축을 정확히 반대편에서 다룬 글이 [확률적 엔지니어링과 24-7 직원](/2026/06/25/probabilistic-engineering-and-the-24-7-employee.html)이다. Tim Davis는 소프트웨어가 정확성을 "아는(know)" 결정론에서 "믿는(believe)" 확률론으로 옮겨 간다고 말하는데, 이는 Fowler가 말한 '옆으로의 이동'과 같은 현상을 실무 언어로 옮긴 것이다.
- **Fowler가 열어 둔 '잃을 것'의 목록은 이미 채워지고 있다.** 그가 "서운해할 무언가"를 특정하지 않았지만, 이 위키가 정리해 온 다른 글들이 그 빈칸을 메운다. [바이브 코딩과 에이전틱 엔지니어링](/2026/06/25/vibe-coding-and-agentic-engineering.html)에서 Simon Willison이 고백한 '모든 줄을 리뷰하지 않게 되는' 불편함, [검증이 비싸지는 시대](/2026/06/23/fowler-fragments-verification-cognitive-surrender.html)에서 말한 '인지적 항복'의 위험 — 이것들이 비결정성 축을 건널 때 치르는 구체적 비용이다.
- **추상화 논의로서도 정직하다.** 추상화는 이 직업의 오랜 주제이고, 잘못 세운 추상화가 얼마나 비싼지는 [잘못된 추상화](/2026/06/22/the-wrong-abstraction.html)가 보여 준 바 있다. Fowler의 글이 신선한 건, 추상화의 *품질*이 아니라 추상화의 *종류*가 바뀌었다고 말하기 때문이다. 지금까지 우리가 쌓아 온 추상화 감각(더 높이 올릴수록 좋다)이, 새 축에서는 그대로 통하지 않을 수 있다는 경고로도 읽힌다.
- **어조의 균형이 이 글의 미덕이다.** 과장(모든 게 바뀐다)도 냉소(별것 아니다)도 아니다. "전례 없는 일이지만, 무엇을 잃고 얻을지는 아직 모른다"는 태도야말로 새 매체를 대하는 가장 성숙한 자세다. 단정하지 않으면서도 좌표축은 또렷이 남긴다.

## 적용 포인트

- LLM을 "더 높은 프로그래밍 언어"라고 부르고 싶어질 때, **두 축으로 나눠** 생각한다. 추상화 수준(위로)에서는 맞는 비유지만, 결정론성(옆으로)에서는 완전히 다른 매체임을 잊지 않는다.
- 프롬프트·에이전트 워크플로를 설계할 때 **재현성을 기본값으로 가정하지 않는다.** "이 프롬프트를 git에 넣으면 재현된다"가 더는 참이 아니다. 재현이 필요한 지점은 명시적으로 고정(seed·temperature·평가 하니스)하고, 나머지는 비결정성을 전제로 검증 루프를 건다.
- 같은 입력이 다른 출력을 낼 때 반사적으로 '버그'라 부르지 말고, **성질인지 결함인지 먼저 구분**한다. 성질이라면 제거가 아니라 관리(범위 제한, 다중 샘플, 검증)로 대응한다.
- 팀에 "무엇을 잃고 있는가"를 **의식적으로 기록**한다. Fowler처럼 잃을 것과 얻을 것을 대칭으로 놓고 보면, 편리함에 떠밀려 조용히 사라지는 역량(직접 읽고 검증하는 근육)을 붙잡을 수 있다.
- 새 도구를 도입할 때 "추상화가 올라갔는가"만 묻지 말고 **"결정론성이 유지되는가"**를 함께 묻는다. 이 한 질문이 도구의 리스크 성격을 크게 갈라 준다.

## 마무리

Fowler의 글은 짧지만 좌표축 하나를 또렷이 남긴다. 프로그래밍의 역사는 오래도록 추상화를 **위로** 쌓아 온 여정이었고, 그동안 결정론이라는 바닥은 한 번도 흔들리지 않았다. LLM은 그 바닥을 처음으로 **옆으로** 밀어낸다. 무엇을 잃고 무엇을 얻을지는 아직 아무도 모른다 — 그러나 우리가 지금 서 있는 곳이 사다리의 다음 칸이 아니라 **처음 보는 평면 위의 한 점**이라는 것만은 분명하다. 이 비결정성과 어떻게 함께 살아갈지를 알아내는 일이, 앞으로 이 직업의 가장 흥미로운 과제가 될 것이다.

### 더 읽어보기

- [원문 — LLMs bring new nature of abstraction (Martin Fowler)](https://martinfowler.com/articles/2025-nature-abstraction.html)
- [확률적 엔지니어링과 24-7 직원 (Tim Davis)](/2026/06/25/probabilistic-engineering-and-the-24-7-employee.html) — 정확성을 '아는' 결정론에서 '믿는' 확률론으로 옮겨 가는, 같은 축의 실무 버전
- [바이브 코딩과 에이전틱 엔지니어링 (Simon Willison)](/2026/06/25/vibe-coding-and-agentic-engineering.html) — 비결정성 축을 건널 때 신뢰의 근거가 어떻게 이동하는가
- [코딩이 공짜가 되면 무엇이 비싸지는가 — Fowler의 Fragments](/2026/06/23/fowler-fragments-verification-cognitive-surrender.html) — 비결정성이 부른 '검증 비용'과 '인지적 항복'
- [Martin Fowler의 Fragments로 읽는 LLM 시대의 균형 감각](/2026/06/19/martin-fowler-fragments-llm-era.html) — 같은 저자, LLM 시대를 보는 균형 감각
- [잘못된 추상화 (Sandi Metz)](/2026/06/22/the-wrong-abstraction.html) — 추상화의 '품질'을 다룬 고전과 대비해 읽기
