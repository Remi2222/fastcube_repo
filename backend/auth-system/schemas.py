from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Schémas pour l'inscription
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

# Schémas pour la connexion
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schémas pour les tokens
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Schémas pour la réponse utilisateur
class UserResponse(BaseModel):
    id: int
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    email_verified: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Schémas pour la vérification d'email
class EmailVerification(BaseModel):
    token: str

class EmailVerificationResponse(BaseModel):
    success: bool
    message: str

# Schémas pour les messages de réponse
class MessageResponse(BaseModel):
    message: str
    success: bool = True 