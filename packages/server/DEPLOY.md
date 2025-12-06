# Quick Deploy Instructions

## Deploy Server to Vercel

Run these commands from the `packages/server` directory:

```bash
# 1. Login to Vercel (if not already logged in)
vercel login

# 2. Deploy (first time - follow prompts)
vercel

# 3. Add environment variables
vercel env add DATABASE_URL
vercel env add HUGGINGFACE_API_KEY

# 4. Deploy to production
vercel --prod
```

## After Deployment

1. **Note your API URL** - Vercel will show it (e.g., `https://your-project.vercel.app`)
2. **Test the API**:
   ```bash
   curl https://your-project.vercel.app/api/health
   ```
   Should return: `{"ok":true}`

3. **Check logs** in Vercel Dashboard if there are any issues

