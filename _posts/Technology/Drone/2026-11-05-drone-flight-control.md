---
layout: post
title: "비행 제어: 자세 · 고도 · 위치 루프"
date: 2026-11-05 00:05:00
categories: [Technology, Drone]
tags: [drone, flight-control, pid, cascade-control, px4, ardupilot, mavlink]
series: Drone-Control-Essential
published: true
excerpt: "\"고도 30 m 유지\"라는 명령은 FC 안에서 여러 겹의 피드백 루프로 풀립니다. P·I·D 각 항의 역할과 적분 와인드업·미분 노이즈·루프 지연이라는 실전 함정, 위치→속도→자세→각속도 캐스케이드와 안쪽부터의 튜닝, 그리고 비행 모드가 그 캐스케이드의 어느 층에 목표값을 넣는지를 코드와 PX4·ArduPilot 대응표로 정리합니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="명령 한 줄이 네 겹의 피드백 루프로 풀리는 모습. 맨 위 상자에 통제 앱 명령 '고도 30 m · 이 지점으로'가 있고, 화살표가 아래의 동심원 고리로 들어간다. 고리는 바깥부터 위치, 속도, 자세 루프이고 가장 안쪽 원이 각속도 루프다. 가장 안쪽 원에서 화살표가 아래로 나가 믹서를 거쳐 모터 네 개로 간다. 왼쪽의 시간 축은 바깥 고리일수록 느리고(초 단위) 안쪽일수록 빠르다(밀리초 단위)는 것을 보여 준다. 오른쪽의 상태 추정(EKF) 상자는 점선 화살표로 고리 안쪽에 피드백을 되돌려 준다." viewBox="0 0 320 432" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>명령 한 줄이 네 겹의 루프로 — 위치 · 속도 · 자세 · 각속도 → 믹서 → 모터</title>
  <defs>
    <marker id="fc-hdr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
    <marker id="fc-hdr-arrow-sec" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--secondary-color)"/>
    </marker>
    <marker id="fc-hdr-arrow-mut" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--text-light)"/>
    </marker>
  </defs>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">명령 한 줄, 네 겹의 루프</text>
  <!-- command from the GCS app -->
  <rect x="50" y="34" width="200" height="44" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="150" y="51" text-anchor="middle" font-size="12" fill="var(--text-light)">통제 앱 명령</text>
  <text x="150" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">고도 30 m · 이 지점으로</text>
  <line x1="150" y1="78" x2="150" y2="116" stroke="currentColor" stroke-width="2" marker-end="url(#fc-hdr-arrow)"/>
  <!-- concentric loops: outer = slow, inner = fast -->
  <circle cx="150" cy="210" r="92" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <circle cx="150" cy="210" r="70" fill="var(--bg-panel)" stroke="currentColor" stroke-width="2"/>
  <circle cx="150" cy="210" r="48" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <circle cx="150" cy="210" r="26" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="2"/>
  <g text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">
    <text x="150" y="134">위치</text>
    <text x="150" y="156">속도</text>
    <text x="150" y="178">자세</text>
    <text x="150" y="214">각속도</text>
  </g>
  <!-- time axis: slow outside, fast inside -->
  <g text-anchor="middle" font-size="12" fill="var(--text-light)">
    <text x="30" y="114" font-weight="700">느림</text>
    <text x="30" y="130">초 단위</text>
    <text x="30" y="306" font-weight="700">빠름</text>
    <text x="30" y="322">ms 단위</text>
  </g>
  <line x1="30" y1="138" x2="30" y2="290" stroke="var(--text-light)" stroke-width="1.5" marker-end="url(#fc-hdr-arrow-mut)"/>
  <!-- state estimation feedback -->
  <text x="283" y="172" text-anchor="middle" font-size="12" fill="var(--secondary-color)">피드백</text>
  <rect x="252" y="180" width="62" height="42" rx="4" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="283" y="197" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">상태 추정</text>
  <text x="283" y="214" text-anchor="middle" font-size="12" fill="currentColor">EKF</text>
  <line x1="252" y1="201" x2="201" y2="201" stroke="var(--secondary-color)" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#fc-hdr-arrow-sec)"/>
  <!-- out to mixer and motors -->
  <line x1="150" y1="236" x2="150" y2="329" stroke="var(--accent-color)" stroke-width="2.5" marker-end="url(#fc-hdr-arrow)"/>
  <rect x="100" y="330" width="100" height="30" rx="4" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="150" y="350" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">믹서</text>
  <g stroke="currentColor" stroke-width="1.5">
    <line x1="150" y1="360" x2="90" y2="384"/>
    <line x1="150" y1="360" x2="130" y2="384"/>
    <line x1="150" y1="360" x2="170" y2="384"/>
    <line x1="150" y1="360" x2="210" y2="384"/>
  </g>
  <g fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="1.5">
    <ellipse cx="90" cy="388" rx="15" ry="4"/>
    <ellipse cx="130" cy="388" rx="15" ry="4"/>
    <ellipse cx="170" cy="388" rx="15" ry="4"/>
    <ellipse cx="210" cy="388" rx="15" ry="4"/>
  </g>
  <text x="150" y="418" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">모터 4개</text>
</svg>
<figcaption>"고도 30 m · 이 지점으로"는 모터에 바로 닿지 않는다 — 느린 바깥 위치 루프부터 가장 빠른 안쪽 각속도 루프까지 겹겹이 풀린 뒤에야 믹서를 거쳐 모터 명령이 되고, 그동안 상태 추정이 각 루프에 피드백을 되돌려 준다</figcaption>
</figure>

## 들어가며

이 글은 `Drone-Control-Essential` 시리즈의 **5단계**입니다. 전체 흐름은 [Drone Control Essential Curriculum](/2026/11/05/drone-control-essential-curriculum.html)에서 확인하고, 직전 단계 [GNSS · 항법 · 상태 추정](/2026/11/05/drone-gnss-navigation-estimation.html)을 먼저 읽으면 좋습니다.

4단계에서 FC는 "지금 기체가 어디에, 어떤 자세로 있는가"를 추정했습니다. 이번 단계는 그 다음 질문입니다. **원하는 곳과 지금 있는 곳이 다르면, 모터에 무엇을 명령해야 하는가?** 통제 앱이 보내는 "고도 30 m 유지"나 "이 웨이포인트로 이동"은 모터 네 개의 회전수로 바로 바뀌지 않습니다. FC 안에서 위치 → 속도 → 자세 → 각속도로 이어지는 **여러 겹의 피드백 루프**를 거쳐서야 모터 명령이 됩니다.

통제 앱 개발자가 PID를 직접 튜닝할 일은 많지 않습니다. 그래도 이 구조를 알아야 하는 이유는 분명합니다. **비행 모드를 바꾼다는 것은 이 캐스케이드의 어느 층에 목표값을 넣을지 바꾸는 일**이고, 앱이 Offboard·Guided로 직접 목표를 보낼 때도 위치·속도·자세 중 어느 층에 넣을지를 골라야 하기 때문입니다. 로그에서 "목표값과 실제 값이 어긋나는" 그래프를 읽는 것도 같은 지식에서 나옵니다.

<div class="post-summary-box" markdown="1">

### 📌 이 글에서 다루는 내용

#### 🔍 핵심 주제

- **피드백 제어와 PID**: 오차·P/I/D 항의 의미, 적분 와인드업, 미분 노이즈, 루프 주기와 지연
- **캐스케이드 제어 구조**: 각속도 → 자세 → 속도 → 위치 루프, 고도(수직) 제어 분리, 바깥 루프는 P·안쪽 루프는 PID인 구성, 튜닝 순서와 로그로 보는 응답
- **비행 모드**: Manual/Stabilized → Altitude → Position → Mission/Auto → RTL·Land, PX4 모드와 ArduPilot 모드 대응표 — 앱이 모드를 바꾼다는 것의 의미

</div>

## 1. 피드백 제어와 PID

### 1.1 왜 피드백인가

가장 단순한 고도 유지 방법은 "호버에 필요한 스로틀을 계산해서 그대로 넣는 것"입니다. 이것을 **개루프(open-loop)** 제어라고 합니다. 드론에서는 이 방법이 통하지 않습니다.

- **호버 스로틀을 정확히 모릅니다.** 짐을 싣거나 배터리를 바꾸면 무게가 달라집니다.
- **같은 스로틀이라도 추력이 변합니다.** 3단계에서 본 것처럼 배터리 전압이 떨어지면 같은 명령에서도 모터가 덜 돕니다.
- **외란이 있습니다.** 바람, 지면 효과, 기체 비대칭이 끊임없이 기체를 밉니다.

그래서 FC는 **측정(추정)한 현재 값을 목표값과 비교하고, 그 차이(오차)를 줄이는 방향으로 명령을 고칩니다.** 이것이 **피드백(폐루프, closed-loop)** 제어입니다. 모델이 조금 틀려도, 외란이 와도, 오차가 남아 있는 한 명령이 계속 고쳐집니다.

