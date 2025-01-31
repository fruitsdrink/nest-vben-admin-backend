import { Menu } from './type';

export const baseInfoMenus: Menu[] = [
  {
    id: 'baseinfo',
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
        id: 'baseinfo-user',
        name: 'UserManager',
        path: '/baseinfo/user',
        component: '/baseinfo/user/index',
        meta: {
          title: '用户管理',
          icon: 'lucide:user',
        },
        code: 'user',
        actions: [
          {
            name: '新增',
            code: 'add',
          },
          {
            name: '编辑',
            code: 'edit',
          },
          {
            name: '删除',
            code: 'delete',
          },
          {
            name: '重置密码',
            code: 'resetPassword',
          },
        ],
      },
      {
        id: 'baseinfo-role',
        name: 'RoleManager',
        path: '/baseinfo/role',
        component: '/baseinfo/role/index',
        meta: {
          title: '角色管理',
          icon: 'carbon:user-role',
        },
        code: 'role',
        actions: [
          {
            name: '新增',
            code: 'add',
          },
          {
            name: '编辑',
            code: 'edit',
          },
          {
            name: '删除',
            code: 'delete',
          },
        ],
      },
      {
        id: 'baseinfo-department',
        name: 'DepartmentManager',
        path: '/baseinfo/department',
        component: '/baseinfo/department/index',
        meta: {
          title: '部门管理',
          icon: 'mingcute:department-line',
        },
        code: 'department',
        actions: [
          {
            name: '新增',
            code: 'add',
          },
          {
            name: '编辑',
            code: 'edit',
          },
          {
            name: '删除',
            code: 'delete',
          },
        ],
      },
    ],
  },
];
