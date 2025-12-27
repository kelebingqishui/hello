const app = getApp();

Page({
  data: {
    oldPhone: '',
    desensitizedPhone: '', // 脱敏后的手机号
    newPhone: '',
    code: '',
    counting: false,
    loading: false,
    canSubmit: false
  },

  onLoad() {
    const phone = app.globalData.userInfo.phone || '17633623801';
    this.setData({
      oldPhone: phone,
      desensitizedPhone: phone.replace(/(\3)\d{4}(\d{4})/, '$1****$2')
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
    if (this.data.newPhone.length !== 11) {
      return wx.showToast({ title: '手机号格式不正确', icon: 'none' });
    }
    
    wx.showLoading({ title: '获取中...' });
    // 模拟接口调用
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
      // 实际调用后端接口
      // const res = await app.api.user.updatePhone({ phone: this.data.newPhone, code: this.data.code });
      
      setTimeout(() => {
        wx.showToast({ title: '更换成功', icon: 'success' });
        // 同步更新全局数据
        app.globalData.userInfo.phone = this.data.newPhone;
        
        setTimeout(() => wx.navigateBack(), 1500);
      }, 1000);
    } finally {
      this.setData({ loading: false });
    }
  }
});