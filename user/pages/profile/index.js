const app = getApp();
import Notify from '@vant/weapp/notify/notify';

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
    const user = wx.getStorageSync('userInfo')
    // 初始化数据，从全局获取
    this.setData({
      userInfo: {
        userId: user.userId,
        avatar: user.avatar,
        nickName: user.nickName,
        phone: user.phone,
        email: user.email,
        sex: String(user.sex || '0')
      }
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

  // 昵称
  onNickNameBlur(e) {
    this.setData({ 'userInfo.nickName': e.detail.value });
  },

  // 性别点击选择方法
  onSexTap() {
    const that = this;
    const sexItems = ['男', '女'];

    wx.showActionSheet({
      itemList: sexItems,
      alertText: '请选择性别',
      success(res) {
        // res.tapIndex 是用户点击的索引：0 是男，1 是女
        const selectedSex = String(res.tapIndex);
        that.setData({
          'userInfo.sex': selectedSex
        });
      },
      fail(res) {
        console.log('取消选择');
      }
    });
  },

  // 手机号输入
  onPhoneInput(e) {
    this.setData({ 'userInfo.phone': e.detail });
  },

  // 邮箱输入
  onEmailInput(e) {
    this.setData({ 'userInfo.email': e.detail });
  },

  // 保存资料
  async saveProfile() {
    this.setData({ loading: true });
    try {
      // 调用你之前写好的 update 接口
      console.log('更新用户资料：', this.data.userInfo);
      const res = await app.api.userApi.updateUserProfile(this.data.userInfo);

      if (res.data.code === 200) {
        wx.showToast({ title: '修改成功', icon: 'success' });
        // 同步更新全局数据
        const userInfoRes = await app.api.userApi.getUserInfo({ showLoading: false });
        wx.setStorageSync('userInfo', userInfoRes.data?.data);
        that.globalData.userInfo = userInfoRes.data?.data;

        // 延迟返回上一页
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      } else {
        console.log('错误', res.data.message);
        Notify({ 
          type: 'danger', 
          message: res.data.message || '服务器开小差了'
        });
      }
    } catch (err) {
      console.error('保存失败', err);
    } finally {
      this.setData({ loading: false });
    }
  }
});