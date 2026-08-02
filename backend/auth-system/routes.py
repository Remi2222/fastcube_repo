from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserRegister, UserLogin, Token, UserResponse, MessageResponse
from auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    create_verification_token,
    verify_verification_token,
    get_current_user,
    get_current_verified_user
)
from email_service import send_verification_email, send_welcome_email
from typing import Optional

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=MessageResponse)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Inscription d'un nouvel utilisateur"""
    
    # Vérifier si l'email existe déjà
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un utilisateur avec cet email existe déjà"
        )
    
    # Créer le nouvel utilisateur
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email_verified=False,
        is_active=True
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Créer le token de vérification
        verification_token = create_verification_token(user_data.email)
        
        # Envoyer l'email de vérification
        email_sent = await send_verification_email(
            user_data.email, 
            verification_token, 
            user_data.first_name
        )
        
        if not email_sent:
            # Si l'email n'a pas pu être envoyé, supprimer l'utilisateur
            db.delete(new_user)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erreur lors de l'envoi de l'email de vérification"
            )
        
        return MessageResponse(
            message="Inscription réussie ! Veuillez vérifier votre email pour activer votre compte.",
            success=True
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'inscription: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Connexion d'un utilisateur"""
    
    # Vérifier si l'utilisateur existe
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )
    
    # Vérifier le mot de passe
    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )
    
    # Vérifier si l'utilisateur est actif
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Compte désactivé"
        )
    
    # Vérifier si l'email est vérifié
    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email non vérifié. Veuillez vérifier votre email avant de vous connecter."
        )
    
    # Créer le token d'accès
    access_token = create_access_token(data={"sub": user.email})
    
    return Token(access_token=access_token, token_type="bearer")

@router.get("/verify-email", response_model=MessageResponse)
async def verify_email(token: str, db: Session = Depends(get_db)):
    """Vérifier l'email d'un utilisateur"""
    
    try:
        # Vérifier le token
        email = verify_verification_token(token)
        
        # Trouver l'utilisateur
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Utilisateur non trouvé"
            )
        
        # Vérifier si l'email est déjà vérifié
        if user.email_verified:
            return MessageResponse(
                message="Votre email est déjà vérifié !",
                success=True
            )
        
        # Marquer l'email comme vérifié
        user.email_verified = True
        db.commit()
        
        # Envoyer un email de bienvenue
        await send_welcome_email(user.email, user.first_name)
        
        return MessageResponse(
            message="Email vérifié avec succès ! Vous pouvez maintenant vous connecter.",
            success=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erreur lors de la vérification: {str(e)}"
        )

@router.post("/resend-verification", response_model=MessageResponse)
async def resend_verification_email(email: str, db: Session = Depends(get_db)):
    """Renvoyer l'email de vérification"""
    
    # Trouver l'utilisateur
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    # Vérifier si l'email est déjà vérifié
    if user.email_verified:
        return MessageResponse(
            message="Votre email est déjà vérifié !",
            success=True
        )
    
    # Créer un nouveau token de vérification
    verification_token = create_verification_token(user.email)
    
    # Envoyer l'email de vérification
    email_sent = await send_verification_email(
        user.email, 
        verification_token, 
        user.first_name
    )
    
    if not email_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de l'envoi de l'email de vérification"
        )
    
    return MessageResponse(
        message="Email de vérification renvoyé avec succès !",
        success=True
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Obtenir les informations de l'utilisateur connecté"""
    return current_user

@router.get("/me/verified", response_model=UserResponse)
async def get_current_verified_user_info(current_user: User = Depends(get_current_verified_user)):
    """Obtenir les informations de l'utilisateur connecté avec email vérifié"""
    return current_user

@router.post("/logout", response_model=MessageResponse)
async def logout():
    """Déconnexion (côté client)"""
    return MessageResponse(
        message="Déconnexion réussie",
        success=True
    ) 