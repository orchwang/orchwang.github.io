---
layout: post
title: "기체 · 센서 · 액추에이터: 드론 하드웨어의 역할과 한계"
date: 2026-11-05 00:03:00
categories: [Technology, Drone]
tags: [drone, flight-control, hardware, battery, imu, mavlink]
series: Drone-Control-Essential
published: true
excerpt: "제어와 항법은 센서가 주는 값과 액추에이터가 낼 수 있는 힘 위에서만 성립합니다. 프레임·프로펠러·BLDC 모터·ESC 신호(PWM·DShot)와 추력 대 중량비, LiPo 배터리의 C-rate·전압 강하·비행시간 추정, 그리고 IMU·자력계·기압계·GNSS·거리센서가 무엇을 재고 어떻게 틀리는지를 계산 코드와 함께 정리하고, 통제 앱이 읽어야 할 하드웨어 상태 메시지까지 연결합니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="분해한 쿼드콥터를 옆에서 본 그림. 위쪽 줄은 힘을 만드는 쪽으로 배터리, ESC, 모터, 프로펠러가 화살표로 이어진다. 가운데 그림에서 배터리는 기체 아래로, 프로펠러는 모터 위로 떼어 내어 그렸고, 팔 위에 ESC가 있다. 세상을 재는 쪽 센서는 FC 안의 IMU와 기압계, GPS 마스트 위의 GNSS와 자력계, 기체 아래에서 지면을 향하는 거리센서다. 아래쪽 줄은 센서별로 IMU는 자세, 자력계는 방위, 기압계는 고도, GNSS는 위치, 거리센서는 지면 거리를 맡는다고 정리한다." viewBox="0 0 320 416" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>쿼드콥터 하드웨어의 두 갈래 — 힘을 만드는 쪽과 세상을 재는 쪽</title>
  <defs>
    <marker id="asa-hdr-arrow-acc" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-color)"/>
    </marker>
    <marker id="asa-hdr-arrow-sec" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">드론 하드웨어를 두 갈래로 분해하면</text>
  <!-- group 1: power chain -->
  <text x="12" y="46" font-size="13" font-weight="700" fill="var(--accent-color)">힘을 만드는 쪽</text>
  <g fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="1.5">
    <rect x="8" y="54" width="64" height="26" rx="4"/>
    <rect x="88" y="54" width="64" height="26" rx="4"/>
    <rect x="168" y="54" width="64" height="26" rx="4"/>
    <rect x="248" y="54" width="64" height="26" rx="4"/>
  </g>
  <g font-size="12" font-weight="700" fill="currentColor" text-anchor="middle">
    <text x="40" y="72">배터리</text>
    <text x="120" y="72">ESC</text>
    <text x="200" y="72">모터</text>
    <text x="280" y="72">프로펠러</text>
  </g>
  <g stroke="var(--accent-color)" stroke-width="1.5">
    <line x1="73" y1="67" x2="87" y2="67" marker-end="url(#asa-hdr-arrow-acc)"/>
    <line x1="153" y1="67" x2="167" y2="67" marker-end="url(#asa-hdr-arrow-acc)"/>
    <line x1="233" y1="67" x2="247" y2="67" marker-end="url(#asa-hdr-arrow-acc)"/>
  </g>
  <!-- exploded quadcopter, side view -->
  <line x1="160" y1="126" x2="160" y2="186" stroke="currentColor" stroke-width="2"/>
  <rect x="138" y="112" width="44" height="14" rx="7" fill="var(--gold-soft)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="190" y="118" font-size="12" font-weight="700" fill="var(--secondary-color)">GNSS · 자력계</text>
  <text x="190" y="134" font-size="12" fill="var(--text-light)">GPS 마스트 위</text>
  <g fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="2">
    <ellipse cx="40" cy="150" rx="34" ry="5"/>
    <ellipse cx="280" cy="150" rx="34" ry="5"/>
  </g>
  <g stroke="var(--accent-color)" stroke-width="1.2" stroke-dasharray="3 3">
    <line x1="40" y1="156" x2="40" y2="180"/>
    <line x1="280" y1="156" x2="280" y2="180"/>
    <line x1="160" y1="222" x2="160" y2="244"/>
  </g>
  <text x="40" y="136" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent-color)">프로펠러</text>
  <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
    <line x1="40" y1="200" x2="110" y2="200"/>
    <line x1="210" y1="200" x2="280" y2="200"/>
  </g>
  <g fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2">
    <rect x="31" y="180" width="18" height="20" rx="2"/>
    <rect x="271" y="180" width="18" height="20" rx="2"/>
  </g>
  <text x="40" y="218" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent-color)">모터</text>
  <g fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="1.5">
    <rect x="64" y="204" width="34" height="18" rx="2"/>
    <rect x="222" y="204" width="34" height="18" rx="2"/>
  </g>
  <g font-size="12" font-weight="700" fill="var(--accent-color)" text-anchor="middle">
    <text x="81" y="217">ESC</text>
    <text x="239" y="217">ESC</text>
  </g>
  <rect x="110" y="186" width="100" height="36" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <text x="160" y="201" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">FC</text>
  <text x="160" y="216" text-anchor="middle" font-size="12" font-weight="700" fill="var(--secondary-color)">IMU · 기압계</text>
  <rect x="124" y="244" width="68" height="24" rx="3" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="158" y="261" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent-color)">배터리</text>
  <rect x="198" y="222" width="12" height="8" fill="var(--secondary-color)"/>
  <line x1="204" y1="231" x2="204" y2="318" stroke="var(--secondary-color)" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#asa-hdr-arrow-sec)"/>
  <text x="212" y="292" font-size="12" font-weight="700" fill="var(--secondary-color)">거리센서</text>
  <line x1="16" y1="322" x2="304" y2="322" stroke="var(--text-light)" stroke-width="1.5"/>
  <!-- group 2: sensors -->
  <text x="12" y="352" font-size="13" font-weight="700" fill="var(--secondary-color)">세상을 재는 쪽</text>
  <g fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.5">
    <rect x="8" y="362" width="58" height="26" rx="4"/>
    <rect x="70" y="362" width="58" height="26" rx="4"/>
    <rect x="132" y="362" width="58" height="26" rx="4"/>
    <rect x="194" y="362" width="58" height="26" rx="4"/>
    <rect x="256" y="362" width="58" height="26" rx="4"/>
  </g>
  <g font-size="12" font-weight="700" fill="currentColor" text-anchor="middle">
    <text x="37" y="380">IMU</text>
    <text x="99" y="380">자력계</text>
    <text x="161" y="380">기압계</text>
    <text x="223" y="380">GNSS</text>
    <text x="285" y="380">거리센서</text>
  </g>
  <g font-size="12" fill="var(--text-light)" text-anchor="middle">
    <text x="37" y="406">자세</text>
    <text x="99" y="406">방위</text>
    <text x="161" y="406">고도</text>
    <text x="223" y="406">위치</text>
    <text x="285" y="406">지면 거리</text>
  </g>
