---
layout: post
title: "Rust Essential Curriculum"
date: 2026-01-02
categories: [Technology, Rust]
series: Rust-Essential
tags: [rust, curriculum]
published: true
banner: wartable
excerpt: "Rust를 기초 문법부터 소유권, 트레이트, 동시성, TDD까지 8단계로 정복하는 종합 학습 로드맵입니다. 도장깨기 방식으로 진행 상황을 추적합니다."
---

## 소개

Rust는 가비지 컬렉터(GC) 없이도 메모리 안전성과 데이터 레이스 없는 동시성을 컴파일 타임에 보장하는 시스템 프로그래밍 언어입니다. 그만큼 학습 곡선(Learning Curve)이 가파른 것으로 유명하지만, 체계적인 순서로 접근하면 "컴파일러와의 싸움"을 "컴파일러와의 협업"으로 바꿀 수 있습니다.

이 커리큘럼은 `Rust-Essential` 시리즈의 마스터 로드맵입니다. 기초 문법과 환경 설정부터 소유권 시스템, 제네릭·트레이트·라이프타임, 동시성, 그리고 TDD까지 8단계로 구성했으며, 각 항목을 정복할 때마다 체크박스를 채워 나가는 **도장깨기** 방식으로 진행 상황을 추적합니다. 언어 전반에 대한 개괄은 [Rust lang 개요](/2026/01/03/rust-lang-개요.html)를 먼저 읽어보길 권합니다.

## 학습 진행 현황

> 완료한 항목에는 상세 포스트 링크가 연결되어 있습니다. 학습이 진행될 때마다 체크박스와 진행률을 갱신합니다.

- 현재 완료한 항목: **7개**
- 전체 항목: **24개**
- 진행률: **29%**

## 1단계: 기초 문법과 환경 설정

Rust 개발을 시작하기 위한 도구를 설치하고, 언어의 기본 구성 요소를 익히는 단계입니다. 자세한 내용은 [Rust 기초 문법과 환경 설정](/2026/01/04/rust-basic-syntax-and-setup.html) 포스트에서 다룹니다.

- [x] **Rust 설치**: `rustup` 툴체인으로 `rustc`/`cargo` 설치 — [[상세](/2026/01/04/rust-basic-syntax-and-setup.html)]
- [x] **Hello World & Cargo**: `cargo new`, `cargo run`과 `Cargo.toml` 구조 — [[상세](/2026/01/04/rust-basic-syntax-and-setup.html)]
- [x] **변수·가변성·타입·함수**: `let`, `mut`, 스칼라/복합 타입, 함수와 표현식 — [[상세](/2026/01/04/rust-basic-syntax-and-setup.html)]
- [x] **흐름 제어**: `if` 표현식, `loop`/`while`/`for`, `Range` — [[상세](/2026/01/04/rust-basic-syntax-and-setup.html)]

## 2단계: 소유권(Ownership) 시스템

Rust의 가장 독창적이고 중요한 개념으로, 메모리 안전성의 토대가 됩니다. 자세한 내용은 [Rust 소유권(Ownership) 시스템 이해하기](/2026/01/05/rust-ownership.html) 포스트에서 다룹니다.

- [x] **소유권 규칙**: 이동(Move)과 복사(Copy), 스코프와 `drop` — [[상세](/2026/01/05/rust-ownership.html)]
- [x] **빌림(Borrowing)**: 불변 참조(`&`)와 가변 참조(`&mut`), 빌림 규칙 — [[상세](/2026/01/05/rust-ownership.html)]
- [x] **슬라이스(Slice)**: 문자열·배열의 연속 요소 참조 — [[상세](/2026/01/05/rust-ownership.html)]

## 3단계: 구조적 데이터와 패턴 매칭

데이터를 의미 있는 단위로 묶고, 그 형태에 따라 분기하는 방법을 배웁니다.

- [ ] **Structs**: 필드 구조체, 튜플 구조체, 메서드(`impl`)
- [ ] **Enums & `Option<T>`**: 열거형 정의와 널 안전성을 위한 `Option`
- [ ] **Pattern Matching**: `match` 흐름 제어와 `if let`

## 4단계: 에러 처리와 컬렉션

실용적인 프로그램을 작성하는 데 필수적인 표준 컬렉션과 에러 처리 패러다임을 다룹니다.

