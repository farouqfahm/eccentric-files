"""
Configuration for cold email system.
"""
import os

# Anthropic (Claude) - Using OpenClaw's config
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

# Firecrawl - Optional, will use free fallback if not set
FIRECRAWL_API_KEY = ""

# Gmail SMTP settings - Leave empty to generate emails without sending
GMAIL_ADDRESS = ""
GMAIL_APP_PASSWORD = ""

# Your info (for the emails)
SENDER_NAME = "Amanda Hopkins"
SENDER_TITLE = "AI Solutions Partner"
COMPANY_NAME = "Eccentric Systems"

# Your pitch/value proposition
RESUME = """
Amanda Hopkins - AI Solutions Partner at Eccentric Systems

I help agencies and consultancies implement AI to:
- Automate client reporting (save 10+ hours/week)
- Build AI assistants for client communication and support
- Streamline repetitive tasks like data entry, scheduling, and follow-ups
- Create AI-powered content workflows

What makes us different:
- We're not selling software — we build custom solutions around YOUR workflow
- No long-term contracts, pay for results
- Hands-on implementation, not just strategy decks

We work exclusively with service businesses ($500K-$5M revenue) who want to scale without adding headcount.
"""

# Email settings
MAX_EMAILS_PER_DAY = 50
DELAY_BETWEEN_EMAILS = 30  # seconds
