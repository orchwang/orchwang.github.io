---
layout: post
title: "UAS 전체 지도: 기체 · FC · 데이터링크 · 지상국 · 운용자"
date: 2026-11-05 00:01:00
categories: [Technology, Drone]
tags: [drone, uav, uas, px4, ardupilot, mavlink, ground-control-station]
series: Drone-Control-Essential
published: true
excerpt: "드론은 날아다니는 기계 하나가 아니라 기체·비행 컨트롤러·데이터링크·지상통제소·운용자로 이루어진 무인 항공기 시스템(UAS)입니다. 각 요소의 책임 경계를 시간 척도로 긋고, 멀티콥터·고정익·VTOL·헬리콥터의 트레이드오프와 오픈소스 드론 생태계를 지도로 그려 통제 앱이 놓일 자리를 확정합니다."
---

<figure class="post-figure post-figure--header">
<svg role="img" aria-label="UAS 다섯 요소의 지도. 맨 위 운용자가 계획·감독·최종 판단을 맡고, 그 아래 GCS·통제 앱이 목표를 주고 상태를 관찰하며 실패에 대응한다. 통제 앱에는 '우리의 자리' 표시가 붙어 있다. 앱과 기체 사이는 MAVLink 명령과 상태가 오가며, 그 아래 데이터링크(RC·텔레메트리의 C2 링크와 영상 링크)는 끊길 수 있는 점선 경계로 그려져 있다. 맨 아래 기체 안에는 추정·제어·페일세이프를 맡는 비행 컨트롤러(FC)와, 선택 요소인 컴패니언 컴퓨터(영상·경로 처리), 그리고 프레임·추진계·전원·센서·탑재체를 실은 쿼드콥터가 있다." viewBox="0 0 320 480" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>UAS 전체 지도 — 운용자 · GCS·통제 앱 · 데이터링크 · 기체(FC 포함), 그리고 컴패니언 컴퓨터</title>
  <defs>
    <marker id="uas-hdr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
  </defs>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">UAS — 드론은 시스템이다</text>
  <!-- operator -->
  <rect x="12" y="34" width="296" height="50" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <circle cx="44" cy="51" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
  <path d="M32,74 Q32,61 44,61 Q56,61 56,74" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="168" y="55" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">운용자</text>
  <text x="168" y="74" text-anchor="middle" font-size="12" fill="currentColor">계획 · 감독 · 최종 판단</text>
  <!-- operator <-> app -->
  <line x1="126" y1="86" x2="126" y2="114" stroke="currentColor" stroke-width="2" marker-end="url(#uas-hdr-arrow)"/>
  <line x1="194" y1="114" x2="194" y2="86" stroke="currentColor" stroke-width="2" marker-end="url(#uas-hdr-arrow)"/>
  <text x="116" y="104" text-anchor="end" font-size="12" fill="currentColor">판단</text>
  <text x="204" y="104" text-anchor="start" font-size="12" fill="currentColor">표시</text>
  <!-- GCS / control app: our place -->
  <rect x="12" y="116" width="296" height="54" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="3"/>
  <text x="140" y="140" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">GCS · 통제 앱</text>
  <text x="140" y="159" text-anchor="middle" font-size="12" fill="currentColor">목표 · 관찰 · 실패 대응</text>
  <rect x="226" y="107" width="78" height="20" rx="3" fill="var(--bg-panel)" stroke="var(--gold)" stroke-width="1.6"/>
  <text x="265" y="121" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">우리의 자리</text>
  <!-- MAVLink -->
  <line x1="126" y1="172" x2="126" y2="198" stroke="currentColor" stroke-width="2" marker-end="url(#uas-hdr-arrow)"/>
  <line x1="194" y1="198" x2="194" y2="172" stroke="currentColor" stroke-width="2" marker-end="url(#uas-hdr-arrow)"/>
  <text x="160" y="190" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent-color)">MAVLink</text>
  <!-- data link (can break) -->
  <rect x="12" y="200" width="296" height="50" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2" stroke-dasharray="7 4"/>
  <text x="160" y="221" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">데이터링크 (C2 · 영상)</text>
  <text x="160" y="240" text-anchor="middle" font-size="12" fill="currentColor">RC · 텔레메트리 · 영상 — 끊길 수 있다</text>
  <line x1="78" y1="252" x2="78" y2="288" stroke="currentColor" stroke-width="2" marker-end="url(#uas-hdr-arrow)"/>
  <line x1="118" y1="288" x2="118" y2="252" stroke="currentColor" stroke-width="2" marker-end="url(#uas-hdr-arrow)"/>
  <!-- air vehicle -->
  <rect x="6" y="266" width="308" height="206" rx="8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.6"/>
  <text x="304" y="283" text-anchor="end" font-size="12" fill="var(--text-light)">기체 (Air Vehicle)</text>
  <!-- FC -->
  <rect x="18" y="290" width="162" height="54" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <text x="99" y="312" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">비행 컨트롤러 (FC)</text>
  <text x="99" y="332" text-anchor="middle" font-size="12" fill="currentColor">추정·제어·페일세이프</text>
  <!-- companion computer (minor, optional) -->
  <line x1="180" y1="318" x2="200" y2="318" stroke="var(--secondary-color)" stroke-width="2"/>
  <rect x="200" y="296" width="102" height="44" rx="4" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.6" stroke-dasharray="5 3"/>
  <text x="251" y="314" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">컴패니언</text>
  <text x="251" y="331" text-anchor="middle" font-size="12" fill="currentColor">영상·경로 처리</text>
  <!-- quadcopter -->
  <g stroke="currentColor" stroke-width="3" stroke-linecap="round">
    <line x1="160" y1="400" x2="112" y2="384"/>
    <line x1="160" y1="400" x2="208" y2="384"/>
    <line x1="160" y1="400" x2="112" y2="416"/>
    <line x1="160" y1="400" x2="208" y2="416"/>
  </g>
  <g fill="var(--gold-soft)" stroke="currentColor" stroke-width="1.5">
    <ellipse cx="112" cy="380" rx="26" ry="6"/>
    <ellipse cx="208" cy="380" rx="26" ry="6"/>
    <ellipse cx="112" cy="412" rx="26" ry="6"/>
    <ellipse cx="208" cy="412" rx="26" ry="6"/>
  </g>
  <g fill="currentColor">
    <circle cx="112" cy="384" r="4"/>
    <circle cx="208" cy="384" r="4"/>
    <circle cx="112" cy="416" r="4"/>
    <circle cx="208" cy="416" r="4"/>
  </g>
  <rect x="144" y="392" width="32" height="16" rx="3" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <line x1="99" y1="346" x2="148" y2="390" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.7"/>
  <text x="160" y="452" text-anchor="middle" font-size="12" fill="currentColor">프레임 · 추진계 · 전원 · 센서 · 탑재체</text>