</svg>
<figcaption>힘을 만드는 쪽(배터리 → ESC → 모터 → 프로펠러)은 얼마나 밀 수 있는지를, 세상을 재는 쪽(IMU · 자력계 · 기압계 · GNSS · 거리센서)은 지금 어디서 어떻게 있는지를 정한다 — 3단계는 이 둘의 역할과 한계를 다룬다</figcaption>
</figure>

## 들어가며

이 글은 `Drone-Control-Essential` 시리즈의 **3단계**입니다. 전체 흐름은 [Drone Control Essential Curriculum](/2026/11/05/drone-control-essential-curriculum.html)에서 확인하고, 직전 단계 [좌표계 · 자세 · 비행 역학](/2026/11/05/drone-frames-attitude-dynamics.html)을 먼저 읽으면 좋습니다.

2단계에서는 드론을 이상적인 강체로 다뤘습니다. 모터는 명령한 만큼 정확히 추력을 내고, 자세는 정확히 알려져 있다고 가정했습니다. 현실은 다릅니다. 모터는 배터리 전압이 떨어지면 힘이 약해지고, 배터리는 많이 뽑아 쓸수록 전압이 출렁이며, 센서는 노이즈와 바이어스와 진동과 자기 간섭을 섞어서 값을 냅니다.

통제 앱 개발자가 하드웨어를 직접 고를 일은 많지 않을 수 있습니다. 하지만 앱 화면에 뜨는 **"배터리 23%"**, **"진동 높음"**, **"자력계 불일치"** 같은 경고가 무엇을 뜻하고 얼마나 심각한지는 하드웨어를 알아야 판단할 수 있습니다. 3단계는 **힘을 만드는 쪽(추진계·전원계)** 과 **세상을 재는 쪽(센서)** 을 나눠 정리하고, 마지막에 통제 앱이 읽을 상태 메시지로 연결합니다.

<div class="post-summary-box" markdown="1">

### 📌 이 글에서 다루는 내용

#### 🔍 핵심 주제

- **추진계**: 프레임 크기·프로펠러, BLDC 모터와 KV, ESC와 신호 프로토콜(PWM/OneShot/DShot), 추력 대 중량비
- **전원계**: LiPo 셀 전압·용량·C-rate, 전압 강하, 전류 센서, 비행시간 추정과 배터리 페일세이프의 근거
- **센서**: IMU(자이로·가속도계), 자력계, 기압계, GNSS 수신기, 거리센서·광류 — 각각의 오차 특성과 진동·자기 간섭·캘리브레이션

</div>

## 1. 추진계 — 힘을 만드는 사슬

### 1.1 신호에서 추력까지

추진계는 하나의 사슬입니다. FC가 모터 명령을 내면 ESC가 그것을 전류로 바꾸고, 모터가 회전하며, 프로펠러가 공기를 밀어 추력을 만듭니다. 2단계의 믹서가 계산한 "모터 i의 추력"은 이 사슬을 거쳐서야 실제 힘이 됩니다.

| 구성품 | 역할 | 사양 읽는 법 |
| --- | --- | --- |
| **프레임** | 모터·전자장비를 지지하는 뼈대 | 크기 = 대각선 모터 축 간 거리(mm), 예: 250급(레이싱), 450~650급(촬영·개발용) |
| **프로펠러** | 회전을 추력으로 바꿈 | `10x4.5` = 지름 10인치 × 피치 4.5인치(한 바퀴에 이론상 전진하는 거리). 2엽·3엽, CW/CCW 쌍 |
| **BLDC 모터** | 전기 에너지를 회전으로 | 스테이터 크기 `2212` = 지름 22mm × 높이 12mm, **KV** = 무부하에서 1V당 회전수(rpm/V) |
| **ESC** | FC 명령에 따라 모터 3상 전류를 전환 | 연속 전류(A), 지원 전압(S), 신호 프로토콜, 펌웨어(BLHeli_32·AM32·Bluejay 등) |

**KV와 프로펠러는 짝으로 고릅니다.** KV가 낮은 모터는 같은 전압에서 천천히 돌지만 토크가 커서 큰 프로펠러를 돌리기에 알맞고, KV가 높은 모터는 작은 프로펠러를 빠르게 돌립니다. 일반적으로 **크고 천천히 도는 프로펠러가 같은 추력을 더 적은 전력으로** 냅니다(효율이 높음). 그래서 오래 나는 촬영·매핑 기체는 저KV 모터와 큰 프로펠러를, 민첩한 레이싱 기체는 고KV 모터와 작은 프로펠러를 씁니다.

### 1.2 ESC 신호 프로토콜

FC가 ESC에 "얼마나 세게 돌려라"를 전달하는 방법은 세대를 거치며 바뀌었습니다.

| 프로토콜 | 방식 | 특징 |
| --- | --- | --- |
| **PWM** | 펄스 폭 1000~2000µs (아날로그) | 가장 오래되고 호환성이 넓음. 갱신률이 낮고, ESC마다 최소·최대 펄스를 맞추는 **ESC 캘리브레이션**이 필요 |
| **OneShot125 / Multishot** | 더 짧은 펄스(OneShot125 125~250µs, Multishot 5~25µs) | PWM보다 빠른 갱신. 여전히 아날로그 타이밍이라 지터에 영향받음 |
| **DShot** (150/300/600…) | 16비트 **디지털** 프레임(스로틀 11비트 + 텔레메트리 요청 1비트 + CRC 4비트) | 캘리브레이션 불필요, 오류 검출, 숫자는 전송 속도(kbit/s). **양방향 DShot**은 모터 RPM(전기 RPM — 극쌍 수로 나눠 기계 RPM)을 FC로 돌려보냄 |
| **DroneCAN** 등 버스 | CAN 버스 위 메시지 | 배선이 단순하고 ESC 상태(온도·전류·RPM)를 풍부하게 받음. 대형·산업용 기체에서 사용 |

