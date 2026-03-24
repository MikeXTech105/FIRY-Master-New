# FIRY Master (Enterprise-Hardened Baseline)

This repository contains a full-stack application:
- **Frontend:** React + TypeScript + Vite
- **Backend:** ASP.NET Core Web API + Dapper + SQL Server stored procedures

## Key enterprise improvements included

- JWT, CORS, SMTP, file-upload, and job scheduling moved to strongly-typed options with startup validation.
- Centralized global exception middleware for safer production error responses.
- Authorization enforced on non-auth controllers.
- Candidate resume upload hardened with extension/size validation and GUID-based storage names.
- Background email worker upgraded with structured logging, cancellation support, retry count updates, and SMTP configuration by settings.
- Frontend service layer upgraded with stronger TypeScript interfaces and cleaner API contracts.
- Removed plaintext production-style secrets from committed configuration and replaced with placeholders.

---

## Prerequisites

- Node.js 22+
- .NET SDK 10.0
- SQL Server with required schema and stored procedures

---

## Backend setup

1. Configure `backend/FIRYMaster.API/appsettings.json` (or environment overrides):
   - `ConnectionStrings:DefaultConnection`
   - `Jwt:Key` (strong random secret)
   - `Cors:AllowedOrigins`
   - `Smtp` settings

2. Run API:

```bash
cd backend/FIRYMaster.API
dotnet run
```

---

## Frontend setup

1. Set `frontend/.env`:

```bash
VITE_API_BASE_URL=https://localhost:5001/api
```

2. Run frontend:

```bash
cd frontend
npm install
npm run dev
```

---

## Database / Stored Procedure updates required

> Apply these SQL-side changes to align DB behavior with the hardened API.

1. **Ensure `EmailQueue.appRetryCount` exists and defaults to 0**
   - Background service now increments retry count on processing exceptions.

2. **Ensure stored procedures accept unchanged parameter names and sizes**
   - `sp_CreateCandidate`, `sp_UpdateCandidate`, `sp_AddEmails`, `sp_CreateEmailSettings`, etc.
   - API now validates max lengths before DB call; align SP parameter lengths to avoid truncation.

3. **Standardize auth SP output contract**
   - `sp_LoginUser` should reliably return `StatusCode`, `Message` columns always.

4. **(Recommended) Add server-side audit fields in tables**
   - `CreatedAtUtc`, `UpdatedAtUtc`, `CreatedBy`, `UpdatedBy` for enterprise auditability.

5. **(Recommended) Add uniqueness constraints**
   - Unique index on users email.
   - Optional unique key policy for roles where appropriate.

---

## Security recommendations for production

- Never commit secrets to source control.
- Use Azure Key Vault / AWS Secrets Manager / environment secrets.
- Rotate JWT keys and DB credentials regularly.
- Add refresh tokens and token revocation for advanced session control.
- Add structured central logging sink (e.g., Serilog + ELK / Application Insights).

---

## Build checks

### Frontend
```bash
npm --prefix frontend run build
```

### Backend
```bash
cd backend/FIRYMaster.API
dotnet build
```
