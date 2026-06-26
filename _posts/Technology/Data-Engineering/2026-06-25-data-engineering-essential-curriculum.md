---
layout: post
title: "Data Engineering Essential Curriculum"
date: 2026-06-25
categories: [Technology, Data-Engineering]
series: Data-Engineering-Essential
tags: [data-engineering, data-pipeline, curriculum]
published: true
banner: wartable
image: /assets/images/data-engineering/data-engineering-curriculum-og.jpg
excerpt: "데이터 엔지니어링의 정의와 역사부터 수집·저장·처리·오케스트레이션 기술 오버뷰, 사례별 파이프라인 설계, 품질·거버넌스·DataOps까지 10단계로 정복하는 종합 학습 로드맵입니다. 도장깨기 방식으로 진행 상황을 추적합니다."
---

<figure class="post-figure post-figure--header">
<picture>
  <source type="image/webp" srcset="/assets/images/data-engineering/data-engineering-curriculum-640.webp 640w, /assets/images/data-engineering/data-engineering-curriculum-1024.webp 1024w, /assets/images/data-engineering/data-engineering-curriculum-1536.webp 1536w" sizes="(max-width: 800px) 100vw, 760px">
  <img src="/assets/images/data-engineering/data-engineering-curriculum.jpg" alt="데이터 엔지니어링 에센셜 커리큘럼 전체를 한 장으로 정리한 인포그래픽 — 상단 제목과 데이터 파이프라인(Raw Data→Processing→Curated Data, 클라우드·Airflow), 기초·핵심·응용·심화 10단계 로드맵 타임라인, 핵심 포인트 5가지, 그리고 '10단계 완주 100%' 트로피" width="1536" height="1024" loading="lazy" decoding="async">
</picture>
<figcaption>이 커리큘럼을 한 장으로 — 기초·핵심·응용·심화 10단계 로드맵, 데이터 파이프라인 흐름, 핵심 포인트, 그리고 완주 100% 🎉</figcaption>
</figure>

## 소개

데이터 엔지니어링(Data Engineering)은 흩어진 원천 데이터를 신뢰할 수 있고, 쓸 수 있고, 분석·머신러닝에 바로 투입할 수 있는 형태로 바꾸어 내는 분야입니다. 분석가가 대시보드를 그리고 사이언티스트가 모델을 학습시키기 **이전에**, 데이터를 모으고(수집) 안전하게 쌓고(저장) 의미 있는 형태로 다듬어(변환) 적시에 흘려보내는(서빙) 일이 먼저 일어나야 합니다. 그 토대를 책임지는 사람이 데이터 엔지니어이고, 그 토대를 움직이는 자동화된 흐름이 데이터 파이프라인(Data Pipeline)입니다.

이 글은 `Data-Engineering-Essential` 시리즈의 **마스터 로드맵**입니다. **데이터 엔지니어링이란 무엇이며 어떻게 진화해 왔는가**(기초)에서 출발해, **수집·저장·처리·오케스트레이션**이라는 핵심 기술을 오버뷰하고(핵심), **아키텍처 패턴과 실제 사례별 파이프라인 설계**(응용)를 거쳐, **데이터 품질·거버넌스·DataOps**(심화)로 마무리하는 10단계로 구성했습니다. 각 항목을 정복할 때마다 상세 포스트를 작성하고 체크박스를 채우는 **도장깨기** 방식으로 진행 상황을 추적합니다.

핵심 단계(수집·저장·처리·오케스트레이션)는 각각 하나의 큰 세계입니다. 이 로드맵에서는 "전체 그림 안에서 어떤 역할을 하는가"를 중심으로 **오버뷰**하고, Kafka·Spark·dbt·Airflow처럼 깊이 파고들 가치가 있는 기술은 이후 **별도 시리즈**로 분리해 다룰 예정입니다.

## 학습 흐름