양방향 DShot이나 CAN으로 얻는 **모터 RPM**은 단순한 모니터링 이상의 의미가 있습니다. FC가 RPM을 알면 프로펠러 회전수에 해당하는 진동 주파수를 정확히 걸러내는 **RPM 노치 필터**를 쓸 수 있어(이를 위해 모터 극 수를 정확히 설정해야 합니다), 자이로 신호가 깨끗해지고 제어가 좋아집니다(3.4절과 5단계).

### 1.3 추력 대 중량비

추진계의 성능을 한 숫자로 요약하면 **추력 대 중량비(T/W)** 입니다. 모든 모터의 최대 추력 합을 이륙 총중량(All-Up Weight, 배터리 포함)으로 나눈 값입니다.

- **T/W ≈ 2**: 일반 촬영·개발용 멀티콥터의 흔한 권장 하한. 호버에 스로틀 절반 이상(곡선이 볼록해 실제로는 더 높음)을 쓰고, 나머지가 기동·바람·제어 여유
- **T/W < 1.5**: 여유가 부족. 바람이 불거나 빠르게 기동하면 모터가 포화되어 2단계에서 본 것처럼 요를 포기하거나 고도를 잃음
- **T/W 5 이상**: 레이싱·프리스타일 FPV. 민첩하지만 호버 효율은 낮음

> 1~3번 코드 블록은 하나의 세션에서 이어서 실행한다고 가정합니다(앞 블록의 `auw_g`, `hover_current_a` 등을 재사용).

```python
# --- 1) 추력 대 중량비 ---
auw_g = 1500                  # 이륙 총중량(All-Up Weight), 배터리 포함
max_thrust_per_motor_g = 800  # 모터·프로펠러·전압 조합의 최대 추력 (제조사 추력표)
n_motors = 4

tw = n_motors * max_thrust_per_motor_g / auw_g
hover_throttle = 1 / tw      # 추력이 스로틀에 비례한다고 가정한 거친 추정 (실제보다 낮게 나옴)
print(f"T/W = {tw:.2f}, 호버 스로틀 ≈ {hover_throttle:.0%}")
# T/W = 2.13, 호버 스로틀 ≈ 47%
```

<figure class="post-figure">
<svg role="img" aria-label="추진 사슬과 추력 여유. 위쪽은 세로로 이어진 사슬이다. FC 명령은 믹서가 정한 모터별 목표 추력, ESC는 명령을 모터 3상 전류로 전환, 모터는 전류를 회전으로, 프로펠러는 회전으로 공기를 밀어내고, 결과 추력은 최대 4 곱하기 800 g, 즉 3200 g이다. 아래쪽 첫 게이지는 T/W를 1.0부터 3.0까지 보여 주며 1.5 미만은 위험, 1.5에서 2 사이는 부족, 2 이상은 권장 구간이고, 이 기체의 T/W 2.13이 권장 구간에 표시된다. 두 번째 게이지는 스로틀 0에서 100퍼센트 중 호버가 최소 47퍼센트(선형 가정 하한, 실제로는 더 높음)를 쓰고 나머지가 기동, 바람, 제어 여유임을 보여 준다." viewBox="0 0 320 456" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>FC 명령에서 추력까지의 사슬과 추력 대 중량비(T/W) 여유</title>
  <defs>
    <marker id="asa-tw-arrow-acc" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-color)"/>
    </marker>
  </defs>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">명령이 추력이 되기까지, 그리고 여유</text>
  <!-- chain -->
  <rect x="12" y="38" width="84" height="26" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <g fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="1.5">
    <rect x="12" y="78" width="84" height="26" rx="4"/>
    <rect x="12" y="118" width="84" height="26" rx="4"/>
    <rect x="12" y="158" width="84" height="26" rx="4"/>
  </g>
  <rect x="12" y="198" width="84" height="26" rx="4" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="2.5"/>
  <g font-size="12" font-weight="700" fill="currentColor" text-anchor="middle">
    <text x="54" y="56">FC 명령</text>
    <text x="54" y="96">ESC</text>
    <text x="54" y="136">모터</text>
    <text x="54" y="176">프로펠러</text>
    <text x="54" y="216">추력</text>
  </g>
  <g stroke="var(--accent-color)" stroke-width="1.5">
    <line x1="54" y1="65" x2="54" y2="77" marker-end="url(#asa-tw-arrow-acc)"/>
    <line x1="54" y1="105" x2="54" y2="117" marker-end="url(#asa-tw-arrow-acc)"/>
    <line x1="54" y1="145" x2="54" y2="157" marker-end="url(#asa-tw-arrow-acc)"/>
    <line x1="54" y1="185" x2="54" y2="197" marker-end="url(#asa-tw-arrow-acc)"/>
  </g>
  <g font-size="12" fill="currentColor">
    <text x="108" y="56">믹서가 정한 모터별 목표 추력</text>
    <text x="108" y="96">명령을 모터 3상 전류로 전환</text>
    <text x="108" y="136">전류를 회전으로 (KV, rpm/V)</text>
    <text x="108" y="176">회전으로 공기를 밀어냄</text>
    <text x="108" y="216" font-weight="700">최대 4 × 800 g = 3200 g</text>
  </g>
  <line x1="12" y1="240" x2="308" y2="240" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.5"/>
  <!-- T/W gauge -->
  <text x="12" y="262" font-size="13" font-weight="700" fill="currentColor">T/W = 3200 g ÷ 1500 g = 2.13</text>
  <rect x="20" y="290" width="70" height="24" fill="var(--accent-color)" opacity="0.22"/>
  <rect x="90" y="290" width="70" height="24" fill="var(--gold-soft)"/>
  <rect x="160" y="290" width="140" height="24" fill="var(--secondary-color)" opacity="0.18"/>
  <rect x="20" y="290" width="280" height="24" fill="none" stroke="currentColor" stroke-width="1"/>
  <g font-size="12" font-weight="700" fill="currentColor" text-anchor="middle">
    <text x="55" y="307">위험</text>
    <text x="125" y="307">부족</text>
    <text x="242" y="307">권장 구간</text>
  </g>
  <line x1="178" y1="290" x2="178" y2="314" stroke="var(--accent-color)" stroke-width="2.5"/>
  <polygon points="172,281 184,281 178,289" fill="var(--accent-color)"/>
  <text x="178" y="277" text-anchor="middle" font-size="13" font-weight="700" fill="var(--accent-color)">2.13</text>
  <g stroke="currentColor" stroke-width="1">
    <line x1="20" y1="314" x2="20" y2="319"/>
    <line x1="90" y1="314" x2="90" y2="319"/>
    <line x1="160" y1="314" x2="160" y2="319"/>
    <line x1="230" y1="314" x2="230" y2="319"/>
    <line x1="300" y1="314" x2="300" y2="319"/>
  </g>
  <g font-size="12" fill="var(--text-light)" text-anchor="middle">
    <text x="20" y="332">1.0</text>
    <text x="90" y="332">1.5</text>
    <text x="160" y="332">2.0</text>
    <text x="230" y="332">2.5</text>
    <text x="300" y="332">3.0</text>
  </g>
  <text x="12" y="352" font-size="12" fill="currentColor">T/W ≈ 2 권장 하한 · 1.5 미만은 여유 부족(위험)</text>
  <!-- hover throttle gauge -->
  <text x="12" y="378" font-size="13" font-weight="700" fill="currentColor">호버 스로틀 ≈ 1 ÷ 2.13 ≈ 47%</text>
  <rect x="20" y="388" width="131.6" height="24" fill="var(--gold-soft)" stroke="currentColor" stroke-width="1"/>
  <rect x="151.6" y="388" width="148.4" height="24" fill="var(--secondary-color)" opacity="0.18"/>
  <rect x="151.6" y="388" width="148.4" height="24" fill="none" stroke="var(--secondary-color)" stroke-width="1.2" stroke-dasharray="4 3"/>
  <text x="86" y="405" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">호버 ≥47%</text>
  <text x="226" y="405" text-anchor="middle" font-size="12" fill="currentColor">기동·바람·제어 여유</text>
  <g font-size="12" fill="var(--text-light)">
    <text x="20" y="428" text-anchor="middle">0%</text>
    <text x="300" y="428" text-anchor="end">100%</text>
  </g>
  <text x="12" y="448" font-size="12" font-weight="700" fill="var(--accent-color)">탑재체로 호버가 70~80%에 이르면 위험</text>
