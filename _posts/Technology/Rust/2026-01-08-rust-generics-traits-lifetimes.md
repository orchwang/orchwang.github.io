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

컴파일러는 위 코드를 마치 `Option_i32`, `Option_f64`처럼 구체화된 별도의 코드로 펼칩니다. 따라서 런타임에 타입을 확인하는 비용이 전혀 없고, 손으로 각 타입을 작성한 것과 동일한 성능을 냅니다.

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

`r`이 가리키던 `x`가 내부 블록 끝에서 사라지므로, 빌림 검사기(borrow checker)는 이를 거부합니다.

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
