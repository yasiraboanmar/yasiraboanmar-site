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
| قاعدة البيانات / DB | Cloudflare D1 (`yasiraboanmar-quizzes`) |
| البريد / Email | Resend (`quiz@yasiraboanmar.com`، DKIM/SPF/MX موثَّقة) |
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
│   ├── images/quizzes/       # صور OG للاختبارات (law-quiz-1/2/3.png)
│   ├── _headers              # رؤوس أمان Cloudflare
│   └── robots.txt            # SEO + حظر بوتات تدريب الذكاء الاصطناعي
├── src/
│   ├── content.config.ts     # تعريف مجموعات المحتوى (blog_ar/blog_en/quizzes_ar/quizzes_en)
│   ├── layouts/Base.astro    # التخطيط الأساسي (SEO / Open Graph / Schema.org)
│   ├── components/           # Navbar, Footer, CookieConsent, QuizPage
│   ├── content/blog/{ar,en}/ # المقالات بصيغة Markdown
│   ├── content/quizzes/{ar,en}/ # محتوى الاختبارات (JSON/YAML)
│   ├── pages/                # الصفحات والمسارات (العربي بالجذر، الإنجليزي تحت /en)
│   └── styles/global.css     # أنماط الموقع
└── functions/                # Cloudflare Pages Functions
    ├── _middleware.js         #   تدوير صور OG عشوائيًا لصفحات الاختبارات
    ├── admin/[[path]].js      #   حماية /admin بـ Basic Auth
    └── api/                   #   GitHub OAuth + إحصائيات + وظائف الاختبارات
        ├── quiz-submit.js     #     حفظ نتيجة اختبار في D1
        ├── quiz-email.js      #     إرسال نسخة النتيجة عبر Resend
        ├── quiz-stats.js      #     عدّاد المنجزين (علني)
        └── quiz-visit.js      #     تسجيل زيارة (مرة/جلسة)
