---
layout: post
title: "좌표계 · 자세 · 비행 역학: 드론을 수식으로 표현하기"
date: 2026-11-05 00:02:00
categories: [Technology, Drone]
tags: [drone, flight-control, coordinate-frame, attitude, quaternion, flight-dynamics, mavlink, px4]
series: Drone-Control-Essential
published: true
excerpt: "통제 앱이 받는 위치·고도·heading·속도는 모두 어떤 좌표계 기준의 숫자입니다. NED와 ENU, body frame(FRD·FLU)의 규약과 변환, 오일러각·회전행렬·쿼터니언으로 자세를 표현하는 방법과 짐벌 락, 그리고 멀티콥터가 모터 네 개의 추력 차이만으로 6자유도 운동을 만드는 원리와 믹서까지 코드로 확인합니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="쿼드콥터와 두 좌표계. 위쪽에는 비스듬히 내려다본 쿼드콥터에 기체 좌표 FRD가 붙어 있다. x축은 기수(앞), y축은 오른쪽, z축은 아래를 향하고, 세 축 둘레에 각각 롤 φ, 피치 θ, 요 ψ 회전을 나타내는 곡선 화살표가 그려져 있다. 기체 좌표는 기체와 함께 돈다. 아래쪽에는 땅에 고정된 세계 좌표 NED가 있다. home 원점에서 x는 북, y는 동, z는 땅속(아래)을 향한다." viewBox="0 0 320 424" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>기체 좌표(FRD)와 세계 좌표(NED), 그리고 롤 · 피치 · 요</title>
  <defs>
    <marker id="fad-hdr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
    <marker id="fad-hdr-arrow-acc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-color)"/>
    </marker>
    <marker id="fad-hdr-arrow-sec" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">숫자에는 기준이 있다</text>
  <!-- body frame label -->
  <text x="12" y="48" font-size="14" font-weight="700" fill="currentColor">기체 좌표 · FRD</text>
  <text x="12" y="66" font-size="12" fill="var(--text-light)">기체와 함께 돈다</text>
  <!-- quadcopter (oblique top view, X layout) -->
  <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
    <line x1="140" y1="150" x2="195" y2="137"/>
    <line x1="140" y1="150" x2="85" y2="163"/>
    <line x1="140" y1="150" x2="114" y2="122"/>
    <line x1="140" y1="150" x2="166" y2="178"/>
  </g>
  <g fill="var(--gold-soft)" stroke="currentColor" stroke-width="1.5">
    <ellipse cx="195" cy="134" rx="22" ry="7"/>
    <ellipse cx="85" cy="160" rx="22" ry="7"/>
    <ellipse cx="114" cy="119" rx="22" ry="7"/>
    <ellipse cx="166" cy="175" rx="22" ry="7"/>
  </g>
  <circle cx="140" cy="150" r="10" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <!-- body axes FRD -->
  <g stroke="currentColor" stroke-width="2.5" fill="none">
    <line x1="140" y1="150" x2="198" y2="70" marker-end="url(#fad-hdr-arrow)"/>
    <line x1="140" y1="150" x2="290" y2="177" marker-end="url(#fad-hdr-arrow)"/>
    <line x1="140" y1="150" x2="140" y2="245" marker-end="url(#fad-hdr-arrow)"/>
  </g>
  <g font-size="12" font-weight="700" fill="currentColor">
    <text x="204" y="70">x 앞(F)</text>
    <text x="308" y="212" text-anchor="end">y 오른쪽(R)</text>
    <text x="148" y="260">z 아래(D)</text>
  </g>
  <!-- rotations: roll about x, pitch about y, yaw about z (positive sense) -->
  <g stroke="var(--accent-color)" stroke-width="2" fill="none" stroke-linecap="round">
    <path d="M178.4,72.2 L184.9,73.4 L191.0,76.9 L196.0,82.2 L199.3,88.8 L200.4,95.9 L199.3,102.5 L196.0,107.9 L191.0,111.5 L184.9,112.8 L178.4,111.6 L172.2,108.1" marker-end="url(#fad-hdr-arrow-acc)"/>
    <path d="M253.6,177.5 L253.6,184.5 L254.4,189.9 L255.9,193.1 L258.0,193.8 L260.3,191.8 L262.6,187.3 L264.7,181.0 L266.2,173.6 L267.0,166.0 L267.0,159.0 L266.2,153.6" marker-end="url(#fad-hdr-arrow-acc)"/>
    <path d="M110.0,224.1 L112.1,218.6 L118.3,213.8 L127.5,210.5 L138.5,209.1 L149.8,209.9 L159.6,212.7 L166.6,217.2 L169.8,222.6 L168.8,228.3 L163.6,233.3 L155.0,237.1" marker-end="url(#fad-hdr-arrow-acc)"/>
  </g>
  <g font-size="12" font-weight="700" fill="var(--accent-color)">
    <text x="166" y="86" text-anchor="end">롤 φ</text>
    <text x="262" y="146" text-anchor="middle">피치 θ</text>
    <text x="104" y="234" text-anchor="end">요 ψ</text>
  </g>
  <!-- divider -->
  <line x1="12" y1="276" x2="308" y2="276" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.5"/>
  <!-- world frame NED (fixed to the ground) -->
  <polygon points="39,362 76,310 180,329 142,381" fill="var(--gold-soft)" stroke="var(--secondary-color)" stroke-width="1.2" stroke-dasharray="5 3"/>
  <g stroke="var(--secondary-color)" stroke-width="2.5" fill="none">
    <line x1="90" y1="350" x2="124" y2="303" marker-end="url(#fad-hdr-arrow-sec)"/>
    <line x1="90" y1="350" x2="175" y2="365" marker-end="url(#fad-hdr-arrow-sec)"/>
    <line x1="90" y1="350" x2="90" y2="405" marker-end="url(#fad-hdr-arrow-sec)"/>
  </g>
  <circle cx="90" cy="350" r="4" fill="var(--secondary-color)"/>
  <g font-size="12" font-weight="700" fill="currentColor">
    <text x="130" y="302">x 북(N)</text>
    <text x="182" y="372">y 동(E)</text>
    <text x="98" y="414">z 아래(D)</text>
  </g>
  <text x="308" y="312" text-anchor="end" font-size="14" font-weight="700" fill="currentColor">세계 좌표 · NED</text>
  <text x="308" y="330" text-anchor="end" font-size="12" fill="var(--text-light)">땅에 고정</text>
  <text x="308" y="348" text-anchor="end" font-size="12" fill="var(--text-light)">원점 ≈ home</text>
</svg>
<figcaption>기체 좌표(FRD)는 기체와 함께 돌고 세계 좌표(NED)는 땅에 고정된다 — 롤·피치·요는 body 축 둘레의 회전이다</figcaption>
</figure>

