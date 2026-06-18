---
layout: post
title: "Rust 스마트 포인터, 동시성, 그리고 프로젝트"
date: 2026-01-09
categories: [Technology, Rust]
tags: [rust, smart-pointer, concurrency, testing]
series: Rust-Essential
published: true
excerpt: "스마트 포인터(Box, Rc, RefCell), 동시성(스레드·채널·Mutex/Arc), 자동화 테스트, 그리고 미니 grep CLI 프로젝트로 지식을 통합합니다."
---

## 들어가며

이번 글은 로드맵의 6단계로, 지금까지 쌓아 온 기초를 고급 기능과 작은 프로젝트로 통합하는 단계입니다. 스마트 포인터로 힙과 소유권을 더 유연하게 다루고, 동시성으로 여러 스레드를 안전하게 협업시키며, 자동화 테스트로 코드를 검증한 뒤, 미니 `grep` CLI를 직접 만들어 봅니다. 이전 단계인 [Rust 제네릭, 트레이트, 라이프타임](/2026/01/08/rust-generics-traits-lifetimes.html)과 전체 흐름을 보여 주는 [Rust Essential Curriculum](/2026/01/02/rust-essential-curriculum.html)을 함께 참고하면 좋습니다.

<div class="post-summary-box" markdown="1">

### 📌 이 글에서 다루는 내용

#### 🔍 핵심 주제

- **Smart Pointers**: `Box<T>`, `Rc<T>`, `RefCell<T>`와 내부 가변성
- **Concurrency**: 스레드, 메시지 패싱(`channel`), 공유 상태(`Mutex`·`Arc`)
- **Automated Tests**: `#[test]`와 `cargo test`
- **I/O Project**: 미니 `grep` 커맨드라인 도구 만들기

</div>

## 스마트 포인터

스마트 포인터는 포인터처럼 동작하면서 추가 메타데이터와 기능을 갖는 데이터 구조입니다. Rust 표준 라이브러리는 소유권과 빌림 규칙을 다양한 상황에 맞게 확장하는 여러 스마트 포인터를 제공합니다.

### `Box<T>`: 힙 할당과 재귀 타입

`Box<T>`는 값을 스택이 아닌 힙에 저장하고, 스택에는 그 값을 가리키는 포인터만 남깁니다. 컴파일 타임에 크기를 알 수 없는 재귀 타입을 정의할 때 특히 유용합니다.

```rust
// cons list는 자기 자신을 참조하는 재귀 타입이라 Box로 간접 참조를 만든다.
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    // Box 덕분에 List의 크기가 컴파일 타임에 고정된다.
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));

    // Box<T>는 Deref를 구현하므로 내부 값에 투명하게 접근할 수 있다.
    if let Cons(value, _) = list {
        println!("첫 번째 값: {}", value); // 첫 번째 값: 1
    }
}
```

### `Rc<T>`: 참조 카운팅으로 다중 소유

`Rc<T>`(Reference Counted)는 하나의 값을 여러 소유자가 공유해야 할 때 사용합니다. `Rc::clone`은 데이터를 복사하지 않고 참조 카운트만 증가시키며, 마지막 소유자가 사라질 때 값이 해제됩니다. 단일 스레드 환경에서만 사용합니다.

```rust
use std::rc::Rc;

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    // a를 b와 c가 함께 소유하는 구조
    let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));
    println!("a 생성 후 카운트 = {}", Rc::strong_count(&a)); // 1

    let _b = Cons(3, Rc::clone(&a)); // 깊은 복사가 아니라 카운트 증가
    println!("b 생성 후 카운트 = {}", Rc::strong_count(&a)); // 2

    {
        let _c = Cons(4, Rc::clone(&a));
        println!("c 생성 후 카운트 = {}", Rc::strong_count(&a)); // 3
    }
    // c가 스코프를 벗어나면 카운트가 다시 감소한다.
    println!("c 해제 후 카운트 = {}", Rc::strong_count(&a)); // 2
}
```

### `RefCell<T>`: 내부 가변성과 런타임 borrow 검사

`RefCell<T>`는 *내부 가변성(interior mutability)*을 제공합니다. 즉, 불변 참조를 통해서도 내부 값을 변경할 수 있습니다. 컴파일 타임 대신 런타임에 빌림 규칙을 검사하며, 규칙을 어기면 `panic!`이 발생합니다.

