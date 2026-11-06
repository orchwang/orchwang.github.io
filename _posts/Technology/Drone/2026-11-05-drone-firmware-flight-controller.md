---
layout: post
title: "펌웨어 · 비행 컨트롤러: PX4와 ArduPilot의 내부"
date: 2026-11-05 00:06:00
categories: [Technology, Drone]
tags: [drone, flight-control, flight-controller, firmware, px4, ardupilot, pixhawk, mavlink]
series: Drone-Control-Essential
published: true
excerpt: "통제 앱의 상대는 FC 위에서 도는 펌웨어입니다. Pixhawk FMU와 IO 프로세서·센서 이중화·컴패니언 컴퓨터의 역할 분담, NuttX+uORB의 PX4와 ChibiOS+HAL의 ArduPilot 아키텍처와 라이선스, 그리고 앱이 직접 다루게 될 파라미터·로그·펌웨어 업데이트를 코드로 정리합니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="비행 컨트롤러 펌웨어를 층으로 자른 단면. 아래부터 ① 하드웨어인 Pixhawk 보드(FMU MCU, IO 프로세서, IMU 2~3개, 기압계, 커넥터), ② RTOS, ③ 미들웨어, ④ 비행 기능(추정, 제어, 모드, 페일세이프), ⑤ 외부 인터페이스(MAVLink, 로그, 파라미터)가 쌓여 있다. 맨 위의 통제 앱(지상)과 컴패니언 컴퓨터(기체 위 리눅스)가 화살표로 ⑤층에 연결된다. 두 펌웨어가 갈리는 ②③층에는 왼쪽에 PX4(NuttX, uORB 토픽), 오른쪽에 ArduPilot(ChibiOS, AP_HAL과 스케줄러)이 병기되어 있다." viewBox="0 0 320 444" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>FC 펌웨어의 단면 — 하드웨어 · RTOS · 미들웨어 · 비행 기능 · 외부 인터페이스</title>
  <defs>
    <marker id="fw-hdr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
  </defs>
  <text x="160" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">FC 한 장의 단면</text>
  <!-- outside callers -->
  <rect x="16" y="32" width="134" height="44" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="83" y="51" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">통제 앱</text>
  <text x="83" y="69" text-anchor="middle" font-size="12" fill="var(--text-light)">지상</text>
  <rect x="170" y="32" width="134" height="44" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="237" y="51" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">컴패니언 컴퓨터</text>
  <text x="237" y="69" text-anchor="middle" font-size="12" fill="var(--text-light)">기체 위 · 리눅스</text>
  <line x1="83" y1="76" x2="83" y2="98" stroke="currentColor" stroke-width="2" marker-end="url(#fw-hdr-arrow)"/>
  <line x1="237" y1="76" x2="237" y2="98" stroke="currentColor" stroke-width="2" marker-end="url(#fw-hdr-arrow)"/>
  <!-- layer 5: external interface -->
  <rect x="36" y="100" width="248" height="48" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <text x="160" y="118" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-light)">⑤ 외부 인터페이스</text>
  <text x="160" y="138" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">MAVLink · 로그 · 파라미터</text>
  <!-- layer 4: flight functions -->
  <rect x="36" y="154" width="248" height="48" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5"/>
  <text x="160" y="172" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-light)">④ 비행 기능</text>
  <text x="160" y="192" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">추정 · 제어 · 모드 · 페일세이프</text>
  <!-- layer 3: middleware (split) -->
  <rect x="36" y="208" width="248" height="54" rx="3" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="160" y="225" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-light)">③ 미들웨어</text>
  <line x1="160" y1="232" x2="160" y2="256" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="98" y="250" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">uORB 토픽</text>
  <text x="222" y="250" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">AP_HAL · 스케줄러</text>
  <!-- layer 2: RTOS (split) -->
  <rect x="36" y="268" width="248" height="48" rx="3" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="160" y="285" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-light)">② RTOS</text>
  <line x1="160" y1="292" x2="160" y2="312" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="98" y="306" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">NuttX</text>
  <text x="222" y="306" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">ChibiOS</text>
  <!-- side labels for the two diverging layers -->
  <line x1="30" y1="210" x2="30" y2="314" stroke="var(--accent-color)" stroke-width="2"/>
  <text transform="translate(23,262) rotate(-90)" text-anchor="middle" font-size="13" font-weight="700" fill="var(--accent-color)">PX4</text>
  <line x1="290" y1="210" x2="290" y2="314" stroke="var(--secondary-color)" stroke-width="2"/>
  <text transform="translate(297,262) rotate(90)" text-anchor="middle" font-size="13" font-weight="700" fill="var(--secondary-color)">ArduPilot</text>
  <!-- layer 1: hardware -->
  <rect x="36" y="322" width="248" height="90" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <text x="160" y="339" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-light)">① 하드웨어 · Pixhawk 보드</text>
  <g fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5">
    <rect x="66" y="348" width="84" height="22" rx="2"/>
    <rect x="162" y="348" width="92" height="22" rx="2"/>
    <rect x="45" y="378" width="70" height="22" rx="2"/>
    <rect x="125" y="378" width="70" height="22" rx="2"/>
    <rect x="205" y="378" width="70" height="22" rx="2"/>
  </g>
  <g text-anchor="middle" font-size="12" fill="currentColor">
    <text x="108" y="363">FMU MCU</text>
    <text x="208" y="363">IO 프로세서</text>
    <text x="80" y="393">IMU ×2~3</text>
    <text x="160" y="393">기압계</text>
    <text x="240" y="393">커넥터</text>
  </g>
  <text x="160" y="434" text-anchor="middle" font-size="12" fill="var(--text-light)">두 펌웨어는 ②③층에서 갈린다</text>
</svg>
<figcaption>FC 펌웨어는 아래에서 위로 하드웨어 → RTOS → 미들웨어 → 비행 기능 → 외부 인터페이스로 쌓이고, 통제 앱과 컴패니언 컴퓨터는 맨 위층(MAVLink · 로그 · 파라미터)으로 들어온다 — PX4와 ArduPilot의 차이는 주로 가운데 두 층에 있다</figcaption>
</figure>

## 들어가며

이 글은 `Drone-Control-Essential` 시리즈의 **6단계**입니다. 전체 흐름은 [Drone Control Essential Curriculum](/2026/11/05/drone-control-essential-curriculum.html)에서 확인하고, 직전 단계 [비행 제어: 자세 · 고도 · 위치 루프](/2026/11/05/drone-flight-control.html)를 먼저 읽으면 좋습니다.

4단계의 상태 추정과 5단계의 캐스케이드 제어는 모두 **FC(Flight Controller) 위에서 도는 펌웨어** 안에 있습니다. 통제 앱은 MAVLink로 이 펌웨어와 대화합니다. 앱이 보내는 명령을 받아 거절하거나 실행하는 것도, 파라미터를 저장하는 것도, 로그를 남기는 것도 펌웨어입니다. 그러니 앱 개발자는 펌웨어를 직접 고치지 않더라도 **그 안이 어떻게 나뉘어 있는지는** 알아야 합니다. 그래야 "왜 이 명령이 거절되는가", "이 값은 어디에 저장되는가", "로그는 어떻게 생겼는가"에 답할 수 있습니다.

이 단계는 세 질문을 다룹니다. FC 보드에는 무엇이 들어 있고, 기체 위의 다른 컴퓨터와는 어떻게 일을 나누는가? 두 대표 오픈소스 오토파일럿 PX4와 ArduPilot은 안이 어떻게 다른가? 그리고 앱이 직접 다루게 될 파라미터·로그·펌웨어 업데이트는 어떤 모양인가?