### 1.2 P · I · D 세 항의 의미

피드백 제어기 중 가장 널리 쓰이는 것이 **PID**입니다. 오차 `e = 목표 − 현재`에 대해 명령 `u`를 세 항의 합으로 만듭니다.

```text
u(t) = Kp·e(t)  +  Ki·∫e(t)dt  +  Kd·de(t)/dt
        (P: 현재)    (I: 과거)        (D: 미래 추세)
```

| 항 | 보는 것 | 효과 | 지나치면 |
| --- | --- | --- | --- |
| **P** (비례) | 지금 오차의 크기 | 오차에 비례해 밀어 줌 | 진동, 오버슈트 |
| **I** (적분) | 쌓인 오차 | 끈질기게 남는 오차(정상상태 오차) 제거 | 느린 출렁임, 와인드업 |
| **D** (미분) | 오차가 변하는 속도 | 빠르게 다가갈 때 제동, 진동 감쇠 | 노이즈 증폭 |

직관은 이렇습니다. P만 있으면 오차가 작아질수록 미는 힘도 작아집니다. 그래서 호버 스로틀을 잘못 아는 것 같은 **일정한 편향**이 있으면, 그 편향과 P 항이 균형을 이루는 지점에서 기체가 멈춥니다. 목표에는 끝내 닿지 못합니다. I 항은 남은 오차를 계속 쌓아 그 편향을 메웁니다. D 항은 목표를 향해 빠르게 움직이는 중일 때 미리 브레이크를 겁니다.

### 1.3 코드: 고도 PID로 세 항 확인하기

수직 한 축만 떼어 낸 고도 제어 시뮬레이션입니다. 기체는 짐을 실어 실제 호버 스로틀이 0.55인데, 컨트롤러는 0.50으로 잘못 알고 있습니다. 모터는 50 ms의 1차 지연으로 반응하고, 제어 루프는 250 Hz로 돕니다.

```python
import numpy as np

G = 9.81
DT = 0.004            # 250 Hz 제어 루프
U_HOVER_TRUE = 0.55   # 실제 호버 스로틀 (짐을 실어 무거워짐)
U_HOVER_EST = 0.50    # 컨트롤러가 알고 있는 호버 스로틀
TAU_MOTOR = 0.05      # 모터·ESC 1차 지연 [s]

def simulate(kp, ki, kd, target=5.0, t_end=15.0, u_max=1.0, anti_windup=True,
             d_on_meas=True, noise=0.0, d_filter_hz=None, delay=0.0, seed=0):
    rng = np.random.default_rng(seed)
    n = int(t_end / DT)
    z = vz = 0.0
    thrust = U_HOVER_TRUE                   # 호버 상태에서 시작
    integ = d_state = 0.0
    prev_meas, prev_err = 0.0, target
    buf = [0.0] * int(round(delay / DT))    # 측정 지연 버퍼
    zs, us = np.empty(n), np.empty(n)
    for k in range(n):
        buf.append(z + rng.normal(0, noise))
        meas = buf.pop(0)
        err = target - meas
        # D 항: 오차를 미분하면 목표가 바뀌는 순간 튄다(derivative kick)
        raw_d = -(meas - prev_meas) / DT if d_on_meas else (err - prev_err) / DT
        if k == 0 and not d_on_meas:
            raw_d = target / DT             # 목표가 0 → 5 m로 바뀐 순간
        if d_filter_hz:                     # 1차 저역 통과 필터
            alpha = DT / (DT + 1 / (2 * np.pi * d_filter_hz))
            d_state += alpha * (raw_d - d_state)
        else:
            d_state = raw_d
        prev_meas, prev_err = meas, err
        u_raw = U_HOVER_EST + kp * err + ki * integ + kd * d_state
        u = min(max(u_raw, 0.0), u_max)
        # clamping anti-windup: 포화를 더 깊게 만드는 방향으로는 적분하지 않는다
        if not (anti_windup and u != u_raw and np.sign(err) == np.sign(u_raw - u)):
            integ += err * DT
        thrust += (u - thrust) * DT / TAU_MOTOR
        vz += G * (thrust / U_HOVER_TRUE - 1.0) * DT
        z = max(z + vz * DT, 0.0)            # 지면
        if z == 0.0:
            vz = max(vz, 0.0)
        zs[k], us[k] = z, u
    return zs, us

def summary(zs, target):
    t = np.arange(len(zs)) * DT
    out = np.nonzero(np.abs(zs - target) > 0.05 * target)[0]
    settle = f"{t[out[-1]] + DT:4.1f} s" if out[-1] < len(zs) - 1 else " 안 됨"
    return (f"최고 {zs.max():5.2f} m | 정착(±5%) {settle} | "
            f"마지막 1초 평균 오차 {target - zs[-int(1/DT):].mean():+.2f} m")

KP, KI, KD = 0.08, 0.015, 0.10

print("① 5 m 상승, 호버 스로틀을 0.50으로 잘못 알고 있을 때 (실제 0.55)")
for name, gains in [("P", (KP, 0, 0)), ("PD", (KP, 0, KD)), ("PID", (KP, KI, KD))]:
    print(f"  {name:<4}", summary(simulate(*gains)[0], 5.0))
# ① 5 m 상승, 호버 스로틀을 0.50으로 잘못 알고 있을 때 (실제 0.55)
#   P    최고  9.14 m | 정착(±5%)  안 됨 | 마지막 1초 평균 오차 +4.45 m
#   PD   최고  4.50 m | 정착(±5%)  안 됨 | 마지막 1초 평균 오차 +0.63 m
#   PID  최고  5.68 m | 정착(±5%)  7.3 s | 마지막 1초 평균 오차 -0.04 m
```

세 줄이 세 항의 역할을 그대로 보여 줍니다.

- **P만**: 감쇠가 없는 데다 모터 지연까지 겹쳐 출렁임이 커지고, 지면에 닿았다 9 m까지 튀어 오르기를 반복합니다. 마지막 1초 평균 오차가 큰 것은 이 출렁임의 한 구간을 잘랐기 때문입니다.
- **PD**: D가 진동을 잡아 매끄럽게 올라가지만, 목표보다 **0.63 m 아래에서 멈춥니다.** 호버 스로틀 오차 0.05를 P 항이 메우려면 오차가 `0.05 / 0.08 = 0.625 m` 남아 있어야 하기 때문입니다. 이것이 **정상상태 오차**입니다.
- **PID**: I가 남은 오차를 쌓아 편향을 메우고, 7.3초 만에 ±5% 안에 들어옵니다. 대가로 약간의 오버슈트(0.68 m)가 생깁니다.

실제 FC도 같은 문제를 겪습니다. 그래서 PX4는 `MPC_THR_HOVER`와 호버 추력 추정기를, ArduPilot은 `MOT_THST_HOVER`와 그 학습 기능(`MOT_HOVER_LEARN`)을 둡니다. 호버 스로틀을 잘 알수록 I 항이 할 일이 줄어듭니다.

### 1.4 실전의 세 함정: 와인드업 · 미분 노이즈 · 지연

교과서 PID를 그대로 FC에 넣으면 세 가지 문제가 생깁니다.

```python
print("\n② 적분 와인드업: 20 m 상승, 스로틀 상한 0.65")
for aw in (False, True):
    zs, _ = simulate(KP, KI, KD, target=20.0, t_end=40.0, u_max=0.65, anti_windup=aw)
    print(f"  anti-windup {'켬' if aw else '끔'}", summary(zs, 20.0))

print("\n③ 미분 항의 두 함정")
_, us_e = simulate(KP, KI, KD, d_on_meas=False)
_, us_m = simulate(KP, KI, KD)
print(f"  목표가 바뀐 순간 스로틀: 오차 미분 {us_e[0]:.2f} vs 측정값 미분 {us_m[0]:.2f}")
for name, kw in [("필터 없음", {}), ("5 Hz 저역 통과", dict(d_filter_hz=5))]:
    _, us = simulate(KP, KI, KD, noise=0.02, **kw)
    print(f"  고도 잡음 σ=2 cm, {name:<10} 호버 중 스로틀 흔들림(표준편차) {us[-int(5/DT):].std():.3f}")

print("\n④ 루프 지연: 더 공격적으로 튜닝한 PID(kp=0.3, kd=0.12)에 측정 지연을 넣으면")
for d in (0.0, 0.1, 0.2, 0.3):
    zs, _ = simulate(0.3, 0.05, 0.12, delay=d, t_end=20.0)
    print(f"  지연 {int(d*1000):3d} ms", summary(zs, 5.0))
# ② 적분 와인드업: 20 m 상승, 스로틀 상한 0.65
#   anti-windup 끔 최고 30.53 m | 정착(±5%) 16.3 s | 마지막 1초 평균 오차 -0.00 m
#   anti-windup 켬 최고 21.09 m | 정착(±5%)  7.5 s | 마지막 1초 평균 오차 -0.00 m
#
# ③ 미분 항의 두 함정
#   목표가 바뀐 순간 스로틀: 오차 미분 1.00 vs 측정값 미분 0.90
#   고도 잡음 σ=2 cm, 필터 없음      호버 중 스로틀 흔들림(표준편차) 0.399
#   고도 잡음 σ=2 cm, 5 Hz 저역 통과 호버 중 스로틀 흔들림(표준편차) 0.059
#
# ④ 루프 지연: 더 공격적으로 튜닝한 PID(kp=0.3, kd=0.12)에 측정 지연을 넣으면
#   지연   0 ms 최고  5.95 m | 정착(±5%)  3.7 s | 마지막 1초 평균 오차 +0.00 m
#   지연 100 ms 최고  6.51 m | 정착(±5%)  3.6 s | 마지막 1초 평균 오차 +0.00 m
#   지연 200 ms 최고  7.76 m | 정착(±5%) 10.7 s | 마지막 1초 평균 오차 +0.03 m
#   지연 300 ms 최고  9.32 m | 정착(±5%)  안 됨 | 마지막 1초 평균 오차 +4.32 m
```

