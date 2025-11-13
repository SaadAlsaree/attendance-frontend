<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/9113740/201498864-2a900c64-d88f-4ed4-b5cf-770bcb57e1f5.png">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/9113740/201498152-b171abb8-9225-487a-821c-6ff49ee48579.png">
</picture>

<div align="center"><strong>Next.js Admin Dashboard Starter Template With Shadcn-ui</strong></div>
<div align="center">Built with the Next.js 15 App Router</div>
<br />
<div align="center">
<a href="https://dub.sh/shadcn-dashboard">View Demo</a>
<span>
</div>

## Overview

This is a starter template using the following stack:

- Framework - [Next.js 15](https://nextjs.org/13)
- Language - [TypeScript](https://www.typescriptlang.org)
- Styling - [Tailwind CSS v4](https://tailwindcss.com)
- Components - [Shadcn-ui](https://ui.shadcn.com)
- Schema Validations - [Zod](https://zod.dev)
- State Management - [Zustand](https://zustand-demo.pmnd.rs)
- Search params state manager - [Nuqs](https://nuqs.47ng.com/)
- Tables - [Tanstack Data Tables](https://ui.shadcn.com/docs/components/data-table) • [Dice UI](https://www.diceui.com/docs/components/data-table)
- Forms - [React Hook Form](https://ui.shadcn.com/docs/components/form)
- Command+k interface - [kbar](https://kbar.vercel.app/)
- Linting - [ESLint](https://eslint.org)
- Pre-commit Hooks - [Husky](https://typicode.github.io/husky/)
- Formatting - [Prettier](https://prettier.io)

_If you are looking for a React admin dashboard starter, here is the [repo](https://github.com/Kiranism/react-shadcn-dashboard-starter)._

## Pages

| Pages                                                                                 | Specifications                                                                                                                                                 |
| :------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Dashboard (Overview)](https://next-shadcn-dashboard-starter.vercel.app/dashboard)    | Cards with recharts graphs for analytics.Parallel routes in the overview sections with independent loading, error handling, and isolated component rendering . |
| [Product](https://next-shadcn-dashboard-starter.vercel.app/dashboard/product)         | Tanstack tables with server side searching, filter, pagination by Nuqs which is a Type-safe search params state manager in nextjs                              |
| [Product/new](https://next-shadcn-dashboard-starter.vercel.app/dashboard/product/new) | A Product Form with shadcn form (react-hook-form + zod).                                                                                                       |
| [Profile](https://next-shadcn-dashboard-starter.vercel.app/dashboard/profile)         | Simple user profile page with mock data                                                                                                                        |
| [Kanban Board](https://next-shadcn-dashboard-starter.vercel.app/dashboard/kanban)     | A Drag n Drop task management board with dnd-kit and zustand to persist state locally.                                                                         |
| [Not Found](https://next-shadcn-dashboard-starter.vercel.app/dashboard/notfound)      | Not Found Page Added in the root level                                                                                                                         |
| -                                                                                     | -                                                                                                                                                              |

## Feature based organization

```plaintext
src/
├── app/ # Next.js App Router directory
│ ├── (dashboard)/ # Dashboard route group
│ │ ├── layout.tsx
│ │ ├── loading.tsx
│ │ └── page.tsx
│ └── api/ # API routes
│
├── components/ # Shared components
│ ├── ui/ # UI components (buttons, inputs, etc.)
│ └── layout/ # Layout components (header, sidebar, etc.)
│
├── features/ # Feature-based modules
│ ├── feature/
│ │ ├── components/ # Feature-specific components
│ │ ├── actions/ # Server actions
│ │ ├── schemas/ # Form validation schemas
│ │ └── utils/ # Feature-specific utilities
│ │
├── lib/ # Core utilities and configurations
│ ├── db/ # Database utilities
│ └── utils/ # Shared utilities
│
├── hooks/ # Custom hooks
│ └── use-debounce.ts
│
├── stores/ # Zustand stores
│ └── dashboard-store.ts
│
└── types/ # TypeScript types
└── index.ts
```

## Getting Started

> [!NOTE]  
> We are using **Next 15** with **React 19**, follow these steps:

Clone the repo:

```
git clone https://github.com/Kiranism/next-shadcn-dashboard-starter.git
```

- `pnpm install` ( we have legacy-peer-deps=true added in the .npmrc)
- Create a `.env.local` file by copying the example environment file:
  `cp env.example.txt .env.local`
- Add the required environment variables to the `.env.local` file.
- `pnpm run dev`

You should now be able to access the application at http://localhost:3000.

> [!WARNING]
> After cloning or forking the repository, be cautious when pulling or syncing with the latest changes, as this may result in breaking conflicts.

Cheers! 🥂

# نظام إدارة الحضور والانصراف

## نظرة عامة

نظام متكامل لإدارة الحضور والانصراف للموظفين مع دعم قارئات RFID والتحكم في الوصول.

## الميزات الرئيسية

### 👥 إدارة الموظفين

- ✅ إضافة وتعديل وحذف الموظفين
- ✅ رفع صور الموظفين
- ✅ إدارة الأقسام والمديرين
- ✅ تصنيف الموظفين (مدير/موظف)

### 🔐 نظام الحضور والانصراف

- ✅ تسجيل الحضور والانصراف
- ✅ استخدام قارئات RFID
- ✅ تتبع الوقت بدقة
- ✅ تقارير مفصلة

### 📊 التقارير والإحصائيات

- ✅ تقارير الحضور اليومية
- ✅ إحصائيات شهرية وسنوية
- ✅ تحليل أنماط الحضور
- ✅ تصدير التقارير

### 🎯 واجهة المستخدم

- ✅ تصميم متجاوب (Responsive)
- ✅ دعم اللغة العربية
- ✅ واجهة سهلة الاستخدام
- ✅ نظام تنبيهات متقدم

## الميزات الجديدة - قارئ RFID

### 🔍 مكون قارئ RFID

تم إضافة مكون متخصص لقراءة رموز RFID مع الميزات التالية:

#### الميزات المتوفرة

- **قراءة تلقائية**: قراءة رمز RFID عند تمرير البطاقة
- **تغذية راجعة بصرية**: تغيير لون الحقل حسب حالة القراءة
- **رسائل حالة**: إشعارات واضحة لحالة القراءة
- **أصوات تنبيه**: أصوات نجاح وخطأ (اختياري)
- **تحقق من صحة البيانات**: التحقق من تنسيق رمز RFID
- **واجهة سهلة الاستخدام**: زر مسح مع أيقونات واضحة

#### حالات القراءة

1. **جاهز للقراءة**: زر أزرق مع أيقونة المسح
2. **جاري القراءة**: زر أحمر مع أيقونة دوارة
3. **نجح القراءة**: زر أخضر مع علامة صح
4. **فشل القراءة**: زر أحمر مع علامة خطأ

### 🧪 صفحة اختبار RFID

- صفحة مخصصة لاختبار قارئات RFID
- عرض نتائج الاختبار في الوقت الفعلي
- تتبع حالة الاتصال بالقارئ
- تعليمات مفصلة للاستخدام

## التقنيات المستخدمة

### Frontend

- **Next.js 14** - إطار العمل الرئيسي
- **React 18** - مكتبة واجهة المستخدم
- **TypeScript** - لغة البرمجة
- **Tailwind CSS** - تنسيق الواجهة
- **Shadcn/ui** - مكونات واجهة المستخدم
- **React Hook Form** - إدارة النماذج
- **Zod** - التحقق من صحة البيانات

### Backend

- **ASP.NET Core** - إطار العمل الخلفي
- **Entity Framework** - إدارة قاعدة البيانات
- **SQL Server** - قاعدة البيانات
- **JWT** - المصادقة والتفويض

## التثبيت والتشغيل

### المتطلبات

- Node.js 18+
- npm أو yarn
- قارئ RFID (اختياري)

### تثبيت التبعيات

```bash
npm install
# أو
yarn install
```

### تشغيل المشروع

```bash
npm run dev
# أو
yarn dev
```

### اختبار قارئ RFID

```bash
# افتح المتصفح على
http://localhost:3000/rfid-test
```

## إعداد قارئ RFID

### 1. توصيل القارئ

```bash
# تأكد من توصيل قارئ RFID بالكمبيوتر
# معظم قارئات RFID تعمل كأجهزة إدخال USB
```

### 2. اختبار القارئ

```bash
# افتح صفحة اختبار RFID
# اضغط على زر المسح
# مرر بطاقة RFID على القارئ
# راقب النتائج
```

### 3. الاستخدام في النماذج

```bash
# في نموذج إضافة/تعديل الموظف
# اضغط على زر المسح بجانب حقل RFID
# مرر البطاقة على القارئ
# سيتم ملء الحقل تلقائياً
```

## هيكل المشروع

```
src/
├── app/                    # صفحات التطبيق
│   ├── rfid-test/         # صفحة اختبار RFID
│   └── ...
├── components/            # مكونات واجهة المستخدم
│   ├── ui/               # مكونات أساسية
│   │   ├── rfid-reader.tsx    # مكون قارئ RFID
│   │   ├── rfid-tester.tsx    # مكون اختبار RFID
│   │   └── ...
│   └── ...
├── features/             # ميزات التطبيق
│   ├── employee/         # إدارة الموظفين
│   └── ...
└── ...
```

## الاستخدام

### إضافة موظف جديد

1. انتقل إلى صفحة إدارة الموظفين
2. اضغط على "إضافة موظف جديد"
3. املأ المعلومات الأساسية
4. استخدم قارئ RFID لقراءة رمز البطاقة
5. ارفع صورة الموظف
6. احفظ البيانات

### اختبار قارئ RFID

1. انتقل إلى صفحة اختبار RFID
2. تأكد من توصيل القارئ
3. اضغط على زر المسح
4. مرر بطاقة RFID على القارئ
5. راقب النتائج والتأكد من صحة القراءة

## المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. إجراء التغييرات
4. إضافة الاختبارات
5. إنشاء Pull Request

## الدعم

إذا واجهت أي مشاكل أو لديك أسئلة:

- **البريد الإلكتروني**: support@company.com
- **التوثيق**: [docs/rfid-reader-setup.md](./docs/rfid-reader-setup.md)
- **صفحة الاختبار**: `/rfid-test`

## الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف [LICENSE](./LICENSE) للتفاصيل.

---

**ملاحظة**: تأكد من اختبار قارئ RFID قبل الاستخدام في البيئة الإنتاجية.
