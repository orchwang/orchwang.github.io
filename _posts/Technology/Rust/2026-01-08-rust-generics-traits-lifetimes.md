---
layout: post
title: "Rust 제네릭, 트레이트, 라이프타임"
date: 2026-01-08
categories: [Technology, Rust]
tags: [rust, generics, trait, lifetime]
series: Rust-Essential
published: true
excerpt: "Rust의 핵심 추상화 도구인 제네릭(Generics), 트레이트(Trait), 라이프타임(Lifetime)을 코드 예제와 함께 깊이 있게 다룹니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="Rust 추상화의 세 기둥을 한 장으로 묶은 그림. 왼쪽 기둥 제네릭은 하나의 함수 틀이 i32, char, f64 등 여러 구체 타입으로 매개변수화된다. 가운데 기둥 트레이트는 Summary라는 공유 행동 인터페이스가 Tweet과 Article 두 타입에 공통 메서드를 부여한다. 오른쪽 기둥 라이프타임은 참조의 유효 범위를 막대로 표시해, 가리키는 대상보다 참조가 더 오래 살지 못하도록 보장한다." viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg">
  <title>Rust 추상화의 세 기둥 — 제네릭(타입 매개변수화) · 트레이트(공유 행동 인터페이스) · 라이프타임(참조 유효 범위 보장)</title>

  <!-- ===== LEFT: Generics — one shape, many types ===== -->
  <text x="116" y="24" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">제네릭</text>
  <!-- the generic template box -->
  <rect x="78" y="44" width="76" height="34" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="116" y="62" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">f&lt;T&gt;</text>
  <text x="116" y="74" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.75">하나의 틀</text>
  <!-- fan-out to concrete types -->
  <line x1="90" y1="78" x2="58" y2="118" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#gt-arrow)"/>
  <line x1="116" y1="80" x2="116" y2="118" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#gt-arrow)"/>
  <line x1="142" y1="78" x2="174" y2="118" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#gt-arrow)"/>
  <rect x="30" y="122" width="54" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="57" y="139" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">i32</text>
  <rect x="90" y="122" width="54" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="117" y="139" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">char</text>
  <rect x="150" y="122" width="54" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="177" y="139" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">f64</text>
  <text x="116" y="172" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.8" font-weight="700">타입을 매개변수로</text>

  <!-- divider -->
  <line x1="244" y1="40" x2="244" y2="236" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- ===== MIDDLE: Traits — shared behavior interface ===== -->
  <text x="346" y="24" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">트레이트</text>
  <!-- the trait contract -->
  <rect x="296" y="44" width="100" height="38" rx="3" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="2.5"/>
  <text x="346" y="62" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">trait Summary</text>
  <text x="346" y="76" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.75">summarize()</text>
  <!-- two types implementing it -->
  <line x1="320" y1="82" x2="306" y2="118" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#gt-arrow)"/>
  <line x1="372" y1="82" x2="386" y2="118" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#gt-arrow)"/>
  <rect x="276" y="122" width="62" height="34" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="307" y="139" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">Tweet</text>
  <text x="307" y="151" text-anchor="middle" font-size="7" fill="currentColor" opacity="0.7">impl</text>
  <rect x="354" y="122" width="62" height="34" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="385" y="139" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">Article</text>
  <text x="385" y="151" text-anchor="middle" font-size="7" fill="currentColor" opacity="0.7">impl</text>
  <text x="346" y="172" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.8" font-weight="700">공유 행동 인터페이스</text>

  <!-- divider -->
  <line x1="448" y1="40" x2="448" y2="236" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- ===== RIGHT: Lifetimes — reference must not outlive its target ===== -->
  <text x="566" y="24" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">라이프타임</text>
  <!-- owner/value lifespan bar (longer) -->
  <text x="486" y="62" text-anchor="end" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="700">값 x</text>
  <rect x="494" y="52" width="150" height="16" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="569" y="64" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.75">살아 있는 범위</text>
  <!-- reference lifespan bar (shorter, must fit inside) -->
  <text x="486" y="98" text-anchor="end" font-size="8.5" fill="currentColor" opacity="0.8" font-weight="700">참조 &amp;x</text>
  <rect x="494" y="88" width="104" height="16" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="546" y="100" text-anchor="middle" font-size="7.5" fill="currentColor" font-weight="700">'a</text>
  <!-- constraint bracket showing reference ends within value -->
  <line x1="598" y1="80" x2="598" y2="112" stroke="var(--accent-color)" stroke-width="2"/>
  <line x1="644" y1="44" x2="644" y2="76" stroke="currentColor" stroke-width="1.5" opacity="0.6" stroke-dasharray="3 3"/>
  <text x="569" y="134" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.85">참조는 값보다 오래 못 산다</text>
  <text x="566" y="172" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.8" font-weight="700">참조 유효 범위 보장</text>

  <!-- ===== bottom unifying caption band ===== -->
  <text x="340" y="206" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700" opacity="0.7">코드 중복은 줄이고, 안전성은 컴파일 시점에</text>
  <line x1="120" y1="222" x2="560" y2="222" stroke="currentColor" stroke-width="1" opacity="0.2"/>

  <defs>
    <marker id="gt-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>Rust 추상화의 세 기둥 — <strong>제네릭</strong>은 하나의 함수·구조체 틀을 여러 구체 타입으로 매개변수화하고, <strong>트레이트</strong>는 <code>Summary</code> 같은 공유 행동 인터페이스를 여러 타입에 공통으로 부여하며, <strong>라이프타임</strong>은 참조(<code>&amp;x</code>)가 가리키는 값보다 더 오래 살지 못하도록 유효 범위를 보장한다. 셋 다 런타임 비용 없이 컴파일 시점에 작동한다.</figcaption>