## 들어가며

이 글은 `Drone-Control-Essential` 시리즈의 **2단계**입니다. 전체 흐름은 [Drone Control Essential Curriculum](/2026/11/05/drone-control-essential-curriculum.html)에서 확인하고, 직전 단계 [UAS 전체 지도](/2026/11/05/drone-uas-system-map.html)를 먼저 읽으면 좋습니다.

1단계에서 통제 앱의 역할을 "목표를 주고, 관찰하고, 실패에 대응하는 것"으로 정했습니다. 그런데 관찰하는 대상은 전부 **숫자**입니다. `vz = 150`이 올라가는 중이라는 뜻일까요, 내려가는 중이라는 뜻일까요? `yaw = 1.57`은 동쪽일까요, 북쪽일까요? 같은 기체를 PX4 로그와 ROS 2 토픽으로 보면 왜 축이 뒤집혀 있을까요? 이 질문에 답하지 못하면 앱은 지도 위에서 기체를 엉뚱한 방향으로 그리게 됩니다.

2단계는 세 가지를 다룹니다. 숫자의 **기준(좌표계)**, 기체가 어느 쪽을 보고 있는지의 **표현(자세)**, 그리고 멀티콥터가 그 자세를 바꿔 **움직이는 원리(비행 역학)** 입니다. 수식은 최소로 두고, 각 개념을 짧은 Python 코드로 확인합니다.

<div class="post-summary-box" markdown="1">

### 📌 이 글에서 다루는 내용

#### 🔍 핵심 주제

- **좌표계**: NED vs ENU, body frame(FRD/FLU), 로컬 원점(home), MAVLink 메시지의 단위와 부호 규약 — PX4/MAVLink/ROS가 서로 다른 규약을 쓰는 지점
- **자세 표현**: 오일러각(롤·피치·요)과 짐벌 락, 회전행렬, 쿼터니언 — 왜 FC 내부는 쿼터니언을 쓰는가
- **멀티콥터 비행 역학**: 6-DOF, 추력·토크와 롤/피치/요/스로틀, 반토크와 요 제어, 믹서(제어 할당)

</div>

## 1. 좌표계 — 숫자에는 기준이 있다

### 1.1 세계 좌표: NED와 ENU

기체의 위치와 속도를 표현하려면 먼저 땅에 고정된 기준 축이 필요합니다. 드론 분야에서는 두 가지 규약이 경쟁합니다.

| 규약 | x축 | y축 | z축 | 주로 쓰는 곳 |
| --- | --- | --- | --- | --- |
| **NED** (North-East-Down) | 북 | 동 | **아래** | 항공 전통, PX4 내부, MAVLink 로컬 메시지 |
| **ENU** (East-North-Up) | 동 | 북 | **위** | ROS(REP-103), 지도·GIS, 로봇공학 |

NED에서 z가 아래를 향하는 이유는 오른손 좌표계 때문입니다. x=북, y=동을 고정한 채 오른손 좌표계를 유지하면 z는 아래가 되고, 그 덕에 항공에서 쓰는 heading(북→동, 시계 방향으로 잰 방위각)이 z축 기준 양의 회전과 일치합니다. 대신 로컬 NED에서는 원점보다 **위에 있는 기체의 z가 음수**라는 점을 늘 기억해야 합니다.

두 규약의 변환은 단순합니다. x와 y를 맞바꾸고 z의 부호를 뒤집으면 됩니다. 각도에서는 함정이 하나 있습니다. NED의 yaw는 **북에서 시계 방향**, ENU의 yaw는 **동에서 반시계 방향**으로 잽니다.

```python
import numpy as np

def ned_to_enu(p):
    """NED 위치/속도 벡터 → ENU. x·y 교환, z 부호 반전."""
    n, e, d = p
    return np.array([e, n, -d])

def yaw_ned_to_enu(yaw):
    """NED yaw(북 기준·시계) → ENU yaw(동 기준·반시계), [-π, π)로 정규화."""
    return (np.pi / 2 - yaw + np.pi) % (2 * np.pi) - np.pi

print(ned_to_enu([10.0, 5.0, -30.0]))             # [ 5. 10. 30.]  고도 30m 위
print(np.degrees(yaw_ned_to_enu(np.radians(90))))  # 0.0  NED 동쪽(90°) = ENU 0°
```

### 1.2 기체 좌표: FRD와 FLU

세계 좌표와 별개로, 기체에 붙어 함께 움직이는 **body frame**이 있습니다. 센서(IMU)는 body frame 기준으로 값을 내고, 제어기는 body frame 기준으로 토크를 계산합니다.

| 규약 | x축 | y축 | z축 | 짝을 이루는 세계 좌표 |
| --- | --- | --- | --- | --- |
| **FRD** (Forward-Right-Down) | 기수 | 오른쪽 | 아래 | NED (PX4, MAVLink) |
| **FLU** (Forward-Left-Up) | 기수 | 왼쪽 | 위 | ENU (ROS) |

FRD↔FLU 변환은 y와 z의 부호를 뒤집는 것입니다. PX4와 ROS 2를 연결하는 브리지(uXRCE-DDS)는 메시지를 PX4 규약(NED/FRD) 그대로 내보내므로, ROS 쪽 코드가 변환을 직접 책임져야 합니다(`px4_ros_com`의 `frame_transforms` 헬퍼가 표준 도구입니다). 자세 쿼터니언은 벡터처럼 성분만 바꿔서는 안 되고 세계·기체 좌표 양쪽의 회전을 함께 적용해야 합니다. "ROS에서 보니 기체가 거꾸로 날고 있다"는 버그의 상당수가 여기서 나옵니다.

