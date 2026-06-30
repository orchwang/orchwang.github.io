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

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="Rust 소유권의 세 가지 규칙을 한 장으로 묶은 그림. 왼쪽은 값 하나에 소유자 하나가 붙는 규칙, 가운데는 한 시점에 소유자가 오직 하나뿐이라 소유권이 한 변수에서 다른 변수로 옮겨지면 원래 변수는 무효가 되는 규칙, 오른쪽은 소유자가 스코프 밖으로 벗어나는 순간 값이 자동으로 버려진다(drop)는 규칙을 보여준다." viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg">
  <title>Rust 소유권의 세 가지 규칙 — 값마다 소유자 하나 · 한 시점 한 소유자 · 스코프 종료 시 drop</title>

  <!-- ===== RULE 1: one owner per value ===== -->
  <text x="113" y="26" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">① 값마다 소유자 하나</text>
  <!-- owner variable -->
  <rect x="58" y="58" width="110" height="34" rx="3" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="113" y="80" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700">let s</text>
  <!-- ownership link -->
  <line x1="113" y1="92" x2="113" y2="132" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#own-arrow)"/>
  <text x="146" y="116" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8" font-weight="700">소유</text>
  <!-- value on heap -->
  <rect x="58" y="136" width="110" height="44" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="113" y="156" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">값(힙 데이터)</text>
  <text x="113" y="171" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">"hello"</text>
  <text x="113" y="208" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.8" font-weight="700">하나의 값엔 단 하나의 오너</text>

  <!-- divider -->
  <line x1="226" y1="44" x2="226" y2="222" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- ===== RULE 2: only one owner at a time (move) ===== -->
  <text x="340" y="26" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">② 한 시점에 소유자 하나</text>
  <!-- s1 invalidated -->
  <rect x="252" y="58" width="84" height="34" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4 3" opacity="0.55"/>
  <text x="294" y="80" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700" opacity="0.6">s1</text>
  <line x1="262" y1="62" x2="326" y2="88" stroke="var(--accent-color)" stroke-width="2"/>
  <line x1="326" y1="62" x2="262" y2="88" stroke="var(--accent-color)" stroke-width="2"/>
  <!-- s2 owns now -->
  <rect x="344" y="58" width="84" height="34" rx="3" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="386" y="80" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">s2</text>
  <!-- move arrow between them -->
  <line x1="336" y1="110" x2="344" y2="110" stroke="var(--secondary-color)" stroke-width="0"/>
  <line x1="294" y1="92" x2="294" y2="116" stroke="currentColor" stroke-width="1.4" opacity="0.5"/>
  <line x1="386" y1="92" x2="386" y2="116" stroke="var(--secondary-color)" stroke-width="2"/>
  <path d="M308 130 q32 -10 64 -12" fill="none" stroke="var(--secondary-color)" stroke-width="2" marker-end="url(#own-arrow)"/>
  <text x="340" y="124" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.85" font-weight="700">move</text>
  <!-- single value -->
  <rect x="298" y="136" width="84" height="44" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="340" y="162" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">값 하나</text>
  <text x="340" y="208" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.8" font-weight="700">옮기면 원본은 무효화</text>

  <!-- divider -->
  <line x1="452" y1="44" x2="452" y2="222" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- ===== RULE 3: out of scope -> drop ===== -->
  <text x="566" y="26" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">③ 스코프 벗어나면 drop</text>
  <!-- scope brace -->
  <rect x="486" y="52" width="160" height="92" rx="4" fill="none" stroke="currentColor" stroke-width="1.6" opacity="0.55"/>
  <text x="500" y="48" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700" opacity="0.7">{</text>
  <rect x="508" y="70" width="116" height="34" rx="3" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="566" y="92" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">let s (유효)</text>
  <text x="500" y="138" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700" opacity="0.7">}</text>
  <!-- drop arrow -->
  <line x1="566" y1="144" x2="566" y2="170" stroke="var(--accent-color)" stroke-width="2" marker-end="url(#drop-arrow)"/>
  <text x="612" y="162" text-anchor="middle" font-size="9" fill="var(--accent-color)" font-weight="700">drop()</text>
  <rect x="508" y="172" width="116" height="22" rx="3" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="1.6" stroke-dasharray="4 3"/>
  <text x="566" y="187" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.75">메모리 자동 해제</text>
  <text x="566" y="216" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.8" font-weight="700">GC 없이 자동 정리</text>

  <defs>
    <marker id="own-arrow" markerWidth="9" markerHeight="9" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
    <marker id="drop-arrow" markerWidth="9" markerHeight="9" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--accent-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>Rust 소유권의 세 가지 규칙을 한 장에 — <strong>① 값마다 소유자 하나</strong>, <strong>② 한 시점엔 소유자 하나</strong>(소유권을 옮기면 원본 변수는 무효화), <strong>③ 소유자가 스코프를 벗어나면 값은 자동으로 버려진다(drop)</strong>. 이 세 규칙이 GC 없는 메모리 안전성의 토대입니다.</figcaption>
