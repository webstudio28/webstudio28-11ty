# WebStudio28 (Eleventy)

Static site migrated from Django. Built with Eleventy 3, Nunjucks, and Tailwind CSS 3.

## Development

```bash
cd "D:/personal projects/webstudio28"
npm install
npm start
```

Opens at http://localhost:8080 with Tailwind watch + Eleventy live reload.

## Production build

```bash
npm run build
```

Output: `_site/`

## Pages

| URL | Source |
|-----|--------|
| `/` | `src/index.njk` |
| `/about/` | `src/about.njk` |
| `/pricing/` | `src/pricing.njk` |
| `/contacts/` | `src/contacts.njk` |
| `/contacts/message-sent-successfully/` | `src/contacts/message-sent-successfully.njk` |

See `D:/Projects/webstudio28/migration.md` for full migration notes and deploy checklist.
