---
layout: post
title: "Stage 2 · Actor와 동시성 — 분산 객체 · in-process concurrency"
date: 2026-08-24 00:02:00
categories: [Technology, Ray]
tags: [ray, actor, concurrency, max-concurrency, python]
series: Ray-Essential
published: true
excerpt: "Ray의 상태를 가진 분산 객체 모델인 Actor를 배웁니다. Counter 액터의 생명주기부터, Job 내부의 in-process 동시성(threaded vs async 액터와 `max_concurrency`), 그리고 고정 워커 풀인 ActorPool까지 실습하며 상태·동기화·동시성의 선택지를 정리합니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="Actor 모델 개념 그림. 중앙에 전용 워커 프로세스 하나가 '상태(State)' 상자를 들고 있고, 그 위로 여러 메서드 호출(`increment` 등)이 화살표로 들어온다. 다음으로 그리고 threaded 액터(스레드 풀)와 async 액터(단일 이벤트 루프)를 나란히 비교하고, 맨 아래에는 여러 동일 액터가 작업을 나눠받는 Actor Pool을 보여준다. '메서드는 순차, 서로 다른 액터는 병렬'이라는 핵심을 대비한다." viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg">
  <title>Actor 모델 — 상태를 가진 전용 워커, threaded·async 액터, 그리고 Actor Pool</title>

  <!-- actor with state -->
  <text x="120" y="26" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700" opacity="0.8">Actor (전용 워커)</text>
  <rect x="40" y="40" width="160" height="90" rx="5" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.5"/>
  <rect x="52" y="52" width="136" height="30" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.2"/>
  <text x="120" y="71" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700">메서드 (increment 등)</text>
  <rect x="52" y="90" width="136" height="30" rx="3" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.4"/>
  <text x="120" y="109" text-anchor="middle" font-size="8.5" fill="currentColor" font-weight="700">상태 (self.value)</text>
  <text x="120" y="148" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.75">메서드는 순차 실행 · 상태 유지</text>

  <!-- threaded vs async -->
  <text x="420" y="26" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700" opacity="0.8">in-process 동시성</text>
  <g>
    <rect x="250" y="40" width="150" height="78" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
    <text x="325" y="56" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">Threaded 액터</text>
    <text x="325" y="70" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.8">+ max_concurrency</text>
    <g font-size="7.5" font-weight="700">
      <rect x="262" y="80" width="34" height="24" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.2"/><text x="279" y="95" text-anchor="middle">T1</text>
      <rect x="300" y="80" width="34" height="24" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.2"/><text x="317" y="95" text-anchor="middle">T2</text>
      <rect x="338" y="80" width="34" height="24" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.2"/><text x="355" y="95" text-anchor="middle">T3</text>
    </g>
  </g>
  <g>
    <rect x="420" y="40" width="210" height="78" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.8"/>
    <text x="525" y="56" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">Async 액터 (async def)</text>
    <text x="525" y="70" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.8">단일 이벤트 루프</text>
    <circle cx="525" cy="96" r="16" fill="none" stroke="var(--secondary-color)" stroke-width="1.8"/>
    <text x="525" y="100" text-anchor="middle" font-size="7.5" fill="currentColor" font-weight="700">await</text>
  </g>

  <!-- actor pool -->
  <text x="300" y="200" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700" opacity="0.8">Actor Pool (고정 워커 풀)</text>
  <g font-size="8" font-weight="700">
    <rect x="120" y="214" width="110" height="30" rx="4" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.5"/><text x="175" y="233" text-anchor="middle" fill="currentColor">Actor 1</text>
    <rect x="280" y="214" width="110" height="30" rx="4" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.5"/><text x="335" y="233" text-anchor="middle" fill="currentColor">Actor 2</text>
    <rect x="440" y="214" width="110" height="30" rx="4" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.5"/><text x="495" y="233" text-anchor="middle" fill="currentColor">Actor 3</text>
  </g>
  <text x="370" y="264" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.7">map / map_unordered / submit / get_next</text>

  <defs>
    <marker id="s2-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>Actor 모델 — **Actor**는 상태를 가진 전용 워커로, 같은 액터의 메서드는 순차 실행되고 서로 다른 액터는 병렬 실행됩니다. **Threaded 액터**(`+ max_concurrency` → 스레드 풀)와 **Async 액터**(`async def` → 단일 이벤트 루프)로 Job *내부* 의 동시성을 제어하고, **Actor Pool**로 고정 워커 풀을 만듭니다.</figcaption>
</figure>

## 한눈에 보기

