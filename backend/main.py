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
    
# Endpoint para explorar os dados gerados
@app.get("/api/analytics/data-overview")
async def data_overview(db: Session = Depends(get_db)):
    try:
        #estatísticas gerais:
        result = db.execute("""
            SELECT
                (SELECT COUNT(*) FROM stores) as total_stores,
                (SELECT COUNT(*) FROM products) as total_products,
                (SELECT COUNT(*) FROM customers) as total_customers,
                (SELECT COUNT(*) FROM sales) as total_sales,
                (SELECT COUNT(*) FROM channels) as total_channels,                               
        """)
        stats = result.fetchone()
    
        #vendas por canal
        channel_sales = db.execute("""
           SELECT c.name, COUNT(s.id) as sales_count, SUM(s.total_amount) as total_revenue FROM sales s
           JOIN channels c ON s.channel_id = c.id
           WHERE s.sale_status_desc = 'COMPLETED'
           GROUP BY c.name
           ORDER BY total_revenue DESC                                                          
        """).fetchall()
        
        #top produtos:
        top_products = db.execute("""
            SELECT p.name, COUNT(ps.id) as sales_count, SUM(ps.total_price) as total_revenue
            FROM products_sales ps
            JOIN products p ON ps.product_id = p.id
            GROUP BY p.name
            ORDER BY total_revenue DESC
            LIMIT 10
        
        """).fetchall()
        
        return {
            "overview": {
                "stores": stats[0],
                "products": stats[1],
                "customers": stats[2],
                "sales": stats[3],
                "channels": stats[4]
            },
            "sales_by_channel": [
                {"channels": row[0], "sales_count": row[1], "total_revenue": float(row[2]) if row[2] else 0}
                for row in channel_sales
            ],
            "top_products": [
                {"product": row[0], "sales_count": row[1], "total_revenue": float(row[2]) if row[2] else 0}
                for row in top_products
            ]
        }
        
    except Exception as e:
        return {"error": str(e), "message": "Aguardando geração completa dos dados"}