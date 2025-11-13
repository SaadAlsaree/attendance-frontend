export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts
    }).format(new Date(date));
  } catch (_err) {
    return '';
  }
}

export function isoDate(date: Date | string | number | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!date) return '';

  try {
    return new Date(date).toISOString();
  } catch (_err) {
    return '';
  }
}

/**
 * ترجع التاريخ بصيغة ISO لمنطقة بغداد (UTC+3)
 * @param date التاريخ المراد تحويله
 * @returns التاريخ بصيغة ISO مع منطقة بغداد الزمنية
 */
export function baghdadIsoDate(date: Date | string | number | undefined): string {
  if (!date) return '';

  try {
    const dateObj = new Date(date);

    // إضافة 3 ساعات لتحويل UTC إلى منطقة بغداد
    const baghdadTime = new Date(dateObj.getTime() + (3 * 60 * 60 * 1000));

    // ترجيع بصيغة ISO مع إزالة Z (UTC indicator) وإضافة +03:00
    return baghdadTime.toISOString().replace('Z', '+03:00');
  } catch (_err) {
    return '';
  }
}

/**
 * ترجع التاريخ بصيغة ISO لمنطقة بغداد مع خيارات تخصيص
 * @param date التاريخ المراد تحويله
 * @param includeTime هل يتضمن الوقت أم لا
 * @returns التاريخ بصيغة ISO مع منطقة بغداد الزمنية
 */
export function baghdadIsoDateWithOptions(
  date: Date | string | number | undefined,
  includeTime: boolean = true
): string {
  if (!date) return '';

  try {
    const dateObj = new Date(date);

    // إضافة 3 ساعات لتحويل UTC إلى منطقة بغداد
    const baghdadTime = new Date(dateObj.getTime() + (3 * 60 * 60 * 1000));

    if (includeTime) {
      // ترجيع بصيغة ISO كاملة مع الوقت
      return baghdadTime.toISOString().replace('Z', '+03:00');
    } else {
      // ترجيع بصيغة ISO للتاريخ فقط بدون وقت
      const year = baghdadTime.getFullYear();
      const month = String(baghdadTime.getMonth() + 1).padStart(2, '0');
      const day = String(baghdadTime.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (_err) {
    return '';
  }
}
