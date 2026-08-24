---
layout: post
title: "Stage 6 · Ray Serve 서빙 — 로컬 모델 배포 · 스케일/동시성"
date: 2026-08-24 00:06:00
categories: [Technology, Ray]
tags: [ray, serve, deployment, inference, python, ml]
series: Ray-Essential
published: true
excerpt: "앞선 Stage 5에서 학습한 모델을 Ray Serve로 로컬 HTTP 엔드포인트에 배포합니다. @serve.deployment와 serve.run으로 모델을 띄우고, deployment graph와 FastAPI 인그레스로 여러 모델을 조합하며, 로컬 스케일(num_replicas·배칭·동시성)과 그 주의점을 다룹니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="Ray Serve 모델 서빙 그림. 하단의 HTTP 클라이언트(요청)가 localhost:8000의 Ingress/Deployment로 들어간다. 그 Deployment가 학습된 모델을 가진 replica들(num_replicas)로 확장되고, 리퀘스트 배칭으로 GPU 벡터 연산을 묶는다. 여러 deployment가 deployment graph로 조합되는 모습을 보여준다." viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg">
  <title>Ray Serve — localhost:8000으로 HTTP 요청을 받아 replica들에 분산하고 배칭·그래프로 조합</title>

  <!-- http client -->
  <rect x="30" y="60" width="120" height="44" rx="4" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="90" y="80" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">HTTP 클라이언트</text>
  <text x="90" y="94" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.8">POST / :8000</text>
  <path d="M150 82 L200 82" fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#s6-arrow)"/>

  <!-- ingress -->
  <rect x="205" y="58" width="130" height="48" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2.2"/>
  <text x="270" y="78" text-anchor="middle" font-size="9" fill="currentColor" font-weight="700">Ingress</text>
  <text x="270" y="92" text-anchor="middle" font-size="7.5" fill="currentColor" opacity="0.8">@serve.ingress(FastAPI)</text>

  <!-- replicas -->
  <g font-size="8" font-weight="700">
    <rect x="380" y="30" width="240" height="30" rx="4" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.4"/><text x="500" y="49" text-anchor="middle" fill="currentColor">Replica 1 · 모델 (num_replicas)</text>
    <rect x="380" y="82" width="240" height="30" rx="4" fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.4"/><text x="500" y="101" text-anchor="middle" fill="currentColor">Replica 2 · 모델</text>
    <rect x="380" y="134" width="240" height="30" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.3"/><text x="500" y="153" text-anchor="middle" fill="currentColor">배칭 (batch) · GPU 묶음</text>
  </g>
  <path d="M335 82 L378 43 M335 82 L378 97 M335 82 L378 149" fill="none" stroke="currentColor" stroke-width="1.5" marker-end="url(#s6-arrow)"/>

  <rect x="140" y="214" width="400" height="34" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5"/>
  <text x="340" y="234" text-anchor="middle" font-size="9.5" fill="currentColor" font-weight="700">deployment graph · serve.run(app, route_prefix="/")</text>

  <defs>
    <marker id="s6-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
</svg>
<figcaption>Ray Serve — HTTP 요청이 `localhost:8000`의 **Ingress**(FastAPI)로 들어와 `num_replicas`만큼의 replica(각자 모델 로드)에 분산되고, 벡터 연산은 **리퀘스트 배칭**으로 묶습니다. 여러 deployment를 **deployment graph**로 조합해 하나의 서비스를 만듭니다.</figcaption>
</figure>

## 한눈에 보기

[Stage 5](/2026/08/24/stage5-ray-train-분산-학습.html)에서 학습한 모델을 **실제로 서비스**하는 단계입니다. Ray Serve는 모델을 HTTP 엔드포인트로 배포하는 도구로, **공식적으로 "local first"** — 배포 전에 로컬에서 전체 deployment graph를 테스트하라고 문서가 장려합니다. 한 대의 노트북에서 `serve.run()`이면 충분히 실제 서버가 뜹니다.

이번 포스트에서 다루는 핵심 질문은 세 가지입니다.

1. **`@serve.deployment`와 `serve.run`으로 모델을 어떻게 HTTP로 배포하나?**
2. **deployment graph와 FastAPI 인그레스로 여러 모델을 어떻게 조합하나?**
3. **로컬 스케일/동시성(복제·배칭)은 어떻게 제어하고, 주의점은?**

## Deployment 기본

`@serve.deployment`를 클래스에 붙이면 서빙 단위(배포)가 됩니다. `bind()`로 인자를 고정해 앱을 만들고, `serve.run`으로 띄웁니다. 기본 HTTP 포트는 **8000**입니다.

```bash
pip install -U "ray[serve]"
```

```python
import ray
from ray import serve

@serve.deployment
class EchoModel:
    def __init__(self, suffix: str):
        self.suffix = suffix
    def __call__(self, request):
        name = request.query_params["name"]
        return {"result": f"hello {name} {self.suffix}"}

app = EchoModel.bind(suffix="!!")
serve.run(app, route_prefix="/")       # http://localhost:8000/
```

HTTP로 호출합니다:

```bash
curl "http://localhost:8000/?name=ray"
# {"result": "hello ray !!"}
```

- **`@serve.deployment`** : 서빙할 클래스. `__call__`이 요청 핸들러.
- **`bind()`** : 생성자 인자를 고정해 앱 조립.
- **`serve.run(app, route_prefix=...)`** : 로컬에서 앱 시작. 데이터 복제/스케일이 가능.

### 실제 머신러닝 모델 배포

Hugging Face 파이프라인을 감싸는 전형적인 예시입니다.

