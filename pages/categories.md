---
layout: default
title: 카테고리 목록
permalink: /pages/categories.html
---

<div class="categories-page">
    <header class="page-header">
        <h1>카테고리 트리</h1>
        <p>계층적으로 구조화된 카테고리별 포스트를 찾아보세요.</p>
    </header>

    {% comment %} Build category tree structure {% endcomment %}
    {% assign parent_categories = "" | split: "" %}

    {% comment %} Collect all parent categories {% endcomment %}
    {% for post in site.posts %}
        {% if post.categories %}
            {% if post.categories.size > 1 %}
                {% assign parent = post.categories[0] %}
                {% unless parent_categories contains parent %}
                    {% assign parent_categories = parent_categories | push: parent %}
                {% endunless %}
            {% endif %}
        {% endif %}
    {% endfor %}

    <div class="category-tree">
        {% assign sorted_categories = site.categories | sort %}

        {% comment %} First, render hierarchical categories (those with children) {% endcomment %}
        {% for parent in parent_categories %}
            <div class="tree-node parent-node" data-parent="{{ parent }}">
                <div class="tree-node-header" onclick="toggleNode(this)">
                    <span class="tree-chevron">▼</span>
                    <span class="tree-icon">📁</span>
                    <span class="tree-label">{{ parent }}</span>
                </div>
                <div class="tree-children">
                    {% comment %} Find child categories {% endcomment %}
                    {% for category in sorted_categories %}
                        {% assign category_name = category[0] %}
                        {% assign category_posts = category[1] %}

                        {% comment %} Check if this is a child of current parent {% endcomment %}
                        {% assign is_child = false %}
                        {% for post in category_posts %}
                            {% if post.categories.size > 1 %}
                                {% if post.categories[0] == parent and post.categories[1] == category_name %}
                                    {% assign is_child = true %}
                                    {% break %}
                                {% endif %}
                            {% endif %}
                        {% endfor %}

                        {% if is_child %}
                        <div class="tree-node leaf-node">
                            <div class="tree-node-header" onclick="toggleNode(this)">
                                <span class="tree-chevron">▼</span>
                                <span class="tree-icon">📄</span>
                                <a href="{{ site.baseurl }}/categories/{{ category_name | slugify }}/" class="tree-label">{{ category_name }}</a>
                                <span class="tree-count">({{ category_posts.size }}개 포스트)</span>
                            </div>
                            <ul class="tree-posts">
                                {% assign sorted_posts = category_posts | sort: 'date' %}
                                {% for post in sorted_posts %}
                                <li>
                                    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                                    <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
                                </li>
                                {% endfor %}
                            </ul>
                        </div>
                        {% endif %}
                    {% endfor %}
                </div>
            </div>
        {% endfor %}

        {% comment %} Then, render standalone categories (those without parent) {% endcomment %}
        {% for category in sorted_categories %}
            {% assign category_name = category[0] %}
            {% assign category_posts = category[1] %}

            {% comment %} Check if this is a standalone category {% endcomment %}
            {% assign is_standalone = true %}
            {% for post in category_posts %}
                {% if post.categories.size > 1 %}
                    {% assign is_standalone = false %}
                    {% break %}
                {% endif %}
            {% endfor %}

            {% if is_standalone %}
            <div class="tree-node standalone-node">
                <div class="tree-node-header" onclick="toggleNode(this)">
                    <span class="tree-chevron">▼</span>
                    <span class="tree-icon">📄</span>
                    <a href="{{ site.baseurl }}/categories/{{ category_name | slugify }}/" class="tree-label">{{ category_name }}</a>
                    <span class="tree-count">({{ category_posts.size }}개 포스트)</span>
                </div>
                <ul class="tree-posts">
                    {% assign sorted_posts = category_posts | sort: 'date' %}
                    {% for post in sorted_posts %}
                    <li>
                        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                        <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
                    </li>
                    {% endfor %}
                </ul>
            </div>
            {% endif %}
        {% endfor %}
    </div>
</div>
