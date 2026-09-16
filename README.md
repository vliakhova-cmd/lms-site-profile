# lms-site-profile — the site level

One site's screen: General Info, Site Personnel, Training Plans, and the
site-specific Delegated Tasks read from that site's signed DOA log.

```bash
npm install
npm run dev      # http://localhost:5177/?site=0982
```

**Live:** https://vliakhova-cmd.github.io/lms-site-profile/?site=0982

A site owns its signed log, its people, and what is mapped to it — and reads
the study's mapping rather than editing it, because which course qualifies
which duty is a study decision. Clicking a person's name opens the **user**
app; the crumbs and the panel's Study row go back to the **study** app.

## How the levels connect

A study, a site and a user are three apps in three repositories. Moving
between them is a navigation, not a route change — each level owns its data
and its URL:

| Level | Repository | Opened with |
| --- | --- | --- |
| Study | [lms-study-profile](https://github.com/vliakhova-cmd/lms-study-profile) | `?section=` |
| Site | [lms-site-profile](https://github.com/vliakhova-cmd/lms-site-profile) | `?site=<number>&section=` |
| User | [lms-user-profile](https://github.com/vliakhova-cmd/lms-user-profile) | `?site=<number>&user=<name>&section=` |

Two more apps sit beside them, linked the same way:
[doa-log](https://github.com/vliakhova-cmd/doa-log-report) holds the signed
DOA logs the tasks are read from, and
[ai-course-authoring-flow](https://github.com/vliakhova-cmd/ai-course-authoring-flow)
writes the courses.

`src/links.ts` is where every one of those URLs is built — dev-server ports
locally, sibling Pages sites once published.

## Conventions

- **Inline styles only.** No Tailwind, no CSS modules.
- **`src/tokens.ts` is the single source of DS values**, each entry commented
  with the Figma variable it comes from. Components read tokens, never literals.
- Components come from **DS Base 2.0** and **DS Advanced 2.0**.
- A DS `icon-size` token is the **container**; the glyph inside it is smaller
  (a 30px box holds a 20px glyph, a 20px box holds a 15px one).
