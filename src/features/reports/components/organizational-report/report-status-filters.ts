import {
  EmployeeDetail,
  OrganizationalReportData,
  Unit
} from '../../types/organization-report';

// All status filters the daily organizational report supports.
// `employees`  → filters the (paginated) employeeDetails list via `predicate`
// `nonFingerprinted` / `actions` → render the full (non-paginated) side lists
// `all` → show every section
export type ReportStatusKey =
  | 'all'
  | 'present'
  | 'late'
  | 'earlyLeave'
  | 'absent'
  | 'leave'
  | 'overtime'
  | 'nonFingerprinted'
  | 'actions';

type StatusSource = 'all' | 'employees' | 'nonFingerprinted' | 'actions';

interface StatusDef {
  key: ReportStatusKey;
  label: string;
  source: StatusSource;
  predicate?: (e: EmployeeDetail) => boolean;
}

export const REPORT_STATUSES: StatusDef[] = [
  { key: 'all', label: 'الكل', source: 'all' },
  {
    key: 'present',
    label: 'حاضرون',
    source: 'employees',
    predicate: (e) => !!e.checkInTime && !e.isAbsent && !e.isOnLeave
  },
  { key: 'late', label: 'متأخرون', source: 'employees', predicate: (e) => e.isLate },
  {
    key: 'earlyLeave',
    label: 'منصرفون مبكراً',
    source: 'employees',
    predicate: (e) => e.isEarlyLeave
  },
  { key: 'absent', label: 'غائبون', source: 'employees', predicate: (e) => e.isAbsent },
  { key: 'leave', label: 'إجازات', source: 'employees', predicate: (e) => e.isOnLeave },
  {
    key: 'overtime',
    label: 'عمل إضافي',
    source: 'employees',
    predicate: (e) => !!e.overtimeDuration
  },
  { key: 'nonFingerprinted', label: 'غير مبصمون', source: 'nonFingerprinted' },
  { key: 'actions', label: 'الإجراءات', source: 'actions' }
];

export function getStatusDef(key: ReportStatusKey): StatusDef {
  return REPORT_STATUSES.find((s) => s.key === key) ?? REPORT_STATUSES[0];
}

// Which sections of a unit to render under the active status, plus the
// already-filtered employee rows. Used by BOTH the on-screen table and print
// so the two never diverge.
export interface UnitView {
  employees: EmployeeDetail[];
  showEmployees: boolean;
  showNonFingerprinted: boolean;
  showActions: boolean;
}

export function getUnitView(unit: Unit, key: ReportStatusKey): UnitView {
  const def = getStatusDef(key);
  const hasNonFp = (unit.nonFingerprintedEmployees?.length ?? 0) > 0;
  const hasActions = (unit.actionEmployees?.length ?? 0) > 0;

  if (def.source === 'all') {
    return {
      employees: unit.employeeDetails ?? [],
      showEmployees: true,
      showNonFingerprinted: hasNonFp,
      showActions: hasActions
    };
  }
  if (def.source === 'employees') {
    return {
      employees: (unit.employeeDetails ?? []).filter(def.predicate!),
      showEmployees: true,
      showNonFingerprinted: false,
      showActions: false
    };
  }
  if (def.source === 'nonFingerprinted') {
    return {
      employees: [],
      showEmployees: false,
      showNonFingerprinted: true,
      showActions: false
    };
  }
  return {
    employees: [],
    showEmployees: false,
    showNonFingerprinted: false,
    showActions: true
  };
}

// ---------------------------------------------------------------------------
// Unified row model — present employees, non-fingerprinted, and action
// employees all become rows of ONE table, each carrying status badges (like
// the متأخر flag). Used by the screen table, the mobile cards, and print.
// ---------------------------------------------------------------------------

export type RowKind = 'employee' | 'nonFingerprinted' | 'action';

export interface ReportRow {
  key: string;
  kind: RowKind;
  employeeName: string;
  employeeCode: string | null;
  organizationalUnitName: string;
  date: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  overtimeDuration: string | null;
  isLate: boolean;
  isEarlyLeave: boolean;
  isOnLeave: boolean;
  isAbsent: boolean;
  actionName: string | null;
}

