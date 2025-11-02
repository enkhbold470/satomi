# Satomi - Quick Start Guide

Get started with Satomi in 3 simple steps!

## Step 1: Set Up Your OpenAI API Key

Create a `.env.local` file in the project root:

```bash
echo "OPENAI_API_KEY=sk-proj-your-actual-api-key-here" > .env.local
```

Replace `sk-proj-your-actual-api-key-here` with your actual OpenAI API key from https://platform.openai.com/api-keys

## Step 2: Start the Development Server

```bash
pnpm dev
```

The server will start at `http://localhost:3000`

## Step 3: Test the API

Open a new terminal and run:

```bash
curl -X POST http://localhost:3000/api/japanese-concept \
  -H "Content-Type: application/json" \
  -d '{"query": "What is ikigai?"}'
```

You should get a detailed explanation of the Japanese concept "Ikigai"!

## What You Can Do

### 1. Explain Japanese Concepts

```bash
curl -X POST http://localhost:3000/api/japanese-concept \
  -H "Content-Type: application/json" \
  -d '{"query": "Explain wabi-sabi"}'
```

### 2. Process Content

```bash
curl -X POST http://localhost:3000/api/process-content \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is my content with [placeholder] text",
    "processType": "improve"
  }'
```

### 3. Validate Files

```bash
curl -X POST http://localhost:3000/api/validate-file \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "README.md",
    "content": "# My Project\n\nThis is a description."
  }'
```

## Next Steps

1. **Read the Documentation**: Check out `/docs` folder for detailed guides
2. **Explore Examples**: See `/examples` for Node.js and Python code samples
3. **Review Architecture**: Understand the system in `/docs/ARCHITECTURE.md`
4. **Deploy**: Follow `/docs/DEPLOYMENT.md` to deploy to production

## Need Help?

- **API Reference**: [docs/API.md](./docs/API.md)
- **Usage Examples**: [docs/USAGE.md](./docs/USAGE.md)
- **Development Rules**: [rules/README.md](./rules/README.md)

## Common Issues

### "Invalid API key"

Make sure your `.env.local` file exists and contains a valid OpenAI API key:
```bash
cat .env.local
# Should show: OPENAI_API_KEY=sk-proj-...
```

### Port 3000 already in use

Change the port:
```bash
PORT=3001 pnpm dev
```

### Connection refused

Make sure the dev server is running in another terminal:
```bash
pnpm dev
```

---

**That's it!** You're ready to start building with Satomi. 🎌

