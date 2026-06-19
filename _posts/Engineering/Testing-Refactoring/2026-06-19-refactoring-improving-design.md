---
layout: post
title: "Refactoring: 동작을 지키며 설계를 개선하는 규율"
date: 2026-06-19 00:04:00
categories: [Engineering, Testing-Refactoring]
tags: [engineering, refactoring, code-smells, testing]
series: Testing-Refactoring-Essential
published: true
excerpt: "코드 냄새를 식별하고 Extract Function·Rename·Replace Temp with Query 같은 안전한 리팩터링을 테스트 안전망 위에서 작은 단계씩 실천하는 규율을 statement 예제로 익힙니다."
---

## 들어가며

이 글은 `Testing-Refactoring-Essential` 시리즈의 **3단계**입니다. 1단계 [TDD By Example: 테스트가 이끄는 설계 (Red-Green-Refactor)](/2026/06/19/tdd-by-example.html)에서 Red-Green-Refactor 사이클을 익혔고, 2단계 [TDD, 7년 후: 회고와 현대적 관점](/2026/06/19/tdd-seven-years-after.html)의 회고는 "TDD가 설계 *압력*은 주되 설계 *감각*까지 주지는 않는다"고 짚으며 바로 이 단계를 가리켰습니다. 그 사이클의 마지막 박자 "Refactor"는 사실 그 자체로 하나의 큰 학문입니다. 테스트를 초록(green)으로 유지한 채 설계를 다듬는 그 짧은 순간에, 우리는 무엇을 어떤 순서로 고쳐야 안전할까요?

Martin Fowler의 *Refactoring: Improving the Design of Existing Code*는 바로 이 질문에 답하는 책입니다. 이번 글에서는 그 "Refactor"를 깊게 파고들어, **냄새를 식별하고 → 안전한 변형을 작은 단계로 적용하는** 규율을 익힙니다. 전체 흐름은 [Testing-Refactoring Essential Curriculum](/2026/06/19/testing-refactoring-essential-curriculum.html)에서 다시 확인할 수 있습니다. 다음 4단계는 [GOOS: 테스트로 키우는 객체지향 소프트웨어](/2026/06/19/growing-oo-software-guided-by-tests.html)로, mock 기반 outside-in TDD로 시리즈를 마무리합니다.

<div class="post-summary-box" markdown="1">

### 📌 이 글에서 다루는 내용

#### 🔍 핵심 주제

- **리팩터링의 정의·원칙**: 동작 보존, 작은 단계, 테스트 보호, 그리고 "두 개의 모자"
- **코드 냄새(Code Smells)**: Long Method, Large Class, Duplicated Code, Feature Envy 식별
- **기본 카탈로그**: Extract Function · Inline · Rename · Move
- **캡슐화·계층 정리**: Encapsulate Variable, Replace Temp with Query로 데이터·구조 다루기
- **테스트가 떠받치는 워크플로우**: statement 예제를 작은 단계로 개선하는 before→after

</div>

## 1. 리팩터링의 정의와 원칙

Fowler는 리팩터링을 명사와 동사 두 가지로 정의합니다. **명사로서의 리팩터링**은 "겉으로 드러나는 동작은 그대로 둔 채, 코드를 이해하고 수정하기 쉽도록 내부 구조를 변경하는 것"입니다. **동사로서 리팩터링한다**는 "일련의 리팩터링을 적용해 동작 보존하에 소프트웨어를 재구성하는 것"입니다. 핵심 단어는 **동작 보존(behavior preservation)**입니다. 리팩터링은 기능을 더하거나 버그를 고치는 일이 아니라, 같은 동작을 더 좋은 구조로 다시 표현하는 일입니다.

### 두 개의 모자 (Two Hats)

Fowler의 가장 유명한 비유는 "두 개의 모자"입니다. 소프트웨어를 개발할 때 우리는 두 가지 일을 합니다.

- **기능 추가 모자**: 새 기능을 더한다. 이때는 테스트를 추가하고 동작을 바꿉니다.
- **리팩터링 모자**: 동작은 건드리지 않고 구조만 바꾼다. 이때는 테스트를 추가하지 않습니다(이미 통과하던 테스트가 계속 통과해야 합니다).

