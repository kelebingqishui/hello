import { http } from '../utils/request'

// 获取验证码
export const getSmsCode = (phone, options) => http.get('/auth/getSmsCode/' + phone, '', options)
// 用户登录
export const userLogin = (data, options) => http.post("/auth/login", data, options)