# TOOLS.md - Local Notes

## Installed & Working

### YouTube (yt-dlp)
```bash
# Get video info
yt-dlp --dump-json "https://youtube.com/watch?v=VIDEO_ID"

# Get transcript/subtitles
yt-dlp --skip-download --write-auto-sub --sub-lang en --output "/tmp/%(id)s" "URL"

# Download audio only
yt-dlp -x --audio-format mp3 "URL"
```

### Browser (Playwright + Stagehand)
- Playwright installed with Chromium
- Stagehand CLI available via `@browserbasehq/stagehand`
- Can automate web browsing, form filling, scraping

### Web Fetch
- Works for most sites
- Cloudflare-protected sites may need browser automation

## Pending Setup

### Web Search (Brave API)
- Key: `BSATiEiVgqQrgem9WCz2E3nabICGGoj`
- Needs to be added to OpenClaw config:
  ```bash
  openclaw configure --section web
  ```

### YouTube Data API (optional, for search/channel info)
- Need Google API key from: https://console.cloud.google.com
- Enable "YouTube Data API v3"

---

## Skills Installed (ClawHub)

Location: `/data/home/.openclaw/workspace/skills/skills/`

- browser-automation
- stagehand-browser-cli  
- youtube-watcher
- youtube

---

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.
