from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models import AttendanceSession, User, StudentProfile
from backend.schemas import AttendanceResponse, CheckInRequest, CheckOutRequest
from backend.services.attendance import start_student_session, end_student_session
from backend.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])

@router.post("/check-in")
def check_in(req: CheckInRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    res = start_student_session(db, req.student_id)
    if not res["success"]:
        raise HTTPException(status_code=400, detail=res["error"])
    return {"message": "Session started", "session": res["session"]}

@router.post("/check-out")
def check_out(req: CheckOutRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    res = end_student_session(db, req.session_id)
    if not res["success"]:
        raise HTTPException(status_code=400, detail=res["error"])
    return {"message": "Session ended", "session": res["session"]}

@router.get("/student/{student_id}", response_model=List[AttendanceResponse])
def get_student_attendance(student_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(AttendanceSession).filter(AttendanceSession.student_id == student_id).order_by(AttendanceSession.id.desc()).all()

@router.get("/admin/today")
def get_today_attendance(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    from datetime import datetime
    today = datetime.now().strftime("%Y-%m-%d")
    return db.query(AttendanceSession).filter(AttendanceSession.date == today).all()
