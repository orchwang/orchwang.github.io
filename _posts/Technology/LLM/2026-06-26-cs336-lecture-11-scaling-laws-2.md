---
layout: post
title: "CS336 11강 — 스케일링 법칙 2: 실전 레시피와 muP"
date: 2026-06-26 00:11:00
categories: [Technology, LLM]
tags: [llm, scaling-laws, mup, hyperparameter-transfer, cs336, language-modeling]
series: CS336-LLM-From-Scratch
published: true
excerpt: "Stanford CS336 11강 정리. 실전 LLM 빌더가 스케일링 법칙을 쓰는 법 — Cerebras·MiniCPM·DeepSeek 사례, WSD 학습률로 Chinchilla를 한 번에, '20토큰/파라미터는 출발점일 뿐', 그리고 하이퍼파라미터를 스케일에 불변으로 만드는 muP의 유도와 한계."
---

`CS336-LLM-From-Scratch` 시리즈의 11단계입니다. 전체 지도는 [CS336 커리큘럼](/2026/06/26/cs336-llm-from-scratch-curriculum.html)에서 볼 수 있습니다. ([10강 — 추론](/2026/06/26/cs336-lecture-10-inference.html)으로 잠시 빠졌던 스케일링 주제를, [9강](/2026/06/26/cs336-lecture-9-scaling-laws-1.html)에 이어 마저 다룹니다.)