</figure>

## 들어가며

이 글은 Rust Essential 로드맵의 5단계로, [Rust 에러 처리와 컬렉션](/2026/01/07/rust-error-handling-and-collections.html)에 이어 제네릭(Generics)·트레이트(Trait)·라이프타임(Lifetime)을 다룹니다. 이 세 가지는 코드 중복을 줄이고 안전성을 보장하는 Rust 추상화의 핵심이며, 표준 라이브러리부터 실무 코드까지 어디에나 등장합니다. 전체 학습 흐름은 [Rust Essential Curriculum](/2026/01/02/rust-essential-curriculum.html)에서 확인할 수 있습니다.

<div class="post-summary-box" markdown="1">

### 📌 이 글에서 다루는 내용

#### 🔍 핵심 주제

- **Generics**: 타입 매개변수로 함수·구조체·열거형 추상화, 단형화(monomorphization)
- **Traits**: 공통 동작 정의, 기본 구현, 트레이트 바운드(trait bound)
- **Lifetimes**: 댕글링 참조 방지와 라이프타임 명시(`'a`), 생략 규칙

</div>

## 제네릭 (Generics)

제네릭은 구체적인 타입 대신 타입 매개변수를 사용해 함수·구조체·열거형을 추상화하는 도구입니다. 같은 로직을 여러 타입에 대해 재사용할 수 있어 코드 중복을 크게 줄여줍니다.

### 제네릭 함수

아래 `largest` 함수는 슬라이스에서 가장 큰 값을 찾습니다. 비교가 가능한 타입이라면 정수든 문자든 동일한 코드로 처리할 수 있습니다.

```rust
// T는 PartialOrd로 비교 가능하고 Copy로 복사 가능한 타입이어야 한다
fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut largest = list[0];
    for &item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    println!("가장 큰 수: {}", largest(&numbers)); // 100

    let chars = vec!['y', 'm', 'a', 'q'];
    println!("가장 큰 문자: {}", largest(&chars)); // y
}
```

`T: PartialOrd + Copy`는 타입 매개변수 `T`가 만족해야 하는 조건(트레이트 바운드)으로, 비교 연산자 `>`와 값 복사를 사용하기 위해 필요합니다.

### 제네릭 구조체

구조체도 타입 매개변수를 받을 수 있습니다. `Point<T>`는 같은 타입의 좌표 두 개를 담습니다.

```rust
struct Point<T> {
    x: T,
    y: T,
}

// 특정 타입(f64)에만 메서드를 구현할 수도 있다
impl Point<f64> {
    fn distance_from_origin(&self) -> f64 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}

fn main() {
    let integer = Point { x: 5, y: 10 };
    let float = Point { x: 3.0, y: 4.0 };

    println!("정수 좌표: ({}, {})", integer.x, integer.y);
    println!("원점까지 거리: {}", float.distance_from_origin()); // 5
}
```

