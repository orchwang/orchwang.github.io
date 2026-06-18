---
layout: default
title: 시리즈 목록
permalink: /pages/series.html
---

<div class="series-page">
    <section class="tavern-band tavern-band--day" aria-label="학습 여관 안내">
        <div class="tavern-band-media" aria-hidden="true"></div>
        <div class="tavern-band-scrim" aria-hidden="true"></div>
        <h2 class="tavern-band-title">여기는 학습 여관</h2>
        <p class="tavern-band-text">한 길로 이어진 전장들의 묶음 — 원정(시리즈). 떠날 원정 선정.</p>
        <p class="tavern-band-subtitle">Lok'tar ogar — 배우는 자에게 영광을</p>
        <div class="axe-divider" aria-hidden="true"><span class="axe-cross"></span></div>
    </section>

    <header class="page-header">
        <h1>모든 시리즈</h1>
        <p>시리즈별로 연관된 포스트를 찾아보세요.</p>
    </header>

    {% comment %} Collect all series from posts {% endcomment %}
    {% assign all_series = "" | split: "" %}
    {% for post in site.posts %}
        {% if post.series %}
            {% unless all_series contains post.series %}
                {% assign all_series = all_series | push: post.series %}
            {% endunless %}
        {% endif %}
    {% endfor %}

    {% if all_series.size > 0 %}
    <div class="series-list">
        {% for series_name in all_series %}
            {% comment %} Collect posts for this series {% endcomment %}
            {% assign series_posts = site.posts | where: "series", series_name | sort: 'date' %}
            <div class="series-section">
                <h2 id="series-{{ series_name | slugify }}">
                    <a href="{{ site.baseurl }}/series/{{ series_name | slugify }}/">📖 {{ series_name }}</a>
                    <span class="series-count">({{ series_posts.size }}개 포스트)</span>
                </h2>
                <ul class="post-list">
                    {% for post in series_posts %}
                    <li>
                        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                        <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
                    </li>
                    {% endfor %}
                </ul>
            </div>
        {% endfor %}
    </div>
    {% else %}
    <div class="empty-state">
        <p>아직 생성된 시리즈가 없습니다.</p>
        <p>포스트의 front matter에 <code>series</code> 필드를 추가하여 시리즈를 만들 수 있습니다.</p>
    </div>
    {% endif %}
</div>