10단계는 아래 순서대로 진행하는 것을 권장합니다. **기초**(정의·역사)로 분야의 지도를 그리고, **핵심**(수집→저장→처리→오케스트레이션)으로 데이터 엔지니어링 수명주기를 따라가며 기술을 익힌 뒤, **응용**(아키텍처·사례)으로 설계 안목을 키우고, **심화**(품질·거버넌스·운영)로 신뢰할 수 있는 데이터 시스템을 완성하는 흐름입니다.

```mermaid
flowchart TD
    Start([학습 시작]) --> S1

    subgraph FOUNDATION["기초 · 분야의 지도 그리기"]
        S1["1단계<br/>데이터 엔지니어링이란<br/>정의·역할·수명주기"]
        S2["2단계<br/>파이프라인의 역사·진화<br/>ETL→ELT, DW→Lakehouse"]
    end

    subgraph CORE["핵심 · 수명주기를 따라가는 기술 오버뷰"]
        S3["3단계<br/>수집 Ingestion"]
        S4["4단계<br/>저장 Storage"]
        S5["5단계<br/>변환·처리 Processing"]
        S6["6단계<br/>오케스트레이션 Orchestration"]
    end

    subgraph APPLY["응용 · 설계 안목 키우기"]
        S7["7단계<br/>아키텍처 패턴<br/>Lambda·Kappa·Medallion"]
        S8["8단계<br/>사례별 파이프라인 설계"]
    end

    subgraph DEEPEN["심화 · 신뢰할 수 있는 시스템"]
        S9["9단계<br/>품질·거버넌스·관측가능성"]
        S10["10단계<br/>DataOps·운영·신뢰성"]
    end

    S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> S7 --> S8 --> S9 --> S10
    S10 --> Done([시리즈 완주 🎉])
```

## 학습 진행 현황

> 완료한 항목에는 상세 포스트 링크가 연결됩니다. 학습이 진행될 때마다 체크박스와 진행률을 갱신합니다.

- 현재 완료한 항목: **35개**
- 전체 항목: **35개**
- 진행률: **100%** 🎉

## 1단계: 데이터 엔지니어링이란 — 정의·역할·수명주기

데이터 엔지니어링이 무엇이고, 데이터 엔지니어가 분석가·사이언티스트와 어떻게 다른지, 그리고 모든 데이터 작업을 꿰뚫는 **데이터 엔지니어링 수명주기(Data Engineering Lifecycle)**를 익히는 단계입니다. 이후 모든 기술은 이 수명주기의 어느 칸에 들어가는지로 정리됩니다. 자세한 내용은 [데이터 엔지니어링이란: 수명주기와 데이터 엔지니어의 역할](/2026/06/25/what-is-data-engineering.html) 포스트에서 다룹니다.

- [x] **정의와 역할**: 데이터 엔지니어 vs 데이터 분석가 vs 데이터 사이언티스트, 데이터 엔지니어가 책임지는 범위 — [[상세](/2026/06/25/what-is-data-engineering.html)]
- [x] **데이터 성숙도(Data Maturity)**: 조직의 데이터 성숙도 단계와 그에 따라 달라지는 데이터 엔지니어의 일 — [[상세](/2026/06/25/what-is-data-engineering.html)]
- [x] **데이터 엔지니어링 수명주기**: 생성(Generation)→수집(Ingestion)→저장(Storage)→변환(Transformation)→서빙(Serving) — [[상세](/2026/06/25/what-is-data-engineering.html)]
- [x] **저류(Undercurrents)**: 보안·데이터 관리·DataOps·데이터 아키텍처·오케스트레이션·소프트웨어 엔지니어링 — [[상세](/2026/06/25/what-is-data-engineering.html)]

## 2단계: 데이터 파이프라인의 역사와 진화

