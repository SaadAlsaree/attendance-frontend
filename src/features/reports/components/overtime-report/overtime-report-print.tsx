'use client';
import React, { forwardRef } from 'react';
import moment from 'moment';
import 'moment/locale/ar';
// Importing a moment locale silently makes it the GLOBAL default, which breaks
// SSR hydration everywhere (server renders 'en' digits, client renders Arabic).
// Register it, then restore the default — all usages here call .locale('ar') explicitly.
moment.locale('en');
import { OvertimeReportResponse } from '../../types/overtime-report';
import './overtime-print-styles.css';

type Props = {
  report: OvertimeReportResponse;
};

const fmtHours = (h: number) => (h ? Number(h).toFixed(2) : '-');

const OvertimeReportPrint = forwardRef<HTMLDivElement, Props>(
  ({ report }, ref) => {
    const stats = [
      {
        title: 'إجمالي ساعات العمل الإضافي',
        value: Number(report.statistics.totalOvertimeHours ?? 0).toFixed(2)
      },
      {
        title: 'موظفون لديهم إضافي',
        value: report.statistics.employeesWithOvertime ?? 0
      },
      {
        title: 'متوسط ساعات الإضافي',
        value: Number(report.statistics.averageOvertimeHours ?? 0).toFixed(2)
      }
    ];

    return (
      <div ref={ref} className='print-container' dir='rtl'>
        <div className='print-header'>
          <div className='print-title'>تقرير العمل الإضافي</div>
          <div className='print-meta'>
            من {moment(report.startDate).locale('ar').format('DD/MM/YYYY')} إلى{' '}
            {moment(report.endDate).locale('ar').format('DD/MM/YYYY')}
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
              <th>الموظف</th>
              <th>الجهة</th>
              <th>إجمالي ساعات الإضافي</th>
              <th>أيام الإضافي</th>
              <th>متوسط الإضافي / يوم</th>
            </tr>
          </thead>
          <tbody>
            {report.employeeSummaries.map((emp) => (
              <tr key={emp.employeeId}>
                <td>{emp.employeeName}</td>
                <td>{emp.departmentName}</td>
                <td>{fmtHours(emp.totalOvertimeHours)}</td>
                <td>{emp.overtimeDays || '-'}</td>
                <td>{fmtHours(emp.averageOvertimePerDay)}</td>
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

OvertimeReportPrint.displayName = 'OvertimeReportPrint';

export default OvertimeReportPrint;
