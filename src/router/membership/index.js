import Layout from '@/layout'
export default [
  {
    path: '/vipshcoolinfo',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/vipshcoolinfo/:schoolId',
        component: () => import('@/views/membership/VipSchoolInfo.vue'),
        name: 'VipSchoolInfo',
        meta: {
          title: '学校详情'
        }
      }
    ]
  }
]
