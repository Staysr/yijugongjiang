// pages/distributionCenList/distributionCenList.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page :1
    , isHasData:false
    , isLoadding:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var self = this;
    var userid = wx.getStorageSync("userid");
    var page =self.data.page;
    self.setData({userid: userid})
    wx.showLoading({title: '加载中...',mask: true})  
    api.http('centre/zhaibilist', 'GET', { userid: userid ,page:page}
      , function (res) {
        wx.hideLoading();
        console.log(res)
        if(res.user.length == 0)
        {
          self.setData({
            user: res.user,
            isHasData:true
          })
        }
        else if (res.user.length <10)
        {
          self.setData({
            user: res.user,
            isLoadding:false
          })
        }
        else if (res.user.length ==10) {
          self.setData({
            user: res.user,
            isLoadding: true
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
      console.log('上拉刷新')

      var self = this;
      var userid = wx.getStorageSync("userid");
      var page = 1;
      self.setData({ userid: userid })
      wx.showLoading({ title: '加载中...', mask: true })
      api.http('centre/zhaibilist', 'GET', { userid: userid, page: page }
        , function (res) {
          wx.hideLoading();
          console.log(res)
          wx.stopPullDownRefresh();
          if (res.user.length == 0) {
            self.setData({
              user: res.user,
              isHasData: true
            })
          }
          else if (res.user.length < 10) {
            self.setData({
              user: res.user,
              isLoadding: false
            })
          }
          else if (res.user.length == 10) {
            self.setData({
              user: res.user,
              isLoadding: true
            })
          }
        })


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
   console.log('我已经开始刷新了')
   var self = this;
   var userid = self.data.userid;
   var page = self.data.page;
   page++;
   var user = self.data.user;
   api.http('centre/zhaibilist', 'GET', { userid: userid, page: page }
     , function (res) {
       console.log(res)

       var usersNew = user.concat(res.user)

       if (res.user.length == 0) {
         self.setData({
           user: usersNew
         })
       }
       else if (res.user.length < 10) {
         self.setData({
           user: usersNew,
           isLoadding: false,
           page: page
         })
       }
       else if (res.user.length == 10) {
         self.setData({
           user: usersNew,
           isLoadding: true,
           page: page
         })
       }
     })


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})