// pages/decoration/decoration.js
const app = getApp();
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    scrollLeft: 0,
    page: 1,
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
    var that = this;
    that.strategyClass();//分类
    var cid = wx.getStorageSync("cid");
    if (cid) {
      console.log("有cid的值")
      var aid = wx.getStorageSync("aid")
      api.http('json/strategyList', 'POST', {
        cid: cid, aid: aid
      }, function (res) {
        console.log(res)
        that.setData({
          strategy: res.strategy,
        })
        that.onReachBottom(0);

      })
    } else {
      console.log("无cid的值")
      wx.setStorageSync("cid", 0)//默认
      var aid = wx.getStorageSync("aid")
      api.http('json/strategyList', 'POST', {
        cid: 0, aid: aid
      }, function (res) {
        console.log(res)
        that.setData({
          strategy: res.strategy,
        })
        that.onReachBottom(0);

      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  //分类
  strategyClass: function () {
    var that = this;
    var aid = wx.getStorageSync("aid");
    api.http('json/strategyClass', 'POST', {
      "aid": aid
    }, function (res) {
      console.log(res)
      that.setData({
        wx_class: res.class,

      })

    })
  },
  //列表
  strategyList: function (e) {
    var cid = wx.setStorageSync("cid", e.currentTarget.dataset.classid)
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    var that = this;
    var aid = wx.getStorageSync("aid")
    api.http('json/strategyList', 'POST', {
      cid: e.currentTarget.dataset.classid,
      aid: aid
    }, function (res) {
      console.log(res)
      that.setData({
        strategy: res.strategy,
      })

      that.onReachBottom(e.currentTarget.dataset.classid);
    })
  },
  //列表详情
  wx_list: function (e) {
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '../strategyEdit/strategyEdit?id=' + id,
    })
  },
  formSubmit: function (e) {
    var self = this;
    console.log(e)
    console.log(e.detail.value)
    var name = e.detail.value["name"]
    if (!name) {
      //  api.showWarningText('请填写搜索条件!');
      //  return false;
      name = "";
      console.log('查询所有的')

    }
    var page = 1;
    var cid = wx.getStorageSync('cid')
    var aid = wx.getStorageSync('aid')

    api.http('json/strategyList', 'GET', { search: name, aid: aid ,page: page, cid: cid }, function (res) {
      console.log(res)
      if (res.strategy == "") {
        wx.showLoading({
          title: '!没有该内容',
          duration: 1000
        })
        self.onShow()
      }

      self.setData({
        strategy: res.strategy,


      })

    })


  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("移除cid")
    wx.removeStorageSync("cid");//移除

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
    var page = self.data.page;//分页
    page++;

    var cid = wx.getStorageSync('cid')
    var aid = wx.getStorageSync('aid')

    api.http('json/strategyList', 'GET', { cid: cid, page: page, aid: aid }, function (res) {
      console.log(res)
      if (res.code == 1) {
        if (res.strategy.length == 0) {
          self.setData({
            isLoadding: false,
            isHasData: true
          })
          return false;
        }
        else {
          var isLoadding = res.strategy.length >= 1 ? true : false;
          let arr = res.strategy
          arr.map((val, index, arr) => {
            strategy.push(val)
          })
          console.log('第三层', strategy)
          // var comment = that.data.moment;
          self.setData({
            strategy: strategy,
            isLoadding: isLoadding,
            isHasData: false,
            page: page
          })
        }
      }
      console.log(res)

    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})