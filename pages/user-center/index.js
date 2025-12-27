const app = getApp();

Page({
  data: {
    userInfo: null
  },

  onShow() {
    // 因为你有 app.js 的拦截，这里直接请求即可
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    console.log('用户中心赋值后信息:', this.data.userInfo);
  },

  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '退出后将无法使用部分系统功能',
      confirmColor: '#1989fa',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('local_cookie');
          wx.removeStorageSync('userInfo')
          wx.reLaunch({
            url: '/login/pages/phone/index'
          });
        }
      }
    });
  },

  // 跳转用户信息设置页
  toSettings() {
    wx.navigateTo({
      url: '/user/pages/user-center/index',
      success: () => {
        console.log('正在跳转到设置页面...');
      },
      fail: (err) => {
        console.error('跳转失败，请检查路径是否正确:', err);
        wx.showToast({
          title: '页面开发中',
          icon: 'none'
        });
      }
    });
  },
  clickNickName() {
    const { userInfo } = this.data;
    // 判断是否拥有 userId (即是否已登录认证)
    if (!userInfo || !userInfo.userId) {
      // 未登录或认证失效
      wx.navigateTo({
        url: '/login/pages/phone/index',
        success: () => {
          console.log('引导用户前往登录');
        }
      });
    } else {
      // 已登录，点击昵称跳转到“个人资料”页面进行编辑
      wx.navigateTo({
        url: '/user/pages/profile/index'
      });
    }
  }
});