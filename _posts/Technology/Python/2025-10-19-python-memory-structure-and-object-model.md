---
layout: post
title: "Python 메모리 구조와 객체 모델"
date: 2025-10-19
categories: [Technology, Python]
series: Python-Essential
tags: [python, memory, garbage-collection]
published: true
excerpt: "Python 메모리 구조, 참조 카운팅, 가비지 컬렉션, __slots__, weakref 등 CPython의 메모리 관리 메커니즘을 6개의 다이어그램과 함께 상세히 설명합니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="Python 객체 모델과 메모리 구조를 한 장으로 묶은 그림. 왼쪽에는 이름(변수) a·b가 화살표로 힙에 놓인 하나의 객체를 함께 가리켜 '변수는 객체를 가리키는 이름'임을 보여준다. 가운데에는 그 객체 하나의 단면, 즉 PyObject 헤더가 참조 카운트(ob_refcnt)와 타입 포인터(ob_type), 그리고 값 영역으로 나뉘어 있고 참조 카운트는 2다. 오른쪽에는 CPython 힙이 Arena·Pool·Block 계층으로 작은 객체를 담고, 그 아래 참조 카운트가 0이 되면 메모리가 해제되는 흐름을 보여준다." viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg">
  <title>Python 객체 모델과 메모리 — 이름→객체 참조 · PyObject 헤더 단면 · 힙(Arena/Pool/Block)과 해제</title>

  <!-- ===== LEFT: names point to one object ===== -->
  <text x="92" y="24" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">이름 → 객체</text>
  <rect x="34" y="58" width="56" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="62" y="75" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">a</text>
  <rect x="34" y="150" width="56" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="62" y="167" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">b</text>
  <text x="62" y="200" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.7">이름(변수)</text>
  <line x1="90" y1="71" x2="156" y2="108" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#mm-arrow)"/>
  <line x1="90" y1="163" x2="156" y2="128" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#mm-arrow)"/>

  <!-- ===== MIDDLE: one PyObject — header + value ===== -->
  <text x="232" y="24" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">객체 = 헤더 + 값</text>
  <rect x="160" y="60" width="144" height="116" rx="4" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2.5"/>
  <rect x="170" y="72" width="124" height="26" rx="2" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="232" y="85" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700">ob_refcnt</text>
  <text x="232" y="95" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">참조 카운트 = 2</text>
  <rect x="170" y="102" width="124" height="26" rx="2" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="232" y="115" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700">ob_type</text>
  <text x="232" y="124" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">타입 포인터</text>
  <rect x="170" y="132" width="124" height="34" rx="2" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="232" y="149" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700">값 (Value)</text>
  <text x="232" y="160" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">실제 데이터</text>
  <text x="232" y="192" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.7">하나의 PyObject</text>

  <!-- divider -->
  <line x1="340" y1="40" x2="340" y2="236" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- ===== RIGHT: heap layers + free-on-zero ===== -->
  <text x="512" y="24" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">힙과 해제</text>
  <rect x="368" y="48" width="288" height="40" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="512" y="66" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="700">Arena · 256KB</text>
  <text x="512" y="80" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">OS에서 직접 할당</text>
  <rect x="384" y="96" width="256" height="36" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="512" y="112" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="700">Pool · 4KB</text>
  <text x="512" y="125" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">같은 크기 블록 묶음</text>
  <g>
    <rect x="404" y="140" width="30" height="22" rx="2" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="2"/>
    <rect x="440" y="140" width="30" height="22" rx="2" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5"/>
    <rect x="476" y="140" width="30" height="22" rx="2" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5"/>
    <rect x="512" y="140" width="30" height="22" rx="2" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5"/>
    <rect x="548" y="140" width="30" height="22" rx="2" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5"/>
    <rect x="584" y="140" width="30" height="22" rx="2" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5"/>
  </g>
  <text x="512" y="176" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">Block · 8·16·…·512 bytes</text>
  <!-- free on zero -->
  <text x="424" y="206" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">refcnt → 0</text>
  <line x1="466" y1="202" x2="512" y2="202" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#mm-arrow)"/>
  <rect x="516" y="190" width="132" height="24" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="582" y="206" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">즉시 메모리 해제</text>

  <defs>
    <marker id="mm-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>이 글의 한 장 요약 — 왼쪽: <strong>변수는 객체를 가리키는 이름</strong>이라 <code>a</code>·<code>b</code>가 같은 객체를 함께 가리킨다. 가운데: 그 객체 하나의 단면 — 모든 객체는 <strong>PyObject 헤더</strong>(참조 카운트 <code>ob_refcnt</code> + 타입 포인터 <code>ob_type</code>)와 <strong>값</strong>으로 이뤄진다. 오른쪽: 작은 객체는 <strong>Arena→Pool→Block</strong> 힙 계층에 담기고, 참조 카운트가 0이 되면 즉시 해제된다.</figcaption>
</figure>

## 소개

Python의 메모리 구조와 객체 모델을 이해하는 것은 효율적이고 버그 없는 코드를 작성하는 데 필수적입니다. 이 글에서는 Python이 메모리를 관리하고, 객체를 처리하며, 다양한 내부 메커니즘을 통해 성능을 최적화하는 방법을 심층적으로 살펴봅니다.

<div class="post-summary-box" markdown="1">

### 📋 이 글에서 다루는 내용

#### 📚 주요 주제

