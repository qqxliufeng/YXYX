/*
 * @Descripttion: 描述
 * @version: 版本
 * @Author: lf
 * @Date: 2020-06-08 14:09:14
 * @LastEditors: lf
 * @LastEditTime: 2020-06-08 15:38:21
 */

/**
 * 基础模块名字
 */
const baseModuleUrl = '/yx/'

// ****************系统管理 --- 用户管理 **************** //

export const queryYouXingUserList = baseModuleUrl + 'queryYouXingUserList'

export const queryYouXingUserListByLike = baseModuleUrl + 'queryYouXingUserListByLike'

export const saveUser = baseModuleUrl + 'saveUser'

export const updateUser = baseModuleUrl + 'updateUser'

export const deleteUsers = baseModuleUrl + 'deleteUsers'

export const editPassword = baseModuleUrl + 'editPassword'

export const queryRolesByDeptId = baseModuleUrl + 'queryRolesByDeptId'

// ****************系统管理 --- 用户管理 **************** //

// ****************系统管理 --- 部门管理 **************** //

export const queryDepts = baseModuleUrl + 'queryDepts'

export const updateDept = baseModuleUrl + 'updateDept'

export const deleteDepts = baseModuleUrl + 'deleteDepts'

export const saveDept = baseModuleUrl + 'saveDept'

// ****************系统管理 --- 部门管理 **************** //

// ****************系统管理 --- 角色管理 **************** //

export const queryRoles = baseModuleUrl + 'queryRoles'

export const saveRole = baseModuleUrl + 'saveRole'

export const updateRole = baseModuleUrl + 'updateRole'

export const deleteRole = baseModuleUrl + 'deleteRole'

export const saveRoleMenus = baseModuleUrl + 'saveRoleMenus'

export const queryAllMenuByRole = baseModuleUrl + 'queryAllMenuByRole'

// ****************系统管理 --- 角色管理 **************** //

// ****************系统管理 --- 菜单管理 **************** //

export const queryAllMenu = baseModuleUrl + 'queryAllMenu'

export const saveMenu = baseModuleUrl + 'saveMenu'

export const updateMenu = baseModuleUrl + 'updateMenu'

export const deleteMenu = baseModuleUrl + 'deleteMenu'

// ****************系统管理 --- 菜单管理 **************** //

// ****************系统管理 --- 按钮管理 **************** //

export const queryAllButtonInMenu = baseModuleUrl + 'queryAllButtonInMenu'

export const saveMenuButton = baseModuleUrl + 'saveMenuButton'

export const deleteMenuButton = baseModuleUrl + 'deleteMenuButton'

export const updateMenuButton = baseModuleUrl + 'updateMenuButton'

export const queryAllUser = baseModuleUrl + 'queryAllUser'

export const queryAllUserLike = baseModuleUrl + 'queryAllUserLike'

export const queryMenuAndButtonByUser = baseModuleUrl + 'queryMenuAndButtonByUser'

export const grantButtonToUser = baseModuleUrl + 'grantButtonToUser'

// ****************系统管理 --- 按钮管理 **************** //

// ****************系统管理 --- 学习卡管理 **************** //

export const queryStudyCard = baseModuleUrl + 'queryStudyCard'

export const queryStudyCardLike = baseModuleUrl + 'queryStudyCardLike'

export const saveStudyCard = baseModuleUrl + 'saveStudyCard'

export const uploadStudyCardExcel = baseModuleUrl + 'uploadStudyCardExcel'

export const queryAllTextBookAndStudyCard = baseModuleUrl + 'queryAllTextBookAndStudyCard'

export const queryTextBookByStudyCardId = baseModuleUrl + 'queryTextBookByStudyCardId'

export const studyCardAssignedTextBook = baseModuleUrl + 'studyCardAssignedTextBook'

export const editStudyCardInfo = baseModuleUrl + 'editStudyCardInfo'

// ****************系统管理 --- 学习卡管理 **************** //

// ****************会员管理 --- 学校管理 **************** //

export const querySchoolList = baseModuleUrl + 'querySchoolList'

export const querySchoolListLike = baseModuleUrl + 'querySchoolListLike'

export const saveSchoolAndStudyCard = baseModuleUrl + 'saveSchoolAndStudyCard'

export const lockSchool = baseModuleUrl + 'lockSchool'

export const unLockSchool = baseModuleUrl + 'unLockSchool'

export const queryStudyCardBySchoolId = baseModuleUrl + 'queryStudyCardBySchoolId'

export const updateSchool = baseModuleUrl + 'updateSchool'

export const querySchoolBySchoolId = baseModuleUrl + 'querySchoolBySchoolId'

export const querySchoolRecordList = baseModuleUrl + 'querySchoolRecordList'

export const addSchoolRecord = baseModuleUrl + 'addSchoolRecord'

export const queryStudyCardNotBind = baseModuleUrl + 'queryStudyCardNotBind'

// ****************会员管理 --- 学校管理 **************** //
