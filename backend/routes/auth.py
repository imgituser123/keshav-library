from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from backend.database import get_db
from backend.models import User, StudentProfile, Membership, MonthlyFee
from backend.schemas import LoginRequest, Token, UserResponse, UserCreate, SetPasswordRequest, CheckEmailRequest, CheckEmailResponse
from backend.auth import verify_password, create_access_token, get_password_hash
from backend.dependencies import get_current_user
from backend.services.notifications import create_notification

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/student/register", response_model=Token)
def register_student(creds: UserCreate, db: Session = Depends(get_db)):
    email = creds.email.lower().strip()
    existing_user = db.query(User).filter(User.email == email).first()

    # Section 1 Bug Fix: If admitted by admin with password_set == False,
    # do NOT show "Email already exists". Recognize as first-time password setup!
    if existing_user:
        if not existing_user.password_set:
            if len(creds.password) < 6:
                raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
            existing_user.password_hash = get_password_hash(creds.password)
            existing_user.password_set = True
            if creds.phone:
                existing_user.phone = creds.phone.strip()
            if creds.name:
                existing_user.name = creds.name.strip()
            db.commit()
            access_token = create_access_token(data={"sub": existing_user.email, "role": "student"})
            return {"access_token": access_token, "token_type": "bearer"}
        else:
            raise HTTPException(status_code=400, detail="An account with this email already exists. Please log in.")

    if db.query(User).filter(User.phone == creds.phone.strip()).first():
        raise HTTPException(status_code=400, detail="An account with this mobile number already exists.")

    today = datetime.now().strftime("%Y-%m-%d")
    current_month = datetime.now().strftime("%B")
    current_year = datetime.now().year

    user = User(
        name=creds.name.strip(),
        phone=creds.phone.strip(),
        email=email,
        password_hash=get_password_hash(creds.password),
        password_set=True,
        role="student",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    student_count = db.query(StudentProfile).count()
    member_id = f"KL-{1001 + student_count}"

    student = StudentProfile(
        user_id=user.id,
        member_id=member_id,
        join_date=today,
        assigned_seat="Unassigned",
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
    db.commit()

    create_notification(
        db,
        title="New Student Registered",
        message=f"{user.name} registered as student ({member_id}). Fee: ₹600 DUE.",
        type="membership",
        recipient_type="admin"
    )

    access_token = create_access_token(data={"sub": user.email, "role": "student"})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/student/set-password", response_model=Token)
def set_student_password(payload: SetPasswordRequest, db: Session = Depends(get_db)):
    if payload.new_password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")
    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    email = payload.email.lower().strip()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No admitted student account found with this email.")
    if user.role != "student":
        raise HTTPException(status_code=403, detail="This email is not registered as a student account.")
    if user.password_set:
        raise HTTPException(status_code=400, detail="Password has already been set for this account. Please use Student Login directly.")

    user.password_hash = get_password_hash(payload.new_password)
    user.password_set = True
    db.commit()

    create_notification(
        db,
        title="Password Activated",
        message=f"{user.name} completed first-time password setup.",
        type="system",
        recipient_type="admin"
    )

    access_token = create_access_token(data={"sub": user.email, "role": "student"})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/check-email", response_model=CheckEmailResponse)
def check_email_status(payload: CheckEmailRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user:
        return CheckEmailResponse(exists=False, password_set=False)
    return CheckEmailResponse(
        exists=True,
        password_set=bool(user.password_set),
        role=user.role,
        name=user.name
    )

@router.post("/admin/register", response_model=Token)
def register_admin(creds: UserCreate, db: Session = Depends(get_db)):
    email = creds.email.lower().strip()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    user = User(
        name=creds.name.strip(),
        phone=creds.phone.strip(),
        email=email,
        password_hash=get_password_hash(creds.password),
        password_set=True,
        role="admin",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": user.email, "role": "admin"})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/student/login", response_model=Token)
def login_student(creds: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email.lower().strip()).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    if user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This login endpoint is for Students only. Please use Admin Login."
        )
    if not user.password_set:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your student admission is approved, but your password is not set yet. Please use 'Set Password / First-Time Login' to create your password."
        )
    if not user.password_hash or not verify_password(creds.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student account is inactive."
        )

    access_token = create_access_token(data={"sub": user.email, "role": "student"})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/admin/login", response_model=Token)
def login_admin(creds: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email.lower().strip()).first()
    if not user or not verify_password(creds.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: This login endpoint is for Administrators only."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is inactive."
        )

    access_token = create_access_token(data={"sub": user.email, "role": "admin"})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login_generic(creds: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email.lower().strip()).first()
    if not user or not verify_password(creds.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive."
        )

    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout():
    return {"message": "Successfully logged out."}