- **객체 모델**: Python의 "모든 것은 객체" 철학과 id(), is, sys.getsizeof() 활용
- **메모리 아키텍처**: CPython의 계층적 메모리 구조 (Arena → Pool → Block)
- **참조 카운팅**: 객체 생명주기 관리와 메모리 해제 메커니즘
- **가비지 컬렉션**: 순환 참조 해결을 위한 세대별 GC
- **메모리 최적화**: `__slots__`, weakref, gc 모듈을 활용한 최적화 기법

#### 🎯 학습 목표

- CPython 내부 메모리 관리 방식 이해
- 참조 카운팅과 가비지 컬렉션의 동작 원리 파악
- 메모리 사용량을 50% 이상 절감하는 최적화 기법 습득
- 메모리 누수 디버깅 및 프로파일링 실전 활용

#### 📊 포함된 다이어그램

**6개의 Mermaid 다이어그램**으로 복잡한 개념을 시각화했습니다:

1. Python 객체 생명주기 전체 흐름
2. CPython 메모리 아키텍처 계층 구조
3. 참조 카운팅 증가/감소 흐름
4. 세대별 가비지 컬렉션 프로세스
5. `__slots__` vs `__dict__` 메모리 구조 비교
6. 강한 참조 vs 약한 참조 비교

#### ⏱️ 예상 읽기 시간

약 25-30분 (코드 예제 실습 포함 시 45분)

</div>

**Python 객체 생명주기 전체 흐름:**

```mermaid
graph TD
    A[객체 생성 요청] --> B{크기 확인}
    B -->|≤ 512 bytes| C[PyMalloc<br/>메모리 풀 사용]
    B -->|> 512 bytes| D[OS malloc<br/>직접 할당]
    C --> E[객체 초기화<br/>refcount = 1]
    D --> E
    E --> F[객체 사용<br/>참조 추가/제거]
    F --> G{refcount > 0?}
    G -->|Yes| F
    G -->|No| H[즉시 메모리 해제]
    F --> I{순환 참조?}
    I -->|Yes| J[GC 추적 리스트 등록]
    J --> K[세대별 GC 대기]
    K --> L{GC 트리거}
    L -->|Gen 0: 700개| M[GC 수집 실행]
    L -->|Gen 1: 10회| M
    L -->|Gen 2: 10회| M
    M --> N{도달 가능?}
    N -->|Yes| O[다음 세대로 승격]
    N -->|No| P[메모리 해제]
    O --> K

    style A fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style H fill:#ffebee,stroke:#c62828,stroke-width:2px
    style P fill:#ffebee,stroke:#c62828,stroke-width:2px
    style M fill:#fff3e0,stroke:#f57c00,stroke-width:2px
```

## 1. 파이썬의 모든 것은 객체다: Object의 기본

### 1.1 파이썬의 객체 모델

Python에서 가장 중요한 개념 중 하나는 **"모든 것이 객체"**라는 것입니다. 변수는 단순한 메모리 공간이 아니라, **객체를 가리키는 이름(Name)** 또는 **참조(Reference)**입니다.

```python
# 변수는 객체를 가리키는 이름입니다
x = 42
y = x

# x와 y는 같은 객체를 가리킵니다
print(x is y)  # True
```

Python의 모든 객체는 세 가지 핵심 속성을 가집니다:

- **식별자 (Identity)**: 객체의 고유한 메모리 주소
- **타입 (Type)**: 객체의 자료형
- **값 (Value)**: 객체가 가진 데이터

```python
x = 42
print(f"식별자: {id(x)}")      # 메모리 주소
print(f"타입: {type(x)}")      # <class 'int'>
print(f"값: {x}")              # 42
```

이 세 속성은 추상적인 개념이 아니라 **메모리 위에 실제로 배치된 바이트**입니다. CPython의 모든 객체는 공통 헤더(`PyObject`)로 시작하며, 그 안에 참조 카운트와 타입 포인터가 들어 있고, 그 뒤에 객체별 값이 이어집니다. 아래는 정수 `42` 객체 하나를 바이트 단위로 펼친 단면입니다.

