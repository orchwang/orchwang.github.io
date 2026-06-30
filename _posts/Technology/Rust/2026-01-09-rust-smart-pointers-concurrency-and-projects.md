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

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="Rust 스마트 포인터와 동시성을 한 장으로 묶은 그림. 왼쪽 위에는 스택의 포인터가 힙의 값을 가리키는 Box(힙 단일 소유), 그 아래에는 두 소유자가 하나의 값을 함께 가리키며 참조 카운트가 2인 Rc(공유 소유 카운트), 그 옆에는 불변 참조를 통해서도 내부를 바꾸는 RefCell(런타임 빌림 검사)가 그려진다. 오른쪽에는 세 스레드가 Arc로 같은 Mutex를 공유하고, Mutex 안의 값에는 한 번에 한 스레드만 자물쇠를 잡고 접근하는 동시성 구조가 있다." viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg">
  <title>Rust 스마트 포인터 &amp; 동시성 — Box(힙 단일 소유) · Rc(공유 카운트) · RefCell(런타임 빌림) · Arc&lt;Mutex&gt;(스레드 안전 공유)</title>

  <!-- ===== LEFT: smart pointers ===== -->
  <text x="166" y="22" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">스마트 포인터 (단일 스레드)</text>

  <!-- Box: stack pointer -> heap value -->
  <rect x="36" y="44" width="58" height="30" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="65" y="60" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">Box</text>
  <text x="65" y="70" text-anchor="middle" font-size="7" fill="currentColor" opacity="0.75">스택 포인터</text>
  <line x1="94" y1="59" x2="138" y2="59" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#sp-arrow)"/>
  <rect x="140" y="44" width="62" height="30" rx="3" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="171" y="60" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">힙 값</text>
  <text x="171" y="70" text-anchor="middle" font-size="7" fill="currentColor" opacity="0.75">단일 소유</text>

  <!-- Rc: two owners -> one value with count -->
  <rect x="22" y="112" width="50" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="47" y="129" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700">소유자 a</text>
  <rect x="22" y="150" width="50" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
  <text x="47" y="167" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700">소유자 b</text>
  <line x1="72" y1="125" x2="126" y2="138" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#sp-arrow)"/>
  <line x1="72" y1="163" x2="126" y2="148" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#sp-arrow)"/>
  <rect x="128" y="124" width="74" height="40" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="165" y="140" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">Rc 값</text>
  <text x="165" y="155" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">count = 2</text>

  <!-- RefCell: immutable ref but mutates inside -->
  <rect x="36" y="208" width="166" height="56" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="119" y="226" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">RefCell</text>
  <text x="119" y="240" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.8">불변 참조여도 borrow_mut으로 변경</text>
  <text x="119" y="254" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.8">빌림 규칙은 런타임에 검사</text>

  <!-- divider -->
  <line x1="252" y1="36" x2="252" y2="276" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- ===== RIGHT: concurrency Arc<Mutex<T>> ===== -->
  <text x="466" y="22" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">동시성 (여러 스레드)</text>

  <!-- three threads -->
  <g font-size="8.5" font-weight="700">
    <rect x="284" y="48" width="70" height="28" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
    <text x="319" y="66" text-anchor="middle" fill="currentColor">스레드 1</text>
    <rect x="284" y="86" width="70" height="28" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
    <text x="319" y="104" text-anchor="middle" fill="currentColor">스레드 2</text>
    <rect x="284" y="124" width="70" height="28" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
    <text x="319" y="142" text-anchor="middle" fill="currentColor">스레드 3</text>
  </g>

  <!-- Arc clones converge on one lock -->
  <line x1="354" y1="62" x2="420" y2="118" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#sp-arrow)"/>
  <line x1="354" y1="100" x2="420" y2="120" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#sp-arrow)"/>
  <line x1="354" y1="138" x2="420" y2="124" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#sp-arrow)"/>
  <text x="386" y="86" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.75">Arc::clone</text>

  <!-- Arc<Mutex<T>> box -->
  <rect x="422" y="78" width="180" height="92" rx="4" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="512" y="96" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">Arc&lt;Mutex&lt;T&gt;&gt;</text>
  <!-- lock -->
  <rect x="498" y="108" width="28" height="22" rx="2" fill="none" stroke="var(--accent-color)" stroke-width="2"/>
  <path d="M504,108 v-6 a8,8 0 0 1 16,0 v6" fill="none" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="512" y="124" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">🔒</text>
  <rect x="446" y="140" width="132" height="22" rx="2" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.6"/>
  <text x="512" y="155" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.85">한 번에 한 스레드만 접근</text>
  <text x="466" y="194" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.8" font-weight="700">Arc로 공유 · Mutex로 직렬화</text>

  <defs>
    <marker id="sp-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>이 글의 한 장 요약 — 왼쪽은 <strong>스마트 포인터</strong>(Box는 힙에 둔 값을 단일 소유, Rc는 여러 소유자가 한 값을 공유하며 카운트로 추적, RefCell은 런타임에 빌림을 검사해 내부 가변성을 허용), 오른쪽은 <strong>동시성</strong>(여러 스레드가 Arc로 같은 Mutex를 공유하고, 자물쇠로 한 번에 한 스레드만 접근하도록 직렬화).</figcaption>
