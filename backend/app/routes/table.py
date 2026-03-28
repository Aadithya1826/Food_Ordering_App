from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models.table import Table
from ..schemas.table import TableCreate, TableResponse, TableUpdate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET all tables
@router.get("/api/v1/tables", response_model=list[TableResponse])
def get_tables(db: Session = Depends(get_db)):
    return db.query(Table).all()

# GET single table
@router.get("/api/v1/tables/{table_id}", response_model=TableResponse)
def get_table(table_id: int, db: Session = Depends(get_db)):
    table = db.query(Table).filter(Table.id == table_id).first()
    
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    
    return table

# POST create table
@router.post("/api/v1/tables", response_model=TableResponse)
def create_table(data: TableCreate, db: Session = Depends(get_db)):
    table = Table(**data.model_dump())
    db.add(table)
    db.commit()
    db.refresh(table)
    return table

# PATCH update table
@router.patch("/api/v1/tables/{table_id}", response_model=TableResponse)
def update_table(table_id: int, data: TableUpdate, db: Session = Depends(get_db)):
    table = db.query(Table).filter(Table.id == table_id).first()
    
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(table, key, value)
    
    db.commit()
    db.refresh(table)
    return table

# DELETE table
@router.delete("/api/v1/tables/{table_id}")
def delete_table(table_id: int, db: Session = Depends(get_db)):
    table = db.query(Table).filter(Table.id == table_id).first()
    
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    
    db.delete(table)
    db.commit()
    
    return {"message": "Table deleted successfully"}
