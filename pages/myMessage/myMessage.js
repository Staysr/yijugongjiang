// pages/myMessage/myMessage.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFirstOnload: true,
    page:1,
    isClick:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;

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

    self.indexmessage(); 
  },
  indexmessage: function () {
    var self = this;
    var aid = wx.getStorageSync("aid");
    api.http('index/indexmessage', 'GET', {
      aid: aid
    }, function (res) {
       console.log(res)
      self.setData({
        indexmessage: res.data
      })
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
  console.log('下拉刷新')
  var self =this;

  self.sendMessage();
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
  , sendMessage: function () {
    var self = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var userid = wx.getStorageSync("userid");
    // var page = self.data.page;
    console.log(userid)
    api.http('centre/historymessage', 'GET',
      { userid: userid, page: 1 }
      , function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(res)
        self.setData({
          isFirstOnload: false,
          page:1
        })
        if (res.code == 1) {
          if (res.message.length==0)
          {
          self.setData({
            message: res.message,
            isAdminLoadding: false,
            ishasData: true
          })
          }
          else if (res.message.length == 10) {
            self.setData({
              message: res.message,
              isAdminLoadding: true,
              ishasData:false
            })
          }
          else {
            self.setData({
              message: res.message,
              isAdminLoadding: false,
              ishasData: false
            })
          }
        }
        else { 

        }
        console.log(res)
      })
  }
  , sendMessagePullResh: function () {

  }
  ,
  edit: function (e) {
    console.log('编辑');
    var self = this;
    var message = self.data.message;//信息
    var activeindex = e.currentTarget.dataset.activeindex; //信息id
    console.log(message[activeindex])
    var editMessage = JSON.stringify(message[activeindex]);


    wx.navigateTo({
      url: '../MyReleaseInformation/MyReleaseInformation?status=1&editMessgae=' + editMessage
    })


  }
  ,
  delet: function (e) {
    var self = this;
    var isClick = self.data.isClick;//是否可以点击
    wx.showLoading({
      title: '删除中...',
      mask:true
    })
    console.log('删除');
    var delectIndex = e.currentTarget.dataset.activeindex; //选中的索引
    var messageid   = e.currentTarget.dataset.messageid; //信息id
    var message     = self.data.message;//信息
    api.http('centre/delmessage', 'GET',
      { id: messageid }
      , function (res) {
        wx.hideLoading();
        if (res.code == 1) {
          message.splice(e.currentTarget.dataset.activeindex, 1);
          if(message.length < 10)
          {
            self.sendMessage();
          }
          else
          {
            console.log(message)
            self.setData({
              message: message
            })
          }
          api.showSuccess(res.msg)
        }
        else {
          api.showWarning(res.msg)
        }
        console.log(res)
      })
  }




})