</svg>
<figcaption>드론은 비행체 하나가 아니라 운용자·GCS·데이터링크·기체(FC 포함)로 이루어진 시스템이다. 우리가 만들 통제 앱은 GCS 자리에서 MAVLink로 기체와 대화한다.</figcaption>
</figure>

## 들어가며

이 글은 `Drone-Control-Essential` 시리즈의 **1단계**입니다. 전체 흐름은 [Drone Control Essential Curriculum](/2026/11/05/drone-control-essential-curriculum.html)에서 확인할 수 있습니다.

드론 통제 앱을 만들겠다고 마음먹으면 곧바로 질문이 쏟아집니다. PX4와 ArduPilot 중 무엇을 써야 하나? MAVLink는 무엇이고 MAVSDK는 또 무엇인가? 앱이 모터를 직접 돌리는가, 아니면 무언가에게 부탁하는가? 이 질문들이 뒤섞이는 이유는 하나입니다 — **전체 지도가 없기 때문**입니다.

1단계는 세부를 파지 않습니다. 대신 이후 9개 단계가 채워 넣을 **빈 지도**를 그립니다. 시스템을 이루는 요소가 무엇인지, 각 요소가 무엇을 책임지는지, 기체 형태에 따라 무엇이 달라지는지, 그리고 오픈소스 생태계에서 어떤 프로젝트가 어느 칸을 채우는지를 정리하고, 마지막에 우리가 만들 통제 앱의 자리를 확정합니다.

<div class="post-summary-box" markdown="1">

### 📌 이 글에서 다루는 내용

#### 🔍 핵심 주제

- **UAS 구성 요소와 책임 경계**: 기체·FC·데이터링크·GCS·운용자, 그리고 "무엇이 기체 안에서 결정되고 무엇이 지상에서 결정되는가"를 가르는 시간 척도
- **기체 분류와 특성**: 멀티콥터·고정익·VTOL·헬리콥터의 체공 시간·탑재량·제어 난이도 트레이드오프와 통제 앱에 미치는 영향
- **오픈소스 드론 생태계 지도**: PX4·ArduPilot·Betaflight, MAVLink, QGroundControl·Mission Planner, MAVSDK·ROS 2 — 통제 앱이 놓일 자리

</div>

## 1. 드론이 아니라 UAS — 시스템으로 보기

### 1.1 다섯 요소

일상 언어의 "드론"은 하늘을 나는 물체를 가리키지만, 항공 분야에서는 **UAS(Unmanned Aircraft System, 무인 항공기 시스템)** 라는 말을 씁니다. ICAO는 그중 사람이 원격으로 조종하는 체계를 따로 **RPAS(Remotely Piloted Aircraft System)** 라 부르고, 지상 쪽을 RPS(Remote Pilot Station)라 합니다. 어느 쪽이든 핵심은 "System"입니다. 하늘에 떠 있는 기체는 시스템의 한 부분일 뿐입니다.

