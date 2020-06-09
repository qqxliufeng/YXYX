/*
 * @Descripttion: 描述
 * @version: 版本
 * @Author: lf
 * @Date: 2020-06-08 13:55:11
 * @LastEditors: lf
 * @LastEditTime: 2020-06-08 15:33:02
 */
import request from '@/utils/request'

export const HTTP_GET = 'GET'

export const HTTP_POST = 'POST'

export function http({ url, methods = HTTP_POST, data = {}, withRoleId = true, withUserId = true }) {
  if (withRoleId && !data.hasOwnProperty('roleId')) {
    data.roleId = localStorage.getItem('roleId')
  }
  if (withUserId && !data.hasOwnProperty('userId')) {
    data.userId = localStorage.getItem('userId')
  }
  if (methods === HTTP_POST) {
    console.log(methods)
    return request({
      url,
      method: HTTP_POST,
      data
    })
  } else {
    return request({
      url,
      method: HTTP_GET,
      params: data
    })
  }
}
