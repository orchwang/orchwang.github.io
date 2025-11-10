---
layout: post
title: "Django 와 Celery 를 이용한 대규모 작업 분산처리"
date: 2025-11-10
categories: [Technology, Python]
tags: [python, celery, amqp]
published: true
excerpt: "Django와 Celery를 활용하여 대규모 작업을 효율적으로 분산 처리하는 방법과 AMQP 메시지 브로커를 통한 비동기 작업 관리 기법을 다룹니다."
---

<div class="post-summary-box" markdown="1">

### 📋 이 글에서 다루는 내용

- **Celery 기본 개념**: 분산 작업 큐 시스템의 아키텍처와 구성 요소
- **도입 시점 결정**: 언제 Celery + AMQP를 사용해야 하는지 판단하는 8가지 체크리스트
- **Django 프로젝트 설정**: Redis/RabbitMQ 브로커 설정과 Celery 앱 구성
- **작업 분산 패턴**: Chunking, Chain, Chord, 우선순위 큐 활용법
- **실전 예제**: 100만 명에게 푸시 알림을 발송하는 대규모 시스템 구현
- **프로덕션 배포**: Supervisor, 모니터링, 로깅, 보안 설정
- **성능 최적화**: Database 최적화, 메모리 관리, Rate Limiting

**예상 소요 시간:** 30-40분 | **난이도:** 중급 | **실습 포함:** 예

</div>

## Introduction

웹 애플리케이션을 개발하다 보면 시간이 오래 걸리는 작업들을 처리해야 하는 경우가 있습니다. 예를 들어, 대용량 파일 처리, 이메일 발송, 데이터 분석, 리포트 생성 등의 작업은 사용자의 요청에 대한 응답 시간을 지연시킬 수 있습니다.

Celery는 Python 기반의 분산 작업 큐 시스템으로, Django와 함께 사용하여 이러한 무거운 작업을 백그라운드에서 비동기적으로 처리할 수 있게 해줍니다. 이 글에서는 Django와 Celery를 이용한 대규모 작업 분산처리 방법을 살펴보겠습니다.

## Celery 란?

Celery는 분산 메시지 전달을 기반으로 동작하는 비동기 작업 큐입니다. 주요 특징은 다음과 같습니다:

- **비동기 처리**: 시간이 오래 걸리는 작업을 백그라운드에서 처리
- **분산 처리**: 여러 워커(worker)를 통해 작업을 분산 실행
- **스케줄링**: 주기적인 작업(cron-like) 실행 지원
- **재시도 및 에러 처리**: 실패한 작업에 대한 재시도 메커니즘
- **모니터링**: Flower 등을 통한 실시간 작업 모니터링

### Celery 아키텍처

```mermaid
graph LR
    A[Django App<br/>Producer] -->|1. Task 전송| B[Message Broker<br/>RabbitMQ/Redis]
    B -->|2. Task 전달| C[Worker<br/>Process]
    C -->|3. 작업 처리| D[Task Execution]
    D -->|4. 결과 저장| E[Result Backend<br/>Optional]
    E -.->|5. 결과 조회| A

    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#e8f5e9
    style D fill:#f3e5f5
    style E fill:#fce4ec
```

**주요 구성 요소:**

- **Producer**: 작업을 생성하고 메시지 브로커로 전송 (Django 앱)
- **Message Broker**: 작업 메시지를 큐에 저장 (RabbitMQ, Redis 등)
- **Worker**: 큐에서 작업을 가져와 실행
- **Result Backend**: 작업 결과를 저장 (선택적)

## Celery + AMQP 도입을 고려해야 하는 시점

Celery와 AMQP (RabbitMQ) 조합은 강력하지만, 모든 프로젝트에 필요한 것은 아닙니다. 다음 상황에서 도입을 고려해야 합니다.

### 도입해야 하는 경우

**1. 사용자 요청 응답 시간이 중요한 경우**

```python
# 문제 상황: 동기 처리로 인한 느린 응답
def send_welcome_email(request):
    user = request.user
    # 이메일 발송에 3-5초 소요
    send_mail(
        'Welcome!',
        'Thank you for signing up.',
        'from@example.com',
        [user.email],
    )
    return JsonResponse({'status': 'ok'})  # 사용자는 5초 대기

# 해결: Celery로 비동기 처리
@shared_task
def send_welcome_email_task(user_id):
    user = User.objects.get(id=user_id)
    send_mail(...)

def send_welcome_email(request):
    send_welcome_email_task.delay(request.user.id)
    return JsonResponse({'status': 'ok'})  # 즉시 응답 (< 100ms)
```

**적용 기준:**

- HTTP 요청 처리 시간이 500ms를 초과하는 경우
- 사용자가 즉각적인 피드백을 기대하는 작업
- 타임아웃으로 인한 요청 실패가 발생하는 경우

**2. 대량의 작업을 병렬로 처리해야 하는 경우**

```python
# 시나리오: 1만 개의 이미지 리사이징
images = Image.objects.filter(status='pending')  # 10,000개

# 동기 처리: 10,000 × 2초 = 약 5.5시간
for image in images:
    resize_image(image)

# Celery 병렬 처리: 20 워커 사용 시 약 16분
for image in images:
    resize_image_task.delay(image.id)
```

**적용 기준:**

- 동일한 작업을 수천~수만 번 반복해야 하는 경우
- 작업 간 의존성이 없어 병렬 처리가 가능한 경우
- 처리 시간을 단축해야 하는 비즈니스 요구사항이 있는 경우

**3. 외부 API 호출이 빈번한 경우**

