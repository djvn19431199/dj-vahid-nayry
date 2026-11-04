راهنمای انتشار سایت دیجی وحید نیری روی Cloudflare Workers

۱) فایل ZIP را استخراج کنید.
۲) در پوشه پروژه، Node.js نصب باشد و اجرا کنید:
   npm install
۳) برای تست محلی:
   npx wrangler dev
۴) برای انتشار:
   npx wrangler login
   npx wrangler deploy

پس از انتشار، Cloudflare یک نشانی رایگان مانند https://dj-vahid-niri.<account>.workers.dev می‌دهد.
نیازی به خرید دامنه اختصاصی نیست.

مسیرهای بررسی:
- https://YOUR-WORKER.workers.dev/
- https://YOUR-WORKER.workers.dev/robots.txt
- https://YOUR-WORKER.workers.dev/sitemap.xml
- https://YOUR-WORKER.workers.dev/health

اختیاری - فعال‌کردن دستیار هوشمند:
در ترمینال بزنید:
npx wrangler secret put OPENAI_API_KEY
سپس کلید را در ورودی امن ترمینال وارد کنید. کلید را داخل فایل‌های سایت یا کد عمومی قرار ندهید.
برای تغییر مدل می‌توانید در تنظیمات Worker متغیر OPENAI_MODEL را قرار دهید.

ثبت در گوگل:
۱) بعد از Deploy، نشانی workers.dev را در Google Search Console با روش URL-prefix اضافه کنید.
۲) فایل sitemap.xml را در بخش Sitemaps ثبت کنید.
۳) نشانی صفحه اصلی را با URL Inspection بررسی و درخواست ایندکس بدهید.
۴) گوگل زمان مشخصی برای نمایش تعیین نمی‌کند و ایندکس یا رتبه تضمین‌شده نیست.

نکته: متاتگ تأیید گوگل موجود در نسخه قبلی حفظ شده است. اگر آن کد متعلق به حساب شما نیست یا Search Console کد تازه‌ای داده، مقدار آن را با کد خودتان جایگزین کنید.
