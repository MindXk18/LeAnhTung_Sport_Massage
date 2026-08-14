export type ServiceId = string;
export type TherapistId = string;

export interface Therapist {
  id: TherapistId;
  name: string;
  avatarUrl?: string;
  title: string;
  bio?: string;
  specialties: string[];
  workingHours: {
    startTime: string; // "08:00"
    endTime: string;   // "20:00"
    lunchStart: string; // "12:00"
    lunchEnd: string;   // "14:00"
  };
  isActive: boolean;
}

export interface Service {
  id: ServiceId;
  name: string;
  description: string;
  durationMinutes: number; // 60 or 120
  bufferMinutes: number;   // 15
  price: number;
  issueTags: string[];
  isActive: boolean;
  isVip?: boolean;
}

export interface Booking {
  id: string; // bk_20260812_001
  serviceId: ServiceId;
  therapistId: TherapistId; // specific ID or assigned therapist ID
  requestedTherapistId: TherapistId; // "any" or specific ID
  customerName: string;
  customerPhone: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "08:00"
  endTime: string;   // "09:00"
  bufferEndTime: string; // "09:15"
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  note?: string;
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  description: string;
  issueTags: string[];
  thumbnailUrl?: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  programId: string;
  title: string;
  youtubeVideoId: string;
  durationMinutes: number;
  order: number;
}