</figure>

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

스택의 변수와 힙의 데이터가 스코프를 따라 어떻게 생겼다 사라지는지를 시간 순으로 보면 이렇습니다.

<figure class="post-figure">
<svg role="img" aria-label="스택과 힙, 그리고 drop의 타임라인을 그린 그림. 시간은 왼쪽에서 오른쪽으로 흐른다. 여는 중괄호에서 변수 s가 스택에 만들어지고 힙에 데이터가 할당된다. 스코프 안에서 s는 유효하게 사용된다. 닫는 중괄호에 이르면 s가 스택에서 제거되고, 그 순간 drop이 호출되어 힙 데이터가 자동으로 해제된다." viewBox="0 0 660 270" xmlns="http://www.w3.org/2000/svg">
  <title>스택 · 힙 · drop 타임라인 — 스코프 진입 시 할당, 스코프 종료 시 자동 해제</title>

  <!-- time axis -->
  <line x1="40" y1="40" x2="620" y2="40" stroke="currentColor" stroke-width="1.6" marker-end="url(#tl-arrow)"/>
  <text x="40" y="30" font-size="9" fill="currentColor" opacity="0.7" font-weight="700">시간 →</text>

  <!-- phase labels -->
  <text x="140" y="60" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">{  진입</text>
  <text x="330" y="60" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">스코프 내부</text>
  <text x="540" y="60" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">}  종료</text>
  <line x1="235" y1="48" x2="235" y2="240" stroke="currentColor" stroke-width="1" opacity="0.2" stroke-dasharray="4 4"/>
  <line x1="440" y1="48" x2="440" y2="240" stroke="currentColor" stroke-width="1" opacity="0.2" stroke-dasharray="4 4"/>

  <!-- row labels -->
  <text x="30" y="116" text-anchor="end" font-size="10" fill="currentColor" font-weight="700" opacity="0.75">스택</text>
  <text x="30" y="186" text-anchor="end" font-size="10" fill="currentColor" font-weight="700" opacity="0.75">힙</text>

  <!-- STACK lifeline -->
  <rect x="100" y="96" width="270" height="34" rx="3" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="235" y="118" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="700">s (포인터·len·cap) — 유효</text>
  <!-- stack removed after scope -->
  <rect x="470" y="96" width="120" height="34" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 3" opacity="0.5"/>
  <text x="530" y="118" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.7">s 제거됨</text>

  <!-- HEAP lifeline -->
  <rect x="100" y="166" width="270" height="34" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="235" y="188" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="700">힙 데이터 "hello" — 살아 있음</text>
  <!-- heap freed -->
  <rect x="470" y="166" width="120" height="34" rx="3" fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="1.6" stroke-dasharray="4 3"/>
  <text x="530" y="188" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.75">자동 해제됨</text>

  <!-- allocation arrow (stack -> heap) at entry -->
  <line x1="140" y1="130" x2="140" y2="164" stroke="var(--secondary-color)" stroke-width="1.8" marker-end="url(#tl-arrow2)"/>
  <text x="146" y="150" font-size="7.5" fill="currentColor" opacity="0.7">할당</text>

  <!-- drop arrow at scope end -->
  <line x1="530" y1="130" x2="530" y2="164" stroke="var(--accent-color)" stroke-width="2" marker-end="url(#tl-drop)"/>
  <text x="536" y="150" font-size="8.5" fill="var(--accent-color)" font-weight="700">drop()</text>

  <text x="330" y="234" text-anchor="middle" font-size="9.5" fill="currentColor" opacity="0.8" font-weight="700">소유자 s가 스코프를 벗어나는 순간, drop이 힙 메모리를 자동으로 돌려줍니다 — GC도, 수동 free도 없이.</text>

  <defs>
    <marker id="tl-arrow" markerWidth="9" markerHeight="9" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="currentColor"/>
    </marker>
    <marker id="tl-arrow2" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
    <marker id="tl-drop" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--accent-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>스택의 변수 <code>s</code>와 힙의 데이터는 스코프와 운명을 함께합니다 — 진입 시 스택에 변수가 생기고 힙에 데이터가 <strong>할당</strong>되며, 닫는 중괄호에서 <code>s</code>가 스택에서 제거되는 순간 <code>drop</code>이 호출되어 힙 메모리가 <strong>자동 해제</strong>됩니다. GC도, 수동 free도 필요 없습니다.</figcaption>