### 열거형의 제네릭

우리가 매일 쓰는 표준 라이브러리의 `Option<T>`와 `Result<T, E>`가 바로 제네릭 열거형입니다.

```rust
enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

값의 유무(`Option<T>`)나 성공/실패(`Result<T, E>`)를 타입과 무관하게 표현할 수 있어, 어떤 데이터 타입과도 조합됩니다.

### 단형화로 인한 런타임 비용 제로

Rust의 제네릭은 추상화 비용이 없습니다. 컴파일 시점에 **단형화(monomorphization)**가 일어나, 실제 사용된 구체 타입마다 전용 코드를 생성하기 때문입니다.

```rust
let integer = Some(5);     // Option<i32>로 단형화
let float = Some(5.0);     // Option<f64>로 단형화
```

컴파일러는 위 코드를 마치 `Option_i32`, `Option_f64`처럼 구체화된 별도의 코드로 펼칩니다. 따라서 런타임에 타입을 확인하는 비용이 전혀 없고, 손으로 각 타입을 작성한 것과 동일한 성능을 냅니다. 아래 그림이 이 "복제" 과정을 한눈에 보여줍니다.

<figure class="post-figure">
<svg role="img" aria-label="단형화 과정을 보여주는 그림. 왼쪽에는 제네릭 함수 largest of T가 하나의 틀로 있고, 컴파일 화살표를 지나면 오른쪽에서 i32 전용 largest_i32와 char 전용 largest_char 두 개의 구체 함수로 복제된다. 아래에는 런타임 타입 검사 비용이 0이라는 설명이 붙는다." viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg">
  <title>단형화(monomorphization) — 제네릭 함수가 컴파일 시 구체 타입별 전용 코드로 복제된다</title>

  <text x="118" y="26" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700" opacity="0.75">작성한 코드 (제네릭)</text>
  <rect x="32" y="62" width="172" height="56" rx="4" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="118" y="88" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700">largest&lt;T&gt;</text>
  <text x="118" y="106" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.75">하나의 틀, 모든 타입</text>

  <!-- compile arrow -->
  <line x1="210" y1="90" x2="282" y2="90" stroke="var(--secondary-color)" stroke-width="2.5" marker-end="url(#mono-arrow)"/>
  <text x="246" y="80" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">컴파일</text>
  <text x="246" y="104" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.7">단형화</text>

  <text x="468" y="26" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700" opacity="0.75">생성된 코드 (구체 타입별)</text>
  <rect x="300" y="50" width="200" height="40" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="400" y="75" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">largest_i32(&amp;[i32])</text>
  <rect x="300" y="100" width="200" height="40" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="400" y="125" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">largest_char(&amp;[char])</text>
  <text x="552" y="74" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.6">…</text>
  <text x="552" y="124" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.6">…</text>

  <line x1="160" y1="180" x2="480" y2="180" stroke="currentColor" stroke-width="1" opacity="0.2"/>
  <text x="320" y="206" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700" opacity="0.75">런타임 타입 검사 비용 = 0 · 손으로 쓴 코드와 동일한 성능</text>

  <defs>
    <marker id="mono-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
      <path d="M0,0 L9,4.5 L0,9 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>단형화 — 제네릭 <code>largest&lt;T&gt;</code> 하나가 컴파일 시점에 실제 사용된 타입마다 <code>largest_i32</code>, <code>largest_char</code> 같은 전용 함수로 복제된다. 그래서 런타임 타입 검사 비용이 전혀 없다.</figcaption>
</figure>

## 트레이트 (Traits)

트레이트는 여러 타입이 공유하는 공통 동작(메서드 시그니처의 집합)을 정의합니다. 다른 언어의 인터페이스와 비슷하지만, 기본 구현과 정교한 제약을 제공합니다.

### 트레이트 정의와 구현

`Summary` 트레이트는 "요약을 만들 수 있다"는 동작을 정의합니다.

```rust
pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct Tweet {
    pub username: String,
    pub content: String,
}

// Tweet 타입에 Summary 트레이트를 구현
impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("@{}: {}", self.username, self.content)
    }
}