<figure class="post-figure">
<svg role="img" aria-label="적분 와인드업 비교. 20 m 상승, 스로틀 상한 0.65 조건에서 위아래 두 패널을 비교한다. 각 패널에는 시간에 따른 고도 곡선과 목표 20 m 점선, 그 아래 스로틀이 상한 0.65에 붙은 포화 구간 띠, 그 아래 시간별 적분값 막대가 있다. 시간축은 0~20초다. 위 패널은 anti-windup 끔: 스로틀이 약 4.7초 동안 상한에 붙어 있는 사이 적분이 계속 쌓여 목표에 닿는 약 5초 무렵 최대가 되고, 그 남은 적분 때문에 고도가 약 7초에 30.53 m까지 솟은 뒤 위에서부터 천천히 내려와 16.3초에 정착한다. 아래 패널은 anti-windup 켬: 포화는 약 3.5초로 짧고 그동안 적분은 0이며, 같은 눈금에서 적분 막대가 아주 작게 유지되고 고도는 21.09 m까지만 오른 뒤 7.5초에 정착한다." viewBox="0 0 320 452" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>적분 와인드업 — anti-windup 끔(최고 30.53 m) vs 켬(최고 21.09 m)</title>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">적분 와인드업 (20 m 상승)</text>
  <!-- panel A: anti-windup off -->
  <rect x="8" y="34" width="304" height="200" rx="6" fill="none" stroke="var(--text-light)" stroke-width="1.2"/>
  <text x="18" y="55" font-size="13" font-weight="700" fill="currentColor">anti-windup 끔</text>
  <text x="302" y="55" text-anchor="end" font-size="12" font-weight="700" fill="var(--accent-color)">최고 30.53 m</text>
  <line x1="48" y1="64" x2="48" y2="140" stroke="var(--text-light)" stroke-width="1"/>
  <line x1="48" y1="140" x2="298" y2="140" stroke="var(--text-light)" stroke-width="1"/>
  <line x1="48" y1="92.5" x2="298" y2="92.5" stroke="var(--secondary-color)" stroke-width="1.5" stroke-dasharray="5 4"/>
  <text x="44" y="97" text-anchor="end" font-size="12" fill="var(--secondary-color)">20 m</text>
  <line x1="251.75" y1="100" x2="251.75" y2="140" stroke="var(--text-light)" stroke-width="1" stroke-dasharray="2 3"/>
  <polyline points="48,140 60.5,138.1 73,131.9 85.5,121.5 98,106.8 110.5,88 123,72.1 135.3,67.5 148,70.2 160.5,75.1 173,79.5 198,85.2 223,88.2 248,89.9 273,91 298,91.6" fill="none" stroke="var(--accent-color)" stroke-width="2.5" stroke-linejoin="round"/>
  <circle cx="135.3" cy="67.5" r="3" fill="var(--accent-color)"/>
  <text x="44" y="159" text-anchor="end" font-size="12" fill="currentColor">스로틀</text>
  <rect x="48" y="149" width="59.3" height="12" fill="var(--accent-color)"/>
  <text x="114" y="159" font-size="12" fill="currentColor">상한 0.65에 붙음</text>
  <text x="298" y="159" text-anchor="end" font-size="12" fill="var(--text-light)">0~20 s</text>
  <text x="44" y="200" text-anchor="end" font-size="12" fill="currentColor">적분</text>
  <line x1="48" y1="206" x2="298" y2="206" stroke="var(--text-light)" stroke-width="1"/>
  <g fill="var(--accent-color)">
    <rect x="55" y="198.6" width="10" height="7.4"/>
    <rect x="80" y="186.4" width="10" height="19.6"/>
    <rect x="105" y="182.1" width="10" height="23.9"/>
    <rect x="130" y="187.9" width="10" height="18.1"/>
    <rect x="155" y="194.8" width="10" height="11.2"/>
    <rect x="180" y="199" width="10" height="7"/>
    <rect x="205" y="201.3" width="10" height="4.7"/>
    <rect x="230" y="202.7" width="10" height="3.3"/>
    <rect x="255" y="203.5" width="10" height="2.5"/>
    <rect x="280" y="204" width="10" height="2"/>
  </g>
  <text x="18" y="226" font-size="12" fill="currentColor">정착 16.3 s — 남은 적분이 기체를 밀어 올림</text>
  <!-- panel B: anti-windup on -->
  <rect x="8" y="244" width="304" height="200" rx="6" fill="none" stroke="var(--text-light)" stroke-width="1.2"/>
  <text x="18" y="265" font-size="13" font-weight="700" fill="currentColor">anti-windup 켬</text>
  <text x="302" y="265" text-anchor="end" font-size="12" font-weight="700" fill="var(--secondary-color)">최고 21.09 m</text>
  <line x1="48" y1="274" x2="48" y2="350" stroke="var(--text-light)" stroke-width="1"/>
  <line x1="48" y1="350" x2="298" y2="350" stroke="var(--text-light)" stroke-width="1"/>
  <line x1="48" y1="302.5" x2="298" y2="302.5" stroke="var(--secondary-color)" stroke-width="1.5" stroke-dasharray="5 4"/>
  <text x="44" y="307" text-anchor="end" font-size="12" fill="var(--secondary-color)">20 m</text>
  <line x1="141.75" y1="310" x2="141.75" y2="350" stroke="var(--text-light)" stroke-width="1" stroke-dasharray="2 3"/>
  <polyline points="48,350 60.5,348.1 73,341.9 85.5,331.5 98,317.2 110.5,305.7 123,300.8 134.1,299.9 148,300.5 160.5,301.1 173,301.6 198,302 223,302.2 248,302.3 273,302.4 298,302.4" fill="none" stroke="var(--secondary-color)" stroke-width="2.5" stroke-linejoin="round"/>
  <circle cx="134.1" cy="299.9" r="3" fill="var(--secondary-color)"/>
  <text x="44" y="369" text-anchor="end" font-size="12" fill="currentColor">스로틀</text>
  <rect x="48" y="359" width="43.4" height="12" fill="var(--accent-color)"/>
  <text x="98" y="369" font-size="12" fill="currentColor">상한 0.65에 붙음</text>
  <text x="298" y="369" text-anchor="end" font-size="12" fill="var(--text-light)">0~20 s</text>
  <text x="44" y="410" text-anchor="end" font-size="12" fill="currentColor">적분</text>
  <line x1="48" y1="416" x2="298" y2="416" stroke="var(--text-light)" stroke-width="1"/>
  <g fill="var(--secondary-color)">
    <rect x="105" y="413.1" width="10" height="2.9"/>
    <rect x="130" y="413.5" width="10" height="2.5"/>
    <rect x="155" y="414.1" width="10" height="1.9"/>
    <rect x="180" y="414.4" width="10" height="1.6"/>
    <rect x="205" y="414.5" width="10" height="1.5"/>
    <rect x="230" y="414.6" width="10" height="1.4"/>
    <rect x="255" y="414.7" width="10" height="1.3"/>
    <rect x="280" y="414.7" width="10" height="1.3"/>
  </g>
  <text x="18" y="436" font-size="12" fill="currentColor">정착 7.5 s — 포화 중 적분 0, 같은 눈금</text>
</svg>
<figcaption>같은 PID · 같은 스로틀 상한 0.65 — 포화 중에도 적분을 쌓으면 목표를 지나 30.53 m까지 솟고 16.3초 만에 정착하지만, 포화 중 적분을 멈추면(clamping) 21.09 m · 7.5초로 끝난다</figcaption>
</figure>

