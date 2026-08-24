---
layout: post
title: "Stage 3 · Ray Data 파이프라인 — block/샤딩 · batch 변환"
date: 2026-08-24 00:03:00
categories: [Technology, Ray]
tags: [ray, data, pipeline, sharding, python]
series: Ray-Essential
published: true
excerpt: "대용량 데이터 전처리를 Ray Data로 분산 파이프라인화합니다. 'DB shard = Ray Data block'이라는 멘탈 모델을 세우고, repartition·split·map_batches로 병렬도를 제어하며 수 GB CSV/Parquet를 로컬에서 처리하는 전략을 익힙니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="Ray Data 파이프라인 그림. 왼쪽의 하나의 논리적 데이터셋(테이블)이 여러 block(파티션)으로 쪼개지고, 각 block이 독립 워커/태스크로 분배되어 map_batches 변환을 거쳐, 다시 결과 데이터셋으로 모아지는 흐름. '데이터셋 = block들의 묶음, 병렬도 = block 수, DB shard = block'이라는 샤딩 멘탈 모델을 강조한다." viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg">
  <title>Ray Data 샤딩 — 하나의 데이터셋을 block(샤드)로 쪼개 독립 워커가 병렬 변환</title>

  <!-- source dataset -->
  <text x="70" y="40" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">데이터셋</text>
  <rect x="20" y="52" width="100" height="60" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.2"/>
  <text x="70" y="84" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.8">read_parquet 등</text>

  <!-- split into blocks -->
  <g transform="translate(170 40)">
    <rect x="0" y="24" width="22" height="44" rx="3" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.5"/>
    <rect x="30" y="14" width="22" height="44" rx="3" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.5"/>
    <rect x="60" y="30" width="22" height="44" rx="3" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.5"/>
    <text x="16" y="86" text-anchor="middle" font-size="7" fill="currentColor" opacity="0.8">block1</text>
    <text x="41" y="86" text-anchor="middle" font-size="7" fill="currentColor" opacity="0.8">block2</text>
    <text x="71" y="86" text-anchor="middle" font-size="7" fill="currentColor" opacity="0.8">block3</text>
    <text x="41" y="6" text-anchor="middle" font-size="8" fill="var(--secondary-color)" font-weight="700">샤딩</text>
  </g>

  <!-- parallel workers -->
  <g font-size="7.5" font-weight="700">
    <rect x="250" y="46" width="130" height="22" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.3"/><text x="315" y="60" text-anchor="middle" fill="currentColor">Task/액터 · map_batches</text>
  </g>
  <g font-size="7.5" font-weight="700">
    <rect x="390" y="18" width="130" height="22" rx="3" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.5"/><text x="455" y="32" text-anchor="middle" fill="currentColor">map_batches (batch)</text>
    <rect x="390" y="122" width="130" height="22" rx="3" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.5"/><text x="455" y="136" text-anchor="middle" fill="currentColor">map_batches (batch)</text>
  </g>

  <!-- result -->
  <text x="580" y="84" text-anchor="middle" font-size="8" fill="var(--secondary-color)" font-weight="700">to_pandas() / write_parquet</text>
  <polyline points="355,57 390,29 520,29 520,72 560,84" fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#s3-arrow)"/>
  <polyline points="355,57 390,133 420,133 560,84" fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#s3-arrow)"/>

  <text x="300" y="210" text-anchor="middle" font-size="11" fill="currentColor" font-weight="700" opacity="0.8">"병렬도 = block 수"</text>
  <text x="340" y="240" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.8">DB의 shard = Ray Data의 block</text>

  <defs>
    <marker id="s3-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>Ray Data 샤딩 — 하나의 논리 데이터셋이 **block**(파티션)들로 쪼개지고, 각 block이 독립 워커/태스크로 분배되어 `map_batches` 변환을 거친 뒤 다시 모입니다. **데이터베이스·Kafka의 "shard"는 Ray Data의 "block"과 정확히 대응**하고, 병렬도는 곧 block 수입니다.</figcaption>
</figure>

## 한눈에 보기

Stage 1·2가 "작업(코드)"을 분산했다면, 이 단계는 **"데이터"를 분산**하는 Ray Data입니다. Pandas로 못 푸는 크기의 데이터를 `read_*` 로 읽어 `map`/`map_batches` 파이프라인으로 변환하고, 다시 `to_pandas()` 로 꺼내는 흐름입니다. 그리고 여기서 **"Ray shards"** 라는 용어의 실체를 다잡습니다.

