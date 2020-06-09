import Layout from '@/layout'
export default [
  {
    path: '/systeminfo',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/addgroupinfo',
        component: () => import('@/views/system/AddGroupInfo.vue'),
        name: 'AddGroupInfo',
        meta: {
          title: '添加新用户'
        }
      }
    ]
  }
]
