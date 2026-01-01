const app = getApp();
const util = require('../../../utils/util');

Page({
  data: {
    oldPhone: '',
    desensitizedPhone: '',
    newPhone: '',
    code: '',
    counting: false,
    loading: false,
    canSubmit: false
  },

  onLoad() {
    const phone = app.globalData.userInfo.phone;
    this.setData({
      oldPhone: phone,
      desensitizedPhone: util.desensitizedPhone(phone)
    });
  },

  onPhoneChange(e) {
    this.setData({ newPhone: e.detail }, this.checkForm);
  },

  onCodeChange(e) {
    this.setData({ code: e.detail }, this.checkForm);
  },

  checkForm() {
    const { newPhone, code } = this.data;
    const canSubmit = newPhone.length === 11 && code.length >= 4;
    this.setData({ canSubmit });
  },

  // 发送验证码
  async sendCode() {
    if (!util.validatePhone(this.data.newPhone)) {
      return wx.showToast({ title: '手机号格式不正确', icon: 'none' });
    }
    const { oldPhone, newPhone } = this.data;
    if (oldPhone === newPhone) {
      wx.showToast({
        title: '手机号不可相同',
        icon: 'error'
      })
      return;
    }
    wx.showLoading({ title: '发送中...' });
    await app.api.userApi.getSmsCode(this.data.newPhone, { type: '1' }, { showLoading: false });
    wx.hideLoading();
    setTimeout(() => {
      wx.hideLoading();
      this.setData({ counting: true });
      wx.showToast({ title: '验证码已发送' });
    }, 800);
  },

  onCountDownFinish() {
    this.setData({ counting: false });
  },

  // 提交修改
  async submitChange() {
    this.setData({ loading: true });

    try {
      const params = {
        oldPhone: this.data.oldPhone,
        newPhone: this.data.newPhone,
        code: this.data.code
      }
      const updateResp = await app.api.userApi.updatePhone(params)
      if (updateResp.data.code === 200) {
        const userInfoRes = await app.api.userApi.getUserInfo({ showLoading: false });
        const userInfo = userInfoRes.data?.data || userInfoRes.data;
        wx.setStorageSync('userInfo', userInfo);
        app.globalData.userInfo = userInfo;
        // 更新成功
        setTimeout(() => {
          wx.showToast({ title: '更换成功', icon: 'success' });
          setTimeout(() => wx.navigateBack(), 800);
        }, 500);
      } else {
        wx.showToast({
          title: updateResp.data.message || '更改手机号错误',
          icon: 'error'
        })
      }
    } finally {
      this.setData({ loading: false });
    }
  }
});