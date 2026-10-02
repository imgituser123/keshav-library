from sqlalchemy.orm import Session
from backend.models import MonthlyFee, StudentProfile
from datetime import datetime

def generate_monthly_fees_for_active_students(db: Session, month: str = "October", year: int = 2026):
    students = db.query(StudentProfile).filter(StudentProfile.membership_status == "active").all()
    count = 0
    for std in students:
        existing = db.query(MonthlyFee).filter(
            MonthlyFee.student_id == std.id,
            MonthlyFee.month == month,
            MonthlyFee.year == year
        ).first()
        if not existing:
            fee = MonthlyFee(
                student_id=std.id,
                month=month,
                year=year,
                amount=600,
                status="due"
            )
            db.add(fee)
            count += 1
    db.commit()
    return count