**적분 와인드업(integral windup).** 모터 명령에는 상한이 있습니다. 위 ②에서는 스로틀 상한이 0.65라 기체가 최대로 올라가도 목표에 늦게 닿습니다. 그동안 오차는 계속 남고, I 항은 그 오차를 계속 쌓습니다. 목표에 닿을 무렵에는 적분값이 너무 커져서, 그것이 다시 빠질 때까지 기체가 **10 m 넘게 더 솟구칩니다(30.5 m).** 해결책은 **포화 중에는 포화를 더 깊게 만드는 쪽으로 적분하지 않는 것**(clamping anti-windup)입니다. 이 한 줄로 최고 고도가 21.1 m로 줄고 정착 시간도 절반 이하가 됩니다. 실제 FC는 이 밖에도 적분 상한, 이륙 전 적분 리셋 같은 장치를 함께 씁니다.

**미분 항의 두 함정.** 첫째는 **미분 킥(derivative kick)** 입니다. 오차를 미분하면 목표가 계단처럼 바뀌는 순간 오차가 한 스텝 만에 크게 변해, D 항이 한 번 크게 튑니다. ③에서 스로틀이 상한 1.00까지 튄 것이 그것입니다. 목표는 보통 갑자기 바뀌지만 기체 상태는 연속적이므로, **오차 대신 측정값을 미분**하면 이 튐이 사라집니다(0.90 — P 항만 반응). 둘째는 **노이즈 증폭**입니다. 미분은 빠른 변화를 키우는 연산이라, 고도에 2 cm짜리 잡음만 있어도 250 Hz로 미분하면 스로틀이 0.4 표준편차로, 사실상 0~1 상·하한 사이를 오가며 요동칩니다. 그래서 D 항에는 거의 항상 **저역 통과 필터**를 붙입니다(각속도 루프 D 항의 예로 PX4의 `IMU_DGYRO_CUTOFF`, ArduPilot의 `ATC_RAT_*_FLTD`). 필터를 붙이면 흔들림이 줄지만 0.059도 여전히 큽니다. 그래서 실제 FC는 고도를 미분하지 않습니다. **EKF가 추정한 수직 속도를 따로 받아 속도 루프를 하나 더 둡니다.** 다음 절의 캐스케이드가 그 구조입니다.

**루프 지연.** 제어기는 측정이 늦게 올수록 "이미 지나간 상태"에 반응합니다. ④에서 같은 이득에 측정 지연만 늘리면, 지연 200 ms에서 오버슈트가 커지고 300 ms에서는 아예 정착하지 못하고 출렁입니다. 빠른 루프일수록 지연에 민감합니다. 그래서 가장 안쪽 루프는 자이로 값을 **추정기를 거치지 않고 필터만 거쳐** 바로 씁니다. 3단계에서 본 **진동과 필터 설정**이 제어 성능의 상한을 정하는 이유도 여기에 있습니다. 필터를 세게 걸수록 노이즈는 줄지만 지연이 늘기 때문입니다.

## 2. 캐스케이드 제어 구조

### 2.1 왜 겹겹이 쌓는가

멀티콥터의 물리 사슬을 거꾸로 따라가 보면 캐스케이드 구조가 자연스럽게 나옵니다(2단계 비행 역학 참고).

- **모터 추력 차이** → 토크 → **각가속도** → 적분하면 **각속도** → 적분하면 **자세(기울기)**
- **기울기** → 추력의 수평 성분 → **수평 가속도** → 적분하면 **속도** → 적분하면 **위치**

명령에서 위치까지 적분이 네 번 들어 있습니다. 한 개의 PID로 "모터 차이 → 위치"를 한 번에 다루기는 어렵습니다. 대신 **적분 하나마다 루프 하나**를 두고, 바깥 루프의 출력을 안쪽 루프의 목표값으로 넘깁니다.

```text
위치 목표 ─[위치 P]→ 속도 목표 ─[속도 PID]→ 가속도 목표 = 기울기 목표
        ─[자세 P]→ 각속도 목표 ─[각속도 PID]→ 토크 ─[믹서]→ 모터 4개
```

이 구조가 동작하는 핵심 조건은 **시간 척도의 분리**입니다. 안쪽 루프가 바깥 루프보다 충분히(대략 수 배 이상) 빨라야 합니다. 그래야 바깥 루프 입장에서 안쪽 루프가 "명령하면 곧바로 따라오는 장치"처럼 보이고, 바깥 루프는 자기 한 단계 물리만 신경 쓰면 됩니다. 덤으로 각 층에 **제한**을 걸 수 있습니다. 위치 루프의 출력에 최대 속도를, 속도 루프의 출력에 최대 기울기를, 자세 루프의 출력에 최대 각속도를 걸면, 큰 명령이 와도 기체가 안전한 범위 안에서 움직입니다.

### 2.2 PX4와 ArduPilot의 실제 구성

두 오토파일럿 모두 같은 뼈대를 씁니다. 바깥쪽 위치·자세 루프는 주로 **P**만 씁니다. 안쪽의 속도·각속도 루프는 **PID**(와 피드포워드)를 씁니다.

| 루프 | 입력 → 출력 | 제어기 | 반응 속도(대략) | PX4 파라미터 | ArduPilot 파라미터 |
| --- | --- | --- | --- | --- | --- |
| 위치 | 위치 오차 → 속도 목표 | P | 초 단위 | `MPC_XY_P`, `MPC_Z_P` | `PSC_POSXY_P`, `PSC_POSZ_P` ※ |
| 속도 | 속도 오차 → 가속도(기울기·추력) 목표 | PID | 수백 ms~초 | `MPC_XY_VEL_*_ACC`, `MPC_Z_VEL_*_ACC` | `PSC_VELXY_*`, `PSC_VELZ_P`, `PSC_ACCZ_*` |
| 자세 | 자세 오차 → 각속도 목표 | P | 수백 ms | `MC_ROLL_P`, `MC_PITCH_P`, `MC_YAW_P` | `ATC_ANG_RLL_P`, `ATC_ANG_PIT_P`, `ATC_ANG_YAW_P` |
| 각속도 | 각속도 오차 → 토크 명령 | PID + FF | 수십 ms | `MC_ROLLRATE_P/I/D` 등 | `ATC_RAT_RLL_P/I/D/FF` 등 |

※ ArduPilot 파라미터 이름은 4.6 이하 기준입니다. 이후 버전에서 위치 제어기 파라미터가 개명될 수 있으니, 쓰는 버전의 파라미터 목록에서 확인합니다.

반응 속도 열은 실행 주기가 아니라 **튜닝된 응답의 빠르기**입니다. 실행 주기는 기체와 설정마다 다릅니다. ArduCopter는 메인 루프(기본 400 Hz)에서 여러 루프를 함께 돌리고, PX4의 각속도 루프는 자이로가 들어오는 대로 돕니다. 어느 쪽이든 원칙은 같습니다. **안쪽이 더 빠르게 반응하도록 튜닝합니다.** 실제 구현은 이 표보다 정교합니다. 자세 오차는 쿼터니언으로 계산하고(2단계), ArduPilot은 P 대신 큰 오차에서 완만해지는 square-root 제어기를 쓰며, 둘 다 목표값 자체를 부드럽게 만드는 가감속 제한(jerk·가속도 제한)을 앞단에 둡니다.

### 2.3 고도(수직) 제어는 따로 간다

멀티콥터에서 수평과 수직은 쓰는 "손잡이"가 다릅니다. 수평은 **기울기**로, 수직은 네 모터의 **총 추력(collective thrust)** 으로 움직입니다. 그래서 위치·속도 루프는 수평(XY)과 수직(Z)으로 나뉘고, 파라미터도 `MPC_XY_*`와 `MPC_Z_*`, `PSC_*XY*`와 `PSC_*Z*`로 따로 있습니다.

수직 루프에는 두 가지 보정이 더 붙습니다.

- **호버 추력 피드포워드**: 1.3절의 실험처럼 호버 스로틀을 기본값으로 깔고, 루프는 그 차이만 다룹니다(`MPC_THR_HOVER` / `MOT_THST_HOVER`).
- **기울기 보상**: 기체가 θ만큼 기울면 추력의 수직 성분이 `cos θ`배로 줄어듭니다. 20° 기울이면 약 6%, 35°면 약 18%가 줄어듭니다. 그래서 수평으로 가속할 때 총 추력을 `1/cos θ`배로 올려 고도를 유지합니다. 기울기 상한(`MPC_TILTMAX_AIR`, `ANGLE_MAX`)이 필요한 이유 중 하나도 이것입니다. 너무 기울면 고도를 지킬 추력이 남지 않습니다.

### 2.4 코드: 한 축 캐스케이드

수평 한 축(x, 피치)만 떼어 낸 4단 캐스케이드입니다. 각속도 루프는 1 kHz, 자세 루프는 250 Hz, 속도·위치 루프는 50 Hz로 돌려 실제 FC의 다중 주기 구조를 흉내 냈습니다. 단순화를 위해 각속도 루프는 P만 쓰고, 자세는 쿼터니언 대신 피치각 하나로 다룹니다.

