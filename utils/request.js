// utils/request.js

// 获取当前环境信息
const accountInfo = wx.getAccountInfoSync();
const env = accountInfo.miniProgram.envVersion;
// 环境映射表
const envConfig = {
  // 开发环境
  'develop': 'http://192.168.31.192:9999/api',
  // 体验版
  'trial': 'https://mpadmin.ileyi.cn/api',
  // 正式环境
  'release': 'https://mpadmin.ileyi.cn/api'
}
// 后台服务地址
const BASE_URL = envConfig[env] || envConfig.release;

const request = (options) => {
  return new Promise((resolve, reject) => {
    // 处理 params (针对 GET 请求将参数拼接到 URL 后)
    let url = BASE_URL + options.url;

    if (options.params) {
      const query = Object.keys(options.params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(options.params[key])}`)
        .join('&');
      url += (url.includes('?') ? '&' : '?') + query;
    }

    // 显示加载中
    if (options.showLoading !== false) {
      const showMsg = options.msg ? options.msg : '加载中...';
      wx.showLoading({ title: showMsg, mask: true });
    }

    wx.request({
      url: url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        // 自动带上 Token
        'Authorization': 'Bearer ' + wx.getStorageSync('token') || '',
        'Cookie': wx.getStorageSync('local_cookie') || '',
        ...options.header
      },
      success: (res) => {
        console.log('网络请求成功响应:', res);
        // 统一拦截业务状态码
        if (res.statusCode === 200) {
          // 后端返回 { code: 200, data: ..., msg: ... }
          if (res.data.code === 200) {
            resolve(res);
          } else if(res.data.code == 1101) {
            wx.navigateTo({ url: '/login/pages/phone/index' });
            reject(res);
          } else {
            setTimeout(() => {
              wx.showToast({ title: res.data.message || '服务器开小差了', icon: 'error' });
            }, 600);
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          // Token 过期处理
          wx.reLaunch({ url: '/login/pages/phone/index' });
          reject(res);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '网络连接失败', icon: 'error' });
        reject(err);
      },
      complete: () => {
        if (options.showLoading !== false) {
          setTimeout(() => {
            wx.hideLoading();
          }, 500);
        }
      }
    });
  });
};

// 导出常用方法
export const http = {
  get(url, params, options = {}) {
    return request({ url, params, method: 'GET', ...options });
  },
  post(url, data, options = {}) {
    return request({ url, data, method: 'POST', ...options });
  },
  put(url, data, options = {}) {
    return request({ url, data, method: 'PUT', ...options });
  },
  delete(url, params, options = {}) {
    return request({ url, params, method: 'DELETE', ...options });
  }
};