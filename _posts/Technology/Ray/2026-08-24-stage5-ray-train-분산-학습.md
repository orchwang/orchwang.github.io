---
layout: post
title: "Stage 5 · Ray Train 분산 학습 — 데이터 샤딩 · 체크포인트"
date: 2026-08-24 00:05:00
categories: [Technology, Ray]
tags: [ray, train, distributed, pytorch, ddp, python, ml]
series: Ray-Essential
published: true
excerpt: "PyTorch 모델을 노트북에서 N개 워커로 분산 학습합니다. TorchTrainer와 ScalingConfig로 워커 수를 정하고, 각 워커가 데이터의 서로 다른 '샤드'를 받는 원리(get_dataset_shard·DistributedSampler), 그리고 체크포인트 저장·복원을 실습합니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="Ray Train 분산 학습 그림. 하나의 데이터셋이 num_workers=N 만큼의 서로 다른 '샤드'로 나뉘어 각 워커(worker 0,1,2...)가 자기 샤드만 학습한다. 각 워커는 prepare_model로 감싼 모델을 돌리고, 정기적으로 체크포인트를 공유 저장소에 기록한다. '전역 배치 = 워커배치 × world_size' 공식을 표시한다." viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg">
  <title>Ray Train — 데이터를 워커 수만큼 샤드로 나눠 각 워커가 자기 샤드로 학습, 체크포인트 공유</title>

  <!-- dataset -->
  <text x="70" y="60" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">데이터셋</text>
  <rect x="20" y="72" width="100" height="52" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.2"/>
  <text x="70" y="102" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.8">get_dataset_shard</text>

  <!-- shard split arrows -->
  <path d="M120 98 L160 98" fill="none" stroke="var(--secondary-color)" stroke-width="1.6" marker-end="url(#s5-arrow)"/>
  <text x="158" y="92" text-anchor="middle" font-size="8" fill="var(--secondary-color)" font-weight="700">샤딩</text>

  <!-- workers -->
  <g font-size="7.5" font-weight="700">
    <rect x="168" y="30" width="150" height="26" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.3"/><text x="243" y="46" text-anchor="middle" fill="currentColor">Worker 0 · 샤드 0 · DDP</text>
    <rect x="168" y="84" width="150" height="26" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.3"/><text x="243" y="100" text-anchor="middle" fill="currentColor">Worker 1 · 샤드 1 · DDP</text>
    <rect x="168" y="138" width="150" height="26" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.3"/><text x="243" y="154" text-anchor="middle" fill="currentColor">Worker 2 · 샤드 2 · DDP</text>
  </g>
  <path d="M120 98 L170 43 M120 98 L170 97 M120 98 L170 151" fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#s5-arrow)"/>

  <!-- checkpoint shared -->
  <rect x="400" y="80" width="180" height="52" rx="4" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="490" y="102" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">체크포인트 (공유 저장소)</text>
  <text x="490" y="118" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.8">RunConfig · CheckpointConfig</text>
  <path d="M470 121 L450 156 M490 132 L490 156 M510 121 L530 156" fill="none" stroke="currentColor" stroke-width="1.3" marker-end="url(#s5-arrow)"/>

  <rect x="130" y="214" width="420" height="34" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5"/>
  <text x="340" y="234" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="700">전역 배치 크기 = 워커별 배치 × world_size</text>

  <defs>
    <marker id="s5-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>Ray Train — 하나의 데이터셋이 **num_workers만큼의 서로 다른 샤드**로 나뉘고, 각 워커는 `get_dataset_shard()`/`DistributedSampler`가 준 자기 샤드만으로 DDP 학습을 진행합니다. **전역 배치 크기 = 워커별 배치 × world_size**이며, 체크포인트는 공유 저장소(로컬 경로)에 기록됩니다.</figcaption>
</figure>

## 한눈에 보기