```

## 🗺️ المسارات / Routes

| عربي | إنجليزي | الوصف |
|------|---------|-------|
| `/` | `/en/` | الصفحة الرئيسية |
| `/blog/` | `/en/blog/` | قائمة المقالات |
| `/blog/[slug]/` | `/en/blog/[slug]/` | صفحة المقال |
| `/quizzes/` | `/en/quizzes/` | فهرس الاختبارات التفاعلية |
| `/quizzes/[slug]/` | `/en/quizzes/[slug]/` | صفحة الاختبار الفردي |
| `/privacy/`, `/terms/`, `/disclaimer/` | `/en/privacy/`, `/en/terms/`, `/en/disclaimer/` | صفحات قانونية |
| `/rss.xml` | `/en/rss.xml` | تغذية RSS |
| `/sitemap-index.xml` | — | خريطة الموقع (تلقائية) |

## ✍️ المحتوى / Content

### المقالات / Blog

تُدار عبر **Content Collections** (`src/content.config.ts`) في مجموعتين: `blog_ar` و `blog_en`. كل مقال ملف Markdown بترويسة (frontmatter):

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

### الاختبارات التفاعلية / Quizzes

مجموعتان: `quizzes_ar` و `quizzes_en` (Content Collections). الاختبارات الحالية:

| الاختبار | الـ slug | الأسئلة | الجمهور |
|---------|---------|---------|---------|
| كم تعرف عن نظام العمل السعودي؟ | `general-employees` | 10 | عامة الموظفين |
| اختبار متخصص لمتخصصي HR | `hr-specialists` | 20 | متخصصو الموارد البشرية |

كل الأسئلة مستندة إلى نصوص نظام العمل السعودي (م/51 وتعديلاته حتى م/44) مع رقم المادة وتلميح غير مباشر لكل سؤال.

## 🧩 ميزة الاختبارات — التفاصيل التقنية

### المكوّن الرئيسي
`src/components/QuizPage.astro` — مكوّن موحَّد يستقبل `lang` و `quiz` ويعرض:
- شاشة البداية (معلومات الاختبار + أزرار الدعوة)
- شاشة الأسئلة (خيارات متعددة، شريط تقدم مجزّأ، تلميح قابل للطي)
- شاشة التسجيل الاختياري (الاسم + البريد لإرسال نسخة النتيجة)
- شاشة النتيجة (نسبة، تصنيف، confetti، شهادة قابلة للطباعة، أزرار مشاركة)

جميع الأنماط داخل `<style is:global>` لأن معظم العناصر تُبنى ديناميكيًا بجافاسكريبت وقت التشغيل.

### قاعدة البيانات / D1
اسم الـ binding: `DB` — جدولان:
- `quiz_attempts` — يُسجَّل عند إتمام الاختبار (quiz_id، النتيجة، اللغة، الوقت)
- `quiz_page_views` — يُسجَّل مرة واحدة لكل جلسة متصفح

### صور OG المتدوّلة
`functions/_middleware.js` يعترض كل طلب لمسارات `/quizzes/*` و `/en/quizzes/*`، ويستبدل وسم `og:image` في HTML باختيار عشوائي من ثلاث صور (`law-quiz-1/2/3.png`) لكل طلب — لأن روبوتات معاينة الروابط لا تُنفّذ جافاسكريبت.

### المشاركة الاجتماعية
- **مشاركة النتيجة** (بعد الإتمام): واتساب، X، نسخ الرابط، LinkedIn (حصرًا لاختبار المتخصصين)
- **دعوة الآخرين** (فهرس + شاشة البداية): واتساب، X، LinkedIn، نسخ الرابط — روابط مبنية وقت البناء بدون جافاسكريبت وقت التشغيل

### البريد الإلكتروني
زر اختياري "أرسل لي نتيجتي" يُرسل قالب بريد بتصميم شهادة عبر Resend من `quiz@yasiraboanmar.com`.

## ⚙️ الأتمتة / Automation

عند دفع مقال جديد إلى `main`، يقوم سير عمل GitHub Actions (`.github/workflows/post-to-linkedin.yml`) بنشره تلقائيًا على **LinkedIn** (نسخة عربية وإنجليزية منفصلتان، مع تجاهل المسودّات).

## 🔐 متغيرات البيئة / Environment Variables

تُضبط في Cloudflare Pages (وأسرار GitHub للأتمتة):

| المتغير | الوظيفة |
|---------|---------|
| `ADMIN_PASSWORD` | حماية لوحة `/admin` |
| `GH_CLIENT_ID`, `GH_CLIENT_SECRET` | GitHub OAuth لـ Decap CMS |
| `CF_ANALYTICS_TOKEN` | جلب إحصائيات Cloudflare |
| `RESEND_API_KEY` | إرسال بريد نتائج الاختبارات عبر Resend |
| `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_PERSON_URN` | النشر التلقائي على LinkedIn (أسرار GitHub) |
| `DB` | D1 binding لقاعدة بيانات الاختبارات (يُضبط في Cloudflare Pages لا كـ secret) |

## 🧞 الأوامر / Commands

تُشغَّل من جذر المشروع:

| الأمر / Command | الوظيفة / Action |
| :--- | :--- |
| `npm install` | تثبيت التبعيات |
| `npm run dev` | خادم تطوير محلي على `localhost:4321` |
| `npm run build` | بناء الموقع للإنتاج في `./dist/` |
| `npm run preview` | معاينة البناء محليًا |
| `npm run astro ...` | تشغيل أوامر Astro CLI |

## 📝 ملاحظات تقنية مهمة

- **Astro Scoped CSS**: العناصر المُنشأة ديناميكيًا بجافاسكريبت (أزرار، بطاقات) لا تكتسب محددات `[data-astro-cid-xxx]` — تستخدم `<style is:global>` دائمًا لأنماط هذه العناصر.
- **صور OG والروبوتات**: أي منطق يغيّر صورة المشاركة يجب تنفيذه على السيرفر (Middleware)، لأن روبوتات معاينة الروابط لا تُنفّذ جافاسكريبت.
- **شبكة الإعلانات بصفحة المقال**: `grid-template-columns: 160px minmax(0,1fr) 160px` — عمودا AdSense ثابتان، أي إضافة تخطيطية جديدة يجب ألّا تكسر هذا الغريد.
- **اسم مشروع Cloudflare Pages**: `yasir-aljiyadi` (وليس `yasiraboanmar-site`).