스케일링 법칙의 두 번째이자 마지막 강의(Tatsunori Hashimoto)는 **사례 연구 + muP 심화**입니다. 9강이 "스케일링 법칙이란 무엇인가"였다면, 11강은 마땅한 회의("결국 log-log에 직선 긋기 아냐?")에 답합니다 — **실제 LLM 빌더들이 스케일링 법칙을 어떻게 쓰는지**(Cerebras·MiniCPM·DeepSeek)를 보고, 그 핵심 도구인 **muP**(하이퍼파라미터를 스케일에 불변으로)를 끝까지 유도합니다.

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="표준 매개변수화와 muP의 학습률-손실 곡선 비교. 표준에서는 모델 폭이 커질수록 U자 곡선의 최저점이 왼쪽으로 이동하지만, muP에서는 여러 폭의 최저점이 같은 학습률에 정렬된다." viewBox="0 0 660 380" xmlns="http://www.w3.org/2000/svg">
  <title>muP의 하이퍼파라미터 전이: 표준은 최저점이 드리프트, muP는 정렬</title>

  <!-- ===== LEFT PANEL: standard parameterization (drifting minima) ===== -->
  <text x="170" y="30" text-anchor="middle" font-family="var(--font-body)" font-size="15" fill="var(--text-color)" font-weight="700">표준 매개변수화</text>
  <text x="170" y="50" text-anchor="middle" font-family="var(--font-body)" font-size="12" fill="var(--text-light)">폭이 커지면 최적 학습률이 드리프트</text>
  <!-- axes -->
  <g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="square">
    <path d="M 52 80 L 52 296 L 300 296" opacity="0.85"/>
  </g>
  <!-- U-curves, minima drifting LEFT as width grows -->
  <!-- small width: minimum at right -->
  <path d="M 78 110 Q 230 360 290 150" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.45"/>
  <!-- medium width: minimum center -->
  <path d="M 66 120 Q 160 360 270 130" fill="none" stroke="var(--secondary-color)" stroke-width="2.5" opacity="0.75"/>
  <!-- large width: minimum at left -->
  <path d="M 60 140 Q 110 360 235 120" fill="none" stroke="var(--accent-color)" stroke-width="3"/>
  <!-- minima markers (drift left as width grows) -->
  <g stroke="var(--bg-panel)" stroke-width="2">
    <circle cx="218" cy="252" r="5.5" fill="currentColor" opacity="0.55"/>
    <circle cx="173" cy="252" r="5.5" fill="var(--secondary-color)"/>
    <circle cx="132" cy="252" r="5.5" fill="var(--accent-color)"/>
  </g>
  <!-- drift arrow under the minima -->
  <g stroke="var(--text-light)" stroke-width="1.5" fill="none">
    <path d="M 216 274 L 134 274" stroke-dasharray="2 4"/>
    <path d="M 140 269 L 132 274 L 140 279"/>
  </g>
  <text x="175" y="292" text-anchor="middle" font-family="var(--font-body)" font-size="11" fill="var(--text-light)">최저점 이동</text>
  <!-- axis labels -->
  <text x="176" y="326" text-anchor="middle" font-family="var(--font-body)" font-size="12" fill="var(--text-light)">학습률 (log)</text>
  <text x="32" y="188" text-anchor="middle" font-family="var(--font-body)" font-size="12" fill="var(--text-light)" transform="rotate(-90 32 188)">손실</text>

  <!-- ===== RIGHT PANEL: muP (aligned minima) ===== -->
  <text x="490" y="30" text-anchor="middle" font-family="var(--font-body)" font-size="15" fill="var(--text-color)" font-weight="700">muP</text>
  <text x="490" y="50" text-anchor="middle" font-family="var(--font-body)" font-size="12" fill="var(--text-light)">모든 폭의 최적 학습률이 정렬</text>
  <!-- axes -->
  <g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="square">
    <path d="M 372 80 L 372 296 L 620 296" opacity="0.85"/>
  </g>
  <!-- aligned vertical guide at the common optimum -->
  <line x1="490" y1="92" x2="490" y2="296" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="3 5" opacity="0.8"/>
  <!-- U-curves, all minima at the SAME learning rate -->
  <path d="M 398 110 Q 490 350 582 110" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.45"/>
  <path d="M 396 124 Q 490 360 584 124" fill="none" stroke="var(--secondary-color)" stroke-width="2.5" opacity="0.75"/>
  <path d="M 394 138 Q 490 372 586 138" fill="none" stroke="var(--accent-color)" stroke-width="3"/>
  <!-- minima markers (all aligned on the gold guide) -->
  <g stroke="var(--bg-panel)" stroke-width="2">
    <circle cx="490" cy="231" r="5.5" fill="currentColor" opacity="0.55"/>
    <circle cx="490" cy="245" r="5.5" fill="var(--secondary-color)"/>
    <circle cx="490" cy="258" r="5.5" fill="var(--accent-color)"/>
  </g>
  <text x="490" y="292" text-anchor="middle" font-family="var(--font-body)" font-size="11" fill="var(--gold)" font-weight="700">한 번 튜닝 → 전이</text>
  <!-- axis labels -->
  <text x="496" y="326" text-anchor="middle" font-family="var(--font-body)" font-size="12" fill="var(--text-light)">학습률 (log)</text>

  <!-- ===== shared legend (model widths) ===== -->
  <g font-family="var(--font-body)" font-size="12" fill="var(--text-light)">
    <line x1="210" y1="352" x2="240" y2="352" stroke="currentColor" stroke-width="2.5" opacity="0.45"/>
    <text x="246" y="356">작은 폭</text>
    <line x1="320" y1="352" x2="350" y2="352" stroke="var(--secondary-color)" stroke-width="2.5"/>
    <text x="356" y="356">중간 폭</text>
    <line x1="430" y1="352" x2="460" y2="352" stroke="var(--accent-color)" stroke-width="3"/>
    <text x="466" y="356">큰 폭</text>
  </g>
</svg>
<figcaption>학습률(가로, log) 대 손실(세로)의 U자 곡선을 모델 폭별로 그린 것. 표준 매개변수화에서는 폭이 커질수록 최저점(최적 학습률)이 왼쪽으로 밀려, 큰 모델에서 학습률을 다시 튜닝해야 한다. muP는 이 최저점들을 같은 학습률에 정렬시킨다 — 작은 폭에서 한 번 튜닝하면 큰 모델로 그대로 전이된다.</figcaption>
</figure>

## 한눈에 보기

