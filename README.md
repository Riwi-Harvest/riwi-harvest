# Riwi Dashboard — Admin (Root README)

A minimal root README for the Riwi Dashboard (Administrator version).
This file describes the project purpose, high-level setup, and how the code aligns with the requirements specification.

> Note: Each application/package in this repository maintains its **own README**. Use those for per-app commands and configuration. This root README does **not** go into monorepo package details.

---

## Overview

The Riwi Dashboard centralizes academic performance, attendance visibility, and reporting for administrators and coordinators. The project addresses the lack of a unified tool and supports adoption and KPI goals defined in the Requirements Engineering document.

### Scope (what this repo exists to deliver)
- Administrator dashboard with coder profile and performance views
- Academic performance visualization
- Attendance/absence history with reasons
- Global reports by location, clan, and module

---

## Alignment with requirements

- **FR001 – Academic Performance Panel**: Consolidated performance results for Admin/Coordinator.
- **FR002 – Grade Histogram**: Visualize progress across modules.
- **FR003 – Coder profiel**: View for coder with their performance
- **FR004 – Global Reports**: Performance filter by coder, location, clan, shift and module.

### Non-functional targets
- **Performance**: Report loading ≤ 5 seconds
- **Availability**: 99% uptime
- **Privacy**: Anonymized data in global reports where applicable

### Data sources (high level)
- **Origin**: Moodle and attendance records
- **Recommended cadence**: Daily synchronization; reconcile missing or duplicate data

---

## Getting started (root-level)

> Root-level setup only. For running individual apps and services, refer to their **own READMEs** inside the repository.

### Prerequisites
- **Node.js** (current LTS or newer)
- **PNPM** (workspace-aware package manager)

Install PNPM if needed:
```bash
npm i -g pnpm
```

### Install dependencies
From the repository root:
```bash
pnpm install
```

> If any subproject has additional steps (env files, database connection, etc.), follow the instructions in that subproject’s README.

---

## Development workflow (high level)

- Use this root README to understand **purpose** and **requirements alignment**.
- Use each application/package README for:
  - Local run commands
  - Environment variables
  - Build steps
  - Testing instructions

## Tecnologies

- Web Scrapping with database normalizer (Hipatia)
- SQL with API REST
- SPA with PowerBI enveloped
  
---

## Autors

- Cristian Camilo Agudelo Foronda. Lovelace (Crismiau)
- Diego Alexander Vallejo Zapata. Hopper (ingediego94)
- Miguel Angel Angarita Jaramillo. Hopper (Farag0n)
- Sergio Alejandro Cortes Galindo. Hopper (sergiocortes-dll)
- Ximena Guerrero Villa. Lovelave (xguerrerov0903)

---

## Documents

- [Tecnhnical document](H3_DocumentoTecnico.pdf)
- [Component diagram](docs/Component_Diagram.png)
- [Flow diagram](docs/Flow-diagram.pdf)
- [Requirement enginering](docs/Requirements-enginering.pdf)
- [Entity relation diagram](docs/ERD.png)
- [Visual prototype](docs/Visual-prototype1.png)
- Roadmap
  - [Backend](docs/1.Roadmap.png)
  - [Frontend](docs/2.Roadmap.png)

## Tecnologies

- [Web Scrapping with database normalizer (Hipatia)](apps/hipatia/)
- [SQL with API REST](apps/database/)
- [SPA with PowerBI enveloped](apps/web/)
---

## License

MIT©

