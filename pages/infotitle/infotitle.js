// pages/infotitle/infotitle.js
const app = getApp()
const api = require('../../utils/http.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: app.globalData.imagesUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
		wx.setNavigationBarTitle({
			title: options.name,
		})
    that.caseInfo(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  caseInfo: function (options) {
    var that = this;
    wx.setStorageSync("options", options.id)
    api.http('json/caseInfo', 'GET', {
      id: options.id
    }, function (res) {
      console.log(res)
      that.setData({
        case: res.case,
        phone: res.phone
      })
      WxParse.wxParse('article', 'html', res.case.intro, that, 5);
    })
  },
  myiszhuangxiou: function () {
    var options = wx.getStorageSync("options")
    wx.navigateTo({
      url: '../myiszhuangxiou/myiszhuangxiou?options=' + options
    })
  },
  goAddress: function (e) {
    console.log(e)
    var address = e.currentTarget.dataset.address;
    wx.navigateTo({
      url: '../VRAddress/VRAddress?vradd=' + address,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  phone: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone // 仅为示例，并非真实的电话号码
    })
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})