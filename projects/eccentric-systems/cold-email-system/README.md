# Eccentric Systems - Cold Email Automation

AI-powered personalized cold email system using Claude Opus 4.

## Stack
- **Leads**: UseOtter.app API / Apollo.io / Manual CSV
- **Website Scraping**: Firecrawl API (or web_fetch fallback)
- **Email Generation**: Claude Opus 4 via Anthropic API
- **Sending**: Gmail SMTP / Google Apps Script

## Setup Required
1. Firecrawl API key (https://firecrawl.dev) - ~$0.004/page
2. Anthropic API key (already have via OpenClaw)
3. Gmail app password for SMTP

## Files
- `scrape_leads.py` - Fetch leads from UseOtter or CSV
- `scrape_websites.py` - Scrape company websites with Firecrawl
- `generate_emails.py` - Generate personalized emails with Claude
- `send_emails.py` - Send via Gmail SMTP
- `config.py` - API keys and settings
- `leads/` - Lead data storage
- `emails/` - Generated emails

## Usage
```bash
# 1. Get leads
python scrape_leads.py

# 2. Scrape websites  
python scrape_websites.py

# 3. Generate emails
python generate_emails.py

# 4. Review & send
python send_emails.py --dry-run  # Preview first
python send_emails.py            # Actually send
```
