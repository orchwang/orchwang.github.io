---
layout: post
title: "Stage 4 · Ray Tune 튜닝 — 하이퍼파라미터 자동화"
date: 2026-08-24 00:04:00
categories: [Technology, Ray]
tags: [ray, tune, hyperparameter, optimization, python, ml]
series: Ray-Essential
published: true
excerpt: "머신러닝 모델의 하이퍼파라미터 탐색을 Ray Tune으로 코어 수만큼 병렬 자동화합니다. Tuner와 탐색 공간 정의부터 ASHA/HyperBand 조기 종료, 그리고 하나의 코어에 여러 트라이얼을 얹는 오버서브스크라이빙까지 로컬 활용 전략을 실습합니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="Ray Tune 하이퍼파라미터 탐색 그림. 중앙의 Tuner가 탐색 공간(learning_rate, depth 등)에서 여러 트라이얼을 생성하고, 각 트라이얼이 노트북의 CPU 코어(+ 소수 코어 오버서브스크라이빙)에서 병렬로 학습·평가된다. 성능이 나쁜 트라이얼은 ASHA 조기 종료로 일찍 가지치기되고, 최종적으로 최고 성능 트라이얼 1개가 남는 모습." viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg">
  <title>Ray Tune — 탐색 공간에서 트라이얼을 병렬 생성하고 ASHA로 조기 종료(가지치기)</title>

  <!-- search space -->
  <text x="70" y="40" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">탐색 공간</text>
  <rect x="20" y="52" width="130" height="70" rx="4" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="85" y="74" text-anchor="middle" font-size="8" fill="currentColor">lr: loguniform</text>
  <text x="85" y="88" text-anchor="middle" font-size="8" fill="currentColor">depth: choice</text>
  <text x="85" y="102" text-anchor="middle" font-size="8" fill="currentColor">batch: grid_search</text>

  <!-- tuner -->
  <rect x="220" y="60" width="120" height="44" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.4"/>
  <text x="280" y="80" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">Tuner</text>
  <text x="280" y="94" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.8">트라이얼 생성</text>
  <path d="M150 80 L218 80" fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#s4-arrow)"/>

  <!-- trials on cores -->
  <g font-size="7.5" font-weight="700">
    <rect x="360" y="30" width="120" height="26" rx="4" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.4"/><text x="420" y="46" text-anchor="middle" fill="currentColor">Trial A · 코어 1</text>
    <rect x="360" y="78" width="120" height="26" rx="4" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.4"/><text x="420" y="94" text-anchor="middle" fill="currentColor">Trial B · 코어 2</text>
    <rect x="360" y="126" width="120" height="26" rx="4" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.4"/><text x="420" y="142" text-anchor="middle" fill="currentColor">Trial C · 코어 3</text>
    <rect x="520" y="78" width="120" height="26" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.3"/><text x="580" y="94" text-anchor="middle" fill="currentColor">Trial D · 코어 &#8531;</text>
  </g>
  <path d="M340 82 L358 43 M340 82 L358 91 M340 82 L358 139 M340 82 L518 91" fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#s4-arrow)"/>

  <!-- ASHA prune -->
  <text x="420" y="196" text-anchor="middle" font-size="10" fill="currentColor" font-weight="700">ASHA 조기 종료</text>
  <path d="M420 176 L420 198" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <text x="420" y="222" text-anchor="middle" font-size="8.5" fill="currentColor" opacity="0.8">성능 낮은 트라이얼 가지치기 → 최고 1개만</text>

  <!-- winner -->
  <g transform="translate(300 238)">
    <rect x="0" y="0" width="130" height="40" rx="4" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="2"/>
    <text x="65" y="18" text-anchor="middle" font-size="9" fill="var(--gold)" font-weight="700">Best Trial</text>
    <text x="65" y="31" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.8">get_best_result</text>
  </g>

  <defs>
    <marker id="s4-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>Ray Tune — 탐색 공간에서 **Tuner**가 여러 **트라이얼**을 생성해 노트북 코어에 병렬로 배분하고, `with_resources`로 한 코어에 여러 트라이얼(오버서브스크라이브)을 얹을 수도 있습니다. **ASHA 조기 종료**가 성능 낮은 트라이얼을 일찍 가지치기해, 마지막에 최고 트라이얼 1개가 남습니다.</figcaption>
