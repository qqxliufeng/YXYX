import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const userId = 'userId'
const roleId = 'roleId'
const phone = 'phone'
const userNickName = 'userNickName'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setPhone(phone1) {
  return Cookies.set(phone, phone1)
}
export function setuserNickName(NickName) {
  return Cookies.set(userNickName, NickName)
}
export function getUserId() {
  return Cookies.get(userId)
}

export function setUserId(userId1) {
  return Cookies.set(userId, userId1)
}
export function getRoleId() {
  return Cookies.get(roleId)
}

export function setRoleId(roleId1) {
  return Cookies.set(roleId, roleId1)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
