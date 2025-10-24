module Jekyll
  class TagPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'tag_page'
        dir = site.config['tag_page_dir'] || 'tags'
        site.tags.each_key do |tag|
          # Use slugified (lowercased) directory name to match link generation
          tag_slug = Utils.slugify(tag)
          site.pages << TagPage.new(site, site.source, File.join(dir, tag_slug), tag)
        end
      end
    end
  end

  class TagPage < Page
    def initialize(site, base, dir, tag)
      @site = site
      @base = base
      @dir  = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag_page.html')
      self.data['tag'] = tag
      self.data['title'] = "태그: #{tag}"
    end
  end
end
