from sqlalchemy.orm import Session
from backend.models import Notification

def create_notification(db: Session, title: str, message: str, type: str = "system", recipient_type: str = "admin", recipient_id: int = None) -> Notification:
    notif = Notification(
        recipient_type=recipient_type,
        recipient_id=recipient_id,
        title=title,
        message=message,
        type=type
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif
