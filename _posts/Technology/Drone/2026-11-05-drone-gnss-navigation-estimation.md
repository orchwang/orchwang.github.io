---
layout: post
title: "GNSS · 항법 · 상태 추정: 지금 어디에, 어떤 자세로 있는가"
date: 2026-11-05 00:04:00
categories: [Technology, Drone]
tags: [drone, flight-control, gnss, kalman-filter, ekf, mavlink]
series: Drone-Control-Essential
published: true
excerpt: "통제 앱 지도 위의 드론 아이콘은 FC가 추정한 상태를 그린 것입니다. GPS가 의사거리와 네 번째 위성으로 위치와 시계 오차를 함께 푸는 원리, DOP·다중경로·전리층 오차와 RTK, WGS84 위경도·타원체고·해발고도를 로컬 NED로 바꾸는 변환, 그리고 상보 필터에서 칼만 필터·EKF로 이어지는 센서 융합과 GPS 글리치 거부를 코드로 확인합니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="위쪽 하늘에 GNSS 위성 네 개가 떠 있고, 각 위성에서 점선 신호가 아래의 드론으로 내려온다. 왼쪽에는 의사거리 곱하기 4, 오른쪽에는 약 2만 km 궤도라고 적혀 있다. 아래쪽은 센서 융합 깔때기다. IMU는 예측, GNSS는 위치, 기압계는 고도, 자력계는 방위를 맡아 깔때기로 모여 EKF 상태 추정기 상자로 들어가고, EKF는 추정 상태를 내보내 지도 위 아이콘이 된다. 추정 상태는 위치, 속도, 자세와 불확실성 P다." viewBox="0 0 320 428" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>위성 신호에서 지도 위 아이콘까지 — GNSS와 센서 융합</title>
  <defs>
    <marker id="gns-hdr-arrow-sec" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--secondary-color)"/>
    </marker>
    <marker id="gns-hdr-arrow-mut" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--text-light)"/>
    </marker>
    <marker id="gns-hdr-arrow-acc" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-color)"/>
    </marker>
    <g id="gns-hdr-sat">
      <rect x="-11" y="-3" width="7" height="6" fill="var(--gold-soft)" stroke="var(--secondary-color)" stroke-width="1.2"/>
      <rect x="4" y="-3" width="7" height="6" fill="var(--gold-soft)" stroke="var(--secondary-color)" stroke-width="1.2"/>
      <rect x="-4" y="-5" width="8" height="10" rx="1" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
    </g>
  </defs>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">위성 신호에서 지도 위 아이콘까지</text>
  <!-- sky: satellites broadcasting to the drone -->
  <g stroke="var(--secondary-color)" stroke-width="1.4" stroke-dasharray="4 4" fill="none">
    <line x1="40" y1="62" x2="156" y2="127" marker-end="url(#gns-hdr-arrow-sec)"/>
    <line x1="120" y1="50" x2="158" y2="126" marker-end="url(#gns-hdr-arrow-sec)"/>
    <line x1="200" y1="50" x2="162" y2="126" marker-end="url(#gns-hdr-arrow-sec)"/>
    <line x1="280" y1="62" x2="164" y2="127" marker-end="url(#gns-hdr-arrow-sec)"/>
  </g>
  <use href="#gns-hdr-sat" x="40" y="56"/>
  <use href="#gns-hdr-sat" x="120" y="44"/>
  <use href="#gns-hdr-sat" x="200" y="44"/>
  <use href="#gns-hdr-sat" x="280" y="56"/>
  <text x="12" y="112" font-size="12" font-weight="700" fill="var(--secondary-color)">의사거리 × 4</text>
  <text x="308" y="112" text-anchor="end" font-size="12" fill="var(--text-light)">약 2만 km 궤도</text>
  <!-- drone -->
  <line x1="128" y1="138" x2="192" y2="138" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  <g fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="1.5">
    <ellipse cx="128" cy="131" rx="14" ry="3"/>
    <ellipse cx="192" cy="131" rx="14" ry="3"/>
  </g>
  <g stroke="currentColor" stroke-width="1.5">
    <line x1="128" y1="134" x2="128" y2="138"/>
    <line x1="192" y1="134" x2="192" y2="138"/>
  </g>
  <rect x="148" y="132" width="24" height="12" rx="2" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <text x="160" y="160" text-anchor="middle" font-size="12" fill="var(--text-light)">드론의 GNSS 수신기</text>
  <line x1="16" y1="172" x2="304" y2="172" stroke="var(--text-light)" stroke-width="1.5"/>
  <!-- fusion funnel -->
  <text x="12" y="194" font-size="13" font-weight="700" fill="var(--accent-color)">센서 융합 — 서로 다르게 틀리는 센서를 하나로</text>
  <g fill="var(--bg-light)" stroke-width="1.5">
    <rect x="8" y="204" width="66" height="26" rx="4" stroke="var(--accent-color)"/>
    <rect x="86" y="204" width="66" height="26" rx="4" stroke="var(--secondary-color)"/>
    <rect x="164" y="204" width="66" height="26" rx="4" stroke="var(--secondary-color)"/>
    <rect x="242" y="204" width="66" height="26" rx="4" stroke="var(--secondary-color)"/>
  </g>
  <g font-size="12" font-weight="700" fill="currentColor" text-anchor="middle">
    <text x="41" y="222">IMU</text>
    <text x="119" y="222">GNSS</text>
    <text x="197" y="222">기압계</text>
    <text x="275" y="222">자력계</text>
  </g>
  <g font-size="12" fill="var(--text-light)" text-anchor="middle">
    <text x="41" y="246">예측</text>
    <text x="119" y="246">위치</text>
    <text x="197" y="246">고도</text>
    <text x="275" y="246">방위</text>
  </g>
  <path d="M8,254 L312,254 L210,300 L110,300 Z" fill="var(--gold-soft)" stroke="var(--text-light)" stroke-width="1" stroke-dasharray="3 3"/>
  <g stroke="var(--text-light)" stroke-width="1.5" fill="none">
    <line x1="41" y1="256" x2="140" y2="298" marker-end="url(#gns-hdr-arrow-mut)"/>
    <line x1="119" y1="256" x2="152" y2="298" marker-end="url(#gns-hdr-arrow-mut)"/>
    <line x1="197" y1="256" x2="168" y2="298" marker-end="url(#gns-hdr-arrow-mut)"/>
    <line x1="275" y1="256" x2="180" y2="298" marker-end="url(#gns-hdr-arrow-mut)"/>
  </g>
  <rect x="105" y="302" width="110" height="42" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="160" y="321" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">EKF</text>
  <text x="160" y="337" text-anchor="middle" font-size="12" fill="var(--text-light)">상태 추정기</text>
  <line x1="160" y1="345" x2="160" y2="360" stroke="var(--accent-color)" stroke-width="1.5" marker-end="url(#gns-hdr-arrow-acc)"/>
  <rect x="40" y="362" width="240" height="32" rx="4" fill="var(--gold-soft)" stroke="currentColor" stroke-width="1.5"/>
  <text x="160" y="383" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">추정 상태 → 지도 위 아이콘</text>
  <text x="160" y="416" text-anchor="middle" font-size="12" fill="var(--text-light)">위치 · 속도 · 자세 + 불확실성 P</text>
