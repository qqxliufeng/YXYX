import { asyncRoutes, constantRoutes } from '@/router'
import { getMenus } from '@/api/user'

import Layout from '@/layout'

const hiddenMenuList = [
  '/system/menuButton'
]

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
function getViews(path) {
  return resolve => {
    require.ensure([], (require) => {
      resolve(require('@/views' + path))
    })
  }
}

export function generaMenu(routes, data) {
  data.forEach(item => {
    const isMenu = (item.menuUrl.split('/')).length - 1
    const menu = {
      path: item.menuUrl === '#' ? item.menuUrl + '_key' : item.menuUrl,
      component: isMenu === 1 ? Layout : getViews(item.menuUrl),
      children: [],
      hidden: hiddenMenuList.includes(item.menuUrl),
      name: item.menuUrl,
      meta: { title: item.menuName, id: item.menuId, roles: ['admin'], icon: 'people' }
    }
    if (isMenu === 1) {
      menu.redirect = 'noRedirect'
    }
    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
}

const state = {
  routes: [],
  roles: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    const loadMenuData = []
    return new Promise((resolve, reject) => {
      const roleId = localStorage.getItem('roleId')
      const userId = localStorage.getItem('userId')
      getMenus(userId, roleId).then(response => {
        const { obj } = response
        const data = obj
        Object.assign(loadMenuData, data)
        generaMenu(asyncRoutes, loadMenuData)
        const roles = ['admin']
        const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        commit('SET_ROUTES', accessedRoutes)
        commit('SET_ROLES', roles)
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
