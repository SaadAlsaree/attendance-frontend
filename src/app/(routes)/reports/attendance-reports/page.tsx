import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BarChart3, Download, Calendar } from 'lucide-react';
import { usersPermissionsService } from '@/features/system/users-permissions/api/users-permissions.service';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { hasAnyRole } from '@/utils/auth/auth-utils';
import { redirect } from 'next/navigation';

export default async function AttendanceReportsPage() {

  const data = await usersPermissionsService.getCurrentUser();
      
  const canAdd = hasAnyRole(data, [Role.Admin, Role.Manager]);
      
      
  // redirect to home if user is not authorized
        if (!canAdd) {
            redirect('/');
        }

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Attendance Reports
          </h1>
          <p className='text-muted-foreground'>
            View attendance reports and analytics
          </p>
        </div>
        <Button>
          <Download className='mr-2 h-4 w-4' />
          Export Report
        </Button>
      </div>

      <div className='mb-6 flex gap-4'>
        <div className='flex-1'>
          <input
            type='date'
            className='w-full rounded-md border border-gray-300 px-3 py-2'
            placeholder='Start Date'
          />
        </div>
        <div className='flex-1'>
          <input
            type='date'
            className='w-full rounded-md border border-gray-300 px-3 py-2'
            placeholder='End Date'
          />
        </div>
        <Button variant='outline'>
          <Calendar className='mr-2 h-4 w-4' />
          Generate Report
        </Button>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Average Attendance
            </CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>94.2%</div>
            <p className='text-muted-foreground text-xs'>
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Employees
            </CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>1,234</div>
            <p className='text-muted-foreground text-xs'>Active employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Late Arrivals</CardTitle>
            <BarChart3 className='h-4 w-4 text-orange-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>156</div>
            <p className='text-muted-foreground text-xs'>12.6% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Absences</CardTitle>
            <BarChart3 className='h-4 w-4 text-red-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>89</div>
            <p className='text-muted-foreground text-xs'>7.2% of total</p>
          </CardContent>
        </Card>
      </div>

      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>Attendance Analytics</CardTitle>
          <CardDescription>
            Detailed attendance reports and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground py-8 text-center'>
            <BarChart3 className='mx-auto mb-4 h-12 w-12' />
            <p>No attendance data found</p>
            <p className='text-sm'>Select a date range to generate reports</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