<div class="post-summary-box" markdown="1">

### 📌 이 글에서 다루는 내용

#### 🔍 핵심 주제

- **FC 하드웨어**: Pixhawk FMU 표준, MCU와 IO 프로세서, 센서 이중화, 컴패니언 컴퓨터(라즈베리파이·Jetson)와의 역할 분담
- **PX4 vs ArduPilot 아키텍처**: NuttX + uORB pub/sub 모듈 vs ChibiOS + HAL·vehicle 코드, 라이선스(BSD vs GPLv3), 커뮤니티와 선택 기준
- **파라미터·로그·업데이트**: 파라미터 체계와 저장, ULog/DataFlash 로그, 부트로더·펌웨어 업로드 — 앱이 다룰 운영 기능

</div>

## 1. FC 하드웨어

### 1.1 Pixhawk와 FMU 표준

오픈소스 드론에서 FC 하드웨어의 기준점은 **Pixhawk**입니다. Pixhawk는 특정 회사의 제품 이름이라기보다 **공개 하드웨어 표준의 계열**입니다. 표준은 FC의 핵심인 **FMU(Flight Management Unit)** 의 세대(FMUv2 … FMUv5X, FMUv6X·v6C)와, 커넥터 핀 배치·버스 규격을 정합니다. 여러 제조사가 이 표준에 맞춰 보드를 만들고, PX4와 ArduPilot 모두 같은 보드에서 돌 수 있습니다.

| 세대 | 대표 보드 | MCU 계열 | 메모 |
| --- | --- | --- | --- |
| FMUv2/v3 | Pixhawk 1 · Cube(Pixhawk 2) | STM32F4 | 초기 표준, FMUv2(1 MB 플래시)는 지금 용량 부족 |
| FMUv5 | Pixhawk 4 | STM32F7 | |
| FMUv5X · v6X | Pixhawk 5X · 6X | STM32F7 · H7 | 모듈형(Autopilot Bus), 센서 3중화·Ethernet |
| FMUv6C | Pixhawk 6C | STM32H7 | 일체형, 보급형 |

표에서 보듯 MCU는 STM32 계열이 표준처럼 쓰입니다. 세대가 올라갈수록 F4 → F7 → H7로 바뀌며 연산 속도와 플래시 용량이 늘었습니다. 다만 수백 MHz급 MCU에 RAM은 수백 KB~1 MB 남짓입니다. 리눅스를 돌리는 컴퓨터와는 체급이 다릅니다. 이 한계가 1.3절의 역할 분담을 만듭니다.

### 1.2 보드 안의 구성: FMU · IO 프로세서 · 센서

<figure class="post-figure">
<svg role="img" aria-label="Pixhawk 계열 FC 보드의 블록 다이어그램. 맨 위 센서 묶음(IMU 2~3개, 기압계, 자력계 — 서로 다른 칩, 방진 마운트, IMU 히터)이 화살표로 가운데 FMU 프로세서에 연결된다. FMU는 주 MCU(STM32)로 상태 추정, 제어, 비행 모드, MAVLink를 맡는다. 오른쪽의 IO 프로세서는 보조 MCU로 RC 입력, MAIN 출력, 안전 스위치를 맡고 FMU와 양방향으로 연결되며, 화살표로 ESC와 모터에 출력을 낸다. IO가 없는 보드는 점선처럼 FMU가 직접 출력한다. 맨 아래 포트 묶음은 TELEM1/2(텔레메트리), GPS(외장 모듈), CAN(DroneCAN), USB(펌웨어 업로드), SD 카드(로그 기록)다." viewBox="0 0 320 456" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>Pixhawk 보드 안의 구성 — 센서 · FMU · IO 프로세서 · 출력 · 포트</title>
  <defs>
    <marker id="fw-brd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
    <marker id="fw-brd-arrow-mut" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="var(--text-light)"/>
    </marker>
  </defs>
  <text x="160" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">Pixhawk 보드 안의 구성</text>
  <!-- sensors -->
  <rect x="10" y="32" width="300" height="80" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <text x="20" y="50" font-size="13" font-weight="700" fill="currentColor">센서</text>
  <g fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5">
    <rect x="16" y="58" width="88" height="24" rx="2"/>
    <rect x="116" y="58" width="88" height="24" rx="2"/>
    <rect x="216" y="58" width="88" height="24" rx="2"/>
  </g>
  <g text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">
    <text x="60" y="75">IMU ×2~3</text>
    <text x="160" y="75">기압계</text>
    <text x="260" y="75">자력계</text>
  </g>
  <text x="160" y="102" text-anchor="middle" font-size="12" fill="var(--text-light)">서로 다른 칩 · 방진 마운트 · IMU 히터</text>
  <line x1="100" y1="112" x2="100" y2="134" stroke="currentColor" stroke-width="2" marker-end="url(#fw-brd-arrow)"/>
  <!-- FMU -->
  <rect x="10" y="136" width="180" height="104" rx="4" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="100" y="160" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">FMU 프로세서</text>
  <text x="100" y="180" text-anchor="middle" font-size="12" fill="var(--text-light)">주 MCU · STM32</text>
  <text x="100" y="204" text-anchor="middle" font-size="13" fill="currentColor">상태 추정 · 제어</text>
  <text x="100" y="224" text-anchor="middle" font-size="13" fill="currentColor">비행 모드 · MAVLink</text>
  <!-- IO processor -->
  <rect x="214" y="136" width="96" height="104" rx="4" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="2"/>
  <g text-anchor="middle" fill="currentColor">
    <text x="262" y="156" font-size="13" font-weight="700">IO 프로세서</text>
    <text x="262" y="175" font-size="12" fill="var(--text-light)">보조 MCU</text>
    <text x="262" y="195" font-size="12">RC 입력</text>
    <text x="262" y="213" font-size="12">MAIN 출력</text>
    <text x="262" y="231" font-size="12">안전 스위치</text>
  </g>
  <line x1="191" y1="188" x2="213" y2="188" stroke="currentColor" stroke-width="2" marker-start="url(#fw-brd-arrow)" marker-end="url(#fw-brd-arrow)"/>
  <!-- outputs -->
  <line x1="262" y1="240" x2="262" y2="270" stroke="currentColor" stroke-width="2" marker-end="url(#fw-brd-arrow)"/>
  <path d="M40,240 V290 H148" fill="none" stroke="var(--text-light)" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#fw-brd-arrow-mut)"/>
  <text x="48" y="258" font-size="12" fill="var(--text-light)">IO 없는 보드는</text>
  <text x="48" y="276" font-size="12" fill="var(--text-light)">FMU가 직접 출력</text>
  <rect x="150" y="272" width="160" height="36" rx="4" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5"/>
  <text x="230" y="295" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">ESC · 모터</text>
  <!-- ports -->
  <line x1="20" y1="241" x2="20" y2="321" stroke="currentColor" stroke-width="1.5" marker-start="url(#fw-brd-arrow)" marker-end="url(#fw-brd-arrow)"/>
  <rect x="10" y="322" width="300" height="124" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <text x="30" y="340" font-size="13" font-weight="700" fill="currentColor">포트</text>
  <g fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5">
    <rect x="14" y="348" width="88" height="40" rx="2"/>
    <rect x="116" y="348" width="88" height="40" rx="2"/>
    <rect x="218" y="348" width="88" height="40" rx="2"/>
    <rect x="65" y="396" width="88" height="40" rx="2"/>
    <rect x="167" y="396" width="88" height="40" rx="2"/>
  </g>
  <g text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">
    <text x="58" y="364">TELEM1/2</text>
    <text x="160" y="364">GPS</text>
    <text x="262" y="364">CAN</text>
    <text x="109" y="412">USB</text>
    <text x="211" y="412">SD 카드</text>
  </g>
  <g text-anchor="middle" font-size="12" fill="var(--text-light)">
    <text x="58" y="381">텔레메트리</text>
    <text x="160" y="381">외장 모듈</text>
    <text x="262" y="381">DroneCAN</text>
    <text x="109" y="429">펌웨어 업로드</text>
    <text x="211" y="429">로그 기록</text>
  </g>
