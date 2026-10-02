from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Token & Auth
class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: str
    password: str

class SetPasswordRequest(BaseModel):
    email: str
    new_password: str
    confirm_password: str

class CheckEmailRequest(BaseModel):
    email: str

class CheckEmailResponse(BaseModel):
    exists: bool
    password_set: bool
    role: Optional[str] = None
    name: Optional[str] = None

# User
class UserBase(BaseModel):
    name: str
    phone: str
    email: str
    role: str = "student"

class UserCreate(UserBase):
    password: str

class AdminAdmitStudentRequest(BaseModel):
    name: str
    email: str
    phone: str
    assigned_seat: Optional[str] = "Unassigned"
    join_date: Optional[str] = None

class UserResponse(UserBase):
    id: int
    password_set: bool = False
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Student Profile
class StudentResponse(BaseModel):
    id: int
    user_id: int
    name: str
    phone: str
    email: str
    member_id: str
    join_date: str
    assigned_seat: str
    membership_status: str
    class Config:
        from_attributes = True

# Enquiry
class EnquiryCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    enquiry_type: str = "membership"
    preferred_start_date: Optional[str] = None
    message: Optional[str] = None

class EnquiryResponse(EnquiryCreate):
    id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# Attendance
class CheckInRequest(BaseModel):
    student_id: int

class CheckOutRequest(BaseModel):
    session_id: int

class AttendanceResponse(BaseModel):
    id: int
    student_id: int
    date: str
    check_in: str
    check_out: Optional[str] = None
    total_minutes: int
    status: str
    class Config:
        from_attributes = True

# Monthly Fee
class FeeResponse(BaseModel):
    id: int
    student_id: int
    month: str
    year: int
    amount: int
    status: str
    paid_at: Optional[str] = None
    reminder_sent_at: Optional[str] = None
    class Config:
        from_attributes = True

# Seat
class SeatResponse(BaseModel):
    id: int
    seat_number: str
    zone: str
    status: str
    assigned_student_id: Optional[int] = None
    class Config:
        from_attributes = True

# Notification
class NotificationResponse(BaseModel):
    id: int
    recipient_type: str
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True
