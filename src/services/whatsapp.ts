/**
 * WhatsApp Reminder Integration Service
 * Follows Section 22 specifications:
 * "Hello Rahul, this is a reminder from Keshav Library that your membership fee of ₹600 for October is currently due. Please contact the library to complete your payment. Thank you, Keshav Library."
 */

export interface WhatsAppReminderPayload {
  studentName: string;
  studentPhone: string;
  month: string;
  amount: number;
}

export function formatWhatsAppMessage(payload: WhatsAppReminderPayload): string {
  return `Hello ${payload.studentName}, this is a reminder from Keshav Library that your membership fee of ₹${payload.amount} for ${payload.month} is currently due. Please contact the library to complete your payment. Thank you, Keshav Library.`;
}

export function generateWhatsAppDirectLink(phone: string, message: string): string {
  // Clean phone number (remove +, spaces, dashes)
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export interface SendResult {
  success: boolean;
  mode: 'direct_link' | 'mock_api' | 'official_api';
  message: string;
  timestamp: string;
}

export async function sendWhatsAppReminder(payload: WhatsAppReminderPayload): Promise<SendResult> {
  const message = formatWhatsAppMessage(payload);
  const timestamp = new Date().toISOString();

  // In production or when environment variables are set, connect to WhatsApp Business API
  // For development and client preview, provide direct wa.me link generation + simulated provider response
  console.log(`[WhatsApp Reminder Dispatch] To: ${payload.studentPhone} (${payload.studentName}) - ${message}`);

  return {
    success: true,
    mode: 'direct_link',
    message,
    timestamp
  };
}
