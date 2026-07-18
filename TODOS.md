# TODOS — 위키 컨텐츠 작업 목록

이 문서는 Orc Hwang's Wiki에 등록할 **모든 컨텐츠(아티클 포스트, 시리즈, 기타)** 의 작업 대기 목록이다.

## 운영 규칙

- **완료된 항목은 삭제한다.** (체크만 남기지 않고 목록에서 제거 — 이 문서에는 "아직 안 된 일"만 남는다.)
- **아티클 포스트**는 `article-manager` 서브에이전트가 원문을 가져와 작성한다.
- **에이전트가 원문에 직접 접근하지 못하는 경우**(이 세션의 egress 정책이 해당 호스트를 차단 → `403 CONNECT policy denial`)에는, 제목·URL만으로 지어내지 않고 **여기 남겨 둔다.** 사용자가 잊지 않고 **원문 텍스트를 직접 전달**하면 그때 작성한다. (지난 사례: `arxiv.org`, `thenextweb.com`, `transformer-circuits.pub`, `multigres.com` 등이 차단됨.)
- 항목 상태 표기: `[대기: 원문 전달 필요]` = 접근 차단, 사용자 원문 대기 · `[작성 가능]` = 접근 가능하거나 원문 확보 · `[진행 중]` = 작성/삽화 중.

---

## 아티클 포스트 (Articles)

_대기 중인 아티클 없음._ (2026-07-18: 이전에 egress 차단으로 파킹돼 있던 7건 — Mitchell Hashimoto 인터뷰, Good Tools are Invisible, AI 2040: Plan A, Martin Fowler fragment(7/13), On Data Quality(1), HTTP429(실제 주제: 확장성/성능), make out like bandits — 은 차단이 풀려 모두 작성 완료 후 삭제.)

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
