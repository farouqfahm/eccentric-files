#!/usr/bin/env node
const { AgentMailClient } = require('agentmail');

const API_KEY = process.env.AGENTMAIL_API_KEY || 'am_13bac28e18f915dec7d9c900d1557415ca5f4ac65c6b61ca6de3b969d2b8b228';
const INBOX = 'amanda.claw@agentmail.to';

const client = new AgentMailClient({ apiKey: API_KEY });

const [,, command, ...args] = process.argv;

async function main() {
  try {
    switch (command) {
      case 'inbox':
      case 'list': {
        const response = await client.inboxes.messages.list(INBOX);
        if (!response.messages?.length) {
          console.log('📭 No messages.');
          return;
        }
        for (const m of response.messages) {
          console.log(`---`);
          console.log(`ID: ${m.messageId}`);
          console.log(`From: ${m.from}`);
          console.log(`To: ${m.to?.join(', ')}`);
          console.log(`Subject: ${m.subject}`);
          console.log(`Date: ${m.timestamp || m.createdAt}`);
          if (m.preview) console.log(`Preview: ${m.preview.slice(0, 100)}...`);
        }
        console.log(`\n📬 ${response.count} message(s)`);
        break;
      }
      
      case 'read': {
        const messageId = args[0];
        if (!messageId) {
          console.error('Usage: agentmail read <messageId>');
          process.exit(1);
        }
        const msg = await client.inboxes.messages.get(INBOX, messageId);
        console.log('From:', msg.from);
        console.log('To:', msg.to?.join(', '));
        console.log('Subject:', msg.subject);
        console.log('Date:', msg.timestamp || msg.createdAt);
        console.log('---');
        console.log(msg.text || msg.html);
        break;
      }
      
      case 'send': {
        // Usage: agentmail send "to@email.com" "Subject" "Body text"
        const [to, subject, ...bodyParts] = args;
        const text = bodyParts.join(' ');
        if (!to || !subject || !text) {
          console.error('Usage: agentmail send "to@email.com" "Subject" "Body text"');
          process.exit(1);
        }
        const result = await client.inboxes.messages.send(INBOX, {
          to: [to],
          subject,
          text
        });
        console.log('✅ Sent! Message ID:', result.messageId);
        break;
      }
      
      case 'threads': {
        const response = await client.inboxes.threads.list(INBOX);
        if (!response.threads?.length) {
          console.log('📭 No threads.');
          return;
        }
        for (const t of response.threads) {
          console.log(`---`);
          console.log(`Thread: ${t.threadId}`);
          console.log(`Subject: ${t.subject}`);
          console.log(`Messages: ${t.messageCount}`);
          if (t.preview) console.log(`Preview: ${t.preview.slice(0, 80)}...`);
        }
        console.log(`\n📬 ${response.count} thread(s)`);
        break;
      }
      
      default:
        console.log(`📧 AgentMail CLI - Inbox: ${INBOX}`);
        console.log('');
        console.log('Commands:');
        console.log('  list                    - List all messages');
        console.log('  read <messageId>        - Read a specific message');
        console.log('  send "to" "subj" "body" - Send an email');
        console.log('  threads                 - List email threads');
    }
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

main();