| 요소 | 무엇인가 | 대표 예 |
| --- | --- | --- |
| **기체 (Air Vehicle)** | 프레임·추진계·전원·센서·탑재체(카메라·짐벌 등)를 실은 비행체 | 쿼드콥터, 고정익, VTOL |
| **비행 컨트롤러 (FC)** | 기체 안의 컴퓨터. 센서를 읽어 상태를 추정하고, 제어 루프를 돌려 모터를 움직이며, 비행 모드·미션·페일세이프를 관리 | Pixhawk 계열 보드 + PX4/ArduPilot 펌웨어 |
| **데이터링크** | 지상과 기체를 잇는 무선 링크들. 수동 조종(RC)과 텔레메트리·명령이 **C2(Command and Control) 링크**를 이루고, 영상은 별도의 페이로드 링크로 흐르는 경우가 많음 | RC 수신기, 텔레메트리 라디오, Wi-Fi·LTE, 영상 송신기 |
| **지상통제소 (GCS)** | 기체 상태를 보여 주고 명령·미션을 보내는 지상 쪽 소프트웨어(+ 하드웨어) | QGroundControl, Mission Planner, **우리가 만들 통제 앱** |
| **운용자 (Operator)** | 비행을 계획·감독하고 최종 판단을 내리는 사람. 법적 책임의 주체 | 조종자, 관제 담당자 |

여기에 두 가지가 더 자주 붙습니다. 하나는 기체에 실리는 **컴패니언 컴퓨터**(라즈베리파이·Jetson 등)로, FC가 하기 어려운 영상 처리·경로 계획·클라우드 연동을 맡습니다. 다른 하나는 **외부 시스템** — 지도·기상 서비스, 공역 정보, 다기체 관리 서버 같은 것들입니다. Essential 단계에서는 이 둘을 "있다"는 정도로만 지도에 표시해 둡니다.

### 1.2 책임 경계는 시간 척도로 그어진다

다섯 요소를 나열하는 것보다 중요한 질문이 있습니다. **"이 결정은 어디에서 내려야 하는가?"** 답은 대부분 **얼마나 빨리 반응해야 하는가**로 정해집니다.

| 결정 | 필요한 반응 속도 | 사는 곳 |
| --- | --- | --- |
| 기체가 흔들릴 때 모터 출력을 바로잡기 (각속도 제어) | 1 ms 이하~수 ms (수백 Hz~kHz 루프) | FC |
| 현재 위치·자세·속도 추정 (센서 융합) | 수~수십 ms | FC |
| 웨이포인트를 따라 비행, 고도 유지 | 수십~수백 ms | FC |
| 링크가 끊겼을 때 페일세이프 동작(RTL·착륙 등) 시작 | 설정된 타임아웃 후, **링크 없이도** | FC (페일세이프) |
| 장애물 회피, 영상 기반 추적 | 수십~수백 ms, 많은 연산 | 컴패니언 컴퓨터 |
| 상태 표시, 미션 업로드, 모드 변경 | 1초 안팎 (텔레메트리 수 Hz) | GCS·통제 앱 |
| "이 임무를 계속할 것인가" | 수 초~수 분 | 운용자 |