오늘날의 데이터 스택은 갑자기 등장하지 않았습니다. 메인프레임 배치 처리에서 데이터 웨어하우스, Hadoop, 그리고 클라우드 기반 Modern Data Stack까지 — 각 시대가 풀려던 문제와 한계를 알면 현재의 도구 선택이 비로소 이해됩니다. 자세한 내용은 [데이터 파이프라인의 역사와 진화: ETL에서 Lakehouse까지](/2026/06/25/data-pipeline-history-and-evolution.html) 포스트에서 다룹니다.

- [x] **ETL에서 ELT로**: 변환을 어디서 하는가의 변화와 그 배경(스토리지·컴퓨팅 비용의 역전) — [[상세](/2026/06/25/data-pipeline-history-and-evolution.html)]
- [x] **DW → Data Lake → Lakehouse**: 정형 중심 웨어하우스에서 원본 보존 레이크, 그리고 둘을 통합한 레이크하우스로 — [[상세](/2026/06/25/data-pipeline-history-and-evolution.html)]
- [x] **배치에서 스트리밍으로**: Hadoop/MapReduce 시대에서 Spark, 그리고 실시간 처리와 Modern Data Stack의 부상 — [[상세](/2026/06/25/data-pipeline-history-and-evolution.html)]

## 3단계: 데이터 수집 (Ingestion)

데이터 엔지니어링의 출발점. 원천 시스템(DB·API·로그·이벤트)에서 데이터를 어떻게 안정적으로 가져오는지를 다룹니다. 배치와 스트리밍, 그리고 변경 데이터 캡처(CDC)가 핵심 주제입니다. 자세한 내용은 [데이터 수집(Ingestion): 배치·스트리밍·CDC와 수집 도구](/2026/06/25/data-ingestion.html) 포스트에서 다룹니다.

- [x] **배치 vs 스트리밍 수집**: 처리 주기·지연(latency)·복잡도의 트레이드오프 — [[상세](/2026/06/25/data-ingestion.html)]
- [x] **변경 데이터 캡처(CDC)**: 원천 DB의 변경을 로그 기반으로 추적해 동기화하기 — [[상세](/2026/06/25/data-ingestion.html)]
- [x] **메시징·스트리밍 플랫폼**: Kafka·Kinesis·Pub/Sub의 역할 (→ 향후 *Kafka* 별도 시리즈 후보) — [[상세](/2026/06/25/data-ingestion.html)]
- [x] **수집 도구·커넥터**: Airbyte·Fivetran 같은 EL 도구와 직접 구현의 경계 — [[상세](/2026/06/25/data-ingestion.html)]

## 4단계: 데이터 저장 (Storage)

수집한 데이터를 어디에, 어떤 형태로 쌓을 것인가. 데이터 웨어하우스·레이크·레이크하우스의 차이와, 그 밑을 받치는 파일 포맷·테이블 포맷을 익힙니다. 자세한 내용은 [데이터 저장(Storage): 웨어하우스·레이크·레이크하우스와 파일·테이블 포맷](/2026/06/25/data-storage.html) 포스트에서 다룹니다.

- [x] **OLTP vs OLAP**: 트랜잭션 처리와 분석 처리의 근본적 차이, 행 지향 vs 열 지향(Columnar) — [[상세](/2026/06/25/data-storage.html)]
- [x] **DW · Data Lake · Lakehouse**: Snowflake/BigQuery/Redshift, 오브젝트 스토리지, 그리고 통합 모델 — [[상세](/2026/06/25/data-storage.html)]
- [x] **파일 포맷**: Parquet·ORC·Avro — 열 지향 압축과 스키마 진화 — [[상세](/2026/06/25/data-storage.html)]
- [x] **테이블 포맷**: Apache Iceberg·Delta Lake·Hudi — 레이크 위에 ACID와 시간여행(time travel) 얹기 — [[상세](/2026/06/25/data-storage.html)]

## 5단계: 데이터 변환·처리 (Transformation / Processing)

