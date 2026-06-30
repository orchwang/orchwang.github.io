---
layout: post
title: "Rust 구조체, 열거형, 패턴 매칭"
date: 2026-01-06
categories: [Technology, Rust]
tags: [rust, struct, enum, pattern-matching]
series: Rust-Essential
published: true
excerpt: "Rust의 구조체(Struct), 열거형(Enum)과 Option, 그리고 match·if let 패턴 매칭으로 데이터를 안전하게 모델링하는 방법을 다룹니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="Rust의 데이터 모델링 세 축을 한 장으로 묶은 그림. 왼쪽은 구조체(Struct)로, username·email·active 세 필드를 하나의 User 상자로 묶는다. 가운데는 열거형(Enum)으로, Message라는 하나의 타입이 Quit·Move·Write·ChangeColor 네 변형 중 하나의 모습만 가진다. 오른쪽은 패턴 매칭(match)으로, 들어온 값이 어느 변형인지에 따라 갈래가 갈라지며 모든 변형을 빠짐없이 다룬다." viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg">
  <title>Rust 데이터 모델링 — Struct(필드 묶기) · Enum(여러 변형 중 하나) · match(변형별 분기)</title>

  <!-- ===== LEFT: Struct — bundle named fields into one type ===== -->
  <text x="113" y="24" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">구조체 = 묶기</text>
  <rect x="40" y="44" width="146" height="150" rx="4" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2.5"/>
  <text x="113" y="64" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">struct User</text>
  <rect x="54" y="78" width="118" height="28" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.6"/>
  <text x="113" y="96" text-anchor="middle" font-size="9.5" fill="currentColor">username: String</text>
  <rect x="54" y="112" width="118" height="28" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.6"/>
  <text x="113" y="130" text-anchor="middle" font-size="9.5" fill="currentColor">email: String</text>
  <rect x="54" y="146" width="118" height="28" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.6"/>
  <text x="113" y="164" text-anchor="middle" font-size="9.5" fill="currentColor">active: bool</text>
  <text x="113" y="212" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.8" font-weight="700">여러 필드를 한 타입에 모두</text>

  <!-- divider -->
  <line x1="232" y1="40" x2="232" y2="232" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- ===== MIDDLE: Enum — one type, one of several variants ===== -->
  <text x="338" y="24" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">열거형 = 택일</text>
  <rect x="262" y="44" width="152" height="150" rx="4" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="2.5"/>
  <text x="338" y="64" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">enum Message</text>
  <rect x="276" y="78" width="124" height="24" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.4"/>
  <text x="338" y="94" text-anchor="middle" font-size="9" fill="currentColor">Quit</text>
  <rect x="276" y="106" width="124" height="24" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.4"/>
  <text x="338" y="122" text-anchor="middle" font-size="9" fill="currentColor">Move { x, y }</text>
  <rect x="276" y="134" width="124" height="24" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.4"/>
  <text x="338" y="150" text-anchor="middle" font-size="9" fill="currentColor">Write(String)</text>
  <rect x="276" y="162" width="124" height="24" rx="3" fill="var(--bg-light)" stroke="var(--gold)" stroke-width="2"/>
  <text x="338" y="178" text-anchor="middle" font-size="9" fill="currentColor">ChangeColor(..)</text>
  <text x="338" y="212" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.8" font-weight="700">네 변형 중 단 하나의 모습</text>

  <!-- divider -->
  <line x1="460" y1="40" x2="460" y2="232" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- ===== RIGHT: match — branch per variant, exhaustively ===== -->
  <text x="575" y="24" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">match = 분기</text>
  <rect x="486" y="44" width="74" height="30" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="523" y="63" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">msg 값</text>
  <line x1="560" y1="59" x2="582" y2="86" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#rust-arrow)"/>
  <line x1="560" y1="59" x2="582" y2="118" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#rust-arrow)"/>
  <line x1="560" y1="59" x2="582" y2="150" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#rust-arrow)"/>
  <line x1="560" y1="59" x2="582" y2="182" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#rust-arrow)"/>
  <g font-size="9">
    <rect x="584" y="76" width="76" height="22" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.4"/>
    <text x="622" y="91" text-anchor="middle" fill="currentColor">Quit ⇒ …</text>
    <rect x="584" y="108" width="76" height="22" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.4"/>
    <text x="622" y="123" text-anchor="middle" fill="currentColor">Move ⇒ …</text>
    <rect x="584" y="140" width="76" height="22" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.4"/>
    <text x="622" y="155" text-anchor="middle" fill="currentColor">Write ⇒ …</text>
    <rect x="584" y="172" width="76" height="22" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
    <text x="622" y="187" text-anchor="middle" fill="currentColor">Color ⇒ …</text>
  </g>
  <text x="575" y="212" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.8" font-weight="700">모든 변형을 빠짐없이 처리</text>

  <defs>
    <marker id="rust-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>이 글의 세 축을 한 장으로 — <strong>구조체</strong>는 여러 필드를 한 타입으로 <em>묶고</em>, <strong>열거형</strong>은 여러 변형 중 <em>단 하나</em>의 모습을 가지며, <strong>match</strong>는 들어온 값이 어느 변형인지에 따라 <em>분기</em>하되 모든 변형을 빠짐없이 다룬다.</figcaption>
