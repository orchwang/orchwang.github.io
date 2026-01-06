---
layout: post
title: "Rust 기초 문법과 환경 설정"
date: 2026-01-04
categories: [Technology, Rust]
tags: [rust, basic, setup]
series: Rust-Essential
published: true
excerpt: "Rust 개발 환경 설정부터 Hello World, 그리고 변수와 제어문 등 기초 문법을 다룹니다."
---

## 들어가며

Rust 학습 로드맵의 첫 번째 단계인 기초 문법과 환경 설정에 대해 다룹니다. Rust를 시작하기 위해 필요한 도구를 설치하고, 간단한 프로그램을 작성하며 언어의 기본적인 구성 요소를 익혀봅시다.

## 1. Rust 설치 및 환경 설정

Rust를 설치하는 가장 표준적인 방법은 `rustup` 도구를 사용하는 것입니다. `rustup`은 Rust 버전 관리 및 툴체인 설치를 담당합니다.

### 설치 (macOS/Linux)

터미널에서 다음 명령어를 실행합니다.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

설치가 완료되면 쉘을 재시작하거나 환경 변수를 로드해야 합니다.

```bash
source $HOME/.cargo/env
```

### 설치 확인

설치가 정상적으로 되었는지 확인합니다.

```bash
rustc --version
cargo --version
```

- `rustc`: Rust 컴파일러
- `cargo`: Rust의 패키지 관리자이자 빌드 시스템

## 2. Hello World와 Cargo

Rust 생태계에서 `cargo`는 프로젝트 생성, 의존성 관리, 빌드, 테스트 등을 수행하는 핵심 도구입니다.

### 프로젝트 생성

`cargo`를 사용하여 새 프로젝트를 생성합니다.

```bash
cargo new hello_rust
cd hello_rust
```

### 디렉토리 구조

생성된 프로젝트의 구조는 다음과 같습니다.

```
hello_rust
├── Cargo.toml
└── src
    └── main.rs
```

- **Cargo.toml**: 프로젝트의 메타데이터와 의존성(dependencies)을 정의하는 파일입니다. (Node.js의 `package.json`과 유사)
- **src/main.rs**: 소스 코드 파일입니다.

### 실행

`src/main.rs`에는 기본적으로 Hello World 코드가 작성되어 있습니다.

```rust
fn main() {
    println!("Hello, world!");
}
```

프로젝트를 빌드하고 실행하려면 다음 명령어를 사용합니다.

```bash
cargo run
```

## 3. 기본 문법

### 변수와 가변성 (Variables and Mutability)

Rust의 변수는 기본적으로 **불변(immutable)**입니다. 값을 변경하려면 `mut` 키워드를 사용해야 합니다.

```rust
fn main() {
    let x = 5;
    println!("The value of x is: {x}");
    // x = 6; // 컴파일 에러 발생! 불변 변수에 값을 재할당할 수 없음

    let mut y = 5;
    println!("The value of y is: {y}");
    y = 6; // 가능
    println!("The value of y is: {y}");
}
```

### 데이터 타입 (Data Types)

Rust는 정적 타입 언어이지만, 컴파일러가 타입을 추론할 수 있는 경우가 많습니다.

- **스칼라 타입**: 정수형(Integer), 부동소수점(Float), 불리언(Boolean), 문자(Char)
- **복합 타입**: 튜플(Tuple), 배열(Array)

### 함수 (Functions)

`fn` 키워드로 함수를 선언합니다. 매개변수의 타입과 반환 타입을 명시해야 합니다.

```rust
fn main() {
    let result = add(5, 10);
    println!("Result: {result}");
}

fn add(x: i32, y: i32) -> i32 {
    x + y // 세미콜론이 없으면 표현식(Expression)으로 간주되어 반환값이 됨
}
```

### 흐름 제어 (Control Flow)

#### if 표현식

```rust
fn main() {
    let number = 3;

    if number < 5 {
        println!("condition was true");
    } else {
        println!("condition was false");
    }

    // if는 표현식이므로 변수에 할당 가능
    let condition = true;
    let number = if condition { 5 } else { 6 };
}
```

#### 반복문 (Loop, While, For)

- **loop**: 무한 루프
- **while**: 조건부 루프
- **for**: 컬렉션 순회

```rust
fn main() {
    // loop
    let mut counter = 0;
    let result = loop {
        counter += 1;
        if counter == 10 {
            break counter * 2; // 값을 반환하며 루프 종료
        }
    };

    // while
    let mut number = 3;
    while number != 0 {
        println!("{number}!");
        number -= 1;
    }

    // for
    let a = [10, 20, 30, 40, 50];
    for element in a {
        println!("the value is: {element}");
    }

    // Range 사용
    for number in (1..4).rev() {
        println!("{number}!");
    }
}
```

## 마무리

이번 글에서는 Rust 개발 환경을 설정하고, 가장 기초적인 문법 요소들을 살펴보았습니다. 다음 단계에서는 Rust의 가장 독특하고 중요한 특징인 **소유권(Ownership)** 시스템에 대해 깊이 있게 다뤄보겠습니다.
