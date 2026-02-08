#!/usr/bin/env python3
"""
Quick email generator - uses lead descriptions directly without website scraping.
"""

import json
import time
import os
from pathlib import Path

try:
    import anthropic
except ImportError:
    print("❌ Run: pip install anthropic")
    exit(1)

LEADS_DIR = Path(__file__).parent / "leads"
EMAILS_DIR = Path(__file__).parent / "emails"
EMAILS_DIR.mkdir(exist_ok=True)

# Config
SENDER_NAME = "Amanda"
COMPANY_NAME = "Eccentric Systems"
RESUME = """
I help agencies and consultancies implement AI to:
- Automate client reporting and save 10+ hours/week
- Build AI assistants for client communication
- Streamline repetitive tasks like data entry and follow-ups
- Create AI-powered content workflows

We work exclusively with service businesses who want to scale without adding headcount.
No long contracts, just results.
"""

PROMPT_TEMPLATE = """Write a short cold email (3-4 sentences max) from {sender} to {name} ({role}) at {company}.

About their company: {description}

What {sender} offers: {resume}

Rules:
- Reference something SPECIFIC about their business (their niche, the problems they likely face)
- Keep it under 4 sentences. Zero fluff.
- Sound human, not like a template
- Start with "Hey {first_name},"
- End asking if they'd be open to a quick 15-min chat
- Sign off with just "- {sender}"

Output ONLY the email body, nothing else."""


def generate_emails(limit: int = 5):
    """Generate personalized emails."""
    
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("❌ ANTHROPIC_API_KEY not set")
        return
    
    client = anthropic.Anthropic(api_key=api_key)
    
    # Load leads
    with open(LEADS_DIR / "leads.json") as f:
        leads = json.load(f)
    
    leads = leads[:limit]
    print(f"✉️  Generating {len(leads)} emails with Claude...\n")
    
    emails = []
    for i, lead in enumerate(leads):
        first_name = lead["name"].split()[0]
        
        prompt = PROMPT_TEMPLATE.format(
            sender=SENDER_NAME,
            name=lead["name"],
            role=lead["role"],
            company=lead["company"],
            description=lead.get("description", "a growing business"),
            resume=RESUME,
            first_name=first_name
        )
        
        try:
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=300,
                messages=[{"role": "user", "content": prompt}]
            )
            
            email_body = response.content[0].text.strip()
            
            emails.append({
                "to_email": lead["email"],
                "to_name": lead["name"],
                "company": lead["company"],
                "role": lead["role"],
                "subject": f"Quick question for {lead['company']}",
                "body": email_body,
            })
            
            print(f"[{i+1}/{len(leads)}] ✅ {lead['name']} @ {lead['company']}")
            
        except Exception as e:
            print(f"[{i+1}/{len(leads)}] ❌ {lead['name']}: {e}")
        
        time.sleep(0.5)
    
    # Save
    output_path = EMAILS_DIR / "generated_emails.json"
    with open(output_path, 'w') as f:
        json.dump(emails, f, indent=2)
    
    print(f"\n✅ Generated {len(emails)} emails → {output_path}")
    
    # Preview
    print("\n" + "="*60)
    print("📧 SAMPLE EMAILS:")
    print("="*60)
    
    for email in emails[:3]:
        print(f"\nTo: {email['to_name']} <{email['to_email']}>")
        print(f"Subject: {email['subject']}")
        print("-"*40)
        print(email['body'])
        print("-"*40)
    
    return emails


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=5)
    args = parser.parse_args()
    generate_emails(args.limit)
