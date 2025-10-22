#!/bin/bash
# Jekyll serve script with rbenv support and automatic process cleanup

set -e

# Initialize rbenv
if command -v rbenv &> /dev/null; then
    eval "$(rbenv init - bash)"
fi

echo "🔍 Checking for running Jekyll servers..."

# Find Jekyll processes (both bundle exec jekyll and jekyll serve)
JEKYLL_PIDS=$(ps aux | grep -E '[j]ekyll serve|[b]undle exec jekyll' | awk '{print $2}')

if [ -n "$JEKYLL_PIDS" ]; then
    echo "⚠️  Found running Jekyll server(s) with PID(s): $JEKYLL_PIDS"
    echo "🔪 Killing existing Jekyll processes..."

    for PID in $JEKYLL_PIDS; do
        kill -9 "$PID" 2>/dev/null && echo "   ✓ Killed process $PID" || echo "   ✗ Failed to kill process $PID"
    done

    # Wait a moment for processes to terminate
    sleep 1
else
    echo "✓ No running Jekyll servers found"
fi

echo ""
echo "🚀 Starting Jekyll server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run Jekyll serve
bundle exec jekyll serve "$@"
