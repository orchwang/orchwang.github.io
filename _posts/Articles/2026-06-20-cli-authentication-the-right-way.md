---
layout: post
title: "CLI 인증, 제대로 하는 법: 왜 기본값은 Device Flow여야 하는가"
date: 2026-06-20
categories: Articles
tags: [articles, oauth, cli, authentication, security, device-flow]
published: true
excerpt: "ABGEO의 'CLI Authentication, the Right Way'를 읽고, CLI 도구가 OAuth 인증으로 loopback flow 대신 Device Authorization Grant(RFC 8628)를 기본값으로 써야 하는 이유를 개발자 관점에서 분석·정리한다."
---

## 원문 정보

> - **제목**: CLI Authentication, the Right Way
> - **출처**: ABGEO — Avtandil Kikabidze ([abgeo.dev](https://www.abgeo.dev/))
> - **발행**: 개인 블로그 게시글
> - **원문 링크**: <https://www.abgeo.dev/blog/cli-authentication-the-right-way/>

`Articles` 카테고리는 읽을 만한 외부 아티클을 골라 핵심을 정리하고 내 관점으로 분석하는 공간이다. 이번엔 우리가 매일 `gcloud`, `wrangler`, `aws`, `claude`를 치면서 무심코 넘기던 "CLI 로그인"의 설계 결함을 정면으로 다룬 글을 골랐다.

(참고: 원문 도메인이 자동화된 접근을 차단하고 있어, 여러 색인된 요약을 교차 검증해 사실에 충실하게 정리했다. 일부 세부 수치나 인용은 원문에서 직접 확인하길 권한다.)

## 한 줄 요약 (TL;DR)

CLI 인증은 2019년에 이미 풀린 문제다. 그런데도 대부분의 대표 CLI는 여전히 **loopback flow를 기본값**으로 쓰고, 그게 깨질 때를 대비한 "코드 붙여넣기" 폴백을 함께 달고 다닌다. 저자의 결론은 단순하다. **input-constrained 환경을 위해 설계된 Device Authorization Grant(RFC 8628)를 기본으로 삼으라.** 원문의 한 줄: *"매번 노트북을 벗어나는 순간 수동으로 코드를 붙여넣어야 한다면, 그 폴백이야말로 진짜 흐름이다."*

## 왜 이 글을 골랐나

CLI 로그인은 너무 흔해서 아무도 의심하지 않는 영역이다. `gcloud auth login`을 치면 브라우저가 뜨고, 어쩌다 SSH나 컨테이너 안에서는 "이 URL을 복사해서 여세요" 하는 안내가 나온다. 우리는 그걸 그냥 "원래 그런 것"으로 받아들인다.

이 글의 가치는 그 익숙함을 흔드는 데 있다. 저자는 "폴백이 매번 발동된다면 그건 폴백이 아니라 본 흐름"이라는 한 문장으로, 잘못된 기본값(default)이 어떻게 사용자 경험과 보안을 동시에 망치는지를 드러낸다. 좋은 기본값을 고르는 일, 표준을 제대로 읽고 쓰는 일 — 이건 인증 한정 이야기가 아니라 모든 엔지니어링 결정에 적용되는 사고법이다.

## 핵심 내용

### Loopback flow는 어떻게 동작하나 (RFC 8252)

"OAuth 2.0 for Native Apps"(RFC 8252)가 권장하는 흐름이다.

1. CLI가 시스템 브라우저를 열어 OAuth authorization endpoint로 보낸다. 이때 `redirect_uri=http://127.0.0.1:<port>/callback`(또는 `http://localhost:8085/`)을 넘긴다.
2. CLI는 동시에 그 포트에 작은 **loopback HTTP 서버**를 띄운다.
3. 사용자가 브라우저에서 인증을 마치면, 브라우저가 그 `127.0.0.1` 주소로 authorization code를 들고 redirect된다.
4. CLI의 로컬 서버가 그 요청을 받아 code를 집어내고, token endpoint에서 code를 토큰으로 교환한다(보통 PKCE를 함께 붙인다).
5. 교환이 끝나면 로컬 서버를 닫는다.

브라우저가 있는 호스트에서, 개발자가 모든 걸 한 머신에서 돌릴 때는 이 흐름이 잘 맞는다. RFC 8252도 그 전제에서 이 방식을 권한다.

### Loopback을 "기본값"으로 쓸 때 무엇이 잘못되나

- **호스트에 브라우저가 없을 때**: RFC 8252는 headless 호스트를 다루지 않는다. SSH 세션, 원격 서버, 컨테이너, CI에는 열 브라우저가 없다.
- **WSL**: loopback 서버는 Linux 쪽에서 돌고 브라우저는 Windows에서 열린다. WSL2 포트 포워딩이 "대체로는 맞게" 처리하지만 — 즉, 항상은 아니다.
- **공유 머신에서의 보안**: 같은 머신의 다른 프로세스가 `/proc/net/tcp`를 읽어 리스닝 포트를 알아내거나, 알려진 포트를 먼저 차지하려 race를 걸 수 있다.
- **결정적 증거(the tell)**: loopback을 기본으로 쓰는 모든 CLI는 그게 깨질 때를 위한 폴백을 함께 출하한다. `gcloud`의 `--no-launch-browser`, 멈춰 서서 "이 localhost URL을 직접 curl하라"고 안내하는 Wrangler, "프롬프트가 뜨면 여기 코드를 붙여넣으라"고 출력하는 Anthropic의 `claude` — 이 폴백들은 **모두 사실상 device flow를 손으로 흉내 낸 것**이다.

### 제대로 된 방법 — Device Authorization Grant (RFC 8628)

2019년에 발행된 RFC 8628은 TV, 콘솔, 그리고 CLI 같은 **"input-constrained devices"** 를 위해 설계됐다. 핵심은 **토큰을 요청하는 기기와 사용자가 인증하는 기기를 분리**한다는 것이다.

- CLI가 URL과 user code를 화면에 띄운다.
- 사용자는 아무 브라우저(휴대폰이든 노트북이든)에서 그 URL을 열고 코드를 입력해 승인한다.
- 그동안 CLI는 token endpoint를 **polling**하며 승인이 떨어지길 기다린다.

브라우저가 같은 호스트에 있을 필요가 없으니, SSH·컨테이너·CI·WSL 어디서든 동일하게 동작한다.

### 누가 제대로 하고, 누가 틀렸나

- **`aws sso login`**: IAM Identity Center를 상대로 device flow를 처음부터 끝까지 돌린다. (다만 AWS CLI v2.22.0부터 기본값을 PKCE 기반 authorization code flow로 바꿨고, device code는 `--use-device-code`로 여전히 쓸 수 있다.)
- **`vercel login`**: 2025년 9월에 RFC 8628로 이동하며, 이메일 기반 로그인과 옛 `--oob` 플래그를 대체했다.
- **여전히 loopback을 기본값으로 두고 코드 붙여넣기 폴백을 매단 곳**: Google의 `gcloud`, Cloudflare의 `wrangler`, 그리고 Anthropic 자신의 `claude`. 연 수십억 달러를 버는 회사들이 그렇다.

### 저자의 권장 사항

- **Device flow를 기본값으로 한다.**
- endpoint는 `.well-known/openid-configuration`에서 **discover**한다 — URL을 하드코딩하지 않는다.
- polling interval과 `slow_down` 응답을 **존중한다**.
- refresh token은 `~/.config` 아래 평문 JSON이 아니라 **OS keychain**에 저장한다.
- 노트북에서의 빠른 로그인을 위해 loopback 경로를 남기고 싶다면, `--web` 플래그 **뒤로 숨기고 기본값으로 두지 않는다**.

## 분석과 인사이트

(아래는 원문 요약이 아니라 내 관점이다.)

- **"폴백이 매번 발동되면 그건 본 흐름이다"는 설계 진단의 정수다.** 이 한 문장은 인증을 넘어 모든 기능에 적용된다. 예외 경로가 사실은 다수 경로라면, 기본값을 잘못 고른 것이다. 코드에서 `else` 가지가 정상 동작을 떠받치고 있다면, 그 `else`가 진짜 본문이다. 좋은 엔지니어링은 *흔한 경우를 기본값으로* 만든다.
- **Loopback이 틀린 게 아니라, "기본값으로서의 loopback"이 틀렸다.** 저자가 loopback 자체를 폐기하라고 말하지 않는 점이 중요하다. 단일 머신 개발자에겐 여전히 빠르고 좋은 경험이다. 문제는 **포괄성(headless, 원격, 공유 머신)을 가진 쪽을 기본으로 삼지 않은 것.** 더 좁은 전제를 기본값에 둔 게 화근이다.
- **표준은 "있다"가 아니라 "읽었다"가 중요하다.** RFC 8628은 2019년에 나왔고 CLI를 명시적 대상으로 꼽았다. 그런데도 대형 벤더들이 틀린 기본값을 유지한다는 건, 표준의 부재가 아니라 **표준을 끝까지 읽고 의도대로 적용하는 규율의 부재**가 진짜 병목임을 보여준다.
- **보안 디테일이 인상적이다.** `/proc/net/tcp`로 포트를 엿보거나 알려진 포트를 race로 선점할 수 있다는 지적은, "localhost니까 안전하다"는 흔한 착각을 정확히 깬다. 공유 호스트에서 loopback은 신뢰 경계(trust boundary)가 생각만큼 단단하지 않다.
- **refresh token을 OS keychain에 두라는 조언은 사소해 보이지만 핵심이다.** 평문 JSON에 장기 자격증명을 두는 관행은 CLI 생태계에 너무 흔하다. 토큰 유출의 폭발 반경(blast radius)을 줄이는 가장 값싼 조치다.

## 적용 포인트

- CLI에 OAuth 로그인을 붙인다면 **device flow(RFC 8628)를 기본 경로로** 설계하고, loopback은 `--web` 같은 플래그 뒤로 옵트인 처리한다.
- 내가 만드는 도구가 **SSH·컨테이너·CI·WSL에서 한 번에 동작하는지**를 인증 설계의 첫 검증 기준으로 삼는다. "노트북에서 되니까 됐다"로 끝내지 않는다.
- token/authorization endpoint를 코드에 박지 말고 **`.well-known/openid-configuration`에서 discover**한다.
- polling을 구현할 땐 서버가 돌려주는 **interval과 `slow_down`을 반드시 존중**한다 — 고정 간격 폴링은 rate limit에 걸린다.
- 장기 자격증명(refresh token)은 평문 파일이 아니라 **OS keychain**(macOS Keychain, Windows Credential Manager, libsecret 등)에 저장한다.
- 기능을 설계할 때마다 자문한다: **"내가 폴백이라 부른 경로가, 실제로는 가장 자주 밟히는 경로 아닌가?"**

## 마무리

이 글은 "loopback은 나쁘다"는 단순 비판이 아니라, **좋은 기본값을 고르는 일에 관한 사례 연구**다. 더 포괄적인 경우(headless·원격·공유 머신)를 기본에 두고, 더 좁은 경우(단일 노트북)를 옵션으로 내리라 — 이 한 가지 재배치가 사용자 경험과 보안을 동시에 끌어올린다. 표준은 이미 7년 전부터 답을 주고 있었다. 남은 일은 그 표준을 끝까지 읽고, 옳은 쪽을 기본값으로 결정할 규율뿐이다.

### 더 읽어보기

- [원문 — CLI Authentication, the Right Way](https://www.abgeo.dev/blog/cli-authentication-the-right-way/)
- [Software Architecture in Practice](/2026/06/19/software-architecture-in-practice.html) — 좋은 기본값과 신뢰 경계를 둘러싼 아키텍처 품질 속성의 관점
