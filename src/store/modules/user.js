import { login } from '@/api/user'
import { getToken, setToken, setUserId, setRoleId, setPhone, setuserNickName, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  phone: '',
  userId: '',
  roleId: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_ROLEID: (state, roleId) => {
    state.roleId = roleId
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_userNickName: (state, userNickName) => {
    state.userNickName = userNickName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { phone, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone: phone.trim(), password: password }).then(response => {
        const { obj } = response
        const data = obj
        const roles = data.roles
        commit('SET_TOKEN', data.token)
        commit('SET_PHONE', data.phone)
        commit('SET_USERID', data.userId)
        commit('SET_ROLEID', data.roleId)
        commit('SET_ROLES', roles)
        commit('SET_userNickName', data.userNickName)
        setToken(data.token)
        setUserId(data.userId)
        setRoleId(data.roleId)
        setuserNickName(data.userNickName)
        setPhone(data.phone)
        localStorage.setItem('phone', data.phone)
        localStorage.setItem('username', data.username)
        localStorage.setItem('roleId', data.roleId)
        localStorage.setItem('userId', data.userId)
        localStorage.setItem('roles', JSON.stringify(roles))
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  // getInfo() {
  //   const roleId = localStorage.getItem('roleId')
  //   return new Promise((resolve, reject) => {
  //     getInfo(roleId).then(response => {
  //       const { obj } = response
  //       alert();
  //       // if (!obj) {
  //       //   reject('Verification failed, please Login again.')
  //       // }
  //       // const {  name, userId, roleId } = obj
  //       // if (!roles || roles.length <= 0) {
  //       //   reject('getInfo: roles must be a non-null array!')
  //       // }
  //       // commit('SET_ROLES', roles)
  //       // commit('SET_NAME', name)
  //       // commit('SET_USERID', userId)
  //       // commit('SET_ROLEID', roleId)
  //       // commit('SET_AVATAR', avatar)
  //       // commit('SET_INTRODUCTION', introduction)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //       alert(error);
  //     })
  //   })
  // },

  // getMenus({ commit, state }) {
  //   console.log('IS getMenus')
  //    const roleId = localStorage.getItem('roleId')
  //    const userId = localStorage.getItem('userId')
  //   console.log(roleId)
  //   return new Promise((resolve, reject) => {
  //     getMenus(userId,roleId).then(response => {
  //       const { obj } = response
  //       console.log(obj);
  //       if (!obj) {
  //         reject('Verification failed, please Login again.')
  //       }
  //      // const {  name, userId, roleId } = obj
  //       // if (!roles || roles.length <= 0) {
  //       //   reject('getInfo: roles must be a non-null array!')
  //       // }
  //       //commit('SET_ROLES', roles)
  //       // commit('SET_NAME', name)
  //       // commit('SET_USERID', userId)
  //       // commit('SET_ROLEID', roleId)
  //       //commit('SET_AVATAR', avatar)
  //       //commit('SET_INTRODUCTION', introduction)
  //       resolve(obj)
  //       console.log('IS getMenus 33')
  //     }).catch(error => {
  //       reject(error)
  //       console.log('IS getMenus 55')

  //     })
  //   })
  // },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      try {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
