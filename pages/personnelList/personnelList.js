// pages/personnelList/personnelList.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuid:'0',
    wtype:'',
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setStorageSync("gstype", options.classid)
    var self = this;
    if (options.classid == 2){
      wx.setNavigationBarTitle({
        title: "设计师"//页面标题为路由参数
      })
      self.setData({
        titledata: "严选设计师"
      })
      // return false;
    }else{
      wx.setNavigationBarTitle({
        title: "工长"//页面标题为路由参数
      })
      self.setData({
        titledata: "严选工长"
      })
      // return false;
    }
    wx.setStorageSync("type", options.classid)
    var classid = options.classid;
    console.log(classid)
		var aid = wx.getStorageSync("aid");
    self.wtype = classid;
    api.http('json/workerList', 'GET', {
     aid:aid,
		 type:classid
    }, function (res) {
      console.log(res)
      self.setData({
        workerlist:res.workerlist,
        isHasData: true
      })
     
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
  
  menuTap:function(e){
    var self = this;
    var menuid = e.currentTarget.dataset.currentid;
    console.log(menuid)
    self.setData({
      menuid:menuid
    });
    self.reqFunction(menuid);
   
  },
  personnerTap:function(e){
    var workerid = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    wx.setStorageSync("workerid", workerid = e.currentTarget.dataset.id)
    var gstype = wx.getStorageSync("gstype");
    wx.navigateTo({
      url: '../personnel/personnel?type=' + gstype + "&name=" + name,
    })
  },
  reqFunction: function (menuid){
    var self = this;
    var aid = wx.getStorageSync("aid");
    var type = wx.getStorageSync("type");
    var wtype = self.data.wtype;
    api.http('json/workerList', 'GET', {
      aid: aid,
      type: type,
       strict: menuid
    }, function (res) {
      console.log(res)
      self.setData({
        workerlist: res.workerlist
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var page = that.data.page;
    page++;
    var aid = wx.getStorageSync("aid")
    var type = wx.getStorageSync("type");
    api.http('json/workerList', 'GET', {
      aid: aid,
      type: type,
      page:page
    }, function (res) {
      console.log(res)
      if (res.code == 1) {
        if (res.workerlist.length == 0) {
          self.setData({
            isLoadding: false,
            isHasData: true
          })
          return false;
        }
        else {
          var isLoadding = res.workerlist.length >= 1 ? true : false;
          let arr = res.workerlist
          arr.map((val, index, arr) => {
            workerlist.push(val)
          })
          console.log('第三层', workerlist)
          self.setData({
            workerlist: workerlist,
            isLoadding: isLoadding,
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
})