</svg>
<figcaption>FC 명령은 ESC · 모터 · 프로펠러를 거쳐야 힘이 된다. 이 기체(1500 g, 모터당 800 g)는 T/W 2.13으로 권장 구간에 있고, 호버에 스로틀을 최소 약 47%(실제로는 55~65%) 쓰고 남는 부분이 기동 · 바람 · 제어 여유다</figcaption>
</figure>

실제로는 추력이 회전수의 제곱에 비례하는 등 스로틀과 추력의 관계가 비선형입니다. 그래서 PX4는 `THR_MDL_FAC`, ArduPilot은 `MOT_THST_EXPO` 같은 파라미터로 이 곡선을 보정하고, ArduPilot은 비행 중 실제 호버 스로틀을 학습(`MOT_THST_HOVER`)합니다. 추력 곡선이 볼록하기 때문에 실제 호버 스로틀은 위의 1/(T/W)보다 **높게** 나옵니다(이 기체는 대략 55~65%). 즉 47%는 하한입니다. 통제 앱 입장에서는 **호버 스로틀이 높을수록 여유가 없다**는 것만 기억하면 됩니다. 탑재체를 추가해 호버 스로틀이 70~80%에 이르면 그 기체는 위험합니다.

## 2. 전원계 — 비행시간과 배터리 경고의 근거

### 2.1 LiPo 배터리 읽는 법

대부분의 멀티콥터는 **리튬 폴리머(LiPo)** 배터리를 씁니다. 가볍고 순간 방전 능력이 크기 때문입니다.

| 표기 | 뜻 | 예: `4S 5000mAh 25C` |
| --- | --- | --- |
| **S** (Series) | 직렬로 연결한 셀 수. 셀당 공칭 3.7V, 만충 4.2V | 4S → 공칭 14.8V, 만충 16.8V |
| **mAh** | 용량 | 5000mAh = 5Ah |
| **C-rate** | 용량 대비 최대 연속 방전 배수 | 25C × 5Ah = 최대 125A |
| **P** (Parallel) | 병렬 셀 수 (용량 증가) | 4S2P = 셀 2개를 병렬로 묶은 그룹 4개를 직렬 |

셀 전압은 안전 운용의 기준입니다. 만충 4.2V에서 시작해 비행하며 내려가고, **비행 중(부하 상태) 셀당 약 3.5V에서 착륙을 시작**하고, 착륙 후 휴지 전압이 셀당 약 3.7V 이상 남도록 하는 것이 일반적인 권장입니다. 3.0V 아래로 과방전하면 셀이 손상되고, 장기 보관은 셀당 약 3.8V(스토리지 전압)로 합니다. 장시간 비행용 기체는 에너지 밀도가 더 높은 대신 순간 방전이 약한 **리튬 이온(Li-ion) 팩**(18650·21700 셀)을 쓰기도 합니다.

### 2.2 비행시간 추정

비행시간은 결국 **쓸 수 있는 전하량 ÷ 평균 전류**입니다. 평균 전류는 호버 전력에서 나오고, 호버 전력은 모터·프로펠러 추력표의 **효율(g/W)** 로 추정합니다.

```python
# --- 2) 배터리와 비행시간 ---
cells = 4
v_nominal = 3.7 * cells       # 4S 공칭 전압
v_full = 4.2 * cells
capacity_ah = 5.0             # 5000 mAh
c_rating = 25
print(f"4S: 공칭 {v_nominal:.1f} V, 만충 {v_full:.1f} V, 최대 연속 전류 {capacity_ah * c_rating:.0f} A")
# 4S: 공칭 14.8 V, 만충 16.8 V, 최대 연속 전류 125 A

efficiency_g_per_w = 8.0      # 호버 효율 (g/W) — 추력표에서 호버 지점의 값
hover_power_w = auw_g / efficiency_g_per_w
hover_current_a = hover_power_w / v_nominal
usable = 0.8                  # 수명과 안전을 위해 용량의 80%만 사용
flight_min = capacity_ah * usable / hover_current_a * 60
print(f"호버 전력 {hover_power_w:.0f} W, 전류 {hover_current_a:.1f} A, 비행시간 ≈ {flight_min:.1f} 분")
# 호버 전력 188 W, 전류 12.7 A, 비행시간 ≈ 18.9 분
```

이 계산에는 함정이 하나 있습니다. **배터리를 키우면 무게도 늘어납니다.** 무게가 늘면 호버 전력이 늘고, 그만큼 비행시간 증가분이 깎입니다. 어느 지점부터는 배터리를 키워도 비행시간이 거의 늘지 않습니다. 또 이 값은 무풍 호버 기준이고 FC·텔레메트리·짐벌의 소비 전력을 빼지 않았으므로, 바람·기동·추위(배터리 성능 저하)가 있으면 더 짧아집니다. 통제 앱이 "남은 비행시간"을 표시한다면 이런 불확실성을 보수적으로 반영해야 합니다.