</figure>

## 들어가며

이 글은 Rust Essential 로드맵의 3단계로, 소유권 위에서 데이터를 어떻게 구조적으로 모델링하는지 다룹니다. 앞서 살펴본 [Rust 소유권(Ownership) 시스템 이해하기](/2026/01/05/rust-ownership.html)에서 메모리 안전성의 토대를 다졌다면, 이번에는 Struct·Enum·Pattern Matching으로 도메인을 정확하게 표현하는 방법을 배웁니다. 전체 학습 흐름은 [Rust Essential Curriculum](/2026/01/02/rust-essential-curriculum.html)에서 확인할 수 있습니다.

<div class="post-summary-box" markdown="1">

### 📌 이 글에서 다루는 내용

#### 🔍 핵심 주제

- **구조체(Struct)**: 필드 구조체, 튜플 구조체, 메서드와 `impl`
- **열거형(Enum)과 `Option<T>`**: variant에 데이터 담기, null 안전성
- **패턴 매칭**: `match` 흐름 제어와 `if let`

</div>

## 구조체(Struct)

Struct는 서로 연관된 여러 값을 하나의 이름 아래 묶는 사용자 정의 타입입니다. 각 값은 이름이 있는 필드(field)로 표현되므로, 튜플과 달리 의미를 코드에 직접 드러낼 수 있습니다.

### 정의, 인스턴스, 필드 접근

```rust
// 필드마다 이름과 타입을 명시한다
struct User {
    username: String,
    email: String,
    active: bool,
}

fn main() {
    // 인스턴스 생성: 모든 필드를 채워야 한다
    let user = User {
        username: String::from("orchwang"),
        email: String::from("dev@example.com"),
        active: true,
    };

    // 점(.) 표기로 필드에 접근한다
    println!("{} / {}", user.username, user.active);
}
```

### 가변성과 필드 초기화 단축

인스턴스를 `mut`으로 선언하면 필드 값을 바꿀 수 있습니다. 또한 변수 이름과 필드 이름이 같다면 `필드: 변수` 대신 이름만 적는 **field init shorthand**를 쓸 수 있습니다.

```rust
fn build_user(username: String, email: String) -> User {
    User {
        username, // username: username 의 단축형
        email,    // email: email 의 단축형
        active: true,
    }
}

fn main() {
    let mut user = build_user(String::from("orc"), String::from("a@b.io"));
    user.active = false; // mut 이므로 필드 변경 가능
    println!("{}", user.active);
}
```

### 구조체 업데이트 문법

기존 인스턴스의 나머지 필드를 그대로 재사용할 때는 `..` 문법을 씁니다.

```rust
fn main() {
    let base = User {
        username: String::from("base"),
        email: String::from("base@x.io"),
        active: true,
    };

    // email 만 새로 지정하고 나머지는 base 에서 가져온다
    let user = User {
        email: String::from("new@x.io"),
        ..base
    };
    println!("{}", user.username); // "base"
}
```

### 튜플 구조체와 유닛 구조체

필드 이름이 굳이 필요 없을 때는 **튜플 구조체**를, 데이터가 전혀 없을 때는 **유닛 구조체**를 쓸 수 있습니다.

```rust
// 튜플 구조체: 타입에 이름을 붙이되 필드명은 생략
struct Point(i32, i32);

// 유닛 구조체: 데이터 없이 타입만 존재 (trait 구현 표식 등에 유용)
struct Marker;

fn main() {
    let origin = Point(0, 0);
    println!("x = {}, y = {}", origin.0, origin.1); // 인덱스로 접근
    let _m = Marker;
}
```

## 메서드와 `impl` 블록