[Stage 3](/2026/08/24/stage3-ray-data-파이프라인.html)에서 데이터를 샤딩하는 법을 배웠다면, 이 단계는 **학습 자체를 워커에 분산**하는 Ray Train입니다. 핵심 통찰은 — **각 워커가 데이터의 서로 다른 "샤드"를 받고, 자기 샤드로 모델을 학습한다** 는 것입니다. 노트북에서 `ScalingConfig(num_workers=N)`으로 워커 수를 정하면, N개 파이썬 프로세스가 한 머신에서 분산 학습을 합니다.

이번 포스트에서 다루는 핵심 질문은 세 가지입니다.

1. **TorchTrainer와 ScalingConfig로 분산 학습을 시작하는 방법은?**
2. **데이터가 워커별로 샤딩되는 원리(`get_dataset_shard`/`DistributedSampler`)와 전역 배치 계산은?**
3. **체크포인트 저장·복원과 Train V2 주의점은?**

## TorchTrainer 기본

Ray Train은 프레임워크별 `Trainer`를 제공합니다(PyTorch, Lightning, HuggingFace, TensorFlow, XGBoost 등). 파이토치 예시로 시작합니다.

```bash
pip install -U "ray[train]" torch
```

학습은 **각 워커가 실행하는 함수**로 작성합니다. `ScalingConfig(num_workers=N)`이 워커 수를 정합니다.

```python
import torch
import torch.nn as nn
import ray
from ray import train
from ray.train import ScalingConfig
from ray.train.torch import TorchTrainer

def train_func(config):
    model = nn.Linear(4, 2)
    # DDP 래핑: 모델을 GPU/장치로 옮기고 분산 학습 지원
    model = train.torch.prepare_model(model)

    loader = torch.utils.data.DataLoader(
        simple_dataset(), batch_size=32, shuffle=True,
    )
    # 데이터 로더에 DistributedSampler 추가 (각 워커가 다른 샤드)
    loader = train.torch.prepare_data_loader(loader)

    loss_fn = nn.MSELoss()
    opt = torch.optim.SGD(model.parameters(), lr=0.01)

    for epoch in range(10):
        for x, y in loader:
            opt.zero_grad()
            out = model(x)
            loss = loss_fn(out, y)
            loss.backward()
            opt.step()
        train.report({"loss": loss.item()})   # 메트릭 보고

trainer = TorchTrainer(
    train_func,
    scaling_config=ScalingConfig(num_workers=4, use_gpu=False),  # 노트북 CPU 4 워커
)
result = trainer.fit()
print(result.metrics)
```

- **`ScalingConfig(num_workers=N)`** : 분산 학습 워커 프로세스 수. **로컬에선 N ≤ 논리 코어 수**여야 합니다.
- **`prepare_model`** : 모델을 장치로 옮기고 DDP(분산 데이터 병렬)로 래핑.
- **`prepare_data_loader`** : 데이터 로더에 `DistributedSampler`를 붙여 워커 간 데이터를 샤딩.
- **`train.report(metrics)`** : 메트릭 보고 + 선택적으로 체크포인트 첨부.

## 데이터 샤딩 — 각 워커는 자기 샤드만

### `DistributedSampler` — 워커별 disjoint 샤드

`prepare_data_loader`가 사용하는 `DistributedSampler`는 데이터를 워커 수만큼 **서로 안 겹치는 조각**으로 나눕니다. 이게 바로 **"학습 샤딩"** 입니다.

- 각 워커는 전체 데이터가 아니라 **자기 샤드**만 반복합니다(겹침 없음).
- 자원의 맥락은 `ray.train.get_context()`로 얻습니다.

```python
from ray import train

ctx = train.get_context()
print("세계 크기(world_size):", ctx.get_world_size())
print("내 rank:", ctx.get_world_rank())
```

### 전역 배치 크기

`batch_size`는 **워커별** 값입니다. 전체(전역) 배치는:

```text
global_batch_size = worker_batch_size × world_size
```

예: `batch_size=32`, `num_workers=4` → 전역 배치 128. 하이퍼파라미터를 워커 수와 무관하게 맞추려면 이 공식으로 `worker_batch_size`를 계산해 쓰는 것이 좋습니다.

### Ray Data 연동 — `get_dataset_shard`