<figure class="post-figure">
<svg role="img" aria-label="정수 42 객체 하나의 메모리 단면. 64비트 CPython 기준으로 위에서부터 ob_refcnt(참조 카운트, 8바이트), ob_type(타입 객체를 가리키는 포인터, 8바이트)가 공통 PyObject 헤더를 이루고, 그 아래 ob_size(가변 객체용, 8바이트)와 실제 값 영역이 이어진다. 왼쪽에는 0, 8, 16, 24 바이트 오프셋이 표시되어 있고, id()는 이 블록의 시작 주소를, type()은 ob_type이 가리키는 타입을 반환한다는 화살표가 붙어 있다." viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg">
  <title>PyObject 메모리 단면 — ob_refcnt · ob_type 헤더 다음에 값이 오는 바이트 레이아웃</title>

  <text x="320" y="22" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.8">정수 42 객체의 메모리 단면 (64비트 CPython)</text>

  <!-- byte offset rail -->
  <text x="58" y="62" text-anchor="end" font-size="9" fill="currentColor" opacity="0.65" font-family="monospace">0x00</text>
  <text x="58" y="110" text-anchor="end" font-size="9" fill="currentColor" opacity="0.65" font-family="monospace">0x08</text>
  <text x="58" y="158" text-anchor="end" font-size="9" fill="currentColor" opacity="0.65" font-family="monospace">0x10</text>
  <text x="58" y="206" text-anchor="end" font-size="9" fill="currentColor" opacity="0.65" font-family="monospace">0x18</text>
  <text x="40" y="240" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">오프셋</text>

  <!-- PyObject header bracket -->
  <line x1="72" y1="44" x2="72" y2="124" stroke="var(--gold)" stroke-width="3"/>
  <text x="68" y="88" text-anchor="end" font-size="9" fill="currentColor" font-weight="700" opacity="0.85" transform="rotate(-90 68 88)" style="display:none"></text>

  <!-- ob_refcnt -->
  <rect x="80" y="44" width="360" height="44" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.5"/>
  <text x="96" y="64" font-size="10.5" fill="currentColor" font-weight="700" font-family="monospace">ob_refcnt</text>
  <text x="96" y="80" font-size="8.5" fill="currentColor" opacity="0.85">참조 카운트 — 몇 개의 이름이 가리키는가</text>
  <text x="430" y="70" text-anchor="end" font-size="9" fill="currentColor" opacity="0.7">8 bytes</text>

  <!-- ob_type -->
  <rect x="80" y="92" width="360" height="44" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <text x="96" y="112" font-size="10.5" fill="currentColor" font-weight="700" font-family="monospace">ob_type</text>
  <text x="96" y="128" font-size="8.5" fill="currentColor" opacity="0.85">타입 객체를 가리키는 포인터 → int</text>
  <text x="430" y="118" text-anchor="end" font-size="9" fill="currentColor" opacity="0.7">8 bytes</text>

  <!-- ob_size (variable objects) -->
  <rect x="80" y="140" width="360" height="40" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.6" stroke-dasharray="5 3"/>
  <text x="96" y="158" font-size="10.5" fill="currentColor" font-weight="700" font-family="monospace">ob_size</text>
  <text x="96" y="172" font-size="8.5" fill="currentColor" opacity="0.85">가변 객체(list·int 등) 요소 개수</text>
  <text x="430" y="164" text-anchor="end" font-size="9" fill="currentColor" opacity="0.7">8 bytes</text>

  <!-- value payload -->
  <rect x="80" y="184" width="360" height="44" rx="3" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="2.5"/>
  <text x="96" y="204" font-size="10.5" fill="currentColor" font-weight="700">값 (digit) = 42</text>
  <text x="96" y="220" font-size="8.5" fill="currentColor" opacity="0.85">객체별 실제 데이터</text>
  <text x="430" y="210" text-anchor="end" font-size="9" fill="currentColor" opacity="0.7">payload</text>

  <!-- header brace label -->
  <rect x="446" y="44" width="14" height="92" rx="3" fill="none" stroke="var(--gold)" stroke-width="2"/>
  <text x="468" y="86" font-size="9.5" fill="currentColor" font-weight="700">공통 PyObject</text>
  <text x="468" y="100" font-size="9.5" fill="currentColor" font-weight="700">헤더</text>
  <text x="468" y="116" font-size="8" fill="currentColor" opacity="0.75">모든 객체가 공유</text>

  <!-- id() / type() annotations -->
  <line x1="80" y1="44" x2="52" y2="44" stroke="var(--secondary-color)" stroke-width="1.6"/>
  <text x="478" y="204" font-size="9" fill="currentColor" font-weight="700">id(x) → 블록 시작 주소</text>
  <text x="478" y="220" font-size="8.5" fill="currentColor" opacity="0.8">type(x) → ob_type가 가리킴</text>
</svg>
<figcaption>정수 <code>42</code> 객체 하나의 메모리 단면. 모든 CPython 객체는 <code>ob_refcnt</code>(참조 카운트)와 <code>ob_type</code>(타입 포인터)로 이뤄진 <strong>공통 헤더</strong>로 시작하고, 가변 객체는 <code>ob_size</code>가 더해지며, 그 뒤에 객체별 <strong>값</strong>이 옵니다. <code>id()</code>는 이 블록의 시작 주소를, <code>type()</code>은 <code>ob_type</code>가 가리키는 타입을 돌려줍니다.</figcaption>
</figure>

### 1.2 id() 함수와 객체의 고유성

`id()` 함수는 객체의 메모리 주소(고유 식별자)를 반환합니다. 이는 `is` 연산자와 밀접한 관계가 있습니다.

```python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(f"id(a): {id(a)}")
print(f"id(b): {id(b)}")
print(f"id(c): {id(c)}")

# is 연산자는 id가 같은지 확인합니다 (같은 객체인지)
print(a is c)  # True - 같은 객체
print(a is b)  # False - 다른 객체 (값은 같지만)

# == 연산자는 값이 같은지 확인합니다
print(a == b)  # True - 값이 같음
```

**is vs == 비교:**

- `is`: 두 변수가 **같은 객체**를 가리키는지 확인 (identity 비교)
- `==`: 두 객체의 **값**이 같은지 확인 (value 비교)

```python
# None, True, False는 싱글톤 객체입니다
a = None
b = None
print(a is b)  # True - 같은 None 객체

# 작은 정수는 캐싱됩니다 (-5 ~ 256)
x = 256
y = 256
print(x is y)  # True

x = 257
y = 257
print(x is y)  # False (CPython 구현에 따라 다를 수 있음)
```

여기서 헷갈리기 쉬운 지점이 **왜 256은 `is`가 `True`이고 257은 `False`인가**입니다. 핵심은 객체가 *몇 개* 만들어지는가에 있습니다. CPython은 자주 쓰는 작은 정수(`-5`~`256`)를 시작할 때 **미리 만들어 캐싱**해 두므로, `256`을 두 번 써도 두 이름이 *같은 하나의* 캐시 객체를 가리킵니다. 반면 `257`은 캐시 범위 밖이라 매번 **새 객체**가 만들어져, 값은 같아도 서로 다른 객체가 됩니다.