중요한 규율은 **두 모자를 동시에 쓰지 않는 것**입니다. 지금 내가 기능을 추가하는 중인지, 구조를 다듬는 중인지를 매 순간 명확히 자각해야 합니다. 모자를 자주 바꿔 쓸 수는 있지만, 한 번에 하나만 씁니다.

### 작은 단계 (Small Steps)

리팩터링의 안전성은 **단계의 크기**에서 옵니다. 한 번에 큰 변경을 가하면 무엇이 어디서 깨졌는지 알기 어렵습니다. 대신 동작이 보존되는 아주 작은 변형을 하나씩 적용하고, 매 단계마다 테스트를 돌립니다. "작은 단계로 가는 편이 더 빠르다"는 것이 Fowler의 역설적인 결론입니다. 디버깅 시간이 사라지기 때문입니다.

## 2. 코드 냄새 (Code Smells)

리팩터링을 **언제** 해야 할까요? Kent Beck과 Fowler는 "냄새가 날 때"라고 답합니다. 코드 냄새는 버그가 아니라, "여기를 한 번 살펴보라"는 **신호**입니다. 냄새가 곧 잘못은 아니지만, 더 깊은 문제를 가리키는 경우가 많습니다.

- **Long Method(긴 함수)**: 함수가 너무 길어 한눈에 의도를 파악하기 어렵다. 가장 흔하고, 대개 Extract Function으로 다룹니다.
- **Large Class(큰 클래스)**: 한 클래스가 너무 많은 책임과 필드를 떠안고 있다. Extract Class로 쪼갭니다.
- **Duplicated Code(중복 코드)**: 같은 구조가 여러 곳에 반복된다. 한 곳을 고치면 나머지도 고쳐야 하는 위험을 만듭니다. Extract Function·Pull Up Method 등으로 한 곳에 모읍니다.
- **Feature Envy(기능 욕심)**: 한 함수가 자기 클래스보다 다른 객체의 데이터에 더 관심이 많다. 그 함수를 데이터가 있는 곳으로 Move Function 합니다.

이 외에도 Long Parameter List, Primitive Obsession, Shotgun Surgery 등 수십 가지 냄새가 카탈로그로 정리되어 있습니다. 핵심은 **냄새는 "무엇을 고칠지"가 아니라 "어디를 볼지"를 알려 준다**는 점입니다.

## 3. 기본 리팩터링 카탈로그

Fowler 책의 진짜 가치는 각 리팩터링마다 정의·동기·**메커닉스(mechanics)**·예제를 표준화해 둔 카탈로그에 있습니다. 메커닉스는 "이 변형을 안전하게 적용하는 단계별 절차"입니다. 가장 핵심적인 네 가지부터 봅니다.

- **Extract Function(함수 추출)**: 코드 조각을 목적이 드러나는 이름의 함수로 빼낸다. 가장 자주 쓰는 리팩터링입니다. *메커닉스*: ① 새 함수를 만들고 의도가 드러나는 이름을 붙인다 → ② 추출할 코드를 옮긴다 → ③ 참조하는 지역 변수를 매개변수로 전달한다 → ④ 원래 자리에서 새 함수를 호출한다 → ⑤ 테스트.
- **Inline Function(함수 인라인)**: Extract의 반대. 함수 본문이 이름만큼이나 명확하면 호출부에 본문을 펼쳐 넣는다.
- **Rename(이름 바꾸기)**: 변수·함수의 이름이 의도를 드러내지 못하면 더 나은 이름으로 바꾼다. 가장 값싸면서 효과가 큰 리팩터링입니다.
- **Move(이동)**: 함수·필드를 더 적절한 클래스/모듈로 옮긴다. Feature Envy의 표준 처방입니다.

이 변형들은 작고 기계적이라서, 사람이 손으로도 안전하게 할 수 있고 IDE가 자동화해 주기도 합니다. 작을수록 안전합니다.