Struct에 동작을 부여하려면 `impl` 블록 안에 메서드를 정의합니다. 첫 인자가 `&self`인 함수는 인스턴스에 `.`으로 호출하고, `self`가 없는 함수는 **연관 함수(associated function)**로 타입 이름과 함께 호출합니다.

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // &self 메서드: 인스턴스를 빌려 읽기만 한다
    fn area(&self) -> u32 {
        self.width * self.height
    }

    // 연관 함수: Self 를 반환하는 생성자로 자주 쓴다
    fn square(size: u32) -> Self {
        Self {
            width: size,
            height: size,
        }
    }
}

fn main() {
    let rect = Rectangle::square(4); // 연관 함수는 :: 로 호출
    println!("area = {}", rect.area()); // 메서드는 . 으로 호출
}
```

## 열거형(Enum)

Enum은 "여러 후보 중 하나"를 표현하는 타입입니다. Rust의 Enum은 각 variant에 데이터를 직접 담을 수 있어, 단순 상수 집합을 넘어 강력한 모델링 도구가 됩니다.

```rust
// 각 variant 가 서로 다른 형태의 데이터를 담을 수 있다
enum Message {
    Quit,                       // 데이터 없음
    Move { x: i32, y: i32 },    // 구조체형 필드
    Write(String),              // 단일 값
    ChangeColor(i32, i32, i32), // 튜플형 값
}

