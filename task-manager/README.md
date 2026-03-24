# Task Manager

## Stack
- **Backend**: Node.js + Express + TypeScript + Prisma + JWT + SQLite
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Testes**: Python + Pytest + Requests

## Setup

### Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Testes (Python)
```bash
cd tests_pytest
pip install -r requirements.txt
pytest
```

## Estrutura
```
task-manager/
├── backend/
│   ├── prisma/schema.prisma
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── lib/prisma.ts
│       ├── middlewares/auth.middleware.ts
│       ├── routes/         # auth.routes, task.routes
│       ├── controllers/    # auth.controller, task.controller
│       └── services/       # auth.service, task.service
├── frontend/
│   └── src/
│       ├── app/            # layout, page, globals.css
│       └── lib/api.ts
└── tests_pytest/
    ├── conftest.py
    ├── requirements.txt
    └── test_placeholder.py
```
