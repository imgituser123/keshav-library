from sqlalchemy.orm import Session
from datetime import datetime
from backend.models import AttendanceSession, StudentProfile
from backend.services.notifications import create_notification

def start_student_session(db: Session, student_id: int):
    # Check for active session
    active = db.query(AttendanceSession).filter(
        AttendanceSession.student_id == student_id,
        AttendanceSession.status == "inside"
    ).first()

    if active:
        return {"success": False, "error": "Your session is already active."}

    student = db.query(StudentProfile).filter(StudentProfile.id == student_id).first()
    if not student or student.membership_status != "active":
        return {"success": False, "error": "Your membership is currently inactive."}

    now = datetime.now()
    session = AttendanceSession(
        student_id=student_id,
        date=now.strftime("%Y-%m-%d"),
        check_in=now.strftime("%I:%M %p"),
        status="inside",
        total_minutes=0
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    create_notification(
        db,
        title="Student Checked In",
        message=f"{student.user.name if student.user else 'Student'} started a session at {session.check_in}.",
        type="attendance",
        recipient_type="admin"
    )

    return {"success": True, "session": session}

def end_student_session(db: Session, session_id: int):
    session = db.query(AttendanceSession).filter(AttendanceSession.id == session_id).first()
    if not session or session.status != "inside":
        return {"success": False, "error": "Session is not active or not found."}

    now = datetime.now()
    session.check_out = now.strftime("%I:%M %p")
    session.status = "completed"

    # Calculate minutes
    try:
        in_time = datetime.strptime(f"{session.date} {session.check_in}", "%Y-%m-%d %I:%M %p")
        diff_mins = max(1, int((now - in_time).total_seconds() / 60))
        session.total_minutes = diff_mins
    except Exception:
        session.total_minutes = 60

    db.commit()
    db.refresh(session)
    return {"success": True, "session": session}
