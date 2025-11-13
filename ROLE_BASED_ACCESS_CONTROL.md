# نظام التحكم في الصلاحيات (Role-Based Access Control)

## نظرة عامة

تم تطبيق نظام التحكم في الصلاحيات على التبويبات في الشريط الجانبي للتطبيق، مما يضمن أن المستخدمين يرون فقط التبويبات التي لديهم صلاحية للوصول إليها.

## التحسينات المطبقة

### 1. نظام الأدوار (Role System)

- **المصدر**: `src/features/system/users-permissions/types/users-permissions.ts`
- **الأدوار المتاحة**:
  - `Admin` (1) - مسؤول
  - `User` (2) - مستخدم
  - `Manager` (3) - مدير
  - `Employee` (4) - موظف
  - `Guest` (5) - زائر
  - `HR_Manager` (6) - مدير الموارد البشرية
  - `Viewer` (7) - مشاهد
  - `SuperAdmin` (8) - مدير النظام
  - `SystemUser` (9) - مستخدم النظام
  - `SystemManager` (10) - مدير النظام

### 2. دوال مساعدة للتحقق من الصلاحيات

#### `hasRequiredRoles(userRole, requiredRoles)`

- **الوظيفة**: التحقق من امتلاك المستخدم للأدوار المطلوبة
- **المدخلات**:
  - `userRole`: دور المستخدم الحالي
  - `requiredRoles`: مصفوفة الأدوار المطلوبة
- **المخرجات**: `boolean` - صحيح إذا كان المستخدم يملك الصلاحيات المطلوبة

#### `filterNavItemsByRole(items, userRole)`

- **الوظيفة**: تصفية عناصر التنقل بناءً على دور المستخدم
- **المدخلات**:
  - `items`: مصفوفة عناصر التنقل
  - `userRole`: دور المستخدم الحالي
- **المخرجات**: مصفوفة عناصر التنقل المصفاة

### 3. تحسينات الأداء

#### Memoization

- استخدام `React.useMemo` لتصفية عناصر التنقل
- استخدام `React.memo` لمكون `NavigationItem`
- استخدام `React.useCallback` للدوال المساعدة

#### Suspense و Loading States

- إضافة `Suspense` wrapper للشريط الجانبي
- مكون `SidebarLoadingFallback` لحالة التحميل
- معالجة حالة `isLoading` من `useCurrentUser`

### 4. تحسينات الكود حسب القواعد المحددة

#### TypeScript

- استخدام `interface` بدلاً من `type` للأنواع المعقدة
- تحسين أنواع البيانات المستخدمة
- إصلاح تضارب أنواع `Role` enum

#### Naming Conventions

- استخدام `onCallback` بدلاً من `handleCallback`
- استخدام `console.log({value})` بدلاً من `console.log(value)`
- تحسين أسماء المتغيرات والدوال

#### Performance Optimization

- تقليل استخدام `use client` في المكونات الفرعية
- استخدام `Suspense` مع fallback
- تحسين re-rendering باستخدام memoization

## كيفية الاستخدام

### إضافة تبويب جديد مع صلاحيات

```typescript
{
  title: 'New Feature',
  arabicTitle: 'الميزة الجديدة',
  url: '/new-feature',
  icon: 'settings',
  requiredRoles: [Role.Admin, Role.Manager], // الأدوار المطلوبة
  items: [
    {
      title: 'Sub Feature',
      arabicTitle: 'الميزة الفرعية',
      url: '/new-feature/sub',
      icon: 'page',
      requiredRoles: [Role.Admin] // صلاحيات خاصة للعنصر الفرعي
    }
  ]
}
```

### التحقق من الصلاحيات في المكونات

```typescript
import { useCurrentUser } from '@/hooks/use-current-user';
import { Role } from '@/features/system/users-permissions/types/users-permissions';

function MyComponent() {
  const { user } = useCurrentUser();

  // التحقق من الصلاحية
  const hasAdminAccess = user?.role === Role.Admin;

  return (
    <div>
      {hasAdminAccess && <AdminOnlyContent />}
    </div>
  );
}
```

## الملفات المعدلة

1. **`src/components/layout/app-sidebar.tsx`**

   - إضافة نظام تصفية التبويبات حسب الصلاحيات
   - تحسين الأداء باستخدام memoization
   - إضافة Suspense و loading states

2. **`src/constants/data.ts`**

   - تحديث import لاستخدام Role من users-permissions
   - إضافة requiredRoles لكل تبويب

3. **`src/types/index.ts`**

   - تحديث NavItem interface لاستخدام Role الصحيح

4. **`src/hooks/use-current-user.ts`**
   - تحديث نوع البيانات المستخدم
   - إصلاح تضارب الأنواع

## الفوائد

1. **الأمان**: المستخدمون يرون فقط التبويبات المصرح لهم بها
2. **الأداء**: تحسين rendering باستخدام memoization
3. **قابلية الصيانة**: كود منظم ومتبع للقواعد المحددة
4. **قابلية التوسع**: سهولة إضافة تبويبات جديدة مع صلاحيات محددة
5. **تجربة المستخدم**: تحسين UX مع loading states

## الاختبار

لاختبار النظام:

1. تسجيل الدخول بحساب Admin - يجب رؤية جميع التبويبات
2. تسجيل الدخول بحساب Employee - يجب رؤية التبويبات المصرح بها فقط
3. تسجيل الدخول بحساب Manager - يجب رؤية التبويبات المناسبة للمدير