</svg>
<figcaption>지도 위 드론 아이콘은 측정값이 아니라 추정값이다 — 위성 의사거리로 구한 GNSS 위치를 IMU · 기압계 · 자력계와 함께 EKF가 하나의 상태로 묶는다</figcaption>
</figure>

## 들어가며

이 글은 `Drone-Control-Essential` 시리즈의 **4단계**입니다. 전체 흐름은 [Drone Control Essential Curriculum](/2026/11/05/drone-control-essential-curriculum.html)에서 확인하고, 직전 단계 [기체 · 센서 · 액추에이터](/2026/11/05/drone-airframe-sensors-actuators.html)를 먼저 읽으면 좋습니다.

통제 앱의 지도에는 드론 아이콘이 있고, 그 옆에는 고도와 속도가 표시됩니다. 이 숫자들은 **측정값이 아니라 추정값**입니다. 3단계에서 본 것처럼 센서들은 서로 다르게 틀립니다. 자이로는 드리프트하고, 가속도계는 진동에 흔들리고, 기압계는 날씨에 따라 밀리며, GPS는 몇 미터씩 튀고 1초에 몇 번밖에 값을 주지 않습니다. FC의 **상태 추정기(EKF)** 는 이 모든 것을 섞어 "지금 기체는 여기에, 이 속도로, 이 자세로 있을 가능성이 가장 높다"는 하나의 답을 냅니다.

이 단계는 세 질문을 다룹니다. GPS는 어떻게 위치를 알아내고 왜 틀리는가? 위경도라는 숫자를 지도와 제어가 쓰는 로컬 좌표로 어떻게 바꾸는가? 그리고 서로 다르게 틀리는 센서들을 어떻게 하나로 묶는가? 세 질문 모두 직접 실행해 볼 수 있는 코드로 확인합니다.

<div class="post-summary-box" markdown="1">

### 📌 이 글에서 다루는 내용

#### 🔍 핵심 주제

- **GNSS 원리와 오차**: 의사거리와 삼변측량, 시계 오차와 4번째 위성, GPS·GLONASS·Galileo·BeiDou, DOP·다중경로·전리층 오차, RTK/DGPS 개요
- **측지 좌표 변환**: WGS84 위경도·타원체고 vs 해발고도, ECEF, 로컬 NED 변환 — 지도 표시·웨이포인트 계산의 기초
- **센서 융합과 EKF**: 상보 필터에서 칼만 필터로, 예측·갱신 구조, PX4 EKF2 / ArduPilot EKF3, 추정 품질 지표와 GPS 글리치 대응

</div>

## 1. GNSS — 위성 신호로 위치를 정하는 법

### 1.1 거리를 시간으로 잰다

**GNSS(Global Navigation Satellite System)** 는 위성 항법 시스템의 총칭이고, GPS는 그중 미국이 운영하는 시스템의 이름입니다. 지금은 여러 시스템이 함께 운영됩니다.

| 시스템 | 운영 | 비고 |
| --- | --- | --- |
| **GPS** | 미국 | 가장 오래되고 널리 쓰임 |
| **GLONASS** | 러시아 | |
| **Galileo** | 유럽 연합 | 민간용 다중 주파수 신호 |
| **BeiDou** | 중국 | 아시아·태평양 지역에서 가시 위성이 많음 |
| QZSS·NavIC 등 | 일본·인도 | 지역 위성항법 시스템(RNSS). QZSS는 GPS 보완·보강 서비스도 제공 |

원리는 같습니다. 각 위성은 고도 약 2만 km의 궤도를 돌며 **"나는 지금 이 위치에 있고, 지금 시각은 이렇다"** 는 신호를 계속 방송합니다. 수신기는 신호가 도착한 시각과 방송된 시각의 차이에 빛의 속도를 곱해 위성까지의 거리를 구합니다. 위성 세 개까지의 거리를 알면 세 구의 교점으로 위치가 정해집니다(삼변측량 — 교점은 보통 두 개이고, 지구에서 먼 쪽을 버립니다).

### 1.2 네 번째 위성이 필요한 이유

문제는 수신기의 시계입니다. 위성에는 원자시계가 있지만, 드론에 달린 수신기의 시계는 값싼 수정 발진기입니다. 빛은 1µs에 약 300m를 가므로, 수신기 시계가 **1ms만 어긋나도 모든 거리가 약 300km씩 틀어집니다.** 그래서 수신기가 잰 값은 진짜 거리가 아니라 시계 오차가 섞인 **의사거리(pseudorange)** 라고 부릅니다.

해결책은 시계 오차 자체를 **미지수로 추가**하는 것입니다. 미지수가 위치(x, y, z) + 시계 오차(dt)로 4개이니 위성이 최소 4개 필요합니다. 그 이상이면 최소제곱으로 더 정확하게 풉니다. 아래 코드는 서울 부근의 수신기와 가상의 위성들로 이 계산을 재현합니다.

```python
import numpy as np

C = 299_792_458.0                                           # 빛의 속도 (m/s)
rng = np.random.default_rng(0)

truth = np.array([-3_052_000.0, 4_043_000.0, 3_865_000.0])  # 서울 부근 지표면 (ECEF, m)
clock_bias_s = 1e-3                                         # 수신기 시계가 1 ms 어긋남 → 약 300 km

def make_sky(n, min_cos):
    """수신기 하늘 위의 위성 n개. min_cos가 클수록 천정 근처에 몰린 '나쁜 배치'."""
    up = truth / np.linalg.norm(truth)
    sats = []
    while len(sats) < n:
        d = rng.normal(size=3)
        p = truth + d / np.linalg.norm(d) * 20_200_000.0    # 수신기로부터 약 20,200 km (궤도 고도를 단순화)
        if np.dot((p - truth) / np.linalg.norm(p - truth), up) > min_cos:
            sats.append(p)
    return np.array(sats)

def solve(sats):
    """가우스-뉴턴으로 [x, y, z, c·dt]를 추정하고 위치 오차·PDOP를 돌려준다."""
    rho_true = np.linalg.norm(sats - truth, axis=1)
    pseudo = rho_true + C * clock_bias_s + rng.normal(0, 3.0, len(sats))  # 잡음 σ = 3 m
    x = np.zeros(4)                                         # 지구 중심에서 출발
    for _ in range(10):
        vec = x[:3] - sats
        rho = np.linalg.norm(vec, axis=1)
        H = np.hstack([vec / rho[:, None], np.ones((len(sats), 1))])
        x += np.linalg.lstsq(H, pseudo - (rho + x[3]), rcond=None)[0]
    pdop = np.sqrt(np.trace(np.linalg.inv(H.T @ H)[:3, :3]))
    return np.linalg.norm(x[:3] - truth), x[3] / C, pdop

for name, min_cos in [("하늘 전체에 퍼진 배치", 0.3), ("천정 근처에 몰린 배치", 0.9)]:
    errs, dts, pdops = [], [], []
    for _ in range(200):
        err, dt, pdop = solve(make_sky(8, min_cos))
        errs.append(err); dts.append(dt); pdops.append(pdop)
    print(f"{name}: PDOP 중앙값 {np.median(pdops):.1f}, 위치 오차 중앙값 {np.median(errs):.1f} m, 시계 오차 추정 중앙값 {np.median(dts) * 1e3:.4f} ms")
# 하늘 전체에 퍼진 배치: PDOP 중앙값 2.6, 위치 오차 중앙값 6.5 m, 시계 오차 추정 중앙값 1.0000 ms
# 천정 근처에 몰린 배치: PDOP 중앙값 16.1, 위치 오차 중앙값 37.9 m, 시계 오차 추정 중앙값 1.0000 ms
```