<figure class="post-figure">
<svg role="img" aria-label="작은 정수 캐시가 is 비교에 미치는 영향을 보여주는 그림. 왼쪽은 x=256, y=256일 때 두 이름이 같은 하나의 캐시된 정수 256 객체를 함께 가리켜 x is y가 True가 되는 모습이다. 미리 만들어 둔 -5부터 256까지의 small int 캐시 띠가 그 객체를 품고 있다. 오른쪽은 x=257, y=257일 때 캐시 범위를 벗어나 각각 새로 만들어진 두 개의 서로 다른 257 객체를 가리켜 x is y가 False가 되는 모습이다. 두 객체 모두 값은 257로 같지만 별개의 메모리 블록이다." viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg">
  <title>작은 정수 캐시 — 256은 공유된 한 객체(is True), 257은 별개의 두 객체(is False)</title>

  <!-- ===== LEFT: 256 — shared cached object ===== -->
  <text x="158" y="22" text-anchor="middle" font-size="11.5" fill="currentColor" font-weight="700" opacity="0.85">x = 256 ; y = 256</text>

  <rect x="40" y="48" width="56" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="68" y="65" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">x</text>
  <rect x="40" y="120" width="56" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="68" y="137" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">y</text>

  <line x1="96" y1="61" x2="184" y2="92" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#sc-arrow)"/>
  <line x1="96" y1="133" x2="184" y2="100" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#sc-arrow)"/>

  <rect x="188" y="78" width="92" height="36" rx="4" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2.5"/>
  <text x="234" y="95" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">int 256</text>
  <text x="234" y="108" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.8">캐시된 한 객체</text>

  <!-- small int cache band -->
  <rect x="120" y="150" width="160" height="34" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="1.8" stroke-dasharray="5 3"/>
  <text x="200" y="165" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700">small int 캐시</text>
  <text x="200" y="178" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.85">-5 … 256 미리 생성</text>

  <text x="158" y="224" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700">x is y → True</text>
  <text x="158" y="242" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.8">같은 객체를 공유</text>

  <!-- divider -->
  <line x1="320" y1="40" x2="320" y2="258" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- ===== RIGHT: 257 — two distinct objects ===== -->
  <text x="482" y="22" text-anchor="middle" font-size="11.5" fill="currentColor" font-weight="700" opacity="0.85">x = 257 ; y = 257</text>

  <rect x="356" y="48" width="56" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="384" y="65" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">x</text>
  <rect x="356" y="120" width="56" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="384" y="137" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">y</text>

  <line x1="412" y1="61" x2="498" y2="61" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#sc-arrow)"/>
  <line x1="412" y1="133" x2="498" y2="133" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#sc-arrow)"/>

  <rect x="502" y="44" width="96" height="36" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="2"/>
  <text x="550" y="61" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">int 257 ⓐ</text>
  <text x="550" y="74" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.8">새 객체</text>
  <rect x="502" y="116" width="96" height="36" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="2"/>
  <text x="550" y="133" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">int 257 ⓑ</text>
  <text x="550" y="146" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.8">또 다른 새 객체</text>

  <text x="482" y="178" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.85">257은 캐시 범위 밖 — 매번 새로 생성</text>

  <text x="482" y="224" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700">x is y → False</text>
  <text x="482" y="242" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.8">값(==)은 같지만 별개 객체</text>

  <defs>
    <marker id="sc-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>작은 정수 캐시가 <code>is</code>를 가르는 이유. <strong>왼쪽</strong>: <code>256</code>은 <code>-5</code>~<code>256</code> 캐시 범위 안이라 두 이름이 <strong>같은 한 객체</strong>를 가리켜 <code>x is y</code>가 <code>True</code>. <strong>오른쪽</strong>: <code>257</code>은 캐시 밖이라 <strong>각각 새 객체</strong>가 만들어져, 값(<code>==</code>)은 같아도 <code>is</code>는 <code>False</code>. <code>is</code>는 <em>값</em>이 아니라 <em>객체 동일성</em>을 본다는 점을 보여줍니다.</figcaption>
</figure>

### 1.3 sys.getsizeof() 함수와 객체의 크기

`sys.getsizeof()` 함수는 객체가 차지하는 메모리 크기를 바이트 단위로 반환합니다.

```python
import sys

# 다양한 타입의 메모리 크기 확인
print(f"int(0): {sys.getsizeof(0)} bytes")
print(f"int(100): {sys.getsizeof(100)} bytes")
print(f"int(10**100): {sys.getsizeof(10**100)} bytes")  # 큰 정수는 더 많은 메모리 사용

print(f"str(''): {sys.getsizeof('')} bytes")
print(f"str('hello'): {sys.getsizeof('hello')} bytes")

print(f"list([]): {sys.getsizeof([])} bytes")
print(f"list([1,2,3]): {sys.getsizeof([1,2,3])} bytes")

{% raw %}
print(f"dict({{}}): {sys.getsizeof({})} bytes")
print(f"dict({{'a':1}}): {sys.getsizeof({'a':1})} bytes")
{% endraw %}
```

**getsizeof()의 한계점:**

`sys.getsizeof()`는 객체 자체의 크기만 반환하며, 객체가 참조하는 다른 객체의 크기는 포함하지 않습니다.