<figure class="post-figure">
<svg role="img" aria-label="두 쌍의 좌표 규약 비교. 위 줄은 땅에 고정된 세계 좌표다. 왼쪽 NED(PX4·MAVLink)는 x가 북, y가 동, z가 아래를 향해 위로 30m는 z = −30이다. 오른쪽 ENU(ROS·지도)는 x가 동, y가 북, z가 위를 향해 위로 30m는 z = +30이다. 둘 사이 변환은 x·y 교환과 z 부호 반전이다. 아래 줄은 기체와 함께 도는 기체 좌표다. 왼쪽 FRD(PX4·MAVLink)는 x가 기수, y가 오른쪽, z가 아래이고, 오른쪽 FLU(ROS)는 x가 기수, y가 왼쪽, z가 위다. 둘 사이 변환은 y·z 부호 반전이다. z축은 강조색으로, 아래 규약은 아래로, 위 규약은 위로 그려져 있다." viewBox="0 0 320 568" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>NED vs ENU, FRD vs FLU — z가 아래인가 위인가</title>
  <defs>
    <marker id="fad-frm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
    <marker id="fad-frm-arrow-acc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-color)"/>
    </marker>
  </defs>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">같은 축, 다른 규약</text>
  <!-- ===== row 1: world frames ===== -->
  <text x="8" y="46" font-size="12" font-weight="700" fill="var(--text-light)">세계 좌표 — 땅에 고정</text>
  <rect x="8" y="56" width="148" height="218" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <rect x="164" y="56" width="148" height="218" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <text x="82" y="78" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">NED</text>
  <text x="82" y="95" text-anchor="middle" font-size="12" fill="var(--text-light)">PX4 · MAVLink</text>
  <text x="238" y="78" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">ENU</text>
  <text x="238" y="95" text-anchor="middle" font-size="12" fill="var(--text-light)">ROS · 지도</text>
  <!-- NED axes -->
  <g stroke="currentColor" stroke-width="2" fill="none">
    <line x1="46" y1="180" x2="82" y2="140" marker-end="url(#fad-frm-arrow)"/>
    <line x1="46" y1="180" x2="112" y2="190" marker-end="url(#fad-frm-arrow)"/>
  </g>
  <line x1="46" y1="180" x2="46" y2="238" stroke="var(--accent-color)" stroke-width="3.5" marker-end="url(#fad-frm-arrow-acc)"/>
  <circle cx="46" cy="180" r="3.5" fill="currentColor"/>
  <g font-size="12" font-weight="700" fill="currentColor">
    <text x="88" y="140">x 북(N)</text>
    <text x="112" y="207" text-anchor="middle">y 동(E)</text>
  </g>
  <text x="54" y="240" font-size="12" font-weight="700" fill="var(--accent-color)">z 아래(D) ↓</text>
  <text x="82" y="264" text-anchor="middle" font-size="12" fill="currentColor">위로 30m → z = −30</text>
  <!-- ENU axes -->
  <g stroke="currentColor" stroke-width="2" fill="none">
    <line x1="202" y1="180" x2="268" y2="190" marker-end="url(#fad-frm-arrow)"/>
    <line x1="202" y1="180" x2="238" y2="140" marker-end="url(#fad-frm-arrow)"/>
  </g>
  <line x1="202" y1="180" x2="202" y2="122" stroke="var(--accent-color)" stroke-width="3.5" marker-end="url(#fad-frm-arrow-acc)"/>
  <circle cx="202" cy="180" r="3.5" fill="currentColor"/>
  <g font-size="12" font-weight="700" fill="currentColor">
    <text x="268" y="207" text-anchor="middle">x 동(E)</text>
    <text x="244" y="140">y 북(N)</text>
  </g>
  <text x="202" y="114" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent-color)">z 위(U) ↑</text>
  <text x="238" y="264" text-anchor="middle" font-size="12" fill="currentColor">위로 30m → z = +30</text>
  <text x="160" y="296" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent-color)">NED ↔ ENU : x·y 교환, z 부호 반전</text>
  <!-- ===== row 2: body frames ===== -->
  <text x="8" y="324" font-size="12" font-weight="700" fill="var(--text-light)">기체 좌표 — 기체와 함께 회전</text>
  <rect x="8" y="334" width="148" height="198" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <rect x="164" y="334" width="148" height="198" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <text x="82" y="356" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">FRD</text>
  <text x="82" y="373" text-anchor="middle" font-size="12" fill="var(--text-light)">PX4 · MAVLink</text>
  <text x="238" y="356" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">FLU</text>
  <text x="238" y="373" text-anchor="middle" font-size="12" fill="var(--text-light)">ROS</text>
  <!-- FRD: small quad + axes -->
  <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <line x1="78" y1="460" x2="106" y2="453"/>
    <line x1="78" y1="460" x2="50" y2="467"/>
    <line x1="78" y1="460" x2="65" y2="446"/>
    <line x1="78" y1="460" x2="91" y2="474"/>
  </g>
  <g fill="var(--gold-soft)" stroke="currentColor" stroke-width="1.2">
    <ellipse cx="106" cy="451" rx="10" ry="3.5"/>
    <ellipse cx="50" cy="465" rx="10" ry="3.5"/>
    <ellipse cx="65" cy="444" rx="10" ry="3.5"/>
    <ellipse cx="91" cy="472" rx="10" ry="3.5"/>
  </g>
  <g stroke="currentColor" stroke-width="2" fill="none">
    <line x1="78" y1="460" x2="109" y2="418" marker-end="url(#fad-frm-arrow)"/>
    <line x1="78" y1="460" x2="136" y2="471" marker-end="url(#fad-frm-arrow)"/>
  </g>
  <line x1="78" y1="460" x2="78" y2="512" stroke="var(--accent-color)" stroke-width="3.5" marker-end="url(#fad-frm-arrow-acc)"/>
  <circle cx="78" cy="460" r="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <g font-size="12" font-weight="700" fill="currentColor">
    <text x="113" y="420">x 앞(F)</text>
    <text x="152" y="490" text-anchor="end">y 오른쪽(R)</text>
  </g>
  <text x="86" y="520" font-size="12" font-weight="700" fill="var(--accent-color)">z 아래(D) ↓</text>
  <!-- FLU: small quad + axes -->
  <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <line x1="234" y1="460" x2="262" y2="453"/>
    <line x1="234" y1="460" x2="206" y2="467"/>
    <line x1="234" y1="460" x2="221" y2="446"/>
    <line x1="234" y1="460" x2="247" y2="474"/>
  </g>
  <g fill="var(--gold-soft)" stroke="currentColor" stroke-width="1.2">
    <ellipse cx="262" cy="451" rx="10" ry="3.5"/>
    <ellipse cx="206" cy="465" rx="10" ry="3.5"/>
    <ellipse cx="221" cy="444" rx="10" ry="3.5"/>
    <ellipse cx="247" cy="472" rx="10" ry="3.5"/>
  </g>
  <g stroke="currentColor" stroke-width="2" fill="none">
    <line x1="234" y1="460" x2="265" y2="418" marker-end="url(#fad-frm-arrow)"/>
    <line x1="234" y1="460" x2="176" y2="449" marker-end="url(#fad-frm-arrow)"/>
  </g>
  <line x1="234" y1="460" x2="234" y2="408" stroke="var(--accent-color)" stroke-width="3.5" marker-end="url(#fad-frm-arrow-acc)"/>
  <circle cx="234" cy="460" r="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <g font-size="12" font-weight="700" fill="currentColor">
    <text x="271" y="422">x 앞(F)</text>
    <text x="172" y="438">y 왼쪽(L)</text>
  </g>
  <text x="234" y="400" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent-color)">z 위(U) ↑</text>
  <text x="160" y="556" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent-color)">FRD ↔ FLU : y·z 부호 반전</text>
