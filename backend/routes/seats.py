from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models import Seat, User
from backend.schemas import SeatResponse
from backend.dependencies import require_admin

router = APIRouter(prefix="/api/seats", tags=["Seats"])

@router.get("", response_model=List[SeatResponse])
def get_all_seats(db: Session = Depends(get_db)):
    return db.query(Seat).all()

@router.put("/admin/{seat_id}/status")
def update_seat(seat_id: int, payload: dict, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    seat = db.query(Seat).filter(Seat.id == seat_id).first()
    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found.")

    if "status" in payload:
        seat.status = payload["status"]
    if "assigned_student_id" in payload:
        seat.assigned_student_id = payload["assigned_student_id"]

    db.commit()
    return {"message": "Seat updated", "seat": seat}
