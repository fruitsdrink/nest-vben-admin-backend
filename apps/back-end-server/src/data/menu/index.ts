import { baseInfoMenus } from './baseinfo';
import { dashboardMenus } from './dashboard';

export const menus = [...dashboardMenus, ...baseInfoMenus];
export * from './type';
