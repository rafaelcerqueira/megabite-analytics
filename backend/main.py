from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from database import get_db, engine, Base
import models

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MegaBite Analytics API",
    description="API para plataforma de analytics de restaurantes",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], #Frontend com Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "MegaBite Analytics API",
        "status": "online",
        "version": "1.0.0"
    }
    
@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        db_execute("SELECT 1")
        return {
            "status": "healthy",
            "database": "connected",
            "redis": "pending" #a ser implementado
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
# Endpoint básico para exemplo
@app.get("/api/test-connection")
async def test_connection(db: Session = Depends(get_db)):
    try:
        result = db.execute("SELECT version(), current_timestamp")
        row = result.fetchone()
        return {
            "database_version": row[0],
            "server_time": row[1],
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Connection test faild: {str(e)}")
    
    
# rodar com: uvicorn main:app --reload --host 0.0.0.0 --port 8000

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("API_HOST", "0.0.0.0"),
        port=int(os.getenv("API_PORT", 8000)),
        reload=os.getenv("API_RELOAD", "True").lower() == "true"
    )