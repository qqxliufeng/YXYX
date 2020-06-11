import Layout from '@/layout'
export default [
  {
    path: '/systeminfo',
    component: Layout,
    redirect: '/system/group',
    hidden: true,
    children: [
      {
        path: '/addgroupinfo',
        component: () => import('@/views/system/AddGroupInfo.vue'),
        name: 'AddGroupInfo',
        meta: {
          title: '添加新用户'
        }
      },
      {
        path: '/textbooklist/:studyCardId/:studyCardCode/:studyCardErcode',
        component: () => import('@/views/system/TextBookList.vue'),
        name: 'TextBookList',
        meta: {
          title: '教材列表'
        }
      }
    ]
  }
]
