export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'usersManagement',
    icon: 'DesktopOutlined',
    path: '/usersManagement',
    component: './guanli',
  },
  {
    name: 'pictureManagement',
    icon: 'PictureOutlined',
    path: '/pictureManagement',
    component: './picture',
  },
  {
    name: 'questionnaire',
    icon: 'ProfileOutlined',
    path: '/questionnaire',
    component: './questionnaire',
  },
  {
    path: '/userNaire',
    name: 'userNaire',
    hideInMenu: true,
    component: './questionnaire/userNaire',
  },
  {
    path: '/article',
    name: 'article',
    icon: 'EditOutlined',
    component: './article',
  },
  {
    path: '/feedback',
    name: 'feedback',
    icon: 'FileExclamationOutlined',
    component: './feedback',
  },
  {
    path: '/recruit',
    name: 'recruit',
    icon: 'UserAddOutlined',
    component: './recruit',
  },
  {
    path: '/naireDetail',
    name: 'naireDetail',
    hideInMenu: true,
    component: './questionnaire/naireDetail',
  },
  {
    path: '/feedbackDetail',
    name: 'feedbackDetail',
    hideInMenu: true,
    component: './feedback/detail',
  },
  {
    path: '/recruitDetail',
    name: 'recruitDetail',
    hideInMenu: true,
    component: './recruit/detail',
  },
  {
    path: '/',
    redirect: '/usersManagement',
  },
  {
    component: './404',
  },
];