큰 학습은 모두 같은 모양의 레시피를 따릅니다 — **작은 대리(proxy) 모델로 하이퍼파라미터를 정하고, 그것이 스케일에 걸쳐 안정되게 만든 뒤, 본 게임으로 키웁니다.** muP와 WSD는 이 "안정되게"를 담당하는 두 도구입니다.

```mermaid
flowchart LR
    Proxy["작은 대리 모델<br/>(40M~수억)"] --> Tune["하이퍼파라미터 정하기<br/>· 학습률·배치(스케일링 법칙으로 fit)<br/>· 토큰/모델 비율(IsoFLOP)"]
    Tune --> Stable["스케일에 불변으로<br/>· muP(학습률 전이)<br/>· WSD(한 번에 Chinchilla)"]
    Stable --> Big["본 게임<br/>(예측대로 적중)"]
```

두 가지 큰 교훈 — **(1) Chinchilla의 '20토큰/파라미터'는 출발점일 뿐**(방법은 잘 재현되지만 비율은 점점 커진다), **(2) muP로 학습률을 작은 스케일에서 한 번만 튜닝**하면 큰 모델로 전이된다.

## 실전 스케일링 레시피: 세 가지 사례

Chinchilla 이후 프런티어 랩은 입을 닫았습니다("스케일링은 알려줄 수 없다"). 그래서 가장 충실한 공개 연구는 **Cerebras-GPT·MiniCPM·DeepSeek**입니다. 셋의 전략이 미묘하게 다릅니다.

| 모델 | 핵심 전략 | 배운 것 |
| --- | --- | --- |
| **Cerebras-GPT** | **muP** + 공격적 축소(40M proxy서 HP 탐색 → muP로 확대) | muP의 첫 공개 검증 — 더 안정적 스케일링 |
| **MiniCPM** | muP + **WSD** 학습률 | WSD로 Chinchilla를 ~1회 학습에. 192토큰/파라미터(이상치) |
| **DeepSeek LLM** | muP 없이 **학습률·배치를 직접 스케일링 법칙으로 fit** | IsoFLOP로 토큰/모델 비율, 10²⁰→10²⁴ 외삽 적중 |

공통 패턴: **작은 대리 모델에서 튜닝 → 스케일에 안정되게 → 키운다.** 그리고 모두가 **IsoFLOP(Chinchilla) 분석**을 재현합니다 — 흥미롭게도 하이퍼파라미터 fit은 늘 노이지하지만, **IsoFLOP 분석은 항상 깨끗하게** 나옵니다.

## WSD 학습률: Chinchilla를 한 번에

데이터 스케일링(Chinchilla)을 제대로 하려면 골치 아픈 문제가 있습니다 — **코사인 학습률은 중간에 끊을 수 없습니다.** 데이터양 목표가 다르면 코사인 곡선이 통째로 달라지므로, 데이터 크기별로 **처음부터 끝까지** 따로 학습해야 합니다(사실상 n² 회). MiniCPM이 대중화한 **WSD(Warmup-Stable-Decay)**가 이를 해결합니다.

> **WSD = 사다리꼴**: 워밍업(짧게) → **안정(stable, 평평)** → 급속 감쇠(decay)

핵심은 **안정 구간을 재사용**할 수 있다는 점입니다 — 끝까지 안정하게 학습한 뒤, **체크포인트를 되감아** 여러 지점에서 각각 짧게 cool-down하면, "데이터가 더 적었다면?"을 **한 번의 학습 비용**으로 얻습니다. (cool-down이 손실 하락의 대부분을 만든다는 것도 흥미로운 발견 — 그래서 cool-down은 필수입니다.) WSD 학습 곡선은 안정 구간에선 완만하다가 감쇠 구간에서 **뚝 떨어지는** 독특한 모양이라 처음엔 불안해 보이지만, 정상입니다.