fn main() {
    let msgs = [
        Message::Quit,
        Message::Move { x: 1, y: 2 },
        Message::Write(String::from("hi")),
        Message::ChangeColor(255, 0, 0),
    ];
    println!("총 {}개의 메시지", msgs.len());
}
```

아래 그림은 이 "합 타입(sum type)"의 핵심을 보여줍니다. 하나의 `enum` 타입이지만, 변형마다 **품는 데이터의 모양이 제각각**이고, 실제 값은 그중 **단 하나의 변형**으로만 존재합니다.

<figure class="post-figure">
<svg role="img" aria-label="합 타입(sum type) 개념도. 위쪽 Message enum은 Quit(데이터 없음), Move(x·y 두 정수), Write(문자열 하나), ChangeColor(정수 셋)처럼 변형마다 품는 데이터의 모양이 다르며, 실제 값은 그중 하나의 변형으로만 존재한다. 아래쪽 Option&lt;T&gt;는 Some(값이 있음)과 None(값이 없음) 두 변형으로, 값의 부재를 타입으로 표현해 null을 대체한다." viewBox="0 0 640 320" xmlns="http://www.w3.org/2000/svg">
  <title>합 타입(sum type) — 변형마다 다른 데이터를 품고, 값은 그중 하나의 변형으로만 존재한다</title>

  <!-- ===== TOP: Message — each variant carries a different shape ===== -->
  <text x="320" y="22" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">enum Message — 변형마다 다른 데이터 모양</text>

  <!-- Quit: no data -->
  <rect x="24" y="40" width="136" height="86" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="92" y="60" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">Quit</text>
  <rect x="56" y="74" width="72" height="34" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 3"/>
  <text x="92" y="95" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.75">데이터 없음</text>

  <!-- Move: { x, y } two ints -->
  <rect x="172" y="40" width="136" height="86" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="240" y="60" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">Move { x, y }</text>
  <rect x="190" y="74" width="46" height="34" rx="3" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.8"/>
  <text x="213" y="95" text-anchor="middle" font-size="9" fill="currentColor">x: i32</text>
  <rect x="244" y="74" width="46" height="34" rx="3" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.8"/>
  <text x="267" y="95" text-anchor="middle" font-size="9" fill="currentColor">y: i32</text>

  <!-- Write: one String -->
  <rect x="320" y="40" width="136" height="86" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="388" y="60" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">Write</text>
  <rect x="346" y="74" width="84" height="34" rx="3" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="1.8"/>
  <text x="388" y="95" text-anchor="middle" font-size="9" fill="currentColor">String 하나</text>

  <!-- ChangeColor: three ints -->
  <rect x="468" y="40" width="148" height="86" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="542" y="60" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">ChangeColor</text>
  <rect x="480" y="74" width="40" height="34" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="1.8"/>
  <text x="500" y="95" text-anchor="middle" font-size="8.5" fill="currentColor">i32</text>
  <rect x="522" y="74" width="40" height="34" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="1.8"/>
  <text x="542" y="95" text-anchor="middle" font-size="8.5" fill="currentColor">i32</text>
  <rect x="564" y="74" width="40" height="34" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="1.8"/>
  <text x="584" y="95" text-anchor="middle" font-size="8.5" fill="currentColor">i32</text>

  <text x="320" y="148" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.85" font-weight="700">실제 값은 이 넷 중 &#34;단 하나의 변형&#34;으로만 존재한다 (그래서 합 타입)</text>

  <!-- divider -->
  <line x1="40" y1="170" x2="600" y2="170" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- ===== BOTTOM: Option<T> — Some / None ===== -->
  <text x="320" y="198" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">Option&lt;T&gt; — &#34;값의 부재&#34;도 변형으로</text>

  <rect x="150" y="216" width="160" height="74" rx="4" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2.2"/>
  <text x="230" y="238" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">Some(T)</text>
  <rect x="180" y="250" width="100" height="30" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.6"/>
  <text x="230" y="270" text-anchor="middle" font-size="9" fill="currentColor">값이 들어 있음</text>

  <rect x="330" y="216" width="160" height="74" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.2"/>
  <text x="410" y="238" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">None</text>
  <rect x="360" y="250" width="100" height="30" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4 3"/>
  <text x="410" y="270" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.75">값이 없음 (null 대체)</text>

  <text x="320" y="308" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.85" font-weight="700">타입 시스템이 &#34;없을 수 있음&#34;을 늘 기억하게 만들어 NPE를 막는다</text>
</svg>
<figcaption>합 타입(sum type)의 핵심 — <strong>Message</strong>의 네 변형은 각각 <em>다른 모양의 데이터</em>를 품지만 값은 그중 하나뿐이고, <strong>Option&lt;T&gt;</strong>는 <code>Some</code>(있음)·<code>None</code>(없음) 두 변형으로 <em>값의 부재</em>까지 타입으로 못박아 null을 대체한다.</figcaption>
</figure>

## `Option<T>`로 null 다루기

Rust에는 null이 없습니다. 값이 있을 수도, 없을 수도 있는 상황은 표준 라이브러리의 `Option<T>` Enum으로 표현합니다. `Some(value)`는 값이 있음을, `None`은 없음을 뜻합니다.

```rust
fn main() {
    let some_number: Option<i32> = Some(5);
    let no_number: Option<i32> = None;

    // Option<i32> 와 i32 는 다른 타입이므로 직접 더할 수 없다.
    // 컴파일러가 "값이 없는 경우"를 강제로 처리하게 만들어 NPE 를 막는다.
    println!("{:?} {:?}", some_number, no_number);
}
```

null을 쓰는 언어에서는 "이 값이 비어 있을 수 있다"는 사실을 잊기 쉽지만, `Option<T>`는 타입 시스템이 그 사실을 항상 기억하게 만들어 줍니다.

## 패턴 매칭

`match`는 값을 여러 패턴과 차례로 비교하고, 일치하는 갈래(arm)의 코드를 실행합니다. 가장 큰 장점은 **빠짐없음(exhaustiveness)**으로, 모든 경우를 다루지 않으면 컴파일되지 않습니다.

다음 그림이 그 안전장치를 보여줍니다. 모든 변형에 갈래가 있어야 컴파일이 통과하고, 한 변형이라도 빠지면 컴파일러가 거부합니다. 나머지를 한꺼번에 받는 `_`도 "빠짐없음"을 채우는 한 방법입니다.

<figure class="post-figure">
<svg role="img" aria-label="match의 빠짐없음(exhaustiveness) 개념도. 왼쪽은 Option&lt;i32&gt;의 모든 변형(None, Some)을 각각 갈래로 다뤄 컴파일이 통과하는 모습. 오른쪽은 None 갈래를 빠뜨려 컴파일러가 거부하는 모습. 가장 오른쪽 아래는 언더스코어 와일드카드가 나머지 경우를 한 번에 받아 빠짐없음을 채우는 모습." viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg">
  <title>match의 빠짐없음(exhaustiveness) — 모든 변형을 다뤄야 컴파일된다</title>

  <!-- ===== LEFT: all arms covered → compiles ===== -->
  <text x="160" y="22" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">모든 갈래 다룸 → 통과</text>
  <rect x="36" y="60" width="84" height="40" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="78" y="78" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">Option&lt;i32&gt;</text>
  <text x="78" y="92" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.75">None | Some</text>
  <line x1="120" y1="74" x2="150" y2="100" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#me-arrow)"/>
  <line x1="120" y1="86" x2="150" y2="156" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#me-arrow)"/>
  <rect x="152" y="86" width="128" height="32" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.6"/>
  <text x="216" y="106" text-anchor="middle" font-size="9.5" fill="currentColor">None ⇒ None</text>
  <rect x="152" y="142" width="128" height="32" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.6"/>
  <text x="216" y="162" text-anchor="middle" font-size="9.5" fill="currentColor">Some(i) ⇒ Some(i+1)</text>
  <rect x="120" y="200" width="120" height="34" rx="4" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2.4"/>
  <text x="180" y="222" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">✓ 컴파일 OK</text>

  <!-- divider -->
  <line x1="320" y1="44" x2="320" y2="244" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- ===== RIGHT: a variant missing → rejected ===== -->
  <text x="480" y="22" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">한 갈래 빠짐 → 거부</text>
  <rect x="356" y="60" width="84" height="40" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="398" y="78" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">Option&lt;i32&gt;</text>
  <text x="398" y="92" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.75">None | Some</text>
  <line x1="440" y1="80" x2="470" y2="100" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#me-arrow)"/>
  <rect x="472" y="86" width="128" height="32" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.6"/>
  <text x="536" y="106" text-anchor="middle" font-size="9.5" fill="currentColor">Some(i) ⇒ Some(i+1)</text>
  <rect x="472" y="142" width="128" height="32" rx="3" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="1.8" stroke-dasharray="5 3"/>
  <text x="536" y="162" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.75">None ⇒ ??? (없음)</text>
  <rect x="420" y="200" width="160" height="34" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.4"/>
  <text x="500" y="222" text-anchor="middle" font-size="10.5" fill="currentColor" font-weight="700">✗ 컴파일 에러</text>
  <text x="480" y="262" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.8">나머지는 _ 로 한 번에 받아도 됨</text>

  <defs>
    <marker id="me-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>빠짐없음(exhaustiveness) — <strong>모든 변형</strong>에 갈래가 있어야 컴파일이 통과하고(왼쪽), <code>None</code>처럼 한 변형이라도 빠지면 컴파일러가 <em>거부</em>한다(오른쪽). 나머지를 한꺼번에 받는 <code>_</code>도 빠짐없음을 채우는 한 방법이다.</figcaption>
</figure>

### `match`와 값 바인딩

```rust
enum Coin {
    Penny,
    Quarter(String), // variant 안에 데이터를 담을 수 있다
}

