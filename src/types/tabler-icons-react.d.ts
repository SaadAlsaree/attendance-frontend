declare module '@tabler/icons-react' {
  import * as React from 'react';

  export interface IconProps extends React.ComponentPropsWithoutRef<'svg'> {
    size?: string | number;
    stroke?: string | number;
    title?: string;
  }

  export type TablerIcon = React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;

  export const IconAlertTriangle: TablerIcon;
  export const IconArrowRight: TablerIcon;
  export const IconArrowsDiagonal: TablerIcon;
  export const IconBell: TablerIcon;
  export const IconBrandGithub: TablerIcon;
  export const IconBrandTwitter: TablerIcon;
  export const IconBrightness: TablerIcon;
  export const IconBuilding: TablerIcon;
  export const IconCheck: TablerIcon;
  export const IconChevronLeft: TablerIcon;
  export const IconChevronRight: TablerIcon;
  export const IconChevronsDown: TablerIcon;
  export const IconCircleCheck: TablerIcon;
  export const IconCircles: TablerIcon;
  export const IconCommand: TablerIcon;
  export const IconCreditCard: TablerIcon;
  export const IconDatabase: TablerIcon;
  export const IconDeviceLaptop: TablerIcon;
  export const IconDotsVertical: TablerIcon;
  export const IconFaceId: TablerIcon;
  export const IconFile: TablerIcon;
  export const IconFileText: TablerIcon;
  export const IconHelpCircle: TablerIcon;
  export const IconLayoutDashboard: TablerIcon;
  export const IconLayoutGrid: TablerIcon;
  export const IconLayoutKanban: TablerIcon;
  export const IconLoader2: TablerIcon;
  export const IconLogin: TablerIcon;
  export const IconLogout: TablerIcon;
  export const IconMoon: TablerIcon;
  export const IconPhoto: TablerIcon;
  export const IconPizza: TablerIcon;
  export const IconPlus: TablerIcon;
  export const IconRefresh: TablerIcon;
  export const IconSearch: TablerIcon;
  export const IconSettings: TablerIcon;
  export const IconShoppingBag: TablerIcon;
  export const IconSlash: TablerIcon;
  export const IconSparkles: TablerIcon;
  export const IconSun: TablerIcon;
  export const IconTrash: TablerIcon;
  export const IconUpload: TablerIcon;
  export const IconUser: TablerIcon;
  export const IconUserCircle: TablerIcon;
  export const IconUserEdit: TablerIcon;
  export const IconUsers: TablerIcon;
  export const IconUserX: TablerIcon;
  export const IconX: TablerIcon;
}
