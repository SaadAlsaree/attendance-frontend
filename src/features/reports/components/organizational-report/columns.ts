export const columns: { label: string; value: string, className: string }[] = [
    { label: 'الموظف', value: 'employeeName', className: 'w-1/7' },
    { label: 'الجهة', value: 'organizationalUnitName', className: 'w-1/9' },
    { label: 'اليوم', value: 'date', className: 'w-1/10' },
    { label: 'وقت الدخول', value: 'checkInTime', className: 'w-1/10' },
    { label: 'وقت الخروج', value: 'checkOutTime', className: 'w-1/10' },
    { label: 'متأخر', value: 'isLate', className: 'w-1/9' },
    { label: 'مبكر', value: 'isEarlyLeave', className: 'w-1/9' },
    // { label: 'مبصم', value: 'isOnLeave', className: 'w-1/4' },
    // { label: 'غير مبصم', value: 'isAbsent', className: 'w-1/4' },
    { label: 'مدة العمل الإضافي', value: 'overtimeDuration', className: 'w-1/9' },

]