<figure class="post-figure">
<svg role="img" aria-label="반응 시간 사다리. 왼쪽 세로축은 위가 빠름, 아래가 느림이다. 위쪽 기체 안 영역에서 FC가 약 1ms의 각속도 제어, 약 10ms의 상태 추정, 약 100ms의 경로·고도 유지를 맡고, 같은 100ms 단 옆에 컴패니언 컴퓨터가 회피·추적을 맡는다. 그 아래 페일세이프(RTL·착륙 등 설정한 동작)는 링크가 끊겨도 FC가 스스로 실행한다. 가운데 데이터링크 띠는 점선으로 그려진 신뢰할 수 없는 경계이며, 빠른 결정은 이 선을 넘지 않는다. 아래쪽 지상 영역에서 GCS·통제 앱이 약 1초 단위로 표시·미션·모드 변경을 맡고, 운용자가 수 초에서 수 분 단위로 임무를 계속할지 판단한다." viewBox="0 0 320 556" width="360" xmlns="http://www.w3.org/2000/svg">
  <title>책임 경계는 시간 척도로 그어진다 — 빠른 결정은 기체 안, 느린 판단은 지상, 그 사이에 신뢰할 수 없는 링크</title>
  <defs>
    <marker id="uas-lad-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
  </defs>
  <text x="160" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">반응 시간이 결정의 자리를 정한다</text>
  <!-- time axis -->
  <text x="22" y="44" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">빠름</text>
  <line x1="22" y1="52" x2="22" y2="526" stroke="currentColor" stroke-width="2" marker-end="url(#uas-lad-arrow)"/>
  <text x="22" y="546" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">느림</text>
  <g stroke="currentColor" stroke-width="2">
    <line x1="17" y1="118" x2="27" y2="118"/>
    <line x1="17" y1="162" x2="27" y2="162"/>
    <line x1="17" y1="206" x2="27" y2="206"/>
    <line x1="17" y1="433" x2="27" y2="433"/>
    <line x1="17" y1="491" x2="27" y2="491"/>
  </g>
  <g font-size="12" fill="currentColor">
    <text x="34" y="122">~1 ms</text>
    <text x="34" y="166">~10 ms</text>
    <text x="34" y="210">~100 ms</text>
    <text x="34" y="437">~1 s</text>
    <text x="34" y="495">수 s~분</text>
  </g>
  <!-- inside the air vehicle -->
  <rect x="100" y="50" width="208" height="250" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.6"/>
  <text x="300" y="66" text-anchor="end" font-size="12" fill="var(--text-light)">기체 안</text>
  <rect x="108" y="72" width="112" height="164" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <text x="164" y="92" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">FC</text>
  <g font-size="12" fill="currentColor" text-anchor="middle">
    <text x="164" y="122">각속도 제어</text>
    <text x="164" y="166">상태 추정</text>
    <text x="164" y="210">경로·고도 유지</text>
  </g>
  <g stroke="currentColor" stroke-width="1" opacity="0.4">
    <line x1="116" y1="140" x2="212" y2="140"/>
    <line x1="116" y1="184" x2="212" y2="184"/>
  </g>
  <rect x="228" y="186" width="72" height="44" rx="4" fill="var(--bg-light)" stroke="var(--secondary-color)" stroke-width="1.6" stroke-dasharray="5 3"/>
  <text x="264" y="204" text-anchor="middle" font-size="12" font-weight="700" fill="currentColor">컴패니언</text>
  <text x="264" y="222" text-anchor="middle" font-size="12" fill="currentColor">회피·추적</text>
  <!-- failsafe: FC acts without the link -->
  <rect x="108" y="244" width="192" height="48" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2"/>
  <text x="204" y="264" text-anchor="middle" font-size="12" font-weight="700" fill="var(--accent-color)">페일세이프 (RTL·착륙)</text>
  <text x="204" y="283" text-anchor="middle" font-size="12" fill="currentColor">링크가 끊겨도 FC가 스스로</text>
  <!-- the unreliable link -->
  <rect x="36" y="314" width="272" height="54" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="2" stroke-dasharray="7 4"/>
  <text x="172" y="337" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">데이터링크 — 지연·손실·끊김</text>
  <text x="172" y="357" text-anchor="middle" font-size="12" fill="currentColor">빠른 결정은 이 선을 넘지 않는다</text>
  <!-- on the ground -->
  <rect x="100" y="384" width="208" height="138" rx="6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.6"/>
  <text x="300" y="400" text-anchor="end" font-size="12" fill="var(--text-light)">지상</text>
  <rect x="108" y="408" width="192" height="50" rx="4" fill="var(--bg-light)" stroke="var(--accent-color)" stroke-width="3"/>
  <text x="204" y="429" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">GCS · 통제 앱</text>
  <text x="204" y="448" text-anchor="middle" font-size="12" fill="currentColor">표시 · 미션 · 모드 변경</text>
  <rect x="108" y="466" width="192" height="50" rx="4" fill="var(--bg-light)" stroke="currentColor" stroke-width="2"/>
  <text x="204" y="487" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">운용자</text>
  <text x="204" y="506" text-anchor="middle" font-size="12" fill="currentColor">임무를 계속할 것인가</text>
</svg>
<figcaption>위로 갈수록 빨리 반응해야 하는 결정이고, 그런 결정일수록 기체 안쪽에 산다. 링크는 지연되고 끊기므로, 끊겼을 때의 대응(귀환·착륙)조차 FC가 스스로 실행한다.</figcaption>
</figure>

이 표가 1단계에서 가장 중요한 그림입니다. 원칙은 단순합니다 — **빠르게 반응해야 하는 결정일수록 기체 안쪽에 있어야 합니다.** 무선 링크는 지연되고, 손실되고, 결국 끊기기 때문입니다. 지상의 앱이 수 ms 단위의 제어 루프에 끼어드는 설계는 처음부터 성립하지 않습니다.

그래서 통제 앱의 역할은 **"비행시키는 것"이 아니라 "목표를 주고, 관찰하고, 실패에 대응하는 것"** 입니다.

