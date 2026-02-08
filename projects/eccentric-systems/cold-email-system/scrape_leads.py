#!/usr/bin/env python3
"""
Scrape leads from various sources.
Supports: UseOtter.app API, CSV import, Apollo.io export
"""

import json
import csv
import requests
from pathlib import Path

LEADS_DIR = Path(__file__).parent / "leads"
LEADS_DIR.mkdir(exist_ok=True)


def fetch_from_useotter(api_key: str, auth_token: str) -> list:
    """
    Fetch startup leads from UseOtter.app
    Get your API key and auth token from browser dev tools while logged in.
    """
    url = "https://uitzqqugzhhvgvrgxjaw.supabase.co/rest/v1/startups"
    params = {
        "select": "*,startup_employees(*),startup_tags(tag)",
        "order": "created_at.desc"
    }
    headers = {
        "accept": "*/*",
        "accept-profile": "public",
        "apikey": api_key,
        "authorization": auth_token,
        "origin": "https://useotter.app",
        "referer": "https://useotter.app/",
    }
    
    response = requests.get(url, params=params, headers=headers)
    response.raise_for_status()
    
    startups = response.json()
    
    # Flatten to contacts
    contacts = []
    for startup in startups:
        company_info = {
            "company": startup.get("name", ""),
            "website": startup.get("website", ""),
            "description": startup.get("description", ""),
            "tags": [t.get("tag", "") for t in startup.get("startup_tags", [])],
        }
        
        for employee in startup.get("startup_employees", []):
            if employee.get("email"):
                contacts.append({
                    **company_info,
                    "name": employee.get("name", ""),
                    "role": employee.get("role", ""),
                    "email": employee.get("email", ""),
                })
    
    return contacts


def load_from_csv(csv_path: str) -> list:
    """
    Load leads from a CSV file.
    Expected columns: name, email, role, company, website, description
    """
    contacts = []
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            contacts.append({
                "name": row.get("name", row.get("Name", "")),
                "email": row.get("email", row.get("Email", "")),
                "role": row.get("role", row.get("Role", row.get("Title", ""))),
                "company": row.get("company", row.get("Company", "")),
                "website": row.get("website", row.get("Website", "")),
                "description": row.get("description", row.get("Description", "")),
                "tags": [],
            })
    return contacts


def load_from_apollo_export(csv_path: str) -> list:
    """
    Load leads from Apollo.io CSV export.
    Apollo exports have specific column names.
    """
    contacts = []
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            email = row.get("Email", row.get("Work Email", ""))
            if not email:
                continue
            
            contacts.append({
                "name": f"{row.get('First Name', '')} {row.get('Last Name', '')}".strip(),
                "email": email,
                "role": row.get("Title", ""),
                "company": row.get("Company", ""),
                "website": row.get("Website", row.get("Company Website", "")),
                "description": row.get("Company Description", ""),
                "tags": [row.get("Industry", "")] if row.get("Industry") else [],
            })
    return contacts


def save_leads(contacts: list, filename: str = "leads.json"):
    """Save leads to JSON file."""
    output_path = LEADS_DIR / filename
    with open(output_path, 'w') as f:
        json.dump(contacts, f, indent=2)
    print(f"✅ Saved {len(contacts)} leads to {output_path}")
    return output_path


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Scrape/import leads")
    parser.add_argument("--source", choices=["useotter", "csv", "apollo"], required=True)
    parser.add_argument("--file", help="CSV file path (for csv/apollo sources)")
    parser.add_argument("--api-key", help="UseOtter API key")
    parser.add_argument("--auth-token", help="UseOtter auth token")
    parser.add_argument("--output", default="leads.json", help="Output filename")
    
    args = parser.parse_args()
    
    if args.source == "useotter":
        if not args.api_key or not args.auth_token:
            print("❌ UseOtter requires --api-key and --auth-token")
            return
        contacts = fetch_from_useotter(args.api_key, args.auth_token)
    
    elif args.source == "csv":
        if not args.file:
            print("❌ CSV source requires --file")
            return
        contacts = load_from_csv(args.file)
    
    elif args.source == "apollo":
        if not args.file:
            print("❌ Apollo source requires --file")
            return
        contacts = load_from_apollo_export(args.file)
    
    # Filter out contacts without email
    contacts = [c for c in contacts if c.get("email")]
    
    save_leads(contacts, args.output)
    
    # Print sample
    if contacts:
        print(f"\n📧 Sample lead:")
        print(json.dumps(contacts[0], indent=2))


if __name__ == "__main__":
    main()
