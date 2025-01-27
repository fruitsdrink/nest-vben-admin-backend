export const dashboardMenus = [
  {
    // 这里固定写死 BasicLayout，不可更改
    component: 'BasicLayout',
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: '概览',
    },
    name: 'Dashboard',
    path: '/',
    redirect: '/analytics',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: '/dashboard/analytics/index',
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: '分析页',
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: '/dashboard/workspace/index',
        meta: {
          icon: 'carbon:workspace',
          title: '工作台',
        },
      },
    ],
  },
];

const baseInfoMenus = [
  {
    component: 'BasicLayout',
    meta: {
      title: '基础信息',
      icon: 'carbon:gui-management',
    },
    name: 'BaseInfo',
    path: '/baseinfo',
    code: 'baseinfo',
    children: [
      {
        name: 'UserManager',
        path: '/baseinfo/user',
        component: '/baseinfo/user/index',
        meta: {
          title: '用户管理',
          icon: 'lucide:user',
        },
        code: 'user',
        accessCodes: [
          {
            name: '新增',
            code: '01',
          },
          {
            name: '编辑',
            code: '02',
          },
          {
            name: '删除',
            code: '03',
          },
          {
            name: '重置密码',
            code: '04',
          },
        ],
      },
      {
        name: 'RoleManager',
        path: '/baseinfo/role',
        component: '/baseinfo/role/index',
        meta: {
          title: '角色管理',
          icon: 'carbon:user-role',
        },
      },
      {
        name: 'DepartmentManager',
        path: '/baseinfo/department',
        component: '/baseinfo/department/index',
        meta: {
          title: '部门管理',
          icon: 'mingcute:department-line',
        },
      },
    ],
  },
];

export const menus = [...dashboardMenus, ...baseInfoMenus];
