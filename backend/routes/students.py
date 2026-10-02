from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from backend.database import get_db
from backend.models import StudentProfile, User, Membership, MonthlyFee, Seat
from backend.schemas import StudentResponse, AdminAdmitStudentRequest
from backend.dependencies import get_current_user, require_admin
from backend.services.notifications import create_notification

router = APIRouter(prefix="/api/students", tags=["Students"])

@router.get("/profile", response_model=StudentResponse)
def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found.")
    return {
        "id": student.id,
        "user_id": current_user.id,
        "name": current_user.name,
        "phone": current_user.phone,
        "email": current_user.email,
        "member_id": student.member_id,
        "join_date": student.join_date,
        "assigned_seat": student.assigned_seat,
        "membership_status": student.membership_status
    }

@router.get("/admin/all")
def get_all_students(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    students = db.query(StudentProfile).all()
    results = []
    for s in students:
        results.append({
            "id": s.id,
            "user_id": s.user_id,
            "name": s.user.name if s.user else "",
            "phone": s.user.phone if s.user else "",
            "email": s.user.email if s.user else "",
            "member_id": s.member_id,
            "join_date": s.join_date,
            "assigned_seat": s.assigned_seat,
            "membership_status": s.membership_status,
            "password_set": bool(s.user.password_set) if s.user else False
        })
    return results

@router.post("/admin/admit")
def admit_student_by_admin(payload: AdminAdmitStudentRequest, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    email = payload.email.lower().strip()
    phone = payload.phone.strip()
    name = payload.name.strip()

    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="A student account with this email already exists.")
    if db.query(User).filter(User.phone == phone).first():
        raise HTTPException(status_code=400, detail="A student account with this mobile number already exists.")

    today = payload.join_date or datetime.now().strftime("%Y-%m-%d")
    current_month = datetime.now().strftime("%B")
    current_year = datetime.now().year

    # Admitted with NO usable password initially (password_set = False)
    user = User(
        name=name,
        phone=phone,
        email=email,
        password_hash=None,
        password_set=False,
        role="student",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    student_count = db.query(StudentProfile).count()
    member_id = f"KL-{1001 + student_count}"

    assigned_seat = payload.assigned_seat or "Unassigned"

    student = StudentProfile(
        user_id=user.id,
        member_id=member_id,
        join_date=today,
        assigned_seat=assigned_seat,
        membership_status="active"
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    membership = Membership(
        student_id=student.id,
        monthly_fee=600,
        start_date=today,
        current_status="active"
    )
    db.add(membership)

    fee = MonthlyFee(
        student_id=student.id,
        month=current_month,
        year=current_year,
        amount=600,
        status="due"
    )
    db.add(fee)

    if assigned_seat != "Unassigned":
        seat = db.query(Seat).filter(Seat.seat_number == assigned_seat).first()
        if seat:
            seat.status = "assigned"
            seat.assigned_student_id = student.id

    db.commit()

    create_notification(
        db,
        title="Student Admitted",
        message=f"{name} admitted as member {member_id}. Awaiting student password setup.",
        type="membership",
        recipient_type="admin"
    )

    return {
        "success": True,
        "message": f"Student {name} admitted successfully. Account is ready for first-time password setup.",
        "student": {
            "id": student.id,
            "member_id": member_id,
            "name": name,
            "email": email,
            "assigned_seat": assigned_seat,
            "password_set": False
        }
    }

@router.put("/admin/{student_id}/status")
def toggle_student_status(student_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    student.membership_status = "inactive" if student.membership_status == "active" else "active"
    db.commit()
    return {"message": "Status updated", "status": student.membership_status}
