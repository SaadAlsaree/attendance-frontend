import { notFound } from 'next/navigation';
import { sitesService } from '../api/sites.service';
import SitesForm from './sites-form';
import { organizationsUnitsService } from '@/features/system/organizationsunits/api/organizationsunits.service';
import { IOrganizationalUnitList } from '@/features/system/organizationsunits/types/organizationsunits';

export default async function SiteViewPage({ siteId }: { siteId: string }) {
  // Server variant (axiosInstance): the client one skips the auth header outside the browser and
  // would 401 here, leaving the unit picker silently empty. It returns the whole axios response,
  // so the payload has to be unwrapped.
  const unitsResponse = await organizationsUnitsService.getOrganizationalUnits();
  const units = (unitsResponse?.data as IOrganizationalUnitList[]) ?? [];

  if (siteId === 'new') {
    return <SitesForm pageTitle='إضافة موقع' organizationalUnits={units} />;
  }

  const site = await sitesService.getSiteById(siteId);

  if (!site) {
    notFound();
  }

  return (
    <SitesForm
      initialData={site}
      pageTitle='تعديل الموقع'
      organizationalUnits={units}
    />
  );
}