fn main() {
    let tweet = Tweet {
        username: String::from("orchwang"),
        content: String::from("Rust 공부 중"),
    };
    println!("{}", tweet.summarize()); // @orchwang: Rust 공부 중
}
```

### 기본 메서드 구현

트레이트는 메서드의 기본 구현을 제공할 수 있습니다. 구현 타입이 별도로 재정의하지 않으면 기본 동작을 그대로 사용합니다.

```rust
pub trait Summary {
    fn summarize_author(&self) -> String;

    // 기본 구현: summarize_author를 호출해 미리보기 텍스트를 만든다
    fn preview(&self) -> String {
        format!("{}의 글을 더 읽어보세요...", self.summarize_author())
    }
}

impl Summary for Tweet {
    fn summarize_author(&self) -> String {
        format!("@{}", self.username)
    }
    // preview()는 재정의하지 않고 기본 구현을 사용
}
```

### 트레이트 바운드 (Trait Bound)

특정 트레이트를 구현한 타입만 매개변수로 받고 싶을 때 트레이트 바운드를 사용합니다. 간단한 경우 `impl Trait` 문법이 읽기 좋습니다.

```rust
// impl Trait 문법: "Summary를 구현한 어떤 타입"을 받는다
fn notify(item: &impl Summary) {
    println!("새 소식! {}", item.summarize());
}

// 위와 동치인 제네릭 문법
fn notify_generic<T: Summary>(item: &T) {
    println!("새 소식! {}", item.summarize());
}
```

`T: Summary`라는 바운드는 "이 자리에는 `Summary`를 구현한 타입만 들어올 수 있다"는 문(gate)입니다. 아래 그림처럼 바운드를 통과한 타입만 함수 안에서 `summarize()`를 호출할 수 있습니다.

<figure class="post-figure">
<svg role="img" aria-label="트레이트 바운드를 보여주는 그림. 왼쪽에 Tweet, Article, Image 세 후보 타입이 있고, 가운데에 T가 Summary를 구현해야 한다는 바운드 문이 있다. Summary를 구현한 Tweet과 Article은 통과해 오른쪽 notify 함수로 들어가 summarize 메서드를 호출할 수 있지만, Summary를 구현하지 않은 Image는 컴파일 에러로 막힌다." viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
  <title>트레이트 바운드(T: Summary) — Summary를 구현한 타입만 함수에 들어와 공통 메서드를 쓸 수 있다</title>

  <!-- candidate types -->
  <text x="74" y="26" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700" opacity="0.75">후보 타입</text>
  <rect x="24" y="44" width="100" height="32" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="74" y="64" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="700">Tweet : Summary</text>
  <rect x="24" y="106" width="100" height="32" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="74" y="126" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="700">Article : Summary</text>
  <rect x="24" y="168" width="100" height="32" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8" stroke-dasharray="4 3" opacity="0.7"/>
  <text x="74" y="188" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.7" font-weight="700">Image (미구현)</text>

  <!-- the bound gate -->
  <rect x="240" y="86" width="120" height="72" rx="5" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2.5"/>
  <text x="300" y="116" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700">T: Summary</text>
  <text x="300" y="136" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.75">바운드 = 통과 조건</text>

  <!-- pass-through edges -->
  <line x1="124" y1="60" x2="238" y2="104" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#tb-arrow)"/>
  <line x1="124" y1="122" x2="238" y2="122" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#tb-arrow)"/>
  <!-- blocked edge -->
  <line x1="124" y1="184" x2="200" y2="160" stroke="var(--accent-color)" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="200" y="178" text-anchor="middle" font-size="9" fill="var(--accent-color)" font-weight="700">컴파일 에러로 차단</text>

  <!-- function that gets the bounded T -->
  <line x1="360" y1="122" x2="430" y2="122" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#tb-arrow)"/>
  <rect x="432" y="92" width="184" height="60" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="524" y="116" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">notify(item: &amp;T)</text>
  <text x="524" y="136" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.8">item.summarize() 호출 가능</text>

  <text x="320" y="230" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700" opacity="0.7">하나의 함수가 Summary를 가진 모든 타입에 공통으로 동작</text>

  <defs>
    <marker id="tb-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>트레이트 바운드 <code>T: Summary</code>는 통과 조건 문(gate)이다 — <code>Summary</code>를 구현한 <code>Tweet</code>·<code>Article</code>은 함수로 들어가 <code>summarize()</code>를 호출하지만, 미구현인 <code>Image</code>는 컴파일 단계에서 막힌다. 그래서 하나의 함수가 공통 행동을 가진 여러 타입을 안전하게 받는다.</figcaption>
</figure>

매개변수가 여러 개일 때 같은 타입을 강제하려면 `<T: Summary>` 형태가 더 명확합니다. 바운드가 복잡해지면 `where` 절로 분리해 가독성을 높일 수 있습니다.

```rust
use std::fmt::{Debug, Display};

