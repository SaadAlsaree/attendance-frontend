'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import {
  Monitor,
  MapPin,
  Globe,
  Wifi,
  WifiOff,
  Settings,
  Calendar,
  CheckCircle,
  XCircle,
  Activity,
  User,
  Shield,
  Hash,
  Cpu,
  Building,
  Package
} from 'lucide-react';
import { DeviceData } from '../../types/devices';
import {
  formatDate,
  getDeviceStatusDisplay,
  getDeviceStatusColor,
  getDeviceStatusVariant
} from '../../utils/devices';
import { CellAction } from './cell-action';

export const columns: ColumnDef<DeviceData>[] = [
  {
    id: 'username',
    accessorKey: 'username',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='اسم المستخدم' />
    ),
    cell: ({ cell }) => {
      const username = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <User className='h-4 w-4 text-blue-600' />
          <span>{username || '-'}</span>
        </div>
      );
    },
    meta: {
      label: 'اسم المستخدم',
      placeholder: 'ابحث عن اسم المستخدم...',
      variant: 'text',
      icon: User
    },
    enableColumnFilter: true
  },
  {
    id: 'deviceId',
    accessorKey: 'deviceId',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='معرف الجهاز' />
    ),
    cell: ({ cell }) => (
      <div className='font-mono text-sm'>{cell.getValue<string>() || '-'}</div>
    ),
    meta: {
      label: 'معرف الجهاز',
      placeholder: 'ابحث عن معرف الجهاز...',
      variant: 'text',
      icon: Hash
    },
    enableColumnFilter: true
  },
  {
    id: 'ipAddress',
    accessorKey: 'ipAddress',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='عنوان IP' />
    ),
    cell: ({ cell }) => (
      <div className='font-mono text-sm'>{cell.getValue<string>()}</div>
    ),
    meta: {
      label: 'عنوان IP',
      placeholder: 'ابحث عن عنوان IP...',
      variant: 'text',
      icon: Globe
    },
    enableColumnFilter: true
  },
  {
    id: 'location',
    accessorKey: 'location',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='الموقع' />
    ),
    cell: ({ cell }) => {
      const location = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <MapPin className='h-4 w-4 text-blue-600' />
          <span>{location || '-'}</span>
        </div>
      );
    },
    meta: {
      label: 'الموقع',
      placeholder: 'ابحث عن الموقع...',
      variant: 'text',
      icon: MapPin
    },
    enableColumnFilter: true
  },
  {
    id: 'department',
    accessorKey: 'department',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='القسم' />
    ),
    cell: ({ cell }) => {
      const department = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <Building className='h-4 w-4 text-purple-600' />
          <span>{department || '-'}</span>
        </div>
      );
    },
    meta: {
      label: 'القسم',
      placeholder: 'ابحث عن القسم...',
      variant: 'text',
      icon: Building
    },
    enableColumnFilter: true
  },
  {
    id: 'workLocationName',
    accessorKey: 'workLocationName',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='موقع العمل' />
    ),
    cell: ({ cell }) => {
      const workLocationName = cell.getValue<string>();
      return <div>{workLocationName || '-'}</div>;
    },
    meta: {
      label: 'موقع العمل',
      placeholder: 'ابحث عن موقع العمل...',
      variant: 'text',
      icon: MapPin
    },
    enableColumnFilter: true
  },
  {
    id: 'organizationName',
    accessorKey: 'organizationName',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='الجهة' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>() || '-'}</div>,
    meta: {
      label: 'الجهة',
      placeholder: 'ابحث عن الجهة...',
      variant: 'text',
      icon: Settings
    },
    enableColumnFilter: true
  },
  {
    id: 'deviceModel',
    accessorKey: 'deviceModel',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='موديل الجهاز' />
    ),
    cell: ({ cell }) => {
      const deviceModel = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <Monitor className='h-4 w-4 text-gray-600' />
          <span>{deviceModel || '-'}</span>
        </div>
      );
    },
    meta: {
      label: 'موديل الجهاز',
      placeholder: 'ابحث عن موديل الجهاز...',
      variant: 'text',
      icon: Monitor
    },
    enableColumnFilter: true
  },
  {
    id: 'serialNumber',
    accessorKey: 'serialNumber',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='الرقم التسلسلي' />
    ),
    cell: ({ cell }) => {
      const serialNumber = cell.getValue<string>();
      return <div className='font-mono text-sm'>{serialNumber || '-'}</div>;
    },
    meta: {
      label: 'الرقم التسلسلي',
      placeholder: 'ابحث عن الرقم التسلسلي...',
      variant: 'text',
      icon: Hash
    },
    enableColumnFilter: true
  },
  {
    id: 'macAddress',
    accessorKey: 'macAddress',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='عنوان MAC' />
    ),
    cell: ({ cell }) => {
      const macAddress = cell.getValue<string>();
      return <div className='font-mono text-sm'>{macAddress || '-'}</div>;
    },
    meta: {
      label: 'عنوان MAC',
      placeholder: 'ابحث عن عنوان MAC...',
      variant: 'text',
      icon: Hash
    },
    enableColumnFilter: true
  },
  {
    id: 'firmwareVersion',
    accessorKey: 'firmwareVersion',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='إصدار البرنامج الثابت' />
    ),
    cell: ({ cell }) => {
      const firmwareVersion = cell.getValue<string>();
      return firmwareVersion ? (
        <Badge variant='outline'>{firmwareVersion}</Badge>
      ) : (
        <div>-</div>
      );
    },
    meta: {
      label: 'إصدار البرنامج الثابت',
      icon: Package
    }
  },
  {
    id: 'port',
    accessorKey: 'port',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='المنفذ' />
    ),
    cell: ({ cell }) => {
      const port = cell.getValue<string>();
      return port ? <Badge variant='outline'>{port}</Badge> : <div>-</div>;
    },
    meta: {
      label: 'المنفذ',
      icon: Settings
    }
  },
  {
    id: 'protocol',
    accessorKey: 'protocol',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='البروتوكول' />
    ),
    cell: ({ cell }) => {
      const protocol = cell.getValue<string>();
      return protocol ? (
        <Badge variant='secondary'>{protocol}</Badge>
      ) : (
        <div>-</div>
      );
    },
    meta: {
      label: 'البروتوكول',
      icon: Shield
    }
  },
  {
    id: 'features',
    accessorKey: 'features',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='الميزات' />
    ),
    cell: ({ cell }) => {
      const features = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <Cpu className='h-4 w-4 text-green-600' />
          <span className='text-sm'>{features || '-'}</span>
        </div>
      );
    },
    meta: {
      label: 'الميزات',
      icon: Cpu
    }
  },
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='الحالة' />
    ),
    cell: ({ cell }) => {
      const isActive = cell.getValue<boolean>();
      const statusText = getDeviceStatusDisplay(isActive);
      const statusColor = getDeviceStatusColor(isActive);
      const statusVariant = getDeviceStatusVariant(isActive);

      return (
        <div className='flex items-center gap-1'>
          {isActive ? (
            <Wifi className='h-4 w-4 text-green-600' />
          ) : (
            <WifiOff className='h-4 w-4 text-red-600' />
          )}
          <Badge variant={statusVariant}>{statusText}</Badge>
        </div>
      );
    },
    meta: {
      label: 'الحالة',
      icon: Activity
    }
  },
  {
    id: 'lastConnected',
    accessorKey: 'lastConnected',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='آخر اتصال' />
    ),
    cell: ({ cell }) => {
      const lastConnected = cell.getValue<string>();
      return lastConnected ? (
        <div className='flex items-center gap-1'>
          <Calendar className='h-4 w-4 text-blue-600' />
          <span>{formatDate(lastConnected)}</span>
        </div>
      ) : (
        <div>-</div>
      );
    },
    meta: {
      label: 'آخر اتصال',
      icon: Calendar
    }
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }: { column: Column<DeviceData, unknown> }) => (
      <DataTableColumnHeader column={column} title='تاريخ الإنشاء' />
    ),
    cell: ({ cell }) => {
      const createdAt = cell.getValue<string>();
      return (
        <div className='flex items-center gap-1'>
          <Calendar className='h-4 w-4 text-blue-600' />
          <span>{formatDate(createdAt)}</span>
        </div>
      );
    },
    meta: {
      label: 'تاريخ الإنشاء',
      icon: Calendar
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
