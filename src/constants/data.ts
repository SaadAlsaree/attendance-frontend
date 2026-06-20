import { NavItem } from '@/types';
import { Role } from '@/features/system/users-permissions/types/users-permissions';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    arabicTitle: 'لوحة التحكم',
    url: '/dashboard',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    requiredRoles: [Role.Admin, Role.Manager, Role.Employee],
    items: []
  },
  {
    title: 'Attendance Management',
    arabicTitle: 'إدارة الحضور',
    url: '#',
    icon: 'settings',
    isActive: false,
    requiredRoles: [Role.Admin, Role.Manager, Role.Employee],
    items: [
      {
        title: 'View All Attendance',
        arabicTitle: 'عرض جميع الحضور',
        url: '/attendance/view-all-attendance',
        icon: 'page',
        shortcut: ['v', 'a']
      },
      {
        title: 'Not Attendance',
        arabicTitle: 'غير المبصمين',
        url: '/attendance/not-attendance',
        icon: 'page',
        shortcut: ['n', 'a']
        
      },
      {
        title: 'Attendance Logs',
        arabicTitle: 'سجلات الحضور',
        url: '/attendance/attendance-logs',
        icon: 'post',
        shortcut: ['a', 'l']
      },

    ]
  },
  {
    title: 'Employee Management',
    arabicTitle: 'إدارة الموظفين',
    url: '#',
    icon: 'user',
    isActive: false,
    requiredRoles: [Role.Admin, Role.Manager, Role.Employee],
    items: [
      {
        title: 'Employee',
        arabicTitle: 'الموظفين',
        url: '/employee',
        icon: 'user',
        shortcut: ['e', 'd']
      },
      {
        title: 'Add/Edit Employees',
        arabicTitle: 'إضافة/تعديل الموظفين',
        url: '/employee/addedit-employees',
        icon: 'userPen',
        shortcut: ['a', 'e']
      },

    ]
  },
  {
    title: 'Schedule Management',
    arabicTitle: 'إدارة الجداول',
    url: '#',
    icon: 'page',
    isActive: false,
    requiredRoles: [Role.Admin, Role.Manager, Role.Employee],
    items: [
      {
        title: 'Create Schedules',
        arabicTitle: 'الجداول',
        url: '/schedule',
        icon: 'page',
        shortcut: ['c', 's']
      },
      {
        title: 'Shifts',
        arabicTitle: 'المناوبات',
        url: '/schedule/shifts',
        icon: 'page',
        shortcut: ['s', 'h']
      },
      // {
      //   title: 'Assign Schedules',
      //   arabicTitle: 'تعيين الجداول',
      //   url: '/schedule/assign-schedules',
      //   icon: 'userPen',
      //   shortcut: ['a', 's']
      // },
      // {
      //   title: 'Schedule Templates',
      //   arabicTitle: 'قوالب الجداول',
      //   url: '/schedule/schedule-templates',
      //   icon: 'page',
      //   shortcut: ['s', 't']
      // },
      // {
      //   title: 'Schedule Reports',
      //   arabicTitle: 'تقارير الجداول',
      //   url: '/schedule/schedule-reports',
      //   icon: 'post',
      //   shortcut: ['s', 'r']
      // }
    ]
  },
  {
    title: 'Leave Management',
    arabicTitle: 'إدارة المواقف',
    url: '/leave',
    icon: 'page',
    isActive: false,
    requiredRoles: [Role.Admin, Role.Manager, Role.Employee],
  },
  {
    title: 'Reports',
    arabicTitle: 'التقارير',
    url: '#',
    icon: 'post',
    isActive: false,
    requiredRoles: [Role.Admin, Role.Manager, Role.Employee],
    items: [
      {
        title: 'Organizational Report',
        arabicTitle: 'تقارير الجهات',
        url: '/reports/organizational-report',
        icon: 'settings',
        shortcut: ['l', 'r'],
        requiredRoles: [Role.Admin, Role.Manager, Role.Employee],
      },
      {
        title: 'Employee Report',
        arabicTitle: 'تقرير موظف',
        url: '/reports/employee-report',
        icon: 'user',
        shortcut: ['e', 'r'],
        requiredRoles: [Role.Admin],
      },
    ]
  },
  {
    title: 'Reports & Analytics',
    arabicTitle: 'التقارير والتحليلات',
    url: '#',
    icon: 'post',
    isActive: false,
    requiredRoles: [Role.Admin, Role.Manager],
    items: [
      // {
      //   title: 'Comprehensive Attendance Report',
      //   arabicTitle: 'تقرير الحضور الشامل',
      //   url: '/reports/comprehensive-attendance-report',
      //   icon: 'post',
      //   shortcut: ['a', 'r']
      // },
      // {
      //   title: 'Absence Reports',
      //   arabicTitle: 'تقارير الغياب',
      //   url: '/reports/absence',
      //   icon: 'post',
      //   shortcut: ['a', 'r']
      // },
      {
        title: 'Organizational Summary',
        arabicTitle: 'تقارير العام',
        url: '/reports/organizational-summary',
        icon: 'post',
        shortcut: ['a', 'r'],
        requiredRoles: [Role.Admin, Role.Manager, Role.Employee],
      },
      {
        title: 'Organizational Report',
        arabicTitle: 'تقارير الجهات',
        url: '/reports/organizational-report',
        icon: 'settings',
        shortcut: ['l', 'r'],
        requiredRoles: [Role.Admin, Role.Manager, Role.Employee],
      },
      {
        title: 'Overtime Report',
        arabicTitle: 'تقرير العمل الإضافي',
        url: '/reports/overtime-report',
        icon: 'settings',
        shortcut: ['o', 'r'],
        requiredRoles: [Role.Admin, Role.SuperAdmin, Role.Manager],
      },
      // {
      //   title: 'Leave Reports',
      //   arabicTitle: 'تقارير الإجازة',
      //   url: '/reports/leave-reports',
      //   icon: 'post',
      //   shortcut: ['l', 'r']
      // },
      // {
      //   title: 'Export Data',
      //   arabicTitle: 'تصدير البيانات',
      //   url: '/reports/export-data',
      //   icon: 'page',
      //   shortcut: ['e', 'd']
      // }
    ]
  },
  {
    title: 'System Settings',
    arabicTitle: 'إعدادات النظام',
    url: '#',
    icon: 'settings',
    isActive: false,
    requiredRoles: [Role.Admin],
    items: [
      {
        title: 'Users & Permissions',
        arabicTitle: 'المستخدمين والصلاحيات',
        url: '/system/users-permissions',
        icon: 'user',
        shortcut: ['u', 'p']
      },
      {
        title: 'Organizations/Units',
        arabicTitle: 'الجهات',
        url: '/organizational-unit',
        icon: 'billing',
        shortcut: ['o', 'u']
      },

      {
        title: 'Devices',
        arabicTitle: 'الأجهزة',
        url: '/system/devices',
        icon: 'laptop',
        shortcut: ['d', 'v']
      },

    ]
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

