// pages/changePassword/changePassword.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */

  data: {
    isCanSee: false, //false : 没有开眼   true ： 已经开眼了
    buttonDisable: false,
    password: "",
    passwordW: "",
    captcha: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    var userid = wx.getStorageSync("userid")
    self.setData({
      userid: userid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindPass: function(e) {
    var self = this;

    var password = e.detail.value;
    self.setData({
      password: password
    })
  },
  bindPassW: function(e) {

    var self = this;
    var passwordW = e.detail.value;
    self.setData({
      passwordW: passwordW
    })

  },
  formSubmit: function(e) {

    console.log(e.detail.value)
    var userid = e.detail.value.userid
    var oldpwd = e.detail.value.oldpwd
    var newpwd1 = e.detail.value.newpwd1
    var newpwd2 = e.detail.value.newpwd2
    if(oldpwd=="" || !oldpwd)
    { 
      api.showWarningText("密码不能为空!");
      return false;
    }
    if (newpwd1 == "" || !newpwd1) {
      api.showWarningText("新密码不能为空!");
      return false;
    }
    if (newpwd2 == "" || !newpwd2) {
      api.showWarningText("确认密码不能为空!");
      return false;
    }
    if (newpwd2 != newpwd1)
    {
      api.showWarningText("新密码和确认密码不一样!");
      return false;
    }

    var self = this;
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    api.http('centre/alterpwd', 'POST', e.detail.value, function(res) {
      wx.hideLoading()
      console.log(res)
      if (res.code == 1) {
        api.showSuccess(res.msg);
        setTimeout(function() {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000)
      } else {
        api.showWarningText(res.msg);
      }
    })




  }








  // 获取验证码
})