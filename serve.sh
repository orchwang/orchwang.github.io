#!/bin/bash
# Jekyll serve script with rbenv support

# Initialize rbenv
if command -v rbenv &> /dev/null; then
    eval "$(rbenv init - bash)"
fi

# Run Jekyll serve
bundle exec jekyll serve "$@"
