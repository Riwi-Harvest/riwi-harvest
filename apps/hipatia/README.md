# Hipatia — Moodle Harvester (Node.js / Puppeteer)

This folder contains a **Node.js** scraper that harvests academic data from **Moodle** and normalizes for SQL Databases.

It walks Moodle’s structure **from institutions → cohorts → shifts → categories → courses → modules → tasks**, enriches it with **clans** and **roles**, reads a **Custom Report** to build **coders (students)** with **course progress & total grade**, and then visits each **coder → assigned courses → tasks** to capture **per‑task grades**.

---

## Tech stack

- **Runtime:** Node.js (ES Modules)
- **Automation & parsing:** Puppeteer, Cheerio
- **Package manager:** pnpm (works with npm/yarn)

**Typical files & folders**
- `src/index.js` — main orchestrator.
- `src/scrapers/` — individual scrapers (locations, cohorts, shifts, reports, users, courses, grades, tasks).
- `src/utils/` — helpers (browser/login, HTML table parsing, grade parser, task↔module linker, type classifier, CSV, etc.).

---

## What it collects

1. **Institutions → Cohorts → Shifts → Categories**
2. **Courses** — name, short name, dates, category.
3. **Modules** — in‑course units
4. **Tasks** — activities
5. **Clans** and **Roles**
6. **Coders (students)** — identity & profile.
7. **Course assignments (coder ↔ course)** — **progress %** and **total grade** from the Custom Report.
8. **Task grades (coder ↔ task)** — **grade**, **feedback**, **type**, **grade timestamp**.

---
## Output

The program generates CSV files.

---

## Requirements

- Node.js **22+**
- pnpm **10.14.0** or npm **11.5.2**
- puppeteer chrome browser

---

## Setup

```bash
# 1) Install deps
pnpm install
```

---

## Configuration

Create a `.env` file:

```
MOODLE_BASE_URL=https://<your-moodle-host>
MOODLE_USER=<username>
MOODLE_PASS=<password>

# Report Builder IDs (if applicable)
MOODLE_CLANS_REPORT_ID=<report_id_for_clans>
MOODLE_CODERS_REPORT_ID=<report_id_for_coders>

```
---

## Custom reports

Create custom reports in moodle for the creation of clans and coders according to the following strucutures:

- [Coder custom report](docs/get_coder_report_structure.pdf)
- [Clan custom report](docs/get_clan_report_structure.pdf)


---


## Run

Using **pnpm**:

```bash
pnpm start            # runs: node src/index.js
```

Using **npm**:

```bash
npm start             # or: node src/index.js
```

---

## MIT License

Copyright 2025 Sergio Cortes

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
