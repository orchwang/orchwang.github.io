# TODOS — 위키 컨텐츠 작업 목록

이 문서는 Orc Hwang's Wiki에 등록할 **모든 컨텐츠(아티클 포스트, 시리즈, 기타)** 의 작업 대기 목록이다.

## 운영 규칙

- **완료된 항목은 삭제한다.** (체크만 남기지 않고 목록에서 제거 — 이 문서에는 "아직 안 된 일"만 남는다.)
- **아티클 포스트**는 `article-manager` 서브에이전트가 원문을 가져와 작성한다.
- **에이전트가 원문에 직접 접근하지 못하는 경우**(이 세션의 egress 정책이 해당 호스트를 차단 → `403 CONNECT policy denial`)에는, 제목·URL만으로 지어내지 않고 **여기 남겨 둔다.** 사용자가 잊지 않고 **원문 텍스트를 직접 전달**하면 그때 작성한다. (지난 사례: `arxiv.org`, `thenextweb.com`, `transformer-circuits.pub`, `multigres.com` 등이 차단됨.)
- 항목 상태 표기: `[대기: 원문 전달 필요]` = 접근 차단, 사용자 원문 대기 · `[작성 가능]` = 접근 가능하거나 원문 확보 · `[진행 중]` = 작성/삽화 중.

---

## 아티클 포스트 (Articles)

- [ ] **The Limits of Rust (Sylvain Kerkour)** — `[대기: 원문 전달 필요]`
  - URL: https://kerkour.com/the-limits-of-rust
  - 내용: Rust의 한계를 다루는 시스템 프로그래밍 에세이로 추정(제목 기준). 구체적 논지·수치·인용은 원문 미확인이라 단정 불가. 분류 예상: `Articles/Systems-Programming` — 원문 확인 후 확정.
  - 메모: egress 정책 차단(`403 CONNECT policy denial`, host `kerkour.com:443`). WebFetch·curl 모두 CONNECT 단계에서 차단됨. 사용자가 원문 텍스트 전달 시 작성.

- [ ] **Code Was Never the Hard Part is an Insult to All Programmers (Senko Rašić)** — `[대기: 원문 전달 필요]`
  - URL: https://blog.senko.net/code-was-never-the-hard-part-is-an-insult-to-all-programmers
  - 내용: "Code Was Never the Hard Part"라는 (AI 코딩 시대에 코드 작성의 가치를 평가절하하는) 주장에 대한 반박 에세이로 추정(제목 기준). 구체적 논지·인용은 원문 미확인이라 단정 불가. 분류 예상: `Articles/Engineering-Culture` 또는 `Articles/AI-Industry` — 원문 확인 후 확정.
  - 메모: egress 정책 차단(`EGRESS_BLOCKED`, domain `blog.senko.net`). WebFetch로 차단 확인. 사용자가 원문 텍스트 전달 시 작성.

- [ ] **Engineering Leaders' Day-to-Day Activities (Software Leads, Substack)** — `[대기: 원문 전달 필요]`
  - URL: https://softwareleads.substack.com/p/engineering-leaders-day-to-day-activities
  - 내용: 엔지니어링 리더(EM/테크리드 등)의 일상 업무·시간 배분을 다루는 글로 추정(제목 기준). 구체적 논지·목록은 원문 미확인이라 단정 불가. 분류 예상: `Articles/Career-Life` 또는 `Articles/Engineering-Culture` — 원문 확인 후 확정.
  - 메모: egress 정책 차단(`EGRESS_BLOCKED`, domain `softwareleads.substack.com`). WebFetch로 차단 확인. 사용자가 원문 텍스트 전달 시 작성.

(2026-07-18: 이전에 egress 차단으로 파킹돼 있던 7건 — Mitchell Hashimoto 인터뷰, Good Tools are Invisible, AI 2040: Plan A, Martin Fowler fragment(7/13), On Data Quality(1), HTTP429(실제 주제: 확장성/성능), make out like bandits — 은 차단이 풀려 모두 작성 완료 후 삭제.)

---

## 시리즈 · 기타 컨텐츠

_대기 중인 시리즈 없음._ (2026-08-03: `Data-Engineering-Essential`에서 분리 예고된 심화 연재 6개 — Spark·Kafka·dbt·Airflow·Lakehouse·Stream-Processing(Flink) — 모두 **마스터 커리큘럼 + 전 단계 딥다이브 + 삽화 + 도장깨기 100% + 오버뷰 역방향 링크**까지 완주 확인 후 삭제. 마지막까지 남아 있던 Spark-Essential(7/7)·Stream-Processing-Essential(6/6)도 딥다이브·삽화 완료 검증됨. 조사·계획 기록은 [DATA-ENGINEERING-SERIES-PLAN.md](./DATA-ENGINEERING-SERIES-PLAN.md) 참고.)
