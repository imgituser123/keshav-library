import os
import urllib.parse
from dotenv import load_dotenv

load_dotenv()

WHATSAPP_ENABLED = os.getenv("WHATSAPP_ENABLED", "false").lower() == "true"
WHATSAPP_API_URL = os.getenv("WHATSAPP_API_URL", "")
WHATSAPP_API_TOKEN = os.getenv("WHATSAPP_API_TOKEN", "")

def format_whatsapp_message(student_name: str, month: str = "October", amount: int = 600) -> str:
    """
    Official Reminder Template matching Section 22:
    "Hello Rahul, this is a reminder from Keshav Library that your membership fee of ₹600 for October is currently due. Please contact the library to complete your payment. Thank you, Keshav Library."
    """
    return f"Hello {student_name}, this is a reminder from Keshav Library that your membership fee of ₹{amount} for {month} is currently due. Please contact the library to complete your payment. Thank you, Keshav Library."

def generate_whatsapp_link(phone: str, message: str) -> str:
    """Generate universal wa.me click-to-chat URL."""
    clean_phone = "".join(filter(str.isdigit, phone))
    encoded = urllib.parse.quote(message)
    return f"https://wa.me/{clean_phone}?text={encoded}"

def send_whatsapp_reminder(student_name: str, phone: str, month: str = "October", amount: int = 600) -> dict:
    message = format_whatsapp_message(student_name, month, amount)
    direct_link = generate_whatsapp_link(phone, message)

    if not WHATSAPP_ENABLED or not WHATSAPP_API_TOKEN:
        # Development / Safe Mock Mode
        print(f"[MOCK WHATSAPP DISPATCH] To: {phone} ({student_name}): {message}")
        return {
            "success": True,
            "mode": "mock",
            "message": message,
            "direct_url": direct_link
        }

    # Production API provider integration
    try:
        import requests
        headers = {
            "Authorization": f"Bearer {WHATSAPP_API_TOKEN}",
            "Content-Type": "application/json"
        }
        payload = {
            "messaging_product": "whatsapp",
            "to": phone,
            "type": "text",
            "text": {"body": message}
        }
        response = requests.post(WHATSAPP_API_URL, json=payload, headers=headers, timeout=5)
        return {
            "success": response.status_code in [200, 201],
            "mode": "api",
            "response": response.json() if response.ok else response.text,
            "direct_url": direct_link
        }
    except Exception as e:
        print(f"[WHATSAPP ERROR] {e}")
        return {
            "success": False,
            "error": str(e),
            "direct_url": direct_link
        }