[Stage 3](/2026/08/24/stage3-ray-data-파이프라인.html)의 `Dataset`을 학습에 직접 넘기면, Ray가 알아서 워커별 샤드로 나눠줍니다.

```python
from ray.data import from_items

train_ds = from_items([{"x": [i, i], "y": [i]} for i in range(1000)])

def train_func(config):
    shard = train.get_dataset_shard()        # 이 워커가 받은 데이터 샤드
    for batch in shard.iter_torch_batches(batch_size=32):
        x = batch["x"]; y = batch["y"]
        # ... 학습 ...
        break

trainer = TorchTrainer(
    train_func,
    scaling_config=ScalingConfig(num_workers=4),
    datasets={"train": train_ds},
)
```

- **`train.get_dataset_shard()`** : 이 워커 전용 `DataIterator` 샤드를 반환.
- ⚠️ `DistributedSampler`는 `IterableDataset`(무한 반복)과 안 어울립니다 — 그럴 땐 Ray Data를 쓰세요.

## 체크포인트와 복원

학습 상태(모델 가중치·옵티마이저)를 저장·복원하려면 `RunConfig`와 `train.report`의 `checkpoint`를 씁니다.

```python
from ray.train import RunConfig

def train_func(config):
    model = train.torch.prepare_model(nn.Linear(4, 2))
    ckpt_dir = "/tmp/my_ckpt"                # 로컬 단일 노드면 로컬 경로 OK
    for step in range(20):
        # ... 학습 ...
        train.report(
            {"loss": value},
            checkpoint=train.Checkpoint.from_directory(ckpt_dir),
        )

trainer = TorchTrainer(
    train_func,
    scaling_config=ScalingConfig(num_workers=4),
    run_config=RunConfig(
        storage_path="/tmp/ray_train_runs",  # 단일 노드: 로컬 경로
        name="my_experiment",
    ),
)
result = trainer.fit()
print(result.checkpoint)    # 최종/최고 체크포인트 경로
print(result.error)         # 오류 시
```

- **체크포인트로 복원**하려면: `train.get_checkpoint()` 로 워커 내부에서 다시 읽습니다.
- **Train V2 주의:** 최신 Ray(2.43+·**3.x**)는 **Train V2 API**가 기본화되고 있습니다(구 V1과 `RAY_TRAIN_V2_ENABLED=1`로 전환). 설치한 Ray 버전의 API 시그니처를 확인하세요. 스토리지 경로는 다중노드에선 공유 스토리지가 필요하지만, **단일 노드에선 로컬 경로로 충분**합니다.

> **로컬 리소스 주의:** `num_workers`를 코어 수보다 크게 잡으면 워커들이 서로 CPU를 다퉈 오히려 느려집니다. `OMP_NUM_THREADS`를 낮춰 워커마다 스레드 풀이 폭주하는 것도 막아야 합니다(Stage 1 참고).

## Summary

- **Ray Train**은 `ScalingConfig(num_workers=N)`으로 모델을 **분산 학습**합니다. 노트북에선 N ≤ 코어 수.
- **데이터 샤딩**: `prepare_data_loader`/`DistributedSampler` 또는 Ray Data의 `get_dataset_shard()`가 각 워커에 **겹치지 않는 데이터 샤드**를 줍니다.
- **전역 배치 = 워커별 배치 × world_size**.
- **체크포인트**: `train.report(..., checkpoint=...)` + `RunConfig(storage_path=...)`로 저장·복원하며, 단일 노드면 로컬 경로로 충분. Train V2 기본화에 주의.

### 다음 학습 (Next Learning)

- **Stage 6 · Ray Serve 서빙** — 학습한 모델을 로컬에서 HTTP 엔드포인트로 배포합니다.
- [Stage 3 · Ray Data 파이프라인](/2026/08/24/stage3-ray-data-파이프라인.html) — 학습용 데이터 준비와 샤딩 기초.
- [Stage 4 · Ray Tune 튜닝](/2026/08/24/stage4-ray-tune-튜닝.html) — `Trainer`를 `Tuner`로 감싸 하이퍼파라미터를 탐색.
