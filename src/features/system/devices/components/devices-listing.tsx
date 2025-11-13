import DevicesTable from './devices-tables';
import { searchParamsCache } from '@/lib/searchparams';
import { DeviceData } from '../types/devices';
import { devicesService } from '../api/devices.service';
import { columns } from './devices-tables/columns';

export default async function DevicesListing() {
  const page = searchParamsCache.get('page');
  const searchText = searchParamsCache.get('searchText');
  const pageSize = searchParamsCache.get('pageSize');
  const status = searchParamsCache.get('status');

  const filters = {
    page: page ? parseInt(String(page)) : undefined,
    pageSize: pageSize ? parseInt(String(pageSize)) : undefined,
    ...(searchText && { searchTerm: searchText }),
    ...(status && { status: parseInt(String(status)) })
  };

  const data = await devicesService.getDevicesList(filters);
  const totalDevices = data?.totalItems || 0;
  const devices = data?.data as unknown as DeviceData[];

  return (
    <DevicesTable<DeviceData, unknown>
      data={devices}
      totalItems={totalDevices}
      columns={columns}
    />
  );
}