</svg>
<figcaption>보드 한 장에 일이 나뉜다 — 주 MCU인 FMU가 추정 · 제어 · 모드 · MAVLink를, 보조 MCU인 IO 프로세서가 RC 입력과 MAIN 출력(PWM) · 안전 스위치를 맡고, 상급 보드는 IMU를 서로 다른 칩으로 2~3개 싣는다</figcaption>
</figure>

보드를 열어 보면 대략 이런 부품이 있습니다.

- **FMU 프로세서**: 펌웨어 전체가 도는 주 MCU입니다. 상태 추정, 제어, 비행 모드, MAVLink 통신이 모두 여기서 돕니다.
- **IO 프로세서**: Pixhawk 계열 다수에 있는 작은 보조 MCU입니다. RC 수신기 입력과 MAIN 출력(PWM)을 맡습니다. 주 MCU와 분리해 두면 출력 핀이 넉넉해지고, 안전 스위치 같은 저수준 기능을 따로 둘 수 있습니다. IO가 없는 보드는 FMU가 출력을 직접 냅니다.
- **센서**: IMU, 기압계, 자력계가 보드에 실립니다. 상급 보드는 IMU를 **서로 다른 칩으로 2~3개** 싣고, 진동을 줄이는 방진 마운트와 온도를 일정하게 유지하는 **IMU 히터**를 둡니다. 3단계에서 본 자이로 바이어스의 온도 의존성을 하드웨어로 줄이는 장치입니다. GNSS와 외장 자력계는 대개 마스트 위의 별도 모듈로 붙습니다.
- **포트**: 텔레메트리(TELEM1/2), GPS, CAN(DroneCAN 장치), USB, 그리고 로그를 기록하는 **SD 카드**가 있습니다.

### 1.3 센서 이중화와 투표

센서를 여러 개 싣는 이유는 정확도보다 **고장 대비**입니다. IMU 하나가 멈추거나, 특정 진동 주파수에 공진해 엉뚱한 값을 내도 비행을 이어 가려는 것입니다. 그러려면 펌웨어가 **어느 센서가 틀렸는지** 판정해야 합니다. 아래는 그 원리를 단순화한 투표(voting) 실험입니다.

```python
import numpy as np

rng = np.random.default_rng(1)
DT = 0.004                                       # 250 Hz
t = np.arange(0, 3.0, DT)
true_rate = 0.5 * np.sin(2 * np.pi * 0.5 * t)    # 실제 롤 각속도 [rad/s]

# IMU 세 개: 각자 조금씩 다른 잡음·바이어스
imu = np.stack([true_rate + rng.normal(0, 0.01, t.size) + b for b in (0.002, -0.003, 0.001)])
imu[1, t >= 1.0] = imu[1, np.searchsorted(t, 1.0)]       # IMU1: 1.0초부터 값이 멈춤(stuck)
imu[2, t >= 2.0] += rng.normal(0, 0.5, (t >= 2.0).sum())  # IMU2: 2.0초부터 진동으로 잡음 폭증

THRESH, LIMIT, WIN = 0.08, 25, 25   # 0.08 rad/s 넘게 어긋난 샘플이 25개(0.1 s) 쌓이면 판정
errors = np.zeros(3, int)
healthy = np.ones(3, bool)
primary = 1                          # 고장 낼 IMU1을 주 센서로 두어 전환을 보이게 한다
disagree = 0
voted = np.empty(t.size)

def drop(i, k, why):
    healthy[i] = False
    print(f"t={t[k]:.3f}s  IMU{i} 제외 ({why}) → 남은 IMU {np.flatnonzero(healthy).tolist()}")

for k in range(t.size):
    vals, ok = imu[:, k], np.flatnonzero(healthy)
    if len(ok) >= 3:                 # 셋 이상: 중앙값에서 벗어난 센서를 찾는다
        med = np.median(vals[ok])
        for i in ok:
            errors[i] = errors[i] + 1 if abs(vals[i] - med) > THRESH else max(errors[i] - 1, 0)
            if errors[i] >= LIMIT:
                drop(i, k, "다수와 불일치")
    elif len(ok) == 2:               # 둘: 어긋난 건 알지만 누가 틀렸는지는 모른다
        disagree = disagree + 1 if abs(vals[ok[0]] - vals[ok[1]]) > THRESH else max(disagree - 1, 0)
        if disagree >= LIMIT and k >= WIN:
            # 다른 근거: 최근 구간의 고주파 잡음(샘플 간 차분의 표준편차)
            noise = [np.std(np.diff(imu[i, k - WIN:k + 1])) for i in ok]
            drop(ok[int(np.argmax(noise))], k, f"둘이 불일치, 잡음 {max(noise):.2f} vs {min(noise):.2f}")
    if not healthy[primary]:
        primary = int(np.flatnonzero(healthy)[0])
        print(f"t={t[k]:.3f}s  주 센서 전환 → IMU{primary}")
    voted[k] = vals[primary]

for name, sig in [("IMU1 그대로", imu[1]), ("IMU2 그대로", imu[2]), ("투표 결과", voted)]:
    print(f"{name:<10} 오차 RMS {np.sqrt(np.mean((sig - true_rate) ** 2)):.3f} rad/s")
# t=1.156s  IMU1 제외 (다수와 불일치) → 남은 IMU [0, 2]
# t=1.156s  주 센서 전환 → IMU0
# t=2.140s  IMU2 제외 (둘이 불일치, 잡음 0.83 vs 0.02) → 남은 IMU [0]
# IMU1 그대로   오차 RMS 0.289 rad/s
# IMU2 그대로   오차 RMS 0.273 rad/s
# 투표 결과      오차 RMS 0.032 rad/s
```

두 가지가 보입니다.

- **셋이면 다수결이 됩니다.** IMU1이 1.0초에 멈추자, 중앙값과 계속 어긋나는 샘플이 쌓여 0.156초 뒤 제외되고 주 센서가 IMU0으로 바뀝니다. 결과 신호의 오차는 0.032 rad/s입니다. 그중 대부분은 **판정 전 0.156초 동안** 멈춘 값을 쓴 탓이고, 그 구간을 빼면 0.010 rad/s로 정상 센서와 같습니다. 판정 기준을 느슨하게 하면 오탐이 줄지만 이 구간이 길어집니다.
- **둘이면 "어긋났다"까지만 압니다.** IMU 둘이 남은 상태에서 IMU2에 잡음이 폭증하면, 둘이 어긋난다는 것은 바로 알 수 있습니다. 하지만 누가 틀렸는지는 다수결로 정할 수 없어 **다른 근거**가 필요합니다. 여기서는 최근 구간의 고주파 잡음 크기(0.83 vs 0.02)를 썼습니다.

실제 펌웨어는 이보다 정교합니다. PX4는 `sensors` 모듈이 센서별 오류 횟수·타임아웃·우선순위로 투표하고, EKF2를 IMU별로 여러 인스턴스 돌려 가장 건강한 쪽을 고르는 선택기도 둡니다(`EKF2_MULTI_IMU`). ArduPilot EKF3는 **IMU마다 별도의 필터 코어(lane)** 를 돌리고, 혁신(4단계) 오차 점수가 가장 좋은 lane으로 갈아탑니다. 통제 앱에는 이 결과가 "주 센서 전환", "EKF lane 전환" 같은 상태 메시지(`STATUSTEXT`)로 옵니다. 이 메시지는 운용자에게 그대로 보여 줄 가치가 있습니다.

