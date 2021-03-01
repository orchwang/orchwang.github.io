---
layout: post
title: "Requst Mock 을 이용해 pytest 에서 api 테스트 하기"
date: 2021-03-01 20:00:25 +0900
categories: python test
tags: python pytest rest django-rest-framework request-mock
published: true
---

# 개요

소위 `Integrated test` 라고 할 수 있는, 즉 우리가 통제할 수 없는 프로세스와 연동된 로직을 테스트 해야 하는 경우가 발생한다. 이러한 경우를 대비해 `request mock` 을 연습하고자 한다.

# Request Mock

> The requests library has the concept of pluggable transport adapters. These adapters allow you to register your own handlers for different URIs or protocols.

[Request Mock Documentation](https://requests-mock.readthedocs.io/) 는 실제 request 와는 격리된 request adapter 를 제공한다. 테스트 해야 하는 프로세스에 우리가 컨트롤 할 수 없는 로직이 있는 경우 이를 테스트에 이용할 수 없는데, 테스트 시 실제 로직과 격리된 환경에서 테스트가 가능해진다. 본문에서는 특정 API 를 모방하는 Mock 을 만들어 본다.

## Tutorial Target

모방할 request 는 아래와 같다.

- 특정 POST request 를 요구하는 API 를 호출한다.
- Json response 를 수신한다.
