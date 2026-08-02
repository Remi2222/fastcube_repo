from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from decouple import config

# Configuration de la base de données
DATABASE_URL = config("DATABASE_URL", default="postgresql://username:password@localhost:5432/auth_db")

# Créer le moteur SQLAlchemy
engine = create_engine(DATABASE_URL)

# Créer la session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Créer la base pour les modèles
Base = declarative_base()

# Fonction pour obtenir la session de base de données
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 