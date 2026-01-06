---
layout: post
title: "Rust 소유권(Ownership) 시스템 이해하기"
date: 2026-01-05
categories: [Technology, Rust]
tags: [rust, ownership, borrowing, slice]
series: Rust-Essential
published: true
excerpt: "Rust의 핵심 기능인 소유권, 빌림, 그리고 슬라이스에 대해 깊이 있게 다룹니다."
---

## 들어가며

Rust가 다른 언어와 차별화되는 가장 큰 특징은 바로 **소유권(Ownership)** 시스템입니다. 가비지 컬렉터(GC) 없이 메모리 안전성을 보장하기 위해 Rust는 컴파일 타임에 엄격한 규칙을 적용합니다. 이번 글에서는 소유권, 빌림(Borrowing), 그리고 슬라이스(Slice)에 대해 알아보겠습니다.

## 1. 소유권(Ownership)

소유권은 Rust 프로그램의 메모리 관리 규칙 모음입니다.

### 소유권 규칙

1.  Rust의 각각의 값은 해당 값의 **오너(Owner)**라고 불리는 변수가 있다.
2.  한 번에 딱 하나의 오너만 존재할 수 있다.
3.  오너가 스코프 밖으로 벗어나는 때, 값은 버려진다(dropped).

### 변수의 스코프

```rust
{                      // s는 아직 선언되지 않아서 유효하지 않음
    let s = "hello";   // s는 이 지점부터 유효함
    // s를 가지고 무언가 작업을 함
}                      // 이 스코프가 종료되고, s는 더 이상 유효하지 않음
```

### 이동(Move)

Rust에서는 힙에 저장된 데이터(예: `String`)를 다른 변수에 할당하면, 데이터 자체가 복사되는 것이 아니라 소유권이 이동합니다.

```rust
let s1 = String::from("hello");
let s2 = s1; // s1의 소유권이 s2로 이동 (Move)

// println!("{}, world!", s1); // 컴파일 에러! s1은 더 이상 유효하지 않음
println!("{}, world!", s2); // 가능
```

이는 이중 해제(Double Free) 에러를 방지하기 위함입니다.

### 복사(Copy)

스택에 저장되는 정수형과 같은 고정 크기 타입은 `Copy` 트레이트가 구현되어 있어, 변수 할당 시 값이 복사됩니다.

```rust
let x = 5;
let y = x; // x의 값이 y로 복사됨

println!("x = {}, y = {}", x, y); // 둘 다 사용 가능
```

## 2. 빌림(Borrowing)과 참조(References)

소유권을 넘기지 않고 값에 접근하고 싶을 때 **참조(Reference)**를 사용합니다. 이를 **빌림(Borrowing)**이라고 합니다.

### 불변 참조 (Immutable References)

`&` 기호를 사용하여 참조를 생성합니다.

```rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1); // 소유권 대신 참조를 전달

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
} // s가 스코프를 벗어나도, 소유권이 없으므로 아무 일도 일어나지 않음
```

### 가변 참조 (Mutable References)

값을 변경하려면 `&mut`을 사용해야 하며, 변수 자체도 `mut`이어야 합니다.

```rust
fn main() {
    let mut s = String::from("hello");
    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

**제약 사항**: 특정 스코프 내에서, 가변 참조는 오직 **하나만** 만들 수 있습니다. 또한 불변 참조가 이미 존재할 경우 가변 참조를 만들 수 없습니다. (데이터 레이스 방지)

## 3. 슬라이스(Slice)

슬라이스는 컬렉션(배열, 문자열 등)의 연속된 일부분을 참조하는 것입니다. 소유권을 갖지 않습니다.

### 문자열 슬라이스

```rust
let s = String::from("hello world");

let hello = &s[0..5];
let world = &s[6..11];
```

### 배열 슬라이스

```rust
let a = [1, 2, 3, 4, 5];
let slice = &a[1..3]; // [2, 3]
```

## 마무리

소유권 시스템은 Rust를 배우는 데 있어 가장 큰 진입 장벽이지만, 이를 이해하면 메모리 안전하고 효율적인 코드를 작성할 수 있습니다. 다음 단계에서는 Rust의 구조체(Structs)와 열거형(Enums)에 대해 다뤄보겠습니다.
