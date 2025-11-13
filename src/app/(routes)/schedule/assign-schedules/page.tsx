import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Users } from 'lucide-react';

export default function AssignSchedulesPage() {
  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Assign Schedules
          </h1>
          <p className='text-muted-foreground'>
            Manage employee schedule assignments
          </p>
        </div>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Assign Schedule
        </Button>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Assignments
            </CardTitle>
            <Calendar className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>156</div>
            <p className='text-muted-foreground text-xs'>+12 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Active Schedules
            </CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>142</div>
            <p className='text-muted-foreground text-xs'>91% active rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pending Assignments
            </CardTitle>
            <Calendar className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>14</div>
            <p className='text-muted-foreground text-xs'>Require approval</p>
          </CardContent>
        </Card>
      </div>

      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>Schedule Assignments</CardTitle>
          <CardDescription>
            View and manage employee schedule assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground py-8 text-center'>
            <Calendar className='mx-auto mb-4 h-12 w-12' />
            <p>No schedule assignments found</p>
            <p className='text-sm'>
              Assign schedules to employees to get started
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
