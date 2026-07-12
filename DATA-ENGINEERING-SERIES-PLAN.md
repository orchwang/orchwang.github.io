# Data Engineering — 심화 연재(별도 시리즈) 조사 결과

`Data-Engineering-Essential` 시리즈(커리큘럼 + 10단계 오버뷰, 완주 100%)는 데이터 엔지니어링
수명주기 전체의 **지도**를 그리는 것이 목적이었다. 커리큘럼 자체가 결론에서 밝혔듯,
수집·처리·오케스트레이션의 핵심 도구는 "역할 소개" 선에서 멈추고 **각각 별도의 `*-Essential`
시리즈로 분리해 깊이 다루기로** 예고되어 있다. 이 문서는 그 예고를 실제 연재 계획으로
구체화하기 위해, **어떤 주제가 별도 심화 시리즈로 분리될 가치가 있는지**를 조사한 결과다.

조사 근거는 두 가지다. (1) 오버뷰 시리즈 본문이 명시적으로 "향후 별도 시리즈" 훅을 남긴 지점,
(2) 2026년 데이터 엔지니어링 채용·기술 트렌드(핵심 스택의 수요 비중, lakehouse/table format의
사실상 표준화).

## 오버뷰 시리즈가 이미 남긴 "별도 시리즈" 훅

| 단계 | 도구 | 본문에 남긴 표시 |
| --- | --- | --- |
| 3단계 수집 | **Kafka** | "분산 로그·파티셔닝·컨슈머 그룹·스트림 처리까지 아우르는 깊은 주제 … 향후 별도 시리즈에서 깊이 다룰 예정" |
| 5단계 처리 | **Spark** | "구조·튜닝·API는 향후 별도 시리즈에서 깊이 다룰 예정" |
| 5단계 처리 | **dbt** | 커리큘럼에서 "*dbt* 별도 시리즈 후보"로 명시 |
| 6단계 오케스트레이션 | **Airflow** | "DAG 작성·오퍼레이터·XCom·스케줄러·배포·운영까지 향후 별도 시리즈에서 깊이 다룰 예정" |

즉 **Kafka·Spark·dbt·Airflow** 네 개는 시리즈 저자가 이미 분리를 약속한, 확정에 가까운 후보다.

## 2026 트렌드로 본 우선순위 근거

2026년 데이터 엔지니어링 실무의 "최소 실전 스택"은 반복적으로 다음으로 수렴한다 —
**Python(로직) · Spark(스케일) · dbt(변환 품질) · Airflow(오케스트레이션) · Kafka(실시간) +
플랫폼 1종(Snowflake/Databricks)**. 채용 공고 기준 도구 수요 비중도 이 네 개를 뒷받침한다.

- **Apache Spark** — 분산 처리 프레임워크 점유 약 38.7%. 여전히 대규모 처리의 사실상 표준.
- **Kafka** — 채용 공고 약 24%에 등장. 실시간 파이프라인의 관문.
- **Airflow** — 오케스트레이션의 지배적 선택(단, 신규 스택은 Dagster를 택하는 팀도 늘어나는 중).
- **dbt** — 애널리틱스 엔지니어링/이해관계자 접점에서 생산성 차이를 만드는 핵심.

여기에 오버뷰가 명시하지 않았지만 2026 트렌드가 강하게 밀어 올린 **추가 후보**가 있다.

- **Lakehouse / 오픈 테이블 포맷(Apache Iceberg)** — 2026년 오픈 테이블 포맷은 "선택"이 아니라
  사실상 표준이 되었고, Iceberg가 트랜잭션 워크로드의 de facto standard로 자리 잡았다
  (AWS·Google·Snowflake·Databricks·Dremio 등 광범위 채택, REST Catalog 중심의 거버넌스).
  4단계 저장에서 오버뷰만 한 Iceberg/Delta/Hudi를 하나의 심화 시리즈로 뽑을 근거가 충분하다.
- **스트림 처리(Flink)** — 5단계에서 이벤트 시간·워터마크·윈도잉을 개념 소개만 했다. 2026
  레이크하우스가 "실시간 hot tier"를 세 번째 요구로 끌어올리면서 스트림 처리 심화 수요가 커졌다.

## 권고: 3-티어 연재 로드맵