### 1.4 컴패니언 컴퓨터와의 역할 분담

FC의 MCU는 실시간성은 뛰어나지만 연산력과 메모리가 작습니다. 카메라 영상 처리, 경로 계획, 셀룰러 통신, ROS 2 같은 일은 기체에 함께 싣는 **컴패니언 컴퓨터**(라즈베리파이, NVIDIA Jetson 등 리눅스 보드)가 맡습니다.

| 맡는 일 | FC (MCU + RTOS) | 컴패니언 컴퓨터 (리눅스) |
| --- | --- | --- |
| 주기 | 수 ms 이하, 마감 시간이 엄격 | 수십 ms~초, 마감 시간이 느슨 |
| 예 | 센서 읽기, EKF, 캐스케이드 제어, 모터 출력, 페일세이프 | 영상·AI 추론, 경로 계획, 지도, LTE·클라우드 연결, 앱 서버 |
| 고장 시 | 기체 추락 → 절대 죽으면 안 됨 | FC가 페일세이프로 받아냄 |
| 연결 | — | 시리얼(TELEM2)·Ethernet 위의 MAVLink, 또는 uXRCE-DDS(ROS 2) |

원칙은 **안전에 필요한 것은 FC에 남기는 것**입니다. 컴패니언이 멈추면 PX4 Offboard는 목표 스트림이 끊긴 것을 감지해 페일세이프로 넘어가고, ArduPilot Guided는 그 자리에 멈춥니다(5단계 3.4절). 어느 쪽이든 기체는 FC 스스로 안전한 상태를 유지합니다. 통제 앱 아키텍처를 설계할 때도 같은 질문을 던집니다. 앱의 어떤 기능이 기체 위(컴패니언)에 있어야 하고, 어떤 기능은 지상에 있어도 되는가? 링크 지연에 민감한 기능일수록 기체 쪽으로 갑니다. 컴패니언과 지상이 같은 MAVLink 스트림을 나눠 받을 때는 **mavlink-router** 같은 라우터를 씁니다(8·10단계).

## 2. PX4 vs ArduPilot 아키텍처

### 2.1 공통 뼈대

두 펌웨어는 같은 층으로 이루어져 있습니다. 아래에서 위로 **하드웨어 → RTOS → 미들웨어(모듈을 잇는 방식) → 비행 기능(추정·제어·모드·페일세이프) → 외부 인터페이스(MAVLink·로그·파라미터)** 순입니다. 차이는 주로 가운데 두 층, **어떤 RTOS 위에서 모듈을 어떻게 잇는가**에 있습니다.

<figure class="post-figure">
<svg role="img" aria-label="PX4와 ArduPilot 아키텍처 비교. 위 블록 PX4: NuttX(POSIX 스타일 RTOS) 위에서 sensors, ekf2, commander, navigator, mc_pos_control, mc_att_control, mc_rate_control, control_allocator, mavlink, logger 같은 독립 모듈이 가운데 uORB 버스에 붙어 발행·구독으로만 대화한다. 예를 들어 ekf2가 vehicle_attitude를 발행하면 mc_att_control이 구독해 vehicle_rates_setpoint를 발행한다. 요약: 독립 모듈 + 메시지 버스. 아래 블록 ArduPilot: ChibiOS, Linux, SITL 구현을 감싸는 AP_HAL 위에 AP_InertialSensor, AP_NavEKF3, AC_AttitudeControl, AP_Motors, GCS_MAVLink, AP_Logger 같은 공용 라이브러리가 있고, 그 위에 ArduCopter, ArduPlane, Rover, ArduSub 같은 vehicle 코드가 모드와 메인 루프를 구현한다. 메인 루프의 스케줄러 표는 작업과 주기를 적어 두며, 각속도 제어와 모터 출력은 매 루프(ArduCopter 기본 400 Hz) 실행한다. 요약: 공용 라이브러리 + 차량별 메인 루프." viewBox="0 0 320 724" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>PX4 vs ArduPilot — 독립 모듈 + uORB 버스 / HAL + 공용 라이브러리 + vehicle 코드</title>
  <text x="160" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">같은 층, 다른 연결 방식</text>
  <!-- ===== PX4 ===== -->
  <text x="160" y="46" text-anchor="middle" font-size="14" font-weight="700" fill="var(--accent-color)">PX4</text>
  <rect x="152" y="58" width="16" height="152" rx="2" fill="var(--gold-soft)" stroke="var(--accent-color)" stroke-width="2"/>
  <text transform="translate(164,134) rotate(-90)" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">uORB</text>
  <g stroke="var(--accent-color)" stroke-width="2">
    <line x1="140" y1="74" x2="152" y2="74"/>
    <line x1="168" y1="74" x2="180" y2="74"/>
    <line x1="140" y1="104" x2="152" y2="104"/>
    <line x1="168" y1="104" x2="180" y2="104"/>
    <line x1="140" y1="134" x2="152" y2="134"/>
    <line x1="168" y1="134" x2="180" y2="134"/>
    <line x1="140" y1="164" x2="152" y2="164"/>
    <line x1="168" y1="164" x2="180" y2="164"/>
    <line x1="140" y1="194" x2="152" y2="194"/>
    <line x1="168" y1="194" x2="180" y2="194"/>
  </g>
  <g fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5">
    <rect x="8" y="62" width="132" height="24" rx="2"/>
    <rect x="180" y="62" width="132" height="24" rx="2"/>
    <rect x="8" y="92" width="132" height="24" rx="2"/>
    <rect x="180" y="92" width="132" height="24" rx="2"/>
    <rect x="8" y="122" width="132" height="24" rx="2"/>
    <rect x="180" y="122" width="132" height="24" rx="2"/>
    <rect x="8" y="152" width="132" height="24" rx="2"/>
    <rect x="180" y="152" width="132" height="24" rx="2"/>
    <rect x="8" y="182" width="132" height="24" rx="2"/>
    <rect x="180" y="182" width="132" height="24" rx="2"/>
  </g>
  <g text-anchor="middle" font-size="12" fill="currentColor" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace">
    <text x="74" y="78">sensors</text>
    <text x="246" y="78">ekf2</text>
    <text x="74" y="108">commander</text>
    <text x="246" y="108">navigator</text>
    <text x="74" y="138">mc_pos_control</text>
    <text x="246" y="138">mc_att_control</text>
    <text x="74" y="168">mc_rate_control</text>
    <text x="246" y="168">control_allocator</text>
    <text x="74" y="198">mavlink</text>
    <text x="246" y="198">logger</text>
  </g>
  <rect x="8" y="218" width="304" height="26" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <text x="160" y="236" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">NuttX · POSIX 스타일 RTOS</text>
  <text x="160" y="266" text-anchor="middle" font-size="12" fill="var(--text-light)">토픽 예시 — 위가 발행, 아래가 구독</text>
  <g text-anchor="middle" font-size="12" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace">
    <text x="160" y="286" font-weight="700" fill="currentColor">ekf2</text>
    <text x="160" y="304" fill="var(--secondary-color)">↓ vehicle_attitude</text>
    <text x="160" y="322" font-weight="700" fill="currentColor">mc_att_control</text>
    <text x="160" y="340" fill="var(--secondary-color)">↓ vehicle_rates_setpoint</text>
  </g>
  <text x="160" y="366" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">독립 모듈 + 메시지 버스</text>
  <line x1="8" y1="382" x2="312" y2="382" stroke="var(--text-light)" stroke-width="1" stroke-dasharray="4 4"/>
  <!-- ===== ArduPilot ===== -->
  <text x="160" y="404" text-anchor="middle" font-size="14" font-weight="700" fill="var(--secondary-color)">ArduPilot</text>
  <rect x="8" y="412" width="304" height="116" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5"/>
  <text x="160" y="430" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">vehicle 코드 · 모드와 메인 루프</text>
  <g fill="var(--bg-panel)" stroke="var(--secondary-color)" stroke-width="1.5">
    <rect x="17" y="438" width="82" height="24" rx="2"/>
    <rect x="105" y="438" width="76" height="24" rx="2"/>
    <rect x="187" y="438" width="48" height="24" rx="2"/>
    <rect x="241" y="438" width="62" height="24" rx="2"/>
  </g>
  <g text-anchor="middle" font-size="12" fill="currentColor" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace">
    <text x="58" y="455">ArduCopter</text>
    <text x="143" y="455">ArduPlane</text>
    <text x="211" y="455">Rover</text>
    <text x="272" y="455">ArduSub</text>
  </g>
  <text x="160" y="482" text-anchor="middle" font-size="12" fill="var(--text-light)">스케줄러 표 (작업 · 주기, Copter 기준)</text>
  <line x1="18" y1="488" x2="302" y2="488" stroke="var(--text-light)" stroke-width="1"/>
  <g font-size="12" fill="currentColor">
    <text x="20" y="504">각속도 제어 · 모터 출력</text>
    <text x="300" y="504" text-anchor="end" font-weight="700">매 루프 · 400 Hz</text>
    <text x="20" y="521">그 밖의 작업</text>
    <text x="300" y="521" text-anchor="end">작업마다 정한 Hz</text>
  </g>
  <rect x="8" y="536" width="304" height="84" rx="3" fill="var(--bg-panel)" stroke="currentColor" stroke-width="1.5"/>
  <text x="160" y="554" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">공용 라이브러리</text>
  <g font-size="12" fill="currentColor" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace">
    <text x="20" y="574">AP_InertialSensor</text>
    <text x="172" y="574">AP_NavEKF3</text>
    <text x="20" y="592">AC_AttitudeControl</text>
    <text x="172" y="592">AP_Motors</text>
    <text x="20" y="610">GCS_MAVLink</text>
    <text x="172" y="610">AP_Logger</text>
  </g>
  <rect x="8" y="628" width="304" height="26" rx="3" fill="var(--gold-soft)" stroke="var(--secondary-color)" stroke-width="2"/>
  <text x="160" y="646" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">AP_HAL — 하드웨어 · OS 추상화</text>
  <g fill="var(--bg-light)" stroke="currentColor" stroke-width="1.5">
    <rect x="16" y="662" width="92" height="24" rx="2"/>
    <rect x="114" y="662" width="92" height="24" rx="2"/>
    <rect x="212" y="662" width="92" height="24" rx="2"/>
  </g>
  <g text-anchor="middle" font-size="12" fill="currentColor" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace">
    <text x="62" y="679">ChibiOS</text>
    <text x="160" y="679">Linux</text>
    <text x="258" y="679">SITL</text>
  </g>
  <text x="160" y="712" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">공용 라이브러리 + 차량별 메인 루프</text>