</figure>

## 한눈에 보기

머신러닝을 하다 보면 "learning_rate를 몇으로, 깊이는 얼마로" 하는 **하이퍼파라미터**를 만지게 됩니다. 이걸 하나하나 손으로 돌리면 시간 낭비가 큽니다. **Ray Tune**은 이 탐색을 **코어 수만큼 병렬**로 자동화하고, 좋은 조합을 일찍 남기고 나쁜 조합은 일찍 끊는 도구입니다. 단독 함수도, [Stage 5](/2026/08/24/stage5-ray-train-분산-학습.html)의 `Trainer`도 모두 Objective로 감쌀 수 있습니다.

이번 포스트에서 다루는 핵심 질문은 세 가지입니다.

1. **Tuner로 탐색 공간을 정의하고 학습 함수를 최적화하는 기본 흐름은?**
2. **ASHA/HyperBand 같은 조기 종료와 탐색 알고리즘은 어떻게 쓰나?**
3. **한 대의 노트북에서 코어를 오버서브스크라이브해 트라이얼을 병렬화하는 전략은?**

## Tuner 기본

목표는 단순한 **함수(Objective)** 입니다. `config`(딕셔너리)를 받아 메트릭을 `tune.report`로 보고합니다.

```python
import ray
from ray import tune
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import cross_val_score

ray.init(num_cpus=4)

def train_rf(config):
    X, y = load_iris(return_X_y=True)
    model = RandomForestClassifier(
        n_estimators=config["n_estimators"],
        max_depth=config["max_depth"],
    )
    score = cross_val_score(model, X, y, cv=3).mean()
    tune.report({"mean_accuracy": score})   # 메트릭 보고

search_space = {
    "n_estimators": tune.grid_search([50, 100, 200]),
    "max_depth": tune.choice([2, 4, 8]),
}

tuner = tune.Tuner(
    train_rf,
    param_space=search_space,
    tune_config=tune.TuneConfig(metric="mean_accuracy", mode="max"),
)
results = tuner.fit()

best = results.get_best_result(metric="mean_accuracy", mode="max")
print("최고 점수:", best.metrics["mean_accuracy"])
print("최고 config:", best.config)
```

- **`param_space`**: 탐색 공간. `tune.grid_search([...])`(모두 시도), `tune.choice`/`uniform`/`loguniform` 등.
- **`tune.report`**: 각 트라이얼이 학습 중 메트릭을 보고.
- **`TuneConfig(metric, mode)`**: 최적화 대상과 방향(max/min).
- **`get_best_result`**: 최고 트라이얼.

탐색 공간은 `loguniform`처럼 로그 스케일도 지정할 수 있습니다 — 넓은 값 범위를 효율적으로 탐색합니다.

```python
search_space = {
    "lr": tune.loguniform(1e-4, 1e-2),   # 로그 스케일
    "dropout": tune.uniform(0.0, 0.5),
}
```

## 조기 종료와 탐색 알고리즘

### 조기 종료 — ASHA / HyperBand

성능이 나쁜 트라이얼을 일찍 멈추면, 자원을 유망한 트라이얼에 집중할 수 있습니다. **ASHA**(Async Successive Halving)와 **HyperBand**가 대표적입니다.

```python
from ray.tune.schedulers import ASHAScheduler, HyperBandScheduler

tuner = tune.Tuner(
    train_rf,
    param_space=search_space,
    tune_config=tune.TuneConfig(
        metric="mean_accuracy",
        mode="max",
        scheduler=ASHAScheduler(time_attr="training_iteration", max_t=100),
    ),
)
results = tuner.fit()
```

### 탐색 알고리즘 — Optuna 등

무작위·그리드 대신 지능형 탐색을 쓰려면 `ray.tune.search`의 알고리즘을 연결합니다.