```python
# 문제: 외부 API 호출로 인한 블로킹
def process_payment(request):
    # 결제 게이트웨이 API 호출 (2-3초)
    payment_result = stripe.charge.create(...)

    # SMS 발송 API 호출 (1-2초)
    send_sms(user.phone, "Payment confirmed")

    # 회계 시스템 API 호출 (1-2초)
    accounting_system.record_transaction(...)

    return response  # 총 4-7초 소요

# 해결: API 호출을 비동기로 처리
@shared_task
def process_payment_async(payment_id):
    payment_result = stripe.charge.create(...)
    send_sms_task.delay(...)
    record_transaction_task.delay(...)
```

**적용 기준:**

- 외부 API 응답 시간이 1초 이상인 경우
- API 타임아웃이나 장애가 사용자 경험에 영향을 주는 경우
- Rate limit으로 인해 요청 속도 조절이 필요한 경우

**4. 주기적으로 실행해야 하는 작업이 있는 경우**

```python
# Celery Beat으로 스케줄링
CELERY_BEAT_SCHEDULE = {
    'cleanup-old-sessions': {
        'task': 'myapp.tasks.cleanup_old_sessions',
        'schedule': crontab(hour=3, minute=0),  # 매일 새벽 3시
    },
    'send-daily-report': {
        'task': 'myapp.tasks.send_daily_report',
        'schedule': crontab(hour=9, minute=0, day_of_week='1-5'),  # 평일 9시
    },
    'update-cache': {
        'task': 'myapp.tasks.update_cache',
        'schedule': 300.0,  # 5분마다
    },
}
```

**적용 기준:**

- cron 작업을 Python 코드로 관리하고 싶은 경우
- 작업 실행 이력과 결과를 추적해야 하는 경우
- 작업 실패 시 재시도나 알림이 필요한 경우

**5. 메시지 유실을 방지해야 하는 중요한 작업**

AMQP (RabbitMQ)는 메시지 영속성과 안정성이 뛰어나므로 중요한 작업에 적합합니다.

```python
# RabbitMQ 설정: 메시지 영속성 보장
CELERY_BROKER_URL = 'amqp://localhost'
CELERY_TASK_ACKS_LATE = True  # 작업 완료 후 ACK
CELERY_TASK_REJECT_ON_WORKER_LOST = True  # 워커 장애 시 재실행

@shared_task(bind=True, max_retries=5)
def process_payment(self, payment_id):
    try:
        # 중요한 결제 처리
        payment = Payment.objects.get(id=payment_id)
        result = gateway.process(payment)
        payment.status = 'completed'
        payment.save()
    except Exception as exc:
        # 재시도
        raise self.retry(exc=exc, countdown=60)
```

**적용 기준:**

- 금융 거래, 주문 처리 등 데이터 무결성이 중요한 경우
- 작업 유실이 비즈니스에 심각한 영향을 미치는 경우
- 워커 장애 시에도 작업이 재실행되어야 하는 경우

**6. 우선순위가 다른 작업들을 처리해야 하는 경우**

```python
# 우선순위별 큐 분리
CELERY_TASK_ROUTES = {
    'myapp.tasks.send_urgent_alert': {'queue': 'critical'},
    'myapp.tasks.process_order': {'queue': 'high'},
    'myapp.tasks.generate_report': {'queue': 'normal'},
    'myapp.tasks.cleanup_data': {'queue': 'low'},
}

# 워커를 우선순위별로 실행
# Critical: 즉시 처리 (concurrency=5)
celery -A myproject worker -Q critical --concurrency=5

# High: 빠른 처리 (concurrency=10)
celery -A myproject worker -Q high --concurrency=10

# Normal/Low: 여유 있을 때 처리 (concurrency=3)
celery -A myproject worker -Q normal,low --concurrency=3
```

**적용 기준:**

- 긴급한 작업(알림)과 일반 작업(리포트)을 구분해야 하는 경우
- 중요도에 따라 리소스를 차등 배분해야 하는 경우
- 특정 작업이 다른 작업을 블로킹하지 않아야 하는 경우

### 도입하지 않아도 되는 경우

**1. 작업이 간단하고 빠른 경우**

- 모든 작업이 100ms 이내에 완료되는 경우
- 동기 처리로도 충분한 성능을 보이는 경우

**2. 트래픽이 매우 낮은 경우**

- 일일 사용자가 수십 명 이하인 내부 도구
- MVP 단계의 프로토타입 개발

**3. 인프라 관리 부담이 큰 경우**

- 소규모 팀에서 추가 서버 관리가 어려운 경우
- 클라우드 비용을 최소화해야 하는 경우
- 대안: Django-Q (단순한 작업 큐), Huey (경량 작업 큐)

**4. 실시간 결과가 필요한 경우**

- 사용자가 작업 결과를 즉시 확인해야 하는 경우
- 작업 완료 전까지 다음 단계로 진행할 수 없는 경우
- 대안: WebSocket, Server-Sent Events로 실시간 업데이트

### Redis vs RabbitMQ 선택 기준

**Redis를 선택해야 하는 경우:**

- 간단한 작업 큐가 필요한 경우
- 높은 처리 속도가 중요한 경우
- 작업 유실이 치명적이지 않은 경우
- Redis를 이미 캐시로 사용하고 있는 경우

```python
# Redis 설정: 간단하고 빠름
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/1'
```

**RabbitMQ (AMQP)를 선택해야 하는 경우:**

- 메시지 영속성이 중요한 경우 (결제, 주문 등)
- 복잡한 라우팅이 필요한 경우
- 높은 안정성과 신뢰성이 요구되는 경우
- 대규모 분산 시스템을 구축하는 경우

```python
# RabbitMQ 설정: 안정적이고 영속적
CELERY_BROKER_URL = 'amqp://guest:guest@localhost:5672//'
CELERY_RESULT_BACKEND = 'rpc://'
CELERY_TASK_ACKS_LATE = True
```