<figure class="post-figure">
<svg role="img" aria-label="코사인 학습률과 WSD 학습률 일정 비교. 코사인은 워밍업 후 끝까지 매끄럽게 0으로 감쇠해 중간에서 끊을 수 없다. WSD는 워밍업·평평한 안정 구간·급속 감쇠의 사다리꼴이며, 안정 구간의 체크포인트를 되감아 여러 지점에서 cool-down하면 한 번의 학습으로 여러 데이터 크기의 끝점을 얻는다." viewBox="0 0 660 360" xmlns="http://www.w3.org/2000/svg">
  <title>WSD 대 코사인 학습률 일정: 안정 구간 재사용</title>

  <!-- axes -->
  <g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="square">
    <path d="M 70 44 L 70 280 L 612 280" opacity="0.85"/>
  </g>
  <!-- axis labels -->
  <text x="341" y="312" text-anchor="middle" font-family="var(--font-body)" font-size="14" fill="var(--text-light)">학습 스텝 (training step)</text>
  <text x="30" y="162" text-anchor="middle" font-family="var(--font-body)" font-size="14" fill="var(--text-light)" transform="rotate(-90 30 162)">학습률 (learning rate)</text>

  <!-- ===== cosine schedule: warmup then smooth decay to zero ===== -->
  <!-- warmup ramp -->
  <path d="M 70 280 L 110 80" fill="none" stroke="var(--secondary-color)" stroke-width="2.5" stroke-dasharray="2 6" opacity="0.85"/>
  <!-- smooth cosine decay all the way to zero at the end -->
  <path d="M 110 80 Q 360 96 612 280" fill="none" stroke="var(--secondary-color)" stroke-width="2.5" stroke-dasharray="2 6" opacity="0.85"/>
  <text x="300" y="74" text-anchor="middle" font-family="var(--font-body)" font-size="13" fill="var(--secondary-color)" font-weight="700">코사인 — 끝까지 매끄럽게 감쇠 (못 끊음)</text>

  <!-- ===== WSD trapezoid: warmup → flat stable → rapid decay ===== -->
  <!-- warmup -->
  <path d="M 70 280 L 110 80" fill="none" stroke="var(--accent-color)" stroke-width="3.5"/>
  <!-- flat stable plateau (reusable) -->
  <path d="M 110 80 L 470 80" fill="none" stroke="var(--accent-color)" stroke-width="3.5"/>
  <!-- rapid decay to zero -->
  <path d="M 470 80 L 540 280" fill="none" stroke="var(--accent-color)" stroke-width="3.5"/>
  <text x="290" y="64" text-anchor="middle" font-family="var(--font-body)" font-size="13" fill="var(--accent-color)" font-weight="700">WSD 사다리꼴</text>
  <!-- phase labels under the trapezoid -->
  <g font-family="var(--font-body)" font-size="11" fill="var(--text-light)">
    <text x="92" y="300" text-anchor="middle">워밍업</text>
    <text x="290" y="100" text-anchor="middle">안정 (stable) — 재사용 가능</text>
    <text x="520" y="300" text-anchor="middle">감쇠</text>
  </g>

  <!-- rewind/cool-down branches from the stable plateau at earlier points -->
  <g stroke="var(--gold)" stroke-width="2" fill="none" opacity="0.9">
    <path d="M 250 80 L 310 280"/>
    <path d="M 360 80 L 420 280"/>
  </g>
  <!-- cool-down endpoints on the step axis -->
  <g fill="var(--gold)" stroke="var(--bg-panel)" stroke-width="1.5">
    <circle cx="310" cy="280" r="5"/>
    <circle cx="420" cy="280" r="5"/>
    <circle cx="540" cy="280" r="5"/>
  </g>
  <text x="430" y="150" text-anchor="middle" font-family="var(--font-body)" font-size="12" fill="var(--gold)" font-weight="700">되감아 cool-down</text>
  <text x="430" y="168" text-anchor="middle" font-family="var(--font-body)" font-size="11" fill="var(--text-light)">→ 여러 데이터 크기 끝점</text>
