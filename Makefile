.PHONY: init serve build clean help

help:
	@echo "Jekyll Wiki Commands:"
	@echo "  make init   - Install dependencies"
	@echo "  make serve  - Start development server"
	@echo "  make build  - Build the site"
	@echo "  make clean  - Clean generated files"

init:
	@if command -v rbenv > /dev/null 2>&1; then \
		eval "$$(rbenv init - bash)" && bundle install --path vendor/bundle; \
	else \
		bundle install --path vendor/bundle; \
	fi

serve:
	@./serve.sh

build:
	@if command -v rbenv > /dev/null 2>&1; then \
		eval "$$(rbenv init - bash)" && bundle exec jekyll build; \
	else \
		bundle exec jekyll build; \
	fi

clean:
	rm -rf _site .jekyll-cache
