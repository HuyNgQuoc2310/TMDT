export const categories = [
  { id: 1, name: "Mô hình Anime" },
  { id: 2, name: "Gundam" },
  { id: 3, name: "LEGO" },
  { id: 4, name: "Pokemon" },
];

export const products = [
  {
    id: 1,
    name: "Luffy Gear 5 Figure",
    price: 890000,
    stock: 15,
    categoryId: 1,
    image: "https://placehold.co/900x700/fee2e2/7f1d1d?text=Luffy+Gear+5+Figure",
    description: "Mô hình One Piece Luffy Gear 5 cao cấp, trưng bày rất nổi bật.",
    isFeatured: true,
  },
  {
    id: 2,
    name: "Zoro Wano Figure",
    price: 750000,
    stock: 20,
    categoryId: 1,
    image: "https://placehold.co/900x700/e0f2fe/075985?text=Zoro+Wano+Figure",
    description: "Mô hình Zoro phiên bản Wano với tư thế chiến đấu mạnh mẽ.",
    isFeatured: false,
  },
  {
    id: 3,
    name: "MG Strike Freedom Gundam",
    price: 1250000,
    stock: 10,
    categoryId: 2,
    image: "https://placehold.co/900x700/dbeafe/1d4ed8?text=MG+Strike+Freedom",
    description: "Bandai MG Strike Freedom Gundam, chi tiết sắc nét và nhiều phụ kiện.",
    isFeatured: false,
  },
  {
    id: 4,
    name: "RG Hi-Nu Gundam",
    price: 1450000,
    stock: 8,
    categoryId: 2,
    image: "https://placehold.co/900x700/e0e7ff/3730a3?text=RG+Hi-Nu+Gundam",
    description: "Real Grade Hi-Nu Gundam dành cho người chơi thích độ khó cao.",
    isFeatured: false,
  },
  {
    id: 5,
    name: "LEGO Technic Ferrari",
    price: 3990000,
    stock: 5,
    categoryId: 3,
    image: "https://placehold.co/900x700/fef3c7/92400e?text=LEGO+Technic+Ferrari",
    description: "LEGO Technic Ferrari Daytona SP3, hộp lớn, xứng tầm sưu tầm.",
    isFeatured: false,
  },
  {
    id: 6,
    name: "Pikachu Figure",
    price: 350000,
    stock: 30,
    categoryId: 4,
    image: "https://placehold.co/900x700/dcfce7/166534?text=Pikachu+Figure",
    description: "Mô hình Pokemon Pikachu nhỏ gọn, màu sắc tươi và dễ trưng bày.",
    isFeatured: false,
  },
];

export const users = [
  {
    id: 1,
    username: "admin",
    password: "123456",
    role: "admin",
    fullname: "Quản trị viên",
  },
  {
    id: 2,
    username: "user1",
    password: "123456",
    role: "user",
    fullname: "Nguyễn Văn A",
  },
];

export const orders = [
  {
    id: 1,
    userId: 2,
    date: "2026-05-31",
    status: "Hoàn thành",
    total: 890000,
    items: [
      {
        productId: 1,
        name: "Luffy Gear 5 Figure",
        price: 890000,
        quantity: 1,
      },
    ],
  },
];

export const feedbacks = [
  {
    id: 1,
    productId: 1,
    userId: 2,
    rating: 5,
    comment: "Mô hình đẹp, đóng gói cẩn thận.",
  },
  {
    id: 2,
    productId: 3,
    userId: 2,
    rating: 4,
    comment: "Chi tiết sắc nét, dễ lắp ráp.",
  },
];

export const wishlists = [
  {
    id: 1,
    userId: 2,
    productId: 4,
  },
];
