import Dialog from '@vant/weapp/dialog/dialog';
import { desensitizedPhone } from '../../../utils/util'

const app = getApp();

Page({
  data: {
    userInfo: null,
    desPhone: ''
  },
  onShow() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      desPhone: desensitizedPhone(wx.getStorageSync('userInfo').phone)
    });
  },

  handlePrivacyProtocol() {
    wx.openPrivacyContract({
      success: () => {}
    })
  },

  clearCache() {
    wx.showModal({
      title: '提示',
      content: '清理缓存将清除图片缓存及部分本地临时数据，确定继续？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '清理中...', mask: true });
  
          try {
            const token = wx.getStorageSync('token');
            const userInfo = wx.getStorageSync('userInfo');
            wx.clearStorageSync();
            // 恢复关键数据，防止用户被迫退出
            wx.setStorageSync('token', token);
            wx.setStorageSync('userInfo', userInfo);
  
            setTimeout(() => {
              wx.hideLoading();
              wx.showToast({ title: '清理完成', icon: 'success' });
            }, 800);
          } catch (e) {
            wx.hideLoading();
            wx.showToast({ title: '清理失败', icon: 'none' });
          }
        }
      }
    });
  },

  // 退出登录
  onLogout() {
    Dialog.confirm({
      title: '提示',
      message: '确定要退出登录并返回登录页吗？',
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      confirmButtonColor: '#ee0a24'
    }).then(() => {
      // 清除本地所有登录凭证
      wx.removeStorageSync('token');
      wx.removeStorageSync('local_cookie');
      wx.removeStorageSync('userInfo');
      
      // 清空全局变量
      app.globalData.userInfo = null;
      app.globalData.token = '';

      // 跳转回手机登录页
      wx.reLaunch({
        url: '/login/pages/phone/index'
      });
    }).catch(() => {
      // 点击取消，无需操作
    });
  }
});