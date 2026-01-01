import Toast from '@vant/weapp/toast/toast';

const app = getApp();

Page({
  data: {
    phone: '',
    code: '',
    isPhoneValid: false,
    countdown: 0,
    agree: false,
    shakeAnim: false,
    isSubmitting: false
  },

  onShow() {
    if (wx.canIUse('hideHomeButton')) {
      wx.hideHomeButton();
    }
  },

  onPhoneInput(e) {
    const val = e.detail;
    this.setData({
      phone: val,
      isPhoneValid: /^1[3-9]\d{9}$/.test(val)
    });
  },

  onCodeInput(e) {
    this.setData({ code: e.detail });
  },

  onAgreeChange(e) {
    this.setData({ agree: e.detail });
  },

  /**
   * 查看协议详情
   * @param {Object} e - 事件对象，通过 data-type 区分协议类型
   */
  onViewProtocol(e) {
    const type = e.currentTarget.dataset.type;
    if (type && type === 'privacy') {
      wx.openPrivacyContract({
        success: () => { }
      })
    } else {
      // 用户协议
      wx.navigateTo({
        url: '/user/pages/user-protocol/index'
      });
    }
  },

  async getVerCode() {
    // 倒计时校验
    if (this.data.countdown > 0 || this.data.smsLoading) {
      return;
    }
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'error'
      })
      return;
    }
    // 校验手机号格式
    if (!this.data.isPhoneValid) {
      wx.showToast({ title: '手机号格式错误', icon: 'error' });
      return;
    }
    try {
      const res = await app.api.loginApi.getSmsCode(this.data.phone, { showLoading: true, msg: '发送中...' });
      // 启用倒计时
      console.log('响应:', res);
      this.startTimer();
      setTimeout(() => {
        wx.showToast({
          title: '验证码已发送,' + res.data.data,
          icon: 'success'
        });
      }, 600);
    } catch (err) {
      console.error('发送验证码失败', err);
    }
  },
  // 倒计时逻辑
  startTimer() {
    // 先清理可能存在的旧定时器，防止重复触发
    this.clearTimer();

    // 设置初始秒数
    this.setData({ countdown: 60 });

    this.timer = setInterval(() => {
      let cur = this.data.countdown;
      if (cur <= 1) {
        this.clearTimer();
      } else {
        this.setData({ countdown: cur - 1 });
      }
    }, 1000);
  },

  // 清理定时器
  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.setData({ countdown: 0 });
  },

  onUnload() {
    this.clearTimer();
  },

  async handleLogin() {
    const { phone, code, agree, isPhoneValid } = this.data;

    if (!isPhoneValid) {
      Toast('请输入正确的手机号');
      return;
    }
    if (code.length < 4) {
      Toast('请输入验证码');
      return;
    }
    if (!agree) {
      // 触发抖动效果
      this.setData({ shakeAnim: true });
      setTimeout(() => this.setData({ shakeAnim: false }), 400);
      wx.showToast({
        title: '请阅读并同意相关协议政策',
        icon: 'none'
      });
      return;
    }

    try {
      const requestData = {
        "strategy": "phone",
        "phone": phone,
        "vercode": code
      };
      const param = { cipher: JSON.stringify(requestData) };
      const res = await app.api.loginApi.userLogin(param, { msg: '登录中...' });
      console.log('用户登录接口响应:', res);
      // 保存cookie
      const setCookie = res.header['Set-Cookie'] || res.header['set-cookie'];
      if (setCookie) {
        const cookieStr = Array.isArray(setCookie) ? setCookie.join('; ') : setCookie;
        wx.setStorageSync('local_cookie', cookieStr);
      }
      // 保存token
      const token = res.data.data.access_token;
      if (token) {
        wx.setStorageSync('token', token);
      }
      // 然后获取用户信息
      const userInfo = await app.api.userApi.getUserInfo({ showLoading: false });
      console.log('获取用户信息:', userInfo.data.data);
      wx.setStorageSync('userInfo', userInfo.data.data);
      // 跳转首页
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 500);
    } catch (err) {
      console.log('用户登录错误', err);
    }
  },

  handleWechatLogin() {
    if (!this.data.agree) {
      this.setData({ shakeAnim: true });
      setTimeout(() => this.setData({ shakeAnim: false }), 500);
      wx.showToast({
        title: '请阅读并同意相关协议政策',
        icon: 'none'
      });
      return;
    }
    if (this.data.isSubmitting) return;
    this.setData({ isSubmitting: true });
    // 调用自动登录逻辑
    app.autoLogin().then(() => {
      this.setData({ isSubmitting: false });
      wx.hideLoading();
    }).catch(() => {
      this.setData({ isSubmitting: false });
      wx.hideLoading();
    });
  }
});