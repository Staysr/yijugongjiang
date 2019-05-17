// pages/userLoginPage/userLoginPage.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCanSee: false,      //false : 没有开眼   true ： 已经开眼了
    image: app.globalData.imagesUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  setCanSee: function () {
    var self = this;

    self.setData({
      isCanSee: !self.data.isCanSee
    })

  }
  , formSubmit: function (e) {
    var self = this
    console.log(e);
    wx.showLoading({
      title: '登录中...',
      mask: true
    })
    var aid = wx.getStorageSync("aid");
    var phone = e.detail.value.phone;
    var name = e.detail.value.password;
    api.http('centre/pwdlogin', 'GET',{
      phone: phone,
      password:name,
      aid:aid
    }
      , function (res) {
        console.log(res)
        
        wx.hideLoading();
        if (res.code == 0){
          api.showWarningText('用户不存在!')
          return false
        }
        if (res.code == 1) {
          api.showSuccess('登录成功!')
          var userInfomation = JSON.stringify(res.user);
          console.log(userInfomation.status)
          wx.setStorageSync("userid", res.user.id)
          wx.setStorageSync("isloginStatus", "isloginStatus")
          wx.setStorageSync("userInfomation", userInfomation)
          wx.setStorageSync("userInfostatus", res.user.status)
          wx.removeStorageSync('captcha')
          if (res.user.status == 0){
            setTimeout(function () {
              wx.switchTab({
                url: '../personalCenter/personalCenter'
              })
            }, 1000)
          } else if (res.user.status == 1){
            var cid = res.user.cid
            var clubname = res.user.clubname
            api.http('json/companyEdit', 'GET', {
              id: cid
            }, function (res) {
              console.log(res)
              wx.reLaunch({
                url: '../wx_decorationcompany/wx_decorationcompany?name=' + clubname + "&dataid=" + res.id + "&id=" + cid
              })
            })
          } else if (res.user.status == 2){
            wx.reLaunch({
              url: '../personnel/personnel?name=' + res.user.clubname
            }) 
          } else if (res.user.status == 3){
            wx.reLaunch({
              url: '../personnel/personnel?name=' + res.user.clubname
            }) 
          }else{

          }
        }
        else {
          api.showWarning(res.msg)
        }

        console.log(res)
      })
  }
})