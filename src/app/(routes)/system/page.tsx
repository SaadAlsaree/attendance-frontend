import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Users,
  Building2,
  MapPin,
  Smartphone,
  Shield
} from 'lucide-react';

export default function SystemPage() {
  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>System Settings</h1>
          <p className='text-muted-foreground'>
            Manage your organization&apos;s system configuration
          </p>
        </div>
        <Button>
          <Settings className='mr-2 h-4 w-4' />
          System Config
        </Button>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card className='cursor-pointer transition-shadow hover:shadow-md'>
          <CardHeader>
            <div className='flex items-center space-x-2'>
              <Users className='h-5 w-5 text-blue-600' />
              <CardTitle>Users & Permissions</CardTitle>
            </div>
            <CardDescription>
              Manage user accounts and access permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-muted-foreground text-sm'>
              <p>• User management</p>
              <p>• Role assignments</p>
              <p>• Access controls</p>
            </div>
          </CardContent>
        </Card>

        <Card className='cursor-pointer transition-shadow hover:shadow-md'>
          <CardHeader>
            <div className='flex items-center space-x-2'>
              <Building2 className='h-5 w-5 text-green-600' />
              <CardTitle>Organizational Units</CardTitle>
            </div>
            <CardDescription>
              Configure organizational structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-muted-foreground text-sm'>
              <p>• Department setup</p>
              <p>• Hierarchy management</p>
              <p>• Unit assignments</p>
            </div>
          </CardContent>
        </Card>

        <Card className='cursor-pointer transition-shadow hover:shadow-md'>
          <CardHeader>
            <div className='flex items-center space-x-2'>
              <MapPin className='h-5 w-5 text-orange-600' />
              <CardTitle>Work Locations</CardTitle>
            </div>
            <CardDescription>
              Manage office locations and branches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-muted-foreground text-sm'>
              <p>• Location setup</p>
              <p>• Branch management</p>
              <p>• Address configuration</p>
            </div>
          </CardContent>
        </Card>

        <Card className='cursor-pointer transition-shadow hover:shadow-md'>
          <CardHeader>
            <div className='flex items-center space-x-2'>
              <Smartphone className='h-5 w-5 text-purple-600' />
              <CardTitle>Devices</CardTitle>
            </div>
            <CardDescription>
              Manage attendance devices and hardware
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-muted-foreground text-sm'>
              <p>• Device registration</p>
              <p>• Hardware configuration</p>
              <p>• Device monitoring</p>
            </div>
          </CardContent>
        </Card>

        <Card className='cursor-pointer transition-shadow hover:shadow-md'>
          <CardHeader>
            <div className='flex items-center space-x-2'>
              <Shield className='h-5 w-5 text-red-600' />
              <CardTitle>Security Settings</CardTitle>
            </div>
            <CardDescription>
              Configure security and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-muted-foreground text-sm'>
              <p>• Authentication</p>
              <p>• Data encryption</p>
              <p>• Audit logs</p>
            </div>
          </CardContent>
        </Card>

        <Card className='cursor-pointer transition-shadow hover:shadow-md'>
          <CardHeader>
            <div className='flex items-center space-x-2'>
              <Settings className='h-5 w-5 text-gray-600' />
              <CardTitle>System Configuration</CardTitle>
            </div>
            <CardDescription>
              General system settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-muted-foreground text-sm'>
              <p>• System preferences</p>
              <p>• Notification settings</p>
              <p>• Backup configuration</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current system health and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-3'>
            <div className='flex items-center space-x-2'>
              <div className='h-2 w-2 rounded-full bg-green-500'></div>
              <span className='text-sm'>System Online</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='h-2 w-2 rounded-full bg-green-500'></div>
              <span className='text-sm'>Database Connected</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='h-2 w-2 rounded-full bg-green-500'></div>
              <span className='text-sm'>All Services Running</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
