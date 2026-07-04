'use client';
import React, { forwardRef } from 'react';
import { OrganizationalReportResponse } from '../../types/organization-report';
import { Users, UserCheck, Calendar, AlertTriangle, Timer } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/ar';
// Importing a moment locale silently makes it the GLOBAL default, which breaks
// SSR hydration everywhere (server renders 'en' digits, client renders Arabic).
// Register it, then restore the default — all usages here call .locale('ar') explicitly.
moment.locale('en');
import './print-styles.css';
import {
  BadgeTone,
  ReportStatusKey,
  getRowStatusBadges,
  getUnitRows
} from './report-status-filters';


// Map a status tone to one of the existing print-badge classes.
const PRINT_BADGE_CLASS: Record<BadgeTone, string> = {
  green: 'print-badge-normal',
  red: 'print-badge-late',
  yellow: 'print-badge-late',
  gray: 'print-badge-early',
  purple: 'print-badge-early'
};

type Props = {
  report: OrganizationalReportResponse;
  status?: ReportStatusKey;
};

const OrganizationalReportPrint = forwardRef<HTMLDivElement, Props>(
  ({ report, status = 'all' }, ref) => {
    const formatDate = (date: string) => {
      return moment(date).locale('ar').format('dddd DD/MM/YYYY');
    };

    const formatTime = (time: string) => {
      return moment(time).locale('ar').format('hh:mm A');
    };

    // Unified-row formatters (handle the empty time/day cells for
    // non-fingerprinted and action rows).
    const t = (time: string | null) =>
      time ? moment(time).locale('ar').format('hh:mm A') : '—';
    const day = (date: string | null) =>
      date ? moment(date).locale('ar').format('dddd') : '—';

    const getAttendancePercentage = () => {
      if (report?.data?.totalEmployees === 0) return 0;
      return Math.round(
        (report?.data?.totalAttendances / report?.data?.totalEmployees) * 100
      );
    };

    const getLatePercentage = () => {
      if (report?.data?.totalAttendances === 0) return 0;
      return Math.round(
        (report?.data?.totalLate / report?.data?.totalAttendances) * 100
      );
    };

    const stats = [
      {
        title: 'إجمالي الموظفين',
        value: report?.data?.totalEmployees,
        icon: Users,
        description: 'العدد الكلي للموظفين'
      },
      {
        title: 'الموظفين الحاضرين',
        value: report?.data?.totalAttendances,
        icon: UserCheck,
        description: `${getAttendancePercentage()}% من إجمالي الموظفين`
      },
      {
        title: 'الموظفين المتأخرين',
        value: report?.data?.totalLate,
        icon: AlertTriangle,
        description: `${getLatePercentage()}% من الحضور`
      },
      {
        title: 'عدد الأجازات',
        value: report?.data?.totalLeaves,
        icon: Calendar,
        description: 'إجمالي الأجازات اليوم'
      },
      {
        title: 'ساعات العمل الإضافي',
        value: report?.data?.totalOvertime,
        icon: Timer,
        description: 'إجمالي الساعات الإضافية'
      }
    ];

    return (
      <div ref={ref} className='print-container' dir='rtl'>
        <style jsx>{`
          @media print {
            .print-container {
              padding: 20px;
              font-family: 'Arial', sans-serif;
              color: #000;
              background: white;
            }

            .print-header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }

            .print-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }

            .print-date {
              font-size: 16px;
              color: #666;
            }

            .print-stats {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 15px;
              margin-bottom: 30px;
            }

            .print-stat-card {
              border: 1px solid #ddd;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
            }

            .print-stat-title {
              font-size: 12px;
              color: #666;
              margin-bottom: 5px;
            }

            .print-stat-value {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 5px;
            }

            .print-stat-desc {
              font-size: 10px;
              color: #888;
            }

            .print-unit {
              margin-bottom: 30px;
            }

            .print-unit-header {
              background: #f5f5f5;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 8px 8px 0 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
              page-break-inside: avoid;
              page-break-after: avoid;
            }

            .print-unit-title {
              font-size: 16px;
              font-weight: bold;
            }

            .print-unit-stats {
              display: flex;
              gap: 15px;
              font-size: 12px;
            }

            .print-table {
              width: 100%;
              border-collapse: collapse;
              border: 1px solid #ddd;
            }

            .print-table th,
            .print-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              font-size: 11px;
            }

            .print-table th {
              background: #f5f5f5;
              font-weight: bold;
            }

            .print-employee-name {
              text-align: right;
              font-weight: bold;
            }

            .print-employee-code {
              color: #666;
              font-size: 10px;
            }

            .print-badge {
              display: inline-block;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 9px;
              font-weight: bold;
            }

            .print-badge-late {
              background: #fee2e2;
              color: #dc2626;
            }

            .print-badge-early {
              background: #f3f4f6;
              color: #6b7280;
            }

            .print-badge-normal {
              background: #f0fdf4;
              color: #16a34a;
            }

            .print-no-break {
              page-break-inside: avoid;
            }

            .print-subsection {
              margin-top: 15px;
            }

            .print-subsection-title {
              font-size: 13px;
              font-weight: bold;
              background: #f5f5f5;
              border: 1px solid #ddd;
              border-bottom: none;
              padding: 8px 12px;
              page-break-after: avoid;
            }
          }
        `}</style>

        {/* Header */}
        <div className='print-header'>
          <div className='print-title'>التقرير الموقف اليومي</div>
          <div className='print-date'>{formatDate(report?.data?.date)}</div>
        </div>

        {/* Statistics */}
        <div className='print-stats'>
          {stats?.map((stat, index) => (
            <div key={index} className='print-stat-card'>
              <div className='print-stat-title'>{stat.title}</div>
              <div className='print-stat-value'>{stat.value}</div>
              <div className='print-stat-desc'>{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Detail tables start on page 2 — page 1 is the title + KPI summary. */}
        <div className='print-details'>
        {report?.data?.units?.map((unit) => {
          const rows = getUnitRows(unit, status, report?.data?.date);
          return (
          <div key={unit.unitId} className='print-unit'>
            <div className='print-unit-header'>
              <div className='print-unit-title'>{unit.unitName}</div>
              <div className='print-unit-stats'>
                <span>حضور: {unit.totalAttendances}</span>
                <span>متأخر: {unit.totalLate}</span>
                <span>أجازة: {unit.totalLeaves}</span>
                <span>غير مبصم: {unit.totalNotAttendances}</span>
              </div>
            </div>

            <table className='print-table'>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>اسم الموظف</th>
                  <th>الجهة</th>
                  <th>اليوم</th>
                  <th>وقت الدخول</th>
                  <th>وقت الخروج</th>
                  <th>الحالة</th>
                  <th>الوقت الإضافي</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '10px' }}>
                      لا يوجد موظفون ضمن هذه الحالة
                    </td>
                  </tr>
                )}
                {rows.map((row, index) => (
                  <tr key={row.key}>
                    <td>{index + 1}</td>
                    <td className='print-employee-name'>
                      <div>{row.employeeName}</div>
                      {row.employeeCode && (
                        <div className='print-employee-code'>
                          {row.employeeCode}
                        </div>
                      )}
                    </td>
                    <td>{row.organizationalUnitName}</td>
                    <td>{day(row.date)}</td>
                    <td>{t(row.checkInTime)}</td>
                    <td>{t(row.checkOutTime)}</td>
                    <td>
                      {getRowStatusBadges(row).map((b, i) => (
                        <span
                          key={i}
                          className={`print-badge ${PRINT_BADGE_CLASS[b.tone]}`}
                        >
                          {b.label}
                        </span>
                      ))}
                    </td>
                    <td>{row.overtimeDuration || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          );
        })}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '30px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#666',
            borderTop: '1px solid #ddd',
            paddingTop: '15px'
          }}
        >
          <p>
            تم إنشاء هذا التقرير في:{' '}
            {moment(report?.data?.generatedAt).locale('ar').format('DD/MM/YYYY hh:mm A')}
          </p>
          <p>نظام إدارة الحضور والانصراف</p>
        </div>
      </div>
    );
  }
);

OrganizationalReportPrint.displayName = 'OrganizationalReportPrint';

export default OrganizationalReportPrint;
