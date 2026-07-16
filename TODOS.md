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

- [ ] **Good Tools are Invisible** — `[대기: 원문 전달 필요]`
  - URL: <https://www.gingerbill.org/article/2026/07/10/good-tools-are-invisible/>
  - 내용: gingerbill(Bill Hall, Odin 프로그래밍 언어 창시자)의 블로그 에세이. 제목상 "좋은 도구는 (사용자에게) 보이지 않는다"는 도구 설계 철학/엔지니어링 문화에 관한 글로 추정. 분류 예상: `Articles/Engineering-Culture` (도구 설계 철학·엔지니어링 문화 에세이). 도구 설계보다 시스템/저수준 기술 심화 비중이 크면 `Articles/Systems-Programming`도 후보 — 원문 확인 후 확정.
  - 메모: egress 정책 차단(`403 CONNECT policy denial`, host `www.gingerbill.org:443`, `connect_rejected`). 핵심 논지·섹션 구조·인용 등 구체 사실은 원문 없이 지어낼 수 없으므로, 사용자가 원문 텍스트 전달 시 작성.

- [ ] **AI 2040 (ai-2040.com)** — `[대기: 원문 전달 필요]`
  - URL: <https://ai-2040.com/>
  - 내용: **주제 미상 — 원문 확인 필요.** 도메인명("AI 2040")으로 보아 2040년경 AI의 미래를 다루는 아티클/에세이/프로젝트 사이트로 추정되나, 원문에 접근하지 못해 성격(아티클/에세이/보고서/인터랙티브 프로젝트)·저자·발행처·핵심 논지를 확인할 수 없음. 분류 예상: AI 관련이면 `Articles/AI-Essays` 또는 `Articles/AI-Industry` 후보 — 원문 확인 후 확정.
  - 메모: egress 정책 차단(`403 CONNECT policy denial`, host `ai-2040.com:443`, `connect_rejected`). URL만으로는 주제가 불명확하므로 지어내지 않음. 사용자가 원문 텍스트 전달 시 작성.

- [ ] **martinfowler.com fragment (2026-07-13) — 주제 미상(fragment) · 원문 확인 필요** — `[대기: 원문 전달 필요]`
  - URL: <https://martinfowler.com/fragments/2026-07-13.html>
  - 내용: **주제 미상 — 원문 확인 필요.** Martin Fowler 사이트의 "fragment"(짧은 글/메모) 형식이며, URL에 제목·주제가 드러나지 않아 무슨 내용인지(저자·핵심 논지·섹션 구조) 확인 불가. 마틴 파울러 사이트 특성상 소프트웨어 설계·리팩터링·엔지니어링 문화 관련일 가능성이 높으나 지어낼 수 없음. 분류 예상: 엔지니어링 설계/문화면 `Articles/Engineering-Culture` 유력 — 원문 확인 후 실제 주제에 맞게 확정.
  - 메모: egress 정책 차단(`403 CONNECT policy denial`, host `martinfowler.com:443`, `connect_rejected` — 프록시 `recentRelayFailures`에 기록됨). fragment라 URL만으로는 주제가 불명확하므로 지어내지 않음. 사용자가 원문 텍스트 전달 시 작성.

- [ ] **On Data Quality (1): Basics** — `[대기: 원문 전달 필요]`
  - URL: <https://pivotal.substack.com/p/on-data-quality-1-basics>
  - 내용: Substack 뉴스레터(pivotal.substack.com)의 데이터 품질 연재 1편으로, 제목상 "데이터 품질의 기초"를 다루는 것으로 추정(정의·차원·측정·거버넌스 등). 원문에 접근하지 못해 저자·발행일·핵심 논지·섹션 구조·구체 사실은 확인 불가이므로 지어내지 않음. 분류 예상: 데이터 엔지니어링 실무/문화 성격이면 `Articles/Engineering-Culture` 후보, 다만 데이터 엔지니어링 아티클이 누적되면 `Articles/Data-Engineering` 신설 후보도 검토 — 원문 확인 후 확정. 크로스링크 대상 확보: `Data-Engineering-Essential` 오버뷰 커리큘럼(/2026/06/25/data-engineering-essential-curriculum.html), 데이터 품질·거버넌스 오버뷰(_posts/Technology/Data-Engineering/2026-06-25-data-quality-governance.md), dbt-Essential 커리큘럼(/2026/07/12/dbt-essential-curriculum.html, dbt 테스트=데이터 품질 접점).
  - 메모: egress 정책 차단(`403 CONNECT policy denial`, host `pivotal.substack.com:443`, `connect_rejected` — CONNECT 단계에서 프록시가 403 반환, 요청이 Substack 서버에 도달하지 않음. 봇 차단/페이월이 아니라 세션 egress 정책 차단). 사용자가 원문 텍스트 전달 시 작성.

- [ ] **HTTP 429 (Too Many Requests) — velog @gusdudco6** — `[대기: 원문 전달 필요]`
  - URL: <https://velog.io/@gusdudco6/HTTP429>
  - 내용: velog.io(한국 개발자 블로그 플랫폼) @gusdudco6 님의 기술 글로, 제목상 HTTP 429(Too Many Requests) 상태 코드 / 레이트 리미팅을 다루는 것으로 추정(429가 무엇인지·언제 발생하는지·`Retry-After` 헤더·rate limiting·대응 방법 등). 원문에 접근하지 못해 저자 실명·발행일·핵심 논지·섹션 구조·코드 예시·구체 사실은 확인 불가이므로 지어내지 않음. 분류 예상: 웹/API·인프라 성격이면 `Articles/Systems-Programming`(성능 엔지니어링·분산 인프라) 후보 — 다만 순수 HTTP/웹 프로토콜 주제라 기존 sub-category와 완전히 맞지 않을 수 있으니 원문 확인 후 확정(맞는 곳이 없으면 `Web`/`Networking` 등 신설 후보 검토).
  - 메모: egress 정책 차단(`403 CONNECT policy denial`, host `velog.io:443`, `connect_rejected` — 프록시 `recentRelayFailures`에 "gateway answered 403 to CONNECT (policy denial or upstream failure)"로 기록됨. CONNECT 단계에서 프록시가 403 반환, 요청이 velog 서버에 도달하지 않음 → 봇 차단/페이월이 아니라 세션 egress 정책 차단). 사용자가 원문 텍스트 전달 시 작성.

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