```python
from ray.tune.search.optuna import OptunaSearch

tuner = tune.Tuner(
    train_rf,
    param_space=search_space,
    tune_config=tune.TuneConfig(
        metric="mean_accuracy",
        mode="max",
        search_alg=OptunaSearch(),
    ),
)
```

지원 목록: Optuna, Hyperopt, BayesOpt, BOHB, Nevergrad, Ax 등.

## 로컬 리소스 제어 — 코어 오버서브스크라이빙

한 대 노트북의 코어 수는 한정적입니다. **트라이얼당 1 CPU**가 기본이므로 4코어면 4개만 동시에 돕니다. 더 빨리 많이 돌리고 싶다면:

- **`max_concurrent_trials`**: 동시 트라이얼 수 상한을 정합니다.
- **`tune.with_resources(trainable, {"cpu": 0.5})`**: 트라이얼당 **소수 CPU**를 줘서 한 코어에 여러 트라이얼을 올립니다(오버서브스크라이빙).

```python
from ray import tune

# 각 트라이얼이 0.5 CPU → 4코어에 최대 8개 트라이얼을 병렬
tuner = tune.Tuner(
    tune.with_resources(train_rf, {"cpu": 0.5}),
    param_space=search_space,
    tune_config=tune.TuneConfig(
        metric="mean_accuracy",
        mode="max",
        max_concurrent_trials=8,
    ),
)
results = tuner.fit()
```

> **실무 요령:** 각 트라이얼이 순수 Python/사이킷런이라면 GIL 때문에 소수 CPU 오버서브스크라이빙이 이득입니다. 반면 NumPy/Torch처럼 GIL을 풀어 코어를 다 쓰는 트라이얼이라면 **1 CPU당 1 트라이얼**이 맞습니다. 트라이얼의 성격에 따라 `with_resources`를 조절하세요.

> **GPU 참고:** `gpu` 자원을 지정하면 트라이얼에 `CUDA_VISIBLE_DEVICES`가 설정됩니다. 지정하지 않으면 CUDA가 비활성화됩니다.

## 로컬 활용 전략 — 실전 요약

1. **코어 수만큼 병렬 탐색**: 기본값만으로도 코어 수 트라이얼이 동시에 돕니다.
2. **조기 종료로 낭비 줄이기**: ASHA를 붙이면 나쁜 하이퍼파라미터 조합을 일찍 끊습니다.
3. **소수 CPU 오버서브스크라이빙**: GIL-bound(사이킷런 등) 트라이얼이면 `{"cpu": 0.5}`로 8개까지 병렬.
4. **Train과 연결**: [Stage 5](/2026/08/24/stage5-ray-train-분산-학습.html)의 `Trainer`를 Objective로 감싸 하이퍼파라미터 탐색 + 분산 학습을 동시에.

## Summary

- **Ray Tune**은 탐색 공간(`param_space`)에서 여러 **트라이얼**을 병렬 생성해 Objective 함수를 최적화합니다.
- `grid_search`/`loguniform`/`choice` 등으로 공간을 정의하고, `tune.report`로 메트릭을 보고합니다.
- **ASHA/HyperBand** 조기 종료와 **Optuna** 등 탐색 알고리즘으로 효율을 올립니다.
- 로컬에선 **`with_resources`(소수 CPU)** + `max_concurrent_trials`로 한 코어에 여러 트라이얼을 얹는 오버서브스크라이빙이 핵심 전략입니다.

### 다음 학습 (Next Learning)

- **Stage 5 · Ray Train 분산 학습** — `Tuner`로 감쌀 수 있는 `Trainer`로 모델을 워커에 분산 학습합니다.
- [Stage 3 · Ray Data 파이프라인](/2026/08/24/stage3-ray-data-파이프라인.html) — 튜닝에 넘길 데이터셋 전처리.
- [PostgreSQL Essential Curriculum](/2025/10/28/postgresql-essential-curriculum.html) — 튜닝과 결합할 수 있는 데이터 소스/DB 학습.
