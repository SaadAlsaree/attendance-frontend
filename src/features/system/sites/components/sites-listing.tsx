import { sitesService } from '../api/sites.service';
import { ISite } from '../types/sites';
import { columns } from './sites-tables/columns';
import SitesTable from './sites-tables';

export default async function SitesListing() {
  const sites = (await sitesService.getSites()) ?? [];

  return (
    <SitesTable<ISite, unknown>
      data={sites}
      columns={columns}
      totalItems={sites.length}
    />
  );
}
