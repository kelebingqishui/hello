import { http } from '../utils/request'

// 获取用户信息
export const getUserInfo = (options) => http.get('/system/user/info', '', options)