```python
import sys

# 리스트가 참조하는 객체들의 크기는 포함되지 않습니다
list1 = [1, 2, 3]
list2 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

print(sys.getsizeof(list1))  # 작은 크기
print(sys.getsizeof(list2))  # list1과 크기 차이가 크지 않음

# 실제 총 크기를 계산하려면 재귀적으로 계산해야 합니다
def get_total_size(obj, seen=None):
    """재귀적으로 객체의 전체 크기 계산"""
    size = sys.getsizeof(obj)
    if seen is None:
        seen = set()

    obj_id = id(obj)
    if obj_id in seen:
        return 0

    seen.add(obj_id)

    if isinstance(obj, dict):
        size += sum([get_total_size(v, seen) for v in obj.values()])
        size += sum([get_total_size(k, seen) for k in obj.keys()])
    elif hasattr(obj, '__dict__'):
        size += get_total_size(obj.__dict__, seen)
    elif hasattr(obj, '__iter__') and not isinstance(obj, (str, bytes, bytearray)):
        size += sum([get_total_size(i, seen) for i in obj])

    return size

print(f"list2 전체 크기: {get_total_size(list2)} bytes")
```

## 2. CPython 메모리 관리의 비밀

### 2.1 CPython의 메모리 아키텍처

CPython은 효율적인 메모리 관리를 위해 계층적 구조를 사용합니다:

```mermaid
graph TD
    A[OS 메모리 할당자<br/>Operating System Memory] --> B[Arena<br/>256KB 단위]
    B --> C[Pool<br/>4KB 단위]
    C --> D[Block<br/>8, 16, 24, ... 512 bytes]

    style A fill:#e1f5ff,stroke:#0288d1,stroke-width:2px
    style B fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style C fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style D fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
```

**계층 구조 설명:**

1. **Arena**: 256KB 크기의 메모리 블록, OS로부터 직접 할당받음
2. **Pool**: 4KB 크기, 같은 크기의 블록들로 구성
3. **Block**: 8바이트 단위로 증가 (8, 16, 24, ..., 512 bytes)

```python
# 작은 객체들은 메모리 풀에서 효율적으로 관리됩니다
# 512 bytes 이하의 객체는 pymalloc을 통해 관리
small_list = [1, 2, 3]  # Pool에서 할당

# 큰 객체는 OS의 malloc을 직접 사용
large_list = [i for i in range(1000000)]  # OS malloc 사용
```

### 2.2 참조 카운팅 (Reference Counting)

Python의 기본 메모리 관리 기법은 **참조 카운팅**입니다. 각 객체는 자신을 참조하는 변수의 개수를 추적합니다.

```python
import sys

a = []
print(sys.getrefcount(a))  # 2 (a 자체 + getrefcount의 임시 참조)

b = a
print(sys.getrefcount(a))  # 3 (참조 증가)

c = a
print(sys.getrefcount(a))  # 4 (참조 증가)

del b
print(sys.getrefcount(a))  # 3 (참조 감소)

del c
print(sys.getrefcount(a))  # 2 (참조 감소)

# 참조 카운트가 0이 되면 즉시 메모리 해제
```

**참조 카운트가 증가하는 경우:**

- 객체를 변수에 할당할 때
- 객체를 컨테이너(리스트, 딕셔너리 등)에 추가할 때
- 함수에 인자로 전달할 때

**참조 카운트가 감소하는 경우:**

- 변수가 스코프를 벗어날 때
- 변수에 다른 객체를 할당할 때
- `del` 문으로 변수를 삭제할 때
- 컨테이너에서 객체를 제거할 때

**참조 카운팅 흐름도:**

```mermaid
graph LR
    A[객체 생성<br/>refcount = 1] --> B{참조 추가?}
    B -->|변수 할당| C[refcount++]
    B -->|컨테이너 추가| C
    B -->|함수 인자| C
    C --> D{참조 제거?}
    D -->|del 문| E[refcount--]
    D -->|스코프 종료| E
    D -->|재할당| E
    E --> F{refcount == 0?}
    F -->|Yes| G[메모리 해제]
    F -->|No| D

    style A fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style G fill:#ffebee,stroke:#c62828,stroke-width:2px
    style F fill:#fff3e0,stroke:#f57c00,stroke-width:2px
```

### 2.3 순환 참조 문제와 세대별 가비지 컬렉션

참조 카운팅만으로는 **순환 참조**를 해결할 수 없습니다.

```python
import gc
import sys

# 순환 참조 예제
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

# 순환 참조 생성
node1 = Node(1)
node2 = Node(2)
node1.next = node2
node2.next = node1  # 순환 참조!

print(f"node1 참조 카운트: {sys.getrefcount(node1)}")
print(f"node2 참조 카운트: {sys.getrefcount(node2)}")

# node1, node2를 삭제해도 서로를 참조하고 있어 메모리 해제 안 됨
del node1
del node2

# 가비지 컬렉터가 순환 참조를 정리
collected = gc.collect()
print(f"수거된 객체 수: {collected}")
```

**세대별 가비지 컬렉션 (Generational GC):**

Python의 `gc` 모듈은 세대별 가비지 컬렉션을 사용합니다:

- **Generation 0**: 새로 생성된 객체
- **Generation 1**: Generation 0에서 살아남은 객체
- **Generation 2**: Generation 1에서 살아남은 객체 (오래된 객체)

```mermaid
graph TD
    A[새 객체 생성] --> B[Generation 0<br/>새로운 객체]
    B --> C{GC 실행<br/>700개 도달}
    C -->|살아남음| D[Generation 1<br/>중간 수명 객체]
    C -->|참조 없음| X1[메모리 해제]
    D --> E{GC 실행<br/>10회 도달}
    E -->|살아남음| F[Generation 2<br/>오래된 객체]
    E -->|참조 없음| X2[메모리 해제]
    F --> G{GC 실행<br/>10회 도달}
    G -->|순환 참조 발견| X3[메모리 해제]
    G -->|계속 사용 중| F

    style A fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style B fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style D fill:#e1f5ff,stroke:#0288d1,stroke-width:2px
    style F fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style X1 fill:#ffebee,stroke:#c62828,stroke-width:2px
    style X2 fill:#ffebee,stroke:#c62828,stroke-width:2px
    style X3 fill:#ffebee,stroke:#c62828,stroke-width:2px
```