</svg>
<figcaption>가로축은 학습 스텝, 세로축은 학습률. 코사인(점선)은 워밍업 후 끝까지 매끄럽게 0으로 내려가므로 데이터양을 바꾸려면 처음부터 다시 학습해야 한다. WSD(굵은 선)는 평평한 안정 구간을 두어, 그 체크포인트를 되감아 여러 지점에서 짧게 cool-down하면(금색 분기) 한 번의 학습으로 여러 데이터 크기의 끝점을 얻는다.</figcaption>
</figure>

## "20토큰/파라미터"는 출발점일 뿐

여러 사례가 Chinchilla 분석을 **다시** 합니다. 그런데 비율은 제각각입니다 — MiniCPM 192:1(이상치), Llama 3 ≈40:1, Hunyuan ≈96:1. Chinchilla의 **20:1은 잘 재현되지 않습니다.** 데이터 품질·아키텍처 효율이 좋아지며 비율이 점점 커지는 듯합니다. 그리고 이렇게 과훈련해도 손실이 크게 나빠지지 않습니다(수확 체감이 약함).

> **핵심 교훈**: 잘 재현되는 건 **IsoFLOP 방법**(컴퓨트 → 최적 모델·토큰 수의 깨끗한 멱법칙)이지 **20이라는 숫자**가 아닙니다. 20은 시작점이고, 추론 비용을 생각하면 훨씬 더 과훈련하는 게 합리적입니다(10강과 연결).

## muP: 스케일에 불변인 하이퍼파라미터

모델을 키우면(특히 **폭, width**) 최적 학습률이 작아집니다 — 큰 스케일에서 학습률을 다시 튜닝해야 한다는 건 끔찍하게 비쌉니다. **muP(maximal update parameterization)**의 목표는 **재매개변수화로 최적 학습률을 스케일에 불변**으로 만들어, 작은 모델에서 한 번 튜닝하면 큰 모델로 그대로 전이되게 하는 것입니다.

muP는 두 가지 자연스러운 조건에서 유도됩니다(폭 `n`을 키울 때).

- **(A1)** 초기화 시 활성화가 좌표당 **Θ(1)** — 폭을 키워도 안 터지고 안 사라짐(벡터 노름은 `√n`).
- **(A2)** 한 번의 그래디언트 스텝 뒤 **활성화 변화량도 Θ(1)** — 업데이트가 폭에 따라 터지거나 사라지지 않음.

여기서 두 규칙이 떨어집니다. **(A1) → 초기화**: 가우시안 표준편차 = `1/√(fan_in)`(랜덤 행렬의 작용소 노름이 집중한다는 사실로 귀납 증명). **(A2) → 학습률**: SGD면 `fan_out/fan_in`, **Adam이면 `1/fan_in`** — 이것이 표준 매개변수화(전역 상수 학습률)와의 결정적 차이입니다.

```python
# muP: 폭(width)이 커져도 최적 하이퍼파라미터가 그대로이게 재매개변수화
# 두 조건 — (A1) 초기 활성화 Θ(1), (A2) 1스텝 뒤 활성화 변화도 Θ(1)
init_std = 1 / sqrt(fan_in)          # A1 → 가우시안 초기화 표준편차
lr_adam  = base_lr / fan_in          # A2(Adam) → 층별 학습률 ∝ 1/fan_in
# (SGD라면 lr = base_lr * fan_out / fan_in. 임베딩은 one-hot이라 예외)
# 효과: 작은 모델에서 base_lr 한 번 튜닝 → 큰 모델로 그대로 전이
```

실무적 차이의 핵심은 **층별 학습률(per-layer learning rate)**입니다 — 초기화는 이미 Kaiming 스타일(`1/√fan_in`)을 쓰면 맞지만, 학습률을 전역 상수로 두던 관행이 muP에선 `1/fan_in`으로 바뀝니다. (muP 논문들은 어텐션 스케일도 `1/√d` 대신 `1/d`를 씁니다.)

> 이건 물리학의 **재규격화(renormalization)** 아이디어와 같습니다 — 폭을 무한대로 보내는 극한에서 활성화·업데이트가 안정되도록 매개변수를 맞추는 것.

