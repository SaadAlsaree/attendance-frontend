import { notFound } from 'next/navigation';
import { sitesService } from '../api/sites.service';
import SitesForm from './sites-form';
import { organizationsUnitsService } from '@/features/system/organizationsunits/api/organizationsunits.service';
import { IOrganizationalUnitList } from '@/features/system/organizationsunits/types/organizationsunits';

export default async function SiteViewPage({ siteId }: { siteId: string }) {
  const units =
    (await organizationsUnitsService.getOrganizationalUnitsClient()) ?? [];

  if (siteId === 'new') {
    return (
      <SitesForm
        pageTitle='إضافة موقع'
        organizationalUnits={units as IOrganizationalUnitList[]}
      />
    );
  }

  const site = await sitesService.getSiteById(siteId);

  if (!site) {
    notFound();
  }

  return (
    <SitesForm
      initialData={site}
      pageTitle='تعديل الموقع'
      organizationalUnits={units as IOrganizationalUnitList[]}
    />
  );
}
