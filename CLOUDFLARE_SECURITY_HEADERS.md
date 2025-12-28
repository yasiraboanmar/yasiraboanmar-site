# إضافة Security Headers من Cloudflare Dashboard

## الطريقة الموصى بها: من Cloudflare (أسهل وأفضل)

### لماذا Cloudflare أفضل من السيرفر؟
- ✅ لا تحتاج تعديل على السيرفر
- ✅ يعمل لجميع المواقع في Cloudflare
- ✅ يمكن إدارته من مكان واحد
- ✅ أسهل في التعديل والحذف
- ✅ لا يحتاج إعادة تشغيل السيرفر

---

## خطوات الإضافة من Cloudflare:

### الطريقة 1: Transform Rules (موصى بها)

1. **سجّل الدخول إلى Cloudflare Dashboard**
2. **اختر الموقع** (`aljiyadi.com` أو `yollystore.com`)
3. **اذهب إلى**: `Rules` → `Transform Rules` → `Modify Response Header`
4. **انقر على**: `Create rule`

#### لكل Header، أنشئ قاعدة منفصلة:

#### 1. X-Frame-Options
- **Rule name**: `Add X-Frame-Options`
- **When incoming requests match**: 
  - Field: `Hostname`
  - Operator: `equals`
  - Value: `aljiyadi.com` (أو `yollystore.com`)
- **Then modify response header**:
  - Action: `Set static`
  - Header name: `X-Frame-Options`
  - Value: `DENY`
- **Deploy**

#### 2. X-XSS-Protection
- **Rule name**: `Add X-XSS-Protection`
- **When incoming requests match**: 
  - Field: `Hostname`
  - Operator: `equals`
  - Value: `aljiyadi.com` (أو `yollystore.com`)
- **Then modify response header**:
  - Action: `Set static`
  - Header name: `X-XSS-Protection`
  - Value: `1; mode=block`
- **Deploy**

#### 3. Referrer-Policy
- **Rule name**: `Add Referrer-Policy`
- **When incoming requests match**: 
  - Field: `Hostname`
  - Operator: `equals`
  - Value: `aljiyadi.com` (أو `yollystore.com`)
- **Then modify response header**:
  - Action: `Set static`
  - Header name: `Referrer-Policy`
  - Value: `strict-origin-when-cross-origin`
- **Deploy**

#### 4. Content-Security-Policy
- **Rule name**: `Add Content-Security-Policy`
- **When incoming requests match**: 
  - Field: `Hostname`
  - Operator: `equals`
  - Value: `aljiyadi.com` (أو `yollystore.com`)
- **Then modify response header**:
  - Action: `Set static`
  - Header name: `Content-Security-Policy`
  - Value: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-ancestors 'none';`

**ملاحظة**: قد تحتاج تعديل CSP حسب احتياجات موقعك (WordPress/Laravel)

---

### الطريقة 2: Page Rules (أبسط لكن أقل مرونة)

1. **اذهب إلى**: `Rules` → `Page Rules`
2. **Create Page Rule**
3. **URL**: `*aljiyadi.com/*` (أو `*yollystore.com/*`)
4. **Settings**:
   - **Add a setting** → `Security Headers`
   - اختر Headers المطلوبة
5. **Save and Deploy**

---

## القيم الموصى بها:

| Header | القيمة | الوصف |
|--------|--------|-------|
| **X-Frame-Options** | `DENY` | منع Clickjacking (أو `SAMEORIGIN` إذا تحتاج iframe) |
| **X-XSS-Protection** | `1; mode=block` | حماية من XSS |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | حماية معلومات المراجع |
| **Content-Security-Policy** | (مخصص) | سياسة أمنية شاملة |

---

## Content-Security-Policy مخصص:

### لـ WordPress (yollystore.com):
```
default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; frame-ancestors 'none';
```

### لـ Laravel (aljiyadi.com):
```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';
```

---

## التحقق من التطبيق:

بعد إضافة القواعد، تحقق:
```bash
curl -I https://aljiyadi.com | grep -iE "(x-frame|x-xss|referrer|content-security)"
```

---

## ملاحظات مهمة:

1. **Content-Security-Policy**: قد يحتاج تعديل حسب احتياجات موقعك
2. **X-Frame-Options**: إذا كان موقعك يحتاج أن يعمل في iframe، استخدم `SAMEORIGIN` بدلاً من `DENY`
3. **CSP و WordPress**: قد يحتاج إضافة domains إضافية للـ plugins

---

## الخلاصة:

✅ **استخدم Cloudflare Transform Rules** - أسهل وأفضل
❌ **لا حاجة للذهاب للسيرفر** - إلا إذا كان لديك سبب خاص