- **목표를 준다**: 비행 모드 전환, 미션(웨이포인트 목록) 업로드, 이륙·착륙·귀환 명령
- **관찰한다**: 위치·자세·배터리·GPS 품질·링크 상태 텔레메트리를 받아 사람이 이해할 수 있게 보여 준다
- **실패에 대응한다**: 명령이 거부되거나 응답이 없을 때, 링크가 약해질 때, 페일세이프가 발동했을 때 운용자에게 무엇을 보여 주고 무엇을 허용할지 정한다

> **주의 — 데이터링크 페일세이프는 기본값이 아닐 수 있습니다:** 기본으로 켜져 있는 것은 보통 RC 링크 손실 페일세이프이고, 텔레메트리(GCS) 링크 손실 페일세이프는 PX4·ArduPilot 모두 기본값에서 꺼져 있거나 별도 설정이 필요합니다. 동작(RTL·착륙·정지)과 타임아웃도 파라미터로 정합니다. 통제 앱으로만 운용하는 기체라면 이 설정이 필수이며, 9단계에서 자세히 다룹니다.

> **예외처럼 보이는 것 — Offboard 제어:** PX4의 Offboard 모드처럼 외부 컴퓨터가 위치·속도 setpoint를 계속 흘려보내 기체를 직접 조종하는 방식도 있습니다. 하지만 PX4는 이 스트림이 **2Hz 이상**으로 들어오지 않으면 Offboard를 빠져나와 페일세이프로 전환합니다. 즉 "끊기면 기체가 스스로 판단한다"는 원칙은 그대로이고, 보통 이 스트림은 무선 너머의 지상이 아니라 **기체에 실린 컴패니언 컴퓨터**가 보냅니다. Offboard는 심화 시리즈(`Drone-Autonomy`) 후보로 남겨 둡니다.

### 1.3 명령 하나가 지나가는 길

책임 경계를 실제 흐름으로 확인해 봅시다. 운용자가 통제 앱에서 **"귀환(RTL)"** 버튼을 눌렀을 때 일어나는 일입니다.

```mermaid
sequenceDiagram
    actor Op as 운용자
    participant App as 통제 앱 (GCS)
    participant Link as 텔레메트리 링크
    participant FC as FC 펌웨어
    participant Ctrl as 제어 루프·모터

    Op->>App: "귀환" 버튼
    App->>Link: MAVLink 명령 (RTL 요청)
    Link->>FC: 전달 (지연·손실 가능)
    FC->>FC: 수락 가능한지 검사 (모드·상태)
    FC-->>App: 명령 응답 (수락/거부)
    FC->>Ctrl: 귀환 경로 setpoint를 계속 생성
    loop 귀환 중 (수 Hz)
        FC-->>App: 위치·모드·배터리 텔레메트리
        App-->>Op: 지도·상태 표시
    end
```

이 그림에서 앱이 직접 하는 일은 **요청 하나를 보내고, 응답을 확인하고, 이후 상태를 보여 주는 것**뿐입니다. 귀환 경로를 계산하고, 고도를 올리고, 홈 위치로 이동해 착륙하는 일은 모두 FC가 합니다. 만약 응답이 오지 않는다면? 앱은 재전송해야 할까요, 운용자에게 경고해야 할까요? 이 질문들은 8단계(MAVLink 명령 프로토콜)와 9단계(페일세이프)에서 답합니다.

## 2. 기체 분류와 특성 — 형태가 앱을 바꾼다

### 2.1 네 가지 기본 형태

| 형태 | 양력을 얻는 방식 | 강점 | 약점 | 대표 용도 |
| --- | --- | --- | --- | --- |
| **멀티콥터** | 여러 개의 고정 피치 로터, 회전수 차이로 자세 제어 | 수직 이착륙, 제자리 비행(호버), 기계 구조가 단순 | 에너지 효율이 낮아 체공 시간이 짧음(보통 수십 분 이내) | 촬영, 점검, 근거리 배송 |
| **고정익** | 날개가 만드는 양력, 프로펠러는 전진 추력만 | 효율이 높아 체공 시간·거리가 김 | 호버 불가, 이착륙에 공간·장비 필요, 최소 속도 이하로 느려지면 실속 | 측량·매핑, 장거리 감시 |
| **VTOL** | 이착륙은 로터로, 순항은 날개로 (QuadPlane·tailsitter·tiltrotor) | 수직 이착륙 + 긴 순항 | 전환 구간 제어가 어렵고, 두 체계를 모두 실어 무겁고 복잡 | 장거리 매핑·배송 |
| **헬리콥터** | 큰 단일 로터 + 스워시플레이트로 피치 제어 | 멀티콥터보다 효율적인 호버, 큰 탑재량 | 기계 구조가 복잡하고 정비 부담이 큼 | 산업용 살포, 대형 탑재체 |