</svg>
<figcaption>PX4는 NuttX 위의 독립 모듈이 uORB 토픽으로만 대화하고(로그 이름 = 토픽 이름), ArduPilot은 AP_HAL 위의 공용 라이브러리를 차량별 vehicle 코드가 스케줄러 표로 불러 쓴다 — 가장 급한 각속도 제어와 모터 출력은 매 루프(ArduCopter 기본 400 Hz) 실행된다</figcaption>
</figure>

### 2.2 PX4: NuttX + uORB 모듈

PX4는 **독립 모듈들이 메시지 버스로 대화하는** 구조입니다.

- **RTOS**: Pixhawk 보드에서는 **NuttX**를 씁니다. POSIX 스타일 API를 갖춘 작은 RTOS입니다. 같은 코드가 리눅스와 SITL 시뮬레이터에서도 돌도록 운영체제 위에 얇은 추상층을 둡니다.
- **모듈**: 기능마다 독립된 모듈이 있습니다. 센서 처리(`sensors`), 추정(`ekf2`), 상태 관리·arming 판단(`commander`), 자동 비행 경로(`navigator`), 5단계의 루프(`mc_pos_control` → `mc_att_control` → `mc_rate_control`), 믹서에 해당하는 `control_allocator`, 통신(`mavlink`), 기록(`logger`) 등입니다.
- **uORB**: 모듈 사이는 **uORB**라는 publish/subscribe 메시지 버스로만 연결됩니다. 예를 들어 `ekf2`는 `vehicle_attitude`를 발행하고, `mc_att_control`은 그것을 구독해 `vehicle_rates_setpoint`를 발행합니다. 메시지 형식은 `msg/*.msg` 파일로 정의하고 빌드 때 C++ 구조체가 생성됩니다. 같은 종류의 센서가 여러 개면 토픽도 인스턴스 번호로 나뉩니다(`sensor_gyro` 0·1·2).

이 구조의 장점은 **경계가 명확하다**는 것입니다. 모듈은 토픽만 알면 되므로 하나를 갈아 끼우기 쉽고, `logger`가 같은 토픽을 구독해 그대로 기록하므로 **로그 메시지 이름이 곧 토픽 이름**입니다. ROS 2와 연결하는 uXRCE-DDS 브리지도 uORB 토픽을 DDS로 내보내는 방식입니다. 통제 앱 개발자에게는 PX4 로그와 문서를 읽을 때 "이 토픽을 누가 발행하고 누가 구독하는가"가 기본 질문이 됩니다.

### 2.3 ArduPilot: HAL + 공용 라이브러리 + vehicle 코드

ArduPilot은 **공용 라이브러리 위에 차량별 메인 루프를 얹은** 구조입니다.

- **HAL(Hardware Abstraction Layer)**: `AP_HAL`이 하드웨어와 OS를 감쌉니다. 그 아래 구현은 STM32 보드용 **ChibiOS**(`AP_HAL_ChibiOS`), 리눅스 보드용, SITL용으로 나뉩니다. 보드마다 `hwdef` 파일로 핀과 센서를 정의하므로, Pixhawk 계열뿐 아니라 FPV용 소형 보드까지 아주 많은 보드를 지원합니다.
- **라이브러리**: 센서(`AP_InertialSensor`), 추정(`AP_NavEKF3`), 제어(`AC_AttitudeControl`, `AC_PosControl`), 모터(`AP_Motors`), 통신(`GCS_MAVLink`), 기록(`AP_Logger`), 파라미터(`AP_Param`) 같은 공용 라이브러리가 있습니다.
- **vehicle 코드**: 그 위에 차량 종류별 디렉터리(`ArduCopter`, `ArduPlane`, `Rover`, `ArduSub` 등)가 모드와 메인 루프를 구현합니다. 메인 루프는 **스케줄러 표**에 "어떤 작업을 몇 Hz로" 적어 두고, 가장 급한 각속도 제어와 모터 출력은 매 루프 실행합니다. 5단계에서 본 400 Hz가 이 루프 주기입니다(ArduCopter 기본값, `SCHED_LOOP_RATE`).
- **Lua 스크립팅**: 펌웨어를 다시 빌드하지 않고 SD 카드의 Lua 스크립트로 기능을 더할 수 있습니다. 현장 맞춤 기능을 넣기에 편리합니다.