```python
import gc

# 현재 가비지 컬렉션 설정 확인
print(f"GC 임계값: {gc.get_threshold()}")  # (700, 10, 10)
# 의미: Gen0에 700개 객체가 쌓이면 수집, Gen0 수집 10번마다 Gen1 수집, Gen1 수집 10번마다 Gen2 수집

# 세대별 객체 수 확인
print(f"세대별 객체 수: {gc.get_count()}")  # (Gen0, Gen1, Gen2)

# 수동으로 가비지 컬렉션 실행
collected = gc.collect()
print(f"수거된 객체 수: {collected}")

# 추적 가능한 객체 목록
print(f"추적 중인 객체 수: {len(gc.get_objects())}")
```

## 3. 메모리 최적화 및 고급 관리 기법

### 3.1 `__slots__`를 이용한 메모리 절약

Python 객체는 기본적으로 `__dict__`를 사용하여 인스턴스 속성을 저장합니다. `__slots__`를 사용하면 `__dict__` 생성을 막아 메모리를 절약할 수 있습니다.

**`__dict__` vs `__slots__` 메모리 구조:**

```mermaid
graph LR
    subgraph "일반 객체 (__dict__ 사용)"
    O1[객체 인스턴스] --> D1[__dict__<br/>딕셔너리]
    D1 --> K1[키: 'name']
    D1 --> K2[키: 'age']
    D1 --> K3[키: 'email']
    K1 --> V1[값]
    K2 --> V2[값]
    K3 --> V3[값]
    end

    subgraph "__slots__ 객체"
    O2[객체 인스턴스] --> S1[고정 슬롯 0<br/>name]
    O2 --> S2[고정 슬롯 1<br/>age]
    O2 --> S3[고정 슬롯 2<br/>email]
    end

    style O1 fill:#ffebee,stroke:#c62828,stroke-width:2px
    style D1 fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style O2 fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style S1 fill:#e1f5ff,stroke:#0288d1,stroke-width:1px
    style S2 fill:#e1f5ff,stroke:#0288d1,stroke-width:1px
    style S3 fill:#e1f5ff,stroke:#0288d1,stroke-width:1px
```

```python
import sys

# 일반 클래스 (__dict__ 사용)
class PersonNormal:
    def __init__(self, name, age):
        self.name = name
        self.age = age

# __slots__ 사용 클래스
class PersonSlots:
    __slots__ = ['name', 'age']

    def __init__(self, name, age):
        self.name = name
        self.age = age

# 메모리 사용량 비교
p1 = PersonNormal("Alice", 30)
p2 = PersonSlots("Bob", 25)

print(f"일반 객체 크기: {sys.getsizeof(p1)} bytes")
print(f"일반 객체 __dict__: {sys.getsizeof(p1.__dict__)} bytes")
print(f"__slots__ 객체 크기: {sys.getsizeof(p2)} bytes")

# 대량의 객체 생성 시 메모리 차이
import tracemalloc

tracemalloc.start()

# 일반 클래스로 100,000개 객체 생성
persons_normal = [PersonNormal(f"Person{i}", i) for i in range(100000)]
current1, peak1 = tracemalloc.get_traced_memory()

tracemalloc.clear_traces()

# __slots__ 클래스로 100,000개 객체 생성
persons_slots = [PersonSlots(f"Person{i}", i) for i in range(100000)]
current2, peak2 = tracemalloc.get_traced_memory()

print(f"\n일반 클래스 메모리: {current1 / 10**6:.2f}MB")
print(f"__slots__ 클래스 메모리: {current2 / 10**6:.2f}MB")
print(f"메모리 절감: {(current1 - current2) / 10**6:.2f}MB ({((current1-current2)/current1)*100:.1f}%)")

tracemalloc.stop()
```

**`__slots__`의 제약사항:**

```python
class Person:
    __slots__ = ['name', 'age']

    def __init__(self, name, age):
        self.name = name
        self.age = age

p = Person("Alice", 30)

# 제약 1: __dict__가 없어 동적 속성 추가 불가
try:
    p.email = "alice@example.com"  # AttributeError
except AttributeError as e:
    print(f"오류: {e}")

# 제약 2: __weakref__가 없어 약한 참조 불가 (명시적으로 추가해야 함)
# __slots__ = ['name', 'age', '__weakref__']로 해결 가능

# 제약 3: 상속 시 주의 필요
class Employee(Person):
    __slots__ = ['employee_id']  # 부모의 __slots__와 합쳐짐

    def __init__(self, name, age, employee_id):
        super().__init__(name, age)
        self.employee_id = employee_id
```

### 3.2 weakref 모듈과 약한 참조

`weakref` 모듈은 객체를 참조하되 참조 카운트를 증가시키지 않는 **약한 참조**를 제공합니다. 이는 캐시나 순환 참조 방지에 유용합니다.

**일반 참조 vs 약한 참조:**

```mermaid
graph TD
    subgraph "일반 참조 (Strong Reference)"
    A1[변수 a] -->|refcount++| O1[객체]
    A2[변수 b] -->|refcount++| O1
    A3[변수 c] -->|refcount++| O1
    O1 -.->|refcount = 3| M1[메모리 유지]
    end

    subgraph "약한 참조 (Weak Reference)"
    B1[변수 a] -->|refcount++| O2[객체]
    B2[weakref] -.->|refcount 증가 없음| O2
    O2 -.->|refcount = 1| M2[a 삭제 시<br/>즉시 해제]
    end

    style O1 fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style O2 fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style M1 fill:#e1f5ff,stroke:#0288d1,stroke-width:2px
    style M2 fill:#fff3e0,stroke:#f57c00,stroke-width:2px
```

