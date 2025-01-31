export type Action = {
  name: string;
  code: string;
};
export type Menu = {
  id: string;
  component: string;
  meta: {
    icon: string;
    order?: number;
    title: string;
    affixTab?: boolean;
    affixTabOrder?: number;
    ignoreAccess?: boolean;
    keepAlive?: boolean;
    authority?: string[];
  };
  name: string;
  path: string;
  code?: string;
  actions?: Action[];
  redirect?: string;
  children?: Menu[];
};
