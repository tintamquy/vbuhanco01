// CHỮ HÁN THEO BÀI HỌC - Lộ trình Học viện Phật giáo Việt Nam
export const lessons = {
  lesson1: {
    title: "Bài 1: Các Nét Căn Bản",
    description: "Học 8 nét căn bản của chữ Hán",
    sections: [
      {
        id: "1.1",
        name: "Nét Ngang (一)",
        characters: [
          {
            hanzi: "一",
            hanViet: "nhất",
            pinyin: "yī",
            meaning: "Số một",
            strokes: 1,
            radical: "一",
            strokeOrder: "一",
            compounds: ["一人", "一天", "一百"],
            sentences: ["一心一意 (nhất tâm nhất ý - một lòng một dạ)"],
            liushuType: "chỉ sự",
            etymology: "Một nét ngang biểu thị số một"
          },
          {
            hanzi: "二",
            hanViet: "nhị",
            pinyin: "èr",
            meaning: "Số hai",
            strokes: 2,
            radical: "二",
            strokeOrder: "一 一",
            compounds: ["二十", "二百", "第二"],
            sentences: ["二心 (nhị tâm - hai lòng)"],
            liushuType: "chỉ sự",
            etymology: "Hai nét ngang biểu thị số hai"
          },
          {
            hanzi: "三",
            hanViet: "tam",
            pinyin: "sān",
            meaning: "Số ba",
            strokes: 3,
            radical: "一",
            strokeOrder: "一 一 一",
            compounds: ["三人", "三十", "三百"],
            sentences: ["三心二意 (tam tâm nhị ý - ba lòng hai ý)"],
            liushuType: "chỉ sự",
            etymology: "Ba nét ngang biểu thị số ba"
          }
        ]
      },
      {
        id: "1.2",
        name: "Nét Sổ (丨)",
        characters: [
          {
            hanzi: "十",
            hanViet: "thập",
            pinyin: "shí",
            meaning: "Số mười",
            strokes: 2,
            radical: "十",
            strokeOrder: "一 丨",
            compounds: ["十人", "十字", "二十"],
            sentences: ["十全十美 (thập toàn thập mỹ - hoàn hảo)"],
            liushuType: "chỉ sự",
            etymology: "Nét ngang + nét sổ = mười"
          },
          {
            hanzi: "王",
            hanViet: "vương",
            pinyin: "wáng",
            meaning: "Vua, vương",
            strokes: 4,
            radical: "王",
            strokeOrder: "一 一 一 丨",
            compounds: ["國王", "王子", "大王"],
            sentences: ["王者 (vương giả - bậc vua)"],
            etymology: "Ba nét ngang (trời, người, đất) xuyên bởi nét sổ (người cai trị)"
          },
          {
            hanzi: "中",
            hanViet: "trung",
            pinyin: "zhōng",
            meaning: "Giữa, trung tâm",
            strokes: 4,
            radical: "丨",
            strokeOrder: "丨 一 一 一",
            compounds: ["中心", "中國", "中間"],
            sentences: ["中正 (trung chính - công bằng)"],
            etymology: "Nét sổ xuyên qua hình vuông, chỉ trung tâm"
          },
          {
            hanzi: "川",
            hanViet: "xuyên",
            pinyin: "chuān",
            meaning: "Sông",
            strokes: 3,
            radical: "川",
            strokeOrder: "丿 丨 丨",
            compounds: ["山川", "河川", "四川"],
            sentences: ["川流不息 (xuyên lưu bất tức - không ngừng)"],
            liushuType: "tượng hình",
            etymology: "Ba nét sổ như dòng nước chảy"
          }
        ]
      },
      {
        id: "1.3",
        name: "Nét Phẩy (丿) & Nét Mác (㇏)",
        characters: [
          {
            hanzi: "人",
            hanViet: "nhân",
            pinyin: "rén",
            meaning: "Người",
            strokes: 2,
            radical: "人",
            strokeOrder: "丿 ㇏",
            compounds: ["人才", "大人", "人間", "夫人"],
            sentences: ["人山人海 (nhân sơn nhân hải - đông người)"],
            liushuType: "tượng hình",
            etymology: "Hình người đứng với hai chân"
          },
          {
            hanzi: "八",
            hanViet: "bát",
            pinyin: "bā",
            meaning: "Số tám",
            strokes: 2,
            radical: "八",
            strokeOrder: "丿 ㇏",
            compounds: ["八人", "十八", "八月"],
            sentences: ["八仙過海 (bát tiên quá hải - tám vị tiên)"],
            etymology: "Hai nét tách ra, biểu thị chia rẽ"
          },
          {
            hanzi: "入",
            hanViet: "nhập",
            pinyin: "rù",
            meaning: "Vào",
            strokes: 2,
            radical: "入",
            strokeOrder: "丿 ㇏",
            compounds: ["入口", "進入", "收入"],
            sentences: ["入鄉隨俗 (nhập hương tùy tục - nhập gia tùy tục)"],
            etymology: "Hai nét hội tụ như đi vào"
          },
          {
            hanzi: "千",
            hanViet: "thiên",
            pinyin: "qiān",
            meaning: "Ngàn",
            strokes: 3,
            radical: "十",
            strokeOrder: "丿 一 丨",
            compounds: ["千人", "三千", "千萬"],
            sentences: ["千言萬語 (thiên ngôn vạn ngữ - ngàn lời vạn ý)"]
          }
        ]
      },
      {
        id: "1.4",
        name: "Nét Điểm (㇀)",
        characters: [
          {
            hanzi: "主",
            hanViet: "chủ",
            pinyin: "zhǔ",
            meaning: "Chủ, chủ nhân",
            strokes: 5,
            radical: "丶",
            strokeOrder: "丶 一 一 丨 一",
            compounds: ["主人", "主要", "主觀"],
            sentences: ["主人 (chủ nhân - chủ nhà)"]
          },
          {
            hanzi: "六",
            hanViet: "lục",
            pinyin: "liù",
            meaning: "Số sáu",
            strokes: 4,
            radical: "八",
            strokeOrder: "丶 一 丿 ㇏",
            compounds: ["六人", "十六", "六月"]
          }
        ]
      },
      {
        id: "1.5",
        name: "Nét Trích & Nét Ngã",
        characters: [
          {
            hanzi: "江",
            hanViet: "giang",
            pinyin: "jiāng",
            meaning: "Sông lớn",
            strokes: 6,
            radical: "氵",
            strokeOrder: "丶 丶 丶 一 丨 一",
            compounds: ["長江", "江河", "江水"],
            liushuType: "hình thanh"
          },
          {
            hanzi: "心",
            hanViet: "tâm",
            pinyin: "xīn",
            meaning: "Trái tim",
            strokes: 4,
            radical: "心",
            strokeOrder: "丶 ㇣ 丶 丶",
            compounds: ["心情", "心理", "心靈"],
            sentences: ["心平氣和 (tâm bình khí hòa - bình tĩnh)"],
            liushuType: "tượng hình"
          }
        ]
      },
      {
        id: "1.6",
        name: "Nét Triết (Nét Sổ Móc)",
        characters: [
          {
            hanzi: "口",
            hanViet: "khẩu",
            pinyin: "kǒu",
            meaning: "Miệng",
            strokes: 3,
            radical: "口",
            strokeOrder: "丨 一 一",
            compounds: ["口語", "入口", "出口"],
            sentences: ["口是心非 (khẩu thị tâm phi - miệng nói một đằng)"],
            liushuType: "tượng hình",
            etymology: "Hình miệng há ra"
          },
          {
            hanzi: "日",
            hanViet: "nhật",
            pinyin: "rì",
            meaning: "Mặt trời, ngày",
            strokes: 4,
            radical: "日",
            strokeOrder: "丨 一 一 一",
            compounds: ["日本", "日子", "今日"],
            sentences: ["日新月異 (nhật tân nguyệt dị - thay đổi nhanh)"],
            liushuType: "tượng hình",
            etymology: "Hình tròn của mặt trời"
          },
          {
            hanzi: "田",
            hanViet: "điền",
            pinyin: "tián",
            meaning: "Ruộng",
            strokes: 5,
            radical: "田",
            strokeOrder: "丨 一 一 一 丨",
            compounds: ["田地", "田園", "農田"],
            liushuType: "tượng hình",
            etymology: "Hình ruộng vuông với các ô"
          }
        ]
      }
    ]
  },

  lesson2: {
    title: "Bài 2: Bút Thuận",
    description: "7 quy tắc viết chữ Hán đúng thứ tự",
    rules: [
      {
        id: "rule1",
        name: "Viết từ trên xuống dưới",
        hanzi: "从上到下",
        description: "Các nét trên viết trước, nét dưới viết sau",
        examples: [
          { char: "三", hanViet: "tam", strokes: 3, order: "一 一 一" },
          { char: "言", hanViet: "ngôn", strokes: 7, order: "丶 一 一 一 一 一 一" },
          { char: "高", hanViet: "cao", strokes: 10, order: "丶 一 一 一 一 一 一 一 一 一" }
        ],
        practice: ["立", "音", "意", "章"]
      },
      {
        id: "rule2",
        name: "Viết từ trái sang phải",
        hanzi: "从左到右",
        description: "Các bộ phận bên trái viết trước, bên phải viết sau",
        examples: [
          { char: "川", hanViet: "xuyên", strokes: 3, order: "丿 丨 丨" },
          { char: "州", hanViet: "châu", strokes: 6, order: "丶 丶 丶 丿 丨 丨" },
          { char: "順", hanViet: "thuận", strokes: 12, order: "..." }
        ],
        practice: ["林", "明", "好", "休"]
      },
      {
        id: "rule3",
        name: "Nét ngang trước, nét sổ sau",
        hanzi: "先横后竖",
        description: "Khi nét ngang và nét sổ giao nhau, viết nét ngang trước",
        examples: [
          { char: "十", hanViet: "thập", strokes: 2, order: "一 丨" },
          { char: "王", hanViet: "vương", strokes: 4, order: "一 一 一 丨" },
          { char: "土", hanViet: "thổ", strokes: 3, order: "一 丨 一" }
        ],
        practice: ["古", "吉", "直", "真"]
      },
      {
        id: "rule4",
        name: "Nét phẩy trước, nét mác sau",
        hanzi: "先撇后捺",
        description: "Khi có cả nét phẩy và nét mác, viết nét phẩy trước",
        examples: [
          { char: "人", hanViet: "nhân", strokes: 2, order: "丿 ㇏" },
          { char: "八", hanViet: "bát", strokes: 2, order: "丿 ㇏" },
          { char: "父", hanViet: "phụ", strokes: 4, order: "丿 ㇏ 丿 ㇏" }
        ],
        practice: ["文", "木", "禾", "大"]
      },
      {
        id: "rule5",
        name: "Viết ngoài trước, trong sau",
        hanzi: "先外后内",
        description: "Viết khung ngoài trước, phần bên trong sau",
        examples: [
          { char: "月", hanViet: "nguyệt", strokes: 4, order: "丿 一 一 一" },
          { char: "同", hanViet: "đồng", strokes: 6, order: "一 一 一 一 一 一" },
          { char: "風", hanViet: "phong", strokes: 9, order: "..." }
        ],
        practice: ["用", "問", "間", "門"]
      },
      {
        id: "rule6",
        name: "Viết giữa trước, hai bên sau",
        hanzi: "先中间后两边",
        description: "Viết phần giữa trước, sau đó viết hai bên",
        examples: [
          { char: "小", hanViet: "tiểu", strokes: 3, order: "丨 丿 ㇏" },
          { char: "水", hanViet: "thủy", strokes: 4, order: "丨 一 一 一" },
          { char: "承", hanViet: "thừa", strokes: 8, order: "..." }
        ],
        practice: ["永", "州", "辦", "業"]
      },
      {
        id: "rule7",
        name: "Viết vào trước, đóng khung sau",
        hanzi: "先进入后封口",
        description: "Viết phần bên trong trước, sau đó đóng khung",
        examples: [
          { char: "回", hanViet: "hồi", strokes: 6, order: "丨 一 一 一 一 一" },
          { char: "國", hanViet: "quốc", strokes: 11, order: "..." },
          { char: "因", hanViet: "nhân", strokes: 6, order: "一 一 一 一 一 一" }
        ],
        practice: ["田", "日", "目", "四"]
      }
    ]
  },

  lesson3: {
    title: "Bài 3: 214 Bộ Thủ",
    description: "Học đầy đủ 214 bộ thủ cơ bản",
    note: "Học kỳ I học một nửa số bộ thủ (107/214)",
    sections: [
      {
        name: "1 nét (7 bộ)",
        strokeCount: 1,
        radicals: [1, 2, 3, 4, 5, 6]
      },
      {
        name: "2 nét (29 bộ)",
        strokeCount: 2,
        radicals: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
      },
      {
        name: "3 nét (37 bộ)",
        strokeCount: 3,
        radicals: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]
      }
    ]
  },

  lesson4: {
    title: "Bài 4: Lục Thư",
    description: "6 phương pháp cấu tạo chữ Hán",
    note: "Học từng phương pháp với ví dụ cụ thể"
  }
};

// Helper functions
export function getLessonById(lessonId) {
  return lessons[lessonId];
}

export function getCharacterByHanzi(hanzi) {
  for (const lesson of Object.values(lessons)) {
    if (lesson.sections) {
      for (const section of lesson.sections) {
        if (section.characters) {
          const char = section.characters.find(c => c.hanzi === hanzi);
          if (char) return char;
        }
      }
    }
  }
  return null;
}

export function getAllCharacters() {
  const allChars = [];
  for (const lesson of Object.values(lessons)) {
    if (lesson.sections) {
      for (const section of lesson.sections) {
        if (section.characters) {
          allChars.push(...section.characters);
        }
      }
    }
  }
  return allChars;
}