```rust
use std::cell::RefCell;

fn main() {
    let data = RefCell::new(vec![1, 2, 3]);

    // 불변 바인딩이지만 borrow_mut으로 내부를 변경할 수 있다.
    data.borrow_mut().push(4);

    // borrow로 불변 참조를 얻는다. 동시에 borrow_mut을 또 빌리면 런타임 panic.
    println!("길이 = {}", data.borrow().len()); // 길이 = 4
}
```

### `Rc<RefCell<T>>` 조합 패턴

`Rc<T>`는 다중 소유를, `RefCell<T>`는 내부 가변성을 제공합니다. 두 가지를 결합하면 "여러 소유자가 공유하면서 변경도 가능한 값"을 만들 수 있습니다.

```rust
use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    // 여러 곳에서 공유하면서 값을 변경할 수 있는 셀
    let shared = Rc::new(RefCell::new(10));

    let a = Rc::clone(&shared);
    let b = Rc::clone(&shared);

    *a.borrow_mut() += 5; // a를 통해 내부 값 변경
    *b.borrow_mut() += 3; // b를 통해 내부 값 변경

    // 모든 소유자가 같은 값을 가리킨다.
    println!("최종 값 = {}", shared.borrow()); // 최종 값 = 18
}
```

## 동시성

Rust는 소유권 시스템 덕분에 데이터 경합(data race)을 컴파일 타임에 상당 부분 차단합니다. 이를 *fearless concurrency*라고 부릅니다.

### 스레드 생성과 `join`

`thread::spawn`으로 새 스레드를 만들고, `JoinHandle::join`으로 스레드가 끝날 때까지 기다립니다. `move` 클로저를 사용하면 캡처한 값의 소유권을 새 스레드로 옮길 수 있습니다.

```rust
use std::thread;

fn main() {
    let data = vec![1, 2, 3];

    // move 클로저로 data의 소유권을 새 스레드로 이동시킨다.
    let handle = thread::spawn(move || {
        let sum: i32 = data.iter().sum();
        println!("스레드 내부 합계 = {}", sum);
        sum
    });

    // join은 스레드의 반환값을 Result로 돌려준다.
    let result = handle.join().unwrap();
    println!("메인에서 받은 값 = {}", result);
}
```

### 메시지 패싱: `mpsc::channel`

스레드 간에 데이터를 공유하는 한 가지 방법은 메시지 패싱입니다. `mpsc::channel`(multiple producer, single consumer)은 송신자 `tx`와 수신자 `rx`를 만들어 주며, `tx.send`로 보내고 `rx.recv`로 받습니다.

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        for i in 1..=3 {
            // send는 값의 소유권을 채널로 넘긴다.
            tx.send(i).unwrap();
        }
    });

    // 채널이 닫힐 때까지 수신값을 순회한다.
    for received in rx {
        println!("수신: {}", received);
    }
}
```

### 공유 상태: `Mutex<T>`와 `Arc<T>`

여러 스레드가 같은 값을 변경해야 한다면 `Mutex<T>`로 한 번에 하나의 스레드만 접근하도록 보호합니다. 여러 스레드가 그 `Mutex`를 안전하게 공유하려면 스레드 안전한 참조 카운터 `Arc<T>`(Atomically Reference Counted)로 감쌉니다.

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // Arc로 감싸 여러 스레드가 동일한 Mutex를 공유한다.
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            // lock으로 MutexGuard를 얻고, 스코프가 끝나면 자동으로 해제된다.
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("최종 카운트 = {}", *counter.lock().unwrap()); // 최종 카운트 = 10
}
```

## 자동화 테스트

Rust는 테스트를 언어 차원에서 지원합니다. 함수에 `#[test]` 어트리뷰트를 붙이면 테스트 함수가 되고, `cargo test`로 모든 테스트를 실행합니다.

### 테스트 함수와 단언 매크로

`assert!`는 불리언이 `true`인지, `assert_eq!`는 두 값이 같은지 검사합니다. 패닉이 발생해야 정상인 경우에는 `#[should_panic]`을 사용합니다.

