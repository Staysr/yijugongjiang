// pages/bulleInformation/bulleInformation.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;

    var loginInforMation = api.isloginStatus();

    self.setData({
      isloginStatus: loginInforMation.isloginStatus,
      userid: loginInforMation.userid,
      userInfomation: loginInforMation.userInfomation
    })
    console.log(loginInforMation)

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
    var self = this;
    self.onLoad();
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var page = self.data.page;
  var aid = wx.getStorageSync("aid")
    api.http('json/message_list', 'GET', {aid: aid}
      , function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.code ==1)
        {
          if (res.message.length==0)
          {
            self.setData({
              message: res.message,
              isLoadding: false,
              isHasData:true
            })
            return false;
          }
          else
          {
            var isLoadding = res.message.length >= 15 ? true : false;
            self.setData({
              message: res.message,
              isLoadding: isLoadding,
               isHasData: false
            })
          }   
        }
        console.log(res)
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
  var self = this;

  var page = self.data.page;
  page ++
  var message = self.data.message;
  // isLoadding
    var aid = wx.getStorageSync("aid")
    api.http('json/message_list', 'GET', { page: page,aid:aid }
    , function (res) {
      console.log(res)
      if (res.code == 1) {
        var messageNew = message.concat(res.message)
        if (res.message.length <10) 
         {
          self.setData({
            message: messageNew,
            isLoadding: false,
            isHasData: false,
            page:page
          })
        }
        else if (res.message.length ==10)
        {
          self.setData({
            message: messageNew,
            isLoadding: true,
            isHasData: false,
            page: page
          })
        }
    
    
      
    }
    
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
  ,

  // 发布供求信息


  // 


})