'use client';
import React, { forwardRef } from 'react';
import moment from 'moment';
import 'moment/locale/ar';
// Importing a moment locale silently makes it the GLOBAL default, which breaks
// SSR hydration everywhere (server renders 'en' digits, client renders Arabic).
// Register it, then restore the default — all usages here call .locale('ar') explicitly.
moment.locale('en');
import { EmployeeReportData } from '../../types/employee-report';
import '../organizational-report/print-styles.css';

type Props = {
  report: EmployeeReportData;
};

const EmployeeReportPrint = forwardRef<HTMLDivElement, Props>(
  ({ report }, ref) => {
    const formatTime = (time: string | null) =>
      time ? moment(time).locale('ar').format('hh:mm A') : 'غير مبصم';

    const stats = [
      { title: 'إجمالي الأيام', value: report.totalDays },
      { title: 'أيام الحضور', value: report.presentDays },
      { title: 'أيام الغياب', value: report.absentDays },
      { title: 'أيام التأخير', value: report.lateDays },
      { title: 'أيام الإجازة', value: report.leaveDays },
      { title: 'ساعات إضافية', value: report.totalOvertimeHours }
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
              padding-bottom: 16px;
              margin-bottom: 20px;
            }
            .print-title {
              font-size: 22px;
              font-weight: bold;
              margin-bottom: 6px;
            }
            .print-subtitle {
              font-size: 14px;
              color: #444;
            }
            .print-meta {
              font-size: 12px;
              color: #666;
              margin-top: 6px;
            }
            .print-stats {
              display: grid;
              grid-template-columns: repeat(6, 1fr);
              gap: 10px;
              margin-bottom: 24px;
            }
            .print-stat-card {
              border: 1px solid #ddd;
              padding: 10px;
              border-radius: 8px;
              text-align: center;
            }
            .print-stat-title {
              font-size: 11px;
              color: #666;
              margin-bottom: 4px;
            }
            .print-stat-value {
              font-size: 18px;
              font-weight: bold;
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
          }
        `}</style>

        <div className='print-header'>
          <div className='print-title'>تقرير موظف</div>
          <div className='print-subtitle'>
            {report.employeeName}
            {report.employeeCode ? ` — ${report.employeeCode}` : ''}
          </div>
          <div className='print-meta'>
            {report.organizationalUnitName} | من{' '}
            {moment(report.fromDate).locale('ar').format('DD/MM/YYYY')} إلى{' '}
            {moment(report.toDate).locale('ar').format('DD/MM/YYYY')}
          </div>
        </div>

        <div className='print-stats'>
          {stats.map((stat, index) => (
            <div key={index} className='print-stat-card'>
              <div className='print-stat-title'>{stat.title}</div>
              <div className='print-stat-value'>{stat.value}</div>
            </div>
          ))}
        </div>

        <table className='print-table'>
          <thead>
            <tr>
              <th>اليوم</th>
              <th>التاريخ</th>
              <th>وقت الدخول</th>
              <th>وقت الخروج</th>
              <th>الحالة</th>
              <th>تأخير (د)</th>
              <th>انصراف مبكر (د)</th>
              <th>إضافي (د)</th>
            </tr>
          </thead>
          <tbody>
            {report.days.map((day, index) => (
              <tr key={index}>
                <td>{moment(day.date).locale('ar').format('dddd')}</td>
                <td>{moment(day.date).locale('ar').format('DD/MM/YYYY')}</td>
                <td>{formatTime(day.checkInTime)}</td>
                <td>{formatTime(day.checkOutTime)}</td>
                <td>{day.statusName}</td>
                <td>{day.lateMinutes || '-'}</td>
                <td>{day.earlyLeaveMinutes || '-'}</td>
                <td>{day.overtimeMinutes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#666',
            borderTop: '1px solid #ddd',
            paddingTop: '12px'
          }}
        >
          <p>تم إنشاء هذا التقرير في: {moment(report.generatedAt).locale('ar').format('DD/MM/YYYY hh:mm A')}</p>
          <p>نظام إدارة الحضور والانصراف</p>
        </div>
      </div>
    );
  }
);

EmployeeReportPrint.displayName = 'EmployeeReportPrint';

export default EmployeeReportPrint;