</svg>
<figcaption>위 줄은 세계 좌표, 아래 줄은 기체 좌표 — 왼쪽(PX4·MAVLink)은 z가 아래, 오른쪽(ROS)은 z가 위다</figcaption>
</figure>

### 1.3 로컬 원점과 고도의 기준

로컬 NED 좌표의 원점은 보통 **EKF가 초기화된 지점이나 home 위치**입니다. 그래서 `LOCAL_POSITION_NED`의 `(x, y, z) = (10, 5, -30)`은 "원점에서 북쪽 10m, 동쪽 5m, 30m 위"라는 뜻이고, 다른 비행에서 같은 숫자가 같은 장소를 뜻한다는 보장이 없습니다. 지도에 그리거나 여러 기체를 비교하려면 위경도(전역 좌표)를 써야 합니다.

고도에는 기준이 여러 개 있습니다 — 해발(AMSL), 타원체고(WGS84 ellipsoid), home 기준 상대 고도, 지면 기준 고도(AGL). 이 차이와 위경도↔로컬 변환은 4단계(GNSS·항법)에서 다룹니다. 지금은 **"고도 숫자를 볼 때마다 기준을 묻는다"** 는 습관만 들이면 됩니다.

### 1.4 MAVLink 메시지의 단위와 부호

통제 앱이 실제로 받는 숫자들입니다. 같은 "속도"와 "방향"이라도 메시지마다 단위·부호가 다릅니다.

| 메시지 · 필드 | 단위 | 기준·부호 | 함정 |
| --- | --- | --- | --- |
| `GLOBAL_POSITION_INT.lat`, `lon` | degE7 (정수) | WGS84 | 1e7로 나눠야 도(°) |
| `GLOBAL_POSITION_INT.alt` / `relative_alt` | mm | 해발 / home 기준 | 둘을 혼동하면 수십~수백 m 차이 |
| `GLOBAL_POSITION_INT.vx`, `vy`, `vz` | cm/s | NED, **vz는 아래가 양수** | 상승 중이면 vz < 0 |
| `GLOBAL_POSITION_INT.hdg` | cdeg (0~35999) | 북 기준 시계 방향 | 모르면 `UINT16_MAX` |
| `VFR_HUD.climb` | m/s | **위가 양수** | 위의 vz와 부호가 반대 |
| `LOCAL_POSITION_NED.x`, `y`, `z` | m | 로컬 NED, z는 아래가 양수 | 원점이 비행마다 다를 수 있음 |
| `ATTITUDE.roll`, `pitch`, `yaw` | rad | FRD body ↔ NED, yaw ±π | 도(°)로 변환 필요 |
| `ATTITUDE_QUATERNION.q1..q4` | — | (w, x, y, z) 순서 | 라이브러리마다 (x, y, z, w) 순서도 있음 |

이 표를 하나의 원칙으로 줄이면: **앱 경계에서 단 한 번, 내부 표준 단위·좌표계로 변환하고, 그 뒤로는 섞지 않는다**입니다. 변환이 여기저기 흩어지면 부호 실수는 반드시 생깁니다.

## 2. 자세 표현 — 기체는 어느 쪽을 보고 있는가

### 2.1 오일러각: 직관적이지만 위험한

**자세(attitude)** 는 body frame이 세계 좌표에 대해 얼마나 회전해 있는지입니다. 가장 직관적인 표현은 세 번의 회전으로 나누는 **오일러각**입니다. 항공에서는 요(yaw, ψ) → 피치(pitch, θ) → 롤(roll, φ) 순서(ZYX)로 돌리는 규약을 씁니다.

- **롤(φ)**: 기수 축(x) 기준 회전. 양수 = 오른쪽 날개가 내려감
- **피치(θ)**: 오른쪽 축(y) 기준 회전. 양수 = 기수가 들림
- **요(ψ)**: 아래 축(z) 기준 회전. 양수 = 위에서 볼 때 시계 방향(기수가 오른쪽으로)

사람이 읽기에는 최고입니다. 통제 앱 UI의 자세계(인공 수평선)와 나침반도 오일러각으로 그립니다. 문제는 **피치가 ±90°에 가까워질 때** 생깁니다.

### 2.2 짐벌 락: 자유도 하나가 사라지는 순간

피치가 정확히 90°가 되면(기수가 수직으로 하늘을 향하면) 롤 축과 요 축이 같은 방향으로 겹칩니다. 이때는 롤과 요를 따로 구분할 수 없고 **둘의 차이만** 의미를 가집니다. 서로 다른 오일러각 조합이 같은 자세를 가리키게 되는 것입니다.

> 이 글의 코드 블록은 하나의 세션에서 위에서부터 이어서 실행한다고 가정합니다(`np`, `m`, `g` 등을 앞 블록에서 정의).

```python
def euler_to_quat(roll, pitch, yaw):
    """ZYX 오일러각 → 쿼터니언 (w, x, y, z)."""
    cr, sr = np.cos(roll / 2), np.sin(roll / 2)
    cp, sp = np.cos(pitch / 2), np.sin(pitch / 2)
    cy, sy = np.cos(yaw / 2), np.sin(yaw / 2)
    return np.array([
        cr * cp * cy + sr * sp * sy,
        sr * cp * cy - cr * sp * sy,
        cr * sp * cy + sr * cp * sy,
        cr * cp * sy - sr * sp * cy,
    ])

def quat_to_dcm(q):
    """쿼터니언 → 회전행렬 (body 벡터를 NED 벡터로 바꾼다)."""
    w, x, y, z = q / np.linalg.norm(q)
    return np.array([
        [1 - 2*(y*y + z*z), 2*(x*y - w*z),     2*(x*z + w*y)],
        [2*(x*y + w*z),     1 - 2*(x*x + z*z), 2*(y*z - w*x)],
        [2*(x*z - w*y),     2*(y*z + w*x),     1 - 2*(x*x + y*y)],
    ])

deg = np.radians
# 피치 90°에서 (롤 10°, 요 0°)와 (롤 20°, 요 10°)는 '같은 자세'다
R1 = quat_to_dcm(euler_to_quat(deg(10), deg(90), deg(0)))
R2 = quat_to_dcm(euler_to_quat(deg(20), deg(90), deg(10)))
print(np.allclose(R1, R2))  # True — 짐벌 락

# 기수를 30° 든 기체의 '앞쪽(body x)'은 NED에서 어디를 향하나?
print(np.round(quat_to_dcm(euler_to_quat(0, deg(30), 0)) @ [1, 0, 0], 3))
# [ 0.866  0.    -0.5  ]  북쪽으로 0.866, z가 음수 = 위로 0.5
```

