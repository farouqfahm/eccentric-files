#!/usr/bin/env python3
"""
All-in-one cold email campaign runner.
Run this to execute the full pipeline.
"""

import json
import time
from pathlib import Path

# Check dependencies
try:
    import anthropic
    import requests
except ImportError as e:
    print(f"❌ Missing dependency: {e}")
    print("Run: pip install anthropic requests")
    exit(1)

from config import ANTHROPIC_API_KEY, FIRECRAWL_API_KEY, GMAIL_ADDRESS, GMAIL_APP_PASSWORD
from config import RESUME, SENDER_NAME, COMPANY_NAME
from scrape_leads import load_from_csv, save_leads
from scrape_websites import scrape_all_websites
from generate_emails import generate_all_emails
from send_emails import send_all_emails

LEADS_DIR = Path(__file__).parent / "leads"


def run_full_campaign(csv_file: str = None, dry_run: bool = True, limit: int = 10):
    """
    Run the complete cold email campaign:
    1. Load leads from CSV
    2. Scrape company websites
    3. Generate personalized emails with Claude
    4. Send emails (or preview in dry-run)
    """
    
    print("="*60)
    print("🚀 ECCENTRIC SYSTEMS - AI Cold Email Campaign")
    print("="*60)
    
    # Step 1: Load leads
    print("\n📋 STEP 1: Loading leads...")
    
    if csv_file:
        contacts = load_from_csv(csv_file)
        save_leads(contacts, "leads.json")
    elif (LEADS_DIR / "leads.json").exists():
        with open(LEADS_DIR / "leads.json") as f:
            contacts = json.load(f)
        print(f"✅ Loaded {len(contacts)} existing leads")
    else:
        print("❌ No leads found. Provide a CSV file with --csv")
        return
    
    if limit:
        contacts = contacts[:limit]
        print(f"📊 Limited to {len(contacts)} leads")
    
    # Step 2: Scrape websites
    print("\n🌐 STEP 2: Scraping company websites...")
    
    if not (LEADS_DIR / "scraped_websites.json").exists():
        if FIRECRAWL_API_KEY:
            scrape_all_websites("leads.json", FIRECRAWL_API_KEY, max_workers=3)
        else:
            print("⚠️  No Firecrawl API key. Using free fallback scraper...")
            scrape_all_websites("leads.json", None, max_workers=2)
    else:
        print("✅ Using existing scraped website data")
    
    # Step 3: Generate emails
    print("\n✉️  STEP 3: Generating personalized emails with Claude...")
    
    if not ANTHROPIC_API_KEY:
        print("❌ ANTHROPIC_API_KEY not set in config.py")
        return
    
    generate_all_emails("leads.json", limit=limit)
    
    # Step 4: Send or preview
    print(f"\n📤 STEP 4: {'Previewing' if dry_run else 'Sending'} emails...")
    
    send_all_emails(dry_run=dry_run, limit=limit)
    
    print("\n" + "="*60)
    if dry_run:
        print("✅ Campaign preview complete!")
        print("Run with --send to actually send the emails")
    else:
        print("✅ Campaign complete!")
    print("="*60)


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Run cold email campaign")
    parser.add_argument("--csv", help="CSV file with leads (name,email,role,company,website)")
    parser.add_argument("--limit", type=int, default=10, help="Max emails to process (default: 10)")
    parser.add_argument("--send", action="store_true", help="Actually send emails (default is dry-run)")
    
    args = parser.parse_args()
    
    run_full_campaign(
        csv_file=args.csv,
        dry_run=not args.send,
        limit=args.limit
    )


if __name__ == "__main__":
    main()
