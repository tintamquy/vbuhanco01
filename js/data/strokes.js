// 8 NÉT CĂN BẢN CỦA CHỮ HÁN
export const basicStrokes = [
  {
    id: 1,
    name: "Nét Ngang",
    hanzi: "一",
    pinyin: "héng",
    hanViet: "hoành",
    description: "Viết từ trái sang phải, hơi nghiêng lên",
    svg: "M 0 50 L 100 45",
    examples: ["一", "二", "三", "王", "天"],
    practiceChars: [
      { char: "一", hanViet: "nhất", meaning: "Số một" },
      { char: "二", hanViet: "nhị", meaning: "Số hai" },
      { char: "三", hanViet: "tam", meaning: "Số ba" }
    ]
  },
  {
    id: 2,
    name: "Nét Sổ",
    hanzi: "丨",
    pinyin: "shù",
    hanViet: "thụ",
    description: "Viết từ trên xuống dưới, thẳng đứng",
    svg: "M 50 0 L 50 100",
    examples: ["十", "中", "川"],
    practiceChars: [
      { char: "十", hanViet: "thập", meaning: "Số mười" },
      { char: "中", hanViet: "trung", meaning: "Giữa, trung tâm" },
      { char: "川", hanViet: "xuyên", meaning: "Sông" }
    ]
  },
  {
    id: 3,
    name: "Nét Phẩy",
    hanzi: "丿",
    pinyin: "piě",
    hanViet: "phiệt",
    description: "Viết từ phải trên sang trái dưới",
    svg: "M 80 10 L 20 90",
    examples: ["人", "八", "千"],
    practiceChars: [
      { char: "人", hanViet: "nhân", meaning: "Người" },
      { char: "八", hanViet: "bát", meaning: "Số tám" },
      { char: "千", hanViet: "thiên", meaning: "Ngàn" }
    ]
  },
  {
    id: 4,
    name: "Nét Mác (Nét Nại)",
    hanzi: "㇏",
    pinyin: "nà",
    hanViet: "nại",
    description: "Viết từ trái trên sang phải dưới",
    svg: "M 20 10 L 80 90",
    examples: ["八", "入", "大"],
    practiceChars: [
      { char: "入", hanViet: "nhập", meaning: "Vào" },
      { char: "大", hanViet: "đại", meaning: "To lớn" },
      { char: "天", hanViet: "thiên", meaning: "Trời" }
    ]
  },
  {
    id: 5,
    name: "Nét Điểm",
    hanzi: "㇀",
    pinyin: "diǎn",
    hanViet: "điểm",
    description: "Nét ngắn, viết từ trên xuống",
    svg: "M 50 30 L 52 50",
    examples: ["主", "六", "心"],
    practiceChars: [
      { char: "主", hanViet: "chủ", meaning: "Chủ, chủ nhân" },
      { char: "六", hanViet: "lục", meaning: "Số sáu" },
      { char: "心", hanViet: "tâm", meaning: "Trái tim" }
    ]
  },
  {
    id: 6,
    name: "Nét Trích (Nét Ngang Móc)",
    hanzi: "㇐",
    pinyin: "tí",
    hanViet: "đề",
    description: "Nét ngang có móc lên ở cuối",
    svg: "M 20 50 L 80 48 Q 82 45 80 42",
    examples: ["江", "河", "打"],
    practiceChars: [
      { char: "江", hanViet: "giang", meaning: "Sông lớn" },
      { char: "河", hanViet: "hà", meaning: "Sông" },
      { char: "打", hanViet: "đả", meaning: "Đánh" }
    ]
  },
  {
    id: 7,
    name: "Nét Ngã",
    hanzi: "㇣",
    pinyin: "wān",
    hanViet: "oan",
    description: "Nét cong, uốn khúc",
    svg: "M 30 20 Q 50 40 40 70",
    examples: ["心", "之", "也"],
    practiceChars: [
      { char: "之", hanViet: "chi", meaning: "Của, đi" },
      { char: "也", hanViet: "dã", meaning: "Cũng" },
      { char: "心", hanViet: "tâm", meaning: "Trái tim" }
    ]
  },
  {
    id: 8,
    name: "Nét Triết (Nét Sổ Móc)",
    hanzi: "㇉",
    pinyin: "zhé",
    hanViet: "chiết",
    description: "Nét sổ có góc gấp, thường sang phải",
    svg: "M 50 20 L 50 60 L 80 60",
    examples: ["口", "日", "田"],
    practiceChars: [
      { char: "口", hanViet: "khẩu", meaning: "Miệng" },
      { char: "日", hanViet: "nhật", meaning: "Mặt trời, ngày" },
      { char: "田", hanViet: "điền", meaning: "Ruộng" }
    ]
  }
];

// Helper function để lấy nét theo ID
export function getStrokeById(id) {
  return basicStrokes.find(stroke => stroke.id === id);
}

// Helper function để lấy nét theo tên
export function getStrokeByName(name) {
  return basicStrokes.find(stroke => stroke.name === name || stroke.hanzi === name);
}

