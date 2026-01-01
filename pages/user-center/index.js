const app = getApp();
import { desensitizedPhone } from '../../utils/util'

Page({
  data: {
    userInfo: null,
    desPhone: ''
  },

  onShow() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      desPhone: desensitizedPhone(wx.getStorageSync('userInfo').phone)
    })
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
      url: '/user/pages/user-setting/index',
      success: () => {},
      fail: (err) => {
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
      wx.reLaunch({
        url: '/login/pages/phone/index',
        success: () => {
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