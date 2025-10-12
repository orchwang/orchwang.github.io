<p align="center">
  <br>
  <img width="200" src="./assets/images/logo/orchwang.png" alt="orchwang logo">
  <br>
</p>

# Orc Hwang's Wiki

개발 학습 기록과 기술 지식을 체계적으로 관리하는 개인 위키입니다.

## 프로젝트 구조

```
.
├── _config.yml              # Jekyll 사이트 설정
├── _data/                   # 태그, 메뉴 등 데이터
├── _includes/               # 재사용 가능한 HTML 조각
│   ├── header.html         # 사이트 헤더 (네비게이션, 검색)
│   └── footer.html         # 사이트 푸터
├── _layouts/               # 페이지 레이아웃
│   ├── default.html        # 기본 레이아웃
│   ├── post.html          # 포스트 레이아웃
│   ├── tag_page.html      # 태그 페이지 레이아웃
│   └── cv.html            # CV 페이지 레이아웃
├── _plugins/               # Jekyll 플러그인
│   └── tag_generator.rb   # 태그 페이지 자동 생성
├── _posts/                 # 학습 기록 포스트
├── assets/                 # CSS, JavaScript, 이미지
│   ├── css/style.css      # 메인 스타일시트
│   ├── js/search.js       # 검색 기능
│   └── images/logo/       # 로고 이미지
├── pages/                  # 고정 페이지
│   ├── cv.md              # 이력서
│   └── tags.md            # 태그 목록
├── index.html             # 메인 페이지
├── search.json            # 검색 데이터
└── Gemfile                # Ruby 의존성
```

## 주요 기능

### 1. 태그 시스템

- 포스트에 태그를 추가하여 분류
- 태그별 포스트 자동 그룹화
- 태그 클라우드 UI

### 2. 검색 기능

- 클라이언트 사이드 실시간 검색
- 제목, 내용, 태그 검색 지원
- 검색 결과 하이라이트

### 3. 로드맵 추적

- 체크박스 기반 학습 진행 상황 관리
- 완료한 항목에 학습 포스트 링크 연결

### 4. 반응형 디자인

- 모바일 친화적 레이아웃
- 다크/라이트 모드 지원 가능

## 설치 및 실행

### 사전 요구사항

Ruby 개발 환경이 필요합니다. macOS의 경우 시스템 Ruby 대신 rbenv나 rvm을 사용하는 것을 권장합니다.

#### macOS - Homebrew로 rbenv 설치

```bash
# Homebrew 설치 (이미 설치된 경우 생략)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# rbenv와 ruby-build 설치
brew install rbenv ruby-build

# rbenv 초기화 (.zshrc 또는 .bash_profile에 추가)
echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc
source ~/.zshrc

# Ruby 3.1.0 이상 설치
rbenv install 3.1.0
rbenv global 3.1.0

# 설치 확인
ruby -v
```

### 1. 의존성 설치

```bash
# Gemfile 기반 의존성 설치
make init

# 또는 직접 실행
bundle install --path vendor/bundle
```

### 2. 로컬 서버 실행

```bash
# 개발 서버 시작
make serve

# 또는 직접 실행
bundle exec jekyll serve
```

사이트는 http://localhost:4000 에서 확인할 수 있습니다.

### 3. 빌드 (배포용)

```bash
bundle exec jekyll build
```

빌드된 사이트는 `_site` 디렉토리에 생성됩니다.

## 사용 방법

### 새 포스트 작성

1. `_posts` 디렉토리에 마크다운 파일 생성
2. 파일명 형식: `YYYY-MM-DD-title.md`
3. Front Matter 작성:

```markdown
---
layout: post
title: "포스트 제목"
date: 2025-10-12
tags: [tag1, tag2, tag3]
---

포스트 내용...
```

### 로드맵 포스트 작성

```markdown
---
layout: post
title: "백엔드 개발자 로드맵"
date: 2025-10-12
categories: Roadmap
tags: [roadmap, backend]
---

## 학습 항목

- [x] 완료된 항목 - [[링크 제목](/2025/10/12/post-url.html)]
- [ ] 진행 중인 항목
- [ ] 미완료 항목
```

### CV 페이지 수정

`pages/cv.md` 파일을 편집하여 이력서 내용을 업데이트합니다.

### 사이트 설정 변경

`_config.yml` 파일에서 사이트 제목, 설명, 이메일 등을 수정합니다.

```yaml
title: 사이트 제목
description: 사이트 설명
author: 이름
email: your-email@example.com
url: https://yourusername.github.io
```

## 배포 (GitHub Pages)

### 1. 저장소 설정

저장소 이름을 `yourusername.github.io` 형식으로 생성합니다.

### 2. 코드 푸시

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 3. GitHub Pages 활성화

1. 저장소 Settings > Pages
2. Source: Deploy from a branch
3. Branch: main / root
4. Save

몇 분 후 https://yourusername.github.io 에서 사이트를 확인할 수 있습니다.

## 커스터마이징

### 색상 변경

`assets/css/style.css` 파일의 CSS 변수를 수정합니다:

```css
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --accent-color: #e74c3c;
  /* ... */
}
```

### 네비게이션 메뉴 변경

`_includes/header.html` 파일의 네비게이션 메뉴를 수정합니다.

### 레이아웃 변경

`_layouts/` 디렉토리의 HTML 파일들을 수정합니다.

## 트러블슈팅

### Bundle install 실패

**문제**: 시스템 Ruby 권한 오류 또는 네이티브 확장 컴파일 오류

**해결방법**:

1. rbenv나 rvm으로 Ruby 재설치
2. Xcode Command Line Tools 설치 (macOS):
   ```bash
   xcode-select --install
   ```
3. `--path vendor/bundle` 옵션 사용

### 포트 충돌

**문제**: 4000 포트가 이미 사용 중

**해결방법**:

```bash
bundle exec jekyll serve --port 4001
```

### 변경사항이 반영되지 않음

**문제**: Jekyll이 변경사항을 감지하지 못함

**해결방법**:

- 서버를 재시작
- `_config.yml` 변경 시 항상 재시작 필요
- `--force_polling` 옵션 사용

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 기여

개선 사항이나 버그 리포트는 이슈로 등록해주세요.

---

**Built with Jekyll** | Last updated: 2025-10-12
