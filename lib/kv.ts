import fs from "fs";
import path from "path";
import { Therapist, Service, Program, Booking } from "./types";
import {
  INITIAL_THERAPISTS,
  INITIAL_SERVICES,
  INITIAL_PROGRAMS,
  INITIAL_BOOKINGS,
} from "./seed-data";

// Check if Vercel KV environment variables exist
const hasVercelKV = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

// Lazy-load @vercel/kv only when env vars are present (avoids crash at import time)
async function getKV() {
  const { kv } = await import("@vercel/kv");
  return kv;
}

// Local fallback DB path
const DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_DB_PATH = path.join(DATA_DIR, "db.json");

interface LocalDb {
  therapists: Therapist[];
  services: Service[];
  programs: Program[];
  bookings: Booking[];
}

// In-memory cache fallback for serverless environments where fs is read-only
let memoryDb: LocalDb | null = null;

function ensureLocalDb(): LocalDb {
  if (memoryDb) return memoryDb;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const initialData: LocalDb = {
        therapists: INITIAL_THERAPISTS,
        services: INITIAL_SERVICES,
        programs: INITIAL_PROGRAMS,
        bookings: INITIAL_BOOKINGS,
      };
      try {
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
      } catch {
        // Read-only filesystem in serverless
      }
      memoryDb = initialData;
      return initialData;
    }

    const content = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
    memoryDb = JSON.parse(content);
    return memoryDb as LocalDb;
  } catch {
    const initialData: LocalDb = {
      therapists: INITIAL_THERAPISTS,
      services: INITIAL_SERVICES,
      programs: INITIAL_PROGRAMS,
      bookings: INITIAL_BOOKINGS,
    };
    memoryDb = initialData;
    return initialData;
  }
}

function writeLocalDb(db: LocalDb) {
  memoryDb = db;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch {
    // Read-only filesystem, state persisted in memoryDb for process lifecycle
  }
}

// ─── Public API ───────────────────────────────────────────────

export async function getTherapists(): Promise<Therapist[]> {
  if (hasVercelKV) {
    const kv = await getKV();
    const data = await kv.get<Therapist[]>("therapists");
    if (!data) {
      await kv.set("therapists", INITIAL_THERAPISTS);
      return INITIAL_THERAPISTS;
    }
    return data;
  } else {
    const db = ensureLocalDb();
    return db.therapists;
  }
}

export async function getServices(): Promise<Service[]> {
  if (hasVercelKV) {
    const kv = await getKV();
    const data = await kv.get<Service[]>("services");
    if (!data) {
      await kv.set("services", INITIAL_SERVICES);
      return INITIAL_SERVICES;
    }
    return data;
  } else {
    const db = ensureLocalDb();
    return db.services;
  }
}

export async function getPrograms(): Promise<Program[]> {
  if (hasVercelKV) {
    const kv = await getKV();
    const data = await kv.get<Program[]>("programs");
    if (!data) {
      await kv.set("programs", INITIAL_PROGRAMS);
      return INITIAL_PROGRAMS;
    }
    return data;
  } else {
    const db = ensureLocalDb();
    return db.programs;
  }
}

export async function getBookings(): Promise<Booking[]> {
  if (hasVercelKV) {
    const kv = await getKV();
    const data = await kv.get<Booking[]>("bookings");
    return data || [];
  } else {
    const db = ensureLocalDb();
    return db.bookings || [];
  }
}

export async function addBooking(newBooking: Booking): Promise<Booking> {
  if (hasVercelKV) {
    const kv = await getKV();
    const current = (await kv.get<Booking[]>("bookings")) || [];
    current.push(newBooking);
    await kv.set("bookings", current);
  } else {
    const db = ensureLocalDb();
    db.bookings = db.bookings || [];
    db.bookings.push(newBooking);
    writeLocalDb(db);
  }
  return newBooking;
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"]
): Promise<Booking | null> {
  if (hasVercelKV) {
    const kv = await getKV();
    const bookings = (await kv.get<Booking[]>("bookings")) || [];
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;
    bookings[index].status = status;
    await kv.set("bookings", bookings);
    return bookings[index];
  } else {
    const db = ensureLocalDb();
    const index = db.bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;
    db.bookings[index].status = status;
    writeLocalDb(db);
    return db.bookings[index];
  }
}