```python
import numpy as np

G, DT = 9.81, 0.001          # 시뮬레이션 1 kHz
TAU_MOTOR = 0.02             # 모터 응답 지연 [s]
DRAG = 0.3                   # 공기 저항 [1/s]
MAX_TILT = np.radians(35)

def fly(x_sp=10.0, t_end=12.0, wind=0.0, rate_kp=20.0, att_kp=6.0,
        vel_kp=1.8, vel_ki=0.6, pos_kp=0.95, start=None, mode="position"):
    """한 축(x, 피치)만 떼어 낸 4단 캐스케이드: 위치 → 속도 → 자세 → 각속도"""
    x = v = th = om = alpha = 0.0
    v_sp = th_sp = om_sp = 0.0
    vi = 0.0
    if start: th_sp, om_sp, v_sp = start.get("th", 0.0), start.get("om", 0.0), start.get("v", 0.0)
    log = []
    for k in range(int(t_end / DT)):
        t = k * DT
        if k % 20 == 0 and mode == "position":        # 50 Hz 위치·속도 루프
            v_sp = np.clip(pos_kp * (x_sp - x), -5, 5)
        if k % 20 == 0 and mode in ("position", "velocity"):
            ev = v_sp - v
            vi += ev * 0.02
            a_sp = vel_kp * ev + vel_ki * vi
            th_sp = np.clip(np.arctan2(a_sp, G), -MAX_TILT, MAX_TILT)
        if k % 4 == 0 and mode != "rate":            # 250 Hz 자세 루프
            om_sp = att_kp * (th_sp - th)
        alpha_cmd = rate_kp * (om_sp - om)           # 1 kHz 각속도 루프 (P만)
        alpha += (alpha_cmd - alpha) * DT / TAU_MOTOR
        om += alpha * DT
        th += om * DT
        v += (G * np.tan(th) + wind - DRAG * v) * DT
        x += v * DT
        log.append((t, x, v, th, om))
    return np.array(log)

def rise(t, y, target):
    """목표의 10% → 90%에 걸린 시간"""
    i10 = np.argmax(y >= 0.1 * target); i90 = np.argmax(y >= 0.9 * target)
    return t[i90] - t[i10]

print("① 안쪽부터 튜닝: 루프마다 계단 응답의 상승 시간(10→90%)")
L = fly(mode="rate", t_end=0.5, start={"om": 1.0});          print(f"  각속도 루프 : {rise(L[:,0], L[:,4], 1.0)*1000:5.0f} ms")
L = fly(mode="attitude", t_end=2.0, start={"th": 0.2});     print(f"  자세 루프   : {rise(L[:,0], L[:,3], 0.2)*1000:5.0f} ms")
L = fly(mode="velocity", t_end=5.0, start={"v": 2.0});      print(f"  속도 루프   : {rise(L[:,0], L[:,2], 2.0)*1000:5.0f} ms")
L = fly();                                                  print(f"  위치 루프   : {rise(L[:,0], L[:,1], 10.0)*1000:5.0f} ms (10 m 이동)")
print(f"  10 m 이동 최대 오버슈트 {L[:,1].max()-10:.2f} m, 12초 뒤 오차 {10-L[-1,1]:+.3f} m")

print("\n② 맞바람 1 m/s² 속에서 제자리 유지(목표 x=0)")
for ki in (0.0, 0.6):
    L = fly(x_sp=0.0, wind=-1.0, vel_ki=ki, t_end=20.0)
    print(f"  속도 루프 {'P ' if ki == 0 else 'PI'}: 위치 오차 {L[-1,1]:+.2f} m, 기체 기울기 {np.degrees(L[-1,3]):+.1f}°")

print("\n③ 바깥 이득은 그대로 두고 각속도 루프만 느리게 만들면(자세 이득 att_kp=6)")
for rk in (20.0, 4.0, 2.5, 2.0):
    L = fly(rate_kp=rk, t_end=15.0)
    tail = L[L[:,0] > 10.0]
    print(f"  rate_kp={rk:4.1f}: 최대 위치 {L[:,1].max():5.2f} m | 10~15초 위치 흔들림 폭 {np.ptp(tail[:,1]):6.3f} m")
# ① 안쪽부터 튜닝: 루프마다 계단 응답의 상승 시간(10→90%)
#   각속도 루프 :    77 ms
#   자세 루프   :   239 ms
#   속도 루프   :   778 ms
#   위치 루프   :  1773 ms (10 m 이동)
#   10 m 이동 최대 오버슈트 0.47 m, 12초 뒤 오차 -0.002 m
#
# ② 맞바람 1 m/s² 속에서 제자리 유지(목표 x=0)
#   속도 루프 P : 위치 오차 -0.58 m, 기체 기울기 +5.8°
#   속도 루프 PI: 위치 오차 -0.00 m, 기체 기울기 +5.8°
#
# ③ 바깥 이득은 그대로 두고 각속도 루프만 느리게 만들면(자세 이득 att_kp=6)
#   rate_kp=20.0: 최대 위치 10.47 m | 10~15초 위치 흔들림 폭  0.004 m
#   rate_kp= 4.0: 최대 위치 10.33 m | 10~15초 위치 흔들림 폭  0.004 m
#   rate_kp= 2.5: 최대 위치 10.46 m | 10~15초 위치 흔들림 폭  0.342 m
#   rate_kp= 2.0: 최대 위치 21.90 m | 10~15초 위치 흔들림 폭 23.816 m
```

<figure class="post-figure">
<svg role="img" aria-label="시간 척도의 분리. 위에서 아래로 위치, 속도, 자세, 각속도 네 칸의 사다리가 있고, 각 칸 옆에 계단 응답 상승 시간(10에서 90%)을 비례 막대로 그렸다. 위치 1773 ms, 속도 778 ms, 자세 239 ms, 각속도 77 ms로, 바깥으로 갈수록 약 2.3~3.3배씩 느려진다. 아래 상자는 바깥 이득은 그대로 두고 각속도 루프만 느리게 한 결과다. rate_kp 20과 4는 안정으로 흔들림 0.004 m, 2.5는 출렁임으로 흔들림 0.34 m, 2.0은 발산으로 최대 위치 21.9 m. 안쪽과 바깥의 시간 척도가 가까워지면 흔들리고 무너진다." viewBox="0 0 320 418" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>시간 척도의 분리 — 77 ms → 239 ms → 778 ms → 1773 ms</title>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">시간 척도의 분리</text>
  <text x="160" y="42" text-anchor="middle" font-size="12" fill="var(--text-light)">계단 응답 상승 시간 (10 → 90%)</text>
  <!-- ladder rungs -->
  <g fill="var(--bg-light)" stroke="currentColor" stroke-width="2">
    <rect x="8" y="56" width="70" height="40" rx="4"/>
    <rect x="8" y="104" width="70" height="40" rx="4"/>
    <rect x="8" y="152" width="70" height="40" rx="4"/>
    <rect x="8" y="200" width="70" height="40" rx="4"/>
  </g>
  <g text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">
    <text x="43" y="81">위치</text>
    <text x="43" y="129">속도</text>
    <text x="43" y="177">자세</text>
    <text x="43" y="225">각속도</text>
  </g>
  <!-- proportional bars: 160 px = 1773 ms -->
  <g fill="var(--secondary-color)">
    <rect x="88" y="69" width="160" height="14"/>
    <rect x="88" y="117" width="70.2" height="14"/>
    <rect x="88" y="165" width="21.6" height="14"/>
  </g>
  <rect x="88" y="213" width="6.9" height="14" fill="var(--accent-color)"/>
  <g font-size="12" font-weight="700" fill="currentColor">
    <text x="254" y="81">1773 ms</text>
    <text x="164" y="129">778 ms</text>
    <text x="116" y="177">239 ms</text>
    <text x="101" y="225">77 ms</text>
  </g>
  <text x="160" y="262" text-anchor="middle" font-size="12" fill="currentColor">바깥으로 갈수록 약 2.3~3.3배씩 느려짐</text>
  <!-- result ③ -->
  <rect x="8" y="276" width="304" height="134" rx="6" fill="none" stroke="var(--text-light)" stroke-width="1.2"/>
  <text x="18" y="297" font-size="13" font-weight="700" fill="currentColor">③ 각속도 루프만 느리게 하면</text>
  <g font-size="12" fill="currentColor">
    <text x="18" y="322">rate_kp 20 · 4</text>
    <text x="18" y="346">rate_kp 2.5</text>
    <text x="18" y="370">rate_kp 2.0</text>
  </g>
  <g font-size="12" font-weight="700" text-anchor="end">
    <text x="302" y="322" fill="var(--secondary-color)">안정 · 흔들림 0.004 m</text>
    <text x="302" y="346" fill="currentColor">출렁임 · 흔들림 0.34 m</text>
    <text x="302" y="370" fill="var(--accent-color)">발산 · 최대 21.9 m</text>
  </g>
  <text x="160" y="397" text-anchor="middle" font-size="13" font-weight="700" fill="var(--accent-color)">시간 척도가 가까워지면 흔들리고 무너진다</text>
