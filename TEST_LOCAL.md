# Testing SEO Locally

## Step 1: Build and serve static files

```bash
npm run serve:dist
```

This will:
1. Build the project (`npm run build`)
2. Start a local HTTP server on port 8080 serving the `dist` folder

## Step 2: Test SEO (in another terminal)

```bash
npm run test:seo
```

This will:
1. Fetch `http://localhost:8080/` (homepage)
2. Fetch `http://localhost:8080/tools/` (Tools page)
3. Verify meta tags match expected values

## Step 3: Manual verification

Open in browser:
- `http://localhost:8080/` - Should show homepage title/description
- `http://localhost:8080/tools/` - Should show Tools page title/description

View page source (Ctrl+U) to verify:
- Homepage: `<title>Free Developer Tools - Conversion & Formatting</title>`
- Tools: `<title>Free Online Developer Tools - 20+ Tools</title>`

## Expected Results

✅ Homepage: "Free Developer Tools - Conversion & Formatting"
✅ Tools: "Free Online Developer Tools - 20+ Tools"

If tests pass locally, they should work on GitHub Pages too!