// where 절로 제약을 함수 시그니처 뒤에 모아 둔다
fn some_function<T, U>(t: &T, u: &U) -> i32
where
    T: Display + Clone,
    U: Clone + Debug,
{
    println!("{t}");
    0
}
```

## 라이프타임 (Lifetimes)

라이프타임은 참조(reference)가 유효한 범위를 컴파일러에 알려주는 또 다른 종류의 제네릭입니다. 목적은 단 하나, **댕글링 참조(dangling reference)**를 컴파일 시점에 막는 것입니다.

### 댕글링 참조 문제

이미 해제된 메모리를 가리키는 참조를 댕글링 참조라고 합니다. Rust는 이런 코드를 아예 컴파일하지 않습니다.

```rust
fn main() {
    let r;                // r은 아직 아무것도 가리키지 않음
    {
        let x = 5;
        r = &x;           // x를 빌림
    }                     // 여기서 x가 drop된다
    // println!("{}", r); // 컴파일 에러: x가 r보다 먼저 사라짐
}
```

`r`이 가리키던 `x`가 내부 블록 끝에서 사라지므로, 빌림 검사기(borrow checker)는 이를 거부합니다. 아래 그림은 `r`의 라이프타임이 `x`의 짧은 수명을 넘어서면서 댕글링이 발생하는 지점을 보여줍니다.

<figure class="post-figure">
<svg role="img" aria-label="라이프타임이 댕글링 참조를 막는 원리를 보여주는 그림. 위쪽 막대는 참조 r의 라이프타임으로 바깥 블록 전체에 걸쳐 길게 살아 있다. 아래쪽 짧은 막대는 값 x의 라이프타임으로 안쪽 블록에서만 살아 있다. x가 drop되는 지점 이후로 r이 계속 살아 있는 빨간 구간이 댕글링 참조이며, 컴파일러는 이 구간 때문에 코드를 거부한다." viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg">
  <title>라이프타임이 댕글링 참조를 막는 원리 — 참조 r이 가리키는 값 x의 수명을 넘어서면 컴파일 거부</title>

  <!-- time axis -->
  <text x="40" y="30" font-size="9" fill="currentColor" opacity="0.7" font-weight="700">시간 →</text>
  <line x1="40" y1="40" x2="600" y2="40" stroke="currentColor" stroke-width="1" opacity="0.3"/>

  <!-- reference r lifetime (long) -->
  <text x="36" y="76" text-anchor="end" font-size="10" fill="currentColor" font-weight="700">참조 r</text>
  <rect x="60" y="64" width="500" height="22" rx="4" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="200" y="80" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.8">r은 바깥 블록 끝까지 살아 있음</text>

  <!-- value x lifetime (short, inner block) -->
  <text x="36" y="124" text-anchor="end" font-size="10" fill="currentColor" font-weight="700">값 x</text>
  <rect x="150" y="112" width="170" height="22" rx="4" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="235" y="128" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.85">x는 안쪽 블록에서만 살아 있음</text>
  <text x="150" y="106" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.7">{ 시작</text>

  <!-- drop point marker -->
  <line x1="320" y1="56" x2="320" y2="160" stroke="var(--accent-color)" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="320" y="174" text-anchor="middle" font-size="9" fill="var(--accent-color)" font-weight="700">} 여기서 x가 drop</text>

  <!-- dangling region: r still alive after x dropped -->
  <rect x="320" y="64" width="240" height="22" rx="4" fill="none" stroke="var(--accent-color)" stroke-width="2.5"/>
  <text x="440" y="80" text-anchor="middle" font-size="8.5" fill="var(--accent-color)" font-weight="700">댕글링 구간 — r이 죽은 x를 가리킴</text>

  <line x1="80" y1="204" x2="560" y2="204" stroke="currentColor" stroke-width="1" opacity="0.2"/>
  <text x="320" y="228" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700" opacity="0.75">규칙: 참조의 라이프타임 'a는 가리키는 값의 수명 안에 들어와야 한다 → 안 되면 컴파일 거부</text>
</svg>
<figcaption>라이프타임의 핵심 규칙 — 참조 <code>r</code>의 유효 범위는 가리키는 값 <code>x</code>의 수명 안에 완전히 들어와야 한다. <code>x</code>가 먼저 drop되면 그 뒤로 <code>r</code>이 죽은 메모리를 가리키는 <strong>댕글링 구간</strong>이 생기고, 빌림 검사기는 바로 이 구간 때문에 컴파일을 거부한다.</figcaption>
</figure>

### 함수 시그니처의 라이프타임 애너테이션

두 문자열 슬라이스 중 더 긴 쪽을 반환하는 `longest` 함수를 봅시다. 반환되는 참조가 두 입력 중 어느 것에서 왔는지 컴파일러가 알 수 없으므로, 라이프타임 `'a`로 관계를 명시해야 합니다.