</svg>
<figcaption>안쪽부터 튜닝한 4단 캐스케이드의 상승 시간은 77 → 239 → 778 → 1773 ms로 바깥으로 갈수록 몇 배씩 느려진다 — 각속도 루프만 느리게 만들면 바깥 이득이 그대로여도 출렁이다(2.5) 발산한다(2.0)</figcaption>
</figure>

세 결과는 각각 캐스케이드의 원리 하나씩을 보여 줍니다.

- **① 시간 척도의 분리.** 상승 시간이 안쪽에서 바깥으로 77 ms → 239 ms → 778 ms → 1773 ms로, 약 2.3~3.3배씩 느려집니다. 각 루프는 자기 안쪽 루프가 이미 목표를 따라온다고 가정하고 튜닝되었습니다. 그래서 10 m 이동이 0.47 m 오버슈트로 깔끔하게 끝납니다.
- **② 적분은 외란이 들어오는 층에.** 일정한 바람은 **가속도** 외란입니다. 속도 루프가 P만 쓰면, 바람을 버티는 데 필요한 기울기(5.8°)를 만들려고 속도 오차가 남고, 그 속도 오차를 만들려고 다시 위치 오차(0.58 m)가 남습니다. 속도 루프에 I를 넣으면 같은 5.8° 기울기를 적분값이 대신 쥐고 있어 위치 오차가 0이 됩니다. 바깥 위치 루프는 P만으로 충분합니다.
- **③ 안쪽이 무너지면 전부 무너진다.** 바깥 이득은 그대로 두고 각속도 루프만 느리게 하면, 두 루프의 시간 척도가 점점 가까워집니다. 처음에는 감쇠만 조금 줄다가(4.0), 더 가까워지면 출렁이기 시작하고(2.5), 결국 발산합니다(2.0). 바깥 루프에는 아무 문제가 없어도 그렇습니다. 프롭이 손상되거나 배터리가 처져 **안쪽 루프의 실제 반응이 느려지면** 위치 제어까지 흔들리는 이유가 이것입니다.

### 2.5 튜닝 순서와 로그로 보는 응답

③이 그대로 튜닝 순서를 알려 줍니다. **안쪽부터 바깥으로** 맞춥니다.

1. **필터**: 진동 스펙트럼을 보고 자이로·D 항 필터를 정합니다(3단계의 진동 이야기).
2. **각속도 루프**: 기체가 가장 빠르고 깨끗하게 각속도 명령을 따라오도록 P·D·I를 맞춥니다. 대부분의 튜닝 노력이 여기에 들어갑니다.
3. **자세 루프**: P 하나로 각속도 목표를 만들어 자세를 따라오게 합니다.
4. **속도 → 위치 루프**: 기본값이 잘 맞는 경우가 많습니다. 바람 속 위치 유지와 웨이포인트 추종을 보며 조정합니다.

손 튜닝이 부담스러우면 자동 튜닝을 씁니다. PX4는 **Autotune**(비행 중 각 축에 신호를 넣어 모델을 추정하고 이득을 계산)을, ArduPilot은 **AUTOTUNE 비행 모드**(축마다 기체를 흔들어 각속도·자세 이득을 맞춤)를 제공합니다. 둘 다 각속도·자세 루프가 대상입니다.

튜닝의 결과는 **로그의 "목표값 vs 실제 값" 그래프**로 확인합니다. PX4 로그(ULog)를 Flight Review에 올리면 롤·피치·요 각속도와 자세의 목표·실제 그래프가 나옵니다. ArduPilot 로그(DataFlash)에서는 `RATE`·`ATT` 메시지에서 `RDes`·`DesRoll`처럼 `Des`가 붙은 목표 필드와 실제 값을 비교합니다. 읽는 법은 단순합니다.

| 그래프 모양 | 의미 | 주로 손댈 곳 |
| --- | --- | --- |
| 실제 값이 목표를 늦게, 둔하게 따라옴 | 이득 부족 | 해당 루프의 P (또는 FF) |
| 목표를 넘었다가 몇 번 출렁이며 맞춤 | 감쇠 부족 | D 증가 또는 P 감소 |
| 빠르고 잔잔한 떨림이 계속됨 | 이득 과다 또는 노이즈 | D·필터, 진동 원인 |
| 목표와 꾸준히 한쪽으로 어긋남 | 정상상태 오차 | I, 무게중심·호버 추력 |

통제 앱 입장에서는 이 그래프가 **"기체가 명령을 제대로 따르고 있는가"를 판단하는 근거**입니다. 바람 속에서 자세 목표가 계속 상한(기울기 최대)에 붙어 있다면, 제어기는 정상인데 기체가 바람을 이기지 못하고 있는 것입니다.

## 3. 비행 모드 — 목표값을 넣는 층 고르기

### 3.1 모드는 "누가 어느 층을 쥐는가"

비행 모드의 이름은 많지만, 제어 관점에서 차이는 하나입니다. **조종기 스틱이나 자동 비행 로직이 캐스케이드의 어느 층에 목표값을 넣는가**입니다. 그보다 안쪽 층은 모두 FC가 알아서 돌립니다.

| 모드 계열 | 목표가 들어가는 층 | 스틱의 의미 | 필요한 추정 |
| --- | --- | --- | --- |
| Acro | 각속도 | 스틱 = 회전 속도, 놓아도 수평으로 안 돌아옴 | 자이로 |
| Stabilized (Manual) | 자세 | 스틱 = 기울기 각, 놓으면 수평. 스로틀 = 총 추력 | + 자세 |
| Altitude | 자세 + 수직 속도 | 수평은 기울기, 스로틀 스틱 = 상승·하강 속도(중앙이면 고도 유지) | + 고도 |
| Position | 속도(→위치) | 스틱 = 수평·수직 속도, 놓으면 그 자리에 정지·유지 | + 위치(GNSS 등) |
| Mission · Hold · RTL · Land | 위치 | 스틱 없음. 경로·웨이포인트가 위치 목표를 만듦 | + 위치 |

<figure class="post-figure">
<svg role="img" aria-label="모드 사다리. 왼쪽에 캐스케이드 네 층이 위에서 아래로 위치, 속도, 자세, 각속도 순으로 쌓여 있고, 가운데 모드 칩이 각 층에 목표값을 넣는다. 위치 층에는 Mission, Hold, RTL, Land. 속도 층에는 Position이며, 스틱이 중립이면 점선 화살표처럼 위치 층으로 제자리를 유지한다. 자세 층에는 Stabilized와 Altitude가 들어가는데 Altitude의 수직 축은 속도로 제어된다. 각속도 층에는 Acro. 오른쪽 세로 띠는 필요한 추정으로, 아래에서 위로 자이로, 자세, 고도, 위치 순으로 늘어난다. 위로 갈수록 자동, 아래로 갈수록 수동이며, 추정이 무너지면 아래 모드로 내려간다." viewBox="0 0 320 356" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>모드 사다리 — 비행 모드가 목표를 넣는 캐스케이드 층과 필요한 추정</title>
  <defs>
    <marker id="fc-md-arrow-acc" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-color)"/>
    </marker>
    <marker id="fc-md-arrow-sec" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">모드 사다리 — 목표를 넣는 층</text>
  <g text-anchor="middle" font-size="12" fill="var(--text-light)">
    <text x="46" y="45">제어 층</text>
    <text x="180" y="45">모드</text>
    <text x="291" y="45">필요 추정</text>
  </g>
  <!-- cascade layers -->
  <g fill="var(--bg-light)" stroke="currentColor" stroke-width="2">
    <rect x="8" y="54" width="76" height="48" rx="4"/>
    <rect x="8" y="112" width="76" height="48" rx="4"/>
    <rect x="8" y="170" width="76" height="48" rx="4"/>
    <rect x="8" y="228" width="76" height="48" rx="4"/>
  </g>
  <g text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">
    <text x="46" y="83">위치</text>
    <text x="46" y="141">속도</text>
    <text x="46" y="199">자세</text>
    <text x="46" y="257">각속도</text>
  </g>
  <!-- mode chips -->
  <g fill="var(--bg-panel)" stroke="var(--accent-color)" stroke-width="2">
    <rect x="104" y="54" width="152" height="48" rx="4"/>
    <rect x="104" y="112" width="152" height="48" rx="4"/>
    <rect x="104" y="170" width="152" height="48" rx="4"/>
    <rect x="104" y="228" width="152" height="48" rx="4"/>
  </g>
  <g text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">
    <text x="180" y="74">Mission · Hold</text>
    <text x="180" y="91">RTL · Land</text>
    <text x="180" y="132">Position</text>
    <text x="180" y="190">Stabilized</text>
    <text x="180" y="207">Altitude ※</text>
    <text x="180" y="257">Acro</text>
  </g>
  <text x="180" y="149" text-anchor="middle" font-size="12" fill="var(--text-light)">중립 → 위치 유지</text>
  <g stroke="var(--accent-color)" stroke-width="2">
    <line x1="103" y1="72" x2="86" y2="72" marker-end="url(#fc-md-arrow-acc)"/>
    <line x1="103" y1="146" x2="86" y2="146" marker-end="url(#fc-md-arrow-acc)"/>
    <line x1="103" y1="194" x2="86" y2="194" marker-end="url(#fc-md-arrow-acc)"/>
    <line x1="103" y1="252" x2="86" y2="252" marker-end="url(#fc-md-arrow-acc)"/>
  </g>
  <polyline points="103,124 94,124 94,90 87,90" fill="none" stroke="var(--accent-color)" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#fc-md-arrow-acc)"/>
  <!-- required estimation strip -->
  <rect x="268" y="54" width="46" height="222" rx="4" fill="var(--bg-light)" stroke="var(--text-light)" stroke-width="1"/>
  <g text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">
    <text x="291" y="83">+위치</text>
    <text x="291" y="141">+고도</text>
    <text x="291" y="199">+자세</text>
    <text x="291" y="257">자이로</text>
  </g>
  <g stroke="var(--secondary-color)" stroke-width="1.5">
    <line x1="291" y1="242" x2="291" y2="206" marker-end="url(#fc-md-arrow-sec)"/>
    <line x1="291" y1="184" x2="291" y2="148" marker-end="url(#fc-md-arrow-sec)"/>
    <line x1="291" y1="126" x2="291" y2="90" marker-end="url(#fc-md-arrow-sec)"/>
  </g>
  <g text-anchor="middle" font-size="12" fill="currentColor">
    <text x="160" y="302" font-weight="700">위로 갈수록 자동, 아래로 갈수록 수동</text>
    <text x="160" y="320">추정이 무너지면 아래 모드로 내려간다</text>
  </g>
  <text x="160" y="344" text-anchor="middle" font-size="12" fill="var(--text-light)">※ Altitude: 수평은 자세, 수직은 속도</text>