Essential 시리즈의 기본 대상은 **멀티콥터(쿼드콥터)** 입니다. 구조가 가장 단순하고, 호버가 가능해 실험이 안전하며, 시뮬레이터(SITL) 지원도 가장 충실하기 때문입니다. 다만 아래에서 보듯 통제 앱은 형태 차이를 알아야 합니다.

### 2.2 통제 앱이 형태를 알아야 하는 이유

같은 "명령"도 기체 형태에 따라 의미가 달라집니다.

- **"멈춰(Hold)"**: 멀티콥터는 그 자리에서 호버합니다. 고정익은 멈출 수 없으므로 그 지점을 중심으로 **원을 그리며 선회(loiter)** 합니다. 앱은 선회 반경을 지도에 그려야 합니다.
- **이착륙**: 멀티콥터는 "이륙 고도"만 있으면 되지만, 고정익 미션에는 활주·투척 이륙, 착륙 접근 경로와 방향이 필요합니다. VTOL은 전환(transition) 지점이 미션에 들어갑니다.
- **웨이포인트 사이의 경로**: 멀티콥터는 거의 직선으로 날 수 있지만, 고정익은 선회 반경 때문에 급격한 방향 전환을 할 수 없습니다.
- **배터리·체공 예측**: 같은 배터리 잔량이라도 호버 중인 멀티콥터와 순항 중인 고정익의 남은 비행시간은 전혀 다릅니다.

이 차이는 FC가 보내는 정보로 알 수 있습니다. MAVLink의 HEARTBEAT 메시지는 매초 **기체 형태(type)** 와 **오토파일럿 종류(autopilot)** 를 실어 보내고, 앱은 이것을 보고 UI와 허용 명령을 바꿉니다(8단계).

## 3. 오픈소스 드론 생태계 지도

### 3.1 층으로 나눠 보기

드론 소프트웨어는 이름이 많아 혼란스럽지만, **어느 층에 있는가**로 나누면 단순해집니다.

| 층 | 역할 | 주요 프로젝트 |
| --- | --- | --- |
| **FC 하드웨어** | 펌웨어가 도는 보드 | Pixhawk 계열 보드(Holybro·CubePilot 등), 각종 F4/F7/H7 보드 |
| **오토파일럿 펌웨어** | 상태 추정·제어·모드·미션·페일세이프 | **PX4**, **ArduPilot**, (FPV 계열) Betaflight·INAV |
| **통신 프로토콜** | 기체 ↔ 지상(그리고 기체 내부 장치끼리)의 메시지 규약 | **MAVLink** |
| **GCS 애플리케이션** | 상태 표시·미션 계획·설정 | **QGroundControl**, **Mission Planner**, MAVProxy(CLI) |
| **개발 라이브러리·미들웨어** | 앱이나 로봇 소프트웨어가 기체와 대화하는 API | **MAVSDK**, **pymavlink**, **ROS 2**(PX4: uXRCE-DDS, ArduPilot: AP_DDS, 공통: MAVROS) |
| **시뮬레이션** | 실기체 없이 펌웨어를 돌리는 환경 | PX4 SITL·ArduPilot SITL, Gazebo |

### 3.2 오토파일럿: PX4 vs ArduPilot (그리고 Betaflight)

오픈소스 오토파일럿은 사실상 두 갈래입니다.

- **PX4**: ETH Zürich에서 시작해 현재 Linux Foundation 산하 **Dronecode Foundation**이 관리합니다. **BSD-3 라이선스**라 수정본을 공개할 의무가 없어 기업이 상용 제품에 채택하기 쉽습니다. 모듈들이 uORB라는 메시지 버스로 통신하는 구조이며, QGroundControl·MAVSDK와 같은 Dronecode 도구들과 가장 긴밀하게 맞물립니다.
- **ArduPilot**: 커뮤니티 주도의 오래된 프로젝트로, 멀티콥터·고정익·헬리콥터·로버·보트·잠수정까지 지원 기체가 매우 넓습니다. **GPLv3 라이선스**라 수정한 펌웨어를 배포하면 소스를 공개해야 합니다. 방대한 파라미터와 검증된 운용 기능이 강점이며, 전통적으로 Mission Planner와 짝을 이룹니다.
- **Betaflight·INAV**: 둘 다 FPV 계열 펌웨어입니다. Betaflight는 레이싱·프리스타일용으로, 사람이 직접 조종하는 반응성에 최적화되어 있고 자율 미션을 중심에 두지 않습니다. INAV는 같은 계보에서 나왔지만 **항법 중심**으로, 위치 유지·귀환·웨이포인트 미션과 고정익·장거리 비행을 지원합니다. 다만 MAVLink 지원이 제한적이어서, **MAVLink 통제 앱의 대상으로는 PX4·ArduPilot이 기본**입니다.

