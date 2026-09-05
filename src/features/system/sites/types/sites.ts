export interface ISite {
  id: string;
  siteName: string;
  siteCode: string;
  description?: string | null;
  address?: string | null;
  isActive: boolean;
  unitCount: number;
  userCount: number;
  createdAt: string;
  updatedAt?: string | null;
}

/** A unit explicitly assigned to a site. Its children are NOT members unless listed separately. */
export interface ISiteUnit {
  id: string;
  unitName: string;
  unitCode: string;
  parentUnitName?: string | null;
  employeeCount: number;
}

export interface ISiteDetails {
  id: string;
  siteName: string;
  siteCode: string;
  description?: string | null;
  address?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
  organizationalUnits: ISiteUnit[];
}

export interface CreateSitePayload {
  siteName: string;
  siteCode: string;
  description?: string | null;
  address?: string | null;
  isActive: boolean;
}

export type UpdateSitePayload = CreateSitePayload;

export interface SetSiteUnitsPayload {
  organizationalUnitIds: string[];
}

export interface ISiteQuery {
  searchText?: string;
  isActive?: boolean;
}
