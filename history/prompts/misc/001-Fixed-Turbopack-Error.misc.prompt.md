---
id: "001"
title: "Fixed Turbopack Error"
stage: "misc"
date: "2026-01-08"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "006-dashboard-ui-ux-overhaul"
user: "aliayousuf"
command: "manual"
labels: ["nextjs", "turbopack", "dependency", "bugfix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "/frontend/next.config.ts"
tests: []
---

# Fixed Turbopack Error in Next.js Development

## Problem
Encountered a fatal Turbopack error when running `npm run dev`:
```
TurbopackInternalError: inner_of_uppers_lost_follower is not able to remove follower TaskId 16 (ProjectContainer::entrypoints) from TaskId 18 (EntrypointsOperation::new) as they don't exist as upper or follower edges
```

Additionally, there was a warning about multiple lockfiles causing confusion about the workspace root.

## Solution Applied

### 1. Identified Root Causes
- Multiple package-lock.json files in the project (root and frontend directories)
- Corrupted/incomplete node_modules installation
- Turbopack instability causing the internal error

### 2. Fixed the Issue
- Updated `next.config.ts` to properly disable experimental features that were causing warnings
- Ran `npm install` to properly reinstall dependencies
- Used regular Next.js dev server without problematic Turbopack experimental features

### 3. Configuration Changes
Modified `/frontend/next.config.ts` to remove invalid experimental turbo configuration.

## Outcome
- Next.js dev server now starts successfully
- No more Turbopack internal errors
- Server runs on http://localhost:3000 (or available port)

## Files Modified
- `/frontend/next.config.ts` - Removed invalid experimental turbo flag

## Recommendation
Consider removing one of the duplicate package-lock.json files to eliminate the multiple lockfiles warning in the future.

## Reflection
The issue was caused by a combination of dependency problems and unstable Turbopack experimental features. Reinstalling dependencies and avoiding problematic experimental features resolved the issue.