이번 포스트에서 다루는 핵심 질문은 세 가지입니다.

1. **Ray Data로 데이터셋을 만들고 변환·저장하는 기본 흐름은 어떤가?**
2. **"block(= 샤드)"이란 무엇이고, 어떻게 병렬도와 분할을 제어하나?**
3. **`map_batches`와 연산 전략(Task/Actor Pool)은 어떻게 쓰나?**

## Ray Data 기초

### 데이터셋 만들기

`ray.data` 로 데이터셋(Dataset)을 만드는 방법은 다양합니다.

```python
import ray
from ray.data import Dataset

ray.init(num_cpus=4)

# 1) 메모리에서
ds = ray.data.from_items([{"x": i, "y": i * 2} for i in range(100)])
print(ds.count())  # 100

# 2) pandas에서
import pandas as pd
ds2 = ray.data.from_pandas(pd.DataFrame({"a": range(1000), "b": range(1000)}))

# 3) 파일에서 (parquet/csv/json/sql 등)
ds3 = ray.data.read_parquet("data/")                 # 로컬/원격 파일
ds4 = ray.data.read_csv("data/raw.csv")
ds5 = ray.data.read_sql("SELECT * FROM logs", con=...)  # DB와 연동
```

### 변환 — 지연(lazy) 실행

Ray Data 변환은 **지연 실행**입니다. 실제 계산은 반복/저장 시점에 일어납니다. 기본 변환은:

```python
# map: row 1개 → row 1개
ds = ds.map(lambda row: {"x": row["x"] * 10, "y": row["y"]})

# filter: 조건 통과 row만
ds = ds.filter(lambda row: row["x"] > 0)

# flat_map: row 1개 → 여러 row
ds = ds.flat_map(lambda row: [{"x": row["x"], "i": i} for i in range(row["x"])])
```

### 저장 / pandas로 꺼내기

```python
# 결과를 pandas로 (메모리에 들어가는 크기일 때만!)
pdf = ds.to_pandas()

# 파일로 저장
ds.write_parquet("output/")
ds.write_csv("output_csv/")
```

> **주의:** `to_pandas()`는 전체 결과를 메모리로 당깁니다. 한 대 노트북 기준으로, 결과가 메모리에 안 들어가면 `write_parquet`로 저장한 뒤 부분적으로 처리하세요.

## block과 샤딩 — 병렬도의 본질

### "DB shard = Ray Data block"

Ray에서 **"shard"는 부품이 아니라 행위(partitioning)입니다.** 계산 쪽은 워커/태스크/액터가 담당합니다. 데이터 분할은 **block**이라는 단위로 이뤄지고, 이게 데이터베이스·Kafka의 샤드와 1:1 대응됩니다.

| DB/Kafka 용어 | Ray Data 용어 |
|---|---|
| 샤드 (데이터 하위 집합) | **block** (Arrow 파티션) |
| 샤딩 (분할) | 파티셔닝 / `repartition` |
| 병렬 컨슈머 | block별 독립 Task/액터 |
| 샤드 나누는 동작 | `split(n)` / `split_at_indices` |

개념 요약:
- **block = "데이터셋의 단일 파티션"** 이며 Arrow/Pandas 열 형식으로 저장됩니다.
- **병렬도 = block 수.** 각 block(또는 `batch_size` 묶음)이 하나의 Ray Task/액터가 되어 처리됩니다.
- **`repartition(n)`** : block 수를 정확히 n개로 다시 쪼갭니다(전체 셔플이라 스트리밍을 끊음).

```python
ds = ray.data.range(1000)                # 1개 block으로 시작
ds = ds.repartition(8)                   # 8개 block → 병렬도 8
print(ds.to_pandas().shape)
```

### 데이터를 "샤드로" 쪼개기 — split

데이터를 실제로 N개 조각으로 나누어 N개의 워커/액터에 배포하려면:

```python
# n개 조각으로 찢기 (구현 전에 파이프라인 먼저 실행)
pieces = ds.split(4)                     # [Dataset, Dataset, ...] 4조각
for piece in pieces:
    print("조각 크기:", piece.count())

# 인덱스 기준 정밀 분할
parts = ds.split_at_indices([100, 300])  # [0:100], [100:300], [300:]

# 스트리밍 (전체 메모리에 materialize하지 않고 조각을)
iters = ds.streaming_split(4)            # DataIterator 리스트
```