- [ ] **Collections**: `Vec<T>`, `String`, `HashMap<K, V>`
- [ ] **Error Handling**: 복구 가능한 에러(`Result<T, E>`)와 복구 불가능한 에러(`panic!`), `?` 연산자

## 5단계: 제네릭, 트레이트, 라이프타임

코드 중복을 줄이고 추상화하는 Rust의 핵심 도구이자, 컴파일러를 가장 깊이 이해해야 하는 단계입니다.

- [ ] **Generics**: 타입 매개변수를 이용한 데이터 타입·함수의 추상화
- [ ] **Traits**: 공통 동작 정의(타 언어의 인터페이스 유사), 트레이트 바운드
- [ ] **Lifetimes**: 참조자의 유효 범위 검증과 라이프타임 명시(`'a`)

## 6단계: 고급 기능 및 프로젝트

스마트 포인터와 동시성을 익히고, 작은 실전 프로젝트로 지식을 통합합니다.

- [ ] **Smart Pointers**: `Box<T>`, `Rc<T>`, `RefCell<T>`와 내부 가변성
- [ ] **Concurrency**: 스레드, 메시지 패싱(`channel`), 공유 상태(`Mutex`, `Arc`)
- [ ] **Automated Tests**: `#[test]` 단위 테스트와 통합 테스트 작성
- [ ] **I/O Project**: 커맨드 라인 도구 만들기 (예: 미니 `grep` 구현)

## 7단계: 디버깅 및 프로파일링

작성한 코드의 동작을 추적하고 성능을 정량적으로 측정하는 방법을 다룹니다.

- [ ] **Debugging**: `dbg!` 매크로 활용, `gdb`/`lldb` 디버거 연동
- [ ] **Profiling**: `criterion` 크레이트 벤치마킹, Flamegraph 등 성능 분석

## 8단계: TDD with Rust

테스트를 먼저 작성하며 견고한 코드를 만들어 가는 개발 방법론을 Rust 생태계에 적용합니다.

- [ ] **TDD 사이클**: Red-Green-Refactor 사이클 이해 및 적용
- [ ] **Mocking**: `mockall` 등 크레이트를 활용한 테스트 더블 작성
- [ ] **Integration Testing**: 라이브러리 구조(`tests/` 디렉토리)와 통합 테스트 패턴

## 핵심 포인트

- **순서를 지키세요**: 소유권(2단계)을 건너뛰면 이후 모든 단계에서 컴파일러와 헤매게 됩니다. 토대부터 단단히 다지는 것이 가장 빠른 길입니다.
- **컴파일러를 신뢰하세요**: Rust 컴파일러의 에러 메시지는 매우 친절합니다. 에러를 적으로 보지 말고, 더 안전한 코드로 안내하는 가이드로 활용하세요.
- **손으로 익히세요**: `rustlings`로 작은 코드를 직접 고치고, `cargo`로 직접 빌드·테스트하며 감각을 익히는 것이 핵심입니다.
- **추상화는 천천히**: 제네릭·트레이트·라이프타임(5단계)은 한 번에 이해되지 않습니다. 반복해서 마주치며 자연스럽게 체화하세요.

## 추천 학습 자료

1. **The Rust Programming Language (The Book)**: 공식 문서이자 최고의 입문서입니다.
2. **Rustlings**: 작은 코드를 수정하며 배우는 실습형 튜토리얼입니다.
3. **Rust by Example**: 예제 코드를 통해 개념을 빠르게 확인하는 방식입니다.

## 결론

Rust 학습은 처음에는 컴파일러와의 싸움처럼 느껴지지만, 그 과정을 통해 더 안전하고 견고한 코드를 작성하는 습관을 기를 수 있습니다. 이 커리큘럼을 나침반 삼아 각 단계를 하나씩 정복하고, 완료할 때마다 체크박스를 채워 나가며 진행 상황을 시각적으로 확인해 보세요.

### 다음 학습

- [Rust lang 개요](/2026/01/03/rust-lang-개요.html) — 언어의 특징과 전체 학습 로드맵 개괄
- [Rust 기초 문법과 환경 설정](/2026/01/04/rust-basic-syntax-and-setup.html) — 1단계: 환경 설정과 기본 문법
- [Rust 소유권(Ownership) 시스템 이해하기](/2026/01/05/rust-ownership.html) — 2단계: 소유권·빌림·슬라이스
- **다음 정복 대상**: 3단계 구조적 데이터와 패턴 매칭 (Structs, Enums, `match`)
