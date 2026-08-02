from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from routes import router as auth_router
from decouple import config
import uvicorn

# Créer les tables
Base.metadata.create_all(bind=engine)

# Créer l'application FastAPI
app = FastAPI(
    title="Auth API avec vérification email",
    description="API d'authentification avec vérification d'email obligatoire",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes d'authentification
app.include_router(auth_router)

# Route racine
@app.get("/")
async def root():
    return {
        "message": "Auth API avec vérification email",
        "version": "1.0.0",
        "endpoints": {
            "register": "POST /auth/register",
            "login": "POST /auth/login",
            "verify_email": "GET /auth/verify-email?token=...",
            "resend_verification": "POST /auth/resend-verification",
            "me": "GET /auth/me",
            "me_verified": "GET /auth/me/verified",
            "logout": "POST /auth/logout"
        }
    }

# Route de santé
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API fonctionnelle"}

# Gestion des erreurs globales
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "success": False,
        "message": exc.detail,
        "status_code": exc.status_code
    }

if __name__ == "__main__":
    port = int(config("PORT", default=8000))
    host = config("HOST", default="0.0.0.0")
    debug = config("DEBUG", default=True, cast=bool)
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    ) 