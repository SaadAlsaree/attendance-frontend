'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { navItems } from '@/constants/data';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  IconBell,
  IconChevronRight,
  IconChevronsDown,
  IconLogout,
  IconUserCircle
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Suspense } from 'react';
import { Icons } from '../icons';
import { OrgSwitcher } from '../org-switcher';
import { signOut } from 'next-auth/react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Role } from '@/features/system/users-permissions/types/users-permissions';
import { NavItem } from '@/types';

const tenants = [{ id: '1', name: 'نضام أدارة الحضور' }];

// Helper function to check if user has required roles
function hasRequiredRoles(
  userRole: number | undefined,
  requiredRoles: Role[]
): boolean {
  if (!userRole || !requiredRoles.length) return true;
  return requiredRoles.includes(userRole as Role);
}

function hasAnyRole(
  userRole: number | undefined,
  requiredRoles: Role[]
): boolean {
  // If no roles are required, allow access
  if (!requiredRoles.length) return true;

  // If user has no role, deny access
  if (!userRole) return false;

  // Check if user role matches any of the required roles
  return requiredRoles.some((role) => role === userRole);
}

// Helper function to filter navigation items based on user role
function filterNavItemsByRole(
  items: NavItem[],
  userRole: number | undefined
): NavItem[] {
  return items
    .filter((item) => {
      // Check if user has required roles for this item
      const hasAccess = hasAnyRole(userRole, item.requiredRoles || []);

      if (!hasAccess) return false;

      // If item has sub-items, filter them too
      if (item.items && item.items.length > 0) {
        const filteredSubItems = item.items.filter((subItem) =>
          hasAnyRole(userRole, subItem.requiredRoles || [])
        );

        // Only show parent item if it has accessible sub-items
        return filteredSubItems.length > 0;
      }

      return true;
    })
    .map((item) => ({
      ...item,
      items: item.items ? filterNavItemsByRole(item.items, userRole) : undefined
    }));
}

// Memoized navigation item component for better performance
const NavigationItem = React.memo(
  ({
    item,
    pathname,
    Icons
  }: {
    item: NavItem;
    pathname: string;
    Icons: any;
  }) => {
    const Icon = item.icon ? Icons[item.icon] : Icons.logo;

    if (item?.items && item?.items?.length > 0) {
      return (
        <Collapsible
          key={item.arabicTitle}
          asChild
          defaultOpen={item.isActive}
          className='group/collapsible'
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={item.arabicTitle}
                isActive={pathname === item.url}
              >
                {item.icon && <Icon />}
                <span>{item.arabicTitle}</span>
                <IconChevronRight className='mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.arabicTitle}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === subItem.url}
                    >
                      <Link href={subItem.url}>
                        <span>{subItem.arabicTitle}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          tooltip={item.arabicTitle}
          isActive={pathname === item.url}
        >
          <Link href={item.url}>
            <Icon />
            <span>{item.arabicTitle}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
);

NavigationItem.displayName = 'NavigationItem';

// Loading fallback component
function SidebarLoadingFallback() {
  return (
    <div className='flex items-center justify-center p-4'>
      <div className='border-primary h-6 w-6 animate-spin rounded-full border-b-2'></div>
    </div>
  );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  const onSwitchTenant = React.useCallback((_tenantId: string) => {
    // Tenant switching functionality would be implemented here
  }, []);

  const onProfileClick = React.useCallback(() => {
    router.push('/dashboard/profile');
  }, [router]);

  const onSignOut = React.useCallback(() => {
    signOut();
  }, []);

  const activeTenant = tenants[0];

  // Filter navigation items based on user role
  const filteredNavItems = React.useMemo(() => {
    return filterNavItemsByRole(navItems, user?.role);
  }, [user?.role]);

  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

  return (
    <Sidebar side='right' collapsible='offcanvas' variant='floating'>
      <SidebarHeader>
        <OrgSwitcher
          tenants={tenants}
          defaultTenant={activeTenant}
          onTenantSwitch={onSwitchTenant}
        />
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>الصفحات</SidebarGroupLabel>
          <Suspense fallback={<SidebarLoadingFallback />}>
            <SidebarMenu>
              {isLoading ? (
                <SidebarLoadingFallback />
              ) : (
                filteredNavItems.map((item) => (
                  <NavigationItem
                    key={item.arabicTitle}
                    item={item}
                    pathname={pathname}
                    Icons={Icons}
                  />
                ))
              )}
            </SidebarMenu>
          </Suspense>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <UserAvatarProfile className='h-8 w-8 rounded-lg' showInfo />
                  <IconChevronsDown className='mr-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='px-1 py-1.5'>
                    <UserAvatarProfile
                      className='h-8 w-8 rounded-lg'
                      showInfo
                    />
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={onProfileClick}>
                    <IconUserCircle className='mr-2 h-4 w-4' />
                    الملف الشخصي
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <IconBell className='mr-2 h-4 w-4' />
                    الإشعارات
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSignOut}>
                  <IconLogout className='mr-2 h-4 w-4' />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