### 2.3 전압 강하와 배터리 잔량의 어려움

배터리에는 **내부 저항**이 있습니다. 전류를 많이 뽑을수록 단자 전압이 순간적으로 떨어지는데, 이를 **전압 강하(voltage sag)** 라고 합니다.

```python
# --- 3) 전압 강하 (sag) ---
r_internal = 0.020            # 팩 내부 저항 (Ω), 셀당 약 5 mΩ × 4
for current in (hover_current_a, 60):
    print(f"{current:5.1f} A → 강하 {current * r_internal:.2f} V")
#  12.7 A → 강하 0.25 V
#  60.0 A → 강하 1.20 V
```

<figure class="post-figure">
<svg role="img" aria-label="급상승 중의 전압 강하를 그린 전압-시간 스케치. 점선인 부하 보상 전압은 시간에 따라 천천히 내려간다. 실선인 단자 전압은 호버(12.7 A)에서 0.25 V 아래에 있다가, 급상승(60 A) 구간에서 1.20 V 아래로 뚝 떨어져 경고 임계값 아래로 내려가고, 다시 호버로 돌아오면 회복된다. 그래서 단자 전압만 보면 급기동 중 경고가 떴다 사라지고, 노후 배터리의 위험은 놓친다. 아래에는 펌웨어가 함께 쓰는 세 신호, 부하 보상 전압, 전류를 적분한 mAh, 둘을 조합한 잔량 퍼센트가 있다." viewBox="0 0 320 424" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>전압 강하(voltage sag) — 급상승 때 떨어지고 호버에서 회복되는 단자 전압</title>
  <defs>
    <marker id="asa-sag-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
    <marker id="asa-sag-arrow-acc" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-color)"/>
    </marker>
  </defs>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">급기동 때 전압은 출렁인다</text>
  <text x="50" y="44" font-size="12" font-weight="700" fill="currentColor">전압</text>
  <text x="306" y="44" text-anchor="end" font-size="12" fill="var(--text-light)">강하 = 전류 × 0.020 Ω</text>
  <!-- axes -->
  <g stroke="currentColor" stroke-width="1.5" fill="none">
    <line x1="44" y1="236" x2="44" y2="52" marker-end="url(#asa-sag-arrow)"/>
    <line x1="44" y1="236" x2="308" y2="236" marker-end="url(#asa-sag-arrow)"/>
  </g>
  <!-- phase boundaries -->
  <g stroke="var(--text-light)" stroke-width="1" stroke-dasharray="3 3">
    <line x1="130" y1="56" x2="130" y2="236"/>
    <line x1="196" y1="56" x2="196" y2="236"/>
  </g>
  <!-- warning threshold -->
  <line x1="44" y1="140" x2="304" y2="140" stroke="var(--accent-color)" stroke-width="1.2" stroke-dasharray="6 4"/>
  <text x="304" y="134" text-anchor="end" font-size="12" fill="var(--accent-color)">경고 임계값</text>
  <!-- load-compensated voltage (dashed) -->
  <line x1="50" y1="70" x2="300" y2="82" stroke="var(--secondary-color)" stroke-width="2" stroke-dasharray="6 4"/>
  <!-- terminal voltage (solid) -->
  <path d="M50,87.5 L130,91.3 L134,158 L192,160.8 L196,94.5 L300,99.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- sag brackets -->
  <g stroke="var(--accent-color)" stroke-width="1.5">
    <line x1="188" y1="78" x2="188" y2="158" marker-start="url(#asa-sag-arrow-acc)" marker-end="url(#asa-sag-arrow-acc)"/>
    <line x1="250" y1="80.5" x2="250" y2="96" marker-start="url(#asa-sag-arrow-acc)" marker-end="url(#asa-sag-arrow-acc)"/>
  </g>
  <g font-size="12" font-weight="700" fill="var(--accent-color)" text-anchor="middle">
    <text x="157" y="122">−1.20 V</text>
    <text x="266" y="72">−0.25 V</text>
  </g>
  <!-- phase labels -->
  <g font-size="12" font-weight="700" fill="currentColor" text-anchor="middle">
    <text x="87" y="252">호버</text>
    <text x="163" y="252">급상승</text>
    <text x="245" y="252">호버</text>
  </g>
  <g font-size="12" fill="var(--text-light)" text-anchor="middle">
    <text x="87" y="268">12.7 A</text>
    <text x="163" y="268">60 A</text>
    <text x="245" y="268">12.7 A</text>
  </g>
  <!-- legend -->
  <line x1="12" y1="292" x2="34" y2="292" stroke="currentColor" stroke-width="2.5"/>
  <text x="40" y="296" font-size="12" fill="currentColor">단자 전압(측정)</text>
  <line x1="160" y1="292" x2="182" y2="292" stroke="var(--secondary-color)" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="188" y="296" font-size="12" fill="currentColor">부하 보상 전압</text>
  <!-- why voltage alone misleads -->
  <g font-size="12" fill="currentColor">
    <text x="12" y="320">전압만 보면 급기동 중 경고가 떴다 사라지고,</text>
    <text x="12" y="338">노후 배터리(내부 저항 큼)의 위험은 놓친다</text>
  </g>
  <!-- three signals -->
  <text x="12" y="364" font-size="13" font-weight="700" fill="currentColor">그래서 세 신호를 함께 본다</text>
  <g fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.5">
    <rect x="8" y="374" width="96" height="42" rx="4"/>
    <rect x="112" y="374" width="96" height="42" rx="4"/>
    <rect x="216" y="374" width="96" height="42" rx="4"/>
  </g>
  <g font-size="12" font-weight="700" fill="currentColor" text-anchor="middle">
    <text x="56" y="392">전압</text>
    <text x="160" y="392">mAh</text>
    <text x="264" y="392">잔량 %</text>
  </g>
  <g font-size="12" fill="var(--text-light)" text-anchor="middle">
    <text x="56" y="408">부하 보상</text>
    <text x="160" y="408">전류 적분</text>
    <text x="264" y="408">둘을 조합</text>
  </g>
</svg>
<figcaption>내부 저항 0.020 Ω 팩에서 60 A를 뽑으면 단자 전압이 1.20 V 떨어지고, 호버(12.7 A)로 돌아오면 0.25 V 강하로 회복된다 — 전압 하나로는 잔량을 판단할 수 없어 전압 · mAh · %를 함께 쓴다 (축척은 개념도)</figcaption>
</figure>

