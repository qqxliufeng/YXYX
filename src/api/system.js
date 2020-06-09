import request from '@/utils/request'

// 请求table
export function fetchList(query) {
  return request({
    url: '/yx/queryYouXingUserList',
    method: 'get',
    params: query
  })
}

// 模糊搜索

export function searchList(query) {
  return request({
    url: '/yx/queryYouXingUserListByLike',
    method: 'get',
    params: query
  })
}

// 部门查询
export function getDepts() {
  return request({
    url: '/yx/queryDepts',
    method: 'get',
    params: {
      pageNum: '0',
      pageSize: '20'
    }
  })
}

export function getRolesByDeptId(id) {
  return request({
    url: '/yx/queryRolesByDeptId',
    method: 'get',
    params: {
      deptId: id
    }
  })
}

// 添加集团用户
export function saveUser(data) {
  return request({
    url: '/yx/saveUser',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/yx/updateUser',
    method: 'post',
    data
  })
}

export function deleteUsers(uu) {
  return request({
    url: '/yx/deleteUsers',
    method: 'post',
    data: {
      userIds: uu
    }
  })
}

// 部门管理
export function fetchDeptsList(query) {
  return request({
    url: '/yx/queryDepts',
    method: 'get',
    params: query
  })
}

export function saveDept(data) {
  return request({
    url: '/yx/saveDept',
    method: 'post',
    data
  })
}

export function updateDept(data) {
  return request({
    url: '/yx/updateDept',
    method: 'post',
    data
  })
}

export function deleteDepts(uu) {
  return request({
    url: '/yx/deleteDepts',
    method: 'post',
    data: {
      deptIds: uu
    }
  })
}

// 角色管理
export function fetchRolesList(query) {
  return request({
    url: '/yx/queryRoles',
    method: 'get',
    params: query
  })
}

export function saveRole(data) {
  return request({
    url: '/yx/saveRole',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/yx/updateRole',
    method: 'post',
    data
  })
}

export function deleteRole(uu) {
  return request({
    url: '/yx/deleteRole',
    method: 'post',
    data: {
      roleId: uu
    }
  })
}

export function fetchAllMenuByRole(query) {
  return request({
    url: '/yx/queryAllMenuByRole',
    method: 'get',
    params: {
      roleId: query
    }
  })
}

export function saveRoleMenus(data) {
  return request({
    url: '/yx/saveRoleMenus',
    method: 'post',
    data
  })
}