PX4가 "토픽 중심"이라면 ArduPilot은 "라이브러리 호출 중심"입니다. 모듈 사이 데이터가 객체의 메서드 호출로 오가고, 로그 메시지(`ATT`, `RATE`, `XKF1` 등)는 개발자가 기록할 필드를 골라 정의합니다.

### 2.4 라이선스와 선택 기준

| 기준 | PX4 | ArduPilot |
| --- | --- | --- |
| 라이선스 | **BSD 3-Clause** — 수정한 펌웨어를 배포해도 소스 공개 의무 없음 | **GPLv3** — 수정한 펌웨어 바이너리를 배포하면 그 소스도 GPL로 공개 |
| 거버넌스 | Dronecode Foundation(Linux Foundation 산하) | ArduPilot 프로젝트(비영리 재단과 개발자 커뮤니티) |
| 구조 | 모듈 + uORB, ROS 2 연동이 긴밀 | HAL + 라이브러리, 기능 폭이 넓음 |
| 지원 보드 | Pixhawk 표준 중심 | Pixhawk + 다수의 비표준 보드 |
| 지상 생태계 | QGroundControl, MAVSDK와 궁합이 좋음 | Mission Planner, MAVProxy, QGC도 지원 |
| 많이 쓰이는 곳 | 연구·스타트업 상용 제품, ROS 2 기반 자율 비행 | 취미·농업·측량·해양, 다양한 기체 종류 |

라이선스 차이는 **펌웨어 자체를 수정해 배포하는 회사**에 중요합니다. PX4가 상용 제품에서 많이 쓰이는 이유 중 하나가 이것입니다. 반면 **MAVLink로 대화하는 통제 앱은 펌웨어와 별개의 프로그램**이므로, 펌웨어의 라이선스가 앱에 그대로 옮겨 오지는 않는 것이 일반적인 해석입니다. 실제 제품에서는 법률 검토를 따로 거쳐야 합니다.

통제 앱 입장의 결론은 **"둘 다 지원할 수 있게 설계한다"** 입니다. MAVLink 공통 메시지는 같지만 모드 번호(5단계), 파라미터 이름, 파라미터 인코딩(3.1절), 로그 형식(3.2절)이 다릅니다. 그래서 앱은 연결 직후 `HEARTBEAT.autopilot`과 `AUTOPILOT_VERSION`으로 펌웨어 종류와 버전을 확인하고, 펌웨어별 어댑터를 고르는 구조가 좋습니다.

## 3. 파라미터 · 로그 · 업데이트 — 앱이 다룰 운영 기능

### 3.1 파라미터

펌웨어의 거의 모든 동작은 **파라미터**로 조정합니다. 5단계의 PID 이득, 9단계에서 볼 페일세이프 동작, 기체 형태, 센서 보정값이 모두 파라미터입니다. 기체 하나에 보통 **수백~천 개 이상**이 있습니다. 파라미터는 FC 안의 비휘발성 저장소(FRAM·플래시 등)에 저장되고 부팅 때 읽힙니다. 값을 바꾸면 대개 바로 저장되지만, 일부는 재부팅해야 적용됩니다.

앱은 MAVLink **Parameter 프로토콜**로 파라미터를 다룹니다. `PARAM_REQUEST_LIST`로 전체 목록을 요청하면 `PARAM_VALUE`가 하나씩 흘러오고, 빠진 번호는 `PARAM_REQUEST_READ`로 다시 요청합니다. 값을 바꿀 때는 `PARAM_SET`을 보내고, 돌아오는 `PARAM_VALUE`로 실제 반영된 값을 확인합니다. 프로토콜의 세부 핸드셰이크는 8단계에서 다룹니다. 여기서는 앱이 처음 부딪히는 함정 하나를 짚습니다.

`PARAM_VALUE.param_value`는 **항상 float32 한 칸**입니다. 정수 파라미터를 이 칸에 싣는 방식이 펌웨어마다 다릅니다.

```python
import struct

# MAVLink PARAM_VALUE.param_value는 항상 float32 한 칸이다.
# 정수 파라미터를 그 칸에 싣는 방식이 펌웨어마다 다르다.
MAV_PARAM_TYPE_INT8, MAV_PARAM_TYPE_INT32, MAV_PARAM_TYPE_REAL32 = 2, 6, 9

def encode(value, ptype, bytewise):
    if ptype == MAV_PARAM_TYPE_REAL32:
        return float(value)
    if bytewise:   # PX4: int32의 4바이트를 그대로 float32로 재해석
        return struct.unpack("<f", struct.pack("<i", value))[0]
    return float(value)   # ArduPilot: 값 자체를 float로 변환(C cast)

def decode(wire, ptype, bytewise):
    if ptype == MAV_PARAM_TYPE_REAL32:
        return wire
    if bytewise:
        return struct.unpack("<i", struct.pack("<f", wire))[0]
    return int(round(wire))

for name, value in [("SYS_AUTOSTART", 4001), ("NAV_RCL_ACT", 2)]:
    wire = encode(value, MAV_PARAM_TYPE_INT32, bytewise=True)
    print(f"{name:<14} int32 {value:>5} → 선로 위 float {wire!r:<24} → 잘못 읽으면 {wire:.6g}, 맞게 읽으면 {decode(wire, MAV_PARAM_TYPE_INT32, True)}")
print(f"{'FS_THR_ENABLE':<14} int8      1 → ArduPilot 선로 위 float {encode(1, MAV_PARAM_TYPE_INT8, bytewise=False)!r}")

# 파라미터 파일: QGC 형식(탭 구분: sysid compid 이름 값 타입)
before = """\
1\t1\tMPC_XY_VEL_MAX\t12.0\t9
1\t1\tMPC_Z_VEL_MAX_UP\t3.0\t9
1\t1\tCOM_RC_LOSS_T\t0.5\t9
1\t1\tNAV_RCL_ACT\t2\t6
1\t1\tMC_ROLLRATE_P\t0.15\t9
1\t1\tMC_ROLLRATE_D\t0.003\t9"""
after = """\
1\t1\tMPC_XY_VEL_MAX\t8.0\t9
1\t1\tMPC_Z_VEL_MAX_UP\t3.0\t9
1\t1\tCOM_RC_LOSS_T\t0.5\t9
1\t1\tNAV_RCL_ACT\t3\t6
1\t1\tMC_ROLLRATE_P\t0.15\t9
1\t1\tMC_ROLLRATE_D\t0.004\t9"""

def parse_qgc(text):
    out = {}
    for line in text.splitlines():
        if not line or line.startswith("#"):
            continue
        _, _, name, value, ptype = line.split("\t")
        out[name] = int(value) if int(ptype) != MAV_PARAM_TYPE_REAL32 else float(value)
    return out

a, b = parse_qgc(before), parse_qgc(after)
print("\n파라미터 변경 내역")
for name in sorted(a.keys() | b.keys()):
    if a.get(name) != b.get(name):
        print(f"  {name:<16} {str(a.get(name, '—')):>6} → {b.get(name, '—')}")

# AUTOPILOT_VERSION.flight_sw_version: major << 24 | minor << 16 | patch << 8 | type
FW_TYPE = {0: "dev", 64: "alpha", 128: "beta", 192: "rc", 255: "official"}

def decode_version(v):
    return f"{v >> 24 & 0xFF}.{v >> 16 & 0xFF}.{v >> 8 & 0xFF} ({FW_TYPE.get(v & 0xFF, v & 0xFF)})"

print()
for v in (0x010F04FF, 0x04060280):
    print(f"flight_sw_version 0x{v:08X} → {decode_version(v)}")
# SYS_AUTOSTART  int32  4001 → 선로 위 float 5.606595155763593e-42    → 잘못 읽으면 5.6066e-42, 맞게 읽으면 4001
# NAV_RCL_ACT    int32     2 → 선로 위 float 2.802596928649634e-45    → 잘못 읽으면 2.8026e-45, 맞게 읽으면 2
# FS_THR_ENABLE  int8      1 → ArduPilot 선로 위 float 1.0
#
# 파라미터 변경 내역
#   MC_ROLLRATE_D     0.003 → 0.004
#   MPC_XY_VEL_MAX     12.0 → 8.0
#   NAV_RCL_ACT           2 → 3
#
# flight_sw_version 0x010F04FF → 1.15.4 (official)
# flight_sw_version 0x04060280 → 4.6.2 (beta)
```

