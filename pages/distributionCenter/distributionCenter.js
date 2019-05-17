// pages/distributionCenter/distributionCenter.js
const app = getApp()
const api = require('../../utils/http.js');
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
   var self =this;
   var userid =wx.getStorageSync("userid");
   self.setData({
     userid: userid
   })
   wx.showLoading({
     title: '加载中...',
     mask:true
   })
   api.http('centre/distributor', 'GET', { userid: userid}
     , function (res) {
       wx.hideLoading();
       console.log(res)
       if(res.code==1)
       {
         self.setData({
           zhaibi: res.zhaibi
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
})