### 단계적 도입 전략

**Phase 1: 작은 규모로 시작**

```python
# 가장 시간이 오래 걸리는 1-2개 작업만 먼저 비동기로 전환
@shared_task
def send_email_task(subject, body, recipient):
    send_mail(subject, body, 'from@example.com', [recipient])

# 기존 코드 수정 최소화
def signup_view(request):
    # ... 회원가입 로직 ...
    send_email_task.delay('Welcome', 'Thank you', user.email)
```

**Phase 2: 모니터링 및 최적화**

```bash
# Flower로 작업 모니터링
celery -A myproject flower

# 성능 지표 확인
# - 작업 처리 속도
# - 실패율
# - 대기 큐 길이
```

**Phase 3: 확장**

```python
# 더 많은 작업을 비동기로 전환
# 우선순위 큐 도입
# 워커 수 증가
# 모니터링 및 알림 체계 구축
```

### 비용 vs 효과 분석

**도입 비용:**

- 인프라 비용: 메시지 브로커 서버, 워커 서버 (월 $50-200)
- 개발 시간: 초기 설정 및 학습 (1-2주)
- 운영 부담: 모니터링, 장애 대응 (주당 2-3시간)

**기대 효과:**

- 응답 시간 개선: 2-5초 → 100-200ms (10-50배 향상)
- 처리량 증가: 순차 처리 → 병렬 처리 (워커 수만큼 배수 증가)
- 사용자 경험 향상: 즉각적인 피드백, 타임아웃 제거
- 시스템 안정성: 작업 격리, 에러 재시도, 부하 분산

### 의사결정 체크리스트

다음 질문에 3개 이상 "예"라면 Celery + AMQP 도입을 고려하세요:

- [ ] HTTP 요청 처리 시간이 1초를 초과하는 경우가 있는가?
- [ ] 하루에 1,000개 이상의 백그라운드 작업이 필요한가?
- [ ] 외부 API 호출이 전체 로직의 30% 이상을 차지하는가?
- [ ] 주기적으로 실행해야 하는 cron 작업이 5개 이상인가?
- [ ] 작업 실패 시 자동 재시도가 필요한가?
- [ ] 작업 우선순위를 구분해야 하는가?
- [ ] 팀에 인프라 관리 역량이 있는가?
- [ ] 서비스 확장 계획이 있는가?

## Django 프로젝트에 Celery 설정하기

### 1. 필요한 패키지 설치

```bash
pip install celery
pip install redis  # Redis를 브로커로 사용하는 경우
# 또는
pip install amqp  # RabbitMQ를 브로커로 사용하는 경우
```

### 2. Celery 설정 파일 생성

**프로젝트 구조:**

```
myproject/
├── myproject/
│   ├── __init__.py
│   ├── settings.py
│   ├── celery.py  # 새로 생성
│   └── urls.py
└── manage.py
```

**myproject/celery.py:**

```python
import os
from celery import Celery

# Django 설정 모듈 지정
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

app = Celery('myproject')

# Django settings에서 CELERY_ 접두사를 가진 설정 로드
app.config_from_object('django.conf:settings', namespace='CELERY')

# 등록된 Django 앱에서 tasks.py를 자동으로 찾아 로드
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
```