- **PX4는 바이트 단위(bytewise)** 로 싣습니다. int32의 4바이트를 그대로 float32로 재해석하므로, 값 4001이 선로 위에서는 `5.6e-42`라는 이상한 float가 됩니다. 이것을 float 값 그대로 화면에 띄우면 0처럼 보입니다.
- **ArduPilot은 값 변환(C cast)** 으로 싣습니다. 정수 1이 float 1.0이 됩니다.

펌웨어는 자신이 어느 방식을 쓰는지 `AUTOPILOT_VERSION.capabilities`의 `MAV_PROTOCOL_CAPABILITY_PARAM_ENCODE_BYTEWISE` / `MAV_PROTOCOL_CAPABILITY_PARAM_ENCODE_C_CAST` 비트로 알려 줍니다. 두 비트가 모두 없는 구형 펌웨어라면 `HEARTBEAT.autopilot`으로 추정합니다. 앱은 이 비트와 `param_type`을 함께 보고 디코딩해야 합니다. pymavlink·MAVSDK 같은 라이브러리가 처리해 주지만, 직접 구현하거나 로그를 분석할 때 자주 걸리는 지점입니다.

파라미터를 **파일로 저장·비교하는 기능**도 앱에 자주 들어갑니다. 위 코드처럼 QGroundControl 형식(탭 구분: 시스템 ID, 컴포넌트 ID, 이름, 값, 타입)이나 ArduPilot 형식(`이름,값`)으로 내보내 두면, 기체 간 설정 복제와 "비행 전후로 무엇이 바뀌었나" 추적이 쉬워집니다. 예시의 변경 내역은 그 자체로 운영 기록입니다. 최대 수평 속도를 12 → 8 m/s로 낮추고, RC 신호를 잃었을 때의 동작(`NAV_RCL_ACT`)을 Return(2) → Land(3)로 바꿨으며, 각속도 D 이득을 0.003 → 0.004로 올렸습니다. 파라미터 **이름과 의미, 단위, 허용 범위는 펌웨어 버전마다 바뀔 수 있습니다.** 그래서 GCS는 펌웨어가 제공하는 파라미터 메타데이터를 받아 설명과 범위를 보여 줍니다.

마지막 두 줄은 `AUTOPILOT_VERSION.flight_sw_version`을 읽는 방법입니다. 32비트에 major·minor·patch와 릴리스 종류가 들어 있습니다. 앱은 이 버전으로 기능 지원 여부를 분기합니다.

### 3.2 로그: ULog와 DataFlash

FC는 비행 내내 SD 카드에 **온보드 로그**를 남깁니다. 텔레메트리보다 훨씬 촘촘하게(수백 Hz) 센서·추정·제어 목표·출력을 기록하므로, 사고 분석과 튜닝의 1차 자료입니다.

| 구분 | PX4 | ArduPilot |
| --- | --- | --- |
| 온보드 로그 | **ULog** (`.ulg`) | **DataFlash** (`.bin`) |
| 기록 단위 | uORB 토픽 | 개발자가 정의한 로그 메시지(`ATT`, `RATE`, `GPS`, `XKF*` …) |
| 분석 도구 | Flight Review, pyulog, PlotJuggler | UAV Log Viewer, MAVExplorer, pymavlink |

여기에 GCS가 받은 MAVLink 스트림을 지상에서 기록한 **텔레메트리 로그**(`.tlog`)가 따로 있습니다. 온보드 로그보다 성기지만, 링크 상태와 앱이 보낸 명령까지 남는다는 장점이 있습니다.

두 온보드 로그 형식은 공통된 설계를 씁니다. **스스로를 설명하는(self-describing)** 형식입니다. 파일 앞부분에 "이 메시지는 이런 필드를 이런 타입으로 담는다"는 **형식 정의**를 먼저 쓰고, 그 정의를 따라 데이터를 씁니다. 펌웨어 버전이 바뀌어 필드가 늘어도, 읽는 쪽은 형식 정의만 따라가면 됩니다. 아래는 DataFlash 형식을 아주 작게 재현한 예입니다. 실제 `ATT` 메시지는 열이 더 많으며, 여기서는 축약했습니다.

```python
import math
import struct

HEAD = b"\xa3\x95"
# 포맷 문자 → struct 코드 (ArduPilot DataFlash 규약의 일부)
CODES = {"Q": "Q", "f": "f", "B": "B", "h": "h", "n": "4s", "N": "16s", "Z": "64s"}

def struct_fmt(fmt):
    return "<" + "".join(CODES[c] for c in fmt)

FMT_FMT = "BBnNZ"   # 형식을 설명하는 메시지(FMT) 자신의 형식

def fmt_msg(msg_id, name, fmt, labels):
    length = 3 + struct.calcsize(struct_fmt(fmt))
    return HEAD + bytes([128]) + struct.pack(struct_fmt(FMT_FMT), msg_id, length,
        name.encode(), fmt.encode(), ",".join(labels).encode())

# ── 기록하는 쪽(FC): 형식부터 쓰고, 그 형식으로 데이터를 쓴다 ──
log = bytearray()
log += fmt_msg(128, "FMT", FMT_FMT, ["Type", "Length", "Name", "Format", "Columns"])
log += fmt_msg(200, "ATT", "QffB", ["TimeUS", "DesRoll", "Roll", "Lane"])
for k in range(5):
    t_us = 1_000_000 + k * 100_000
    des = 10.0 if k >= 1 else 0.0
    act = des * (1 - math.exp(-k / 1.5))
    log += HEAD + bytes([200]) + struct.pack(struct_fmt("QffB"), t_us, des, act, 0)
with open("mini.bin", "wb") as f:
    f.write(log)

# ── 읽는 쪽(앱): ATT가 무엇인지 미리 몰라도, FMT만 읽으면 해석할 수 있다 ──
def read_log(data):
    formats = {128: ("FMT", FMT_FMT, ["Type", "Length", "Name", "Format", "Columns"])}
    i = 0
    while i < len(data):
        assert data[i:i + 2] == HEAD
        msg_id = data[i + 2]
        name, fmt, cols = formats[msg_id]
        size = struct.calcsize(struct_fmt(fmt))
        vals = struct.unpack(struct_fmt(fmt), data[i + 3:i + 3 + size])
        vals = [v.rstrip(b"\0").decode() if isinstance(v, bytes) else v for v in vals]
        row = dict(zip(cols, vals))
        if name == "FMT":   # 새 형식을 배운다
            formats[row["Type"]] = (row["Name"], row["Format"], row["Columns"].split(","))
        yield name, row
        i += 3 + size

for name, row in read_log(log):
    if name == "FMT":
        print(f"FMT  {row['Name']:<4} id={row['Type']} 형식={row['Format']:<6} 열={row['Columns']}")
    else:
        print(f"{name}  t={row['TimeUS'] / 1e6:.1f}s  목표 {row['DesRoll']:5.2f}°  실제 {row['Roll']:5.2f}°")
# FMT  FMT  id=128 형식=BBnNZ  열=Type,Length,Name,Format,Columns
# FMT  ATT  id=200 형식=QffB   열=TimeUS,DesRoll,Roll,Lane
# ATT  t=1.0s  목표  0.00°  실제  0.00°
# ATT  t=1.1s  목표 10.00°  실제  4.87°
# ATT  t=1.2s  목표 10.00°  실제  7.36°
# ATT  t=1.3s  목표 10.00°  실제  8.65°
# ATT  t=1.4s  목표 10.00°  실제  9.31°
```