급상승할 때 1V 넘게 떨어졌다가 호버로 돌아오면 회복되는 것입니다. 그래서 **전압만 보고 잔량을 판단하면 틀립니다.** 급기동 중에 "배터리 위험"이 떴다가 사라지거나, 반대로 노후 배터리(내부 저항이 큼)의 위험을 놓칠 수 있습니다. 펌웨어는 이를 보완하려고 세 가지를 함께 씁니다.

- **전압**: 부하 보상(내부 저항 추정으로 sag를 되돌림)을 적용한 셀 전압
- **소모 전하량(mAh)**: **전류 센서**(파워 모듈)로 측정한 전류를 시간에 대해 적분
- **잔량 추정(%)**: 위 둘을 조합한 값

배터리 페일세이프는 이 값들에 임계값을 둡니다. PX4는 잔량 비율 기준(`BAT_LOW_THR`·`BAT_CRIT_THR`·`BAT_EMERGEN_THR`)과 동작(`COM_LOW_BAT_ACT`)을, ArduPilot은 전압·mAh 기준(`BATT_LOW_VOLT`·`BATT_LOW_MAH` 등)과 동작(`BATT_FS_LOW_ACT`)을 파라미터로 둡니다. 자세한 설정은 9단계에서 다룹니다. 중요한 것은 **전류 센서가 없거나 보정되지 않은 기체는 mAh 기반 잔량이 엉터리**라는 점입니다. 통제 앱은 잔량 %가 어떤 근거로 나온 숫자인지 의심할 수 있어야 합니다.

## 3. 센서 — 세상을 재는 장치와 그 오차

### 3.1 센서 한눈에

| 센서 | 재는 것 | 주된 오차 | 주로 쓰이는 곳 |
| --- | --- | --- | --- |
| **자이로스코프** | 각속도 (rad/s), body 기준 | 바이어스와 그 드리프트, 노이즈, 온도 의존성 | 각속도 제어(가장 안쪽 루프), 자세 적분 |
| **가속도계** | 비중력 가속도(specific force, m/s²) | 바이어스, 노이즈, **진동**, 포화(clipping) | 기울기 추정(중력 방향), 속도·위치 예측 |
| **자력계** | 지구 자기장 방향 | **자기 간섭**(전선·모터·금속), 자기 편각 | 방위(yaw) |
| **기압계** | 기압 → 상대 고도 | 날씨·온도 드리프트, 프로펠러 바람, 지면 효과 | 고도 유지 |
| **GNSS 수신기** | 위치·속도(전역) | 위성 배치·다중경로·차폐, 수 m 오차, 낮은 갱신률 | 위치 유지·미션 (4단계) |
| **거리센서** (LiDAR·초음파) | 지면까지 거리(AGL) | 측정 범위, 지면 재질, 기울기 | 정밀 착륙, 지형 추종 |
| **광류(optical flow)** | 지면 이미지의 움직임 → 수평 속도 | 질감 없는 바닥·어두움에 약함, 거리 정보 필요 | GPS 없는 실내 위치 유지 |

센서들은 서로의 약점을 메웁니다. 자이로는 빠르고 정확하지만 적분하면 드리프트하고, 가속도계는 오래 평균하면 기울기를 알려 주지만 순간값은 진동에 흔들리며, 자이로와 가속도계만으로는 수평면의 방위(yaw)를 알 수 없어 자력계나 GNSS가 필요합니다. 이 상호 보완을 수학적으로 묶는 것이 4단계의 **센서 융합(EKF)** 입니다.

<figure class="post-figure">
<svg role="img" aria-label="센서들의 강점과 약점, 그리고 EKF로의 합류. 자이로는 빠르고 정확하지만 적분하면 드리프트한다. 가속도계는 기울기(중력 방향)를 주지만 노이즈와 진동에 약하다. 자력계는 방위(yaw)를 주지만 자기 간섭에 약하다. 기압계는 상대 고도를 주지만 날씨와 온도로 드리프트한다. GNSS는 전역 절대 위치를 주지만 갱신이 느리고 수 m 오차가 있다. 다섯 센서가 모두 하나의 선으로 모여 4단계에서 다룰 EKF로 들어가, 서로의 약점을 메워 하나의 상태 추정을 만든다." viewBox="0 0 320 324" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>서로 다르게 틀리는 센서들이 EKF(4단계)로 모인다</title>
  <defs>
    <marker id="asa-ekf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
  </defs>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">서로 다르게 틀리는 센서들</text>
  <g fill="var(--bg-light)" stroke="currentColor" stroke-width="1">
    <rect x="12" y="38" width="232" height="40" rx="4"/>
    <rect x="12" y="84" width="232" height="40" rx="4"/>
    <rect x="12" y="130" width="232" height="40" rx="4"/>
    <rect x="12" y="176" width="232" height="40" rx="4"/>
    <rect x="12" y="222" width="232" height="40" rx="4"/>
  </g>
  <g font-size="13" font-weight="700" fill="currentColor">
    <text x="22" y="63">자이로</text>
    <text x="22" y="109">가속도계</text>
    <text x="22" y="155">자력계</text>
    <text x="22" y="201">기압계</text>
    <text x="22" y="247">GNSS</text>
  </g>
  <g font-size="12" font-weight="700" fill="var(--secondary-color)">
    <text x="96" y="55">+ 빠르고 정확</text>
    <text x="96" y="101">+ 기울기(중력 방향)</text>
    <text x="96" y="147">+ 방위(yaw)</text>
    <text x="96" y="193">+ 상대 고도</text>
    <text x="96" y="239">+ 전역 절대 위치</text>
  </g>
  <g font-size="12" fill="var(--accent-color)">
    <text x="96" y="71">− 적분하면 드리프트</text>
    <text x="96" y="117">− 노이즈 · 진동</text>
    <text x="96" y="163">− 자기 간섭</text>
    <text x="96" y="209">− 날씨·온도 드리프트</text>
    <text x="96" y="255">− 갱신 느림 · 수 m 오차</text>
  </g>
  <!-- bus into EKF -->
  <g stroke="currentColor" stroke-width="1.5" fill="none">
    <line x1="244" y1="58" x2="276" y2="58"/>
    <line x1="244" y1="104" x2="276" y2="104"/>
    <line x1="244" y1="150" x2="276" y2="150"/>
    <line x1="244" y1="196" x2="276" y2="196"/>
    <line x1="244" y1="242" x2="276" y2="242"/>
    <line x1="276" y1="58" x2="276" y2="267" marker-end="url(#asa-ekf-arrow)"/>
  </g>
  <rect x="40" y="268" width="264" height="46" rx="5" fill="var(--gold-soft)" stroke="var(--secondary-color)" stroke-width="2.5"/>
  <text x="160" y="288" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">EKF (4단계)</text>
  <text x="160" y="305" text-anchor="middle" font-size="12" fill="currentColor">약점을 서로 메워 하나의 상태로</text>
