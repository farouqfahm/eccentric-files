#!/usr/bin/env python3
"""
Scrape company websites to get detailed info for personalization.
Uses Firecrawl API for clean markdown extraction.
"""

import json
import time
import requests
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

LEADS_DIR = Path(__file__).parent / "leads"


def scrape_with_firecrawl(url: str, api_key: str) -> dict:
    """
    Scrape a website using Firecrawl API.
    Returns clean markdown content.
    """
    endpoint = "https://api.firecrawl.dev/v1/scrape"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "url": url,
        "formats": ["markdown"],
        "onlyMainContent": True,  # Skip headers/footers
        "timeout": 30000
    }
    
    try:
        response = requests.post(endpoint, json=payload, headers=headers, timeout=60)
        response.raise_for_status()
        data = response.json()
        
        if data.get("success"):
            return {
                "url": url,
                "content": data.get("data", {}).get("markdown", ""),
                "title": data.get("data", {}).get("metadata", {}).get("title", ""),
                "description": data.get("data", {}).get("metadata", {}).get("description", ""),
                "success": True
            }
        else:
            return {"url": url, "content": "", "success": False, "error": data.get("error")}
    
    except Exception as e:
        return {"url": url, "content": "", "success": False, "error": str(e)}


def scrape_with_fallback(url: str) -> dict:
    """
    Free fallback using requests + basic extraction.
    Less clean than Firecrawl but free.
    """
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        from html.parser import HTMLParser
        
        class TextExtractor(HTMLParser):
            def __init__(self):
                super().__init__()
                self.text = []
                self.skip = False
                self.skip_tags = {'script', 'style', 'nav', 'footer', 'header'}
            
            def handle_starttag(self, tag, attrs):
                if tag in self.skip_tags:
                    self.skip = True
            
            def handle_endtag(self, tag):
                if tag in self.skip_tags:
                    self.skip = False
            
            def handle_data(self, data):
                if not self.skip:
                    text = data.strip()
                    if text and len(text) > 2:
                        self.text.append(text)
        
        parser = TextExtractor()
        parser.feed(response.text)
        content = " ".join(parser.text)
        
        # Extract title
        title = ""
        if "<title>" in response.text:
            start = response.text.find("<title>") + 7
            end = response.text.find("</title>")
            if end > start:
                title = response.text[start:end].strip()
        
        return {
            "url": url,
            "content": content[:10000],  # Limit size
            "title": title,
            "success": True,
            "method": "fallback"
        }
    
    except Exception as e:
        return {"url": url, "content": "", "success": False, "error": str(e)}


def scrape_all_websites(leads_file: str, api_key: str = None, max_workers: int = 5):
    """
    Scrape all company websites from leads file.
    Uses Firecrawl if API key provided, otherwise fallback.
    """
    leads_path = LEADS_DIR / leads_file
    with open(leads_path) as f:
        leads = json.load(f)
    
    # Get unique websites
    websites = {}
    for lead in leads:
        url = lead.get("website", "").strip()
        if url and url not in websites:
            if not url.startswith("http"):
                url = "https://" + url
            websites[url] = lead.get("company", "")
    
    print(f"🌐 Scraping {len(websites)} unique websites...")
    
    scraped_data = {}
    scrape_fn = lambda url: scrape_with_firecrawl(url, api_key) if api_key else scrape_with_fallback(url)
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(scrape_fn, url): url for url in websites}
        
        for i, future in enumerate(as_completed(futures)):
            url = futures[future]
            company = websites[url]
            
            try:
                result = future.result()
                scraped_data[url] = result
                
                status = "✅" if result.get("success") else "❌"
                print(f"  [{i+1}/{len(websites)}] {status} {company}")
                
            except Exception as e:
                scraped_data[url] = {"url": url, "success": False, "error": str(e)}
                print(f"  [{i+1}/{len(websites)}] ❌ {company}: {e}")
            
            time.sleep(0.5)  # Rate limiting
    
    # Save scraped data
    output_path = LEADS_DIR / "scraped_websites.json"
    with open(output_path, 'w') as f:
        json.dump(scraped_data, f, indent=2)
    
    success_count = sum(1 for d in scraped_data.values() if d.get("success"))
    print(f"\n✅ Scraped {success_count}/{len(websites)} websites successfully")
    print(f"📁 Saved to {output_path}")
    
    return scraped_data


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Scrape company websites")
    parser.add_argument("--leads", default="leads.json", help="Leads JSON file")
    parser.add_argument("--firecrawl-key", help="Firecrawl API key (optional, uses fallback if not provided)")
    parser.add_argument("--workers", type=int, default=3, help="Max concurrent requests")
    
    args = parser.parse_args()
    
    if not (LEADS_DIR / args.leads).exists():
        print(f"❌ Leads file not found: {LEADS_DIR / args.leads}")
        print("Run scrape_leads.py first")
        return
    
    scrape_all_websites(args.leads, args.firecrawl_key, args.workers)


if __name__ == "__main__":
    main()