</figure>

### 이동(Move)

Rust에서는 힙에 저장된 데이터(예: `String`)를 다른 변수에 할당하면, 데이터 자체가 복사되는 것이 아니라 소유권이 이동합니다.

```rust
let s1 = String::from("hello");
let s2 = s1; // s1의 소유권이 s2로 이동 (Move)

// println!("{}, world!", s1); // 컴파일 에러! s1은 더 이상 유효하지 않음
println!("{}, world!", s2); // 가능
```

이는 이중 해제(Double Free) 에러를 방지하기 위함입니다.

다음 그림은 `let s2 = s1` 한 줄이 메모리에서 일으키는 일을 보여줍니다.

<figure class="post-figure">
<svg role="img" aria-label="String의 이동(move) 의미론을 그린 그림. 스택에는 s1과 s2 두 변수가 있고 각각 길이·용량·포인터를 담는다. let s2 = s1을 실행하면 s1이 가리키던 힙 데이터로 향하는 포인터가 s2로 복제되지만, 힙의 문자열 데이터 자체는 복제되지 않고 하나만 유지된다. 동시에 s1은 무효화되어 더 이상 사용할 수 없으므로, 힙 데이터를 가리키는 살아 있는 포인터는 s2 하나뿐이다." viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg">
  <title>이동(Move) — let s2 = s1 후 포인터는 s2로 옮겨가고 s1은 무효화, 힙 데이터는 하나만</title>

  <!-- column labels -->
  <text x="170" y="26" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">스택 (Stack)</text>
  <text x="500" y="26" text-anchor="middle" font-size="12" fill="currentColor" font-weight="700" opacity="0.75">힙 (Heap)</text>
  <line x1="330" y1="40" x2="330" y2="280" stroke="currentColor" stroke-width="1" opacity="0.25" stroke-dasharray="5 4"/>

  <!-- s1 box (invalidated) -->
  <g opacity="0.55">
    <rect x="44" y="56" width="120" height="92" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4 3"/>
    <text x="104" y="50" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">s1</text>
    <line x1="44" y1="86" x2="164" y2="86" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
    <line x1="44" y1="116" x2="164" y2="116" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
    <text x="54" y="78" font-size="8.5" fill="currentColor">ptr</text>
    <text x="54" y="108" font-size="8.5" fill="currentColor">len = 5</text>
    <text x="54" y="138" font-size="8.5" fill="currentColor">cap = 5</text>
  </g>
  <!-- invalidated mark on s1 -->
  <line x1="52" y1="60" x2="156" y2="144" stroke="var(--accent-color)" stroke-width="2"/>
  <line x1="156" y1="60" x2="52" y2="144" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="104" y="166" text-anchor="middle" font-size="9" fill="var(--accent-color)" font-weight="700">무효화 (사용 불가)</text>

  <!-- s2 box (active owner) -->
  <rect x="44" y="190" width="120" height="92" rx="3" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="104" y="184" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700">s2 (새 오너)</text>
  <line x1="44" y1="220" x2="164" y2="220" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
  <line x1="44" y1="250" x2="164" y2="250" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
  <text x="54" y="212" font-size="8.5" fill="currentColor">ptr</text>
  <text x="54" y="242" font-size="8.5" fill="currentColor">len = 5</text>
  <text x="54" y="272" font-size="8.5" fill="currentColor">cap = 5</text>

  <!-- heap data (single, shared destination) -->
  <rect x="430" y="120" width="160" height="92" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="510" y="114" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">문자열 데이터 (하나뿐)</text>
  <g font-size="11" font-weight="700" text-anchor="middle" fill="currentColor">
    <rect x="442" y="150" width="28" height="32" rx="2" fill="var(--bg-light)" stroke="currentColor" stroke-width="1"/><text x="456" y="171">h</text>
    <rect x="472" y="150" width="28" height="32" rx="2" fill="var(--bg-light)" stroke="currentColor" stroke-width="1"/><text x="486" y="171">e</text>
    <rect x="502" y="150" width="28" height="32" rx="2" fill="var(--bg-light)" stroke="currentColor" stroke-width="1"/><text x="516" y="171">l</text>
    <rect x="532" y="150" width="28" height="32" rx="2" fill="var(--bg-light)" stroke="currentColor" stroke-width="1"/><text x="546" y="171">l</text>
    <rect x="562" y="150" width="20" height="32" rx="2" fill="var(--bg-light)" stroke="currentColor" stroke-width="1"/><text x="572" y="171">o</text>
  </g>

  <!-- old s1 ptr (dead) -->
  <path d="M150 71 q150 0 280 80" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4 4" opacity="0.4"/>
  <text x="300" y="96" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.5">(끊긴 포인터)</text>

  <!-- live s2 ptr -->
  <path d="M150 205 q170 0 280 -30" fill="none" stroke="var(--secondary-color)" stroke-width="2.2" marker-end="url(#mv-arrow)"/>
  <text x="312" y="214" text-anchor="middle" font-size="9" fill="var(--secondary-color)" font-weight="700">살아 있는 포인터</text>

  <defs>
    <marker id="mv-arrow" markerWidth="9" markerHeight="9" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption><code>let s2 = s1</code>은 스택의 <strong>포인터·길이·용량만</strong> s2로 옮기고, 힙의 실제 문자열 데이터는 <strong>복제하지 않습니다</strong>. 동시에 s1은 무효화되어 — 힙 데이터를 가리키는 살아 있는 소유자는 s2 하나뿐. 그래서 스코프가 끝날 때 해제는 한 번만 일어나 이중 해제가 원천 차단됩니다.</figcaption>