</svg>
<figcaption>센서마다 잘하는 것(+)과 틀리는 방식(−)이 다르다 — 자이로의 드리프트는 가속도계의 기울기가, 방위는 자력계 · GNSS가, 기압계 드리프트는 GNSS 고도가 메우며, 이 결합을 4단계의 EKF가 맡는다</figcaption>
</figure>

### 3.2 IMU — 가장 중요하고 가장 예민한 센서

**IMU(관성 측정 장치)** 는 자이로와 가속도계(보통 3축씩)를 묶은 MEMS 칩입니다. FC의 모든 제어는 IMU에서 시작하기 때문에, IMU 품질이 곧 비행 품질입니다.

- **가속도계는 중력을 직접 재지 않습니다.** 재는 것은 "중력을 뺀 가속도", 즉 지지력이나 추력처럼 기체를 미는 힘입니다. 그래서 수평으로 정지한 기체의 가속도계는 FRD 기준 `(0, 0, −g)`, 즉 위쪽으로 1g를 읽습니다. 반대로 자유낙하 중에는 0을 읽습니다.
- **자이로 바이어스는 시간과 온도에 따라 변합니다.** 정지 상태에서도 0이 아닌 작은 값을 내고, 이를 적분하면 자세가 서서히 틀어집니다. 상태 추정기는 이 바이어스를 계속 추정해서 빼 줍니다. 일부 FC 보드는 IMU를 일정 온도로 데우는 히터를 달아 온도 영향을 줄입니다.
- **여러 개의 IMU**: Pixhawk 계열 보드는 보통 IMU를 2~3개 실어, 하나가 이상하면 다른 것으로 전환합니다.

### 3.3 자력계와 기압계 — 환경에 민감한 센서

**자력계**는 지구 자기장을 재서 북쪽을 알려 줍니다. 문제는 지구 자기장이 약하다는 것입니다. 배터리 전선과 모터에 흐르는 큰 전류, 프레임의 철 부품이 만드는 자기장이 쉽게 섞입니다. 그래서 자력계는 보통 전원 배선에서 먼 **GPS 마스트 위**에 GNSS 수신기와 함께 달고, 기체를 여러 방향으로 돌리는 **캘리브레이션**으로 고정 오프셋(hard iron)과 왜곡(soft iron)을 보정합니다. ArduPilot은 모터 전류에 비례한 간섭까지 보정하는 기능(compass-motor 보정)도 제공합니다. 진북과 자북의 차이인 **자기 편각**은 펌웨어가 위치에 따라 세계 자기 모델(WMM)로 보정합니다.

**기압계**는 고도에 따라 기압이 낮아지는 성질을 씁니다. 해수면 부근에서는 1m 올라갈 때 약 12Pa씩 낮아집니다.

```python
# --- 4) 기압계: 기압 → 고도 ---
def baro_altitude(p_pa, p0_pa=101325.0):
    """국제표준대기(ISA) 근사식. p0는 기준(이륙 지점) 기압."""
    return 44330.0 * (1 - (p_pa / p0_pa) ** (1 / 5.255))

p0 = 101325.0
print(f"{baro_altitude(p0 - 12.0, p0):.2f} m")   # 1.00 m  — 12 Pa 낮아지면 ≈ 1 m 위
print(f"{baro_altitude(p0 - 100.0, p0):.2f} m")  # 8.33 m  — 1 hPa 낮아지면 ≈ 8.3 m 위
```

두 번째 줄이 기압계의 한계를 보여 줍니다. 날씨가 바뀌어 대기압이 1hPa만 변해도 고도가 8m 넘게 틀어집니다. 그래서 기압계는 **이륙 지점 대비 상대 고도**로만 쓰고, 긴 비행에서는 GNSS 고도로 드리프트를 보정합니다. 프로펠러가 만드는 바람이 기압 센서 구멍에 닿으면 값이 흔들리므로 보통 스펀지로 덮고, 지면 가까이에서는 지면 효과로 오차가 커집니다.

### 3.4 진동 — 센서 오차의 가장 흔한 원인

프로펠러와 모터는 회전 주파수와 그 배수로 진동을 만듭니다. 이 진동이 IMU에 전달되면 두 가지 문제가 생깁니다. 가속도계가 측정 범위를 넘어 **포화(clipping)** 되면 그 순간의 값이 엉터리가 되고, 진동 주파수가 샘플링과 겹치면 **에일리어싱**으로 실제 없는 느린 움직임처럼 보이기도 합니다. 결과는 고도 유지 불량, 위치 표류, 심하면 EKF 실패입니다.

대응은 하드웨어와 소프트웨어 양쪽에서 합니다. 하드웨어로는 프로펠러 밸런스, 단단한 프레임, FC 방진 마운트를 쓰고, 소프트웨어로는 저역 통과 필터와 노치 필터(특히 1.2절의 RPM 기반 노치)를 씁니다. ArduPilot 문서는 진동 수준이 **30m/s² 이하면 대체로 양호하고, 60m/s²를 넘으면 위치·고도 유지에 거의 항상 문제**가 생긴다고 안내합니다.

### 3.5 캘리브레이션 — 통제 앱이 안내해야 하는 절차

| 캘리브레이션 | 하는 일 | 언제 |
| --- | --- | --- |
| 가속도계 | 기체를 6방향으로 놓고 바이어스·스케일 측정 | 최초 설정, FC 교체·재장착 후 |
| 자이로 | 정지 상태에서 바이어스 측정 | 보통 부팅 시 자동 |
| 자력계 | 기체를 여러 방향으로 회전시켜 hard/soft iron 보정 | 최초 설정, 배선·탑재체 변경 후, 장소가 크게 바뀔 때 |
| 수평(level horizon) | FC 장착 각도 오차 보정 | 호버 중 한쪽으로 흐를 때 |
| ESC | 아날로그 신호의 최소·최대 범위 학습 | PWM·OneShot 등 아날로그 프로토콜 사용 시 (DShot은 불필요) |

캘리브레이션 상태는 이륙 가능 여부(arming check)와 직결됩니다. 자력계가 보정되지 않았거나 센서 간 값이 크게 다르면 펌웨어는 Arm을 거부합니다(9단계). 1단계에서 정한 원칙대로 캘리브레이션 같은 설정 작업은 QGroundControl 같은 범용 GCS에 맡기더라도, 통제 앱은 **"왜 Arm이 안 되는가"를 설명할 수 있어야** 합니다.