## muP는 언제 통하고 언제 깨지나

대규모 ablation(독립 연구)의 결론: **학습률이 폭에 걸쳐 안정적으로 전이됩니다.** 작은 스케일에서 고른 base learning rate가 10B 모델까지 최적으로 유지됩니다.

- **잘 견딤(robust)**: 비선형(SwiGLU·squared ReLU), 배치 크기, 초기화 변형, RMSNorm.
- **깨짐(breaks)**: **학습 가능한 gain/bias**를 더하면(→ bias 제거 필요), **이색적 옵티마이저**(Lion — muP는 Adam에 맞춰 유도됐으니 당연), **강한 weight decay**.

Meta가 Llama 4에 (변형 "metaP"로) 썼지만, 아직 **업계 합의는 아닙니다.** muP가 *필수*는 아니고 — 학습률을 잘 맞히면 muP 없이도 좋은 모델이 나옵니다(DeepSeek처럼) — 다만 그 **재튜닝을 없애 주는** 도구입니다.

## 성능·복잡도 노트

- **레시피는 하나**: 작은 대리 모델로 튜닝 → 스케일 불변화(muP/WSD) → 키운다. 사례마다 디테일만 다릅니다.
- **IsoFLOP은 재현되고, 비율은 안 된다**: 컴퓨트→최적 배분의 멱법칙은 깨끗하지만 "20:1"은 점점 커집니다(40·96·192). 20은 출발점.
- **WSD = 한 번에 Chinchilla**: 안정 구간 재사용으로 데이터 스케일링을 1회 비용에. 코사인은 못 끊습니다.
- **muP = 두 조건의 산물**: 활성화·업데이트를 Θ(1)로 유지 → 초기화 `1/√fan_in`, Adam 학습률 `1/fan_in`. 학습률을 작은 스케일에서 한 번만.
- **하이퍼파라미터 fit은 노이지, IsoFLOP은 깨끗**: 모든 사례에서 반복되는 관찰. 학습률·배치를 직접 fit한 DeepSeek의 선조차 살짝 의심스럽습니다.

## 요약

- **실전 스케일링 레시피**: 작은 대리 모델 → 하이퍼파라미터 fit/IsoFLOP → muP·WSD로 안정화 → 본 게임. Cerebras(muP)·MiniCPM(muP+WSD)·DeepSeek(직접 fit).
- **WSD**(워밍업-안정-감쇠): 안정 구간을 재사용해 Chinchilla 데이터 스케일링을 ~1회 학습에. 코사인은 못 끊는다.
- **20토큰/파라미터는 출발점**: IsoFLOP *방법*은 재현되나 *비율*은 커진다(40·96·192).
- **muP**: (A1) 초기 활성화 Θ(1) → 초기화 `1/√fan_in`, (A2) 업데이트 Θ(1) → Adam 학습률 `1/fan_in`. 작은 스케일에서 학습률 한 번 튜닝 → 전이.
- **muP의 한계**: gain/bias·Lion·강한 weight decay에선 깨짐. 필수는 아니고 재튜닝을 줄이는 도구(Llama 4 채택, 합의는 아님).

이로써 **유닛 3(스케일링 & 추론)을 마칩니다.** 다음 유닛은 "무엇을 먹이고 어떻게 측정하나" — 데이터와 평가입니다.

### 다음 학습 (Next Learning)

- [CS336 12강 — 평가(Evaluation): 하나의 참된 평가는 없다](/2026/06/26/cs336-lecture-12-evaluation.html) — perplexity·벤치마크·LM-as-judge와 오염·재현성의 함정
- [CS336 9강 — 스케일링 법칙 1](/2026/06/26/cs336-lecture-9-scaling-laws-1.html) — 멱법칙·Chinchilla의 기초
- [CS336 커리큘럼](/2026/06/26/cs336-llm-from-scratch-curriculum.html) — 전체 17단계 지도와 진행 현황
