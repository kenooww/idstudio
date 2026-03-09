# 🪪 CardForge — ID Card Studio

A dynamic ID card generator built with React. Connects to Google Sheets, supports custom Photoshop backgrounds, and prints to PDF.

---

## 📁 Project Structure

```
CardForge/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── IDCardStudio.jsx     # Main all-in-one studio component
│   ├── hooks/
│   │   ├── useDesign.js         # Design state management
│   │   └── useGoogleSheets.js   # Google Sheets API hook
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

---

## 🔑 Google Sheets Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → Enable **Google Sheets API**
3. Go to **Credentials** → **Create API Key**
4. Restrict key to **Google Sheets API**
5. Share your sheet: **Anyone with link → Viewer**

---

## 📋 Required Sheet Columns

| Column           | Side  | Required |
|------------------|-------|----------|
| Full Name        | Front | ✅        |
| Employee ID      | Front | ✅        |
| Photo URL        | Front | Optional |
| Guardian Name    | Back  | Optional |
| Address          | Back  | Optional |
| Contact Number   | Back  | Optional |

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 Live Design Editor | Real-time card preview with sliders & color pickers |
| 🖼️ Custom Background | Upload PNG/JPG (Photoshop export) for front & back |
| 📸 Photo Border Palette | 12-color quick palette + custom color picker |
| ↕️ Orientation | Portrait & Landscape (CR80 standard) |
| 🔗 Google Sheets API | Live data fetch — no CSV export needed |
| 🖨️ Print to PDF | A4 layout, 8 cards/page, backgrounds included |

---

## 🖨️ Print Tips

When the browser print dialog opens:
- Destination → **Save as PDF**
- Paper size → **A4**
- Margins → **None**
- ✅ Check **Background graphics**
