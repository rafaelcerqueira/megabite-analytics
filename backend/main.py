from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
import os
from dotenv import load_dotenv

from database import get_db, engine, Base
import models

# Carregar variáveis de ambiente
load_dotenv()

# Criar tabelas no banco (em produção usaríamos Alembic)
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully")
except Exception as e:
    print(f"⚠️ Could not create tables: {e}")

# Inicializar FastAPI
app = FastAPI(
    title="MegaBite Analytics API",
    description="API para plataforma de analytics de restaurantes",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/")
async def root():
    return {
        "message": "MegaBite Analytics API", 
        "status": "online",
        "version": "1.0.0"
    }

# Health check do banco
@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        # Testar conexão com o banco
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "redis": "pending"  # Vamos implementar depois
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Endpoint básico de exemplo
@app.get("/api/test-connection")
async def test_connection(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT version(), current_timestamp"))
        row = result.fetchone()
        return {
            "database_version": row[0],
            "server_time": row[1],
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Connection test failed: {str(e)}")

# Endpoint básico de analytics
@app.get("/api/analytics/sales-summary")
async def sales_summary(db: Session = Depends(get_db)):
    try:
        # Query básica para testar
        result = db.execute(text("""
            SELECT 
                COUNT(*) as total_sales,
                COALESCE(SUM(total_amount), 0) as total_revenue,
                COALESCE(AVG(total_amount), 0) as avg_ticket
            FROM sales
            WHERE sale_status_desc = 'COMPLETED'
        """))
        row = result.fetchone()
        
        return {
            "total_sales": row[0] if row else 0,
            "total_revenue": float(row[1]) if row else 0,
            "avg_ticket": float(row[2]) if row and row[2] else 0,
            "data_available": row[0] > 0 if row else False
        }
    except Exception as e:
        # Se a tabela sales não existir ainda
        return {
            "total_sales": 0,
            "total_revenue": 0,
            "avg_ticket": 0,
            "data_available": False,
            "message": "Waiting for data generation"
        }

# Endpoint para explorar os dados gerados
@app.get("/api/analytics/data-overview")
async def data_overview(db: Session = Depends(get_db)):
    try:
        # Estatísticas gerais
        result = db.execute(text("""
            SELECT 
                (SELECT COUNT(*) FROM stores) as total_stores,
                (SELECT COUNT(*) FROM products) as total_products,
                (SELECT COUNT(*) FROM customers) as total_customers,
                (SELECT COUNT(*) FROM sales) as total_sales,
                (SELECT COUNT(*) FROM channels) as total_channels
        """))
        stats = result.fetchone()
        
        # Vendas por canal
        channel_sales = db.execute(text("""
            SELECT c.name, COUNT(s.id) as sales_count, SUM(s.total_amount) as total_revenue
            FROM sales s
            JOIN channels c ON s.channel_id = c.id
            WHERE s.sale_status_desc = 'COMPLETED'
            GROUP BY c.name
            ORDER BY total_revenue DESC
        """)).fetchall()
        
        # Top produtos
        top_products = db.execute(text("""
            SELECT p.name, COUNT(ps.id) as sales_count, SUM(ps.total_price) as total_revenue
            FROM product_sales ps
            JOIN products p ON ps.product_id = p.id
            GROUP BY p.name
            ORDER BY total_revenue DESC
            LIMIT 10
        """)).fetchall()
        
        return {
            "overview": {
                "stores": stats[0],
                "products": stats[1],
                "customers": stats[2],
                "sales": stats[3],
                "channels": stats[4]
            },
            "sales_by_channel": [
                {"channel": row[0], "sales_count": row[1], "total_revenue": float(row[2]) if row[2] else 0}
                for row in channel_sales
            ],
            "top_products": [
                {"product": row[0], "sales_count": row[1], "total_revenue": float(row[2]) if row[2] else 0}
                for row in top_products
            ]
        }
        
    except Exception as e:
        return {"error": str(e), "message": "Aguardando geração completa dos dados"}

# Rodar com: uvicorn main:app --reload --host 0.0.0.0 --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("API_HOST", "0.0.0.0"),
        port=int(os.getenv("API_PORT", 8000)),
        reload=os.getenv("API_RELOAD", "True").lower() == "true"
    )

#Tendência de vendas ao longo do tempo
@app.get("/api/analytics/sales-trend")
async def sales_trend(
    db: Session = Depends(get_db),
    period: str = "30d",
    channel_id: int = None
):
    try:
        if period == "7d":
            date_filter = "INTERVAL '7 days'"
            group_by = "DATE(s.created_at)"
        elif period == "90d":
            date_filter = "INTERVAL '90 days'"
            group_by = "DATE(s.created_at)"
        else:
            date_filter = "INTERVAL '30 days'"
            group_by = "DATE(s.created_at)"
        
        # query base
        query = f"""
            SELECT
                {group_by} as date,
                COUNT(*) as sales_count,
                SUM(s.total_amount) as total_revenue,
                AVG(s.total_amount) as avg_ticket
            FROM sales s
            WHERE s.created_at >= NOW() - {date_filter}
                AND s.sale_status_desc = 'COMPLETED'
        """
        
        if channel_id:
            query += f" AND s.channel_id = {channel_id}"
            
        query += f" GROUP BY {group_by} ORDER BY date"
        
        result = db.execute(text(query))
        rows = result.fetchall()
        
        trend_data = []
        for row in rows:
            trend_data.append({
                "date": row[0].strftime("%Y-%m-%d"),
                "sales": row[1],
                "revenue": float(row[2]) if row[2] else 0,
                "avg_ticket": float(row[3]) if row[3] else 0,
                
            })
            
        return {
            "period": period,
            "channel_id": channel_id,
            "data": trend_data,
            "total_days": len(trend_data),
            "total_sales": sum(item["sales"] for item in trend_data),
            "total_revenue": sum(item["revenue"] for item in trend_data)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sales trend: {str(e)}")
