#!/usr/bin/env python3
"""
Generate personalized cold emails using Claude Opus 4.
Each email references specific info from the company's website.
"""

import json
import time
from pathlib import Path

try:
    import anthropic
except ImportError:
    print("❌ Run: pip install anthropic")
    exit(1)

from config import ANTHROPIC_API_KEY, RESUME, SENDER_NAME, COMPANY_NAME

LEADS_DIR = Path(__file__).parent / "leads"
EMAILS_DIR = Path(__file__).parent / "emails"
EMAILS_DIR.mkdir(exist_ok=True)


EMAIL_PROMPT_TEMPLATE = """Write a short cold email (max 4-5 sentences) from {sender_name} at {company_name} to {contact_name} ({contact_role}) at {contact_company}.

Company info scraped from their website:
{scraped_content}

About {sender_name} and {company_name}:
{resume}

Rules:
- Reference something SPECIFIC about their company from the scraped data (product, customers, recent news, tech stack, etc.)
- Connect our AI services to a SPECIFIC problem they likely have based on their business
- Keep it under 5 sentences. No fluff, no filler words
- Sound like a real human, not a template or AI
- Don't be salesy or use buzzwords
- Start with "Hey {first_name}," (casual tone)
- End with a soft CTA asking if they'd be open to a quick chat
- Sign off with just "- {sender_name}"

Output ONLY the email body, nothing else."""


def generate_email(client: anthropic.Anthropic, contact: dict, scraped_content: str) -> str:
    """Generate a single personalized email."""
    
    first_name = contact["name"].split()[0] if contact["name"] else "there"
    
    prompt = EMAIL_PROMPT_TEMPLATE.format(
        sender_name=SENDER_NAME,
        company_name=COMPANY_NAME,
        contact_name=contact["name"],
        contact_role=contact["role"],
        contact_company=contact["company"],
        scraped_content=scraped_content[:3000],  # Limit context
        resume=RESUME,
        first_name=first_name
    )
    
    response = client.messages.create(
        model="claude-sonnet-4-20250514",  # Fast + cheap, upgrade to opus for better quality
        max_tokens=400,
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.content[0].text.strip()


def generate_all_emails(leads_file: str = "leads.json", limit: int = None):
    """Generate emails for all leads."""
    
    if not ANTHROPIC_API_KEY:
        print("❌ Set ANTHROPIC_API_KEY in config.py")
        return
    
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    
    # Load leads
    leads_path = LEADS_DIR / leads_file
    with open(leads_path) as f:
        leads = json.load(f)
    
    # Load scraped website data
    scraped_path = LEADS_DIR / "scraped_websites.json"
    if scraped_path.exists():
        with open(scraped_path) as f:
            scraped_data = json.load(f)
    else:
        scraped_data = {}
        print("⚠️  No scraped website data found. Emails will be less personalized.")
    
    if limit:
        leads = leads[:limit]
    
    print(f"✉️  Generating {len(leads)} personalized emails...")
    
    emails = []
    for i, contact in enumerate(leads):
        # Get scraped content for this company
        website = contact.get("website", "")
        if not website.startswith("http"):
            website = "https://" + website
        
        site_data = scraped_data.get(website, {})
        scraped_content = site_data.get("content", "")
        
        # Fallback to description if no scraped content
        if not scraped_content:
            scraped_content = contact.get("description", "No company info available.")
        
        try:
            email_body = generate_email(client, contact, scraped_content)
            
            emails.append({
                "to_email": contact["email"],
                "to_name": contact["name"],
                "company": contact["company"],
                "role": contact["role"],
                "subject": f"Quick question about {contact['company']}",
                "body": email_body,
                "generated": True
            })
            
            print(f"  [{i+1}/{len(leads)}] ✅ {contact['name']} @ {contact['company']}")
            
        except Exception as e:
            print(f"  [{i+1}/{len(leads)}] ❌ {contact['name']}: {e}")
            emails.append({
                "to_email": contact["email"],
                "to_name": contact["name"],
                "company": contact["company"],
                "error": str(e),
                "generated": False
            })
        
        time.sleep(0.5)  # Rate limiting
    
    # Save generated emails
    output_path = EMAILS_DIR / "generated_emails.json"
    with open(output_path, 'w') as f:
        json.dump(emails, f, indent=2)
    
    success_count = sum(1 for e in emails if e.get("generated"))
    print(f"\n✅ Generated {success_count}/{len(leads)} emails")
    print(f"📁 Saved to {output_path}")
    
    # Print a sample
    if emails and emails[0].get("generated"):
        print("\n" + "="*50)
        print("📧 SAMPLE EMAIL:")
        print("="*50)
        sample = emails[0]
        print(f"To: {sample['to_name']} <{sample['to_email']}>")
        print(f"Subject: {sample['subject']}")
        print("-"*50)
        print(sample['body'])
        print("="*50)
    
    return emails


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Generate personalized cold emails")
    parser.add_argument("--leads", default="leads.json", help="Leads JSON file")
    parser.add_argument("--limit", type=int, help="Limit number of emails to generate")
    
    args = parser.parse_args()
    
    if not (LEADS_DIR / args.leads).exists():
        print(f"❌ Leads file not found: {LEADS_DIR / args.leads}")
        return
    
    generate_all_emails(args.leads, args.limit)


if __name__ == "__main__":
    main()
