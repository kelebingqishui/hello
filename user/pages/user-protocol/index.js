// pages/protocol/protocol.js
const protocolData = require('../../../utils/userProtocol');

Page({
  data: {
    title: '协议详情',
    content: ''
  },

  onLoad: function (options) {
    this.setData({
      title: '用户服务协议指引',
      content: protocolData.serviceHtml
    });
    
    // 动态设置页面标题
    wx.setNavigationBarTitle({
      title: this.data.title
    });
  },

  handleBack() {
    wx.navigateBack();
  }
});