## 4. 캡슐화·계층 정리

데이터와 구조를 다루는 리팩터링은 한 단계 더 깊은 설계 개선입니다.

- **Encapsulate Variable(변수 캡슐화)**: 널리 쓰이는 데이터에 직접 접근하는 대신 게터/세터(또는 접근 함수)로 감싼다. 그러면 나중에 데이터의 표현을 바꾸거나, 접근 시점에 검증·로깅을 끼워 넣기 쉬워집니다.
- **Replace Temp with Query(임시 변수를 질의 함수로)**: 어떤 식의 결과를 담아 두는 임시 변수를, 그 식을 계산하는 함수(질의)로 바꾼다. 임시 변수가 사라지면 그 함수를 다른 함수에서도 재사용할 수 있고, 무엇보다 **Extract Function을 가로막던 지역 변수가 제거**되어 더 큰 추출이 가능해집니다. 아래 statement 예제의 핵심 도구입니다.

이런 리팩터링은 데이터의 흐름을 단순화해, 함수를 더 잘게 쪼갤 수 있는 토대를 만듭니다. 상속 구조를 다루는 Pull Up Field/Method, Extract Superclass 등도 같은 정신을 계층에 적용한 것입니다.

## 5. 테스트가 떠받치는 리팩터링

리팩터링의 전제 조건은 단 하나, **신뢰할 수 있는 테스트**입니다. 동작을 보존했는지 어떻게 확신할까요? 매 작은 단계마다 테스트를 돌려 여전히 초록인지 확인하면 됩니다. 테스트가 안전망(safety net)이 되어 주는 한, 우리는 두려움 없이 구조를 바꿀 수 있습니다.

워크플로우는 다음과 같습니다.

```python
# 리팩터링 워크플로우 (의사 코드)
# 1. 리팩터링 시작 전, 모든 테스트가 통과(green)하는지 확인
# 2. 아주 작은 변형을 하나 적용한다 (예: Extract Function 한 번)
# 3. 테스트를 다시 돌린다
# 4. 초록이면 커밋, 빨강이면 방금 변경을 되돌린다 (undo)
# 5. 냄새가 사라질 때까지 2~4를 반복
```

특히 4번이 중요합니다. 빨강이 떴을 때 디버깅으로 파고들기보다 **방금 한 작은 변경을 되돌리는** 편이 빠릅니다. 변경이 작았기 때문에 잃을 것도 적습니다. 이것이 작은 단계가 빠른 이유입니다.

## Worked Example: statement (연극 공연료 청구서)

이제 Fowler가 책 1장에서 든 `statement` 예제를 Python으로 단순화해 적용해 봅시다. (원서 2판의 예제는 JavaScript로 작성되어 있습니다.) 한 극단이 공연을 의뢰받아, 공연 종류(`tragedy`/`comedy`)와 관객 수에 따라 요금을 계산해 청구서 문자열을 만드는 함수입니다.

### Before: Long Method + 중복

```python
def statement(invoice, plays):
    total = 0
    result = f"청구 내역 ({invoice['customer']})\n"
    for perf in invoice["performances"]:
        play = plays[perf["playID"]]
        # 공연료 계산 — 긴 함수 안에 로직이 뒤섞여 있다
        if play["type"] == "tragedy":
            this_amount = 40000
            if perf["audience"] > 30:
                this_amount += 1000 * (perf["audience"] - 30)
        elif play["type"] == "comedy":
            this_amount = 30000
            if perf["audience"] > 20:
                this_amount += 10000 + 500 * (perf["audience"] - 20)
            this_amount += 300 * perf["audience"]
        else:
            raise ValueError(f"알 수 없는 장르: {play['type']}")
        # 출력 한 줄 — 금액 포맷(/100, 원 단위)이 인라인되어 있다
        result += f"  {play['name']}: {this_amount/100}원 ({perf['audience']}석)\n"
        total += this_amount
    result += f"총액: {total/100}원\n"
    return result
```

이 함수는 한눈에 봐도 **Long Method**입니다. 요금 계산, 포맷, 합계 누적이 한 덩어리로 엉켜 있죠. 시작하기 전에, 먼저 **테스트로 안전망을 칩니다.**