각 시리즈는 이 위키의 기존 `*-Essential` 관례(마스터 커리큘럼 1편 `banner: wartable` +
도장깨기 체크박스, 이어지는 단계별 딥다이브, 오름차순 `date` 시각으로 순서 보장)를 그대로 따른다.

### Tier 1 — 확정(오버뷰가 약속 + 최고 수요). 수요·기반 순으로 착수 권장.

1. **Spark-Essential** (처리) — 수요 1위·기반 기술.
   제안 단계: 아키텍처(Driver/Executor·클러스터) → RDD/DataFrame/Dataset → Catalyst·Tungsten
   실행 모델 → 셔플·파티셔닝·튜닝 → Spark Structured Streaming → PySpark 실무 → (심화) Iceberg/Delta 연동.
2. **Kafka-Essential** (수집/스트리밍) — 실시간의 관문.
   제안 단계: 분산 로그·토픽·파티션 → 프로듀서/컨슈머·컨슈머 그룹 → 전달 보장(at-least-once·
   exactly-once)·멱등 프로듀서 → Kafka Connect(CDC·Debezium) → Schema Registry → Kafka Streams.
3. **dbt-Essential** (변환/애널리틱스 엔지니어링).
   제안 단계: 모델·ref·소스 → 테스트·문서화 → 매크로·Jinja → incremental·snapshot(SCD) →
   패키지·CI → 세만틱 레이어·메트릭.
4. **Airflow-Essential** (오케스트레이션).
   제안 단계: DAG·오퍼레이터·태스크 → 스케줄러·Executor 내부 → XCom·TaskFlow API →
   센서·deferrable 오퍼레이터 → 백필·catchup·멱등 → 배포·운영(K8s Executor)·모니터링.

### Tier 2 — 강력 추천(2026 트렌드가 밀어 올린 후보).

5. **Lakehouse-Essential** (또는 `Iceberg-Essential`) — 저장 심화.
   제안 단계: 오픈 테이블 포맷의 문제의식 → Iceberg 메타데이터/매니페스트 구조 → ACID·스냅샷·
   시간여행 → 파티션 진화·스키마 진화 → compaction·유지보수 → REST Catalog·거버넌스 →
   Iceberg vs Delta vs Hudi vs Paimon 비교.
6. **Stream-Processing-Essential** (Flink 중심) — 스트림 심화.
   제안 단계: 스트림 처리 모델 → 이벤트 시간·워터마크 심화 → 상태(state)·체크포인트 →
   exactly-once·정확성 → 윈도잉·조인·CEP → Flink SQL. *(Kafka-Essential과 주제가 인접하므로,
   Kafka 시리즈의 Kafka Streams 편과 중복을 조율할 것.)*

### Tier 3 — 여력이 될 때(인접·보조 주제).

7. **Data-Observability / 데이터 품질 심화** — 9단계(Great Expectations·데이터 계약·리니지·
   카탈로그·이상 탐지)를 별도 시리즈로. 단독 시리즈로 묶기엔 도구 파편화가 있어 우선순위는 낮음.
8. **플랫폼 심화(Snowflake / Databricks)** — 채용 수요는 높으나(각 29.2%·16.8%) 벤더 종속적이라,
   이 위키의 도구 중립 지향과는 결이 다름. 필요 시 개별 딥다이브 포스트로 충분할 수 있음.

## 착수 순서 제안

**Spark → Kafka → dbt → Airflow**(Tier 1, 수요·기반 순) 후 **Lakehouse(Iceberg) → Flink**(Tier 2).
Tier 1 넷은 오버뷰가 이미 약속했으므로 신뢰를 지키는 차원에서도 먼저 채우는 것이 좋다.
각 시리즈 착수 시 오버뷰 시리즈의 해당 단계 포스트에서 "→ 향후 별도 시리즈" 문구를 실제 링크로
교체하고, 커리큘럼 "다음 학습" 섹션도 갱신한다.

## 참고 출처

- Data Engineering Roadmap 2026 (핵심 스택·도구 수요 비중): datavidhya.com, montecarlo.ai, refontelearning.com
- Apache Iceberg / Lakehouse 2026 채택 현황: datalakehousehub.com, snowflake.com, dev.to(Alex Merced)