일반 비행에서 멀티콥터가 피치 90°가 될 일은 드물지만, 그 근처에서도 오일러각의 미분(각속도와의 관계)이 발산하기 시작해 수치적으로 불안정해집니다. 곡예 비행을 하는 FPV 기체, 수직으로 서서 나는 tailsitter VTOL에서는 실제로 문제가 됩니다. 그래서 FC의 상태 추정과 자세 제어 핵심은 오일러각으로 계산하지 않습니다.

### 2.3 회전행렬과 쿼터니언

| 표현 | 숫자 수 | 특이점 | 장점 | 단점 |
| --- | --- | --- | --- | --- |
| **오일러각** | 3 | 있음 (피치 ±90°) | 사람이 읽기 쉬움 | 짐벌 락, 회전 합성이 번거로움 |
| **회전행렬 (DCM)** | 9 | 없음 | 벡터 변환이 행렬 곱 한 번 | 중복 정보가 많고, 계산 오차가 쌓이면 직교성이 깨짐 |
| **쿼터니언** | 4 | 없음 | 특이점 없음, 합성·보간이 저렴, 정규화가 쉬움 | 직관적이지 않음, q와 −q가 같은 회전 |

**쿼터니언**은 "어떤 축을 중심으로 얼마나 돌았는가"를 네 개의 숫자 `(w, x, y, z)`로 담습니다. 회전 축 단위 벡터가 `n`, 회전각이 `α`라면 `q = (cos(α/2), n·sin(α/2))`입니다. 길이가 1인 쿼터니언만 회전을 뜻하므로, 계산 오차가 쌓여도 길이를 1로 다시 나눠 주기만 하면 됩니다.

PX4·ArduPilot의 상태 추정기(EKF)와 자세 제어기는 내부적으로 쿼터니언(또는 회전행렬)을 쓰고, 사람에게 보여 줄 때만 오일러각으로 바꿉니다. 통제 앱도 같은 원칙을 따르는 것이 좋습니다. **계산과 저장은 쿼터니언, 표시만 오일러각**입니다. 다만 1.4절의 표처럼 쿼터니언의 성분 순서는 라이브러리마다 다르니(`w` 먼저 vs 나중), 경계에서 반드시 확인해야 합니다.

## 3. 멀티콥터 비행 역학 — 모터 네 개로 여섯 자유도를

### 3.1 6-DOF와 "부족 구동"

공중의 강체는 **6자유도(6-DOF)** 를 가집니다. 위치 3개(x, y, z)와 회전 3개(롤, 피치, 요)입니다. 그런데 쿼드콥터의 입력은 모터 네 개의 회전수뿐입니다. 입력(4)이 자유도(6)보다 적은 시스템을 **부족 구동(underactuated)** 시스템이라고 합니다.

모터는 모두 위를 향해 고정되어 있으니, 추력은 언제나 **body z축 방향**으로만 나옵니다. 옆으로 미는 힘을 직접 만들 수 없다는 뜻입니다. 그래서 멀티콥터가 앞으로 가려면 **먼저 기수를 숙여** 추력 벡터를 기울이고, 그 수평 성분으로 가속합니다. 이것이 5단계에서 다룰 캐스케이드 제어의 출발점입니다 — 위치를 바꾸려면 속도를, 속도를 바꾸려면 자세를, 자세를 바꾸려면 각속도를 바꿔야 합니다.

고도를 유지하면서 수평으로 `a`만큼 가속하려면 기울기 `θ`와 총추력 `T`가 다음을 만족해야 합니다.

```python
m, g = 1.5, 9.81   # 1.5 kg 쿼드콥터
a = 3.0            # 수평 가속 3 m/s²

tilt = np.degrees(np.arctan(a / g))   # tan θ = a / g
thrust = m * np.hypot(g, a)           # 수직 성분이 mg를 유지해야 함
print(round(tilt, 1), round(thrust, 2), round(m * g, 2))
# 17.0 15.39 14.71  → 17° 기울이고, 호버보다 약 5% 더 큰 추력
```

<figure class="post-figure">
<svg role="img" aria-label="옆에서 본 쿼드콥터가 진행 방향(오른쪽)으로 기수를 θ ≈ 17° 숙이고 있다. 추력 T(약 15.39 N)는 body의 위쪽 방향으로 나오므로 수직에서 θ만큼 기울어 있다. T는 수직 성분 T cos θ와 수평 성분 T sin θ로 나뉘며, 수직 성분은 중력 mg(약 14.71 N)와 같아야 고도가 유지되고, 수평 성분이 가속 a = 3 m/s²를 만든다. 아래에는 tan θ = a / g, T = m·√(g² + a²) ≈ 15.39 N, 호버 추력보다 약 5% 크다는 계산이 적혀 있다." viewBox="0 0 320 368" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>추력 벡터 기울이기 — 수직 성분은 mg를 버티고, 수평 성분이 가속을 만든다</title>
  <defs>
    <marker id="fad-tilt-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
    <marker id="fad-tilt-arrow-acc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-color)"/>
    </marker>
    <marker id="fad-tilt-arrow-sec" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">앞으로 가려면 먼저 기울인다</text>
  <!-- tilted quad (side view, nose to the right, pitched down by θ) -->
  <g transform="rotate(17 130 160)">
    <line x1="70" y1="160" x2="190" y2="160" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <rect x="114" y="151" width="32" height="18" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
    <rect x="66" y="150" width="8" height="10" fill="currentColor"/>
    <rect x="186" y="150" width="8" height="10" fill="currentColor"/>
    <line x1="50" y1="148" x2="90" y2="148" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <line x1="170" y1="148" x2="210" y2="148" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  </g>
  <!-- components (tip-to-tail): vertical T cos θ, then horizontal T sin θ -->
  <line x1="130" y1="160" x2="130" y2="58" stroke="var(--secondary-color)" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#fad-tilt-arrow-sec)"/>
  <line x1="130" y1="55" x2="159" y2="55" stroke="var(--secondary-color)" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#fad-tilt-arrow-sec)"/>
  <!-- thrust T along body up (-z) -->
  <line x1="130" y1="160" x2="162" y2="55" stroke="var(--accent-color)" stroke-width="3.5" marker-end="url(#fad-tilt-arrow-acc)"/>
  <!-- theta arc -->
  <path d="M130,114 A46,46 0 0,1 143.4,116" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <text x="138" y="106" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">θ</text>
  <!-- gravity -->
  <line x1="130" y1="160" x2="130" y2="262" stroke="currentColor" stroke-width="3" marker-end="url(#fad-tilt-arrow)"/>
  <g font-size="12" font-weight="700">
    <text x="166" y="98" fill="var(--accent-color)">T ≈ 15.39 N</text>
    <text x="122" y="96" text-anchor="end" fill="var(--secondary-color)">T cos θ = mg</text>
    <text x="146" y="44" text-anchor="middle" fill="var(--secondary-color)">T sin θ = m·a</text>
    <text x="138" y="252" fill="currentColor">mg ≈ 14.71 N</text>
  </g>
  <!-- direction of travel -->
  <line x1="236" y1="214" x2="304" y2="214" stroke="currentColor" stroke-width="2.5" marker-end="url(#fad-tilt-arrow)"/>
  <text x="270" y="204" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">a = 3 m/s²</text>
  <text x="270" y="232" text-anchor="middle" font-size="12" fill="var(--text-light)">진행 방향</text>
  <!-- calculation panel -->
  <rect x="8" y="282" width="304" height="78" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <g font-size="12" fill="currentColor">
    <text x="20" y="304">tan θ = a / g → θ ≈ 17°</text>
    <text x="20" y="324">T = m·√(g² + a²) ≈ 15.39 N</text>
    <text x="20" y="344">호버 mg ≈ 14.71 N → 약 5% 더 큰 추력</text>
  </g>
