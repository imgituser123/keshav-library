from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from backend.database import get_db
from backend.models import MonthlyFee, StudentProfile, User
from backend.schemas import FeeResponse
from backend.services.whatsapp import send_whatsapp_reminder
from backend.services.notifications import create_notification
from backend.dependencies import require_admin, get_current_user

router = APIRouter(prefix="/api/fees", tags=["Fees"])

@router.get("/student/{student_id}", response_model=List[FeeResponse])
def get_student_fees(student_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(MonthlyFee).filter(MonthlyFee.student_id == student_id).all()

@router.get("/admin", response_model=List[FeeResponse])
def get_admin_fees(month: str = "October", year: int = 2026, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    return db.query(MonthlyFee).filter(MonthlyFee.month == month, MonthlyFee.year == year).all()

@router.put("/admin/{fee_id}/paid")
def mark_fee_paid(fee_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    fee = db.query(MonthlyFee).filter(MonthlyFee.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee record not found.")

    fee.status = "paid"
    fee.paid_at = datetime.now().strftime("%Y-%m-%d %I:%M %p")
    db.commit()

    create_notification(
        db,
        title="Fee Confirmed",
        message=f"Your membership fee of ₹{fee.amount} for {fee.month} has been marked as PAID offline by Keshav Library.",
        type="membership",
        recipient_type="student",
        recipient_id=fee.student_id
    )

    return {"message": "Fee marked as paid.", "paid_at": fee.paid_at}

@router.post("/admin/{fee_id}/whatsapp-reminder")
def send_fee_whatsapp_reminder(fee_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    fee = db.query(MonthlyFee).filter(MonthlyFee.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee record not found.")

    student = fee.student
    student_name = student.user.name if student and student.user else "Student"
    student_phone = student.user.phone if student and student.user else ""

    res = send_whatsapp_reminder(student_name, student_phone, fee.month, fee.amount)
    fee.reminder_sent_at = datetime.now().strftime("%Y-%m-%d %I:%M %p")
    db.commit()

    return res