export type BadgeTone = 'green' | 'red' | 'yellow' | 'gray' | 'purple';

export interface StatusBadge {
  label: string;
  tone: BadgeTone;
}

// The badge(s) shown in the الحالة column for a row.
export function getRowStatusBadges(row: ReportRow): StatusBadge[] {
  if (row.kind === 'nonFingerprinted') return [{ label: 'غير مبصم', tone: 'red' }];
  if (row.kind === 'action') {
    return [{ label: row.actionName || 'إجراء', tone: 'purple' }];
  }
  const badges: StatusBadge[] = [];
  if (row.isLate) badges.push({ label: 'متأخر', tone: 'red' });
  if (row.isEarlyLeave) badges.push({ label: 'مبكر', tone: 'gray' });
  if (row.isOnLeave) badges.push({ label: 'إجازة', tone: 'yellow' });
  if (row.isAbsent) badges.push({ label: 'غائب', tone: 'red' });
  if (badges.length === 0) badges.push({ label: 'حاضر', tone: 'green' });
  return badges;
}

// Flatten a unit into unified rows for the active status filter.
export function getUnitRows(
  unit: Unit,
  key: ReportStatusKey,
  reportDate?: string
): ReportRow[] {
  const view = getUnitView(unit, key);
  const rows: ReportRow[] = [];

  if (view.showEmployees) {
    view.employees.forEach((e) => {
      rows.push({
        key: `emp-${e.employeeId}`,
        kind: 'employee',
        employeeName: e.employeeName,
        employeeCode: e.employeeCode ?? null,
        organizationalUnitName: e.organizationalUnitName,
        date: e.date,
        checkInTime: e.checkInTime ?? null,
        checkOutTime: e.checkOutTime ?? null,
        overtimeDuration: e.overtimeDuration ?? null,
        isLate: e.isLate,
        isEarlyLeave: e.isEarlyLeave,
        isOnLeave: e.isOnLeave,
        isAbsent: e.isAbsent,
        actionName: null
      });
    });
  }

  if (view.showNonFingerprinted) {
    unit.nonFingerprintedEmployees.forEach((e, i) => {
      rows.push({
        key: `nf-${e.employeeId}-${i}`,
        kind: 'nonFingerprinted',
        employeeName: e.employeeName,
        employeeCode: null,
        organizationalUnitName: unit.unitName,
        date: reportDate ?? null,
        checkInTime: null,
        checkOutTime: null,
        overtimeDuration: null,
        isLate: false,
        isEarlyLeave: false,
        isOnLeave: false,
        isAbsent: false,
        actionName: null
      });
    });
  }

  if (view.showActions) {
    unit.actionEmployees.forEach((e, i) => {
      rows.push({
        key: `ac-${e.employeeId}-${i}`,
        kind: 'action',
        employeeName: e.employeeName,
        employeeCode: null,
        organizationalUnitName: unit.unitName,
        date: reportDate ?? null,
        checkInTime: null,
        checkOutTime: null,
        overtimeDuration: null,
        isLate: false,
        isEarlyLeave: false,
        isOnLeave: false,
        isAbsent: false,
        actionName: e.actionName
      });
    });
  }

  return rows;
}

// Count shown on each filter chip, aggregated across all units in the loaded
// data. nonFingerprinted/actions counts are exact (full lists); employee-based
// counts reflect the currently-loaded page.
export function getStatusCount(
  data: OrganizationalReportData | undefined,
  key: ReportStatusKey
): number {
  const units = data?.units ?? [];
  const def = getStatusDef(key);

  if (def.source === 'all') {
    return units.reduce(
      (n, u) =>
        n +
        (u.employeeDetails?.length ?? 0) +
        (u.nonFingerprintedEmployees?.length ?? 0) +
        (u.actionEmployees?.length ?? 0),
      0
    );
  }
  if (def.source === 'employees') {
    return units.reduce(
      (n, u) => n + (u.employeeDetails ?? []).filter(def.predicate!).length,
      0
    );
  }
  if (def.source === 'nonFingerprinted') {
    return units.reduce((n, u) => n + (u.nonFingerprintedEmployees?.length ?? 0), 0);
  }
  return units.reduce((n, u) => n + (u.actionEmployees?.length ?? 0), 0);
}