원본을 의미 있는 데이터로 바꾸는 단계. 분산 처리의 기본 모델부터 배치(Spark)·스트림(Flink) 엔진, 그리고 SQL 기반 변환(dbt)까지 오버뷰합니다. 자세한 내용은 [데이터 변환·처리(Processing): 배치·스트림 엔진과 SQL 변환](/2026/06/25/data-processing.html) 포스트에서 다룹니다.

- [x] **분산 처리 모델**: MapReduce에서 Spark로 — 왜 인메모리 처리가 판도를 바꿨는가 — [[상세](/2026/06/25/data-processing.html)]
- [x] **배치 처리 엔진**: Apache Spark의 구조와 활용 (→ 향후 *Spark* 별도 시리즈 후보) — [[상세](/2026/06/25/data-processing.html)]
- [x] **스트림 처리**: Flink·Kafka Streams, 이벤트 시간 vs 처리 시간, 윈도잉 — [[상세](/2026/06/25/data-processing.html)]
- [x] **SQL 변환과 ELT**: dbt로 모델링·테스트·문서화하기 (→ 향후 *dbt* 별도 시리즈 후보) — [[상세](/2026/06/25/data-processing.html)]

## 6단계: 오케스트레이션 (Orchestration)

수많은 수집·변환 작업을 **언제·어떤 순서로·어떤 의존성으로** 실행할지 조율하는 두뇌. Airflow를 비롯한 오케스트레이터의 개념과, 견고한 파이프라인을 위한 멱등성·백필을 다룹니다. 자세한 내용은 [오케스트레이션(Orchestration): DAG·스케줄링과 견고한 파이프라인](/2026/06/25/orchestration.html) 포스트에서 다룹니다.

- [x] **DAG와 스케줄링**: 작업을 방향성 비순환 그래프로 모델링하고 의존성에 따라 실행하기 — [[상세](/2026/06/25/orchestration.html)]
- [x] **오케스트레이터 비교**: Airflow·Dagster·Prefect의 철학 차이 (→ 향후 *Airflow* 별도 시리즈 후보) — [[상세](/2026/06/25/orchestration.html)]
- [x] **견고한 파이프라인**: 멱등성(Idempotency)·재시도·백필(Backfill)·체크포인트 — [[상세](/2026/06/25/orchestration.html)]

## 7단계: 아키텍처 패턴

개별 기술을 넘어, 그것들을 어떻게 **하나의 시스템으로 조립**하는가. 배치와 스트리밍을 결합하는 고전 패턴부터 레이크하우스 계층화, 조직 차원의 Data Mesh까지 살펴봅니다. 자세한 내용은 [데이터 아키텍처 패턴: Lambda·Kappa·Medallion·Data Mesh](/2026/06/25/architecture-patterns.html) 포스트에서 다룹니다.

- [x] **Lambda vs Kappa**: 배치+스트림 이중 경로 vs 스트림 단일 경로의 트레이드오프 — [[상세](/2026/06/25/architecture-patterns.html)]
- [x] **Medallion 아키텍처**: Bronze→Silver→Gold 계층으로 데이터 품질을 단계적으로 끌어올리기 — [[상세](/2026/06/25/architecture-patterns.html)]
- [x] **Modern Data Stack & Data Mesh**: 클라우드 모듈형 스택과, 도메인 중심 분산 데이터 오너십 — [[상세](/2026/06/25/architecture-patterns.html)]

## 8단계: 사례별 파이프라인 설계

지금까지의 기술과 패턴을 실제 문제에 적용하는 단계. 대표적인 도메인별로 요구사항(지연·정확성·규모)을 분석하고 파이프라인을 설계해 봅니다. 자세한 내용은 [사례별 파이프라인 설계: 실시간 분석·이벤트·ML 피처·CDC](/2026/06/25/pipeline-case-studies.html) 포스트에서 다룹니다.

