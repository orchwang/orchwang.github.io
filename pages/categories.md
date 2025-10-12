---
layout: default
title: 카테고리 목록
permalink: /pages/categories.html
---

<div class="categories-page">
    <header class="page-header">
        <h1>모든 카테고리</h1>
        <p>카테고리별로 포스트를 찾아보세요.</p>
    </header>

    <div class="category-cloud">
        {% assign sorted_categories = site.categories | sort %}
        {% for category in sorted_categories %}
            {% assign category_name = category[0] %}
            {% assign category_posts = category[1] %}
            <a href="{{ site.baseurl }}/categories/{{ category_name | slugify }}/"
               class="category-cloud-item"
               data-count="{{ category_posts.size }}">
                {{ category_name }}
                <span class="category-count">({{ category_posts.size }})</span>
            </a>
        {% endfor %}
    </div>

    <div class="categories-list">
        <h2>카테고리별 포스트</h2>
        {% assign sorted_categories = site.categories | sort %}
        {% for category in sorted_categories %}
            {% assign category_name = category[0] %}
            {% assign category_posts = category[1] %}
            <div class="category-section">
                <h3 id="category-{{ category_name | slugify }}">
                    <a href="{{ site.baseurl }}/categories/{{ category_name | slugify }}/">{{ category_name }}</a>
                    <span class="category-count">({{ category_posts.size }})</span>
                </h3>
                <ul class="post-list">
                    {% assign sorted_posts = category_posts | sort: 'date' | reverse %}
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