두 가지가 보입니다. 첫째, 1ms(약 300km)라는 거대한 시계 오차가 네 번째 미지수로 깔끔하게 풀립니다. 둘째, **같은 측정 잡음(3m)이라도 위성 배치에 따라 위치 오차가 6배 가까이 달라집니다.** 이것이 다음 절의 DOP입니다. 천정에 몰린 배치에서 커진 오차는 대부분 **수직 방향**입니다.

### 1.3 오차의 원천과 DOP

| 오차 원천 | 무엇인가 | 대응 |
| --- | --- | --- |
| **전리층 지연** | 상층 대기의 전자가 신호를 늦춤. 단일 주파수 수신기의 가장 큰 오차 원인 중 하나 | 방송 모델로 일부 보정, **다중 주파수**(L1+L5 등) 수신기는 직접 측정해 제거 |
| **대류층 지연** | 하층 대기의 수증기·기압 | 모델 보정 |
| **위성 궤도·시계 오차** | 방송된 위치·시각의 작은 오차 | 보강 시스템, 정밀 보정 정보 |
| **다중경로(multipath)** | 건물·지면에 반사된 신호가 섞임 | 안테나 위치, 접지판, 수신기 알고리즘. 도심·교량 아래에서 심함 |
| **차폐** | 건물·나무가 하늘을 가려 위성 수 감소 | 피할 수 없음 → 다른 센서에 의존 |
| **위성 배치 (DOP)** | 위성들이 한쪽에 몰리면 같은 거리 오차가 위치 오차로 크게 증폭 | 여러 GNSS 동시 사용으로 위성 수 확보 |

**DOP(Dilution of Precision)** 는 "거리 측정 오차가 위치 오차로 몇 배 증폭되는가"를 나타내는 기하학적 배수입니다. 위성이 하늘 전체에 고르게 퍼져 있으면 작고(좋음), 한쪽에 몰려 있으면 큽니다(나쁨). 수평 성분만 본 것이 HDOP, 수직이 VDOP, 3차원이 PDOP입니다. 위 코드에서 위성을 천정 근처에 몰았더니 PDOP가 2.6에서 16.1로 커지며 오차도 따라 커졌습니다. 일반적으로 **수직 오차가 수평 오차보다 큽니다.** 위성은 언제나 수신기의 위쪽 하늘에만 있어서 수직 방향의 기하가 나쁘기 때문입니다.

<figure class="post-figure">
<svg role="img" aria-label="위성 배치에 따른 DOP 비교 모식도. 맨 위 상자에는 미지수 4개, 즉 x, y, z와 시계 오차가 있으므로 위성이 4개 이상 필요하다고 적혀 있다. 첫 번째 패널은 하늘 전체에 퍼진 배치로, 위성 다섯 개가 지평선 근처부터 천정까지 반원 위에 고르게 흩어져 있고 수신기 주변의 불확실성 영역은 작고 둥근 원이다. PDOP 2.6, 위치 오차 중앙값 약 6.5 m로 좋음. 두 번째 패널은 천정 근처에 몰린 배치로, 위성 다섯 개가 머리 위 한곳에 모여 있고 불확실성 영역은 위아래로 길게 늘어난 타원이다(수직 오차가 지배적). PDOP 16.1, 위치 오차 중앙값 약 37.9 m로 나쁨. 같은 측정 잡음 3 m에서도 오차가 약 6배 차이 난다." viewBox="0 0 320 470" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>위성 배치와 DOP — 퍼진 배치 vs 천정에 몰린 배치</title>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">같은 잡음, 배치만 다르면</text>
  <rect x="8" y="32" width="304" height="24" rx="4" fill="var(--bg-light)" stroke="var(--text-light)" stroke-width="1"/>
  <text x="160" y="49" text-anchor="middle" font-size="12" fill="currentColor">미지수 4개 = x, y, z, 시계 오차 → 위성 ≥ 4</text>
  <!-- panel A: spread -->
  <rect x="8" y="66" width="304" height="170" rx="6" fill="none" stroke="var(--text-light)" stroke-width="1.2"/>
  <text x="18" y="88" font-size="13" font-weight="700" fill="currentColor">하늘 전체에 퍼진 배치</text>
  <text x="302" y="88" text-anchor="end" font-size="12" font-weight="700" fill="var(--secondary-color)">좋음</text>
  <path d="M40,206 A80,80 0 0 1 200,206" fill="none" stroke="var(--text-light)" stroke-width="1" stroke-dasharray="2 4"/>
  <g stroke="var(--text-light)" stroke-width="1" stroke-dasharray="3 3">
    <line x1="120" y1="206" x2="43" y2="185"/>
    <line x1="120" y1="206" x2="74" y2="141"/>
    <line x1="120" y1="206" x2="120" y2="126"/>
    <line x1="120" y1="206" x2="166" y2="141"/>
    <line x1="120" y1="206" x2="197" y2="185"/>
  </g>
  <g fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.5">
    <rect x="39" y="181" width="8" height="8"/>
    <rect x="70" y="137" width="8" height="8"/>
    <rect x="116" y="122" width="8" height="8"/>
    <rect x="162" y="137" width="8" height="8"/>
    <rect x="193" y="181" width="8" height="8"/>
  </g>
  <circle cx="120" cy="206" r="8" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="1.5" stroke-dasharray="3 2"/>
  <line x1="24" y1="206" x2="216" y2="206" stroke="currentColor" stroke-width="1.5"/>
  <path d="M115,206 L120,198 L125,206 Z" fill="currentColor"/>
  <text x="120" y="226" text-anchor="middle" font-size="12" fill="var(--text-light)">수신기</text>
  <text x="222" y="150" font-size="14" font-weight="700" fill="currentColor">PDOP 2.6</text>
  <text x="222" y="172" font-size="12" fill="var(--text-light)">오차 중앙값</text>
  <text x="222" y="192" font-size="13" font-weight="700" fill="currentColor">≈ 6.5 m</text>
  <!-- panel B: clustered near zenith -->
  <rect x="8" y="248" width="304" height="170" rx="6" fill="none" stroke="var(--text-light)" stroke-width="1.2"/>
  <text x="18" y="270" font-size="13" font-weight="700" fill="currentColor">천정 근처에 몰린 배치</text>
  <text x="302" y="270" text-anchor="end" font-size="12" font-weight="700" fill="var(--accent-color)">나쁨</text>
  <path d="M40,388 A80,80 0 0 1 200,388" fill="none" stroke="var(--text-light)" stroke-width="1" stroke-dasharray="2 4"/>
  <g stroke="var(--text-light)" stroke-width="1" stroke-dasharray="3 3">
    <line x1="120" y1="388" x2="101" y2="310"/>
    <line x1="120" y1="388" x2="111" y2="308"/>
    <line x1="120" y1="388" x2="122" y2="308"/>
    <line x1="120" y1="388" x2="133" y2="309"/>
    <line x1="120" y1="388" x2="144" y2="312"/>
  </g>
  <g fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.5">
    <rect x="97" y="306" width="8" height="8"/>
    <rect x="107" y="301" width="8" height="8"/>
    <rect x="118" y="298" width="8" height="8"/>
    <rect x="129" y="301" width="8" height="8"/>
    <rect x="140" y="306" width="8" height="8"/>
  </g>
  <ellipse cx="120" cy="388" rx="12" ry="28" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="1.5" stroke-dasharray="3 2"/>
  <line x1="24" y1="388" x2="216" y2="388" stroke="currentColor" stroke-width="1.5"/>
  <path d="M115,388 L120,380 L125,388 Z" fill="currentColor"/>
  <text x="222" y="332" font-size="14" font-weight="700" fill="currentColor">PDOP 16.1</text>
  <text x="222" y="354" font-size="12" fill="var(--text-light)">오차 중앙값</text>
  <text x="222" y="374" font-size="13" font-weight="700" fill="var(--accent-color)">≈ 37.9 m</text>
  <!-- legend -->
  <ellipse cx="22" cy="440" rx="10" ry="6" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="1.5" stroke-dasharray="3 2"/>
  <text x="40" y="444" font-size="12" fill="currentColor">= 위치 불확실성 영역 (모식도)</text>
  <text x="12" y="464" font-size="12" font-weight="700" fill="currentColor">같은 측정 잡음 σ 3 m → 오차 약 6배 차이</text>
