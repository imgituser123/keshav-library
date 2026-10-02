import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal, engine, Base
from backend.models import Seat

def init_clean_seats():
    """
    Initialize 24 empty physical study desks across the 4 study zones.
    Contains ZERO dummy users, ZERO fake students, and ZERO fake attendance.
    """
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    zones = [
        ("Silent Zone", "A", 6),
        ("General Zone", "B", 6),
        ("Digital Zone", "C", 6),
        ("Discussion Zone", "D", 6)
    ]

    if db.query(Seat).count() == 0:
        for zone_name, prefix, count in zones:
            for i in range(1, count + 1):
                seat = Seat(
                    seat_number=f"{prefix}{i:02d}",
                    zone=zone_name,
                    status="available"
                )
                db.add(seat)
        db.commit()
        print("Initialized 24 clean, unassigned study desks across 4 zones.")
    else:
        print("Study desks already initialized.")

    db.close()

if __name__ == "__main__":
    init_clean_seats()