</svg>
<figcaption>추력은 body 위쪽으로만 나온다 — 기수를 θ만큼 숙이면 수평 성분이 가속을, 수직 성분이 고도 유지를 맡는다 (1.5 kg, a = 3 m/s² 예시)</figcaption>
</figure>

기울일수록 추력의 수직 성분이 줄어들기 때문에, 고도를 유지하려면 총추력을 올려야 합니다. 모터 여유(추력 대 중량비)가 부족한 기체가 빠르게 이동하면 고도를 잃는 이유입니다([3단계](/2026/11/05/drone-airframe-sensors-actuators.html)).

### 3.2 추력과 반토크: 네 가지 조종 입력

모터 `i`가 회전 속도 `ωᵢ`로 돌면 두 가지가 생깁니다.

- **추력** `Tᵢ ≈ k_T · ωᵢ²` — 프로펠러가 공기를 밀어내 생기는 위쪽 힘
- **반토크** `Qᵢ ≈ k_Q · ωᵢ²` — 프로펠러를 돌리는 데 드는 토크의 반작용으로, 프레임을 **프로펠러와 반대 방향**으로 돌리려는 토크

쿼드콥터는 대각선 모터끼리 같은 방향으로, 이웃 모터끼리 반대 방향으로 돕니다. 그래서 정상 상태에서는 반토크가 상쇄되어 기체가 돌지 않습니다. 이 구성에서 네 가지 조종 입력이 나옵니다.

| 입력 | 만드는 방법 | 결과 |
| --- | --- | --- |
| **스로틀** (총추력) | 네 모터를 함께 올리거나 내림 | 상승·하강 |
| **롤** | 왼쪽 쌍 vs 오른쪽 쌍의 추력 차이 | 좌우로 기울어짐 |
| **피치** | 앞쪽 쌍 vs 뒤쪽 쌍의 추력 차이 | 앞뒤로 기울어짐 |
| **요** | 시계 방향 쌍 vs 반시계 방향 쌍의 회전수 차이 | 반토크 불균형으로 제자리 회전 |