```rust
// 검증 대상 함수
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn divide(a: i32, b: i32) -> i32 {
    if b == 0 {
        panic!("0으로 나눌 수 없습니다");
    }
    a / b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn adds_two_numbers() {
        assert_eq!(add(2, 3), 5); // 두 값이 같은지 검사
    }

    #[test]
    fn result_is_positive() {
        assert!(add(1, 1) > 0); // 조건이 참인지 검사
    }

    #[test]
    #[should_panic(expected = "0으로 나눌 수 없습니다")]
    fn divide_by_zero_panics() {
        divide(10, 0); // 패닉이 발생해야 테스트 통과
    }
}
```

### 테스트 실행

```bash
# 전체 테스트 실행
cargo test

# 이름에 "divide"가 포함된 테스트만 실행
cargo test divide

# println! 출력까지 보고 싶을 때
cargo test -- --show-output
```

## 미니 프로젝트: minigrep

이제 지금까지 배운 라이프타임, `Result`, 컬렉션, 그리고 I/O를 하나로 합쳐 간단한 `grep` 클론을 만들어 봅니다. 파일에서 특정 문자열을 검색해 해당 줄을 출력하는 도구입니다.

### 인자 읽기

`std::env::args`로 커맨드라인 인자를 읽습니다. 인자 파싱 결과는 성공 또는 실패를 표현하는 `Result`로 돌려줍니다.

```rust
use std::env;
use std::process;

struct Config {
    query: String,
    file_path: String,
}

impl Config {
    // 인자가 부족하면 에러 메시지를 반환한다.
    fn build(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("사용법: minigrep <검색어> <파일경로>");
        }
        let query = args[1].clone();
        let file_path = args[2].clone();
        Ok(Config { query, file_path })
    }
}

fn main() {
    let args: Vec<String> = env::args().collect();

    // Result를 unwrap_or_else로 처리해 에러 시 정상 종료한다.
    let config = Config::build(&args).unwrap_or_else(|err| {
        eprintln!("인자 오류: {}", err);
        process::exit(1);
    });

    if let Err(e) = run(config) {
        eprintln!("실행 오류: {}", e);
        process::exit(1);
    }
}
```

### 파일 읽기와 검색 함수

`std::fs::read_to_string`으로 파일 전체를 문자열로 읽습니다. 검색 함수 `search`는 입력 문자열과 출력 슬라이스의 라이프타임을 연결해야 하므로 `'a`를 명시합니다. 반환된 줄들은 `contents`에서 빌린 것이므로 그 라이프타임에 묶입니다.

```rust
use std::error::Error;
use std::fs;

fn run(config: Config) -> Result<(), Box<dyn Error>> {
    // ? 연산자로 I/O 에러를 호출자에게 전파한다.
    let contents = fs::read_to_string(&config.file_path)?;

    for line in search(&config.query, &contents) {
        println!("{}", line);
    }
    Ok(())
}

// 반환되는 &str들은 contents에서 빌린 것이라 'a 라이프타임을 공유한다.
fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents
        .lines()
        .filter(|line| line.contains(query)) // 검색어를 포함하는 줄만 남긴다
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn finds_matching_line() {
        let query = "duct";
        let contents = "\
Rust:
safe, fast, productive.
Pick three.";
        // "productive."에 query가 포함되므로 한 줄만 매칭된다.
        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }
}
```

### 실행

```bash
# 빌드 후 실행
cargo run -- frog poem.txt

# 또는 릴리스 빌드 실행
cargo build --release
./target/release/minigrep frog poem.txt
```

이 작은 프로젝트는 라이프타임(`search<'a>`), `Result`와 `?` 연산자를 통한 에러 전파, 그리고 `Vec`·이터레이터 같은 컬렉션이 어떻게 자연스럽게 합쳐지는지 보여 줍니다. 앞 단계에서 따로 배운 개념들이 하나의 실용적인 도구로 통합되는 지점입니다.

## 마무리

스마트 포인터로 힙과 소유권을 유연하게 다루고, `Mutex`·`Arc`·채널로 안전한 동시성을 구현하며, `#[test]`로 코드를 검증하고, minigrep으로 이 모든 것을 통합했습니다. 이제 작성한 코드를 더 깊이 들여다보고 성능을 측정하는 도구로 넘어갈 차례입니다.

### 다음 학습

- [Rust 디버깅과 프로파일링](/2026/01/10/rust-debugging-and-profiling.html)
- 스마트 포인터 심화: `Weak<T>`로 순환 참조 끊기
- 동시성 심화: `async`/`await`와 비동기 런타임
- [Rust Essential Curriculum](/2026/01/02/rust-essential-curriculum.html)
