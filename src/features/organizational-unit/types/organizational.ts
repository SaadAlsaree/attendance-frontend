// Base organizational unit interface matching the API response
export interface IOrganizationalUnit {
    id: string;
    unitName: string;
    unitCode: string;
    unitDescription?: string;
    parentUnitId?: string;
    parentUnitName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    postalCode?: string;
    unitLogo?: string;
    unitLevel?: number;
    managerId?: string;
    managerName?: string;
    employeeCount: number;
    childUnitCount: number;
    createdAt: string;
    updatedAt?: string;
}

// Tree structure for hierarchical view
export interface IOrganizationalUnitTree extends IOrganizationalUnit {
    children: IOrganizationalUnitTree[];
    hasChildren: boolean;
    totalEmployeeCount: number;
    totalChildUnitCount: number;
}

// List view for table display
export interface IOrganizationalUnitList extends IOrganizationalUnit {
    // Additional fields for list view if needed
}

// Details view for single unit display
export interface IOrganizationalUnitDetails extends IOrganizationalUnit {
    // Additional fields for detailed view if needed
}

// Request payload for creating organizational unit
export interface CreateOrganizationalUnitPayload {
    unitName: string;
    unitCode: string;
    unitDescription?: string;
    parentUnitId?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    postalCode?: string;
    unitLogo?: string;
    unitLevel?: number;
    managerId?: string;
}

// Request payload for updating organizational unit
export interface UpdateOrganizationalUnitPayload extends CreateOrganizationalUnitPayload {
    organizationalUnitId: string;
}

// Query parameters for filtering
export interface IOrganizationalUnitQuery {
    page?: number;
    pageSize?: number;
    searchText?: string;
    parentUnitId?: string;
}

// Response wrapper for list endpoints
export interface IOrganizationalUnitResponse {
    items: IOrganizationalUnitList[];
    totalCount: number;
}

// Legacy interfaces for backward compatibility (can be removed later)
export interface IOrganizationalUnitTreeLegacy {
    id?: string;
    unitName?: string;
    unitCode?: string;
    parentUnitId?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    unitLogo?: string;
    unitLevel?: number;
    canReceiveExternalMail?: boolean;
    canSendExternalMail?: boolean;
    children?: IOrganizationalUnitTreeLegacy[];
}
