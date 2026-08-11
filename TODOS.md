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

### Data Engineering 심화 연재 (별도 `*-Essential` 시리즈)

`Data-Engineering-Essential` 오버뷰 시리즈(완주 100%)에서 분리 예고된 심화 시리즈들.
조사 결과·단계 구성·우선순위는 **[DATA-ENGINEERING-SERIES-PLAN.md](./DATA-ENGINEERING-SERIES-PLAN.md)** 참고.
착수 순서 권장: Spark → Kafka → dbt → Airflow (Tier 1) → Iceberg/Lakehouse → Flink (Tier 2).

6개 시리즈 모두 **마스터 커리큘럼 작성 완료 + 오버뷰 역방향 링크 연결 완료** (Airflow-Essential·dbt-Essential·Kafka-Essential은 6/6, Lakehouse-Essential은 7/7 단계 딥다이브 + 삽화까지 완주 → 목록에서 삭제). 이제 남은 일은
각 시리즈의 **단계별 딥다이브 포스트 작성**이다 (작성마다 해당 커리큘럼 도장깨기 체크박스·진행률 갱신,
오름차순 date 시각 `00:01:00`, `00:02:00`…로 순서 보장). 시리즈는 마지막 단계까지 완주 시 이 목록에서 삭제.

- [ ] **Spark-Essential** — 커리큘럼 완료, 단계 딥다이브 0/7. `[딥다이브 대기]`
- [ ] **Stream-Processing-Essential (Flink)** — 커리큘럼 완료, 단계 딥다이브 0/6. `[딥다이브 대기]`
- 삽화: **6개 커리큘럼 모두 삽화 완료**(헤더 + 3막 through-line 인라인 SVG). 단계 딥다이브 작성 시 각 포스트도 삽화 패스 필요.