두 오토파일럿의 내부 구조는 6단계에서 비교합니다. 1단계에서 기억할 것은 **둘 다 MAVLink를 말한다**는 점입니다. 그래서 하나의 통제 앱이 두 펌웨어를 모두 다룰 수 있지만, 비행 모드 이름·파라미터·일부 명령의 의미는 다르기 때문에 "같은 프로토콜, 다른 방언"으로 생각해야 합니다.

### 3.3 MAVLink — 생태계를 잇는 공용어

**MAVLink**는 가볍고 바이너리로 된 메시지 프로토콜입니다. 기체 상태(HEARTBEAT, 위치, 자세, 배터리…), 명령(이륙·모드 전환·귀환…), 미션·파라미터 전송 규약까지 정의합니다. 하나의 링크 위에서 여러 **시스템**(기체·GCS)과 각 시스템 안의 여러 **컴포넌트**(FC·카메라·짐벌·컴패니언 컴퓨터)를 ID로 구분합니다.

통제 앱 입장에서 MAVLink는 이렇게 생겼습니다. 아래는 pymavlink로 시뮬레이터에 연결해 첫 HEARTBEAT를 받고, **상대가 어떤 기체·어떤 펌웨어인지** 확인하는 최소 예제입니다. 실행 환경(SITL)은 10단계에서 구성하므로, 지금은 "앱이 가장 먼저 묻는 질문이 무엇인가"만 읽어 두면 됩니다.

```python
# pip install pymavlink
from pymavlink import mavutil

# PX4 SITL은 GCS용 MAVLink를 UDP 14550 포트로 내보낸다
# (QGC가 켜져 있으면 14550을 점유하므로 QGC를 끄거나 MAVProxy 등으로 분기 — 3.4절)
conn = mavutil.mavlink_connection("udpin:0.0.0.0:14550")

# 1) 연결 수립: 상대의 HEARTBEAT를 기다린다 (보통 1Hz로 송신됨)
hb = conn.wait_heartbeat(timeout=10)
if hb is None:
    raise SystemExit("HEARTBEAT 없음 — 링크 또는 포트 설정을 확인")

enums = mavutil.mavlink.enums
print("system id   :", conn.target_system)     # 어느 기체인가
print("component id:", conn.target_component)  # 그 기체의 어느 장치인가 (보통 FC = 1)
print("vehicle type:", enums["MAV_TYPE"][hb.type].name)            # 예: MAV_TYPE_QUADROTOR
print("autopilot   :", enums["MAV_AUTOPILOT"][hb.autopilot].name)  # 예: MAV_AUTOPILOT_PX4
print("flight mode :", conn.flightmode)        # 펌웨어별 모드 이름으로 해석된 값
```

이 몇 줄에 1단계의 지도가 거의 다 들어 있습니다. **system id**는 "어느 기체인가", **component id**는 "그 기체의 어느 장치인가", **type**은 "어떤 형태인가(2절)", **autopilot**은 "어떤 방언을 쓰는가(3.2절)"에 대한 답입니다. 통제 앱은 이 정보를 먼저 확인하고 나서야 무엇을 보여 주고 어떤 명령을 허용할지 결정할 수 있습니다.

### 3.4 GCS와 개발 라이브러리 — 통제 앱의 자리

이미 완성된 GCS가 있는데 왜 통제 앱을 새로 만들까요? 기존 GCS는 **범용 도구**입니다. 기체 설정·캘리브레이션·펌웨어 업로드·미션 계획까지 모든 것을 다루기 때문에 기능이 많고, 특정 업무(예: 정해진 구역 반복 점검, 여러 기체 동시 감시, 업무 시스템 연동)에 맞추기는 어렵습니다. 통제 앱은 그 업무에 필요한 흐름만 남기고, 기체 설정 같은 일은 기존 GCS에 맡기는 쪽이 현실적입니다.

| 도구 | 성격 | 통제 앱과의 관계 |
| --- | --- | --- |
| **QGroundControl** | Dronecode의 크로스플랫폼 GCS (Qt) | 기체 설정·캘리브레이션은 QGC로, 업무 흐름은 우리 앱으로. 동작의 기준점(레퍼런스)으로도 사용 |
| **Mission Planner** | ArduPilot 진영의 Windows GCS | ArduPilot 파라미터·로그 분석의 기준점 |
| **MAVProxy** | 명령줄 GCS·MAVLink 라우터 | 하나의 링크를 여러 앱(QGC + 우리 앱)으로 분기 |
| **pymavlink** | MAVLink 메시지를 직접 다루는 저수준 라이브러리 | 프로토콜을 배우고 세밀하게 제어할 때 |
| **MAVSDK** | 연결·텔레메트리·액션·미션을 고수준 API로 감싼 라이브러리 (PX4 기준) | 통제 앱의 첫 구현 후보 (10단계) |
| **ROS 2** | 로봇 소프트웨어 미들웨어 | 자율비행·컴패니언 컴퓨터 쪽에 적합, 심화 후보 |

