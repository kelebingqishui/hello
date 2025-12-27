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
      const pa = {
        "withCredentials": true,
        "lang": 'zh_CN'
      }
      wx.getUserInfo(pa);
    } else {
      console.log('token存在,获取用户信息');
      // 本地存储有token,请求用户信息
      const that = this;
      // 这个请求会判断授权信息是否正确,如果不正确会自动跳转登录页
      that.api.userApi.getUserInfo({ showLoading: false }).then(res => {
        // 注意：这里使用 res，它是后端返回的真实数据
        console.log('用户信息成功获取:', res.data);

        const userData = res.data?.data;
        if (userData) {
          wx.setStorageSync('userInfo', userData);
          that.globalData.userInfo = userData;
        }
      }).catch(err => {
        console.error('获取用户信息失败', err);
      });
      if (!token) {
        console.log('未检测到 Token，跳转登录页');
        wx.reLaunch({ url: '/login/pages/phone/index' });
      }
      this.initLogs();
      // 跳转首页
      wx.switchTab({
        url: '/pages/index/index',
      })
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
          const response = await that.api.loginApi.userLogin(param, { msg: '自动登录中...' });

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

          // 跳转首页
          setTimeout(() => {
            wx.showToast({ title: '登录成功', icon: 'success' });
            wx.switchTab({ url: '/pages/index/index' });
          }, 500);

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

  initLogs() {
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
  },

  globalData: {
    userInfo: null,
    token: '',
    code: ''
  }
})