```python
def test_statement_basic():
    plays = {
        "hamlet": {"name": "Hamlet", "type": "tragedy"},
        "as-like": {"name": "As You Like It", "type": "comedy"},
    }
    invoice = {
        "customer": "BigCo",
        "performances": [
            {"playID": "hamlet", "audience": 55},
            {"playID": "as-like", "audience": 35},
        ],
    }
    result = statement(invoice, plays)
    # 동작을 고정하는 골든 마스터: 이 문자열이 끝까지 보존되어야 한다
    assert "Hamlet: 650.0원 (55석)" in result
    assert "As You Like It: 580.0원 (35석)" in result
    assert "총액: 1230.0원" in result
```

### 단계 1 — Extract Function: 공연료 계산을 빼낸다

가장 큰 냄새인 요금 계산 블록을 `amount_for`로 추출합니다. 지역 변수 `perf`, `play`는 매개변수로 전달합니다.

```python
def amount_for(perf, play):
    # Extract Function으로 빼낸 공연료 계산 — 의도가 이름에 드러난다
    if play["type"] == "tragedy":
        result = 40000
        if perf["audience"] > 30:
            result += 1000 * (perf["audience"] - 30)
    elif play["type"] == "comedy":
        result = 30000
        if perf["audience"] > 20:
            result += 10000 + 500 * (perf["audience"] - 20)
        result += 300 * perf["audience"]
    else:
        raise ValueError(f"알 수 없는 장르: {play['type']}")
    return result


def statement(invoice, plays):
    total = 0
    result = f"청구 내역 ({invoice['customer']})\n"
    for perf in invoice["performances"]:
        play = plays[perf["playID"]]
        this_amount = amount_for(perf, play)  # 추출한 함수 호출
        result += f"  {play['name']}: {this_amount/100}원 ({perf['audience']}석)\n"
        total += this_amount
    result += f"총액: {total/100}원\n"
    return result
```

> **테스트 실행 → 통과(green)**. 추출 직후 바로 테스트를 돌립니다. 동작이 보존됐음을 확인하고 커밋합니다.

### 단계 2 — Rename: 변수 이름을 의도에 맞게

추출한 함수 안에서 `this_amount`라는 옛 이름은 더 이상 어울리지 않습니다. 함수의 반환값일 뿐이니 `result`로 이미 바꿨고, 호출부의 `this_amount`도 역할이 분명한 `amount`로 바꿉니다(Rename Variable).

```python
def statement(invoice, plays):
    total = 0
    result = f"청구 내역 ({invoice['customer']})\n"
    for perf in invoice["performances"]:
        play = plays[perf["playID"]]
        amount = amount_for(perf, play)  # this_amount → amount (Rename)
        result += f"  {play['name']}: {amount/100}원 ({perf['audience']}석)\n"
        total += amount
    result += f"총액: {total/100}원\n"
    return result
```

> **테스트 실행 → 통과(green)**. 이름만 바꿨으니 동작은 그대로입니다.

### 단계 3 — Replace Temp with Query: play 임시 변수 제거

`play` 변수는 `plays[perf["playID"]]`를 담아 둔 임시 변수입니다. 이를 질의 함수 `play_for`로 바꾸면, 루프 본문의 지역 변수가 하나 줄어 다음 추출이 쉬워집니다.

```python
def play_for(plays, perf):
    return plays[perf["playID"]]  # Replace Temp with Query


def amount_for(perf, plays):
    play = play_for(plays, perf)  # 질의 함수로 조회
    if play["type"] == "tragedy":
        result = 40000
        if perf["audience"] > 30:
            result += 1000 * (perf["audience"] - 30)
    elif play["type"] == "comedy":
        result = 30000
        if perf["audience"] > 20:
            result += 10000 + 500 * (perf["audience"] - 20)
        result += 300 * perf["audience"]
    else:
        raise ValueError(f"알 수 없는 장르: {play['type']}")
    return result


def statement(invoice, plays):
    total = 0
    result = f"청구 내역 ({invoice['customer']})\n"
    for perf in invoice["performances"]:
        amount = amount_for(perf, plays)  # play 임시 변수가 사라졌다
        result += f"  {play_for(plays, perf)['name']}: {amount/100}원 ({perf['audience']}석)\n"
        total += amount
    result += f"총액: {total/100}원\n"
    return result
```

