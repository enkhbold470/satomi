# OMI Integration Quick Start

Get Satomi working with your OMI AI wearable in 5 minutes!

## What You Get

Ask your OMI device about Japanese concepts and get beautifully formatted responses:

**You**: "What is ikigai?"

**OMI (powered by Satomi)**:
```
🇯🇵 Ikigai (生き甲斐)

✨ Meaning:
Ikigai is a Japanese concept meaning "reason for being"...

📜 Origin:
The term originates from the island of Okinawa...

💡 How to Apply:
To discover your ikigai, reflect on what you love...
```

Perfect for building an audience around Japanese culture!

## Step 1: Deploy Satomi

### Option A: Vercel (Easiest)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
cd /Users/inky/Desktop/satomi
vercel --prod
```

Copy your deployment URL (e.g., `https://satomi.vercel.app`)

### Option B: ngrok (Testing)

```bash
# Terminal 1: Start Satomi
pnpm dev

# Terminal 2: Expose with ngrok
ngrok http 3000
```

Copy your ngrok URL (e.g., `https://abc123.ngrok.io`)

## Step 2: Create OMI App

1. Open **OMI mobile app**
2. Go to **"Explore" → "Create an App"**
3. Select **"Integration App"**
4. Fill in:
   - **Name**: Satomi - Japanese Concepts
   - **Description**: Beautifully explained Japanese concepts
   - **Webhook URL**: `https://your-domain.com/api/omi/webhook`
5. **Save** and **Enable** the app

## Step 3: Test It!

Speak to your OMI device:

- "What is ikigai?"
- "Explain wabi-sabi"
- "Tell me about kaizen"
- "What does kintsugi mean?"

You'll get instant, beautifully formatted explanations!

## Verify It's Working

### Test with curl

```bash
curl -X POST https://your-domain.com/api/omi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "What is ikigai?",
    "session_id": "test_123"
  }'
```

Should return a formatted Japanese concept explanation.

### Run Test Script

```bash
# Bash
./examples/test-omi-webhook.sh https://your-domain.com/api/omi/webhook

# Python
python examples/omi-python-test.py
```

## What You Can Ask

### Direct Concept Queries
- "What is ikigai?"
- "Explain wabi-sabi"
- "Tell me about kaizen"
- "Define kintsugi"
- "What does mono no aware mean?"

### General Questions
- "Tell me a Japanese concept"
- "Japanese philosophy about beauty"
- "What is omotenashi?"

### OMI Will Respond With:
✅ Concept name with Japanese characters  
✅ Clear meaning and explanation  
✅ Historical and cultural origin  
✅ Practical applications for daily life  
✅ Quotable wisdom perfect for sharing  

## Troubleshooting

### "App not responding"

**Check:**
1. Is Satomi deployed and running?
   ```bash
   curl https://your-domain.com/api/omi/webhook
   ```
2. Did you set `OPENAI_API_KEY` in production?
3. Is the webhook URL correct in OMI app?

### "Getting empty responses"

**Fix:**
1. Check OpenAI API key: `echo $OPENAI_API_KEY`
2. Verify deployment logs for errors
3. Test endpoint directly with curl

### "OpenAI rate limit"

**Solution:**
- Wait a few seconds between queries
- Upgrade OpenAI plan if needed
- Implement caching (see docs)

## Next Steps

### For Testing
1. Try different concepts (ikigai, wabi-sabi, kaizen)
2. Test conversation flow with follow-ups
3. Monitor logs for errors

### For Production
1. Set up monitoring (logs, analytics)
2. Implement caching for common queries
3. Add rate limiting per user
4. Submit app to OMI app store (optional)

### For Media Brand
1. Track most popular concepts
2. Save responses for content creation
3. Build email list from engaged users
4. Create blog posts from conversations
5. Generate social media content

## Business Model Ideas

### Free Tier (Current)
- Unlimited concept explanations
- Real-time conversational access
- Build audience

### Premium Features (Future)
- Daily concept subscriptions
- Deep-dive concept series
- Audio explanations
- Concept illustrations
- Learning paths and quizzes

### Monetization
- Ads in responses (later)
- Premium concepts library
- Sponsored content
- Affiliate links
- Newsletter subscriptions

## Quick Reference

**Webhook URL**: `https://your-domain.com/api/omi/webhook`

**Memory URL**: `https://your-domain.com/api/omi/memory`

**Health Check**: `GET https://your-domain.com/api/omi/webhook`

**Test Query**:
```bash
curl -X POST https://your-domain.com/api/omi/webhook \
  -H "Content-Type: application/json" \
  -d '{"transcript": "What is ikigai?"}'
```

## Documentation

- **Full OMI Guide**: [docs/OMI_INTEGRATION.md](./docs/OMI_INTEGRATION.md)
- **API Reference**: [docs/API.md](./docs/API.md)
- **Architecture**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **Deployment**: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## Support

- **OMI Docs**: https://docs.omi.me
- **Satomi Docs**: Check `/docs` folder
- **Issues**: Create GitHub issue

---

**You're ready!** 🎌 Start asking your OMI device about Japanese concepts and build your audience with beautifully explained cultural wisdom.

