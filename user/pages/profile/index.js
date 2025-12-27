const app = getApp();

Page({
  data: {
    userInfo: {
      avatar: '',
      nickName: '',
      userId: '',
      phone: '',
      sex: '',
      email: ''
    },
    loading: false
  },

  onLoad() {
    // 初始化数据，从全局获取
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },

  // 选择头像回调
  async onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    // 这里建议先上传到服务器拿到真实的 URL
    this.uploadAvatar(avatarUrl);
  },

  // 上传头像
  async uploadAvatar(tempFilePath) {
    wx.showLoading({ title: '上传中...' });
    try {
      // 这里的接口需对应你后端的上传文件接口
      // const res = await app.api.common.upload(tempFilePath);
      // const realUrl = res.data.url;
      
      this.setData({
        'userInfo.avatar': tempFilePath // 先预览，等保存时一起提交，或直接这里更新
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 监听昵称变化
  onNickNameChange(e) {
    this.setData({ 'userInfo.nickName': e.detail });
  },

  // 昵称失去焦点（微信 input type="nickname" 的特殊处理）
  onNickNameBlur(e) {
    this.setData({ 'userInfo.nickName': e.detail.value });
  },

  // 保存资料
  async saveProfile() {
    this.setData({ loading: true });
    try {
      // 调用你之前写好的 update 接口
      const res = await app.api.userApi.update(this.data.userInfo);
      
      if (res.code === 200) {
        wx.showToast({ title: '修改成功', icon: 'success' });
        // 同步更新全局数据
        app.globalData.userInfo = this.data.userInfo;
        wx.setStorageSync('userInfo', this.data.userInfo);
        
        // 延迟返回上一页
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    } catch (err) {
      console.error('保存失败', err);
    } finally {
      this.setData({ loading: false });
    }
  }
});