Stage 1에서 Task(무상태)를 배웠다면, 이 단계는 **상태를 가진 분산 객체 — Actor** 입니다. Ray에서 작업에 "상태"가 필요하면(카운터, 캐시, 설정, 학습된 모델 등) 액터를 씁니다. 그리고 **"한 Ray Job 안에서 얼마나 동시에 실행할 것인가"** — in-process concurrency — 를 액터의 `max_concurrency` 매개변수로 제어하는 법이 이 단계의 핵심입니다.

이번 포스트에서 다루는 핵심 질문은 세 가지입니다.

1. **Actor는 무엇이고, 생명주기와 실행 규칙(순차/병렬)은 어떤가?**
2. **Threaded vs Async 액터는 어떻게 다르고, `max_concurrency`는 무엇을 하는가?**
3. **Actor Pool로 어떻게 상태 격리 워커 풀을 만드는가?**

## Actor — 상태를 가진 원격 객체

### 기본 액터

`@ray.remote`를 **클래스**에 붙이면 액터가 됩니다. `Actor.remote()`로 인스턴스를 만들고, `.메서드.remote()`로 비동기 호출합니다.

```python
import ray

ray.init(num_cpus=4)

@ray.remote
class Counter:
    def __init__(self):
        self.value = 0

    def increment(self):
        self.value += 1
        return self.value

counter = Counter.remote()
print(ray.get(counter.increment.remote()))  # 1
print(ray.get(counter.increment.remote()))  # 2
```

핵심 규칙:

- **전용 워커 프로세스**: 액터는 자기만의 파이썬 프로세스를 독점합니다. 다른 작업과 공유하지 않습니다.
- **메서드 순차 실행**: 같은 액터에 대한 호출은 도착 순서대로 **직렬** 실행됩니다. 그래서 `self.value` 같은 공유 상태가 안전하게 유지됩니다.
- **서로 다른 액터는 병렬**: 다른 액터 인스턴스들은 각자 별개 프로세스에서 동시에 돌 수 있습니다.
- **자원 명시**: `@ray.remote(num_cpus=2, num_gpus=0.5)` 처럼 리소스를 정할 수 있습니다.

### 액터 핸들 전달

액터 핸들을 다른 Task/액터에 인자로 넘기면 **분산 상태 서비스**를 만들 수 있습니다. 예를 들어 여러 Task가 하나의 `Counter`를 공유해 집계를 모을 수 있습니다.

```python
@ray.remote
def add_one(counter):
    return ray.get(counter.increment.remote())

counter = Counter.remote()
print(ray.get([add_one.remote(counter) for _ in range(5)]))  # [1,2,3,4,5]
```

> **내결함성:** 액터는 기본적으로 재시작되지 않습니다. 필요하면 `@ray.remote(max_restarts=N, max_task_retries=M)` 로 재시작·재시도를 허용할 수 있습니다.

## in-process 동시성 — Threaded vs Async 액터

"한 액터 안에서" **동시 실행**을 만들고 싶다면 `max_concurrency`를 씁니다. 단, **메서드가 `async def`인지 동기인지에 따라 동작이 완전히 달라집니다.**

> **중요 구분:** 어떤 메서드든 하나라도 `async def`라면, Ray는 그 액터를 **AsyncActor**로 취급합니다. 전부 동기 메서드라면 ThreadedActor입니다.

### Threaded 액터 (동기 메서드 + `max_concurrency`)

```python
@ray.remote
class IOWorker:
    def __init__(self):
        self.done = 0

    def fetch(self, url):          # 동기 메서드
        import time; time.sleep(0.2)
        self.done += 1
        return self.done

worker = IOWorker.remote()
# max_concurrency=N → 프로세스 내 N-스레드 스레드 풀로 메서드 병렬 실행
pool = worker.fetch.options(max_concurrency=8)
print(ray.get([pool(url) for url in ["a", "b", "c", "d"]]))
```

- 동기 메서드 + `max_concurrency=N` → **N-스레드 스레드 풀**로 메서드가 병렬 실행됩니다.
- **GIL 주의:** 순수 Python은 여전히 GIL에 묶여 병렬 이득이 없습니다. **Numpy·TensorFlow·PyTorch 등 GIL을 해제하는 C/C++ 확장**이나 **I/O** 작업에서 효과적입니다.

### Async 액터 (async def → 단일 이벤트 루프)

```python
@ray.remote
class AsyncFetcher:
    async def fetch(self, url):       # async def → AsyncActor
        import httpx, asyncio
        async with httpx.AsyncClient() as c:
            return (await c.get(url)).status_code

fetcher = AsyncFetcher.remote()
# max_concurrency 기본 1000; 필요 시 .options(max_concurrency=16) 로 상한
results = [fetcher.fetch.remote(u) for u in urls]
print(ray.get(results))
```