- [x] **실시간 분석 파이프라인**: 이벤트 수집→스트림 처리→실시간 대시보드 — [[상세](/2026/06/25/pipeline-case-studies.html)]
- [x] **로그·이벤트 파이프라인**: 애플리케이션/서버 로그의 수집·정제·집계 — [[상세](/2026/06/25/pipeline-case-studies.html)]
- [x] **ML 피처 파이프라인**: 학습/서빙용 피처 생성과 피처 스토어(Feature Store) — [[상세](/2026/06/25/pipeline-case-studies.html)]
- [x] **CDC 기반 복제 & 배치 리포팅**: 운영 DB → 분석 DW 동기화와 정기 리포트 배치 — [[상세](/2026/06/25/pipeline-case-studies.html)]

## 9단계: 데이터 품질·거버넌스·관측가능성

파이프라인이 "돌아간다"와 "믿을 수 있다"는 다릅니다. 잘못된 데이터를 조기에 잡아내고, 데이터의 출처와 흐름을 추적하며, 조직 차원에서 데이터를 관리하는 방법을 다룹니다. 자세한 내용은 [데이터 품질·거버넌스·관측가능성: 믿을 수 있는 데이터 만들기](/2026/06/25/data-quality-governance.html) 포스트에서 다룹니다.

- [x] **데이터 품질·테스트**: 검증 규칙과 Great Expectations 같은 도구, 데이터 계약(Data Contracts) — [[상세](/2026/06/25/data-quality-governance.html)]
- [x] **데이터 리니지·카탈로그**: 데이터의 출처·흐름 추적과 메타데이터 관리 — [[상세](/2026/06/25/data-quality-governance.html)]
- [x] **데이터 관측가능성(Observability)**: 신선도·볼륨·스키마·분포 모니터링과 이상 탐지 — [[상세](/2026/06/25/data-quality-governance.html)]

## 10단계: DataOps·운영·신뢰성

마지막 단계는 데이터 시스템을 **소프트웨어처럼** 운영하는 기술입니다. CI/CD·테스트·모니터링으로 변경을 안전하게 배포하고, 비용과 보안·프라이버시를 함께 관리하며 신뢰성을 지킵니다. 자세한 내용은 [DataOps·운영·신뢰성: 데이터 시스템을 소프트웨어처럼 운영하기](/2026/06/25/dataops-operations.html) 포스트에서 다룹니다.

- [x] **DataOps와 CI/CD**: 데이터 파이프라인에 대한 버전 관리·테스트·자동 배포 — [[상세](/2026/06/25/dataops-operations.html)]
- [x] **모니터링·신뢰성**: SLA/SLO, 경보, 장애 대응과 비용 최적화(FinOps) — [[상세](/2026/06/25/dataops-operations.html)]
- [x] **보안·프라이버시**: 접근 제어, 데이터 마스킹/익명화, 규정 준수(GDPR 등) — [[상세](/2026/06/25/dataops-operations.html)]

## 핵심 포인트

- **수명주기로 사고하라**: 모든 도구와 기법은 결국 생성→수집→저장→변환→서빙 중 어딘가에 속합니다. 새 기술을 만나면 "수명주기의 어느 칸을 푸는가"부터 물어보면 길을 잃지 않습니다.
- **도구가 아니라 문제가 먼저다**: Kafka·Spark·Airflow는 수단입니다. 지연 요구사항·데이터 규모·정확성 보장 수준 같은 **요구사항**이 도구를 선택하게 해야 합니다.
- **배치와 스트리밍의 트레이드오프를 이해하라**: 실시간이 항상 옳은 것은 아닙니다. 신선도 요구와 운영 복잡도·비용 사이의 균형이 아키텍처를 가릅니다.
- **데이터 품질은 기능이 아니라 토대다**: 아무리 빠른 파이프라인도 틀린 데이터를 흘리면 가치가 음수입니다. 품질·거버넌스·관측가능성은 처음부터 설계에 포함하세요.
- **데이터 시스템도 소프트웨어다**: 버전 관리·테스트·CI/CD·모니터링이라는 소프트웨어 엔지니어링 원칙이 데이터 파이프라인에도 그대로 적용됩니다(DataOps).