> **테스트 실행 → 통과(green)**. 임시 변수 `play`가 제거되어, 이제 출력 줄과 합계 누적도 각각 함수로 추출할 토대가 마련됐습니다.

### 단계 4 — Extract Function: 금액 포맷의 중복 제거

`amount/100`과 `total/100`은 같은 "센트→원" 변환이 **중복**된 곳입니다(Duplicated Code). 포맷 함수로 추출해 한 곳에 모읍니다.

```python
def to_won(amount):
    return f"{amount/100}원"  # 중복되던 포맷을 한 곳으로 (Extract Function)


def statement(invoice, plays):
    total = 0
    result = f"청구 내역 ({invoice['customer']})\n"
    for perf in invoice["performances"]:
        amount = amount_for(perf, plays)
        result += f"  {play_for(plays, perf)['name']}: {to_won(amount)} ({perf['audience']}석)\n"
        total += amount
    result += f"총액: {to_won(total)}\n"  # 같은 함수를 재사용
    return result
```

> **테스트 실행 → 통과(green)**. 이제 화폐 단위가 바뀌어도 `to_won` 한 곳만 고치면 됩니다.

### After: 의도가 드러나는 구조

네 번의 작은 단계를 거치며, 처음의 거대한 한 덩어리 함수는 **목적이 이름에 드러나는 작은 함수들의 조합**으로 바뀌었습니다. `statement`는 이제 "공연마다 금액을 구해, 포맷해서, 합계와 함께 출력한다"는 의도를 거의 그대로 읽을 수 있습니다. 동작은 단 한 번도 바뀌지 않았고, 매 단계 테스트는 초록을 유지했습니다. 이것이 리팩터링의 규율입니다.

여기서 멈추지 않고 Fowler는 계산 단계와 포맷 단계를 분리(Split Phase)하거나, 다형성(polymorphism)으로 장르별 분기를 제거하는 데까지 나아갑니다. 하지만 그 모든 진전 역시 **같은 리듬** — 작은 변형 → 테스트 → 커밋 — 의 반복일 뿐입니다.

## 마무리

리팩터링은 영감이나 대담함의 문제가 아니라 **규율**의 문제입니다. 동작을 보존한다는 한 가지 약속 아래, 코드 냄새가 가리키는 곳을 작은 변형으로 하나씩 다듬고, 매 단계 테스트로 안전을 확인하며 나아갑니다. Extract Function, Rename, Replace Temp with Query 같은 기본기는 작고 기계적이지만, 이들을 테스트 안전망 위에서 반복하면 어떤 거대한 함수도 두려움 없이 개선할 수 있습니다.

1단계의 Red-Green-Refactor가 "테스트가 설계를 이끈다"였다면, 이번 3단계는 그 "Refactor"를 카탈로그와 메커닉스로 구체화한 셈입니다. 이제 우리는 *무엇을*(냄새) *어떻게*(메커닉스) *언제*(테스트가 초록일 때) 고칠지 압니다. 마지막 4단계에서는 이 감각을 객체 간 협력 설계로 확장해, 처음부터 좋은 구조가 자라나게 하는 실전으로 나아갑니다.

### 다음 학습

- [Testing-Refactoring Essential Curriculum](/2026/06/19/testing-refactoring-essential-curriculum.html) — 전체 로드맵 다시 보기
- [TDD, 7년 후: 회고와 현대적 관점](/2026/06/19/tdd-seven-years-after.html) — 2단계 다시 보기
- [GOOS: 테스트로 키우는 객체지향 소프트웨어](/2026/06/19/growing-oo-software-guided-by-tests.html) — 4단계: outside-in TDD와 mock으로 시리즈 완주