</svg>
<figcaption>비행 모드는 캐스케이드의 어느 층에 목표값을 넣느냐로 갈린다 — 위쪽 모드일수록 조종사가 할 일은 줄지만 FC가 믿어야 할 추정이 늘어나므로, 페일세이프는 추정이 무너지면 더 안쪽 층을 쥐는 모드로 내려간다</figcaption>
</figure>

표를 세로로 읽으면 두 가지가 보입니다. 위쪽 모드일수록 **조종사가 할 일이 줄지만, FC가 믿어야 할 추정이 늘어납니다.** Position 모드는 GNSS 위치 추정이 무너지면 쓸 수 없습니다. 그래서 페일세이프는 대개 **추정이 무너지면 더 안쪽 층을 쥐는 모드로 내려가는** 방향으로 설계됩니다. 예를 들어 PX4는 Position 모드에서 위치 추정을 잃으면 Altitude 모드로 내려갑니다. ArduPilot은 EKF 페일세이프 설정에 따라 착륙하거나 ALT_HOLD로 바꿉니다(9단계 주제).

### 3.2 PX4 ↔ ArduPilot 모드 대응표

두 펌웨어는 같은 개념에 다른 이름을 씁니다. 통제 앱이 둘 다 지원하려면 이 대응을 데이터로 들고 있어야 합니다. 아래는 멀티콥터(ArduCopter) 기준이며, 이름이 대응해도 세부 동작은 다를 수 있습니다.

| PX4 모드 | PX4 `custom_mode` (main / sub) | ArduCopter 모드 (번호) | 비고 |
| --- | --- | --- | --- |
| Manual / Stabilized | MANUAL 1 · STABILIZED 7 | STABILIZE (0) | PX4 멀티콥터에서는 둘 다 자세 안정화 동작 |
| Acro | ACRO 5 | ACRO (1) | |
| Altitude | ALTCTL 2 | ALT_HOLD (2) | |
| Position | POSCTL 3 | LOITER (5), POSHOLD (16) | LOITER는 스틱을 속도·가속도 목표로 다루고 놓으면 그 자리 유지, POSHOLD는 스틱 입력 중엔 기울기 제어에 가까움 |
| Mission | AUTO 4 / MISSION 4 | AUTO (3) | |
| Hold | AUTO 4 / LOITER 3 | BRAKE (17), GUIDED (4) | PX4 Hold는 자동 제자리 유지. ArduPilot엔 1:1 대응이 없음 |
| Return | AUTO 4 / RTL 5 | RTL (6), SMART_RTL (21) | SMART_RTL은 온 길을 되짚어 귀환 |
| Land | AUTO 4 / LAND 6 | LAND (9) | |
| Takeoff | AUTO 4 / TAKEOFF 2 | — (GUIDED에서 이륙 명령) | ArduCopter는 별도 Takeoff 모드 없이 GUIDED·AUTO에서 이륙 |
| Offboard | OFFBOARD 6 | GUIDED (4), GUIDED_NOGPS (20) | 외부(앱·컴패니언)가 목표를 직접 보냄. 3.4절 |

### 3.3 MAVLink로 모드를 읽고 바꾸기

현재 모드는 1초마다 오는 `HEARTBEAT`의 `custom_mode` 필드에 들어 있습니다. 문제는 **이 숫자의 해석이 펌웨어마다 다르다**는 점입니다. ArduPilot은 위 표의 모드 번호를 그대로 넣습니다. PX4는 32비트 안에 main mode와 sub mode를 나눠 넣습니다. 그래서 앱은 `HEARTBEAT.autopilot` 필드(`MAV_AUTOPILOT_PX4` = 12, `MAV_AUTOPILOT_ARDUPILOTMEGA` = 3)로 펌웨어를 먼저 확인하고, 그에 맞는 해석기를 골라야 합니다.

```python
# PX4: custom_mode = main_mode << 16 | sub_mode << 24   (px4_custom_mode.h)
PX4_MAIN = {"MANUAL": 1, "ALTCTL": 2, "POSCTL": 3, "AUTO": 4,
            "ACRO": 5, "OFFBOARD": 6, "STABILIZED": 7}
PX4_AUTO_SUB = {"READY": 1, "TAKEOFF": 2, "LOITER": 3, "MISSION": 4,
                "RTL": 5, "LAND": 6}
# ArduCopter: custom_mode = 모드 번호 그대로
COPTER = {0: "STABILIZE", 1: "ACRO", 2: "ALT_HOLD", 3: "AUTO", 4: "GUIDED",
          5: "LOITER", 6: "RTL", 9: "LAND", 16: "POSHOLD", 17: "BRAKE", 21: "SMART_RTL"}

def px4_custom_mode(main, sub=None):
    return PX4_MAIN[main] << 16 | (PX4_AUTO_SUB[sub] << 24 if sub else 0)

def px4_decode(custom_mode):
    main = (custom_mode >> 16) & 0xFF
    sub = (custom_mode >> 24) & 0xFF
    name = {v: k for k, v in PX4_MAIN.items()}[main]
    if main == PX4_MAIN["AUTO"]:
        name += "." + {v: k for k, v in PX4_AUTO_SUB.items()}[sub]
    return name

for main, sub in [("POSCTL", None), ("AUTO", "MISSION"), ("AUTO", "RTL"), ("OFFBOARD", None)]:
    cm = px4_custom_mode(main, sub)
    print(f"PX4 {main + ('.' + sub if sub else ''):<14} custom_mode = {cm:>10} (0x{cm:08X}) → {px4_decode(cm)}")
print(f"ArduCopter HEARTBEAT custom_mode 5 → {COPTER[5]}, 6 → {COPTER[6]}")

# 모드 변경 명령: MAV_CMD_DO_SET_MODE(176)
MAV_MODE_FLAG_CUSTOM_MODE_ENABLED = 1
print("\nCOMMAND_LONG 176 파라미터")
print("  PX4 Return  :", [MAV_MODE_FLAG_CUSTOM_MODE_ENABLED, PX4_MAIN["AUTO"], PX4_AUTO_SUB["RTL"]])
print("  ArduCopter RTL:", [MAV_MODE_FLAG_CUSTOM_MODE_ENABLED, 6, 0])
# PX4 POSCTL         custom_mode =     196608 (0x00030000) → POSCTL
# PX4 AUTO.MISSION   custom_mode =   67371008 (0x04040000) → AUTO.MISSION
# PX4 AUTO.RTL       custom_mode =   84148224 (0x05040000) → AUTO.RTL
# PX4 OFFBOARD       custom_mode =     393216 (0x00060000) → OFFBOARD
# ArduCopter HEARTBEAT custom_mode 5 → LOITER, 6 → RTL
#
# COMMAND_LONG 176 파라미터
#   PX4 Return  : [1, 4, 5]
#   ArduCopter RTL: [1, 6, 0]
```

