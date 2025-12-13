
# 🎨 StartupAI Landing Page V2 — Official Color Style Guide

**Purpose:** Defines the official brand and UI color palette for StartupAI’s aesthetic redesign (Clean SaaS / "Firecrawl" Style).

---

## 1. Brand Primary Colors

The core identity is defined by a high-contrast interaction between Stark Black and **Brand Orange**.

| Swatch | Color Name | Hex Code | Tailwind Utility | Usage Guidelines |
| :--- | :--- | :--- | :--- | :--- |
| 🟧 | **Brand Orange** | `#FF6A3D` | `bg-[#FF6A3D]` <br> `text-[#FF6A3D]` | Primary CTA buttons, active states, key visual accents, text highlights. |
| 🔸 | **Orange Hover** | `#E55A2D` | `hover:bg-[#E55A2D]` | Hover states for primary buttons and interactive elements. |
| 🟠 | **Orange Surface** | `#FFF7ED` | `bg-brand-50` | Subtle backgrounds for badges, alerts, or active dropdown items. |
| 🔶 | **Orange Border** | `#FFEDD5` | `border-brand-100` | Borders for orange-tinted cards or inputs. |

---

## 2. Neutral Scale

A stark, high-contrast greyscale used for structure, typography, and depth.

| Swatch | Color Name | Hex Code | Tailwind Utility | Usage Guidelines |
| :--- | :--- | :--- | :--- | :--- |
| ⬛️ | **Obsidian** | `#111827` | `bg-slate-900` <br> `text-slate-900` | **Main Headings**, strong bold text, primary navigation backgrounds, solid black buttons. |
| 📓 | **Slate** | `#6B7280` | `text-slate-500` | **Body Text**, secondary descriptions, inactive labels, subheaders. |
| 🌪 | **Ash** | `#9CA3AF` | `text-slate-400` | Footer text, input placeholders, tertiary meta-data. |
| 🌫 | **Border Gray** | `#E5E7EB` | `border-slate-200` | Card borders, dividers, input borders. |
| ⬜️ | **Surface Gray** | `#F9FAFB` | `bg-slate-50` | Main page background (alternating sections), input backgrounds. |
| ⬜️ | **Canvas White** | `#FFFFFF` | `bg-white` | Card surfaces, sticky navbar, input fields, modal backgrounds. |

---

## 3. Semantic / Utility Colors

Functional colors for status indication and technical elements.

| Swatch | Color Name | Hex Code | Tailwind Utility | Usage Guidelines |
| :--- | :--- | :--- | :--- | :--- |
| 🟩 | **Success Green** | `#10B981` | `text-emerald-500` | "Completed" checks, annual pricing discount badges, success toasts. |
| 🌌 | **Code Background** | `#0F172A` | `bg-slate-950` | Dark background for code blocks, terminal windows, and API previews. |
| 🌑 | **Code Header** | `#020617` | `bg-black` | Title bars for code windows or terminal headers. |

---

## 4. Gradients

Used sparingly to add depth to the flat design system.

### **Hero Glow**
*   **CSS:** `radial-gradient(circle at center, #FFFFFF 0%, transparent 70%)`
*   **Usage:** Placed behind hero text on top of grid backgrounds to ensure legibility and lift content.

### **Accent Gradient**
*   **Classes:** `bg-gradient-to-r from-[#FF6A3D] to-[#E55A2D]`
*   **Usage:** Primary buttons or "Special Offer" banners.

---

## 5. Tailwind Utility Snippets

Copy-paste these classes for consistent implementation.

### **Primary Button**
```html
<button class="bg-[#FF6A3D] hover:bg-[#E55A2D] text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
  Get Started
</button>
```

### **Secondary Button**
```html
<button class="bg-white border border-slate-200 text-[#111827] font-bold py-3 px-6 rounded-lg hover:bg-slate-50 transition-colors">
  View Documentation
</button>
```

### **Card Surface**
```html
<div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
  <!-- Content -->
</div>
```

### **Badge (Orange)**
```html
<span class="bg-[#FFF7ED] text-[#FF6A3D] border border-[#FFEDD5] px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
  New
</span>
```

---

## 6. Best Practice Guidelines

1.  **Contrast is King:** Always use **Obsidian (`#111827`)** for headings. Never use pure black (`#000000`) for text; it causes eye strain on white backgrounds.
2.  **Orange vs. Action:** Only use **Brand Orange** for interactive elements (buttons, links) or vital highlights. Do not use it for large background areas unless it is a specific call-to-action section.
3.  **Borders:** Use **Border Gray (`#E5E7EB`)** for subtle separation. Use **Orange Border** only when an item is selected or active.
4.  **Whitespace:** This design system relies on heavy whitespace. Padding inside cards should be at least `p-6` or `p-8`.