**myproject/**init**.py:**

```python
# Celery 앱이 Django와 함께 로드되도록 설정
from .celery import app as celery_app

__all__ = ('celery_app',)
```

### 3. Django settings.py 설정

```python
# settings.py

# Celery Configuration
CELERY_BROKER_URL = 'redis://localhost:6379/0'  # Redis 사용 시
# 또는
# CELERY_BROKER_URL = 'amqp://guest:guest@localhost:5672//'  # RabbitMQ 사용 시

CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'Asia/Seoul'

# 작업 시간 제한 (초)
CELERY_TASK_TIME_LIMIT = 30 * 60  # 30분
CELERY_TASK_SOFT_TIME_LIMIT = 25 * 60  # 25분

# 결과 저장 기간 (초)
CELERY_RESULT_EXPIRES = 3600  # 1시간
```

## Celery Task 작성하기

### 기본 Task 예제

**myapp/tasks.py:**

```python
from celery import shared_task
from django.core.mail import send_mail
from time import sleep

@shared_task
def send_email_task(subject, message, recipient_list):
    """이메일 발송 작업"""
    send_mail(
        subject,
        message,
        'from@example.com',
        recipient_list,
        fail_silently=False,
    )
    return f'Email sent to {len(recipient_list)} recipients'

@shared_task
def process_large_file(file_path):
    """대용량 파일 처리 작업"""
    # 파일 처리 로직
    sleep(10)  # 시뮬레이션
    return f'File {file_path} processed successfully'

@shared_task(bind=True, max_retries=3)
def retry_task(self, x, y):
    """재시도 가능한 작업"""
    try:
        result = x / y
        return result
    except ZeroDivisionError as exc:
        # 10초 후 재시도
        raise self.retry(exc=exc, countdown=10)
```

### Django View에서 Task 호출

```python
# views.py
from django.http import JsonResponse
from .tasks import send_email_task, process_large_file

def send_notification(request):
    # 비동기 작업 실행
    task = send_email_task.delay(
        'Welcome!',
        'Thank you for joining.',
        ['user@example.com']
    )

    return JsonResponse({
        'status': 'Task submitted',
        'task_id': task.id
    })

def process_file(request):
    file_path = request.POST.get('file_path')

    # 즉시 응답 반환하고 백그라운드에서 처리
    task = process_large_file.delay(file_path)

    return JsonResponse({
        'status': 'Processing started',
        'task_id': task.id
    })
```

## 대규모 작업 분산처리 패턴

### 1. Chunking (작업 분할)

대량의 데이터를 작은 단위로 나누어 처리:

```python
from celery import group

@shared_task
def process_batch(items):
    """배치 단위 처리"""
    results = []
    for item in items:
        # 각 아이템 처리
        result = process_single_item(item)
        results.append(result)
    return results

def process_large_dataset(dataset):
    """대규모 데이터셋을 청크로 분할하여 처리"""
    chunk_size = 100
    chunks = [dataset[i:i+chunk_size] for i in range(0, len(dataset), chunk_size)]

    # 각 청크를 병렬로 처리
    job = group(process_batch.s(chunk) for chunk in chunks)
    result = job.apply_async()

    return result
```

### 2. Chain (작업 체인)

순차적으로 실행되어야 하는 작업들:

```python
from celery import chain

@shared_task
def fetch_data(url):
    """데이터 가져오기"""
    # API 호출 등
    return data

@shared_task
def transform_data(data):
    """데이터 변환"""
    # 데이터 처리
    return transformed_data

@shared_task
def save_data(data):
    """데이터 저장"""
    # DB 저장
    return 'Saved'

# 체인으로 연결
workflow = chain(
    fetch_data.s('https://api.example.com/data'),
    transform_data.s(),
    save_data.s()
)
result = workflow.apply_async()
```

### 3. Chord (병렬 + 집계)

여러 작업을 병렬로 실행 후 결과를 집계:

```python
from celery import chord

@shared_task
def process_item(item_id):
    """개별 아이템 처리"""
    # 처리 로직
    return result

@shared_task
def aggregate_results(results):
    """결과 집계"""
    total = sum(results)
    # 집계 결과 저장
    return total

# Chord 패턴: 병렬 처리 후 집계
callback = aggregate_results.s()
header = [process_item.s(i) for i in range(100)]
result = chord(header)(callback)
```

### 4. 우선순위 큐

중요도에 따른 작업 처리:

```mermaid
graph TB
    subgraph "Django Application"
        A1[긴급 알림 작업]
        A2[일반 작업]
        A3[배치 작업]
    end

    subgraph "Message Broker - Queue System"
        B1[High Priority Queue]
        B2[Default Queue]
        B3[Low Priority Queue]
    end

    subgraph "Worker Pool"
        C1[Worker 1-10<br/>concurrency=10]
        C2[Worker 11-30<br/>concurrency=20]
        C3[Worker 31-35<br/>concurrency=5]
    end

    A1 -->|urgent_task| B1
    A2 -->|normal_task| B2
    A3 -->|batch_task| B3

    B1 -->|즉시 처리| C1
    B2 -->|빠른 처리| C2
    B3 -->|여유 있을 때| C3

    style B1 fill:#ffcdd2
    style B2 fill:#fff9c4
    style B3 fill:#c8e6c9
    style C1 fill:#ffebee
    style C2 fill:#fffde7
    style C3 fill:#e8f5e9
```

**코드 구현:**

```python
# settings.py
CELERY_TASK_ROUTES = {
    'myapp.tasks.urgent_task': {'queue': 'high_priority'},
    'myapp.tasks.normal_task': {'queue': 'default'},
    'myapp.tasks.batch_task': {'queue': 'low_priority'},
}

# tasks.py
@shared_task
def urgent_task():
    """긴급 작업"""
    pass

# Worker 실행 시 큐 지정
# celery -A myproject worker -Q high_priority
# celery -A myproject worker -Q default,low_priority
```

## 실전 예제: 대규모 앱 푸시 알림 시스템

실제 서비스에서 수십만~수백만 명의 사용자에게 푸시 알림을 발송해야 하는 경우를 생각해봅시다. 예를 들어, 이커머스 앱에서 특가 이벤트 알림, 게임 앱에서 업데이트 공지, 뉴스 앱에서 속보 전송 등의 상황입니다.

### 전체 워크플로우

```mermaid
graph TD
    A[Admin: 캠페인 생성] -->|API 호출| B[Django View]
    B -->|execute_push_campaign.delay| C[Celery Broker]
    C -->|작업 분배| D[Main Task: execute_push_campaign]
    D -->|1M 디바이스 조회| E[Database]
    D -->|500개씩 분할| F[2,000개 배치 생성]
    F -->|Chord 패턴| G{Worker Pool<br/>20-50 workers}

    G -->|배치 1-500| H1[send_push_batch]
    G -->|배치 501-1000| H2[send_push_batch]
    G -->|배치 N| H3[send_push_batch]

    H1 -->|FCM API| I[Firebase Cloud Messaging]
    H2 -->|FCM API| I
    H3 -->|FCM API| I

    I -->|푸시 발송| J[사용자 디바이스]

    H1 -->|결과| K[aggregate_campaign_results]
    H2 -->|결과| K
    H3 -->|결과| K

    K -->|통계 업데이트| E
    K -->|완료 알림| L[관리자 알림]

    style A fill:#e3f2fd
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#e8f5e9
    style F fill:#fce4ec
    style G fill:#fff9c4
    style I fill:#ffebee
    style K fill:#e0f2f1
```

### 시나리오

**요구사항:**

- 100만 명의 사용자에게 동시에 푸시 알림 발송
- FCM (Firebase Cloud Messaging) 사용
- 발송 성공/실패 추적
- 우선순위에 따른 처리 (긴급 공지 vs 일반 마케팅)
- Rate limiting (FCM API 제한 준수)
- 재시도 로직
- 실시간 진행 상황 모니터링

### 데이터 모델 설계

```python
# models.py
from django.db import models
from django.contrib.auth.models import User

class DeviceToken(models.Model):
    """사용자 디바이스 토큰"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='devices')
    token = models.CharField(max_length=255, unique=True)
    platform = models.CharField(max_length=10, choices=[
        ('ios', 'iOS'),
        ('android', 'Android'),
    ])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['is_active', 'platform']),
        ]

class PushCampaign(models.Model):
    """푸시 캠페인"""
    PRIORITY_CHOICES = [
        ('high', '긴급'),
        ('normal', '일반'),
        ('low', '마케팅'),
    ]

    STATUS_CHOICES = [
        ('draft', '준비 중'),
        ('scheduled', '예약됨'),
        ('processing', '발송 중'),
        ('completed', '완료'),
        ('failed', '실패'),
    ]

    title = models.CharField(max_length=100)
    message = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normal')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')

    # 발송 대상
    target_user_ids = models.JSONField(default=list, blank=True)  # 특정 사용자
    target_all = models.BooleanField(default=False)  # 전체 사용자

    # 통계
    total_recipients = models.IntegerField(default=0)
    sent_count = models.IntegerField(default=0)
    success_count = models.IntegerField(default=0)
    failure_count = models.IntegerField(default=0)

    # 메타데이터
    data_payload = models.JSONField(default=dict, blank=True)  # 추가 데이터
    scheduled_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

class PushLog(models.Model):
    """푸시 발송 로그"""
    campaign = models.ForeignKey(PushCampaign, on_delete=models.CASCADE, related_name='logs')
    device_token = models.ForeignKey(DeviceToken, on_delete=models.CASCADE)

    STATUS_CHOICES = [
        ('pending', '대기 중'),
        ('sent', '발송됨'),
        ('failed', '실패'),
        ('invalid_token', '유효하지 않은 토큰'),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    error_message = models.TextField(blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['campaign', 'status']),
        ]
```

### Celery Task 구현

```python
# notifications/tasks.py
from celery import shared_task, group, chord
from firebase_admin import messaging
from django.utils import timezone
from django.db.models import F
from .models import PushCampaign, DeviceToken, PushLog
import logging

logger = logging.getLogger(__name__)

# FCM API Rate Limit: 초당 600개 요청
BATCH_SIZE = 500  # 한 번에 처리할 디바이스 수
RATE_LIMIT = '600/m'  # 분당 600개 제한


@shared_task(bind=True, max_retries=3, rate_limit=RATE_LIMIT)
def send_push_batch(self, campaign_id, device_token_ids):
    """
    배치 단위로 푸시 알림 발송

    Args:
        campaign_id: 캠페인 ID
        device_token_ids: 디바이스 토큰 ID 리스트 (최대 500개)
    """
    try:
        campaign = PushCampaign.objects.get(id=campaign_id)
        device_tokens = DeviceToken.objects.filter(
            id__in=device_token_ids,
            is_active=True
        ).select_related('user')

        # FCM 메시지 구성
        messages = []
        token_map = {}  # 인덱스 -> device_token 매핑

        for idx, device in enumerate(device_tokens):
            token_map[idx] = device

            message = messaging.Message(
                notification=messaging.Notification(
                    title=campaign.title,
                    body=campaign.message,
                ),
                data=campaign.data_payload,
                token=device.token,
                android=messaging.AndroidConfig(
                    priority='high' if campaign.priority == 'high' else 'normal',
                ),
                apns=messaging.APNSConfig(
                    headers={
                        'apns-priority': '10' if campaign.priority == 'high' else '5',
                    },
                ),
            )
            messages.append(message)

        # FCM Batch 전송
        response = messaging.send_all(messages)

        # 결과 처리
        success_count = 0
        failure_count = 0
        invalid_tokens = []

        for idx, resp in enumerate(response.responses):
            device = token_map[idx]

            if resp.success:
                # 성공
                PushLog.objects.create(
                    campaign=campaign,
                    device_token=device,
                    status='sent',
                    sent_at=timezone.now()
                )
                success_count += 1
            else:
                # 실패
                error_code = resp.exception.code if resp.exception else 'unknown'

                # 유효하지 않은 토큰 처리
                if error_code in ['invalid-argument', 'registration-token-not-registered']:
                    invalid_tokens.append(device.id)
                    PushLog.objects.create(
                        campaign=campaign,
                        device_token=device,
                        status='invalid_token',
                        error_message=str(resp.exception)
                    )
                else:
                    PushLog.objects.create(
                        campaign=campaign,
                        device_token=device,
                        status='failed',
                        error_message=str(resp.exception)
                    )

                failure_count += 1

        # 유효하지 않은 토큰 비활성화
        if invalid_tokens:
            DeviceToken.objects.filter(id__in=invalid_tokens).update(is_active=False)

        # 캠페인 통계 업데이트
        campaign.sent_count = F('sent_count') + len(device_token_ids)
        campaign.success_count = F('success_count') + success_count
        campaign.failure_count = F('failure_count') + failure_count
        campaign.save(update_fields=['sent_count', 'success_count', 'failure_count'])

        logger.info(
            f'Batch sent for campaign {campaign_id}: '
            f'{success_count} success, {failure_count} failed'
        )

        return {
            'campaign_id': campaign_id,
            'total': len(device_token_ids),
            'success': success_count,
            'failure': failure_count,
        }

    except Exception as exc:
        logger.error(f'Error sending push batch: {exc}')
        # 재시도 (최대 3번)
        raise self.retry(exc=exc, countdown=60 * (self.request.retries + 1))


@shared_task
def aggregate_campaign_results(results, campaign_id):
    """
    모든 배치 작업 완료 후 최종 집계

    Args:
        results: 각 배치 작업의 결과 리스트
        campaign_id: 캠페인 ID
    """
    campaign = PushCampaign.objects.get(id=campaign_id)

    # 최종 상태 업데이트
    campaign.status = 'completed'
    campaign.completed_at = timezone.now()
    campaign.save(update_fields=['status', 'completed_at'])

    # 통계 로깅
    logger.info(
        f'Campaign {campaign_id} completed: '
        f'{campaign.success_count}/{campaign.total_recipients} sent successfully'
    )

    # 관리자에게 완료 알림 (선택사항)
    send_admin_notification.delay(campaign_id)

    return {
        'campaign_id': campaign_id,
        'status': 'completed',
        'total': campaign.total_recipients,
        'success': campaign.success_count,
        'failure': campaign.failure_count,
    }


@shared_task
def send_admin_notification(campaign_id):
    """관리자에게 캠페인 완료 알림"""
    campaign = PushCampaign.objects.get(id=campaign_id)

    # 이메일이나 슬랙 알림 발송
    # send_email(...) or send_slack_message(...)

    logger.info(f'Admin notification sent for campaign {campaign_id}')


@shared_task
def execute_push_campaign(campaign_id):
    """
    푸시 캠페인 실행 (메인 오케스트레이터)

    이 태스크는 대규모 푸시 발송을 다음과 같이 처리합니다:
    1. 대상 사용자의 디바이스 토큰 조회
    2. 배치 단위로 분할 (500개씩)
    3. 각 배치를 병렬로 처리
    4. 모든 배치 완료 후 결과 집계
    """
    try:
        campaign = PushCampaign.objects.get(id=campaign_id)

        # 상태 업데이트
        campaign.status = 'processing'
        campaign.started_at = timezone.now()
        campaign.save(update_fields=['status', 'started_at'])

        # 대상 디바이스 토큰 조회
        if campaign.target_all:
            # 전체 사용자
            device_tokens = DeviceToken.objects.filter(is_active=True)
        else:
            # 특정 사용자
            device_tokens = DeviceToken.objects.filter(
                user_id__in=campaign.target_user_ids,
                is_active=True
            )

        # 총 수신자 수 업데이트
        total_devices = device_tokens.count()
        campaign.total_recipients = total_devices
        campaign.save(update_fields=['total_recipients'])

        if total_devices == 0:
            campaign.status = 'completed'
            campaign.completed_at = timezone.now()
            campaign.save(update_fields=['status', 'completed_at'])
            return {'message': 'No recipients found'}

        # 디바이스 토큰 ID를 배치로 분할
        device_ids = list(device_tokens.values_list('id', flat=True))
        batches = [
            device_ids[i:i + BATCH_SIZE]
            for i in range(0, len(device_ids), BATCH_SIZE)
        ]

        logger.info(
            f'Starting campaign {campaign_id}: '
            f'{total_devices} devices in {len(batches)} batches'
        )

        # Chord 패턴: 모든 배치를 병렬로 처리하고 결과 집계
        callback = aggregate_campaign_results.s(campaign_id)
        header = group(
            send_push_batch.s(campaign_id, batch)
            for batch in batches
        )

        # 작업 실행
        chord(header)(callback)

        return {
            'campaign_id': campaign_id,
            'total_recipients': total_devices,
            'batches': len(batches),
            'status': 'processing'
        }

    except PushCampaign.DoesNotExist:
        logger.error(f'Campaign {campaign_id} not found')
        raise
    except Exception as exc:
        logger.error(f'Error executing campaign {campaign_id}: {exc}')
        campaign.status = 'failed'
        campaign.save(update_fields=['status'])
        raise
```

### Django View & API 구현

```python
# notifications/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils import timezone
from .models import PushCampaign
from .tasks import execute_push_campaign
from .serializers import PushCampaignSerializer


class PushCampaignViewSet(viewsets.ModelViewSet):
    """푸시 캠페인 관리 API"""
    queryset = PushCampaign.objects.all()
    serializer_class = PushCampaignSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        """캠페인 생성"""
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        """
        캠페인 발송 시작

        POST /api/campaigns/{id}/send/
        """
        campaign = self.get_object()

        # 상태 검증
        if campaign.status not in ['draft', 'scheduled']:
            return Response(
                {'error': 'Campaign already sent or in progress'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 우선순위에 따라 적절한 큐로 라우팅
        queue_name = {
            'high': 'high_priority',
            'normal': 'default',
            'low': 'low_priority',
        }.get(campaign.priority, 'default')

        # 비동기 작업 실행
        task = execute_push_campaign.apply_async(
            args=[campaign.id],
            queue=queue_name
        )

        return Response({
            'campaign_id': campaign.id,
            'task_id': task.id,
            'status': 'Campaign sending started',
            'priority': campaign.priority,
            'queue': queue_name,
        })

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """
        캠페인 통계 조회

        GET /api/campaigns/{id}/stats/
        """
        campaign = self.get_object()

        # 진행률 계산
        progress = 0
        if campaign.total_recipients > 0:
            progress = (campaign.sent_count / campaign.total_recipients) * 100

        return Response({
            'campaign_id': campaign.id,
            'status': campaign.status,
            'total_recipients': campaign.total_recipients,
            'sent': campaign.sent_count,
            'success': campaign.success_count,
            'failure': campaign.failure_count,
            'progress': round(progress, 2),
            'started_at': campaign.started_at,
            'completed_at': campaign.completed_at,
        })

    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        진행 중인 캠페인 목록

        GET /api/campaigns/active/
        """
        active_campaigns = self.queryset.filter(
            status='processing'
        ).order_by('-started_at')

        serializer = self.get_serializer(active_campaigns, many=True)
        return Response(serializer.data)
```

### Settings 설정

```python
# settings.py

# Celery Task Routing (우선순위별 큐)
CELERY_TASK_ROUTES = {
    'notifications.tasks.send_push_batch': {
        'queue': 'default',
        'routing_key': 'push.batch',
    },
    'notifications.tasks.execute_push_campaign': {
        'queue': 'default',
        'routing_key': 'push.campaign',
    },
}

# Rate Limiting 설정
CELERY_TASK_ANNOTATIONS = {
    'notifications.tasks.send_push_batch': {
        'rate_limit': '600/m',  # FCM API 제한 준수
    },
}

# Redis를 사용한 결과 저장
CELERY_RESULT_BACKEND = 'redis://localhost:6379/1'
CELERY_RESULT_EXPIRES = 3600  # 1시간

# Worker 동시성 설정
CELERY_WORKER_PREFETCH_MULTIPLIER = 4
CELERY_WORKER_MAX_TASKS_PER_CHILD = 1000  # 메모리 누수 방지
```

### Worker 실행 전략

대규모 푸시 발송을 위한 워커 구성:

```bash
# 고우선순위 큐 워커 (긴급 공지용)
celery -A myproject worker \
    -Q high_priority \
    --concurrency=10 \
    -n worker-high@%h \
    -l info

# 일반 우선순위 큐 워커 (일반 알림용)
celery -A myproject worker \
    -Q default \
    --concurrency=20 \
    -n worker-normal@%h \
    -l info

# 저우선순위 큐 워커 (마케팅용)
celery -A myproject worker \
    -Q low_priority \
    --concurrency=5 \
    -n worker-low@%h \
    -l info

# Autoscale로 동적 조정 (피크 시간 대비)
celery -A myproject worker \
    -Q default \
    --autoscale=50,10 \
    -n worker-autoscale@%h \
    -l info
```

### 사용 예시

```python
# 관리자 페이지나 스크립트에서 캠페인 생성 및 발송

# 1. 전체 사용자 대상 긴급 공지
campaign = PushCampaign.objects.create(
    title='긴급 시스템 점검 안내',
    message='오늘 오후 2시부터 30분간 시스템 점검이 진행됩니다.',
    priority='high',
    target_all=True,
    created_by=admin_user,
)
execute_push_campaign.delay(campaign.id)

# 2. 특정 사용자 대상 마케팅
vip_users = User.objects.filter(membership='VIP').values_list('id', flat=True)
campaign = PushCampaign.objects.create(
    title='VIP 회원 특별 할인',
    message='오늘만 50% 할인! 지금 바로 확인하세요.',
    priority='low',
    target_user_ids=list(vip_users),
    data_payload={'type': 'promotion', 'discount': 50},
    created_by=admin_user,
)
execute_push_campaign.delay(campaign.id)

# 3. API를 통한 발송 (REST API 호출)
# POST /api/campaigns/{id}/send/
# GET /api/campaigns/{id}/stats/
```

### 성능 최적화 팁

**1. Database 최적화:**

```python
# Bulk Create로 로그 생성
logs = [
    PushLog(campaign=campaign, device_token=device, status='sent')
    for device in devices
]
PushLog.objects.bulk_create(logs, batch_size=1000)

# Select Related/Prefetch Related 활용
device_tokens = DeviceToken.objects.filter(
    user_id__in=user_ids
).select_related('user').only('id', 'token', 'platform')
```

**2. 메모리 관리:**

```python
# Iterator를 사용하여 대량 쿼리 메모리 절약
for device in DeviceToken.objects.filter(is_active=True).iterator(chunk_size=1000):
    process_device(device)
```

**3. 모니터링:**

```python
# Flower로 실시간 모니터링
# http://localhost:5555

# Custom metrics (Prometheus + Grafana)
from prometheus_client import Counter, Histogram

push_sent_counter = Counter('push_notifications_sent', 'Push notifications sent')
push_duration = Histogram('push_batch_duration', 'Push batch processing duration')
```

### 예상 처리량 계산

**시나리오: 100만 명 사용자에게 푸시 발송**

- **배치 크기**: 500개
- **총 배치 수**: 2,000개
- **워커 수**: 20개 (concurrency=20)
- **Rate Limit**: 분당 600개 (초당 10개)
- **예상 처리 시간**:
  - 이론적: (1,000,000 / 600) = 약 1,667분 = 27.8시간
  - 실제 (20 워커 병렬): 약 1.5~2시간
  - 최적화 (50 워커 병렬): 약 30~40분

**처리량 향상 방법:**

- 워커 수 증가 (horizontal scaling)
- 여러 FCM 프로젝트 사용 (rate limit 분산)
- 배치 크기 최적화
- 네트워크 I/O 최적화

이 구현은 실제 프로덕션 환경에서 대규모 푸시 알림을 안정적으로 발송할 수 있는 견고한 시스템을 제공합니다.

## AMQP와 메시지 브로커

### RabbitMQ 설정

RabbitMQ는 AMQP(Advanced Message Queuing Protocol)를 구현한 메시지 브로커입니다.

**설치 및 실행:**

```bash
# macOS
brew install rabbitmq
brew services start rabbitmq

# Ubuntu
sudo apt-get install rabbitmq-server
sudo systemctl start rabbitmq-server
```

**Django 설정:**

```python
# settings.py
CELERY_BROKER_URL = 'amqp://guest:guest@localhost:5672//'
CELERY_RESULT_BACKEND = 'rpc://'

# RabbitMQ 설정 상세
CELERY_BROKER_CONNECTION_RETRY = True
CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP = True
CELERY_BROKER_CONNECTION_MAX_RETRIES = 10
```

### Redis vs RabbitMQ

| 특징          | Redis          | RabbitMQ           |
| ------------- | -------------- | ------------------ |
| 프로토콜      | Redis Protocol | AMQP               |
| 메시지 영속성 | 제한적         | 강력함             |
| 성능          | 매우 빠름      | 빠름               |
| 복잡한 라우팅 | 제한적         | 강력함             |
| 메모리 사용   | 높음           | 낮음               |
| 사용 사례     | 간단한 작업 큐 | 복잡한 메시징 패턴 |

## Celery Worker 실행 및 관리

### Worker 실행

```bash
# 기본 실행
celery -A myproject worker -l info

# 동시성 설정 (워커 프로세스 수)
celery -A myproject worker -l info --concurrency=4

# 특정 큐만 처리
celery -A myproject worker -Q high_priority,default -l info

# Autoscale (최소-최대 워커 수)
celery -A myproject worker --autoscale=10,3 -l info
```

### Celery Beat (주기적 작업)

```bash
# Beat 스케줄러 실행
celery -A myproject beat -l info
```

**주기적 작업 설정:**

```python
# settings.py
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'send-daily-report': {
        'task': 'myapp.tasks.generate_daily_report',
        'schedule': crontab(hour=9, minute=0),  # 매일 오전 9시
    },
    'cleanup-old-data': {
        'task': 'myapp.tasks.cleanup_old_data',
        'schedule': crontab(hour=2, minute=0, day_of_week=1),  # 매주 월요일 오전 2시
    },
    'process-pending-jobs': {
        'task': 'myapp.tasks.process_pending_jobs',
        'schedule': 300.0,  # 5분마다
    },
}
```

## 모니터링 및 관리

### Flower를 이용한 모니터링

```bash
# Flower 설치
pip install flower

# Flower 실행
celery -A myproject flower
# http://localhost:5555 에서 접근
```

Flower 기능:

- 실시간 작업 모니터링
- 워커 상태 확인
- 작업 통계 및 그래프
- 작업 재시도/취소

### 작업 상태 확인

```python
from celery.result import AsyncResult

def check_task_status(task_id):
    result = AsyncResult(task_id)

    return {
        'task_id': task_id,
        'status': result.status,
        'result': result.result if result.ready() else None,
        'traceback': result.traceback if result.failed() else None,
    }
```

## 프로덕션 배포 고려사항

### 1. Supervisor를 이용한 프로세스 관리

```ini
; /etc/supervisor/conf.d/celery.conf
[program:celery-worker]
command=/path/to/venv/bin/celery -A myproject worker -l info
directory=/path/to/project
user=www-data
numprocs=1
stdout_logfile=/var/log/celery/worker.log
stderr_logfile=/var/log/celery/worker_error.log
autostart=true
autorestart=true
startsecs=10
stopwaitsecs=600

[program:celery-beat]
command=/path/to/venv/bin/celery -A myproject beat -l info
directory=/path/to/project
user=www-data
numprocs=1
stdout_logfile=/var/log/celery/beat.log
stderr_logfile=/var/log/celery/beat_error.log
autostart=true
autorestart=true
startsecs=10
```

### 2. 로깅 설정

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'celery': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/celery/celery.log',
            'maxBytes': 1024 * 1024 * 10,  # 10MB
            'backupCount': 5,
        },
    },
    'loggers': {
        'celery': {
            'handlers': ['celery'],
            'level': 'INFO',
        },
    },
}
```

### 3. 보안 설정

```python
# settings.py

# 작업 직렬화 제한 (pickle 사용 금지)
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

# 브로커 연결 보안
CELERY_BROKER_URL = 'amqps://user:password@hostname:5671//'
CELERY_BROKER_USE_SSL = {
    'keyfile': '/path/to/key.pem',
    'certfile': '/path/to/cert.pem',
    'ca_certs': '/path/to/ca.pem',
}
```

## Key Points

- **Celery는 Django와 함께 사용하여 시간이 오래 걸리는 작업을 비동기로 처리**할 수 있는 강력한 도구입니다
- **Message Broker (Redis, RabbitMQ)**를 통해 작업을 큐에 저장하고 워커가 처리합니다
- **Chunking, Chain, Chord** 등의 패턴을 활용하여 대규모 작업을 효율적으로 분산 처리할 수 있습니다
- **대규모 푸시 알림 시스템**과 같은 실전 예제에서 100만 명 이상의 사용자에게 효율적으로 메시지를 발송할 수 있습니다
- **우선순위 큐와 Rate Limiting**을 활용하여 외부 API 제약사항을 준수하면서도 최적의 성능을 달성할 수 있습니다
- **Celery Beat**을 사용하여 주기적인 작업을 스케줄링할 수 있습니다
- **Flower**를 통해 작업 실행 상태를 실시간으로 모니터링할 수 있습니다
- 프로덕션 환경에서는 **Supervisor, 로깅, 보안 설정**을 적절히 구성해야 합니다
- **Database 최적화 (bulk_create, select_related)와 메모리 관리**가 대규모 처리의 핵심입니다

## Conclusion

Django와 Celery를 활용하면 웹 애플리케이션의 성능과 사용자 경험을 크게 향상시킬 수 있습니다. 시간이 오래 걸리는 작업을 백그라운드로 분리함으로써 빠른 응답 시간을 유지하고, 여러 워커를 통한 분산 처리로 대규모 작업도 효율적으로 처리할 수 있습니다.

Celery를 도입할 때는 작업의 특성에 맞는 메시지 브로커를 선택하고, 적절한 작업 분산 패턴을 적용하며, 모니터링 체계를 구축하는 것이 중요합니다.

### Next Steps

- [Django REST Framework와 비동기 API 구현]
- [RabbitMQ 고급 기능과 메시지 패턴]
- [Celery 성능 최적화 및 튜닝]
- [분산 시스템 아키텍처 설계]