</svg>
<figcaption>위성 8개 · 잡음 σ 3 m로 200번 푼 코드 결과 — 위성이 하늘 전체에 퍼지면 PDOP 2.6(오차 약 6.5 m), 천정 근처에 몰리면 PDOP 16.1(오차 약 37.9 m)로 같은 거리 오차가 위치 오차로 크게 증폭된다</figcaption>
</figure>

이런 오차가 겹친 결과, 일반적인 단독 측위(보정 없음)의 수평 정확도는 **수 m 수준**입니다. 위치 유지와 웨이포인트 비행에는 충분하지만, 정밀 착륙이나 측량에는 부족합니다.

### 1.4 더 정확하게: SBAS, DGPS, RTK

| 방식 | 원리 | 정확도(대략) | 비고 |
| --- | --- | --- | --- |
| **SBAS** | 정지궤도 위성이 넓은 지역의 보정 정보를 방송 | 1~2 m 수준 | 미국 WAAS, 유럽 EGNOS, 한국 KASS 등 |
| **DGPS** | 위치를 아는 기준국이 의사거리 보정값을 전송 | 1 m 이하~수 m | |
| **RTK** | 기준국과 이동국이 **반송파 위상**을 비교해 미세 거리 차이를 풂 | **cm 수준** | 기준국과 가까워야 함(보통 수~수십 km), 보정 데이터 링크 필요 |
| **PPK** | RTK와 같은 계산을 비행 후에 로그로 수행 | cm 수준 | 실시간 위치가 필요 없는 측량·매핑 |

RTK는 상태가 두 단계입니다. 정수 모호성(반송파 파장 몇 개만큼 떨어져 있는지)을 아직 확정하지 못한 **RTK float**(수십 cm 수준)과, 확정한 **RTK fixed**(cm 수준)입니다. 보정 데이터는 자체 기준국을 세우거나 인터넷의 **NTRIP** 서비스로 받으며, 통제 앱이 지상에서 받아 텔레메트리 링크로 기체에 중계하는 구조도 흔합니다(MAVLink `GPS_RTCM_DATA`). 통제 앱이 RTK 기체를 다룬다면 fix 상태를 반드시 보여 줘야 합니다. float에서 fixed로, fixed에서 float으로 바뀌는 순간 위치가 수십 cm 점프할 수 있기 때문입니다.

## 2. 측지 좌표 변환 — 위경도를 미터로

### 2.1 지구는 타원체다

GNSS가 직접 주는 위치는 **WGS84** 기준의 위도·경도·높이입니다. WGS84는 지구를 적도 반경 6,378,137m, 극 방향으로 약간 눌린 회전 타원체로 근사합니다. 여기서 높이에 함정이 있습니다.

- **타원체고(ellipsoidal height)**: WGS84 타원체 표면에서 잰 높이. GNSS가 기하학적으로 직접 계산하는 값
- **해발고도(MSL, orthometric height)**: 평균 해수면(지오이드)에서 잰 높이. 지도와 항공에서 쓰는 값
- 둘의 차이인 **지오이드고(geoid undulation)** 는 지역에 따라 다르고 **수십 m**에 이를 수 있습니다

수신기는 내장 지오이드 모델로 해발고도를 계산해 함께 내주는 경우가 많습니다. MAVLink에서도 `GPS_RAW_INT.alt`와 `GLOBAL_POSITION_INT.alt`는 **해발(MSL)** 이고, 타원체고는 `GPS_RAW_INT.alt_ellipsoid`라는 별도 필드에 있습니다. 서로 다른 출처의 고도(예: 지도 서비스의 지형 고도와 기체의 GNSS 고도)를 비교할 때 기준이 다르면 수십 m가 틀어집니다.

### 2.2 세 개의 좌표계와 변환 경로

1. **측지 좌표(geodetic)**: 위도·경도·높이. 사람과 지도가 쓰는 표현
2. **ECEF(Earth-Centered, Earth-Fixed)**: 지구 중심이 원점인 직교 좌표(m). 1.2절의 위성 계산이 이 좌표계에서 이뤄졌습니다
3. **로컬 NED**: home 같은 기준점에서 북·동·아래로 잰 직교 좌표(m). 제어기와 [2단계](/2026/11/05/drone-frames-attitude-dynamics.html)의 `LOCAL_POSITION_NED`가 쓰는 표현

측지 → ECEF는 타원체 공식으로, ECEF → 로컬 NED는 기준점의 위도·경도로 만든 회전행렬로 바꿉니다.

> 이 글의 Python 코드 블록은 하나의 세션에서 위에서부터 이어서 실행한다고 가정합니다(`np` 등을 앞 블록에서 정의).

```python
A = 6_378_137.0                  # WGS84 장반경 (m)
F = 1 / 298.257223563            # 편평률
E2 = F * (2 - F)                 # 이심률 제곱

def geodetic_to_ecef(lat_deg, lon_deg, h):
    """h는 타원체고(ellipsoidal height). 해발고도가 아니다."""
    lat, lon = np.radians(lat_deg), np.radians(lon_deg)
    n = A / np.sqrt(1 - E2 * np.sin(lat) ** 2)        # 묘유선 곡률 반경
    return np.array([
        (n + h) * np.cos(lat) * np.cos(lon),
        (n + h) * np.cos(lat) * np.sin(lon),
        (n * (1 - E2) + h) * np.sin(lat),
    ])

def ecef_to_ned(p, ref_lat_deg, ref_lon_deg, ref_h):
    """기준점(home)에서 본 p의 북·동·아래 성분."""
    lat, lon = np.radians(ref_lat_deg), np.radians(ref_lon_deg)
    d = p - geodetic_to_ecef(ref_lat_deg, ref_lon_deg, ref_h)
    R = np.array([
        [-np.sin(lat) * np.cos(lon), -np.sin(lat) * np.sin(lon),  np.cos(lat)],
        [-np.sin(lon),                np.cos(lon),                0.0],
        [-np.cos(lat) * np.cos(lon), -np.cos(lat) * np.sin(lon), -np.sin(lat)],
    ])
    return R @ d

home = (37.5665, 126.9780, 60.0)                       # 서울시청 부근, 타원체고 60 m (예시)
wp = (37.5700, 126.9830, 110.0)                        # 북동쪽 웨이포인트, 50 m 위
ned = ecef_to_ned(geodetic_to_ecef(*wp), *home)
print("NED (m):", np.round(ned, 1))                    # NED (m): [388.5 441.7 -50. ]

# 흔히 쓰는 '평면 근사'와 비교
dn = np.radians(wp[0] - home[0]) * A
de = np.radians(wp[1] - home[1]) * A * np.cos(np.radians(home[0]))
print("평면 근사 (m):", round(dn, 1), round(de, 1))     # 평면 근사 (m): 389.6 441.2
```