- **`split(n)`** : n개의 서로소 조각으로 찢어 N개 워커/액터에 먹이기에 정석. 이게 "데이터를 샤드로 나누는" 동작입니다.
- **`streaming_split(n)`** : 전체를 메모리에 올리지 않고 스트리밍으로 조각을 제공합니다.
- **`random_shuffle()` / `sort()` / `groupby()`** : 셔플이 필요해 스트리밍을 끊습니다.

## `map_batches`와 연산 전략 — batch 변환 실전

`map`이 row 단위라면, **`map_batches`** 는 batch(여러 row 묶음) 단위로 벡터화된 변환을 수행합니다. ML 전처리의 실무 표준입니다.

```python
import numpy as np

ds = ray.data.from_pandas(pd.DataFrame({"x": np.random.randn(2000)}))

def normalize(batch: dict) -> dict:
    arr = batch["x"]
    return {"x": (arr - arr.mean()) / (arr.std() + 1e-9)}

ds = ds.map_batches(normalize, batch_format="numpy", batch_size=256)
print(ds.to_pandas().head())
```

- **`batch_format`** : `"numpy"`, `"pandas"`, `"pyarrow"` 중 선택.
- **`batch_size`** : 한 태스크가 처리할 block 묶음 크기. **GPU 연산 시엔 반드시 명시**합니다.

### 연산(strategy) — Task Pool vs Actor Pool

`compute` 인자로 "각 block을 Task로 돌릴지 액터로 돌릴지"를 정합니다.

```python
from ray.data import TaskPoolStrategy, ActorPoolStrategy

# 함수(Function) → TaskPool 기본: 자원/block 수 기반으로 동시 태스크
ds.map_batches(normalize, compute=TaskPoolStrategy(size=4))

# 클래스(Callable) → ActorPool 기본: 상태를 가진 모델 등을 액터로 보관
class Encode:
    def __init__(self):
        self.model = load_model()       # 각 액터가 모델 로드
    def __call__(self, batch):
        return self.model(batch)

ds.map_batches(Encode, compute=ActorPoolStrategy(size=2))
```

- **`TaskPoolStrategy(size=n)`** : 최대 n개의 동시 태스크(무상태 함수에 적합).
- **`ActorPoolStrategy(size=n)` / `(min_size, max_size)`** : n(또는 오토스케일)개의 액터 — 상태(모델) 보관에 적합.
- ⚠️ **이전에 쓰던 `concurrency` 인자는 deprecated** — 지금은 `compute`를 쓰세요.

> **병렬도 제제 요령:** block 수가 많을수록 동시성이 커지고, `batch_size`를 키우면 한 태스크가 더 많은 block을 묶어 태스크 수가 줄어듭니다(동시성 감소). 코어 수와 데이터 크기에 맞춰 조절하세요.

## 로컬 활용 전략 — 실전 요약

1. **Pandas가 못 푸는 크기** → `read_*` 로 분산 파이프라인을 만들고 `map_batches` → `write_parquet`.
2. **모델 전처리 배치** → `ActorPoolStrategy`로 각 액터에 모델을 로드해 병렬 추론.
3. **DB 샤딩 멘탈 모델** → "한 데이터셋 = block(= 샤드) 묶음", `repartition`·`split`으로 분할 제어.
4. **결과 크기 주의** → `to_pandas()`는 메모리에 다 들어갈 크기일 때만.

## Summary

- **Ray Data**는 block 단위로 병렬 처리되는 지연(lazy) 데이터 파이프라인입니다.
- **"DB/Kafka의 shard = Ray의 block"** — 샤딩은 데이터를 독립 워커에 분할 배치하는 행위이며, **병렬도 = block 수**입니다.
- `repartition(n)`·`split(n)`·`streaming_split(n)`으로 분할을 제어하고, `map_batches`로 배치 변환합니다.
- `compute=TaskPoolStrategy`(무상태) vs `ActorPoolStrategy`(상태)로 실행 전략을 고릅니다(구 `concurrency` 인자는 deprecated).

### 다음 학습 (Next Learning)

- **Stage 4 · Ray Tune 튜닝** — 하이퍼파라미터 탐색을 코어 수만큼 병렬로 자동화합니다.
- [Stage 1 · Ray 기본과 로컬 설치](/2026/08/24/stage1-ray-기본과-로컬-설치.html) — Task·ObjectRef 기초.
- [PostgreSQL Essential Curriculum](/2025/10/28/postgresql-essential-curriculum.html) — Ray Data의 `read_sql()`로 데이터베이스 데이터를 분산 파이프라인에 연결하는 케이스.
