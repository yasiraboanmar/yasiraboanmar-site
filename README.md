# yasiraboanmar.com

الموقع الشخصي ومدونة الموارد البشرية لـ **ياسر الجيادي** — قائد موارد بشرية.
موقع ثنائي اللغة (عربي/إنجليزي) مبني على [Astro](https://astro.build)، يُستضاف على Cloudflare Pages ويُحرَّر عبر Decap CMS.

Personal site and HR blog for **Yasir Aljiyadi**. A bilingual (Arabic/English) static site built with Astro, hosted on Cloudflare Pages, and edited through Decap CMS.

## 🛠️ التقنيات / Stack

| | |
|---|---|
| الإطار / Framework | [Astro](https://astro.build) `^6.1.5` (SSG) |
| الإضافات / Integrations | `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss` |
| الاستضافة / Hosting | Cloudflare Pages (+ Pages Functions) |
| إدارة المحتوى / CMS | Decap CMS + GitHub OAuth |
| التحليلات / Analytics | Cloudflare Web Analytics |
| اللغات / Languages | العربية (افتراضي، RTL) + English (LTR) |
| Node | `>=22.12.0` |

## 🌍 ثنائية اللغة / Bilingual

الموقع مرآة كاملة بين اللغتين: العربية على الجذر `/` والإنجليزية تحت `/en/`.
الربط بين النسختين يعتمد على **توحيد اسم الملف (slug)** بين `src/content/blog/ar/` و `src/content/blog/en/`، ويتولّى مبدّل اللغة في شريط التنقّل الانتقالَ بين النسختين مع البقاء على نفس الصفحة.

The site mirrors both languages: Arabic at the root `/` and English under `/en/`. Cross-linking relies on **matching file slugs** between `src/content/blog/ar/` and `src/content/blog/en/`.

## 📁 هيكل المشروع / Project Structure

```text
/
├── astro.config.mjs          # إعداد Astro (الموقع + الإضافات)
├── public/                   # أصول ثابتة
│   ├── admin/                # لوحة Decap CMS (index.html + config.yml)
│   ├── images/blog/          # صور المقالات
│   ├── _headers              # رؤوس أمان Cloudflare
│   └── robots.txt            # SEO + حظر بوتات تدريب الذكاء الاصطناعي
├── src/
│   ├── content.config.ts     # تعريف مجموعتي المدونة (blog_ar / blog_en)
│   ├── layouts/Base.astro    # التخطيط الأساسي (SEO / Open Graph / Schema.org)
│   ├── components/           # Navbar, Footer, CookieConsent
│   ├── content/blog/{ar,en}/ # المقالات بصيغة Markdown
│   ├── pages/                # الصفحات والمسارات (العربي بالجذر، الإنجليزي تحت /en)
│   └── styles/global.css     # أنماط الموقع
└── functions/                # Cloudflare Pages Functions
    ├── admin/[[path]].js      #   حماية /admin بـ Basic Auth
    └── api/                   #   GitHub OAuth + إحصائيات Cloudflare
```

## 🗺️ المسارات / Routes

| عربي | إنجليزي | الوصف |
|------|---------|-------|
| `/` | `/en/` | الصفحة الرئيسية |
| `/blog/` | `/en/blog/` | قائمة المقالات |
| `/blog/[slug]/` | `/en/blog/[slug]/` | صفحة المقال |
| `/privacy/`, `/terms/`, `/disclaimer/` | `/en/privacy/`, `/en/terms/`, `/en/disclaimer/` | صفحات قانونية |
| `/rss.xml` | `/en/rss.xml` | تغذية RSS |
| `/sitemap-index.xml` | — | خريطة الموقع (تلقائية) |

## ✍️ المحتوى / Content

تُدار المقالات عبر **Content Collections** (`src/content.config.ts`) في مجموعتين منفصلتين: `blog_ar` و `blog_en`. كل مقال ملف Markdown بترويسة (frontmatter):

```yaml
url_slug: my-post-slug      # يجب أن يطابق النسخة الأخرى
title: "عنوان المقال"
description: "وصف موجز"
pubDate: 2026-01-01
tags: [الرواتب, الامتثال]
draft: false
linkedinPosted: false
cover: ""                   # اختياري
```

التحرير يتم من لوحة التحكم على `/admin` (Decap CMS)، أو بإضافة ملفات Markdown مباشرة.

## ⚙️ الأتمتة / Automation

عند دفع مقال جديد إلى `main`، يقوم سير عمل GitHub Actions (`.github/workflows/post-to-linkedin.yml`) بنشره تلقائيًا على **LinkedIn** (نسخة عربية وإنجليزية منفصلتان، مع تجاهل المسودّات).

## 🔐 متغيرات البيئة / Environment Variables

تُضبط في Cloudflare Pages (وأسرار GitHub للأتمتة):

| المتغير | الوظيفة |
|---------|---------|
| `ADMIN_PASSWORD` | حماية لوحة `/admin` |
| `GH_CLIENT_ID`, `GH_CLIENT_SECRET` | GitHub OAuth لـ Decap CMS |
| `CF_ANALYTICS_TOKEN` | جلب إحصائيات Cloudflare |
| `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_PERSON_URN` | النشر التلقائي على LinkedIn (أسرار GitHub) |

## 🧞 الأوامر / Commands

تُشغَّل من جذر المشروع:

| الأمر / Command | الوظيفة / Action |
| :--- | :--- |
| `npm install` | تثبيت التبعيات |
| `npm run dev` | خادم تطوير محلي على `localhost:4321` |
| `npm run build` | بناء الموقع للإنتاج في `./dist/` |
| `npm run preview` | معاينة البناء محليًا |
| `npm run astro ...` | تشغيل أوامر Astro CLI |