웨이포인트는 home에서 북쪽으로 약 389m, 동쪽으로 약 442m, 50m 위(z = −50)에 있습니다. 마지막 두 줄의 **평면 근사**는 위도·경도 차이에 지구 반경을 곱하는 간단한 방법인데, 수백 m 거리에서는 약 1m 차이로 꽤 잘 맞습니다. 하지만 거리가 수 km~수십 km로 늘거나 고위도로 가면 오차가 커집니다. 실무에서는 직접 구현하기보다 `pymap3d`·`pyproj` 같은 검증된 라이브러리를 쓰고, PX4도 내부에서 home 기준 투영(map projection)으로 위경도와 로컬 좌표를 오갑니다.

### 2.3 미션 고도의 세 가지 기준

통제 앱이 웨이포인트를 올릴 때도 고도 기준을 정해야 합니다. MAVLink 미션 항목의 좌표계(`frame`)가 그 역할을 합니다.

| 프레임 | 고도의 기준 | 쓰임 |
| --- | --- | --- |
| `MAV_FRAME_GLOBAL` | 해발(MSL) | 항공 지도와 맞출 때 |
| `MAV_FRAME_GLOBAL_RELATIVE_ALT` | **home 기준 상대 고도** | 가장 흔한 기본값 |
| `MAV_FRAME_GLOBAL_TERRAIN_ALT` | 지면 기준(AGL), 지형 데이터 필요 | 경사지에서 지면과 일정 간격 유지 |

