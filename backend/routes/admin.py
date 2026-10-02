from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from backend.database import get_db
from backend.models import User, StudentProfile, Membership, MonthlyFee, Enquiry, Seat
from backend.auth import get_password_hash
from backend.dependencies import require_admin
from backend.services.notifications import create_notification

router = APIRouter(prefix="/api/admin", tags=["Admin Operations"])

@router.get("/metrics")
def get_metrics(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    total_members = db.query(StudentProfile).count()
    active_members = db.query(StudentProfile).filter(StudentProfile.membership_status == "active").count()
    
    today = datetime.now().strftime("%Y-%m-%d")
    today_sessions = db.query(AttendanceSession).filter(AttendanceSession.date == today).all()
    present_today = len(set(s.student_id for s in today_sessions))
    currently_inside = len([s for s in today_sessions if s.status == "inside"])

    fees_due = db.query(MonthlyFee).filter(MonthlyFee.status == "due").count()
    new_enquiries = db.query(Enquiry).filter(Enquiry.status == "new").count()

    return {
        "total_members": total_members,
        "active_members": active_members,
        "present_today": present_today,
        "currently_inside": currently_inside,
        "fees_due": fees_due,
        "new_enquiries": new_enquiries
    }

@router.post("/enquiries/{enquiry_id}/convert")
def convert_enquiry(enquiry_id: int, payload: dict, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    enq = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enq:
        raise HTTPException(status_code=404, detail="Enquiry not found.")

    assigned_seat = payload.get("assigned_seat", "A01")
    today = datetime.now().strftime("%Y-%m-%d")

    # Count existing students for ID
    student_count = db.query(StudentProfile).count()
    member_id = f"KL-{1001 + student_count}"

    # Create user with password_set=False for student first-time password setup
    user = User(
        name=enq.name,
        phone=enq.phone,
        email=enq.email or f"{enq.name.lower().replace(' ', '')}@student.keshavlibrary.in",
        password_hash=None,
        password_set=False,
        role="student",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create student profile
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

    # Create membership plan (₹600)
    membership = Membership(
        student_id=student.id,
        monthly_fee=600,
        start_date=today,
        current_status="active"
    )
    db.add(membership)

    # Create October initial due fee
    fee = MonthlyFee(
        student_id=student.id,
        month="October",
        year=2026,
        amount=600,
        status="due"
    )
    db.add(fee)

    # Update seat status
    seat = db.query(Seat).filter(Seat.seat_number == assigned_seat).first()
    if seat:
        seat.status = "occupied"
        seat.assigned_student_id = student.id

    enq.status = "converted"
    db.commit()

    create_notification(
        db,
        title="New Student Registered",
        message=f"{enq.name} enrolled as member {member_id}. Seat: {assigned_seat}.",
        type="membership",
        recipient_type="admin"
    )

    return {
        "message": "Enquiry converted to student successfully.",
        "student_id": student.id,
        "member_id": member_id
    }
