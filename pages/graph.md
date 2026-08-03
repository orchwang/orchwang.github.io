---
layout: default
title: 지식 그래프
permalink: /pages/graph.html
---

<div class="graph-page">
    <section class="tavern-band tavern-band--day" aria-label="지식의 거미줄 안내">
        <div class="tavern-band-media" aria-hidden="true"></div>
        <div class="tavern-band-scrim" aria-hidden="true"></div>
        <h2 class="tavern-band-title">지식의 거미줄</h2>
        <p class="tavern-band-text">237개의 출정 기록이 서로를 어떻게 가리키는지 한 눈에 보시오. 같은 시리즈의 글은 끈으로, 본문에서 직접 인용한 글은 선으로, 같은 주제를 다루는 글은 점선으로 이어집니다. — 거미줄 위로 손을 뻗어 그물을 따라가시오.</p>
        <p class="tavern-band-subtitle">Zug zug — 연결이 곧 힘이니</p>
        <div class="axe-divider" aria-hidden="true"><span class="axe-cross"></span></div>
    </section>

    <header class="page-header">
        <h1>지식 그래프</h1>
        <p>포스트는 노드, 본문 링크는 엣지입니다. 노드 크기는 인용 빈도(연결 차수), 색은 카테고리, 위치는 d3-force가 빈도·카테고리·시리즈·태그 유사도를 종합해 배치합니다. 노드를 클릭하면 사이드 패널에 그 글의 참조·피참조가 펼쳐집니다.</p>
    </header>

    <section class="graph-stats" id="graph-stats" aria-label="그래프 스탯">
        <div class="graph-stat-tiles">
            <div class="graph-stat-tile" data-stat="posts">
                <span class="graph-stat-num" id="stat-num-posts">—</span>
                <span class="graph-stat-label">총 포스트</span>
            </div>
            <div class="graph-stat-tile" data-stat="edges">
                <span class="graph-stat-num" id="stat-num-edges">—</span>
                <span class="graph-stat-label">총 연결</span>
            </div>
            <div class="graph-stat-tile" data-stat="components">
                <span class="graph-stat-num" id="stat-num-components">—</span>
                <span class="graph-stat-label">지식의 섬</span>
            </div>
            <div class="graph-stat-tile" data-stat="hubs">
                <span class="graph-stat-num" id="stat-num-hubs">—</span>
                <span class="graph-stat-label">허브(상위 5)</span>
            </div>
            <div class="graph-stat-tile" data-stat="orphans">
                <span class="graph-stat-num" id="stat-num-orphans">—</span>
                <span class="graph-stat-label">고아 포스트</span>
            </div>
        </div>

        <div class="graph-stats-row">
            <div class="graph-stat-block">
                <h3 class="graph-stat-title">카테고리 분포</h3>
                <div class="graph-cat-bar" id="graph-cat-bar" aria-label="카테고리별 포스트 수"></div>
            </div>
            <div class="graph-stat-block">
                <h3 class="graph-stat-title">최다 태그 TOP 10</h3>
                <div class="graph-tag-chips" id="graph-tag-chips" aria-label="태그 상위 10"></div>
            </div>
            <div class="graph-stat-block">
                <h3 class="graph-stat-title">허브 TOP 5</h3>
                <ol class="graph-hub-list" id="graph-hub-list" aria-label="연결 차수 상위 5 포스트"></ol>
            </div>
        </div>
    </section>

    <section class="graph-controls" id="graph-controls" aria-label="그래프 컨트롤">
        <div class="graph-control-group" role="group" aria-label="카테고리 필터">
            <span class="graph-control-label">대륙</span>
            <div class="graph-legend" id="graph-legend"></div>
        </div>
        <div class="graph-control-group" role="group" aria-label="엣지 레이어">
            <span class="graph-control-label">레이어</span>
            <label class="graph-toggle"><input type="checkbox" id="layer-link" checked><span>본문 링크</span></label>
            <label class="graph-toggle"><input type="checkbox" id="layer-series" checked><span>시리즈 체인</span></label>
            <label class="graph-toggle"><input type="checkbox" id="layer-tag"><span>태그 유사도</span></label>
        </div>
        <div class="graph-control-group" role="group" aria-label="시리즈 선택">
            <label class="graph-control-label" for="series-select">시리즈</label>
            <select id="series-select" class="graph-select">
                <option value="">— 전체 —</option>
            </select>
        </div>
        <div class="graph-control-group graph-control-search">
            <label class="graph-control-label" for="search-input-graph">탐색</label>
            <input type="search" id="search-input-graph" class="graph-search" placeholder="제목·태그 검색" autocomplete="off">
            <button type="button" class="graph-search-clear" id="graph-search-clear" aria-label="검색어 지우기" hidden>✕</button>
        </div>
    </section>

    <div class="graph-layout">
        <div class="graph-stage" id="graph-stage">
            <canvas id="graph-canvas" tabindex="0"
                    aria-label="지식 그래프 — 드래그로 이동, 휠로 줌, 노드 클릭으로 패널 열기"></canvas>

            <div class="graph-hud" id="graph-hud" aria-hidden="true">
                <span class="graph-hud-eyebrow" id="graph-hud-eyebrow">노드</span>
                <span class="graph-hud-title" id="graph-hud-title">노드를 가리키시오</span>
                <span class="graph-hud-meta" id="graph-hud-meta"></span>
            </div>

            <div class="graph-zoom-hint" id="graph-zoom-hint" aria-hidden="true">
                <span class="graph-zoom-hint-kbd">드래그</span> 이동 · <span class="graph-zoom-hint-kbd">휠</span> 줌 · <span class="graph-zoom-hint-kbd">더블클릭</span> 패널 열기
            </div>

            <div class="graph-loading" id="graph-loading">
                <span class="graph-loading-spark" aria-hidden="true"></span>
                <span>거미줄을 짜는 중…</span>
            </div>
        </div>

        <aside class="graph-panel" id="graph-panel" aria-label="선택한 노드의 참조·피참조">
            <div class="graph-panel-head">
                <span class="graph-panel-eyebrow" id="graph-panel-eyebrow">노드</span>
                <h2 class="graph-panel-title" id="graph-panel-title">노드를 선택하시오</h2>
                <p class="graph-panel-sub" id="graph-panel-sub">그래프에서 노드를 클릭하면 그 글의 메타와 참조·피참조 목록이 펼쳐집니다.</p>
            </div>
            <div class="graph-panel-meta" id="graph-panel-meta" hidden>
                <span class="graph-panel-date" id="graph-panel-date"></span>
                <div class="graph-panel-tags" id="graph-panel-tags"></div>
            </div>
            <div class="graph-panel-sections">
                <section class="graph-panel-section" id="graph-panel-out" hidden>
                    <h3 class="graph-panel-section-title">이 글이 참조 <span class="graph-panel-section-count" id="graph-panel-out-count"></span></h3>
                    <ol class="graph-panel-list" id="graph-panel-out-list"></ol>
                </section>
                <section class="graph-panel-section" id="graph-panel-in" hidden>
                    <h3 class="graph-panel-section-title">이 글을 참조 <span class="graph-panel-section-count" id="graph-panel-in-count"></span></h3>
                    <ol class="graph-panel-list" id="graph-panel-in-list"></ol>
                </section>
                <section class="graph-panel-section" id="graph-panel-series" hidden>
                    <h3 class="graph-panel-section-title">같은 시리즈</h3>
                    <ol class="graph-panel-list" id="graph-panel-series-list"></ol>
                </section>
            </div>
        </aside>
    </div>

    <section class="graph-theory" aria-label="이 그래프의 이론적 근거">
        <h2>이 그래프의 이론</h2>
        <p class="graph-theory-intro">이 페이지는 단순한 시각화가 아니라 위키 자체에서 쓴 <em>지식 그래프</em>와 <em>온톨로지</em> 시리즈의 <strong>자기 실습 사례</strong>다. 설계의 근거가 되는 글 — 패널·이동·객체 승격·커뮤니티 — 은 아래에서 직접 읽을 수 있다.</p>
        <ul class="graph-theory-list">
            <li><a href="/2026/07/21/kg-what-is-knowledge-graph.html">지식 그래프란 무엇인가 — "관계를 계산하지 말고 저장하라"</a> · 본문 링크를 빌드 타임에 추출해 노드 간 엣지로 저장하는 결정의 정당화.</li>
            <li><a href="/2026/07/19/ontology-knowledge-graphs-rdf-owl-property-graphs.html">지식 그래프 모델 — RDF/OWL vs 속성 그래프(LPG)</a> · 이 그래프가 RDF 트리플 스토어가 아닌 LPG 모델인 이유.</li>
            <li><a href="/2026/07/19/ontology-link-types-relationships.html">링크 타입(typed relationship) — 3층 엣지의 이론</a> · 본문 링크 / 시리즈 체인 / 태그 유사도 = 3종 링크 타입.</li>
            <li><a href="/2026/07/19/ontology-object-types-properties.html">객체 승격 관문 — 태그를 노드로 만들지 않는 이유</a> · 태그·카테고리는 속성/필터로 두고 포스트만 노드로 승격.</li>
            <li><a href="/2026/07/21/kg-graphrag.html">GraphRAG — community detection</a> · 후속 개선 여지(§9): Leiden으로 주제 클러스터를 자동으로 그리기.</li>
            <li><a href="/2026/07/21/kg-construction-entity-relation-extraction.html">그래프 구축 파이프라인 — 추출·스키마·해소</a> · 본문 링크 → 노드 → 깨진 링크 감사로 이어지는 구축론.</li>
        </ul>
    </section>

    <div class="graph-fallback" id="graph-fallback">
        <h2>전체 포스트 인덱스</h2>
        <p class="graph-fallback-note">그래프를 표시할 수 없는 환경(스크립트 차단·Canvas 미지원·검색 엔진)입니다. 아래 목록으로 같은 데이터를 카테고리·시리즈 단위로 살펴볼 수 있습니다.</p>
        {% assign cats = site.categories | sort %}
        {% for cat in cats %}
            {% assign cat_name = cat[0] %}
            {% assign cat_posts = cat[1] %}
            <section class="graph-fallback-cat">
                <h3 id="graph-cat-{{ cat_name | slugify }}">
                    <a href="{{ '/categories/' | append: cat_name | slugify | relative_url }}/">{{ cat_name }}</a>
                    <span class="graph-fallback-count">({{ cat_posts.size }})</span>
                </h3>
                <ul class="post-list">
                    {% assign sorted_posts = cat_posts | sort: 'date' | reverse %}
                    {% for post in sorted_posts %}
                    <li>
                        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                        <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
                    </li>
                    {% endfor %}
                </ul>
            </section>
        {% endfor %}
    </div>
</div>
