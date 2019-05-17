// pages/preBalance/preBalance.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: "",
    moneyGet: "",
    issatisfy: false,
    msgWaring: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var self = this;
    var userid = wx.getStorageSync("userid");
    var aid = wx.getStorageSync("aid");
    console.log(userid)
    api.http('centre/getmoney', 'GET',
      { userid: userid,aid:aid }
      , function (res) {
        wx.hideLoading();
        if (res.code == 1) {
          self.setData({
            money: res.money,
            userid: userid
          })
        }
      })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
  , bindInputMoney: function (e) {
    var self = this;
    var moneyGet = e.detail.value;
    var money = self.data.money;
    if (moneyGet.length == 0 || !moneyGet || moneyGet == "") {
      self.setData({
        issatisfy: false
      })
    }
    else {
      self.setData({
        issatisfy: true
      })
    }
    self.setData({
      moneyGet: moneyGet
    })
  }
  , formSubmit: function (e) {

    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    console.log(e.detail.value)
    var self = this;
   var aid = wx.getStorageSync("aid")
    var moneydata = e.detail.value.moneydata
    var money = e.detail.value.money
    
  //   if (money > moneydata){
  //     wx.showToast({
  //       title: '提现金额有误',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //     return false;
  //  }
    api.http('centre/txmoney', 'GET',
      {
        aid: aid,
        userid: e.detail.value.userid,
        money: e.detail.value.money
      }
      , function (res) {
        if (res.code == 2){
          api.showWarningText(res.msg)
          return false
        }
        wx.hideLoading();
        if (res.code == 0) {
          self.setData({
            msgWaring: res.msg
          })
        }
        else {
          self.setData({
            msgWaring: ""
          })
          api.showSuccess('申请成功');
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        }
        console.log(res)


      })

  }
})