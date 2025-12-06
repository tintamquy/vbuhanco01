// LỤC THƯ - 6 PHƯƠNG PHÁP CẤU TẠO CHỮ HÁN
export const liushu = [
  {
    id: 1,
    name: "Tượng Hình",
    hanzi: "象形",
    hanViet: "Tượng Hình",
    description: "Chữ mô phỏng hình dạng sự vật",
    explanation: "Vẽ theo hình dạng của sự vật trong tự nhiên",
    examples: [
      {
        char: "日",
        hanViet: "nhật",
        meaning: "Mặt trời",
        evolution: ["☉", "⊙", "日"],
        explanation: "Hình tròn của mặt trời với chấm ở giữa"
      },
      {
        char: "月",
        hanViet: "nguyệt",
        meaning: "Mặt trăng",
        evolution: ["🌙", "⟨", "月"],
        explanation: "Hình lưỡi liềm của mặt trăng non"
      },
      {
        char: "山",
        hanViet: "sơn",
        meaning: "Núi",
        evolution: ["⛰", "山", "山"],
        explanation: "Ba đỉnh núi nhô lên"
      },
      {
        char: "水",
        hanViet: "thủy",
        meaning: "Nước",
        evolution: ["≋", "氺", "水"],
        explanation: "Dòng nước chảy với giọt nước"
      },
      {
        char: "火",
        hanViet: "hỏa",
        meaning: "Lửa",
        explanation: "Ngọn lửa bốc cháy"
      },
      {
        char: "木",
        hanViet: "mộc",
        meaning: "Cây",
        explanation: "Cây với thân, cành và rễ"
      },
      {
        char: "人",
        hanViet: "nhân",
        meaning: "Người",
        explanation: "Người đứng nghiêng với hai chân"
      },
      {
        char: "口",
        hanViet: "khẩu",
        meaning: "Miệng",
        explanation: "Miệng há ra"
      }
    ],
    quiz: "Nhìn hình ảnh → Đoán chữ Hán tượng hình"
  },
  {
    id: 2,
    name: "Chỉ Sự",
    hanzi: "指事",
    hanViet: "Chỉ Sự",
    description: "Chữ biểu thị khái niệm trừu tượng",
    explanation: "Dùng ký hiệu để chỉ ra ý nghĩa trừu tượng",
    examples: [
      {
        char: "上",
        hanViet: "thượng",
        meaning: "Trên",
        explanation: "Nét ngang ở trên, chỉ hướng lên cao"
      },
      {
        char: "下",
        hanViet: "hạ",
        meaning: "Dưới",
        explanation: "Nét ngang ở dưới, chỉ hướng xuống thấp"
      },
      {
        char: "本",
        hanViet: "bổn",
        meaning: "Gốc, cội nguồn",
        explanation: "Chữ 'Mộc' (木) với nét ngang chỉ phần gốc rễ"
      },
      {
        char: "末",
        hanViet: "mạt",
        meaning: "Ngọn, cuối cùng",
        explanation: "Chữ 'Mộc' (木) với nét ngang chỉ phần ngọn"
      },
      {
        char: "刃",
        hanViet: "nhận",
        meaning: "Lưỡi dao",
        explanation: "Chữ 'Đao' (刀) với chấm chỉ lưỡi dao"
      },
      {
        char: "一",
        hanViet: "nhất",
        meaning: "Số một",
        explanation: "Một nét ngang biểu thị số một"
      },
      {
        char: "二",
        hanViet: "nhị",
        meaning: "Số hai",
        explanation: "Hai nét ngang biểu thị số hai"
      },
      {
        char: "三",
        hanViet: "tam",
        meaning: "Số ba",
        explanation: "Ba nét ngang biểu thị số ba"
      }
    ]
  },
  {
    id: 3,
    name: "Hội Ý",
    hanzi: "会意",
    hanViet: "Hội Ý",
    description: "Ghép 2+ chữ tượng hình để tạo ý nghĩa mới",
    explanation: "Kết hợp nghĩa của các bộ phận để tạo nghĩa mới",
    examples: [
      {
        char: "明",
        hanViet: "minh",
        meaning: "Sáng",
        components: ["日 (nhật - mặt trời)", "月 (nguyệt - mặt trăng)"],
        explanation: "Mặt trời + Mặt trăng = Sáng"
      },
      {
        char: "休",
        hanViet: "hưu",
        meaning: "Nghỉ ngơi",
        components: ["人 (nhân - người)", "木 (mộc - cây)"],
        explanation: "Người dựa vào cây = Nghỉ ngơi"
      },
      {
        char: "森",
        hanViet: "sâm",
        meaning: "Rừng rậm",
        components: ["木 (mộc - cây) x3"],
        explanation: "Ba cây = Rừng rậm"
      },
      {
        char: "信",
        hanViet: "tín",
        meaning: "Tin tưởng",
        components: ["人 (nhân - người)", "言 (ngôn - lời nói)"],
        explanation: "Người + Lời nói = Tin tưởng"
      },
      {
        char: "好",
        hanViet: "hảo",
        meaning: "Tốt, đẹp",
        components: ["女 (nữ - con gái)", "子 (tử - con trai)"],
        explanation: "Con gái + Con trai = Tốt đẹp"
      },
      {
        char: "安",
        hanViet: "an",
        meaning: "Yên ổn",
        components: ["宀 (miên - mái nhà)", "女 (nữ - phụ nữ)"],
        explanation: "Phụ nữ trong nhà = Yên ổn"
      },
      {
        char: "從",
        hanViet: "tùng",
        meaning: "Theo, từ",
        components: ["人 (nhân - người) x2"],
        explanation: "Hai người đi theo nhau"
      },
      {
        char: "林",
        hanViet: "lâm",
        meaning: "Rừng",
        components: ["木 (mộc - cây) x2"],
        explanation: "Hai cây = Rừng"
      }
    ]
  },
  {
    id: 4,
    name: "Hình Thanh",
    hanzi: "形声",
    hanViet: "Hình Thanh",
    description: "Chữ có bộ hình (nghĩa) + bộ thanh (âm)",
    explanation: "80-90% chữ Hán thuộc loại này. Một bộ chỉ nghĩa, một bộ chỉ âm đọc",
    examples: [
      {
        char: "江",
        hanViet: "giang",
        meaning: "Sông lớn",
        components: {
          radical: "氵(水 - thủy)",
          phonetic: "工 (công)"
        },
        explanation: "氵chỉ nghĩa liên quan đến nước, 工 chỉ âm 'giang'"
      },
      {
        char: "河",
        hanViet: "hà",
        meaning: "Sông Hoàng Hà",
        components: {
          radical: "氵(水 - thủy)",
          phonetic: "可 (khả)"
        },
        explanation: "氵chỉ nước, 可 chỉ âm 'hà'"
      },
      {
        char: "清",
        hanViet: "thanh",
        meaning: "Trong sạch",
        components: {
          radical: "氵(水 - thủy)",
          phonetic: "青 (thanh)"
        },
        explanation: "氵chỉ nước, 青 chỉ âm 'thanh'"
      },
      {
        char: "媽",
        hanViet: "mã",
        meaning: "Mẹ",
        components: {
          radical: "女 (nữ)",
          phonetic: "馬 (mã)"
        },
        explanation: "女 chỉ phụ nữ, 馬 chỉ âm 'mã'"
      },
      {
        char: "銅",
        hanViet: "đồng",
        meaning: "Đồng (kim loại)",
        components: {
          radical: "金 (kim)",
          phonetic: "同 (đồng)"
        },
        explanation: "金 chỉ kim loại, 同 chỉ âm 'đồng'"
      },
      {
        char: "聞",
        hanViet: "văn",
        meaning: "Nghe",
        components: {
          radical: "耳 (nhĩ - tai)",
          phonetic: "門 (môn)"
        },
        explanation: "耳 chỉ tai/nghe, 門 chỉ âm 'văn'"
      },
      {
        char: "打",
        hanViet: "đả",
        meaning: "Đánh",
        components: {
          radical: "扌(手 - thủ)",
          phonetic: "丁 (đinh)"
        },
        explanation: "扌chỉ tay/hành động, 丁 chỉ âm 'đả'"
      },
      {
        char: "想",
        hanViet: "tưởng",
        meaning: "Nghĩ, tưởng",
        components: {
          radical: "心 (tâm)",
          phonetic: "相 (tương)"
        },
        explanation: "心 chỉ tâm trí, 相 chỉ âm 'tưởng'"
      }
    ],
    note: "Đây là phương pháp phổ biến nhất, chiếm 80-90% chữ Hán"
  },
  {
    id: 5,
    name: "Chuyển Chú",
    hanzi: "转注",
    hanViet: "Chuyển Chú",
    description: "Chữ mượn nghĩa để chỉ khái niệm liên quan",
    explanation: "Mở rộng nghĩa gốc sang nghĩa tương tự hoặc dẫn nghĩa",
    examples: [
      {
        char: "長",
        hanViet: "trường/trưởng",
        meanings: ["Dài (trường)", "Lớn tuổi, người lãnh đạo (trưởng)"],
        explanation: "Từ nghĩa 'dài' mở rộng sang 'lớn tuổi, lãnh đạo'"
      },
      {
        char: "考",
        hanViet: "khảo",
        meanings: ["Cha già", "Xem xét, thi cử"],
        explanation: "Từ nghĩa 'cha già' chuyển sang 'xem xét kỹ lưỡng'"
      },
      {
        char: "老",
        hanViet: "lão",
        meanings: ["Già", "Cũ, lâu năm", "Kính trọng"],
        explanation: "Nghĩa mở rộng từ 'tuổi già' sang các nghĩa liên quan"
      },
      {
        char: "樂",
        hanViet: "lạc/nhạc",
        meanings: ["Vui vẻ (lạc)", "Âm nhạc (nhạc)"],
        explanation: "Từ nghĩa 'vui vẻ' mở rộng sang 'âm nhạc'"
      }
    ]
  },
  {
    id: 6,
    name: "Giả Tá",
    hanzi: "假借",
    hanViet: "Giả Tá",
    description: "Mượn chữ cùng âm để viết khái niệm mới",
    explanation: "Mượn chữ có sẵn với âm giống nhau để viết từ mới chưa có chữ",
    examples: [
      {
        char: "來",
        hanViet: "lai",
        original: "Cây lúa mì",
        borrowed: "Đến, tới",
        explanation: "Mượn chữ 'lúa mì' để viết từ 'đến' vì cùng âm"
      },
      {
        char: "萬",
        hanViet: "vạn",
        original: "Con bọ cạp",
        borrowed: "Mười nghìn",
        explanation: "Mượn chữ 'bọ cạp' để viết số '10,000' vì cùng âm"
      },
      {
        char: "然",
        hanViet: "nhiên",
        original: "Đốt thịt chó",
        borrowed: "Như vậy, đúng vậy",
        explanation: "Mượn chữ có nghĩa gốc khác để viết từ 'như vậy'"
      },
      {
        char: "其",
        hanViet: "kỳ",
        original: "Cái sàng",
        borrowed: "Của nó, đó",
        explanation: "Mượn chữ 'sàng' để viết đại từ 'của nó'"
      }
    ]
  }
];

// Helper functions
export function getLiushuById(id) {
  return liushu.find(item => item.id === id);
}

export function getLiushuByName(name) {
  return liushu.find(item => item.name === name || item.hanzi === name);
}

export function getCharacterLiushuType(char) {
  // Tìm xem chữ thuộc loại Lục thư nào
  for (const type of liushu) {
    const found = type.examples.find(ex => ex.char === char);
    if (found) return type;
  }
  return null;
}

