module Jekyll
  class SeriesPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'series_page'
        dir = site.config['series_page_dir'] || 'series'

        # Collect all series from posts
        series_posts = {}
        site.posts.docs.each do |post|
          if post.data['series']
            series_name = post.data['series']
            series_posts[series_name] ||= []
            series_posts[series_name] << post
          end
        end

        # Generate a page for each series
        series_posts.each do |series_name, posts|
          series_slug = Utils.slugify(series_name)
          site.pages << SeriesPage.new(site, site.source, File.join(dir, series_slug), series_name, posts)
        end

        # Make series data available to site
        site.config['series'] = series_posts
      end
    end
  end

  class SeriesPage < Page
    def initialize(site, base, dir, series_name, posts)
      @site = site
      @base = base
      @dir  = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'series_page.html')
      self.data['series'] = series_name
      self.data['series_posts'] = posts
      self.data['title'] = "시리즈: #{series_name}"
    end
  end
end
