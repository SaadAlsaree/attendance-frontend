import { AttendanceStatus, LogMethod } from '../types/attendance';

// Format date to display in yyyy-mm-dd format
export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Format time to display in a user-friendly format
export const formatTime = (timeString: string): string => {
  if (!timeString) return '-';

  try {
    const date = new Date(timeString);
    return new Intl.DateTimeFormat('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

// Get status text based on attendance status
export const getStatusText = (status: AttendanceStatus): string => {
  switch (status) {
    case AttendanceStatus.Present:
      return 'حضور';
    case AttendanceStatus.Absent:
      return 'غياب';
    case AttendanceStatus.Break:
      return 'راحة';
    case AttendanceStatus.Vacation:
      return 'إجازة';
    case AttendanceStatus.Holiday:
      return 'عطلة';
    case AttendanceStatus.Late:
      return 'تأخير';
    case AttendanceStatus.Early_Out:
      return 'انصراف مبكر';
    case AttendanceStatus.Overtime:
      return 'عمل إضافي';
    default:
      return 'غير معروف';
  }
};

// Get log method text based on log method
export const getLogMethodText = (method: LogMethod): string => {
  switch (method) {
    case LogMethod.Mobile_App:
      return 'موبايل';
    case LogMethod.Web:
      return 'ويب';
    case LogMethod.Biometric:
      return 'بيومتريك';
    case LogMethod.RFID_Card:
      return 'بطاقة RFID';
    case LogMethod.NFC_Card:
      return 'بطاقة NFC';
    case LogMethod.QR_Card:
      return 'بطاقة QR';
    case LogMethod.Manual_Entry:
      return 'إدخال يدوي';
    case LogMethod.API:
      return 'API';
    default:
      return 'غير معروف';
  }
};

// Format working minutes to hours and minutes
export const formatWorkingTime = (minutes: number): string => {
  if (!minutes && minutes !== 0) return '-';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}:${remainingMinutes.toString().padStart(2, '0')}`;
};

// Check if attendance is approved
export const isApproved = (attendance: { approvedBy?: string; approvedAt?: string }): boolean => {
  return !!attendance.approvedBy && !!attendance.approvedAt;
};
