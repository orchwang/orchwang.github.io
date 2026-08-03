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

_대기 중인 시리즈 없음._ (2026-08-03: `Data-Engineering-Essential`에서 분리 예고된 심화 연재 6개 — Spark·Kafka·dbt·Airflow·Lakehouse·Stream-Processing(Flink) — 모두 **마스터 커리큘럼 + 전 단계 딥다이브 + 삽화 + 도장깨기 100% + 오버뷰 역방향 링크**까지 완주 확인 후 삭제. 마지막까지 남아 있던 Spark-Essential(7/7)·Stream-Processing-Essential(6/6)도 딥다이브·삽화 완료 검증됨. 조사·계획 기록은 [DATA-ENGINEERING-SERIES-PLAN.md](./DATA-ENGINEERING-SERIES-PLAN.md) 참고.)
