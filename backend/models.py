from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    password_set = Column(Boolean, default=False, nullable=False)
    role = Column(String(20), default="student", nullable=False) # student, admin
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)

class StudentProfile(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    member_id = Column(String(20), unique=True, index=True, nullable=False) # e.g. KL-1001
    join_date = Column(String(20), nullable=False)
    assigned_seat = Column(String(20), default="Unassigned")
    membership_status = Column(String(20), default="active") # active, inactive
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="student_profile")
    memberships = relationship("Membership", back_populates="student")
    fees = relationship("MonthlyFee", back_populates="student")
    attendance_sessions = relationship("AttendanceSession", back_populates="student")

class Membership(Base):
    __tablename__ = "memberships"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    monthly_fee = Column(Integer, default=600, nullable=False) # exactly 600
    start_date = Column(String(20), nullable=False)
    current_status = Column(String(20), default="active") # active, inactive
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="memberships")

class MonthlyFee(Base):
    __tablename__ = "monthly_fees"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    month = Column(String(20), nullable=False) # October
    year = Column(Integer, nullable=False) # 2026
    amount = Column(Integer, default=600, nullable=False)
    status = Column(String(20), default="due") # paid, due
    paid_at = Column(String(50), nullable=True)
    reminder_sent_at = Column(String(50), nullable=True)

    student = relationship("StudentProfile", back_populates="fees")

class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)
    enquiry_type = Column(String(50), default="membership") # membership, general
    preferred_start_date = Column(String(20), nullable=True)
    message = Column(Text, nullable=True)
    status = Column(String(20), default="new") # new, contacted, converted, closed
    created_at = Column(DateTime, default=datetime.utcnow)

class AttendanceSession(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    date = Column(String(20), nullable=False) # YYYY-MM-DD
    check_in = Column(String(20), nullable=False) # HH:MM AM/PM
    check_out = Column(String(20), nullable=True)
    total_minutes = Column(Integer, default=0)
    status = Column(String(20), default="inside") # inside, completed

    student = relationship("StudentProfile", back_populates="attendance_sessions")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    recipient_type = Column(String(20), default="admin") # admin, student
    recipient_id = Column(Integer, nullable=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="system") # new_enquiry, membership, fee_due, attendance, system
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Seat(Base):
    __tablename__ = "seats"

    id = Column(Integer, primary_key=True, index=True)
    seat_number = Column(String(10), unique=True, nullable=False) # e.g. A01
    zone = Column(String(50), nullable=False) # Silent Zone, General Zone, Digital Zone, Discussion Zone
    status = Column(String(20), default="available") # available, occupied, unavailable
    assigned_student_id = Column(Integer, ForeignKey("students.id"), nullable=True)