<figure class="post-figure">
<svg role="img" aria-label="위에서 내려다본 PX4 Quadrotor X 배치. 기수는 위쪽이다. 1번 모터는 앞-오른쪽에서 반시계(CCW), 2번은 뒤-왼쪽에서 반시계(CCW), 3번은 앞-왼쪽에서 시계(CW), 4번은 뒤-오른쪽에서 시계(CW) 방향으로 돈다. 대각선 모터끼리 같은 방향으로 돌아 정상 상태에서는 반토크가 상쇄된다. 아래 세 칸은 조종 입력별로 빨라지는 모터를 강조한다. 롤 오른쪽은 왼쪽 모터 2·3(믹서 출력 3.396, 3.962, 3.962, 3.396), 피치 업(기수 들기)은 앞쪽 모터 1·3(믹서 출력 3.962, 3.396, 3.962, 3.396), 요 오른쪽은 반시계 모터 1·2(믹서 출력 4.46, 4.46, 2.898, 2.898)가 빨라진다." viewBox="0 0 320 588" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>PX4 Quad X — 모터 번호, 회전 방향, 조종 입력별로 빨라지는 모터</title>
  <defs>
    <marker id="fad-mix-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
    <marker id="fad-mix-arrow-ccw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--accent-color)"/>
    </marker>
    <marker id="fad-mix-arrow-cw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--secondary-color)"/>
    </marker>
  </defs>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">PX4 Quad X — 위에서 본 모습</text>
  <!-- nose direction -->
  <line x1="160" y1="140" x2="160" y2="66" stroke="currentColor" stroke-width="2.5" marker-end="url(#fad-mix-arrow)"/>
  <text x="160" y="54" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">앞 (기수)</text>
  <text x="312" y="164" text-anchor="end" font-size="12" fill="var(--text-light)">오른쪽</text>
  <text x="8" y="164" font-size="12" fill="var(--text-light)">왼쪽</text>
  <g stroke="currentColor" stroke-width="4" stroke-linecap="round">
    <line x1="160" y1="160" x2="230" y2="90"/>
    <line x1="160" y1="160" x2="90" y2="230"/>
    <line x1="160" y1="160" x2="90" y2="90"/>
    <line x1="160" y1="160" x2="230" y2="230"/>
  </g>
  <rect x="146" y="146" width="28" height="28" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <circle cx="230" cy="90" r="28" fill="var(--gold-soft)" stroke="currentColor" stroke-width="2"/>
  <path d="M230.0,128.0 A38,38 0 1,0 192.0,90.0" fill="none" stroke="var(--accent-color)" stroke-width="2.5" marker-end="url(#fad-mix-arrow-ccw)"/>
  <text x="230" y="92" text-anchor="middle" font-size="18" font-weight="700" fill="currentColor">1</text>
  <text x="230" y="108" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent-color)">CCW</text>
  <circle cx="90" cy="230" r="28" fill="var(--gold-soft)" stroke="currentColor" stroke-width="2"/>
  <path d="M90.0,192.0 A38,38 0 1,0 128.0,230.0" fill="none" stroke="var(--accent-color)" stroke-width="2.5" marker-end="url(#fad-mix-arrow-ccw)"/>
  <text x="90" y="232" text-anchor="middle" font-size="18" font-weight="700" fill="currentColor">2</text>
  <text x="90" y="248" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent-color)">CCW</text>
  <circle cx="90" cy="90" r="28" fill="var(--gold-soft)" stroke="currentColor" stroke-width="2"/>
  <path d="M90.0,128.0 A38,38 0 1,1 128.0,90.0" fill="none" stroke="var(--secondary-color)" stroke-width="2.5" marker-end="url(#fad-mix-arrow-cw)"/>
  <text x="90" y="92" text-anchor="middle" font-size="18" font-weight="700" fill="currentColor">3</text>
  <text x="90" y="108" text-anchor="middle" font-size="12" font-weight="700" fill="var(--secondary-color)">CW</text>
  <circle cx="230" cy="230" r="28" fill="var(--gold-soft)" stroke="currentColor" stroke-width="2"/>
  <path d="M230.0,192.0 A38,38 0 1,1 192.0,230.0" fill="none" stroke="var(--secondary-color)" stroke-width="2.5" marker-end="url(#fad-mix-arrow-cw)"/>
  <text x="230" y="232" text-anchor="middle" font-size="18" font-weight="700" fill="currentColor">4</text>
  <text x="230" y="248" text-anchor="middle" font-size="12" font-weight="700" fill="var(--secondary-color)">CW</text>
  <text x="160" y="292" text-anchor="middle" font-size="12" fill="currentColor">대각선끼리 같은 방향 → 정상 상태에선 반토크 상쇄</text>
  <text x="160" y="322" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">조종 입력별로 빨라지는 모터</text>
  <!-- row 1: 롤 오른쪽 (+φ) -->
  <rect x="8" y="334" width="304" height="76" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <line x1="50" y1="346" x2="50" y2="338" stroke="currentColor" stroke-width="2" marker-end="url(#fad-mix-arrow)"/>
  <g stroke="currentColor" stroke-width="2" opacity="0.6"><line x1="30" y1="352" x2="70" y2="392"/><line x1="70" y1="352" x2="30" y2="392"/></g>
  <circle cx="70" cy="352" r="12" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2"/>
  <text x="70" y="356" text-anchor="middle" font-size="12" fill="currentColor">1</text>
  <circle cx="30" cy="392" r="12" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="3"/>
  <text x="30" y="396" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">2</text>
  <circle cx="30" cy="352" r="12" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="3"/>
  <text x="30" y="356" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">3</text>
  <circle cx="70" cy="392" r="12" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2"/>
  <text x="70" y="396" text-anchor="middle" font-size="12" fill="currentColor">4</text>
  <text x="100" y="358" font-size="14" font-weight="700" fill="currentColor">롤 오른쪽 (+φ)</text>
  <text x="100" y="378" font-size="12" font-weight="700" fill="var(--accent-color)">왼쪽 모터 2 · 3 ↑</text>
  <text x="100" y="397" font-size="12" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" fill="var(--text-light)">[3.396 3.962 3.962 3.396]</text>
  <!-- row 2: 피치 업 (+θ, 기수 들기) -->
  <rect x="8" y="418" width="304" height="76" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <line x1="50" y1="430" x2="50" y2="422" stroke="currentColor" stroke-width="2" marker-end="url(#fad-mix-arrow)"/>
  <g stroke="currentColor" stroke-width="2" opacity="0.6"><line x1="30" y1="436" x2="70" y2="476"/><line x1="70" y1="436" x2="30" y2="476"/></g>
  <circle cx="70" cy="436" r="12" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="3"/>
  <text x="70" y="440" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">1</text>
  <circle cx="30" cy="476" r="12" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2"/>
  <text x="30" y="480" text-anchor="middle" font-size="12" fill="currentColor">2</text>
  <circle cx="30" cy="436" r="12" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="3"/>
  <text x="30" y="440" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">3</text>
  <circle cx="70" cy="476" r="12" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2"/>
  <text x="70" y="480" text-anchor="middle" font-size="12" fill="currentColor">4</text>
  <text x="100" y="442" font-size="14" font-weight="700" fill="currentColor">피치 업 (+θ, 기수 들기)</text>
  <text x="100" y="462" font-size="12" font-weight="700" fill="var(--accent-color)">앞쪽 모터 1 · 3 ↑</text>
  <text x="100" y="481" font-size="12" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" fill="var(--text-light)">[3.962 3.396 3.962 3.396]</text>
  <!-- row 3: 요 오른쪽 (+ψ) -->
  <rect x="8" y="502" width="304" height="76" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <line x1="50" y1="514" x2="50" y2="506" stroke="currentColor" stroke-width="2" marker-end="url(#fad-mix-arrow)"/>
  <g stroke="currentColor" stroke-width="2" opacity="0.6"><line x1="30" y1="520" x2="70" y2="560"/><line x1="70" y1="520" x2="30" y2="560"/></g>
  <circle cx="70" cy="520" r="12" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="3"/>
  <text x="70" y="524" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">1</text>
  <circle cx="30" cy="560" r="12" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="3"/>
  <text x="30" y="564" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">2</text>
  <circle cx="30" cy="520" r="12" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2"/>
  <text x="30" y="524" text-anchor="middle" font-size="12" fill="currentColor">3</text>
  <circle cx="70" cy="560" r="12" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2"/>
  <text x="70" y="564" text-anchor="middle" font-size="12" fill="currentColor">4</text>
  <text x="100" y="526" font-size="14" font-weight="700" fill="currentColor">요 오른쪽 (+ψ)</text>
  <text x="100" y="546" font-size="12" font-weight="700" fill="var(--accent-color)">CCW 모터 1 · 2 ↑</text>
  <text x="100" y="565" font-size="12" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" fill="var(--text-light)">[4.46 4.46 2.898 2.898]</text>
</svg>
<figcaption>PX4 Quad X(위에서 본 모습)와 조종 입력별로 빨라지는 모터 — 대괄호 속 숫자는 3.3절 믹서 코드의 출력(모터 1~4 추력)</figcaption>
</figure>

요는 추력 차이가 아니라 **반토크 차이**로 만들기 때문에 다른 축보다 힘이 약합니다. 그래서 기체가 요 방향으로 느리게 반응하고, 모터 출력이 포화되면 제어기는 보통 **요를 가장 먼저 포기**합니다.

### 3.3 믹서: 원하는 힘을 모터 명령으로

제어기는 "총추력 T, 롤 토크 τx, 피치 토크 τy, 요 토크 τz"를 원합니다. 하지만 실제로 명령할 수 있는 것은 모터 네 개의 추력입니다. 이 둘을 잇는 것이 **믹서(mixer)**, 더 일반적인 이름으로 **제어 할당(control allocation)** 입니다.

