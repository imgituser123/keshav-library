from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models import Enquiry, User
from backend.schemas import EnquiryCreate, EnquiryResponse
from backend.services.notifications import create_notification
from backend.dependencies import require_admin

router = APIRouter(prefix="/api/enquiries", tags=["Enquiries"])

@router.post("", response_model=EnquiryResponse)
def submit_enquiry(enquiry: EnquiryCreate, db: Session = Depends(get_db)):
    db_enquiry = Enquiry(
        name=enquiry.name,
        phone=enquiry.phone,
        email=enquiry.email,
        enquiry_type=enquiry.enquiry_type,
        preferred_start_date=enquiry.preferred_start_date,
        message=enquiry.message,
        status="new"
    )
    db.add(db_enquiry)
    db.commit()
    db.refresh(db_enquiry)

    # Admin notification
    create_notification(
        db,
        title="New Membership Enquiry",
        message=f"{enquiry.name} has submitted a membership enquiry for Keshav Library.",
        type="new_enquiry",
        recipient_type="admin"
    )

    return db_enquiry

@router.get("/admin", response_model=List[EnquiryResponse])
def get_all_enquiries(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    return db.query(Enquiry).order_by(Enquiry.created_at.desc()).all()

@router.put("/admin/{enquiry_id}/status")
def update_enquiry_status(enquiry_id: int, status_update: dict, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    enq = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enq:
        raise HTTPException(status_code=404, detail="Enquiry not found.")
    enq.status = status_update.get("status", enq.status)
    db.commit()
    return {"message": "Enquiry status updated.", "status": enq.status}