- 액터 내부가 **단일 asyncio 이벤트 루프**이고, `await` 지점에서 컨텍스트를 전환합니다. **한 번에 하나만 실행**하지만 I/O 대기 동안 다른 코루틴으로 넘어갑니다(고루틴과 유사).
- **`max_concurrency` 기본값은 1000**입니다. 동시 인-플라이트(in-flight) 코루틴 수를 `max_concurrency=N`으로 상한을 둡니다.

### 행동 좌표의 함정

> **Async 액터 메서드 안에서 `ray.get`/`ray.wait`를 호출하면 안 됩니다.** 이벤트 루프를 블록해 버립니다. 결과를 기다려야 한다면 `await object_ref`를 쓰세요.

```python
@ray.remote
class Bad:
    async def wrong(self, ref):
        val = ray.get(ref)      # ❌ 이벤트 루프 블록 — 금지
        return val

    async def right(self, ref):
        return await ref        # ✅ await로 기다리기
```

### 무엇을 언제 선택하나 — 현실 가이드

| 작업 성격 | 선택 |
|---|---|
| I/O-bound (네트워크·파일) | **Async 액터** (await, 단일 루프) |
| NumPy/Torch 등 C 확장 (GIL 해제) | **Threaded 액터** (스레드 풀) |
| 순수 Python CPU 작업 | 액터가 아니라 **Task / 프로세스** (Step 1) |
| 이벤트 루프 안에서 다른 ref 대기 | **`await ref`** (ray.get 금지) |

## Actor Pool — 고정 워커 풀

동일한 액터 N개를 만들고 작업을 고르게 나눠주는 것이 **`ray.util.ActorPool`** 입니다. "job 내부의 컨슈머 그룹"에 해당합니다.

```python
import ray
from ray.util import ActorPool

ray.init(num_cpus=4)

@ray.remote
class CounterWorker:
    def __init__(self):
        self.count = 0
    def work(self, x):                 # 동기 메서드
        self.count += 1
        return x * 2

pool = ActorPool([CounterWorker.remote() for _ in range(4)])

print(list(pool.map(lambda w, x: w.work.remote(x), range(8))))        # 순서 유지
print(list(pool.map_unordered(lambda w, x: w.work.remote(x), range(8))))  # 완료순
```

- **`pool.map` / `map_unordered`**: 항목을 워커들에 분배하고 결과를 순서/완료순으로 모읍니다.
- **`pool.submit` + `get_next` / `get_next_unordered`**: 명시적으로 하나씩 제출하고 결과를 뽑는 저수준 제어.
- 각 액터는 **자체 프로세스**이므로 상태가 격리됩니다 — 상태 격리가 필요한 로컬 워커 풀에 적합합니다.

이 패턴은 [Concurrency Essential](/2026/08/24/concurrency-essential-curriculum.html) 시리즈의 **워커 풀(Worker Pool)** 개념과 정확히 대응합니다 — 파이썬 `ThreadPool`/`ProcessPool`이 "워커 + 큐"로 구현한 것을 Ray는 액터 풀로 표현합니다.

## Summary

- **Actor**는 상태를 가진 **전용 워커 프로세스**입니다. 같은 액터의 메서드는 순차, 서로 다른 액터는 병렬 실행됩니다.
- **in-process 동시성**은 `max_concurrency`로 제어합니다 — 동기 메서드면 **스레드 풀**(GIL은 C 확장/I/O에서만 해제), `async def`면 **단일 이벤트 루프**(기본 1000 동시 코루틴).
- Async 액터 안에서 `ray.get`/`ray.wait`는 금지 — `await ref`를 쓰세요.
- **Actor Pool**은 동일 액터 N개를 고정 워커 풀로 만들어 `map`/`map_unordered`로 작업을 분배합니다.

### 다음 학습 (Next Learning)

- **Stage 3 · Ray Data 파이프라인** — Task/Actor를 넘어 block 단위의 데이터 파이프라인과 샤딩을 다룹니다.
- [Stage 1 · Ray 기본과 로컬 설치](/2026/08/24/stage1-ray-기본과-로컬-설치.html) — Task 와 ObjectRef, raylet/Worker 기초를 다시 확인.
- [Concurrency Essential](/2026/08/24/concurrency-essential-curriculum.html) — 워커 풀/동시성 개념의 파이썬·Go 버전과 대비.
