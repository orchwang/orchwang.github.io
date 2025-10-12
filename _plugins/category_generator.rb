module Jekyll
  class CategoryPageGenerator < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'category_page'
        dir = site.config['category_page_dir'] || 'categories'
        site.categories.each_key do |category|
          site.pages << CategoryPage.new(site, site.source, File.join(dir, category), category)
        end
      end
    end
  end

  class CategoryPage < Page
    def initialize(site, base, dir, category)
      @site = site
      @base = base
      @dir  = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'category_page.html')
      self.data['category'] = category
      self.data['title'] = "카테고리: #{category}"
    end
  end
end