```python
import weakref
import sys

class Data:
    def __init__(self, value):
        self.value = value

    def __del__(self):
        print(f"Data({self.value}) 객체 삭제됨")

# 일반 참조
data = Data(42)
ref1 = data
print(f"참조 카운트: {sys.getrefcount(data)}")  # 3

# 약한 참조
weak_ref = weakref.ref(data)
print(f"참조 카운트: {sys.getrefcount(data)}")  # 3 (약한 참조는 카운트 증가 안 함)

# 약한 참조로 객체 접근
print(f"약한 참조로 접근: {weak_ref()}")  # Data 객체
print(f"값: {weak_ref().value}")  # 42

# 원본 객체 삭제
del data
del ref1

# 약한 참조는 None을 반환
print(f"약한 참조 (삭제 후): {weak_ref()}")  # None
```

**weakref를 사용한 캐시 구현:**

```python
import weakref

class ExpensiveObject:
    def __init__(self, name):
        self.name = name
        print(f"ExpensiveObject({name}) 생성 - 비용이 큰 작업 수행")

# WeakValueDictionary를 사용한 캐시
cache = weakref.WeakValueDictionary()

def get_object(name):
    """캐시에서 객체를 가져오거나 새로 생성"""
    if name in cache:
        print(f"캐시에서 {name} 가져옴")
        return cache[name]

    obj = ExpensiveObject(name)
    cache[name] = obj
    return obj

# 첫 번째 호출 - 객체 생성
obj1 = get_object("data1")

# 두 번째 호출 - 캐시에서 가져옴
obj2 = get_object("data1")
print(f"같은 객체? {obj1 is obj2}")  # True

# 참조 제거
del obj1
del obj2

# 약한 참조이므로 객체가 자동으로 삭제됨
print(f"캐시 크기: {len(cache)}")  # 0

# 다시 호출 - 새로 생성됨
obj3 = get_object("data1")
```

**순환 참조 방지:**

```python
import weakref

class Parent:
    def __init__(self, name):
        self.name = name
        self.children = []

    def add_child(self, child):
        self.children.append(child)
        child.parent = weakref.ref(self)  # 약한 참조 사용

class Child:
    def __init__(self, name):
        self.name = name
        self.parent = None

    def get_parent(self):
        return self.parent() if self.parent else None

# 순환 참조 없이 부모-자식 관계 설정
parent = Parent("Parent")
child = Child("Child")
parent.add_child(child)

print(f"자식의 부모: {child.get_parent().name}")

# 부모 객체 삭제
del parent

# 약한 참조로 인해 부모 객체가 완전히 삭제됨
print(f"부모 객체: {child.get_parent()}")  # None
```

### 3.3 gc 모듈 직접 제어하기

`gc` 모듈을 사용하여 가비지 컬렉션을 직접 제어하고 메모리 누수를 디버깅할 수 있습니다.

```python
import gc

# 가비지 컬렉션 비활성화/활성화
gc.disable()
print(f"GC 활성화 상태: {gc.isenabled()}")  # False

# 대량의 객체 생성 작업 수행
data = [i for i in range(1000000)]

# 작업 완료 후 수동으로 GC 실행
gc.enable()
collected = gc.collect()
print(f"수거된 객체 수: {collected}")

# GC 통계 확인
stats = gc.get_stats()
for i, stat in enumerate(stats):
    print(f"Generation {i}: {stat}")

# GC 임계값 조정
# 기본값: (700, 10, 10)
gc.set_threshold(1000, 15, 15)  # 더 느슨한 설정
print(f"새로운 임계값: {gc.get_threshold()}")
```

**메모리 누수 디버깅:**

```python
import gc
import sys

class LeakyClass:
    instances = []  # 클래스 변수에 저장 - 메모리 누수 가능성

    def __init__(self, value):
        self.value = value
        LeakyClass.instances.append(self)  # 자기 자신을 리스트에 추가

# 객체 생성
for i in range(100):
    obj = LeakyClass(i)

# obj 변수는 삭제되었지만 instances 리스트에 남아있음
print(f"메모리에 남아있는 인스턴스 수: {len(LeakyClass.instances)}")

# gc.get_referrers()로 객체를 참조하는 것 찾기
sample = LeakyClass.instances[0]
referrers = gc.get_referrers(sample)
print(f"참조자 수: {len(referrers)}")
for ref in referrers:
    print(f"참조 타입: {type(ref)}")

# 메모리 누수 해결
LeakyClass.instances.clear()
gc.collect()
```

**순환 참조 찾기:**

```python
import gc

# 순환 참조가 있는 객체들 찾기
def find_circular_references():
    gc.collect()  # 먼저 GC 실행

    # 가비지로 수집된 객체들 확인
    if gc.garbage:
        print(f"수거되지 않은 객체 수: {len(gc.garbage)}")
        for item in gc.garbage:
            print(f"- {type(item)}: {item}")
            # 참조 관계 확인
            referents = gc.get_referents(item)
            print(f"  참조하는 객체 수: {len(referents)}")
    else:
        print("순환 참조 없음")

# DEBUG 모드 활성화
gc.set_debug(gc.DEBUG_SAVEALL)

# 순환 참조 생성
class Node:
    def __init__(self):
        self.ref = None

a = Node()
b = Node()
a.ref = b
b.ref = a

del a
del b

gc.collect()
find_circular_references()

# DEBUG 모드 해제
gc.set_debug(0)
```

