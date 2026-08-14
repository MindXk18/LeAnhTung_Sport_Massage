import { Therapist, Service, Program, Booking } from "./types";

export const INITIAL_THERAPISTS: Therapist[] = [
  {
    id: "th_001",
    name: "Nguyễn Văn Anh",
    title: "Trưởng nhóm KTV Trị liệu Sport Massage",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop",
    bio: "8 năm kinh nghiệm phục hồi chấn thương thể thao cho VĐV chạy bộ và gym.",
    specialties: ["sport", "recovery", "vai-gay", "dau-lung"],
    workingHours: {
      startTime: "08:00",
      endTime: "20:00",
      lunchStart: "12:00",
      lunchEnd: "14:00",
    },
    isActive: true,
  },
  {
    id: "th_002",
    name: "Trần Thị Bích",
    title: "Chuyên gia Deep Tissue & Trị liệu Vai Gáy",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
    bio: "Chuyên sâu ấn huyệt giải cơ sâu (Deep Tissue), giãn cơ cổ vai gáy cho dân văn phòng & VĐV.",
    specialties: ["deep-tissue", "vai-gay", "phuc-hoi-toan-than"],
    workingHours: {
      startTime: "08:00",
      endTime: "20:00",
      lunchStart: "12:00",
      lunchEnd: "14:00",
    },
    isActive: true,
  },
  {
    id: "th_003",
    name: "Lê Hoàng Cường",
    title: "KTV Phục hồi Chấn thương Thắt lưng & Gối",
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop",
    bio: "Chuyên trị liệu các vấn đề thắt lưng, khớp gối, cổ chân sau chấn thương thể thao.",
    specialties: ["sport", "dau-lung", "dau-goi", "co-dui"],
    workingHours: {
      startTime: "08:00",
      endTime: "20:00",
      lunchStart: "12:00",
      lunchEnd: "14:00",
    },
    isActive: true,
  },
  {
    id: "th_004",
    name: "Phạm Minh Đức",
    title: "KTV Giãn cơ & Trị liệu Thể thao Chuyên sâu",
    avatarUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop",
    bio: "Chuyên trị liệu căng cơ bắp đùi, bắp chân, phục hồi thể lực nhanh chóng sau thi đấu.",
    specialties: ["sport", "co-dui", "phuc-hoi-toan-than"],
    workingHours: {
      startTime: "08:00",
      endTime: "20:00",
      lunchStart: "12:00",
      lunchEnd: "14:00",
    },
    isActive: true,
  },
  {
    id: "th_005",
    name: "Vũ Thanh Em",
    title: "KTV Trị liệu Cổ Vai Gáy & Cột Sống",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop",
    bio: "Kinh nghiệm 6 năm trị liệu thoái hóa cột sống nhẹ, căng cơ vai gáy mạn tính.",
    specialties: ["vai-gay", "dau-lung", "recovery"],
    workingHours: {
      startTime: "08:00",
      endTime: "20:00",
      lunchStart: "12:00",
      lunchEnd: "14:00",
    },
    isActive: true,
  },
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: "sv_001",
    name: "Gói Thường — Sport Therapy Standard",
    description: "Trị liệu giải cơ sâu, giảm đau mỏi tập trung theo từng vùng chấn thương (Vai gáy / Thắt lưng / Đùi gối). Đã bao gồm 15 phút dọn dẹp vệ sinh phòng.",
    durationMinutes: 60,
    bufferMinutes: 15,
    price: 350000,
    issueTags: ["vai-gay", "dau-lung", "co-dui"],
    isActive: true,
    isVip: false,
  },
  {
    id: "sv_002",
    name: "Gói VIP — Sport Recovery & Therapy VIP",
    description: "Trị liệu toàn thân chuyên sâu 120 phút kết hợp súng bóp cơ, chườm thảo dược nóng và bài tập giãn cơ thụ động nâng cao. Đã bao gồm 15 phút dọn dẹp vệ sinh phòng.",
    durationMinutes: 120,
    bufferMinutes: 15,
    price: 650000,
    issueTags: ["phuc-hoi-toan-than", "vai-gay", "dau-lung", "dau-goi"],
    isActive: true,
    isVip: true,
  },
];

