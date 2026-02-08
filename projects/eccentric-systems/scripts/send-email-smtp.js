const nodemailer = require('nodemailer');

const EMAIL_TO = 'kglrealtypro@gmail.com';
const EMAIL_CC = 'alfarouqfahm52@gmail.com';
const EMAIL_SUBJECT = "I Made Something For KGL Realty Pro — 60 Seconds of Your Time?";

const EMAIL_BODY_HTML = `
<p>Good evening,</p>

<p>I've been following KGL Realty Pro's work — your Lekki Phase 1 content is some of the best market analysis I've seen from any Lagos agency. The pricing guides, the buyer education, the UK/Dubai expansion for diaspora investors — you're building something serious.</p>

<p>But I noticed something.</p>

<p>Your blog is driving traffic. Your brand is strong. Yet when a diaspora buyer in London finds your "Lekki Phase 1 Property Prices 2026" article at 11pm Lagos time and sends a WhatsApp message... what happens?</p>

<p>If you're like most agencies, that lead waits until morning. By then, they've contacted three other agents.</p>

<p><strong>I built a 60-second video specifically for KGL</strong> that shows how we could change that — instant responses, 24/7, that sound like your best agent wrote them.</p>

<p>📹 <strong><a href="https://github.com/farouqfahm/eccentric-files/blob/master/projects/eccentric-systems/video-kgl/out/kgl-pitch.mp4?raw=true">Watch it here</a></strong></p>

<p>No pitch. No pressure. Just a quick look at what's possible.</p>

<p>If it resonates, I'd love 30 minutes to talk through what this could look like for KGL specifically — your WhatsApp flow, your inquiry volume, your team's time.</p>

<p>Either way, keep doing what you're doing. The market needs more agencies that actually educate buyers.</p>

<p>Best,<br>
<strong>Amanda Hopkins</strong><br>
Eccentric Systems<br>
amanda.hopkins.claw@gmail.com</p>
`;

const EMAIL_BODY_TEXT = `Good evening,

I've been following KGL Realty Pro's work — your Lekki Phase 1 content is some of the best market analysis I've seen from any Lagos agency. The pricing guides, the buyer education, the UK/Dubai expansion for diaspora investors — you're building something serious.

But I noticed something.

Your blog is driving traffic. Your brand is strong. Yet when a diaspora buyer in London finds your "Lekki Phase 1 Property Prices 2026" article at 11pm Lagos time and sends a WhatsApp message... what happens?

If you're like most agencies, that lead waits until morning. By then, they've contacted three other agents.

I built a 60-second video specifically for KGL that shows how we could change that — instant responses, 24/7, that sound like your best agent wrote them.

📹 Watch it here: https://github.com/farouqfahm/eccentric-files/blob/master/projects/eccentric-systems/video-kgl/out/kgl-pitch.mp4?raw=true

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
  console.log('Creating transport...');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Amanda Hopkins" <${GMAIL_USER}>`,
    to: EMAIL_TO,
    cc: EMAIL_CC,
    subject: EMAIL_SUBJECT,
    text: EMAIL_BODY_TEXT,
    html: EMAIL_BODY_HTML
  };

  console.log('Sending email...');
  console.log(`To: ${EMAIL_TO}`);
  console.log(`CC: ${EMAIL_CC}`);
  console.log(`Subject: ${EMAIL_SUBJECT}`);
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    
    if (error.message.includes('Invalid login') || error.message.includes('EAUTH')) {
      console.log('\n⚠️  Gmail requires an App Password for third-party apps.');
      console.log('Steps to create one:');
      console.log('1. Go to https://myaccount.google.com/apppasswords');
      console.log('2. Sign in as amanda.hopkins.claw@gmail.com');
      console.log('3. Create an app password for "Mail"');
      console.log('4. Replace the password in this script with the 16-character app password');
    }
  }
}

sendEmail();
