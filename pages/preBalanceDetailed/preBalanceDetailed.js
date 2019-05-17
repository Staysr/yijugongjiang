// pages/preBalanceDetailed/preBalanceDetailed.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoadding:false,
    isHasData:false,
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     wx.showLoading({
       title: '加载中...',
       mask:true
     })
     var self =this;
     var userid =wx.getStorageSync("userid");
     console.log('userid:' + userid);
     api.http('centre/txmoneydetail', 'GET',
       { userid: userid }
       , function (res) {
          console.log(res)
          wx.hideLoading()
           if(res.code == 1)
           {
             if (res.money.length == 0)
             {
               self.setData({
                 money: res.money,
                 isLoadding:false,
                 isHasData: true
               })
             }
             else if (res.money.length <15)
             {
               self.setData({
                 money: res.money ,
                 isLoadding: false,
                 isHasData: false
               })
             }
             else if (res.money.length == 15) {
               self.setData({
                 money: res.money,
                 isLoadding: true,
                 isHasData: false
               })
             }
            
           }
           
          
         }
       )
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
    
    console.log('我刷新了列表')
    var self = this;
    var userid = wx.getStorageSync("userid");
    var page =self.data.page;
    var money= self.data.money;
    page++;
    console.log('userid:' + userid);
    api.http('centre/txmoneydetail', 'GET',
      { userid: userid, page}
      , function (res) {
        console.log(res)
        if (res.code == 1) {
        
          var moneyNew = money.concat(res.money)

          if (res.money.length == 0) {
            self.setData({
              money: moneyNew,
              isLoadding: false,
              page:page
            })
          }
          else if (res.money.length < 15) {
            self.setData({
              money: moneyNew,
              isLoadding: false,
              isHasData: false,
              page: page
            })
          }
          else if (res.money.length == 15) {
            self.setData({
              money: moneyNew,
              isLoadding: true,
              isHasData: false,
              page: page
            })
          }

        }

      }
    )

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})