---
layout: default
title: 태그 목록
permalink: /pages/tags.html
---

<div class="tags-page">
    <section class="tavern-band tavern-band--day" aria-label="전리품 태그 안내">
        <div class="tavern-band-media" aria-hidden="true"></div>
        <div class="tavern-band-scrim" aria-hidden="true"></div>
        <h2 class="tavern-band-title">전리품 진열대</h2>
        <p class="tavern-band-text">출정에서 거둔 전리품(태그)이 벽을 따라 걸려 있소. 마음에 드는 전리품을 골라, 그것이 깃든 전장들을 둘러보시오.</p>
        <p class="tavern-band-subtitle">Lok'tar ogar — 전리품에 영광을</p>
        <div class="axe-divider" aria-hidden="true"><span class="axe-cross"></span></div>
    </section>

    <header class="page-header">
        <h1>모든 태그</h1>
        <p>태그별로 포스트를 찾아보세요.</p>
    </header>

    <div class="tag-cloud">
        {% assign sorted_tags = site.tags | sort %}
        {% for tag in sorted_tags %}
            {% assign tag_name = tag[0] %}
            {% assign tag_posts = tag[1] %}
            <a href="{{ site.baseurl }}/tags/{{ tag_name | slugify }}/"
               class="tag-cloud-item"
               data-count="{{ tag_posts.size }}">
                {{ tag_name }}
                <span class="tag-count">({{ tag_posts.size }})</span>
            </a>
        {% endfor %}
    </div>

    <div class="tags-list">
        <h2>태그별 포스트</h2>
        {% assign sorted_tags = site.tags | sort %}
        {% for tag in sorted_tags %}
            {% assign tag_name = tag[0] %}
            {% assign tag_posts = tag[1] %}
            <div class="tag-section">
                <h3 id="tag-{{ tag_name | slugify }}">
                    <a href="{{ site.baseurl }}/tags/{{ tag_name | slugify }}/">{{ tag_name }}</a>
                    <span class="tag-count">({{ tag_posts.size }})</span>
                </h3>
                <ul class="post-list">
                    {% assign sorted_posts = tag_posts | sort: 'date' | reverse %}
                    {% for post in sorted_posts %}
                    <li>
                        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                        <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
                    </li>
                    {% endfor %}
                </ul>
            </div>
        {% endfor %}
    </div>
</div>
