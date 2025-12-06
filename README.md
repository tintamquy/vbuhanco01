# 📚 Học Hán Cổ - Progressive Web App

Ứng dụng học viết chữ Hán Cổ theo lộ trình Học viện Phật giáo Việt Nam, tối ưu cho mobile với đầy đủ tính năng luyện viết và nhận diện mặt chữ.

## ✨ Tính năng

- ✍️ **Luyện viết chữ Hán** trên canvas với touch optimization
- 📚 **214 Bộ Thủ** đầy đủ với giải thích chi tiết
- 🎯 **Quiz & Test** nhiều dạng bài tập
- 📊 **Theo dõi tiến độ** học tập với localStorage
- 📖 **8 Nét căn bản** với ví dụ và luyện tập
- 🔤 **Lục Thư** - 6 phương pháp cấu tạo chữ Hán
- 📱 **PWA** - Hoạt động offline, có thể cài đặt như app
- 🎨 **UI/UX Mobile-first** - Tối ưu cho thiết bị di động

## 🛠️ Công nghệ

### Core Technologies
- **HTML5 Canvas API** với touch events optimization
- **CSS3** với animations & transitions
- **JavaScript ES6+** (Vanilla JS - no framework)
- **Service Worker** cho PWA offline

### External Libraries (CDN)
- **Hanzi Writer v3.5+** - Nhận diện và hướng dẫn viết chữ Hán
- **Animate.css v4+** - Celebration animations

## 📁 Cấu trúc Project

```
/
├── index.html
├── manifest.json
├── sw.js
├── .github/
│   └── workflows/
│       └── deploy.yml
├── css/
│   ├── style.css
│   ├── components.css
│   └── animations.css
├── js/
│   ├── app.js (main controller)
│   ├── data/
│   │   ├── strokes.js (8 nét căn bản)
│   │   ├── radicals.js (214 bộ thủ)
│   │   ├── liushu.js (6 phương pháp cấu tạo)
│   │   └── characters.js (chữ Hán theo bài học)
│   ├── modules/
│   │   ├── canvas-writer.js (canvas vẽ chữ)
│   │   ├── stroke-recognition.js (nhận diện nét)
│   │   ├── quiz-engine.js
│   │   └── progress-tracker.js
│   └── utils/
│       ├── storage.js (localStorage wrapper)
│       └── helpers.js
├── assets/
│   ├── audio/ (âm thanh hiệu ứng)
│   └── images/ (icons, backgrounds)
└── README.md
```

## 🚀 Cài đặt & Chạy

### Local Development

1. Clone repository:
```bash
git clone <repository-url>
cd vbu-hanco1
```

2. Chạy local server (cần HTTPS cho Service Worker):
```bash
# Sử dụng Python
python -m http.server 8000

# Hoặc sử dụng Node.js http-server
npx http-server -p 8000

# Hoặc sử dụng VS Code Live Server extension
```

3. Mở trình duyệt:
```
http://localhost:8000
```

**Lưu ý:** Service Worker chỉ hoạt động trên HTTPS hoặc localhost.

### Production Build

Không cần build, chỉ cần deploy các file tĩnh lên hosting.

## 📱 PWA Installation

### Trên Mobile (iOS/Android)

1. Mở ứng dụng trong trình duyệt
2. Chọn "Add to Home Screen" / "Thêm vào Màn hình chính"
3. Ứng dụng sẽ được cài đặt như native app

### Trên Desktop

1. Mở ứng dụng trong trình duyệt
2. Click vào icon "Install" trên thanh địa chỉ
3. Hoặc vào menu trình duyệt → "Install App"

## 🌐 Deployment

### Cloudflare Pages

1. Fork repository này
2. Tạo Cloudflare Pages project
3. Kết nối với GitHub repository
4. Thêm secrets vào GitHub:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
5. Push code lên branch `main` → Tự động deploy

### GitHub Actions

Workflow tự động deploy khi push lên `main` branch.

## 📖 Hướng dẫn sử dụng

### Luyện viết chữ

1. Chọn bài học từ menu
2. Click vào chữ Hán muốn luyện
3. Vẽ chữ trên canvas bằng ngón tay/stylus
4. Click "Bắt đầu Quiz" để kiểm tra thứ tự nét

### Quiz

- **Vẽ chữ theo thứ tự nét**: Vẽ chữ đúng thứ tự các nét
- **Nhận diện chữ**: Xem chữ → Chọn âm Hán Việt
- **Cho âm → Vẽ chữ**: Nghe âm → Vẽ chữ tương ứng
- **Phân loại Lục thư**: Xác định phương pháp cấu tạo

### Theo dõi tiến độ

- Xem thống kê trong "📊 Thống kê tiến độ"
- Ôn tập các chữ đã học trong "🔄 Ôn tập tổng hợp"
- Tiến độ được lưu tự động trên thiết bị

## 🎯 Tính năng chính

### 1. 8 Nét Căn Bản
- Nét Ngang (一)
- Nét Sổ (丨)
- Nét Phẩy (丿)
- Nét Mác (㇏)
- Nét Điểm (㇀)
- Nét Trích (㇐)
- Nét Ngã (㇣)
- Nét Triết (㇉)

### 2. 214 Bộ Thủ
- Đầy đủ 214 bộ thủ
- Phân loại theo số nét (1-17 nét)
- Ví dụ chữ sử dụng bộ thủ
- Âm Hán Việt và nghĩa

### 3. Lục Thư
- Tượng Hình (象形)
- Chỉ Sự (指事)
- Hội Ý (会意)
- Hình Thanh (形声)
- Chuyển Chú (转注)
- Giả Tá (假借)

### 4. Bút Thuận
- 7 quy tắc viết chữ Hán đúng thứ tự
- Ví dụ minh họa
- Luyện tập theo quy tắc

## 🔧 Tùy chỉnh

### Thay đổi màu sắc

Chỉnh sửa CSS variables trong `css/style.css`:

```css
:root {
  --primary-color: #8B4513;
  --background: #FFF8DC;
  /* ... */
}
```

### Thêm dữ liệu chữ Hán

Chỉnh sửa `js/data/characters.js` để thêm chữ mới:

```javascript
{
  hanzi: "字",
  hanViet: "tự",
  pinyin: "zì",
  meaning: "Chữ, tự",
  // ...
}
```

## 🐛 Troubleshooting

### Service Worker không hoạt động
- Đảm bảo đang chạy trên HTTPS hoặc localhost
- Xóa cache và reload trang
- Kiểm tra Console để xem lỗi

### Canvas không vẽ được
- Kiểm tra xem có touch events được enable không
- Thử trên thiết bị thật thay vì emulator
- Kiểm tra Console để xem lỗi

### Hanzi Writer không load
- Kiểm tra kết nối internet (CDN)
- Kiểm tra Console để xem lỗi load script

## 📝 License

MIT License - Tự do sử dụng cho mục đích giáo dục.

## 🙏 Credits

- **Hanzi Writer**: https://github.com/chanind/hanzi-writer
- **Animate.css**: https://animate.style/
- **Dữ liệu**: Học viện Phật giáo Việt Nam

## 📞 Liên hệ

Nếu có vấn đề hoặc đề xuất, vui lòng tạo issue trên GitHub.

---

**Chúc bạn học tốt chữ Hán Cổ! 📚✨**

