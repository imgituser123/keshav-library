import sys
import os
import argparse
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal, engine, Base
from backend.models import User
from backend.auth import get_password_hash

def create_admin():
    parser = argparse.ArgumentParser(description="Create a real administrator account for Keshav Library.")
    parser.add_argument("--name", default="Keshav Library Admin", help="Admin Full Name")
    parser.add_argument("--email", default="admin@keshavlibrary.in", help="Admin Email")
    parser.add_argument("--phone", default="+91 83402 35780", help="Admin Mobile Number")
    parser.add_argument("--password", default=None, help="Admin Password")

    args = parser.parse_args()

    password = args.password
    if not password:
        password = os.getenv("ADMIN_INITIAL_PASSWORD", "AdminPass@2026")

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    existing = db.query(User).filter(User.email == args.email.lower().strip()).first()
    if existing:
        print(f"Admin account already exists for: {existing.email}")
        db.close()
        return

    admin = User(
        name=args.name.strip(),
        phone=args.phone.strip(),
        email=args.email.lower().strip(),
        password_hash=get_password_hash(password),
        role="admin",
        is_active=True
    )
    db.add(admin)
    db.commit()
    print("Administrator account created:")
    print(f"Email: {admin.email}")
    print(f"Name: {admin.name}")
    db.close()

if __name__ == "__main__":
    create_admin()