> **오픈 생태계 밖의 세계:** 시장 점유율이 큰 DJI 기체는 자체 폐쇄형 펌웨어와 전용 SDK(Mobile SDK·Payload SDK 등)를 쓰며 MAVLink 생태계와는 별개입니다. 이 시리즈는 **MAVLink를 말하는 오픈 오토파일럿**을 대상으로 하므로 DJI SDK는 범위 밖에 둡니다. 같은 통제 앱으로 두 세계를 모두 다루려면 앱 내부에 기체 추상화 계층이 필요하다는 점만 기억해 두면 됩니다.

### 3.5 지도 위에 앱을 놓기

지금까지의 내용을 하나로 모으면, 통제 앱의 자리는 다음 한 문장으로 정리됩니다.

> **통제 앱은 GCS 층에서 MAVLink(필요하면 MAVSDK를 거쳐)로 PX4·ArduPilot 펌웨어와 대화하며, 목표를 주고, 상태를 관찰하고, 실패에 대응하는 소프트웨어다.**

이 문장의 각 단어가 이후 단계와 연결됩니다.

| 문장의 조각 | 이것을 이해하려면 |
| --- | --- |
| "상태를 관찰" — 위치·자세·고도 숫자의 의미 | 2단계(좌표계·자세), 4단계(GNSS·상태 추정) |
| "PX4·ArduPilot 펌웨어" — 무엇이 기체 안에서 일어나는가 | 3단계(하드웨어), 5단계(비행 제어), 6단계(펌웨어) |
| "MAVLink로 대화" — 무엇을 어떤 링크로 | 7단계(통신 링크), 8단계(MAVLink·GCS) |
| "실패에 대응" — 링크 손실·거부·페일세이프 | 9단계(안전·규제) |
| "소프트웨어" — 실제로 만들어 보기 | 10단계(SITL 위 첫 통제 앱) |

## 4. 운용 노트

### 4.1 "기체"와 "운용자"를 빼먹지 않기

개발자는 FC와 앱 사이의 소프트웨어에만 집중하기 쉽지만, 실제 사고의 원인은 지도 양 끝에서 자주 나옵니다. 배터리 열화·프로펠러 손상·진동 같은 **기체 쪽 문제**, 그리고 경고를 놓치거나 모드를 잘못 바꾸는 **운용자 쪽 문제**입니다. 좋은 통제 앱은 이 두 끝을 화면에 드러냅니다 — 기체 상태를 숨기지 않고, 운용자가 위험한 명령을 실수로 보내지 않게 합니다.

### 4.2 법적으로는 "무인비행장치"

국내 항공안전법은 일정 중량 이하의 무인 비행체를 초경량비행장치의 한 종류인 **무인비행장치**로 분류하고, **중량과 비행 공역에 따라** 기체 신고·조종자 증명·비행 승인 같은 의무를 운용자에게 지웁니다. 앱을 만드는 사람에게도 이 규칙은 기능 요구사항이 됩니다(예: 비행 금지 구역 표시, 고도 제한 경고). 세부 기준은 9단계에서 최신 법령·시행규칙을 확인하며 정리합니다.

## 마무리

1단계에서 그린 지도는 단순합니다. 드론은 **기체·FC·데이터링크·GCS·운용자로 이루어진 시스템**이고, 각 요소의 책임은 **반응해야 하는 시간 척도**로 갈립니다. 빠른 결정은 기체 안에, 느린 판단은 지상에 있습니다. 기체 형태는 같은 명령의 의미를 바꾸고, 오픈소스 생태계는 FC 하드웨어 → 펌웨어 → MAVLink → GCS·라이브러리의 층으로 나뉩니다. 그리고 우리의 통제 앱은 그 맨 위에서 **목표를 주고, 관찰하고, 실패에 대응**합니다.

다음 단계는 이 지도에서 가장 먼저 채워야 할 칸인 **2단계: 좌표계 · 자세 · 비행 역학**입니다. 통제 앱이 받는 모든 숫자가 어떤 좌표계 기준인지, 기체의 자세를 어떻게 표현하는지, 그리고 멀티콥터가 모터 회전수만으로 어떻게 움직이는지를 다룹니다.

### 다음 학습

- [Drone Control Essential Curriculum](/2026/11/05/drone-control-essential-curriculum.html) — 시리즈 전체 지도와 진행률
- 다음: [좌표계 · 자세 · 비행 역학](/2026/11/05/drone-frames-attitude-dynamics.html) — 숫자의 기준, 자세 표현, 멀티콥터가 움직이는 원리
- [Network Essential Curriculum](/2026/07/29/network-essential-curriculum.html) — 텔레메트리가 UDP 위로 흐르는 원리의 기초
