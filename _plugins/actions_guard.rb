# Registers a no-op Liquid tag used as a build guard.
#
# Why: while the repository's Pages source is "Deploy from a branch", every
# push triggers BOTH our Actions workflow (full build, custom plugins) AND the
# legacy "pages build and deployment" branch build. The legacy build ships the
# raw branch (.nojekyll) and nondeterministically overwrites the good deploy,
# breaking the live site with unprocessed front matter/Liquid.
#
# The legacy builder runs Jekyll in safe mode and never loads _plugins, so it
# cannot know this tag: parsing `pages/actions-build-guard.html` raises
# Liquid::SyntaxError there, the legacy build fails, and a failed build
# deploys nothing — only our Actions artifact ever reaches the live site.
# Our own build loads this plugin and renders the tag as empty output.
#
# This guard becomes unnecessary once Settings → Pages → Source is switched
# to "GitHub Actions" (which disables the legacy build entirely); it is
# harmless to keep either way.
module Jekyll
  class ActionsBuildGuardTag < Liquid::Tag
    def render(_context)
      ""
    end
  end
end

Liquid::Template.register_tag("actions_build_guard", Jekyll::ActionsBuildGuardTag)
