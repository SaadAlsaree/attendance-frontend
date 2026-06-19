'use client';
import React, { forwardRef } from 'react';
import { OrganizationalReportResponse } from '../../types/organization-report';
import { Users, UserCheck, Calendar, AlertTriangle, Timer } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/ar';
import './print-styles.css';

// Set Arabic locale for moment
moment.locale('ar');

type Props = {
  report: OrganizationalReportResponse;
};

const OrganizationalReportPrint = forwardRef<HTMLDivElement, Props>(
  ({ report }, ref) => {
    const formatDate = (date: string) => {
      return moment(date).format('dddd DD/MM/YYYY');
    };

    const formatTime = (time: string) => {
      return moment(time).format('hh:mm A');
    };

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
              page-break-inside: avoid;
            }

            .print-unit-header {
              background: #f5f5f5;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 8px 8px 0 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
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
              page-break-inside: avoid;
            }

            .print-subsection-title {
              font-size: 13px;
              font-weight: bold;
              background: #f5f5f5;
              border: 1px solid #ddd;
              border-bottom: none;
              padding: 8px 12px;
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

        {/* Units and Employees */}
        {report?.data?.units?.map((unit, unitIndex) => (
          <div
            key={unit.unitId}
            className={`print-unit print-no-break ${
              unit.employeeDetails.length > 10 ? 'large-unit' : ''
            } ${unitIndex > 0 && unitIndex % 2 === 0 ? 'print-break-before' : ''}`}
          >
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
                  <th>اسم الموظف</th>
                  <th>الجهة التنظيمية</th>
                  <th>اليوم</th>
                  <th>التاريخ</th>
                  <th>وقت الدخول</th>
                  <th>وقت الخروج</th>
                  <th>متأخر</th>
                  <th>مبكر</th>
                  <th>الوقت الإضافي</th>
                </tr>
              </thead>
              <tbody>
                {unit.employeeDetails.map((employee) => (
                  <tr key={employee.employeeId}>
                    <td className='print-employee-name'>
                      <div>{employee.employeeName}</div>
                      <div className='print-employee-code'>
                        {employee.employeeCode}
                      </div>
                    </td>
                    <td>{employee.organizationalUnitName}</td>
                    <td>{moment(employee.date).format('dddd')}</td>
                    <td>{moment(employee.date).format('DD/MM/YYYY')}</td>
                    <td>{formatTime(employee.checkInTime)}</td>
                    <td>
                      {employee.checkOutTime
                        ? formatTime(employee.checkOutTime)
                        : 'غير مبصم'}
                    </td>
                    <td>
                      {employee.isLate && (
                        <span className='print-badge print-badge-late'>
                          متأخر
                        </span>
                      )}
                    </td>
                    <td>
                      {employee.isEarlyLeave && (
                        <span className='print-badge print-badge-early'>
                          مبكر
                        </span>
                      )}
                    </td>
                    <td>{employee.overtimeDuration || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Non-fingerprinted employees (غير مبصمين) */}
            {unit.nonFingerprintedEmployees?.length > 0 && (
              <div className='print-subsection'>
                <div className='print-subsection-title'>
                  غير المبصمين ({unit.nonFingerprintedEmployees.length})
                </div>
                <table className='print-table'>
                  <thead>
                    <tr>
                      <th style={{ width: '48px' }}>#</th>
                      <th>اسم الموظف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unit.nonFingerprintedEmployees.map((employee, index) => (
                      <tr key={employee.employeeId}>
                        <td>{index + 1}</td>
                        <td className='print-employee-name'>
                          {employee.employeeName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Actions / statuses (الاجراءات) */}
            {unit.actionEmployees?.length > 0 && (
              <div className='print-subsection'>
                <div className='print-subsection-title'>
                  الإجراءات ({unit.actionEmployees.length})
                </div>
                <table className='print-table'>
                  <thead>
                    <tr>
                      <th style={{ width: '48px' }}>#</th>
                      <th>اسم الموظف</th>
                      <th>الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unit.actionEmployees.map((employee, index) => (
                      <tr key={employee.employeeId}>
                        <td>{index + 1}</td>
                        <td className='print-employee-name'>
                          {employee.employeeName}
                        </td>
                        <td>{employee.actionName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

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
            {moment(report?.data?.generatedAt).format('DD/MM/YYYY hh:mm A')}
          </p>
          <p>نظام إدارة الحضور والانصراف</p>
        </div>
      </div>
    );
  }
);

OrganizationalReportPrint.displayName = 'OrganizationalReportPrint';

export default OrganizationalReportPrint;