fn value_in_cents(coin: Coin) -> u32 {
    match coin {
        Coin::Penny => 1,
        // 패턴이 variant 내부 값을 state 에 바인딩한다
        Coin::Quarter(state) => {
            println!("{} 주의 쿼터", state);
            25
        }
    }
}

fn main() {
    println!("{}", value_in_cents(Coin::Quarter(String::from("Texas"))));
}
```

### `_` placeholder와 `Option<T>` 매칭

모든 variant를 일일이 적기 번거로울 때는 나머지를 `_`로 처리합니다. `Option<T>` 매칭은 `None`과 `Some`을 모두 다뤄 안전하게 값을 꺼냅니다.

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,          // 값이 없으면 그대로 None
        Some(i) => Some(i + 1) // 있으면 내부 값을 꺼내 +1
    }
}

fn describe(n: u8) -> &'static str {
    match n {
        1 => "하나",
        2 => "둘",
        _ => "기타", // 나머지 모든 경우를 한 번에 처리
    }
}

fn main() {
    println!("{:?}", plus_one(Some(5))); // Some(6)
    println!("{:?}", plus_one(None));    // None
    println!("{}", describe(9));         // "기타"
}
```

### `if let`으로 간결하게

한 가지 패턴에만 관심이 있고 나머지는 무시하고 싶다면 `if let`이 더 읽기 좋습니다. `match` 한 갈래만 쓰는 보일러플레이트를 줄여 줍니다.

```rust
fn main() {
    let config: Option<u8> = Some(3);

    // Some 인 경우만 처리하고 None 은 무시한다
    if let Some(max) = config {
        println!("최대값: {}", max);
    } else {
        println!("설정 없음");
    }
}
```

## 마무리

Struct로 연관된 데이터를 묶고, Enum과 `Option<T>`로 "여러 상태 중 하나"와 "값의 부재"를 타입으로 표현하면, 잘못된 상태 자체가 컴파일 단계에서 걸러집니다. `match`의 빠짐없음과 `if let`의 간결함은 이렇게 모델링한 데이터를 안전하고 명확하게 다루도록 돕습니다.

### 다음 학습

- [Rust 에러 처리와 컬렉션](/2026/01/07/rust-error-handling-and-collections.html)
- [Rust Essential Curriculum](/2026/01/02/rust-essential-curriculum.html)
