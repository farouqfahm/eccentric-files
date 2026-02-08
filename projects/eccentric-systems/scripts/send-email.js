const { chromium } = require('playwright');

const EMAIL_TO = 'kglrealtypro@gmail.com';
const EMAIL_CC = 'alfarouqfahm52@gmail.com';
const EMAIL_SUBJECT = "I Made Something For KGL Realty Pro — 60 Seconds of Your Time?";
const EMAIL_BODY = `Good evening,

I've been following KGL Realty Pro's work — your Lekki Phase 1 content is some of the best market analysis I've seen from any Lagos agency. The pricing guides, the buyer education, the UK/Dubai expansion for diaspora investors — you're building something serious.

But I noticed something.

Your blog is driving traffic. Your brand is strong. Yet when a diaspora buyer in London finds your "Lekki Phase 1 Property Prices 2026" article at 11pm Lagos time and sends a WhatsApp message... what happens?

If you're like most agencies, that lead waits until morning. By then, they've contacted three other agents.

I built a 60-second video specifically for KGL that shows how we could change that — instant responses, 24/7, that sound like your best agent wrote them.

📹 Watch it here: https://github.com/farouqfahm/eccentric-files/blob/master/projects/eccentric-systems/video-kgl/out/kgl-pitch.mp4

No pitch. No pressure. Just a quick look at what's possible.

If it resonates, I'd love 30 minutes to talk through what this could look like for KGL specifically — your WhatsApp flow, your inquiry volume, your team's time.

Either way, keep doing what you're doing. The market needs more agencies that actually educate buyers.

Best,
Amanda Hopkins
Eccentric Systems
amanda.hopkins.claw@gmail.com`;

const GMAIL_USER = 'amanda.hopkins.claw@gmail.com';
const GMAIL_PASS = 'AwuYaya@1965';

async function sendEmail() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('Navigating to Gmail...');
    await page.goto('https://mail.google.com/', { waitUntil: 'networkidle' });
    
    // Wait for email input
    console.log('Waiting for login form...');
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });
    
    // Enter email
    console.log('Entering email...');
    await page.fill('input[type="email"]', GMAIL_USER);
    await page.click('button:has-text("Next"), #identifierNext');
    
    // Wait for password field
    console.log('Waiting for password field...');
    await page.waitForSelector('input[type="password"]:visible', { timeout: 30000 });
    await page.waitForTimeout(1000);
    
    // Enter password
    console.log('Entering password...');
    await page.fill('input[type="password"]', GMAIL_PASS);
    await page.click('button:has-text("Next"), #passwordNext');
    
    // Wait for Gmail to load
    console.log('Waiting for Gmail inbox...');
    await page.waitForSelector('div[role="button"]:has-text("Compose"), [gh="cm"]', { timeout: 60000 });
    
    console.log('Gmail loaded! Composing email...');
    
    // Click Compose
    await page.click('div[role="button"]:has-text("Compose"), [gh="cm"]');
    await page.waitForTimeout(2000);
    
    // Fill in recipients
    console.log('Filling recipients...');
    await page.fill('input[aria-label="To recipients"], input[name="to"]', EMAIL_TO);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    // Add CC
    // Click CC link if visible
    const ccLink = page.locator('span:has-text("Cc")');
    if (await ccLink.isVisible()) {
      await ccLink.click();
      await page.waitForTimeout(500);
    }
    await page.fill('input[aria-label="Cc recipients"], input[name="cc"]', EMAIL_CC);
    await page.keyboard.press('Tab');
    
    // Fill subject
    console.log('Filling subject...');
    await page.fill('input[aria-label="Subject"], input[name="subjectbox"]', EMAIL_SUBJECT);
    
    // Fill body
    console.log('Filling body...');
    await page.fill('div[aria-label="Message Body"], div[role="textbox"]', EMAIL_BODY);
    
    // Send
    console.log('Sending email...');
    await page.click('div[aria-label="Send"]:has-text("Send"), [data-tooltip="Send"]');
    
    // Wait for sent confirmation
    await page.waitForTimeout(5000);
    
    console.log('✅ Email sent successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
    
    // Take screenshot for debugging
    await page.screenshot({ path: '/tmp/gmail-error.png' });
    console.log('Screenshot saved to /tmp/gmail-error.png');
    
  } finally {
    await browser.close();
  }
}

sendEmail();
