'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { IconUsers, IconBuilding } from '@tabler/icons-react';
import { IOrganizationalUnitTree } from '../types/organizational';

interface OrgUnitData extends IOrganizationalUnitTree {
  // Additional props if needed
}

function OrgUnitNode({ data }: NodeProps<OrgUnitData>) {
  return (
    <Card className='max-w-[280px] min-w-[220px] border-2 px-3 py-2 shadow-md transition-all hover:border-blue-200 hover:shadow-lg'>
      <Handle
        type='target'
        position={Position.Top}
        className='h-3 w-3 !bg-gray-400'
      />

      <div className='mb-2 truncate text-sm font-medium'>{data.unitName}</div>

      <div className='mb-2 flex items-center gap-2 text-xs text-gray-500'>
        <span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs'>
          {data.unitCode}
        </span>
        {data.unitLevel && (
          <span className='rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600'>
            المستوى {data.unitLevel}
          </span>
        )}
      </div>

      {/* Employee and child unit counts */}
      <div className='mb-2 flex items-center justify-between text-xs text-gray-600'>
        <div className='flex items-center gap-1'>
          <IconUsers size={12} className='text-green-600' />
          <span>{data.employeeCount} موظف</span>
        </div>
        <div className='flex items-center gap-1'>
          <IconBuilding size={12} className='text-blue-600' />
          <span>{data.childUnitCount} وحدة فرعية</span>
        </div>
      </div>

      {/* Manager info */}
      {data.managerName && (
        <div className='mb-2 text-xs text-gray-600'>
          <span className='font-medium'>المدير:</span> {data.managerName}
        </div>
      )}

      {/* Contact info */}
      {(data.email || data.phoneNumber) && (
        <div className='text-xs text-gray-500'>
          {data.email && <div>📧 {data.email}</div>}
          {data.phoneNumber && <div>📞 {data.phoneNumber}</div>}
        </div>
      )}

      <Handle
        type='source'
        position={Position.Bottom}
        className='h-3 w-3 !bg-gray-400'
      />
    </Card>
  );
}

export default memo(OrgUnitNode);
