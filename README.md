# Keshav Library — 24-Hour Study Space Platform

> **"Keshav Library — Your Space. Your Focus."**  
> *"Bring your books. Bring your notes. We provide the environment to study."*

Keshav Library is a physical **24-hour study space** located in **Shakurabad, Jehanabad, Bihar 804425** where students bring their own books, notes, and laptops to study in an undisturbed, disciplined environment. It operates on a single flat membership model: **₹600/month**, with offline in-person fee collection and zero online payment gateways.

---

## Official Library Information

- **📍 Address:** Shakurabad, Jehanabad, Bihar 804425
- **📞 Phone:** +91 83402 35780
- **💬 WhatsApp:** +91 83402 35780
- **✉️ Email:** mahishakurabad@gmail.com
- **🕐 Operational Hours:** Open 24 Hours
- **🗺️ Verified Google Maps Location:** [View on Google Maps](https://www.google.com/maps/place/Ravi+library/@25.1510562,84.9012641,17z/data=!4m15!1m8!3m7!1s0x398d350227ca80d9:0x57c90284ea08d38f!2sShakurabad,+Bihar+804425!3b1!8m2!3d25.1511198!4d84.9030349!16s%2Fg%2F12htq1cgt!3m5!1s0x398d35000d05c51b:0x4583f07b3180e507!8m2!3d25.1525473!4d84.8994927!16s%2Fg%2F11lybx1ncz?entry=ttu&g_ep=EgoyMDI2MDkyOS4wIKXMDSoASAFQAw%3D%3D)

---

## Separated Architecture & Routes

### 1. Student Portal
- `/student/register` — Student Registration (Full Name, Email, Mobile Number, Password, Confirm Password)
- `/student/login` — Student Login (Email & Password with strict role verification)
- `/student/dashboard` — Student Dashboard (Today's time, live session timer, streak, month total, main actions)
- `/student/profile` — Student Profile (Member ID, Desk, Join Date, contact update)
- `/student/membership` — Membership status (₹600/month plan, 24h access, offline payment notice)
- `/student/attendance` — Time tracker & Attendance history (Only student's own private records)
- `/student/fees` — Fee status (₹600 status: PAID / DUE)
- `/student/notifications` — Student-specific alerts and updates

### 2. Admin Portal
- `/admin/register` — Admin Registration (Admin Name, Email, Mobile Number, Password, Confirm Password)
- `/admin/login` — Admin Login (Strict admin authentication)
- `/admin/dashboard` — Admin Overview (Calculated metrics strictly from real DB records: Total Students, Active Members, Present Today, Currently Inside, Fees Due, New Enquiries; starts at 0 with clean DB!)
- `/admin/students` — Manage Students (Search, enroll, toggle status, reassign desk)
- `/admin/memberships` — View active memberships (₹600/month flat rate)
- `/admin/enquiries` — Website enquiries (Mark contacted, convert to student)
- `/admin/fees` — Monthly fee accounting (Mark Paid, Send WhatsApp Reminder)
- `/admin/attendance` — Live attendance & emergency session checkout
- `/admin/seats` — 24 Study Desks Visual Grid across 4 zones: Silent, General, Digital, Discussion
- `/admin/notifications` — Admin alerts center
- `/admin/settings` — Official library contact configuration and Clean DB Reset button

### 3. Public Website
- `/` — Homepage with brand message, 24-hour tag, Shakurabad address, ₹600 rate, facilities, zones, CTAs
- `/contact` — Dedicated Contact Page with directions, map view, call, WhatsApp, and email buttons
- `/membership` — Membership inclusions, offline payment details, and enquiry form
- `/facilities` & `/zones` — In-depth amenity and study zone breakdown

---

## Clean Database (Zero Dummy Data)

The application starts with a completely clean database:
- **Total Students:** 0
- **Active Members:** 0
- **Present Today:** 0
- **Currently Inside:** 0
- **Fees Due:** 0
- **New Enquiries:** 0

All statistics and tables calculate strictly from real registered students, real check-ins, and real enquiries.

---

## Quickstart Guide (Python FastAPI)

### 1. Prerequisites
- Python 3.10+
- SQLite3

### 2. Setup Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
cp .env.example .env
```

### 5. Initialize Clean Study Desks (Optional)
```bash
python scripts/seed_data.py
```
*Note: This initializes only the 24 empty desk placeholders across the 4 zones. It does NOT create any dummy users.*

### 6. Create Real Administrator (CLI)
```bash
python scripts/create_admin.py --name "Keshav Admin" --email "admin@keshavlibrary.in" --phone "+91 83402 35780" --password "YourSecurePass"
```
Or register directly via `/admin/register` in the UI!

### 7. Run the FastAPI Server
```bash
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
Open **http://localhost:8000/docs** for the Swagger UI documentation.
Open **http://localhost:3000** for the frontend application.