**메모리 프로파일링과 함께 사용:**

```python
import gc
import tracemalloc

def profile_memory_with_gc():
    """GC와 함께 메모리 프로파일링"""
    tracemalloc.start()

    # GC 비활성화하고 객체 생성
    gc.disable()
    data = [list(range(1000)) for _ in range(1000)]
    current, peak = tracemalloc.get_traced_memory()
    print(f"GC 비활성화 시: {current / 10**6:.2f}MB (peak: {peak / 10**6:.2f}MB)")

    # GC 활성화하고 수집
    gc.enable()
    collected = gc.collect()
    current, peak = tracemalloc.get_traced_memory()
    print(f"GC 실행 후: {current / 10**6:.2f}MB (수거: {collected}개)")

    tracemalloc.stop()

profile_memory_with_gc()
```

## 핵심 포인트

### 객체 모델의 이해

- Python에서 변수는 객체를 가리키는 **이름(Name)** 또는 **참조(Reference)**입니다
- 모든 객체는 **식별자(Identity)**, **타입(Type)**, **값(Value)** 세 가지 속성을 가집니다
- `id()` 함수로 객체의 메모리 주소를 확인하고, `is` 연산자로 객체 동일성을 비교합니다
- `sys.getsizeof()`는 객체 자체의 크기만 반환하며, 참조하는 객체는 포함하지 않습니다

### CPython 메모리 관리

- CPython은 **Arena → Pool → Block** 계층 구조로 메모리를 효율적으로 관리합니다
- **참조 카운팅(Reference Counting)**으로 객체의 생명주기를 추적합니다
- 순환 참조는 참조 카운팅만으로 해결할 수 없어 **세대별 가비지 컬렉션**이 필요합니다
- `gc` 모듈로 가비지 컬렉션을 제어하고 메모리 누수를 디버깅할 수 있습니다

### 메모리 최적화 기법

- `__slots__`를 사용하면 `__dict__` 생성을 막아 **메모리 사용량을 50% 이상 절감**할 수 있습니다
- `weakref` 모듈은 참조 카운트를 증가시키지 않는 **약한 참조**를 제공합니다
- 약한 참조는 캐시 구현과 순환 참조 방지에 유용합니다
- `gc.collect()`로 수동 가비지 컬렉션을 실행하고, `gc.get_referrers()`로 메모리 누수를 추적합니다

### 실무 적용

- 대량의 객체를 다룰 때는 `__slots__` 사용을 고려하세요
- 캐시 구현 시 `weakref.WeakValueDictionary`를 활용하세요
- 메모리 프로파일링(`tracemalloc`)과 가비지 컬렉션(`gc`)을 함께 사용하여 메모리 문제를 진단하세요
- 순환 참조가 의심될 때는 `gc.set_debug(gc.DEBUG_SAVEALL)`로 디버깅하세요

## 결론

Python의 메모리 구조와 객체 모델을 깊이 이해하는 것은 단순히 이론적 지식을 넘어 실무에서 직면하는 성능 문제와 메모리 이슈를 해결하는 핵심 역량입니다.

**이 글에서 다룬 내용:**

1. **객체 모델의 기본**: 변수는 객체를 가리키는 이름이며, `id()`, `is`, `sys.getsizeof()`로 객체의 속성을 확인할 수 있습니다.

2. **CPython의 메모리 관리**: 계층적 메모리 구조, 참조 카운팅, 세대별 가비지 컬렉션을 통해 효율적으로 메모리를 관리합니다.

3. **고급 최적화 기법**: `__slots__`, `weakref`, `gc` 모듈을 활용하여 메모리 사용량을 최적화하고 메모리 누수를 방지합니다.

이러한 개념들을 실무에 적용하면:

- 메모리 사용량이 많은 애플리케이션의 성능을 개선할 수 있습니다
- 순환 참조로 인한 메모리 누수를 사전에 방지할 수 있습니다
- 프로파일링 도구를 사용하여 병목 지점을 정확히 파악할 수 있습니다
- 대용량 데이터 처리 시 메모리를 효율적으로 관리할 수 있습니다

Python의 "자동" 메모리 관리가 모든 것을 해결해주는 것은 아닙니다. 내부 동작 원리를 이해하고 적절한 도구를 활용하는 것이 진정한 Python 전문가로 가는 길입니다.

### 다음 학습

이 글을 읽으셨다면 다음 주제로 넘어가보세요:

- **[Python GIL (Global Interpreter Lock)](/2025/10/22/python-gil.html)** ← 다음 추천
  - 메모리 구조를 이해했다면, 멀티스레딩 환경에서 Python이 어떻게 동작하는지 알아보세요
- [Python Bytecode](/2025/10/24/python-bytecode.html)
  - 바이트코드 수준에서 Python의 실행 메커니즘 이해
- Import 시스템 심화
- Exception Internals

## 참고 자료

- [Python Documentation - Data Model](https://docs.python.org/3/reference/datamodel.html)
- [Python Documentation - gc module](https://docs.python.org/3/library/gc.html)
- [Python Documentation - weakref module](https://docs.python.org/3/library/weakref.html)
- [CPython Source Code - Memory Management](https://github.com/python/cpython/blob/main/Objects/obmalloc.c)
- [PEP 412 - Key-Sharing Dictionary](https://www.python.org/dev/peps/pep-0412/)
- [Understanding Python Memory Management](https://realpython.com/python-memory-management/)
