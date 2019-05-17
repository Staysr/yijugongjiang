// pages/clubdetails/clubdetails.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: app.globalData.imagesUrl,
    loadProgress: 0,
    imgsUrl: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    wx.setNavigationBarTitle({
      title: options.name + "俱乐部"//页面标题为路由参数
    })
    var clubdetails_id = options.id;
    that.clubdetails(clubdetails_id);//俱乐部详情
    that.loadProgress();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //加载
  loadProgress: function () {
    this.setData({
      loadProgress: this.data.loadProgress + 3
    })
    if (this.data.loadProgress < 100) {
      setTimeout(() => {
        this.loadProgress();
      }, 100)
    } else {
      this.setData({
        loadProgress: 0
      })
    }
  },
  images: function (e) {
    var self = this;
    console.log(e)
    var img = e.currentTarget.dataset.img

    wx.previewImage({
      current: img,
      urls: self.data.imgsUrl
    })
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
  // 俱乐部详情
  clubdetails: function (clubdetails_id) {
    var self = this;
    api.http('json/clubEdit', 'GET', { id: clubdetails_id }, function (res) {
      console.log(res)
      wx.setNavigationBarTitle({
        title: res.user.clubname + "俱乐部"//页面标题为路由参数
      })
      if (res.code == 1) {
        var imgs = [];
        for (var i = 0; i < res.club.length; i++) {
          imgs.push(res.club[i].pic);
        }
        self.setData({
          user: res.user,
          club: res.club,
          imgsUrl: imgs
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