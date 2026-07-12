# TODOS — 위키 컨텐츠 작업 목록

이 문서는 Orc Hwang's Wiki에 등록할 **모든 컨텐츠(아티클 포스트, 시리즈, 기타)** 의 작업 대기 목록이다.

## 운영 규칙

- **완료된 항목은 삭제한다.** (체크만 남기지 않고 목록에서 제거 — 이 문서에는 "아직 안 된 일"만 남는다.)
- **아티클 포스트**는 `article-manager` 서브에이전트가 원문을 가져와 작성한다.
- **에이전트가 원문에 직접 접근하지 못하는 경우**(이 세션의 egress 정책이 해당 호스트를 차단 → `403 CONNECT policy denial`)에는, 제목·URL만으로 지어내지 않고 **여기 남겨 둔다.** 사용자가 잊지 않고 **원문 텍스트를 직접 전달**하면 그때 작성한다. (지난 사례: `arxiv.org`, `thenextweb.com`, `transformer-circuits.pub`, `multigres.com` 등이 차단됨.)
- 항목 상태 표기: `[대기: 원문 전달 필요]` = 접근 차단, 사용자 원문 대기 · `[작성 가능]` = 접근 가능하거나 원문 확보 · `[진행 중]` = 작성/삽화 중.

---

## 아티클 포스트 (Articles)

- [ ] **Interview with Mitchell Hashimoto** — `[대기: 원문 전달 필요]`
  - URL: <https://alexalejandre.com/programming/interview-with-mitchell-hashimoto/>
  - 내용: HashiCorp·Ghostty 창업자 Mitchell Hashimoto 인터뷰 (프로그래밍/엔지니어링 커리어). 분류 예상: `Articles/Engineering-Culture` (인물·인터뷰) — 원문 확인 후 확정.
  - 메모: 원문 접근 시도 시 egress 정책 차단 여부 확인 필요. 차단되면 사용자가 원문 텍스트 전달.

- [ ] **I made a Claude Code session manager for tmux** — `[대기: 원문 전달 필요]`
  - URL: <https://www.devas.life/i-made-a-claude-code-session-manager-for-tmux/>
  - 내용: devas.life 저자가 Claude Code(코딩 에이전트) 세션을 tmux로 관리하기 위해 만든 개발자 도구/워크플로우 소개로 추정. 분류 예상: `Articles/AI-Engineering` (코딩 에이전트를 운영하는 실무 — 하니스·워크플로우·인프라) — 원문 확인 후 확정.
  - 메모: egress 정책 차단(`403 CONNECT policy denial`, host `www.devas.life:443`). 도구 이름·설치법·사용법 등 구체 사실은 원문 없이 지어낼 수 없으므로, 사용자가 원문 텍스트 전달 시 작성.

- [ ] **Good Tools are Invisible** — `[대기: 원문 전달 필요]`
  - URL: <https://www.gingerbill.org/article/2026/07/10/good-tools-are-invisible/>
  - 내용: gingerbill(Bill Hall, Odin 프로그래밍 언어 창시자)의 블로그 에세이. 제목상 "좋은 도구는 (사용자에게) 보이지 않는다"는 도구 설계 철학/엔지니어링 문화에 관한 글로 추정. 분류 예상: `Articles/Engineering-Culture` (도구 설계 철학·엔지니어링 문화 에세이). 도구 설계보다 시스템/저수준 기술 심화 비중이 크면 `Articles/Systems-Programming`도 후보 — 원문 확인 후 확정.
  - 메모: egress 정책 차단(`403 CONNECT policy denial`, host `www.gingerbill.org:443`, `connect_rejected`). 핵심 논지·섹션 구조·인용 등 구체 사실은 원문 없이 지어낼 수 없으므로, 사용자가 원문 텍스트 전달 시 작성.

- [ ] **AI 2040 (ai-2040.com)** — `[대기: 원문 전달 필요]`
  - URL: <https://ai-2040.com/>
  - 내용: **주제 미상 — 원문 확인 필요.** 도메인명("AI 2040")으로 보아 2040년경 AI의 미래를 다루는 아티클/에세이/프로젝트 사이트로 추정되나, 원문에 접근하지 못해 성격(아티클/에세이/보고서/인터랙티브 프로젝트)·저자·발행처·핵심 논지를 확인할 수 없음. 분류 예상: AI 관련이면 `Articles/AI-Essays` 또는 `Articles/AI-Industry` 후보 — 원문 확인 후 확정.
  - 메모: egress 정책 차단(`403 CONNECT policy denial`, host `ai-2040.com:443`, `connect_rejected`). URL만으로는 주제가 불명확하므로 지어내지 않음. 사용자가 원문 텍스트 전달 시 작성.

---

## 시리즈 · 기타 컨텐츠

_(현재 대기 항목 없음)_