</figure>

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

이 규칙은 "**여러 독자 OR 한 명의 작성자**, 둘을 동시에 허용하지 않는다"로 요약됩니다.

<figure class="post-figure">
<svg role="img" aria-label="Rust 빌림 규칙을 그린 그림. 왼쪽 경우는 같은 값에 대해 불변 참조를 여러 개 동시에 만들 수 있어 허용된다. 가운데 경우는 가변 참조를 하나만 만들면 허용된다. 오른쪽 경우는 불변 참조와 가변 참조를 동시에, 또는 가변 참조를 둘 이상 만들면 금지된다." viewBox="0 0 660 230" xmlns="http://www.w3.org/2000/svg">
  <title>빌림 규칙 — 불변 참조 여럿은 OK · 가변 참조 하나는 OK · 불변과 가변 동시 또는 가변 둘은 금지</title>

  <!-- CASE 1: many immutable refs OK -->
  <text x="110" y="24" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700" opacity="0.75">불변 참조 여러 개</text>
  <rect x="64" y="160" width="92" height="34" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="110" y="182" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">값</text>
  <g font-size="8.5" font-weight="700" fill="currentColor">
    <rect x="40" y="42" width="44" height="26" rx="3" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.8"/><text x="62" y="59" text-anchor="middle">&amp;v</text>
    <rect x="88" y="42" width="44" height="26" rx="3" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.8"/><text x="110" y="59" text-anchor="middle">&amp;v</text>
    <rect x="136" y="42" width="44" height="26" rx="3" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.8"/><text x="158" y="59" text-anchor="middle">&amp;v</text>
  </g>
  <line x1="62" y1="68" x2="98" y2="158" stroke="var(--secondary-color)" stroke-width="1.6"/>
  <line x1="110" y1="68" x2="110" y2="158" stroke="var(--secondary-color)" stroke-width="1.6"/>
  <line x1="158" y1="68" x2="122" y2="158" stroke="var(--secondary-color)" stroke-width="1.6"/>
  <text x="110" y="86" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.7">읽기만 — 안전</text>
  <text x="110" y="216" text-anchor="middle" font-size="11" fill="var(--secondary-color)" font-weight="700">✓ 허용</text>

  <line x1="220" y1="36" x2="220" y2="200" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- CASE 2: one mutable ref OK -->
  <text x="330" y="24" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700" opacity="0.75">가변 참조 하나</text>
  <rect x="284" y="160" width="92" height="34" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="330" y="182" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">값</text>
  <rect x="298" y="42" width="64" height="26" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.2"/>
  <text x="330" y="59" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700">&amp;mut v</text>
  <line x1="330" y1="68" x2="330" y2="158" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="330" y="90" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.7">쓰기 — 단독뿐</text>
  <text x="330" y="216" text-anchor="middle" font-size="11" fill="var(--secondary-color)" font-weight="700">✓ 허용</text>

  <line x1="440" y1="36" x2="440" y2="200" stroke="currentColor" stroke-width="1" opacity="0.25"/>

  <!-- CASE 3: mixing / two mutable FORBIDDEN -->
  <text x="550" y="24" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700" opacity="0.75">불변+가변 동시</text>
  <rect x="504" y="160" width="92" height="34" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
  <text x="550" y="182" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">값</text>
  <rect x="486" y="42" width="56" height="26" rx="3" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.8"/>
  <text x="514" y="59" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700">&amp;v</text>
  <rect x="556" y="42" width="56" height="26" rx="3" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.2"/>
  <text x="584" y="59" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700">&amp;mut v</text>
  <line x1="514" y1="68" x2="540" y2="158" stroke="var(--secondary-color)" stroke-width="1.6"/>
  <line x1="584" y1="68" x2="560" y2="158" stroke="var(--accent-color)" stroke-width="2"/>
  <!-- conflict mark -->
  <line x1="534" y1="100" x2="566" y2="132" stroke="var(--accent-color)" stroke-width="2.4"/>
  <line x1="566" y1="100" x2="534" y2="132" stroke="var(--accent-color)" stroke-width="2.4"/>
  <text x="550" y="216" text-anchor="middle" font-size="11" fill="var(--accent-color)" font-weight="700">✗ 금지 (데이터 레이스)</text>

</svg>
<figcaption>빌림의 한 가지 핵심 규칙 — 같은 값에 대해 <strong>불변 참조는 여러 개</strong>(모두 읽기만 하니 안전)이거나, <strong>가변 참조는 정확히 하나</strong>(단독으로만 쓰기)일 수 있습니다. 그러나 <strong>불변과 가변을 동시에</strong>, 혹은 가변 참조를 둘 이상 두는 것은 금지 — 컴파일 타임에 데이터 레이스를 막습니다.</figcaption>
</figure>

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