</figure>

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

아래 그림은 위 코드에서 `Rc::clone`과 `drop`(스코프 종료)이 일어날 때마다 참조 카운트가 어떻게 오르내리고, 마지막에 0이 되면 값이 해제되는지를 시간 순서로 보여 줍니다.

<figure class="post-figure">
<svg role="img" aria-label="Rc 참조 카운트의 시간에 따른 변화 그래프. a 생성으로 카운트가 1이 되고, b를 위한 clone으로 2, c를 위한 clone으로 3까지 올랐다가, c가 스코프를 벗어나며 drop되어 2, 이어 b와 a가 차례로 drop되어 1, 그리고 0이 되는 순간 값이 해제된다." viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg">
  <title>Rc 참조 카운트 — clone으로 증가, drop으로 감소, 0이 되면 값 해제</title>

  <!-- baseline / axis -->
  <line x1="60" y1="232" x2="600" y2="232" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
  <text x="48" y="236" text-anchor="end" font-size="9" fill="currentColor" opacity="0.7">0</text>
  <text x="48" y="184" text-anchor="end" font-size="9" fill="currentColor" opacity="0.7">1</text>
  <text x="48" y="136" text-anchor="end" font-size="9" fill="currentColor" opacity="0.7">2</text>
  <text x="48" y="88" text-anchor="end" font-size="9" fill="currentColor" opacity="0.7">3</text>
  <text x="30" y="160" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.7" font-weight="700" transform="rotate(-90 30 160)">strong_count</text>

  <!-- step line: 0 -> 1(a) -> 2(b clone) -> 3(c clone) -> 2(c drop) -> 1(b drop) -> 0(a drop) -->
  <polyline points="60,232 120,232 120,184 220,184 220,136 320,136 320,88 420,88 420,136 500,136 500,184 560,184 560,232 600,232"
            fill="none" stroke="var(--accent-color)" stroke-width="2.5"/>

  <!-- event markers + labels -->
  <g font-size="8.5" fill="currentColor">
    <circle cx="120" cy="184" r="3.5" fill="var(--secondary-color)"/>
    <text x="120" y="174" text-anchor="middle" font-weight="700">a 생성</text>
    <text x="120" y="250" text-anchor="middle" opacity="0.7">Rc::new</text>

    <circle cx="220" cy="136" r="3.5" fill="var(--secondary-color)"/>
    <text x="220" y="126" text-anchor="middle" font-weight="700">b clone</text>
    <text x="220" y="250" text-anchor="middle" opacity="0.7">+1</text>

    <circle cx="320" cy="88" r="3.5" fill="var(--secondary-color)"/>
    <text x="320" y="78" text-anchor="middle" font-weight="700">c clone</text>
    <text x="320" y="250" text-anchor="middle" opacity="0.7">+1</text>

    <circle cx="420" cy="136" r="3.5" fill="var(--gold)"/>
    <text x="420" y="252" text-anchor="middle" opacity="0.7">c drop −1</text>

    <circle cx="500" cy="184" r="3.5" fill="var(--gold)"/>
    <text x="500" y="252" text-anchor="middle" opacity="0.7">b drop −1</text>

    <circle cx="560" cy="232" r="4.5" fill="var(--accent-color)"/>
    <text x="560" y="250" text-anchor="middle" opacity="0.7">a drop −1</text>
  </g>

  <!-- release annotation at count 0 -->
  <line x1="560" y1="232" x2="560" y2="270" stroke="currentColor" stroke-width="1" opacity="0.4" stroke-dasharray="3 3"/>
  <rect x="498" y="270" width="124" height="22" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="1.8"/>
  <text x="560" y="285" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700">count == 0 → 값 해제</text>
</svg>
<figcaption><code>Rc::clone</code>은 값을 복사하지 않고 <strong>참조 카운트만 +1</strong>, 소유자가 스코프를 벗어나 <code>drop</code>되면 <strong>−1</strong>. 마지막 소유자까지 사라져 카운트가 <strong>0</strong>이 되는 순간에야 값이 메모리에서 해제됩니다.</figcaption>
</figure>

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

스레드 간 협업에는 두 가지 길이 있습니다. 아래 그림의 왼쪽은 방금 본 **공유 상태**(`Arc<Mutex<T>>`)로, 여러 스레드가 같은 데이터를 가리키지만 자물쇠 덕분에 접근이 한 줄로 직렬화됩니다. 오른쪽은 그 대안인 **메시지 패싱**(`channel`)으로, 데이터의 소유권을 채널로 넘겨 한 수신자에게 모읍니다.

