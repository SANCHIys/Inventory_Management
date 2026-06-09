# Inventory Management System

## Tech Stack
- **Frontend**: Next.js 14, TypeScript
- **Backend**: FastAPI, SQLAlchemy
- **Database**: PostgreSQL
- **Auth**: JWT (python-jose, bcrypt)

## Live Demo
- Frontend: 
- Backend API: inventorymanagement-production-81ba.up.railway.app

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # fill in values
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local   # fill in NEXT_PUBLIC_API_URL
npm run dev
```

## Environment Variables
See `.env.example` files in each folder.