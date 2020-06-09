/*
 * @Descripttion: 描述
 * @version: 版本
 * @Author: lf
 * @Date: 2020-05-20 11:46:00
 * @LastEditors: lf
 * @LastEditTime: 2020-06-08 11:09:28
 */
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/doLogin',
    method: 'post',
    data
  })
}

export function getMenus(uu, da) {
  return request({
    url: '/yx/queryMenusByRoleId',
    method: 'get',
    params: {
      userId: uu,
      roleId: da
    }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
