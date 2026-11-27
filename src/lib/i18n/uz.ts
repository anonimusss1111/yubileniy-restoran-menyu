export interface Dictionary {
  header: {
    table: string;
    search: string;
    language: string;
  };
  categories: {
    all: string;
  };
  product: {
    outOfStock: string;
    addToSelection: string;
    weight: string;
    calories: string;
    brand: string;
  };
  selection: {
    title: string;
    empty: string;
    clear: string;
    total: string;
    showWaiter: string;
  };
  search: {
    placeholder: string;
    noResults: string;
  };
  waiter: {
    call: string;
    called: string;
  };
  promo: {
    badge: string;
  };
  admin: {
    login: string;
    logout: string;
    menu: string;
    categories: string;
    promos: string;
    qr: string;
    settings: string;
    available: string;
    stop: string;
    add: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
    confirmDelete: string;
    password: string;
    email: string;
  };
  common: {
    loading: string;
    error: string;
    retry: string;
    empty: string;
  };
}

export const uz: Dictionary = {
  header: {
    table: "Stol",
    search: "Qidirish",
    language: "Til",
  },
  categories: {
    all: "Barchasi",
  },
  product: {
    outOfStock: "Vaqtincha tugagan",
    addToSelection: "Tanlanganlarga qo'shish",
    weight: "Og'irlik",
    calories: "Kaloriya",
    brand: "Brend",
  },
  selection: {
    title: "Tanlanganlar",
    empty: "Hali hech narsa tanlanmagan",
    clear: "Tozalash",
    total: "Jami",
    showWaiter: "Ofitsiantga ko'rsatish",
  },
  search: {
    placeholder: "Taom qidirish...",
    noResults: "Hech narsa topilmadi",
  },
  waiter: {
    call: "Ofitsiantni chaqirish",
    called: "Ofitsiant chaqirildi",
  },
  promo: {
    badge: "Aksiya",
  },
  admin: {
    login: "Kirish",
    logout: "Chiqish",
    menu: "Menyu",
    categories: "Kategoriyalar",
    promos: "Aksiyalar",
    qr: "QR kodlar",
    settings: "Sozlamalar",
    available: "Sotuvda bor",
    stop: "Stop",
    add: "Qo'shish",
    edit: "Tahrirlash",
    delete: "O'chirish",
    save: "Saqlash",
    cancel: "Bekor qilish",
    confirmDelete: "O'chirishni tasdiqlaysizmi?",
    password: "Parol",
    email: "Email",
  },
  common: {
    loading: "Yuklanmoqda...",
    error: "Xatolik yuz berdi",
    retry: "Qayta urinish",
    empty: "Bo'sh",
  },
};