## 추천 학습 순서

위 단계 번호 순서대로 진행하는 것을 권합니다. 그 이유는 다음과 같습니다.

1. **기초(1~2단계)** — 먼저 데이터 엔지니어링의 정의와 수명주기로 분야 전체의 지도를 그리고, 역사·진화를 통해 "왜 지금의 스택이 이렇게 생겼는지"를 이해합니다. 지도와 맥락 없이 개별 도구부터 배우면 파편적인 지식에 그칩니다.
2. **핵심(3~6단계)** — 수집→저장→처리→오케스트레이션이라는 수명주기의 흐름을 그대로 따라가며 각 칸의 대표 기술을 오버뷰합니다. 데이터가 흘러가는 순서대로 익히면 전체 그림이 자연스럽게 연결됩니다.
3. **응용(7~8단계)** — 개별 기술을 하나의 시스템으로 조립하는 아키텍처 패턴을 배우고, 실제 도메인 사례에 적용해 설계 근육을 키웁니다.
4. **심화(9~10단계)** — "돌아가는 파이프라인"을 "믿을 수 있고 운영 가능한 시스템"으로 끌어올리는 품질·거버넌스·DataOps로 마무리합니다.

각 단계는 앞 단계의 토대 위에 쌓이므로, 건너뛰기보다 순서대로 정복하며 체크박스를 채워 나가길 권합니다.

## 추천 도서

이 커리큘럼의 뼈대가 된 책들입니다.

- **Fundamentals of Data Engineering** (Joe Reis & Matt Housley) — 이 로드맵의 중심 프레임워크인 **데이터 엔지니어링 수명주기**와 저류(Undercurrents) 개념의 출처. 분야 전체를 도구 중립적으로 조망합니다.
- **Designing Data-Intensive Applications** (Martin Kleppmann) — 저장·복제·파티셔닝·일관성·스트림 처리의 **이론적 토대**. (이 위키 [Architecture-Essential 시리즈](/2026/06/19/designing-data-intensive-applications.html)에서도 다룹니다.)
- **The Data Warehouse Toolkit** (Ralph Kimball) — 차원 모델링(Dimensional Modeling)의 고전, 분석용 데이터 모델 설계의 정석.

## 결론

데이터 엔지니어링은 "데이터를 옮기는 일"이 아니라, **신뢰할 수 있는 데이터 흐름을 설계하고 운영하는 엔지니어링**입니다. 개별 도구는 빠르게 바뀌지만, 수명주기라는 사고의 틀과 요구사항에서 출발하는 설계 원칙은 오래 갑니다. 이 10단계를 순서대로 정복하면, 새로운 도구가 등장해도 그것을 전체 그림 안에 정확히 배치하고 평가할 수 있는 안목을 갖추게 됩니다.

이 시리즈는 10단계를 모두 채워 **완주(100%)**했습니다 🎉. 이제 전체 지도를 손에 넣었으니, 다음은 핵심 도구를 하나씩 깊이 파고들 차례입니다. 수집의 **Kafka**, 처리의 **Spark**·**dbt**, 오케스트레이션의 **Airflow**는 각각 별도의 `*-Essential` 시리즈로 분리해 다룰 예정입니다.

### 다음 학습 (Next Learning)

- [데이터 엔지니어링이란: 수명주기와 데이터 엔지니어의 역할](/2026/06/25/what-is-data-engineering.html) — 1단계부터 다시 훑어보며 전체 지도 복습
- [Designing Data-Intensive Applications](/2026/06/19/designing-data-intensive-applications.html) — 데이터 시스템의 이론적 토대 (Architecture-Essential)
- [PostgreSQL Essential Curriculum](/2025/10/28/postgresql-essential-curriculum.html) — 데이터 저장의 핵심, 관계형 데이터베이스 깊이 파기
