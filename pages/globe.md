---
layout: default
title: 월드맵
permalink: /pages/globe.html
---

<div class="globe-page">
    <section class="tavern-band tavern-band--day" aria-label="아제로스 세계 지도 안내">
        <div class="tavern-band-media" aria-hidden="true"></div>
        <div class="tavern-band-scrim" aria-hidden="true"></div>
        <h2 class="tavern-band-title">아제로스 세계 지도</h2>
        <p class="tavern-band-text">정복한 대륙(카테고리)을 굽어보시오. 대륙을 돌려 영토를 살피고, 영역을 선택해 그 땅의 출정 기록(포스트)을 열람하시오.</p>
        <p class="tavern-band-subtitle">Lok'tar ogar — 온 세계가 전장이니</p>
        <div class="axe-divider" aria-hidden="true"><span class="axe-cross"></span></div>
    </section>

    <header class="page-header">
        <h1>월드맵</h1>
        <p>전체 포스트를 지구본 위에서 탐험하세요. 대륙은 카테고리, 영역은 하위 카테고리이며, 여러 대륙에 걸친 태그는 선으로 이어집니다.</p>
    </header>

    <div class="globe-layout">
        <div class="globe-stage" id="globe-stage">
            <canvas id="globe-canvas" tabindex="0"
                    aria-label="포스트 지구본 — 드래그로 회전, 영역 클릭으로 포스트 열람"></canvas>

            <div class="globe-hud" id="globe-hud" aria-hidden="true">
                <span class="globe-hud-eyebrow" id="globe-hud-eyebrow">아제로스</span>
                <span class="globe-hud-title" id="globe-hud-title">대륙을 선택하시오</span>
                <span class="globe-hud-meta" id="globe-hud-meta"></span>
            </div>

            <div class="globe-legend" id="globe-legend" aria-hidden="true"></div>

            <div class="globe-loading" id="globe-loading">
                <span class="globe-loading-spark" aria-hidden="true"></span>
                <span>세계를 그리는 중…</span>
            </div>
        </div>

        <aside class="globe-panel" id="globe-panel" aria-label="선택한 영역의 포스트">
            <div class="globe-panel-head">
                <span class="globe-panel-eyebrow" id="globe-panel-eyebrow">영토</span>
                <h2 class="globe-panel-title" id="globe-panel-title">대륙을 선택하시오</h2>
                <p class="globe-panel-sub" id="globe-panel-sub">지구본에서 대륙이나 영역을 클릭하면 이곳에 그 땅의 포스트가 나타납니다.</p>
            </div>
            <ol class="globe-panel-list" id="globe-panel-list"></ol>
        </aside>
    </div>

    <div class="globe-fallback" id="globe-fallback">
        <h2>전체 포스트 지도</h2>
        <p class="globe-fallback-note">지구본을 표시할 수 없는 환경입니다. 아래 목록으로 전체 포스트를 카테고리별로 탐색하세요.</p>
        {% assign cats = site.categories | sort %}
        {% for cat in cats %}
            {% assign cat_name = cat[0] %}
            {% assign cat_posts = cat[1] %}
            <section class="globe-fallback-cat">
                <h3 id="globe-cat-{{ cat_name | slugify }}">
                    <a href="{{ '/categories/' | append: cat_name | slugify | relative_url }}/">{{ cat_name }}</a>
                    <span class="globe-fallback-count">({{ cat_posts.size }})</span>
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
