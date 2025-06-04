# Git History Creation Instructions

## What This Does
This script will create 63 backdated git commits (June 4-24, 2025) that will appear in your GitHub contribution graph.

## Steps to Run

### 1. Run the PowerShell Script
```powershell
.\create_git_history.ps1
```

### 2. The script will:
- ✅ Create a backup branch (`backup-before-history-rewrite`)
- ✅ Create 63 commits with proper dates and messages
- ✅ Ask for confirmation before replacing main branch

### 3. Push to GitHub
After the script completes, run:
```bash
git push origin main --force
```

## Important Notes

⚠️ **This will rewrite your git history!**
- Your current commits will be replaced
- A backup branch is created automatically
- You must use `--force` push to update GitHub

## If Something Goes Wrong

Restore from backup:
```bash
git checkout backup-before-history-rewrite
git branch -D main
git checkout -b main
```

## Verify Commits

Check your commit history:
```bash
git log --oneline --graph --all
```

Check commits by date:
```bash
git log --after="2025-06-04" --before="2025-06-25" --oneline
```

## After Pushing

1. Visit your GitHub repository
2. Check the "Insights" → "Contributors" graph
3. Your contribution graph should show activity from June 4-24, 2025

## Configuration

- **Author Name**: Mohanraj111789
- **Email**: kit27.am30@gmail.com
- **Date Range**: June 4-24, 2025
- **Total Commits**: 63 (2-3 per day)
