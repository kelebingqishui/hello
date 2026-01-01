import { http } from '../utils/request'

// 获取用户信息
export const getUserInfo = (options) => http.get('/system/user/info', '', options)

// 更新个人资料
export const updateUserProfile = (data) => http.post('/system/user/wxUpdate', data, { noReject: true })

// 更新手机号
export const updatePhone = (data) => http.post('/system/user/updatePhone', data, { noReject: true })

// 获取验证码
export const getSmsCode = (phone, data, options) => http.get('/auth/getSmsCode/' + phone, data, options)