모터 위치와 회전 방향을 알면 "모터 추력 → 힘·토크"는 행렬 하나(할당 행렬 `A`)로 쓸 수 있고, 믹서는 그 역행렬입니다(모터가 4개보다 많으면 의사역행렬). 아래는 PX4의 Quadrotor X 배치(1: 앞-오른쪽 CCW, 2: 뒤-왼쪽 CCW, 3: 앞-왼쪽 CW, 4: 뒤-오른쪽 CW)를 FRD 좌표로 옮긴 예입니다.

```python
L = 0.25                 # 중심에서 모터까지 암 길이 (m)
d = L / np.sqrt(2)       # X 배치: 각 모터의 x, y 거리
c = 0.016                # 반토크 계수 k_Q / k_T (m)

# 행: [총추력, 롤 τx, 피치 τy, 요 τz] / 열: 모터 1~4 추력
#  - 롤 τx = -y·T  (왼쪽 모터(y<0)가 밀면 오른쪽이 내려감 = 양의 롤)
#  - 피치 τy = x·T (앞쪽 모터(x>0)가 밀면 기수가 들림 = 양의 피치)
#  - 요 τz: CCW 프로펠러의 반토크는 프레임을 시계 방향(양의 요)으로 돌린다
A = np.array([
    [ 1,  1,  1,  1],
    [-d,  d,  d, -d],
    [ d, -d,  d, -d],
    [ c,  c, -c, -c],
])
mixer = np.linalg.inv(A)

print(np.round(mixer @ [m * g, 0, 0, 0], 3))     # 호버: [3.679 3.679 3.679 3.679]
print(np.round(mixer @ [m * g, 0, 0, 0.05], 3))  # 요 오른쪽: [4.46  4.46  2.898 2.898] — CCW 모터(1,2)↑
print(np.round(mixer @ [m * g, 0.2, 0, 0], 3))   # 롤 오른쪽: [3.396 3.962 3.962 3.396] — 왼쪽 모터(2,3)↑
print(np.round(mixer @ [m * g, 0, 0.2, 0], 3))   # 피치 업:   [3.962 3.396 3.962 3.396] — 앞쪽 모터(1,3)↑
```

마지막 세 줄이 3.2절의 표를 그대로 보여 줍니다. 요를 오른쪽으로 돌리려면 반시계 방향 모터를 빠르게, 오른쪽으로 기울이려면 왼쪽 모터를, 기수를 들려면 앞쪽 모터를 세게 돌립니다. 실제 펌웨어의 믹서는 여기에 **포화 처리**를 더합니다. 계산된 모터 출력이 0~100%를 벗어나면 롤·피치를 최우선으로 지키고, 요는 가장 먼저 줄이며, 총추력은 그 사이에서 포화를 풀기 위해 조정합니다(구체 규칙은 펌웨어와 airmode 같은 설정마다 다릅니다). PX4는 v1.14부터 이 할당을 기체 형상 파라미터(`CA_*`)로부터 자동으로 계산하고, ArduPilot은 프레임 클래스·타입별 모터 테이블로 정의합니다.

### 3.4 운동 방정식 한눈에

지금까지의 내용을 식 두 줄로 요약할 수 있습니다(NED 세계 좌표, FRD body 좌표).

- **병진**: `m · dv/dt = R · (0, 0, −T) + m · (0, 0, g)` — 추력은 body의 −z(위) 방향, 회전행렬 `R`로 세계 좌표로 옮기고, 중력은 +z(아래)
- **회전**: `J · dω/dt + ω × (J · ω) = τ` — 관성 행렬 `J`, body 각속도 `ω`, 믹서가 만든 토크 `τ`

첫 식은 "자세(R)가 추력의 방향을 정한다"를, 둘째 식은 "토크가 각속도를 바꾼다"를 말합니다. 이 두 식이 시뮬레이터(SITL의 물리 엔진)가 매 순간 푸는 식이고, 5단계의 제어기가 거꾸로 풀려고 하는 식입니다.

## 4. 운용 노트

### 4.1 통제 앱에 바로 쓰이는 규칙

- **변환은 경계에서 한 번**: MAVLink 수신부에서 degE7→도, mm→m, cm/s→m/s, NED→앱 내부 표준으로 바꾸고, 내부에서는 하나의 규약만 씁니다.
- **고도 표시는 기준을 함께**: "고도 30m"가 아니라 "home 기준 30m"처럼 기준을 화면에 적습니다. 해발 고도와 상대 고도를 섞어 쓰는 실수가 가장 흔합니다.
- **heading과 yaw를 구분**: 지도 아이콘의 방향은 북 기준 시계 방향(heading)으로 그립니다. 지도 라이브러리가 동 기준·반시계 각도를 기대한다면 1.1절의 변환이 필요합니다.
- **자세 표시는 오일러각, 저장은 쿼터니언**: 로그·리플레이에는 쿼터니언을 저장해야 나중에 다시 계산해도 정보가 손실되지 않습니다.

### 4.2 이 단계에서 다루지 않은 것

공기역학 항력, 지면 효과, 프로펠러 효율, 모터 응답 지연은 모두 실제 비행에 영향을 주지만, 통제 앱 개발자가 Essential 수준에서 알아야 할 범위를 넘습니다. 제어 설계를 깊이 다루는 심화 후보 `Drone-Advanced-Control`에서 시스템 식별과 함께 다룰 주제로 남겨 둡니다.

## 마무리

2단계에서 세 가지 도구를 얻었습니다. **좌표계**는 숫자의 기준을 알려 주고(NED/ENU, FRD/FLU, 로컬 원점, 메시지별 단위·부호), **자세 표현**은 기체가 어느 쪽을 보는지 안전하게 다루게 해 주며(오일러각은 표시용, 쿼터니언은 계산용), **비행 역학**은 멀티콥터가 왜 기울어야 움직일 수 있는지와 모터 네 개가 어떻게 네 가지 조종 입력이 되는지를 설명합니다(부족 구동, 반토크, 믹서).

다음 단계는 이 역학이 실제로 돌아가는 하드웨어, **3단계: 기체 · 센서 · 액추에이터**입니다. 추력 대 중량비와 배터리로 비행시간을 추정하고, IMU·자력계·기압계가 무엇을 재고 어떻게 틀리는지를 다룹니다.

### 다음 학습

- [Drone Control Essential Curriculum](/2026/11/05/drone-control-essential-curriculum.html) — 시리즈 전체 지도와 진행률
- 직전: [UAS 전체 지도](/2026/11/05/drone-uas-system-map.html) — 기체·FC·데이터링크·GCS·운용자와 통제 앱의 자리
- 다음: [기체 · 센서 · 액추에이터](/2026/11/05/drone-airframe-sensors-actuators.html) — 추진계·배터리·센서가 무엇을 내고 어떻게 틀리는가