```rust
// 입력 두 참조와 반환 참조가 모두 같은 라이프타임 'a를 공유한다
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let s1 = String::from("긴 문자열");
    let s2 = String::from("짧음");
    let result = longest(s1.as_str(), s2.as_str());
    println!("더 긴 문자열: {}", result);
}
```

`'a`는 "반환된 참조는 `x`와 `y` 둘 다가 살아 있는 동안에만 유효하다"는 약속입니다. 메모리 수명을 직접 바꾸는 것이 아니라, 컴파일러가 검증할 수 있도록 관계를 기술할 뿐입니다.

### 구조체에 참조 저장하기

구조체가 참조 필드를 가지면, 그 구조체 인스턴스는 참조보다 더 오래 살 수 없습니다. 이 제약을 라이프타임으로 표시합니다.

```rust
// part 참조가 살아 있는 동안에만 ImportantExcerpt 인스턴스가 유효하다
struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("어제. 오늘. 내일.");
    let first_sentence = novel.split('.').next().unwrap();
    let excerpt = ImportantExcerpt {
        part: first_sentence,
    };
    println!("발췌: {}", excerpt.part);
}
```

### 라이프타임 생략 규칙 (Elision)

대부분의 경우 라이프타임을 직접 쓰지 않아도 되는데, 컴파일러가 **생략 규칙(lifetime elision rules)**으로 라이프타임을 추론하기 때문입니다. 예를 들어 입력 참조가 하나면 그 라이프타임이 모든 출력 참조에 적용됩니다.

```rust
// 명시적으로 쓴 라이프타임...
fn first_word<'a>(s: &'a str) -> &'a str {
    s.split(' ').next().unwrap()
}

// 생략 규칙 덕분에 아래처럼 써도 컴파일러가 동일하게 추론한다
fn first_word_elided(s: &str) -> &str {
    s.split(' ').next().unwrap()
}
```

이 규칙 덕분에 명백한 경우에는 `'a`를 생략할 수 있어 코드가 한결 간결해집니다. 규칙으로 추론되지 않는 모호한 경우에만 직접 애너테이션을 달면 됩니다.

## 마무리

제네릭은 타입에 구애받지 않는 코드를 단형화로 비용 없이 작성하게 해주고, 트레이트는 타입이 공유할 동작을 정의하며 바운드로 제약을 표현합니다. 라이프타임은 참조의 유효 범위를 명시해 댕글링 참조를 컴파일 시점에 차단합니다. 이 세 가지를 함께 쓰면 안전하면서도 추상적인 코드를 작성할 수 있습니다.

### 다음 학습

- [Rust 스마트 포인터, 동시성, 그리고 프로젝트](/2026/01/09/rust-smart-pointers-concurrency-and-projects.html)
- 트레이트 객체(`dyn Trait`)와 정적 디스패치 vs 동적 디스패치
- 연관 타입(associated type)과 제네릭 바운드의 차이
- [Rust Essential Curriculum](/2026/01/02/rust-essential-curriculum.html)