모드 변경은 `COMMAND_LONG`으로 `MAV_CMD_DO_SET_MODE`(176)를 보냅니다. param1에는 "custom mode를 쓴다"는 플래그(1)를 넣습니다. param2·3에는 PX4라면 main·sub mode를, ArduPilot이라면 모드 번호를 넣습니다. 그리고 반드시 `COMMAND_ACK`를 확인합니다. **모드 변경은 거부될 수 있습니다.** 위치 추정이 없는데 Position이나 Mission을 요청하면 FC가 거절합니다. 앱은 ACK 결과와 그 다음 `HEARTBEAT`의 실제 모드를 보고 화면을 갱신해야 합니다. 버튼을 눌렀다고 모드가 바뀌었다고 표시하면 안 됩니다.

실무에서는 이 인코딩을 직접 다루기보다 라이브러리를 씁니다. pymavlink는 펌웨어별 모드 이름 표(`mode_mapping()`)와 `set_mode()`를 제공합니다. MAVSDK는 `action.return_to_launch()`, `mission.start_mission()`, `offboard.start()`처럼 **의도 단위의 API** 뒤에 모드 전환을 숨깁니다. 최근 MAVLink에는 펌웨어마다 다른 모드 번호를 표준 모드(`MAV_STANDARD_MODE`)와 `AVAILABLE_MODES` 메시지로 통일하려는 작업도 진행 중입니다. 다만 지원 여부가 펌웨어 버전마다 다르니, 앱은 당분간 펌웨어별 대응표를 함께 들고 있는 편이 안전합니다. 메시지와 명령 프로토콜의 세부는 8단계에서 다룹니다.

### 3.4 앱이 직접 목표를 넣을 때: Offboard · Guided

통제 앱이 미션 업로드를 넘어 기체를 실시간으로 움직이려면 PX4 **Offboard** 또는 ArduPilot **Guided** 모드를 씁니다. 이때 앱은 사실상 **캐스케이드의 바깥 루프 역할**을 맡습니다. 어느 층에 목표를 넣을지도 앱이 고릅니다.

- `SET_POSITION_TARGET_LOCAL_NED`: 위치·속도·가속도 목표(로컬 NED, 2단계의 좌표 규약 그대로 — `vz`는 **아래가 +**)
- `SET_POSITION_TARGET_GLOBAL_INT`: 위경도·고도 기준 목표(4단계의 고도 기준 주의)
- `SET_ATTITUDE_TARGET`: 자세(쿼터니언)·각속도와 총 추력 — 가장 안쪽까지 앱이 쥐는 경우

`SET_POSITION_TARGET_*`의 `type_mask`는 **무시할 필드**를 비트로 고릅니다. 비트가 켜진 필드는 쓰지 않는다는 뜻이라, 처음 보면 반대로 읽기 쉽습니다.

```python
# SET_POSITION_TARGET_LOCAL_NED: type_mask 비트가 "무시할 필드"를 고른다
IGNORE = {"x": 1, "y": 2, "z": 4, "vx": 8, "vy": 16, "vz": 32,
          "ax": 64, "ay": 128, "az": 256, "yaw": 1024, "yaw_rate": 2048}
def type_mask(use):
    return sum(bit for f, bit in IGNORE.items() if f not in use)
print("\ntype_mask")
print("  위치 + 요     :", type_mask({"x", "y", "z", "yaw"}))
print("  속도 + 요 속도:", type_mask({"vx", "vy", "vz", "yaw_rate"}))
# type_mask
#   위치 + 요     : 2552
#   속도 + 요 속도: 1479
```

위치만 주면 FC의 위치 루프부터 다 돌아갑니다. 속도만 주면 위치 루프를 건너뛰고 속도 루프부터 돕니다. 이때 앱이 위치 제어를 대신 하는 셈이므로, 링크 지연(7단계)이 곧 **바깥 루프의 지연**이 됩니다. 1.4절 ④에서 본 대로 지연은 루프를 흔듭니다. 그래서 앱이 직접 속도·자세를 쥐는 제어는 지연이 작은 **컴패니언 컴퓨터**(기체에 실린 보조 컴퓨터)에서 돌리는 것이 일반적입니다. 지상 앱은 위치 목표나 미션처럼 바깥 층을 쥐는 편이 안전합니다.

두 펌웨어는 목표 스트림이 끊길 때의 동작이 다릅니다.

- **PX4 Offboard**: 목표값이 **계속 흘러와야**(최소 2 Hz) 진입할 수 있고, 진입 전부터 미리 보내고 있어야 합니다. 스트림이 `COM_OF_LOSS_T` 이상 끊기면 페일세이프(`COM_OBL_RC_ACT` 등 설정에 따라 Position·Hold·RTL·Land)로 넘어갑니다.
- **ArduPilot Guided**: 위치 목표는 받은 뒤 그 지점을 유지합니다. 속도·가속도 목표는 몇 초(Copter 기준 약 3초) 갱신이 없으면 기체가 멈춥니다.

어느 쪽이든 앱은 **목표값을 일정한 주기로 보내는 별도 루프**를 가져야 합니다. UI 이벤트가 있을 때만 보내는 구조는 금방 타임아웃에 걸립니다. 10단계에서 MAVSDK로 이 구조를 직접 만듭니다.

## 4. 운용 노트

### 4.1 통제 앱에 바로 쓰이는 규칙

- **모드는 요청이지 사실이 아니다**: `COMMAND_ACK`와 다음 `HEARTBEAT`의 `custom_mode`로 실제 모드를 확인한 뒤 표시합니다.
- **모드 해석은 펌웨어별로**: `HEARTBEAT.autopilot`으로 PX4·ArduPilot을 구분하고 대응표를 데이터로 관리합니다. 같은 5라도 PX4 main mode 5는 ACRO, ArduCopter 5는 LOITER입니다.
- **목표를 넣을 층은 링크 지연에 맞춰**: 지상 앱은 위치·미션처럼 바깥 층, 컴패니언 컴퓨터는 속도·자세 층까지.
- **Offboard·Guided는 스트림으로**: 일정 주기로 목표를 보내는 루프를 두고, 끊겼을 때 기체가 어떤 모드로 넘어가는지(페일세이프 파라미터)를 앱 화면에 보여 줍니다.
- **"명령 대비 실제"를 보여 준다**: 목표 속도·기울기와 실제 값을 함께 그리면, 바람에 밀리는 상황과 제어 이상을 구분할 수 있습니다.

### 4.2 이 단계에서 다루지 않은 것

주파수 영역 설계(보드 선도·위상 여유), 루프 정형, 시스템 식별의 수학은 다루지 않았습니다. 피드포워드·입력 정형 설계, 모델 예측 제어(MPC), 비선형·적응 제어, 고정익·VTOL의 제어 구조도 Essential 범위를 넘습니다. 이 주제들은 심화 후보 `Drone-Advanced-Control`로 남겨 둡니다. 펌웨어 안에서 이 루프들이 어떤 모듈로 나뉘어 도는지는 다음 6단계와 심화 후보 `Drone-Autopilot-Internals`에서 이어집니다.

## 마무리

5단계에서 "고도 30 m 유지"가 모터 명령이 되기까지의 길을 따라갔습니다. 피드백 제어는 **오차를 계속 줄이는 방향으로 명령을 고치는 것**이고, PID의 세 항은 각각 현재(P)·과거(I)·추세(D)를 봅니다. 실제 FC에서는 **와인드업 방지, 측정값 미분과 필터, 지연 관리**가 교과서 PID만큼 중요합니다. 멀티콥터의 물리에는 적분이 네 번 들어 있어서, FC는 **위치 → 속도 → 자세 → 각속도**의 캐스케이드로 이를 풀고, **안쪽 루프가 충분히 빠르다**는 조건 위에서 안쪽부터 튜닝합니다. 그리고 비행 모드는 **이 캐스케이드의 어느 층에 목표를 넣을지 고르는 일**입니다. Offboard·Guided로 앱이 목표를 직접 넣는 것도 같은 선택입니다.

다음 단계는 이 루프들이 실제로 도는 곳, **6단계: 펌웨어 · 비행 컨트롤러**입니다. Pixhawk 계열 FC 하드웨어, PX4와 ArduPilot의 아키텍처, 그리고 앱이 다루게 될 파라미터·로그·펌웨어 업데이트를 다룹니다.

### 다음 학습

- [Drone Control Essential Curriculum](/2026/11/05/drone-control-essential-curriculum.html) — 시리즈 전체 지도와 진행률
- 직전: [GNSS · 항법 · 상태 추정](/2026/11/05/drone-gnss-navigation-estimation.html) — 제어 루프가 피드백으로 받는 추정 상태
- 다시 보기: [좌표계 · 자세 · 비행 역학](/2026/11/05/drone-frames-attitude-dynamics.html) — 캐스케이드의 물리 사슬과 믹서
- 다음: [펌웨어 · 비행 컨트롤러: PX4와 ArduPilot의 내부](/2026/11/05/drone-firmware-flight-controller.html) — FC 하드웨어·아키텍처·파라미터·로그
