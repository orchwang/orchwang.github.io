# GitHub Pages Setup with Custom Plugins

This document explains how to enable custom Jekyll plugins (like `career_duration` filter) on GitHub Pages using GitHub Actions.

## Problem

GitHub Pages runs Jekyll in `--safe` mode, which disables all custom plugins in the `_plugins/` directory. This causes:
- The `career_duration` filter shows raw date `2015-04-01` instead of calculated "10년 6개월"
- Other custom plugins won't work

## Solution

Use GitHub Actions to build the site with full plugin support.

## Setup Instructions

### 1. Enable GitHub Actions for Pages Deployment

**⚠️ IMPORTANT: This step must be done manually via GitHub web interface**

1. Go to your repository on GitHub: https://github.com/orchwang/orchwang.github.io
2. Click the **Settings** tab (top navigation)
3. In the left sidebar, click **Pages** (under "Code and automation")
4. Under **Build and deployment** section:
   - Find the **Source** dropdown
   - Change from: `Deploy from a branch`
   - Change to: `GitHub Actions`
5. Click **Save** (if there's a save button)

### 2. Verify Workflow File

The GitHub Actions workflow is already created at:
```
.github/workflows/jekyll.yml
```

This file:
- ✅ Runs on every push to `main` branch
- ✅ Builds Jekyll with custom plugins enabled
- ✅ Deploys to GitHub Pages automatically

### 3. Push Changes

After completing step 1, push this commit:

```bash
git add .github/
git commit -m "Add GitHub Actions workflow for Jekyll with custom plugins"
git push origin main
```

### 4. Monitor Deployment

1. Go to the **Actions** tab in your GitHub repository
2. You should see the "Deploy Jekyll site to Pages" workflow running
3. Wait for the green checkmark (usually takes 1-2 minutes)
4. Visit your site: https://orchwang.github.io/

### 5. Verify Fix

Visit your CV page: https://orchwang.github.io/pages/cv.html

Under "총 경력", you should now see:
- ✅ "10년 6개월" (calculated dynamically)
- ❌ NOT "2015-04-01" (raw date)

## How It Works

### Before (Standard GitHub Pages)
```
Push to GitHub → GitHub Pages (safe mode) → Custom plugins disabled → Shows "2015-04-01"
```

### After (GitHub Actions)
```
Push to GitHub → GitHub Actions builds → Custom plugins enabled → Shows "10년 6개월" → Deploys to Pages
```

## Benefits

- ✅ All custom Jekyll plugins work (`_plugins/` directory)
- ✅ Can use latest Jekyll version (not limited to GitHub Pages version)
- ✅ Automatic deployment on every push
- ✅ Full control over build process
- ✅ Free (GitHub Actions: 2000 minutes/month)

## Troubleshooting

### Workflow doesn't run
- Check if you changed Pages source to "GitHub Actions" in Settings
- Verify the workflow file is in `.github/workflows/jekyll.yml`
- Check the Actions tab for error messages

### Build fails
- Check Ruby version in `jekyll.yml` matches your `Gemfile` or `.ruby-version`
- Verify all gems are listed in `Gemfile`
- Check build logs in Actions tab

### Career duration still shows raw date
- Clear browser cache
- Check the GitHub Actions build completed successfully
- Verify the workflow ran after you changed Pages source setting

## References

- [Jekyll GitHub Actions Documentation](https://jekyllrb.com/docs/continuous-integration/github-actions/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Starter Workflows](https://github.com/actions/starter-workflows/blob/main/pages/jekyll.yml)

## Support

If you encounter issues:
1. Check the Actions tab for build errors
2. Review this setup guide
3. Verify all steps were completed in order