<figure class="post-figure">
<svg role="img" aria-label="같은 드론의 네 가지 고도를 보여 주는 세로 단면도. 맨 아래에 직선인 WGS84 타원체가 있고, 그 위에 완만하게 휘는 지오이드(평균 해수면, MSL)가 있다. 그 위로 지형이 왼쪽 언덕에서 오른쪽 계곡으로 내려가며, 언덕 위에 home(이륙점)이 있다. 드론은 계곡 위에 떠 있다. 드론 높이에서 아래로 다섯 개의 괄호 화살표가 있다. 1 타원체고는 타원체에서 드론까지로 가장 길다. 2 해발(MSL)은 지오이드에서 드론까지다. 3 home 기준 상대고도는 이륙점 높이에서 드론까지로 가장 짧다. 4 지면 기준(AGL)은 드론 바로 아래 계곡 바닥에서 드론까지다. 5 지오이드고는 타원체와 지오이드 사이의 차이로 수십 m에 이를 수 있다." viewBox="0 0 320 440" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>같은 드론, 네 가지 고도 — 타원체고 · 해발 · home 기준 · 지면 기준</title>
  <defs>
    <marker id="gns-alt-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
    <marker id="gns-alt-arrow-acc" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-color)"/>
    </marker>
    <marker id="gns-alt-arrow-sec" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--secondary-color)"/>
    </marker>
    <marker id="gns-alt-arrow-mut" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--text-light)"/>
    </marker>
  </defs>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">같은 드론, 네 가지 '고도'</text>
  <!-- terrain: hill (home) on the left, valley on the right -->
  <path d="M8,300 L8,142 L30,140 L52,140 L80,160 L100,200 L120,226 L150,232 L190,222 L230,206 L270,196 L312,192 L312,300 Z" fill="var(--gold-soft)" stroke="none"/>
  <path d="M8,142 L30,140 L52,140 L80,160 L100,200 L120,226 L150,232 L190,222 L230,206 L270,196 L312,192" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="292" y="182" text-anchor="middle" font-size="12" fill="var(--text-light)">지형</text>
  <!-- geoid (MSL) and ellipsoid -->
  <path d="M8,258 Q160,272 312,258" fill="none" stroke="var(--secondary-color)" stroke-width="2" stroke-dasharray="7 4"/>
  <text x="14" y="252" font-size="12" font-weight="700" fill="var(--secondary-color)">지오이드 (MSL)</text>
  <line x1="8" y1="292" x2="312" y2="292" stroke="var(--text-light)" stroke-width="2" stroke-dasharray="2 3"/>
  <text x="14" y="286" font-size="12" font-weight="700" fill="currentColor">타원체 (WGS84)</text>
  <!-- home point -->
  <line x1="40" y1="140" x2="182" y2="140" stroke="var(--accent-color)" stroke-width="1" stroke-dasharray="3 3"/>
  <path d="M33,140 L33,130 L40,124 L47,130 L47,140 Z" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="1.5"/>
  <text x="40" y="118" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent-color)">home</text>
  <!-- drone and its level -->
  <line x1="134" y1="66" x2="300" y2="66" stroke="var(--text-light)" stroke-width="1" stroke-dasharray="3 3"/>
  <line x1="104" y1="62" x2="136" y2="62" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  <g fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="1.2">
    <ellipse cx="104" cy="56" rx="9" ry="2.5"/>
    <ellipse cx="136" cy="56" rx="9" ry="2.5"/>
  </g>
  <rect x="112" y="58" width="16" height="9" rx="2" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <text x="92" y="66" text-anchor="end" font-size="12" font-weight="700" fill="currentColor">드론</text>
  <!-- brackets -->
  <line x1="245" y1="290" x2="245" y2="68" stroke="var(--text-light)" stroke-width="1.6" marker-start="url(#gns-alt-arrow-mut)" marker-end="url(#gns-alt-arrow-mut)"/>
  <line x1="210" y1="262" x2="210" y2="68" stroke="var(--secondary-color)" stroke-width="1.6" stroke-dasharray="6 3" marker-start="url(#gns-alt-arrow-sec)" marker-end="url(#gns-alt-arrow-sec)"/>
  <line x1="175" y1="138" x2="175" y2="68" stroke="var(--accent-color)" stroke-width="1.6" marker-start="url(#gns-alt-arrow-acc)" marker-end="url(#gns-alt-arrow-acc)"/>
  <line x1="120" y1="224" x2="120" y2="70" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2 2" marker-start="url(#gns-alt-arrow)" marker-end="url(#gns-alt-arrow)"/>
  <line x1="290" y1="290" x2="290" y2="261" stroke="currentColor" stroke-width="1.6" marker-start="url(#gns-alt-arrow)" marker-end="url(#gns-alt-arrow)"/>
  <!-- number badges -->
  <g fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.2">
    <circle cx="259" cy="180" r="9"/>
    <circle cx="224" cy="150" r="9"/>
    <circle cx="189" cy="104" r="9"/>
    <circle cx="106" cy="150" r="9"/>
    <circle cx="274" cy="276" r="9"/>
  </g>
  <g font-size="12" font-weight="700" fill="currentColor" text-anchor="middle">
    <text x="259" y="184">1</text>
    <text x="224" y="154">2</text>
    <text x="189" y="108">3</text>
    <text x="106" y="154">4</text>
    <text x="274" y="280">5</text>
  </g>
  <!-- legend -->
  <g fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.2">
    <circle cx="20" cy="326" r="9"/>
    <circle cx="20" cy="350" r="9"/>
    <circle cx="20" cy="374" r="9"/>
    <circle cx="20" cy="398" r="9"/>
    <circle cx="20" cy="422" r="9"/>
  </g>
  <g font-size="12" font-weight="700" fill="currentColor" text-anchor="middle">
    <text x="20" y="330">1</text>
    <text x="20" y="354">2</text>
    <text x="20" y="378">3</text>
    <text x="20" y="402">4</text>
    <text x="20" y="426">5</text>
  </g>
  <g font-size="12" fill="currentColor">
    <text x="36" y="330"><tspan font-weight="700">타원체고</tspan><tspan fill="var(--text-light)"> · 타원체부터, GNSS가 직접 계산</tspan></text>
    <text x="36" y="354"><tspan font-weight="700">해발(MSL)</tspan><tspan fill="var(--text-light)"> · 지오이드부터</tspan></text>
    <text x="36" y="378"><tspan font-weight="700">home 기준 상대고도</tspan><tspan fill="var(--text-light)"> · 이륙점부터</tspan></text>
    <text x="36" y="402"><tspan font-weight="700">지면 기준(AGL)</tspan><tspan fill="var(--text-light)"> · 바로 아래 지형부터</tspan></text>
    <text x="36" y="426"><tspan font-weight="700">지오이드고</tspan><tspan fill="var(--text-light)"> · 타원체고 − 해발, 수십 m</tspan></text>
  </g>
</svg>
<figcaption>한 기체가 동시에 네 개의 '고도'를 가진다 — 산 중턱 home에서 계곡 위로 날면 home 기준 고도는 낮아도 지면 기준(AGL)은 훨씬 높고, 타원체고와 해발은 지오이드고(수십 m)만큼 다르다</figcaption>
</figure>

산 중턱에서 이륙해 계곡 쪽으로 미션을 보낸다고 생각해 보세요. home 기준 50m는 계곡 위에서 지면으로부터 수백 m 높이가 될 수 있고, 반대로 언덕을 향하면 지면에 부딪힐 수 있습니다. 앱은 미션 편집 화면에서 **고도 기준을 명시**하고, 가능하면 지형 고도와 비교해 경고해야 합니다.

## 3. 센서 융합 — 서로 다르게 틀리는 센서를 하나로

### 3.1 상보 필터: 직관

가장 단순한 융합은 **상보 필터(complementary filter)** 입니다. 자이로 적분은 짧은 시간에는 정확하지만 길게 보면 드리프트하고(저주파 오차), 가속도계로 구한 기울기는 길게 평균하면 정확하지만 순간적으로 흔들립니다(고주파 오차). 그래서 자이로 쪽은 고주파만, 가속도계 쪽은 저주파만 통과시켜 더합니다.

```text
각도 = α × (이전 각도 + 자이로 × dt) + (1 − α) × 가속도계로 구한 각도      (α ≈ 0.98, 100 Hz 기준 시정수 약 0.5 s)
```

한 줄로 꽤 잘 동작해서 작은 FC나 초기 펌웨어에서 쓰였습니다. 하지만 비율 α를 사람이 정해야 하고, 센서가 많아지거나(GNSS·자력계·기압계…) 센서 바이어스까지 추정하려면 한계가 있습니다.

### 3.2 칼만 필터: 불확실성까지 함께 추적

**칼만 필터**는 상보 필터의 비율을 자동으로, 그리고 매 순간 최적으로 정합니다. 핵심은 상태 추정값과 함께 **그 추정이 얼마나 불확실한지(공분산 P)** 를 같이 들고 다니는 것입니다.

- **예측(predict)**: 운동 모델과 IMU로 다음 상태를 예측. 시간이 갈수록 불확실성 P가 커짐
- **갱신(update)**: 측정이 들어오면, 예측과 측정의 차이(**혁신, innovation**)를 계산하고 **예측의 불확실성과 측정의 불확실성 비율**(칼만 이득 K)만큼 보정. 불확실성 P가 줄어듦

예측이 불확실하면 측정을 많이 믿고, 측정이 불확실하면 예측을 많이 믿습니다. 아래는 2단계의 수직 운동을 1차원으로 단순화한 예제입니다. 가속도계(100Hz, 바이어스와 잡음 있음)로 예측하고, 잡음 섞인 고도 측정(10Hz)으로 갱신하며, 12초에 고의로 **25m짜리 글리치**를 하나 넣었습니다.

```python
rng = np.random.default_rng(1)
dt, steps = 0.01, 2000                       # 100 Hz, 20초

# 실제 운동: 0 → 10 m 상승 후 정지 (계단식 가속)
t = np.arange(steps) * dt
true_acc = np.where(t < 2, 2.5, np.where(t < 4, -2.5, 0.0))
true_vel = np.cumsum(true_acc) * dt
true_alt = np.cumsum(true_vel) * dt

acc_meas = true_acc + 0.05 + rng.normal(0, 0.3, steps)    # 바이어스 0.05 m/s² + 잡음
alt_meas = true_alt + rng.normal(0, 0.5, steps)           # 고도 측정 잡음 σ = 0.5 m
alt_meas[1200] += 25.0                                    # 12초에 '글리치' 한 번

x = np.zeros(2)                                # 상태 [고도, 수직 속도]
P = np.eye(2)
F = np.array([[1, dt], [0, 1]])
B = np.array([0.5 * dt**2, dt])
Q = np.outer(B, B) * 0.3**2                    # 가속도 잡음이 만드는 공정 잡음
H = np.array([[1.0, 0.0]])
R = 0.5**2
GATE = 5.0                                     # 혁신(innovation)이 5σ를 넘으면 버린다

est, rejected = [], []
for k in range(steps):
    x = F @ x + B * acc_meas[k]                # 예측: 가속도계 적분
    P = F @ P @ F.T + Q
    if k % 10 == 0:                            # 고도 측정은 10 Hz
        innov = alt_meas[k] - (H @ x)[0]
        S = (H @ P @ H.T)[0, 0] + R
        if innov**2 / S > GATE**2:             # 검정 비율(test ratio) > 1 → 거부
            rejected.append(k)
        else:
            K = (P @ H.T / S).ravel()
            x = x + K * innov
            P = (np.eye(2) - np.outer(K, H)) @ P
    est.append(x[0])

est = np.array(est)
dead = np.cumsum(np.cumsum(acc_meas) * dt) * dt           # 가속도계만 적분
idx = np.arange(0, steps, 10)
rmse = lambda e: np.sqrt(np.mean(e**2))
print(f"가속도계만 적분: 20초 뒤 오차 {dead[-1] - true_alt[-1]:.1f} m")
print(f"고도 측정 그대로: RMSE {rmse(alt_meas[idx] - true_alt[idx]):.2f} m "
      f"(글리치 제외 {rmse(np.delete(alt_meas[idx] - true_alt[idx], 120)):.2f} m)")
print(f"칼만 필터:       RMSE {rmse(est[idx] - true_alt[idx]):.2f} m, 거부한 측정 {[k * dt for k in rejected]} s")
# 가속도계만 적분: 20초 뒤 오차 7.5 m
# 고도 측정 그대로: RMSE 1.81 m (글리치 제외 0.48 m)
# 칼만 필터:       RMSE 0.24 m, 거부한 측정 [12.0] s
```

결과가 상태 추정의 세 가지 이유를 한 번에 보여 줍니다.

- **가속도계만 적분하면 발산합니다.** 0.05m/s²라는 작은 바이어스만으로도 두 번 적분하면 ½·b·t² = 20초에 10m가 틀어집니다. 이번 실행에서는 잡음 누적이 일부 상쇄해 7.5m였습니다.
- **측정만 쓰면 잡음과 글리치를 그대로 받습니다.** RMSE 1.81m의 대부분은 25m 글리치 하나 때문이고, 글리치를 빼면 0.48m입니다.
- **칼만 필터는 둘을 섞어 0.24m**로 줄였습니다. 이득은 두 가지입니다 — 잡음을 약 2배 줄인 평활화(0.48m → 0.24m), 그리고 글리치 거부입니다. 글리치는 **혁신 게이트**에 걸려 버려졌습니다. 예측과의 차이가 예상 불확실성의 5배(5σ)를 넘는 측정을 받아들이지 않은 것입니다.

<figure class="post-figure">
<svg role="img" aria-label="칼만 필터의 예측-갱신 루프와 혁신 게이트. 맨 위 예측 상자에서는 IMU 가속도계를 100 Hz로 적분하고 불확실성 P가 커진다. 아래로 10 Hz 고도 측정이 도착하고, 혁신은 측정 빼기 예측이며 예상 불확실성 S와 비교한다. 다음은 마름모 게이트로, 검정 비율이 1을 넘는지 묻는다. 예이면 오른쪽 거부 상자로 가는데, 12.0초의 25 m 글리치가 여기서 버려지고 화살표는 다시 예측으로 돌아간다. 아니오이면 아래 갱신 상자로 가서 칼만 이득 K만큼 보정하고 P가 줄어든 뒤 왼쪽 화살표로 예측으로 돌아간다. 아래 결과 띠는 코드 결과로, 가속도계만 적분하면 20초 뒤 오차 7.5 m, 측정을 그대로 쓰면 RMSE 1.81 m, 칼만 필터는 RMSE 0.24 m다." viewBox="0 0 320 440" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>칼만 필터 루프 — 예측, 혁신, 게이트, 갱신</title>
  <defs>
    <marker id="gns-kf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
    <marker id="gns-kf-arrow-acc" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-color)"/>
    </marker>
    <marker id="gns-kf-arrow-sec" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">예측 → 혁신 → 게이트 → 갱신</text>
  <!-- predict -->
  <rect x="24" y="36" width="192" height="44" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <text x="120" y="54" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">예측 (IMU, 100 Hz)</text>
  <text x="120" y="72" text-anchor="middle" font-size="12" fill="var(--text-light)">가속도계 적분 → P 커짐 ↑</text>
  <line x1="120" y1="80" x2="120" y2="95" stroke="currentColor" stroke-width="1.5" marker-end="url(#gns-kf-arrow)"/>
  <!-- measurement -->
  <rect x="24" y="96" width="192" height="26" rx="4" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.5" stroke-dasharray="5 3"/>
  <text x="120" y="114" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">고도 측정 도착 (10 Hz)</text>
  <line x1="120" y1="122" x2="120" y2="135" stroke="currentColor" stroke-width="1.5" marker-end="url(#gns-kf-arrow)"/>
  <!-- innovation -->
  <rect x="24" y="136" width="192" height="44" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <text x="120" y="154" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">혁신 = 측정 − 예측</text>
  <text x="120" y="172" text-anchor="middle" font-size="12" fill="var(--text-light)">예상 불확실성 S와 비교</text>
  <line x1="120" y1="180" x2="120" y2="199" stroke="currentColor" stroke-width="1.5" marker-end="url(#gns-kf-arrow)"/>
  <!-- gate -->
  <path d="M120,200 L204,234 L120,268 L36,234 Z" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="120" y="230" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">게이트 (5σ)</text>
  <text x="120" y="247" text-anchor="middle" font-size="12" fill="currentColor">검정 비율 &gt; 1 ?</text>
  <!-- yes: reject -->
  <line x1="204" y1="234" x2="217" y2="234" stroke="var(--accent-color)" stroke-width="1.5" marker-end="url(#gns-kf-arrow-acc)"/>
  <text x="209" y="224" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent-color)">예</text>
  <rect x="218" y="206" width="94" height="58" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2" stroke-dasharray="6 3"/>
  <text x="265" y="224" text-anchor="middle" font-size="13" font-weight="700" fill="var(--accent-color)">✕ 거부</text>
  <text x="265" y="241" text-anchor="middle" font-size="12" fill="currentColor">12 s 글리치</text>
  <text x="265" y="257" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">+25 m</text>
  <path d="M267,206 L267,58 L218,58" fill="none" stroke="var(--accent-color)" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#gns-kf-arrow-acc)"/>
  <!-- no: update -->
  <line x1="120" y1="268" x2="120" y2="289" stroke="var(--secondary-color)" stroke-width="1.5" marker-end="url(#gns-kf-arrow-sec)"/>
  <text x="128" y="283" font-size="12" font-weight="700" fill="var(--secondary-color)">아니오</text>
  <rect x="24" y="290" width="192" height="44" rx="4" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="120" y="308" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">갱신 (K = 칼만 이득)</text>
  <text x="120" y="326" text-anchor="middle" font-size="12" fill="var(--text-light)">K만큼 보정 → P 줄어듦 ↓</text>
  <path d="M24,312 L10,312 L10,58 L22,58" fill="none" stroke="var(--secondary-color)" stroke-width="1.5" marker-end="url(#gns-kf-arrow-sec)"/>
  <!-- results strip -->
  <text x="12" y="360" font-size="13" font-weight="700" fill="currentColor">코드 결과 (20초 · 고도)</text>
  <g fill="var(--bg-light)" stroke-width="1.5">
    <rect x="8" y="370" width="98" height="60" rx="4" stroke="var(--text-light)"/>
    <rect x="111" y="370" width="98" height="60" rx="4" stroke="var(--text-light)"/>
    <rect x="214" y="370" width="98" height="60" rx="4" stroke="var(--accent-color)" stroke-width="2.5"/>
  </g>
  <g font-size="12" fill="var(--text-light)" text-anchor="middle">
    <text x="57" y="388">가속도계만</text>
    <text x="160" y="388">측정 RMSE</text>
    <text x="263" y="388">칼만 필터</text>
  </g>
  <g font-size="14" font-weight="700" fill="currentColor" text-anchor="middle">
    <text x="57" y="407">7.5 m</text>
    <text x="160" y="407">1.81 m</text>
    <text x="263" y="407" fill="var(--accent-color)">0.24 m</text>
  </g>
  <g font-size="12" fill="var(--text-light)" text-anchor="middle">
    <text x="57" y="423">20초 뒤 오차</text>
    <text x="160" y="423">(제외 0.48 m)</text>
    <text x="263" y="423">RMSE ★</text>
  </g>
