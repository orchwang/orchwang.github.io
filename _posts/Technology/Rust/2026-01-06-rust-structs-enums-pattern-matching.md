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
