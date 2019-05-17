// pages/clubList/clubList.js
const app = getApp()
const api = require('../../utils/http.js');
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    image: app.globalData.imagesUrl,
    loadProgress: 0,
    clubclass: [
      {
        id:"51",
      },
      {
        id: "2",
      },
      {
        id: "3",
      },
    ],
    status:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    console.log(options)
    var userid = options.userid;
    self.setData({
      name: options.name
    })
    wx.setNavigationBarTitle({
      title: options.name + "俱乐部"//页面标题为路由参数
    })
    wx.setStorageSync("jubclassid", userid)
    self.userclass(userid)
    self.loadProgress()

  },

  images:function(e){
    console.log(e)
    var img = e.currentTarget.dataset.img
    wx.previewImage({
      current: img,
      urls: [img]
    })
  },
  // 加载
  loadProgress:function() {
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
  //跳转登入
  releaseinformation:function(){
    var isloginStatus = wx.getStorageSync("isloginStatus")
    if (isloginStatus == "" || isloginStatus == undefined){
      wx.navigateTo({
        url: '../registrationPage/registrationPage',
      })
      return false;
    }
  wx.navigateTo({
    url: '../releaseinformation/releaseinformation',
  })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let clublist = this.data.clublist
    console.log('第一层', this.data.comment)
    var self = this;
    var userid = self.data.userid;
    // var users = self.data.users;
    var page = self.data.page;
    page++;
    var aid = wx.getStorageSync("aid")
    var jubclassid = wx.getStorageSync("jubclassid")
    var userid = wx.getStorageSync("userid")
    api.http('json/clubList', 'GET', { page: page, aid: aid, uid: userid, cid: jubclassid}, function (res) {
      console.log(res)
      if (res.code == 1) {
        if (res.clublist.length == 0) {
          self.setData({
            isLoadding: false
          })
          return false;
        }
        else {
          var isLoadding = res.clublist.length >= 1 ? true : false;
          let arr = res.clublist
          arr.map((val, index, arr) => {
            clublist.push(val)
          })
          console.log('第三层', clublist)
          // var comment = that.data.moment;
          self.setData({
            clublist: clublist,
            page: page,
            isHasData: true
          })
        }
      }
    })
  },
  // 拨打电话
  phone:function(e){
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone // 仅为示例，并非真实的电话号码
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

  , userclass: function (cid) {

    var self = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var page = self.data.page;
    var aid = wx.getStorageSync("aid")
    var userid = wx.getStorageSync("userid")
    api.http('json/clubList', 'GET', { cid: cid, page: page,aid:aid,uid:userid}, function (res) {
      console.log(res)
      wx.hideLoading();
      if (res.clublist.length == 0){
        api.showWarningText("暂无数据")
      }
      if(res.code == 1){
        self.setData({
          isLoadding: false,
          isHasData: true,
          clublist:res.clublist,
           status: res.status
        })
        return false;
      }
      // if (res.code == 1) {
      //   if (res.users.length == 0) {
      //     self.setData({
      //       users: res.users,
      //       isLoadding: false,
      //       isHasData: true
      //     })
      //     return false;
      //   }
      //   else {
      //     var isLoadding = res.users.length >= 15 ? true : false;
      //     self.setData({
      //       users: res.users,
      //       isLoadding: isLoadding,
      //       isHasData: false
      //     })
      //   }
      // }
    })



  }
})