</svg>
<figcaption>예측이 불확실하면 측정을, 측정이 불확실하면 예측을 더 믿는다 — 12초의 +25 m 글리치는 게이트(5σ)에서 거부되고, 측정 RMSE 1.81 m(글리치 제외 0.48 m)는 필터에서 0.24 m가 된다 — 글리치 거부와 약 2배의 잡음 평활화</figcaption>
</figure>

이 예제의 필터는 가속도계 바이어스를 상태에 넣지 않았는데도 고도 측정 덕분에 버텼습니다. 실제 EKF는 바이어스 자체를 상태로 넣어 함께 추정합니다.

### 3.3 실제 FC의 EKF: EKF2와 EKF3

실제 기체의 상태는 비선형입니다. 자세(쿼터니언)가 들어가고, 측정 모델(예: 자력계가 보는 자기장 방향)도 비선형입니다. 그래서 모델을 현재 추정점 근처에서 선형화해 칼만 필터를 적용하는 **확장 칼만 필터(EKF)** 를 씁니다.

| | PX4 **EKF2** | ArduPilot **EKF3** |
| --- | --- | --- |
| 상태 | 자세·속도·위치·자이로/가속도 바이어스·지구/기체 자기장·바람 등 24개 내외 | 같은 설계 계보의 비슷한 구성(24개 내외) |
| 융합 센서 | IMU(예측), GNSS, 기압계, 자력계, 거리센서, 광류, 외부 비전(VIO), 대기속도 등 | 거의 같음, 센서 소스를 파라미터로 전환 가능 |
| 다중 인스턴스 | IMU(·자력계) 조합별로 여러 EKF를 돌리고 가장 건강한 것을 선택(multi-EKF) | IMU별 "lane"을 돌리고 이상 시 전환(lane switching) |
| 특징 | 측정 지연을 다루려고 과거 시점(delayed horizon)에서 융합하고 현재로 예측해 출력(EKF3도 같은 구조) | 센서 소스 세트를 비행 중 전환 가능(예: GPS ↔ 비전) |