```python
@serve.deployment
class Sentiment:
    def __init__(self):
        from transformers import pipeline
        self._pipe = pipeline("sentiment-analysis")

    def __call__(self, request):
        text = request.query_params["text"]
        return self._pipe(text)

serve.run(Sentiment.bind(), route_prefix="/sentiment")
```

## 구성과 인그레스 — deployment graph

### 여러 모델 조합 — DeploymentHandle

여러 deployment를 조합하고 싶으면 **`DeploymentHandle`** 로 다른 deployment를 함수처럼 호출합니다. 이를 **deployment graph**라고 합니다.

```python
@serve.deployment
class Upper:
    def __call__(self, text: str):
        return text.upper()

@serve.deployment
class Greeter:
    def __init__(self, upper):
        self._upper = upper
    def __call__(self, request):
        name = request.query_params["name"]
        return self._upper(name)          # DeploymentHandle 호출 (마치 함수)

app = Greeter.bind(Upper.bind())
serve.run(app, route_prefix="/")
```

- 그래프로 여러 모델/전처리를 **파이프라인**처럼 연결합니다.
- 각 deployment는 독립적으로 스케일(복제)할 수 있습니다.

### FastAPI 인그레스 — `@serve.ingress`

복잡한 REST API가 필요하면 FastAPI 앱을 배포로 감쌉니다.

```python
from fastapi import FastAPI
from ray import serve

app_fastapi = FastAPI()

@serve.deployment
@serve.ingress(app_fastapi)
class MyAPI:
    @app_fastapi.get("/ping")
    def ping(self):
        return {"msg": "pong"}

    @app_fastapi.post("/predict")
    async def predict(self, body: dict):
        return {"pred": body["x"] * 2}

serve.run(MyAPI.bind(), route_prefix="/")
```

- `@serve.ingress(app)` 로 FastAPI 라우트를 deployment에 노출.
- async 핸들러는 replica 내부에서 이벤트 루프로 처리됩니다.

## 로컬 스케일/동시성 — 복제·배칭·주의점

### `num_replicas` — 확장

```python
@serve.deployment(num_replicas=2)   # 프로세스 복제
class Sentiment:
    ...

# 또는 오토스케일
@serve.deployment(autoscaling_config={
    "min_replicas": 1, "max_replicas": 4,
    "target_num_ongoing_requests_per_replica": 2.0,
})
class Sentiment:
    ...
```

- **`num_replicas=k`** : 같은 모델을 k개 프로세스로 복제해 병렬 처리. 로컬에선 물리 코어 이내로.

### 리퀘스트 배칭 — 벡터 연산 묶기

GPU 추론은 개별 요청 처리보다 **배치**로 묶는 게 효율적입니다.

```python
import numpy as np

@serve.deployment
class BatchPredictor:
    def __init__(self):
        self._batch = []
    @serve.batch(max_batch_size=16, batch_wait_timeout_s=0.05)
    def predict_batch(self, batches):          # list[list] 묶음
        return [sum(b) for b in batches]
    async def __call__(self, request):
        x = request.query_params["x"]
        return await self.predict_batch([int(x)])

serve.run(BatchPredictor.bind(), route_prefix="/")
```

- **`@serve.batch`** : 다중 요청을 최대 `max_batch_size`개/`batch_wait_timeout_s`초 동안 모아 한 번에 처리.

### ⚠️ 로컬 주의점

- **동시성 기본값**: 서빙 deployment의 동시 요청 한도(`max_concurrent_queries`, 과거 `max_ongoing_requests`) 기본값은 **Ray 2.x 사이에서 변경**됐습니다. 설치 버전의 기본값을 확인하세요.
- **복제 수 vs 코어**: `num_replicas`를 코어보다 크게 하면 오버서브스크라이빙으로 오히려 느려집니다.
- **상태 보관 위치**: replica `__init__`에서 모델을 로드하면 replica별로 메모리가 중복됩니다. 상태를 공유해야 하면 액터(Stage 2) 패턴을 섞습니다.

## 로컬 활용 전략 — 실전 요약

1. **학습 → 서빙 전환**: [Stage 5](/2026/08/24/stage5-ray-train-분산-학습.html)의 체크포인트를 `RayTrainPredictor`(또는 직접 로드)로 `@serve.deployment`에 넣습니다.
2. **로컬에서 전체 그래프 테스트**: `serve.run(app)`으로 배포 전에 검증 → Serve의 공식 권장 워크플로.
3. **배칭으로 GPU 효율**: 벡터 연산 모델엔 `@serve.batch`.
4. **FastAPI 인그레스**: `/predict`, `/health` 등 REST 엔드포인트로 클라이언트와 계약.

## Summary

- **Ray Serve**는 `@serve.deployment` + `serve.run`으로 모델을 `localhost:8000` HTTP 서비스로 배포합니다 — **local first**.
- **deployment graph**(`DeploymentHandle`)와 **FastAPI 인그레스**(`@serve.ingress`)로 여러 모델을 조합합니다.
- 로컬 스케일/동시성은 **`num_replicas`**, **`@serve.batch` 배칭**, 동시 요청 한도로 제어하며, 기본값이 버전에 따라 바뀌는 점과 코어 한도를 주의합니다.

### 다음 학습 (Next Learning)

- **Stage 7 · 실전 통합** — Data→Train→Tune→Serve를 하나의 파이프라인으로 조립하고 concurrency를 종합합니다.
- [Stage 5 · Ray Train 분산 학습](/2026/08/24/stage5-ray-train-분산-학습.html) — 서빙할 모델을 분산 학습·체크포인트로 준비.
- [Stage 4 · Ray Tune 튜닝](/2026/08/24/stage4-ray-tune-튜닝.html) — 튜닝된 하이퍼파라미터를 서빙 deployment에 반영.
