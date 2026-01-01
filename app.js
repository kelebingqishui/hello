// app.js
import * as loginApi from './api/login'
import * as userApi from './api/user'
import { http } from './utils/request'

App({
  api: {
    loginApi,
    userApi
  },
  http,

  onLaunch() {
    console.log('系统启动');
    // 判断是否有token
    const token = wx.getStorageSync('token');
    if (!token) {
      console.log('自动登录');
      // 自动登录
      this.autoLogin();
    } else {
      console.log('token存在,获取用户信息');
      const that = this;
      // 这个请求会判断授权信息是否正确,如果不正确会自动跳转登录页
      that.api.userApi.getUserInfo({ showLoading: false })
        .then(res => {
          if (res.data.code === 200) {
            const userData = res.data.data;
            wx.setStorageSync('userInfo', userData);
            that.globalData.userInfo = userData;

            wx.switchTab({ url: '/pages/index/index' });
          } else {
            throw new Error(res.data.message || '有点问题');
          }
        }).catch(err => {
          wx.showToast({
            title: err,
            icon: 'error'
          });
        });
    }
  },

  async autoLogin() {
    const that = this;
    wx.login({
      success: async (loginRes) => {
        console.log('获取微信 Code 成功:', loginRes.code);

        try {
          const requestData = {
            "strategy": "wechat",
            "code": loginRes.code
          };
          const param = { cipher: JSON.stringify(requestData) };

          // 发起微信登录请求
          const response = await that.api.loginApi.userLogin(param, { msg: '登录中...' });

          // 解析 Cookie
          const setCookie = response.header['Set-Cookie'] || response.header['set-cookie'];
          if (setCookie) {
            const cookieStr = Array.isArray(setCookie) ? setCookie.join('; ') : setCookie;
            wx.setStorageSync('local_cookie', cookieStr);
          }

          // 获取 Token
          const token = response.data?.data?.access_token;

          if (token) {
            wx.setStorageSync('token', token);
            that.globalData.token = token;
          }

          // 获取用户信息
          const userInfoRes = await that.api.userApi.getUserInfo({ showLoading: false });
          const userInfo = userInfoRes.data?.data || userInfoRes.data;

          console.log('获取用户信息成功:', userInfo);
          wx.setStorageSync('userInfo', userInfo);
          that.globalData.userInfo = userInfo;

          wx.showToast({ title: '登录成功', icon: 'success', mask: true });
          // 跳转首页
          setTimeout(() => {    
            wx.switchTab({ url: '/pages/index/index' });
          }, 800);
        } catch (error) {
          // 微信自动登录错误,跳转登录页
          wx.reLaunch({ url: '/login/pages/phone/index' });
        }
      },
      fail: (err) => {
        // 微信自动登录失败
        wx.reLaunch({ url: '/login/pages/phone/index' });
      }
    })
  },

  globalData: {
    userInfo: null,
    token: '',
    code: ''
  }
})