두 추정기 모두 3.2절의 **혁신 게이트**를 센서마다 둡니다. 혁신을 (게이트 배수 × 예상 표준편차)로 정규화한 값(PX4는 그 제곱)을 **검정 비율(test ratio)** 이라 하고, 1을 넘으면 그 측정을 거부합니다. 게이트 폭은 파라미터(표준편차의 배수)로 조정합니다. GPS 글리치가 한두 번이면 거부되고 지나가지만, 계속되면 추정기는 일정 시간 뒤 위치를 GPS 값으로 리셋하거나(이때 위치가 점프합니다), GPS를 신뢰할 수 없다고 판단해 위치 추정을 다른 소스에 맡기거나, 위치가 필요한 모드(Position·Mission)를 유지할 수 없게 되어 페일세이프로 이어집니다(9단계).

### 3.4 통제 앱이 읽는 추정 품질

| 메시지 | 담긴 정보 | 앱에서의 쓰임 |
| --- | --- | --- |
| `GPS_RAW_INT` | `fix_type`(0 GPS 없음 · 1 fix 없음 · 2 2D · 3 3D · 4 DGPS · 5 RTK float · 6 RTK fixed · 7 static · 8 PPP), 위성 수, `eph`/`epv`(HDOP/VDOP × 100), 확장 필드 `h_acc`/`v_acc`(정확도, mm), 해발·타원체고 | GPS 상태 아이콘, RTK 상태 |
| `ESTIMATOR_STATUS` (PX4) | 속도·수평/수직 위치·자력계 등의 **검정 비율**, 추정 정확도, 상태 플래그 | "위치 추정 불안정" 경고 |
| `EKF_STATUS_REPORT` (ArduPilot) | 속도·위치·고도·나침반 분산(검정 비율에 해당)과 플래그 | ArduPilot 기체의 같은 용도 |

판단 기준은 단순합니다. **검정 비율이 1에 가까워지면 측정과 예측이 어긋나기 시작한 것**이고, 1을 넘으면 그 센서가 거부되고 있는 것입니다. 위성 수가 많고 fix가 3D여도 다중경로가 심한 곳에서는 검정 비율이 높을 수 있습니다. 그래서 통제 앱은 위성 수만이 아니라 **추정기의 판단**을 함께 보여 주는 것이 좋습니다.

## 4. 운용 노트

### 4.1 통제 앱에 바로 쓰이는 규칙

- **이륙 전 GPS 품질 확인**: 3D fix와 충분한 위성 수만으로 판단하지 말고 HDOP와 추정기 상태를 함께 봅니다. 펌웨어의 arming check도 이 값들을 봅니다.
- **고도는 기준과 함께**: 해발·타원체고·home 기준·지면 기준을 화면과 데이터 모델에서 구분합니다. 이 시리즈에서 세 번째로 반복하는 규칙입니다.
- **위치 점프를 의심**: RTK 상태 변화, GPS 재획득, EKF 리셋 순간에는 위치가 순간 이동할 수 있습니다. 궤적 그래프에 표시해 두면 사후 분석이 쉬워집니다.
- **위경도 계산은 라이브러리로**: 짧은 거리의 평면 근사는 미리보기 정도에만 씁니다.

### 4.2 이 단계에서 다루지 않은 것

칼만 필터의 수학적 유도, 비선형 추정기(UKF·오차 상태 EKF)의 세부, GPS 없는 환경의 항법(광류·VIO·SLAM), GNSS 재밍·스푸핑 대응은 Essential 범위를 넘습니다. 각각 심화 후보 `Drone-State-Estimation`과 `Drone-Fleet-Ops`에서 다룰 주제로 남겨 둡니다.

## 마무리

4단계에서 지도 위 드론 아이콘의 정체를 확인했습니다. GNSS는 **의사거리와 네 번째 위성**으로 위치와 시계 오차를 함께 풀고, 그 정확도는 대기 지연·다중경로와 함께 **위성 배치(DOP)** 에 크게 좌우됩니다. 그 위치는 **WGS84 위경도**로 나오며, 타원체고·해발고도·home 기준 고도를 구분해 **로컬 NED**로 바꿔야 지도와 제어에 쓸 수 있습니다. 그리고 FC는 서로 다르게 틀리는 센서들을 **칼만 필터(EKF)** 로 묶어, 불확실성을 함께 추적하며 글리치를 걸러냅니다.

다음 단계는 이 추정된 상태를 입력으로 받아 기체를 원하는 곳으로 움직이는 **5단계: 비행 제어**입니다. 피드백과 PID, 위치→속도→자세→각속도로 이어지는 캐스케이드, 그리고 비행 모드가 그 캐스케이드의 어느 층에 목표값을 넣는지를 다룹니다.

### 다음 학습

- [Drone Control Essential Curriculum](/2026/11/05/drone-control-essential-curriculum.html) — 시리즈 전체 지도와 진행률
- 직전: [기체 · 센서 · 액추에이터](/2026/11/05/drone-airframe-sensors-actuators.html) — 추진계·배터리·센서가 무엇을 내고 어떻게 틀리는가
- 다음: [비행 제어: 자세 · 고도 · 위치 루프](/2026/11/05/drone-flight-control.html) — PID와 캐스케이드, 비행 모드가 목표를 넣는 층
