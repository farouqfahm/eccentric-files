#!/usr/bin/env python3
"""
Send generated emails via Gmail SMTP.
Includes rate limiting, logging, and dry-run mode.
"""

import json
import time
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from datetime import datetime

from config import (
    GMAIL_ADDRESS, GMAIL_APP_PASSWORD,
    SENDER_NAME, COMPANY_NAME,
    MAX_EMAILS_PER_DAY, DELAY_BETWEEN_EMAILS
)

EMAILS_DIR = Path(__file__).parent / "emails"
LOGS_DIR = Path(__file__).parent / "logs"
LOGS_DIR.mkdir(exist_ok=True)


def create_email_message(to_email: str, to_name: str, subject: str, body: str) -> MIMEMultipart:
    """Create an email message."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{SENDER_NAME} <{GMAIL_ADDRESS}>"
    msg["To"] = f"{to_name} <{to_email}>"
    
    # Plain text version
    msg.attach(MIMEText(body, "plain"))
    
    # HTML version (simple formatting)
    html_body = body.replace("\n", "<br>")
    html = f"""
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #333;">
        {html_body}
      </body>
    </html>
    """
    msg.attach(MIMEText(html, "html"))
    
    return msg


def send_email(smtp_server: smtplib.SMTP_SSL, to_email: str, to_name: str, subject: str, body: str) -> dict:
    """Send a single email."""
    try:
        msg = create_email_message(to_email, to_name, subject, body)
        smtp_server.sendmail(GMAIL_ADDRESS, to_email, msg.as_string())
        return {"success": True, "to": to_email}
    except Exception as e:
        return {"success": False, "to": to_email, "error": str(e)}


def send_all_emails(dry_run: bool = False, limit: int = None):
    """Send all generated emails."""
    
    # Load generated emails
    emails_path = EMAILS_DIR / "generated_emails.json"
    if not emails_path.exists():
        print("❌ No generated emails found. Run generate_emails.py first.")
        return
    
    with open(emails_path) as f:
        emails = json.load(f)
    
    # Filter to only successfully generated emails
    emails = [e for e in emails if e.get("generated")]
    
    if limit:
        emails = emails[:limit]
    
    if len(emails) > MAX_EMAILS_PER_DAY:
        print(f"⚠️  Limiting to {MAX_EMAILS_PER_DAY} emails (daily limit)")
        emails = emails[:MAX_EMAILS_PER_DAY]
    
    print(f"📧 {'[DRY RUN] ' if dry_run else ''}Sending {len(emails)} emails...")
    
    if dry_run:
        # Just preview emails
        for i, email in enumerate(emails):
            print(f"\n{'='*50}")
            print(f"[{i+1}] To: {email['to_name']} <{email['to_email']}>")
            print(f"    Company: {email['company']}")
            print(f"    Subject: {email['subject']}")
            print("-"*50)
            print(email['body'])
        
        print(f"\n{'='*50}")
        print(f"✅ Dry run complete. {len(emails)} emails ready to send.")
        print("Run without --dry-run to actually send.")
        return
    
    # Validate config
    if not GMAIL_ADDRESS or not GMAIL_APP_PASSWORD:
        print("❌ Set GMAIL_ADDRESS and GMAIL_APP_PASSWORD in config.py")
        print("Get app password at: https://myaccount.google.com/apppasswords")
        return
    
    # Connect to Gmail SMTP
    context = ssl.create_default_context()
    
    results = []
    log_entries = []
    
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
            print("✅ Connected to Gmail SMTP")
            
            for i, email in enumerate(emails):
                result = send_email(
                    server,
                    email["to_email"],
                    email["to_name"],
                    email["subject"],
                    email["body"]
                )
                results.append(result)
                
                status = "✅" if result["success"] else "❌"
                print(f"  [{i+1}/{len(emails)}] {status} {email['to_name']} @ {email['company']}")
                
                log_entries.append({
                    "timestamp": datetime.now().isoformat(),
                    "to_email": email["to_email"],
                    "to_name": email["to_name"],
                    "company": email["company"],
                    "subject": email["subject"],
                    **result
                })
                
                if i < len(emails) - 1:
                    time.sleep(DELAY_BETWEEN_EMAILS)
    
    except smtplib.SMTPAuthenticationError:
        print("❌ Gmail authentication failed.")
        print("Make sure you're using an App Password, not your regular password.")
        print("Generate one at: https://myaccount.google.com/apppasswords")
        return
    
    # Save send log
    log_path = LOGS_DIR / f"send_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(log_path, 'w') as f:
        json.dump(log_entries, f, indent=2)
    
    success_count = sum(1 for r in results if r.get("success"))
    print(f"\n✅ Sent {success_count}/{len(emails)} emails successfully")
    print(f"📁 Log saved to {log_path}")


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Send generated cold emails")
    parser.add_argument("--dry-run", action="store_true", help="Preview emails without sending")
    parser.add_argument("--limit", type=int, help="Limit number of emails to send")
    
    args = parser.parse_args()
    
    send_all_emails(dry_run=args.dry_run, limit=args.limit)


if __name__ == "__main__":
    main()