<figure class="post-figure">
<svg role="img" aria-label="동시성의 두 모델을 비교한 그림. 왼쪽은 공유 상태로, 세 스레드가 Arc로 같은 Mutex 데이터를 공유하지만 한 번에 한 스레드만 자물쇠를 잡아 접근이 직렬화된다. 오른쪽은 메시지 패싱으로, 여러 송신자 tx가 채널로 값을 보내고 단일 수신자 rx가 차례로 받는다." viewBox="0 0 660 300" xmlns="http://www.w3.org/2000/svg">
  <title>동시성 두 모델 — 공유 상태(Arc&lt;Mutex&gt;로 직렬화 접근) vs 메시지 패싱(channel)</title>

  <!-- ===== LEFT: shared state Arc<Mutex<T>> ===== -->
  <text x="150" y="22" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">공유 상태 · Arc&lt;Mutex&lt;T&gt;&gt;</text>

  <g font-size="8.5" font-weight="700">
    <rect x="40" y="48" width="64" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
    <text x="72" y="65" text-anchor="middle" fill="currentColor">스레드 1</text>
    <rect x="40" y="118" width="64" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
    <text x="72" y="135" text-anchor="middle" fill="currentColor">스레드 2</text>
    <rect x="40" y="188" width="64" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
    <text x="72" y="205" text-anchor="middle" fill="currentColor">스레드 3</text>
  </g>

  <!-- thread 2 holds the lock now (solid), others wait (dashed) -->
  <line x1="104" y1="61" x2="186" y2="120" stroke="var(--secondary-color)" stroke-width="1.6" opacity="0.45" stroke-dasharray="4 3"/>
  <line x1="104" y1="131" x2="186" y2="131" stroke="var(--accent-color)" stroke-width="2.5" marker-end="url(#cc-arrow)"/>
  <line x1="104" y1="201" x2="186" y2="142" stroke="var(--secondary-color)" stroke-width="1.6" opacity="0.45" stroke-dasharray="4 3"/>
  <text x="138" y="118" text-anchor="middle" font-size="7" fill="currentColor" opacity="0.6">대기</text>
  <text x="138" y="172" text-anchor="middle" font-size="7" fill="currentColor" opacity="0.6">대기</text>
  <text x="146" y="125" text-anchor="middle" font-size="7.5" fill="currentColor" font-weight="700">lock 보유</text>

  <!-- Mutex box with data -->
  <rect x="188" y="104" width="86" height="56" rx="4" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <rect x="222" y="92" width="18" height="15" rx="2" fill="none" stroke="var(--accent-color)" stroke-width="2"/>
  <path d="M225,92 v-4 a6,6 0 0 1 12,0 v4" fill="none" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="231" y="103" text-anchor="middle" font-size="7" fill="currentColor" font-weight="700">🔒</text>
  <text x="231" y="128" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">Mutex</text>
  <text x="231" y="144" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">데이터</text>
  <text x="150" y="190" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.85" font-weight="700">한 번에 하나만 → 접근 직렬화</text>

  <!-- divider -->
  <line x1="318" y1="36" x2="318" y2="232" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- ===== RIGHT: message passing channel ===== -->
  <text x="492" y="22" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">메시지 패싱 · channel</text>

  <g font-size="8.5" font-weight="700">
    <rect x="346" y="48" width="58" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
    <text x="375" y="65" text-anchor="middle" fill="currentColor">tx 1</text>
    <rect x="346" y="118" width="58" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
    <text x="375" y="135" text-anchor="middle" fill="currentColor">tx 2</text>
    <rect x="346" y="188" width="58" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
    <text x="375" y="205" text-anchor="middle" fill="currentColor">tx 3</text>
  </g>

  <!-- send messages into channel -->
  <line x1="404" y1="61" x2="456" y2="120" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#cc-arrow)"/>
  <line x1="404" y1="131" x2="456" y2="131" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#cc-arrow)"/>
  <line x1="404" y1="201" x2="456" y2="142" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#cc-arrow)"/>
  <text x="430" y="112" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.75">send</text>

  <!-- channel pipe -->
  <rect x="458" y="116" width="74" height="30" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="495" y="135" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">channel</text>

  <!-- single consumer rx -->
  <line x1="532" y1="131" x2="566" y2="131" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#cc-arrow)"/>
  <rect x="568" y="116" width="54" height="30" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="595" y="135" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">rx</text>
  <text x="492" y="190" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.85" font-weight="700">소유권을 넘겨 단일 수신자로</text>

  <defs>
    <marker id="cc-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>동시성의 두 모델 — <strong>공유 상태</strong>(왼쪽): 여러 스레드가 <code>Arc</code>로 같은 <code>Mutex</code> 데이터를 공유하지만, 한 스레드가 자물쇠를 쥔 동안 나머지는 대기해 접근이 직렬화됩니다. <strong>메시지 패싱</strong>(오른쪽): 송신자 <code>tx</code>들이 값의 소유권을 <code>channel</code>로 넘기고, 단일 수신자 <code>rx</code>가 차례로 받습니다. "메모리를 공유해 통신"하거나 "통신으로 메모리를 공유"하는 두 길입니다.</figcaption>
</figure>

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