## 4. 통제 앱이 읽는 하드웨어 상태

지금까지의 내용은 MAVLink 메시지로 앱에 도착합니다. 대표적인 것들입니다.

| 메시지 | 담긴 정보 | 앱에서의 쓰임 |
| --- | --- | --- |
| `SYS_STATUS` | 센서 존재·활성·정상 비트마스크, 배터리 전압(mV)·전류(cA)·잔량(%) | 센서 이상 표시, 기본 배터리 표시 |
| `BATTERY_STATUS` | 셀별 전압(mV — 셀 측정 미지원 시 `voltages[0]`에 팩 전체 전압), 전류(cA), 소모량(mAh), 잔량(%) 등 | 상세 배터리 화면, 셀 불균형 경고 |
| `VIBRATION` | 축별 진동(m/s²), 가속도계별 포화 횟수 | 진동 경고, 정비 필요 신호 |
| `ESC_STATUS` / `ESC_INFO` | ESC별 RPM·전압·전류·온도 등 (지원 시, ArduPilot은 `ESC_TELEMETRY_1_TO_4` 등) | 모터 이상 감지 |
| `GPS_RAW_INT` | fix 종류, 위성 수, HDOP 등 | GPS 품질 표시 (4단계) |

아래는 pymavlink로 배터리와 진동을 읽는 최소 예제입니다. 연결 부분은 [1단계](/2026/11/05/drone-uas-system-map.html)의 HEARTBEAT 예제와 같습니다.

```python
from pymavlink import mavutil

conn = mavutil.mavlink_connection("udpin:0.0.0.0:14550")
if conn.wait_heartbeat(timeout=10) is None:
    raise SystemExit("HEARTBEAT 없음 — 링크 또는 포트 설정을 확인")

for _ in range(20):
    msg = conn.recv_match(type=["SYS_STATUS", "VIBRATION"], blocking=True, timeout=5)
    if msg is None:
        print("수신 없음 — 링크 또는 스트림 설정 확인")
        break
    if msg.get_type() == "SYS_STATUS":
        # "알 수 없음" 값: 전압 UINT16_MAX(65535), 전류·잔량 -1
        volts = None if msg.voltage_battery == 65535 else msg.voltage_battery / 1000  # mV → V
        amps = None if msg.current_battery == -1 else msg.current_battery / 100       # cA → A
        remain = None if msg.battery_remaining == -1 else msg.battery_remaining       # %
        fmt = lambda v, spec, unit: "측정 불가" if v is None else f"{v:{spec}}{unit}"
        print(f"배터리 {fmt(volts, '.2f', ' V')}, {fmt(amps, '.1f', ' A')}, 잔량 {fmt(remain, 'd', '%')}")
    else:
        worst = max(msg.vibration_x, msg.vibration_y, msg.vibration_z)
        clips = msg.clipping_0 + msg.clipping_1 + msg.clipping_2
        level = "양호" if worst < 30 else "주의" if worst < 60 else "위험"
        print(f"진동 {worst:.1f} m/s² ({level}), 누적 포화 {clips}회")
```

여기서도 2단계의 원칙이 그대로 적용됩니다. **단위 변환(mV→V, cA→A)은 수신 경계에서 한 번**, 그리고 `-1` 같은 "알 수 없음" 값을 0이나 정상값으로 착각하지 않도록 처리해야 합니다.

## 5. 운용 노트

### 5.1 통제 앱에 바로 쓰이는 규칙

- **배터리는 전압·mAh·%를 함께 보여 준다**: 하나만 보면 틀립니다. 셀당 전압으로 환산해 보여 주면 운용자가 직관적으로 판단할 수 있습니다.
- **"남은 비행시간"은 보수적으로**: 무풍 호버 기준 추정치는 실제보다 깁니다. 귀환에 필요한 시간(거리 ÷ 속도 + 착륙)을 빼고 여유를 두어 경고합니다.
- **진동과 포화는 정비 신호**: 비행 중 경고뿐 아니라 비행 후 기록으로 남겨, 프로펠러 손상·마운트 노후를 추적합니다.
- **"알 수 없음"을 숨기지 않는다**: 전류 센서가 없어 잔량이 `-1`이면 "측정 불가"로 표시합니다. 0%나 100%로 보이면 위험합니다.

### 5.2 이 단계에서 다루지 않은 것

모터·프로펠러 선정의 세부 계산(추력표 읽기, 정밀 효율 모델), ESC 펌웨어 설정, 배선·전원 분배·노이즈 대책, 탑재체(카메라·짐벌) 연동은 기체를 직접 제작하거나 튜닝하는 영역입니다. 통제 앱의 관점에서 필요한 범위는 여기까지이고, 펌웨어 쪽 파라미터와 로그는 6단계에서 다시 만납니다.

## 마무리

3단계에서 하드웨어를 두 갈래로 나눠 봤습니다. **힘을 만드는 쪽**은 FC 명령 → ESC → 모터 → 프로펠러로 이어지는 사슬이고, 그 여유는 추력 대 중량비로, 지속 시간은 배터리 용량과 호버 효율로 정해집니다. 배터리 잔량은 전압 강하 때문에 단순하지 않습니다. **세상을 재는 쪽**은 IMU·자력계·기압계·GNSS·거리센서이고, 각각 노이즈·바이어스·간섭·드리프트라는 고유한 오차를 가지며, 진동은 그 모두를 악화시킵니다. 통제 앱은 이 상태를 MAVLink로 받아 **근거와 불확실성을 숨기지 않고** 보여 줘야 합니다.

다음 단계는 서로 다르게 틀리는 이 센서들을 하나로 묶는 방법, **4단계: GNSS · 항법 · 상태 추정**입니다. GPS가 위치를 정하는 원리와 오차, 위경도를 로컬 좌표로 바꾸는 변환, 그리고 센서 융합(EKF)의 구조를 다룹니다.

### 다음 학습

- [Drone Control Essential Curriculum](/2026/11/05/drone-control-essential-curriculum.html) — 시리즈 전체 지도와 진행률
- 직전: [좌표계 · 자세 · 비행 역학](/2026/11/05/drone-frames-attitude-dynamics.html) — 숫자의 기준, 자세 표현, 멀티콥터가 움직이는 원리
- 다음: [GNSS · 항법 · 상태 추정](/2026/11/05/drone-gnss-navigation-estimation.html) — 서로 다르게 틀리는 센서를 하나로 묶는 법
