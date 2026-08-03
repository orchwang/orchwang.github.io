module Jekyll
  # Knowledge Graph — extract every internal `](/YYYY/MM/DD/...html)` link from each
  # post's raw markdown, keep only those that resolve to a real post URL in this
  # site, and inject the result as `post.data['outbound_links']`. Liquid templates
  # then expose it as `post.outbound_links` and graph.json emits it directly —
  # no extra data file, no client-side post fetching, no broken-link ghosts in
  # the graph. Run priority `:low` so site.posts is fully populated first.
  class GraphLinksGenerator < Generator
    safe true
    priority :low

    INTERNAL_LINK_RE = %r!\]\(/(\d{4}/\d{2}/\d{2}/[^\s)#"]+?\.html)(?:#[^\s)]*)?\)!.freeze

    def generate(site)
      url_set = {}
      site.posts.docs.each { |p| url_set[p.url] = true }

      base = site.baseurl.to_s
      total_resolved = 0

      site.posts.docs.each do |post|
        content = post.content.to_s
        seen = {}
        content.scan(INTERNAL_LINK_RE) do |m|
          raw = m[0]
          url = raw.start_with?('/') ? raw : "/#{raw}"
          url = base + url unless base.empty?
          next unless url_set.key?(url)
          seen[url] = true unless seen.key?(url)
        end
        post.data['outbound_links'] = seen.keys
        total_resolved += seen.size
      end

      Jekyll.logger.info "GraphLinks:", "injected #{total_resolved} resolved internal links across #{site.posts.docs.size} posts"
    end
  end
end