읽는 함수는 `ATT`라는 메시지를 미리 알지 못합니다. `FMT` 메시지를 읽으며 형식을 배우고, 그 형식으로 다음 메시지를 해석할 뿐입니다. 이렇게 만든 `mini.bin`은 pymavlink의 DataFlash 리더(`DFReader`)로도 같은 값이 읽힙니다. ULog도 같은 생각입니다. 형식 정의(`F`), 구독 등록(`A` — 데이터 ID와 형식을 묶음), 데이터(`D`) 메시지로 나뉘고, 처음에 파라미터 값도 함께 기록합니다.

데이터 자체는 5단계에서 본 "목표 vs 실제" 그래프 그대로입니다. 목표 10°에 실제 롤이 4.87° → 7.36° → 8.65° → 9.31°로 따라옵니다.

통제 앱이 로그와 만나는 지점은 두 곳입니다.

- **다운로드**: MAVLink의 Log 프로토콜(`LOG_REQUEST_LIST` → `LOG_ENTRY`, `LOG_REQUEST_DATA` → `LOG_DATA`)로 받을 수 있지만, 메시지당 90바이트씩 오가므로 느립니다. 수백 MB 로그라면 **MAVLink FTP**나 USB·SD 카드 직접 읽기가 현실적입니다.
- **분석 연동**: 앱이 모든 그래프를 직접 그릴 필요는 없습니다. 로그를 받아 Flight Review나 사내 분석 파이프라인으로 넘기고, 앱은 **비행 기록과 로그 파일을 연결해 두는 것**만으로도 운영 가치가 큽니다.

### 3.3 부트로더와 펌웨어 업데이트

FC 플래시의 맨 앞에는 작은 **부트로더**가 있습니다. 전원이 들어오면 부트로더가 잠시 USB로 업로드 요청을 기다립니다. 요청이 없으면 플래시의 펌웨어로 넘어갑니다. 펌웨어 업데이트는 GCS가 이 짧은 창을 이용해 새 이미지를 써 넣는 과정입니다.

- **펌웨어 파일**: PX4는 `.px4`, ArduPilot은 `.apj`입니다. 둘 다 압축된 펌웨어 이미지와 **보드 ID**를 담은 JSON 파일입니다. 업로더는 보드 ID가 맞지 않으면 쓰기를 거부합니다. 다른 보드용 펌웨어를 실수로 올리는 것을 막는 장치입니다.
- **업로드 경로**: QGroundControl·Mission Planner의 펌웨어 화면은 이 과정을 감쌉니다. 개발자는 PX4 빌드의 `upload` 대상이나 ArduPilot의 `uploader.py`로 직접 올립니다.
- **업데이트 후**: 메이저 버전이 바뀌면 파라미터 이름이 바뀌거나 기본값이 달라질 수 있습니다. 업데이트 전에 **파라미터를 파일로 백업**하고, 업데이트 후에는 센서 보정과 주요 파라미터를 다시 확인합니다.

통제 앱이 플릿(여러 대)을 관리한다면 펌웨어 버전은 **기체 자산 정보의 일부**가 됩니다. 어느 기체가 어떤 버전·어떤 파라미터 세트로 날았는지를 기록해 두어야, 같은 미션의 결과가 기체마다 다를 때 원인을 좁힐 수 있습니다.

## 4. 운용 노트

### 4.1 통제 앱에 바로 쓰이는 규칙

- **연결하면 먼저 정체를 확인한다**: `HEARTBEAT.autopilot`, `AUTOPILOT_VERSION`(펌웨어 버전·보드·capabilities)을 받아 펌웨어별 어댑터를 고릅니다.
- **파라미터는 타입과 인코딩을 함께 본다**: `param_type`과 bytewise/C-cast 능력 비트 없이 값을 해석하지 않습니다.
- **파라미터는 백업하고 diff한다**: 비행 전후, 펌웨어 업데이트 전후로 파일을 남기면 설정 변경이 추적됩니다.
- **센서·EKF 상태 메시지를 흘려보내지 않는다**: `STATUSTEXT`의 센서 전환·lane 전환은 운용자가 알아야 하는 사건입니다.
- **로그는 비행 기록에 연결한다**: 온보드 로그·텔레메트리 로그·앱 이벤트를 같은 비행 ID로 묶어 둡니다.
- **안전 기능은 FC에 둔다**: 컴패니언·지상 앱이 멈춰도 기체가 스스로 페일세이프로 넘어가도록 설계합니다.

### 4.2 이 단계에서 다루지 않은 것

PX4·ArduPilot 소스 코드를 따라가는 읽기, 새 모듈·드라이버 작성, 보드 포팅(`hwdef`, NuttX 보드 설정), 스케줄러와 실시간성 분석, DroneCAN 장치 개발은 Essential 범위를 넘습니다. 이 주제들은 심화 후보 `Drone-Autopilot-Internals`로 남겨 둡니다. ROS 2 연동(uXRCE-DDS)은 `Drone-Autonomy`에서 이어집니다.

## 마무리

6단계에서 통제 앱이 대화하는 상대의 내부를 열어 보았습니다. Pixhawk 계열 FC는 **STM32 FMU와 IO 프로세서, 이중·삼중 센서**로 이루어집니다. 무거운 연산은 **컴패니언 컴퓨터**에 넘기되, 안전에 필요한 것은 FC에 남깁니다. PX4는 **NuttX 위의 독립 모듈이 uORB로 대화**하는 구조이고, ArduPilot은 **HAL 위의 공용 라이브러리에 차량별 메인 루프를 얹은** 구조입니다. 라이선스도 BSD와 GPLv3로 다릅니다. 앱은 둘을 모두 지원하도록 **펌웨어별 어댑터**를 두고, 파라미터의 타입·인코딩, 스스로를 설명하는 로그 형식, 보드 ID를 확인하는 펌웨어 업데이트를 운영 기능으로 다룹니다.

다음 단계는 FC와 지상 사이의 전파, **7단계: 통신 링크 · 텔레메트리**입니다. RC·텔레메트리·영상 링크의 종류와 역할, 주파수 대역과 링크 버짓, 그리고 링크 위에서 MAVLink가 어떻게 흐르고 끊기는지를 다룹니다.

### 다음 학습

- [Drone Control Essential Curriculum](/2026/11/05/drone-control-essential-curriculum.html) — 시리즈 전체 지도와 진행률
- 직전: [비행 제어: 자세 · 고도 · 위치 루프](/2026/11/05/drone-flight-control.html) — 펌웨어 안에서 도는 캐스케이드와 비행 모드
- 다시 보기: [기체 · 센서 · 액추에이터](/2026/11/05/drone-airframe-sensors-actuators.html) — FC에 연결되는 센서와 ESC
- 다음: [통신 링크 · 텔레메트리: 지상과 기체 사이의 전파](/2026/11/05/drone-telemetry-radio-links.html) — RC·텔레메트리·영상 링크, 링크 버짓, MAVLink 대역 예산
