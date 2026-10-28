module Jekyll
  # Generates the chronological "all posts" archive: /posts/, /posts/page/2/, ...
  # (newest first). jekyll-paginate only paginates index.html, so this is a
  # small dedicated generator in the same style as the tag/category/series ones.
  class PostsArchiveGenerator < Generator
    safe true
    priority :low

    def generate(site)
      return unless site.layouts.key? 'posts_page'

      dir = site.config['posts_page_dir'] || 'posts'
      per_page = (site.config['posts_per_page'] || 20).to_i
      posts = site.posts.docs.reverse
      total_pages = [(posts.size.to_f / per_page).ceil, 1].max

      (1..total_pages).each do |num|
        page_dir = num == 1 ? dir : File.join(dir, 'page', num.to_s)
        slice = posts[(num - 1) * per_page, per_page] || []
        site.pages << PostsArchivePage.new(site, site.source, page_dir, dir, num, total_pages, slice, posts.size, per_page)
      end
    end
  end

  class PostsArchivePage < Page
    def initialize(site, base, dir, root_dir, num, total_pages, posts, total_posts, per_page)
      @site = site
      @base = base
      @dir  = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'posts_page.html')

      url_for = ->(n) { n == 1 ? "/#{root_dir}/" : "/#{root_dir}/page/#{n}/" }

      self.data['title'] = num == 1 ? '모든 포스트' : "모든 포스트 (#{num}쪽)"
      self.data['paginator'] = {
        'page' => num,
        'total_pages' => total_pages,
        'total_posts' => total_posts,
        'first_index' => (num - 1) * per_page + 1,
        'last_index' => (num - 1) * per_page + posts.size,
        'posts' => posts,
        'previous_url' => num > 1 ? url_for.call(num - 1) : nil,
        'next_url' => num < total_pages ? url_for.call(num + 1) : nil,
        'links' => page_links(num, total_pages).map do |n|
          n.nil? ? { 'gap' => true } : { 'num' => n, 'url' => url_for.call(n), 'current' => n == num }
        end
      }
    end

    private

    # First, last, and a window of two around the current page; nil marks a gap (…).
    def page_links(current, total)
      shown = ([1, total] + ((current - 2)..(current + 2)).to_a).select { |n| n.between?(1, total) }.uniq.sort
      shown.each_with_index.flat_map do |n, i|
        i > 0 && n - shown[i - 1] > 1 ? [nil, n] : [n]
      end
    end
  end
end