export const INITIAL_PROGRAMS: Program[] = [
  {
    id: "pg_001",
    slug: "dau-vai-gay",
    title: "Bài tập tự giãn cơ & giải tỏa đau Vai Gáy tại nhà",
    description: "Chuỗi 3 bài tập đơn giản 10 phút mỗi ngày giúp thư giãn đốt sống cổ, giải bó cơ thang và giảm đau vai gáy hiệu quả sau ca trị liệu.",
    issueTags: ["vai-gay", "stretching", "cot-song"],
    thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
    lessons: [
      {
        id: "ls_101",
        programId: "pg_001",
        title: "Bài 1: Giãn cơ cổ nghiêng bên & xoay khớp vai (3 phút)",
        youtubeVideoId: "RqcOCBb4arc", // 10 Minute Daily Posture Routine
        durationMinutes: 3,
        order: 1,
      },
      {
        id: "ls_102",
        programId: "pg_001",
        title: "Bài 2: Thắt cơ lưng trên với con lăn Foam Roller (4 phút)",
        youtubeVideoId: "tAUf7aajBWE", // Yoga at Your Desk - Desk Stretches
        durationMinutes: 4,
        order: 2,
      },
      {
        id: "ls_103",
        programId: "pg_001",
        title: "Bài 3: Tư thế Con Mèo - Con Bò thư giãn đốt sống cổ (3 phút)",
        youtubeVideoId: "4pKly2JojMw", // 10 min Morning Yoga Full Body Stretch
        durationMinutes: 3,
        order: 3,
      },
    ],
  },
  {
    id: "pg_002",
    slug: "dau-thap-lung",
    title: "Chương trình phục hồi thắt lưng & cơ cột sống",
    description: "Giúp giải áp đĩa đệm thắt lưng, tăng cường sức mạnh cơ cốt lõi (Core) phòng ngừa tái phát đau thắt lưng khi chơi thể thao.",
    issueTags: ["dau-lung", "cot-song", "gym"],
    thumbnailUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
    lessons: [
      {
        id: "ls_201",
        programId: "pg_002",
        title: "Bài 1: Động tác kéo gối áp ngực giải áp đĩa đệm",
        youtubeVideoId: "XeXz8fIZDCE", // Yoga For Lower Back Pain
        durationMinutes: 4,
        order: 1,
      },
      {
        id: "ls_202",
        programId: "pg_002",
        title: "Bài 2: Tư thế Cầu (Glute Bridge) kích hoạt cơ mông đùi",
        youtubeVideoId: "v7AYKMP6rOE", // Yoga For Complete Beginners
        durationMinutes: 5,
        order: 2,
      },
    ],
  },
  {
    id: "pg_003",
    slug: "phuc-hoi-goi-runner",
    title: "Phục hồi khớp gối & cổ chân cho Runner",
    description: "Chương trình 4 bài tập chuyên biệt dành cho người chạy bộ, giúp giảm đau đầu gối, cổ chân và phòng ngừa chấn thương khi tăng quãng đường.",
    issueTags: ["dau-goi", "co-chan", "chay-bo"],
    thumbnailUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop",
    lessons: [
      {
        id: "ls_301",
        programId: "pg_003",
        title: "Bài 1: Giãn cơ tứ đầu đùi & dải chậu chày (IT Band) (4 phút)",
        youtubeVideoId: "qULTwquOuT4", // Beginner Flexibility Routine
        durationMinutes: 4,
        order: 1,
      },
      {
        id: "ls_302",
        programId: "pg_003",
        title: "Bài 2: Bài tập ổn định khớp gối Single Leg Balance (3 phút)",
        youtubeVideoId: "iN-FPh7r1yg", // Yoga for Weightlifters & Athletes
        durationMinutes: 3,
        order: 2,
      },
      {
        id: "ls_303",
        programId: "pg_003",
        title: "Bài 3: Xoay cổ chân & giãn gân Achilles (3 phút)",
        youtubeVideoId: "0o0kNeOyH98", // Yoga for Complete Beginners
        durationMinutes: 3,
        order: 3,
      },
    ],
  },
  {
    id: "pg_004",
    slug: "gian-co-toan-than",
    title: "Giãn cơ toàn thân 15 phút sau tập Gym",
    description: "Chuỗi bài stretching toàn thân giúp giảm nhức mỏi, tăng linh hoạt cơ khớp và đẩy nhanh phục hồi sau buổi tập nặng tại phòng gym.",
    issueTags: ["stretching", "gym", "phuc-hoi-toan-than", "co-dui"],
    thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
    lessons: [
      {
        id: "ls_401",
        programId: "pg_004",
        title: "Bài 1: Giãn cơ ngực, vai và cơ tam đầu sau đẩy ngực (3 phút)",
        youtubeVideoId: "L_xrDAtykMI", // 15 Min Beginner Stretch Flexibility
        durationMinutes: 3,
        order: 1,
      },
      {
        id: "ls_402",
        programId: "pg_004",
        title: "Bài 2: Giãn cơ đùi trước, đùi sau & bắp chân (5 phút)",
        youtubeVideoId: "sTANio_2E0Q", // 20 min Full Body Stretch Yoga
        durationMinutes: 5,
        order: 2,
      },
      {
        id: "ls_403",
        programId: "pg_004",
        title: "Bài 3: Tư thế Child's Pose & xoay cột sống thư giãn (4 phút)",
        youtubeVideoId: "b1H3xO3x_Js", // Full Body Flow 20 Minute Yoga
        durationMinutes: 4,
        order: 3,
      },
    ],
  },
];

export const INITIAL_BOOKINGS: Booking[] = [];
