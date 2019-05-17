// pages/VRResource/VRResource.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "",
    image: app.globalData.imagesUrl,
    currentTab: 1,
    scrollLeft: 1,
    page: 1
    // load: true,
    // loading: false,//加载动画的显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        console.log(calc)
        self.setData({
          winHeight: calc
        });
      }
    });

    var aid = wx.getStorageSync("aid");
    api.http('json/vrList', 'GET', {
      aid: aid,
      type: self.data.currentTab
    }, function (res) {
      console.log(res)
      self.setData({
        vrlist: res.vrlist
      })
      self.onReach(self.data.currentTab);
    })
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var self = this;
    var cur = e.target.dataset.current;
    if (self.data.currentTaB == cur) {
      return false;
    } else {
      self.setData({
        currentTab: cur
      })
      var aid = wx.getStorageSync("aid");
      api.http('json/vrList', 'GET', {
        aid: aid,
        type: cur
      }, function (res) {
        console.log(res)
        self.setData({
          vrlist: res.vrlist
        })
        self.onReach(cur);
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    var that = this;
    if (that.data.currentTab > 4) {
      that.setData({
        scrollLeft: 300
      })
    } else {
      that.setData({
        scrollLeft: 0
      })
    }
  },
  formSubmit: function (e) {
    var self = this;
    console.log(e)
    console.log(e.detail.value)
    var search = e.detail.value["name"]
    if (!search) {
      //  api.showWarningText('请填写搜索条件!');
      //  return false;
      search = "";
      console.log('查询所有的')

    }
    var page = 1;

    var aid = wx.getStorageSync("aid");
    api.http('json/vrList', 'GET', {
      aid: aid,
      type: self.data.currentTab,
      search: search
    }, function (res) {
      console.log(res)
      if (res.vrlist == "") {
        wx.showLoading({
          title: '!没有该内容',
          duration: 1000
        })
        self.onLoad()
      }

      self.setData({
        vrlist: res.vrlist
      })

    })
  },
  onShareAppMessage(res) {
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '转发',
      path: '/pages/VRResource/VRResource/topic/topic?jsonStr=' + this.data.list,
      success: function (res) {
        console.log(res)
        var userid = wx.getStorageSync("userid")
        wx.setStorageSync("pid", userid )
      }
    }
  },
  navNext: function (e) {
    console.log(e)
    var currTab = e.currentTarget.dataset.onid;
    var vrid = e.currentTarget.dataset.id;
    var vrname = e.currentTarget.dataset.name;
    if (currTab == 1) {
      //品牌馆
      wx.navigateTo({
        url: '../brandShop/brandShop?shopid=' + vrid + '&shopname=' + vrname,
      })
    } else if (currTab == 2) {
      //产品
      wx.navigateTo({
        url: '../productDetails/productDetails?goodid=' + vrid + '&name=' + vrname,
      })
    } else {
      //装修公司、设计师、工长
      wx.navigateTo({
        url: '../infotitle/infotitle?id=' + vrid + '&name=' + vrname,
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReach: function (vrtype) {
    var self = this;
    let page = self.data.page;
    let aid = wx.getStorageSync("aid");
    page++;
    let vrlist = this.data.vrlist;

    console.log('第一层', this.data.vrlist)
    api.http('json/vrList', 'GET', {
      aid: aid,
      type: vrtype,
      page: page
    }, function (res) {
      if (res.code == 1) {
        if (res.vrlist.length == 0) {
          self.setData({
            isLoadding: false,
            isHasData: true
          })
          return false;
        } else {
          console.log(res)
          var isLoadding = res.vrlist.length >= 1 ? true : false;
          let arr = res.vrlist
          arr.map((val, index, arr) => {
            vrlist.push(val)
          })
          console.log('第三层', vrlist)
          // var comment = that.data.moment;
          self.setData({
            vrlist: vrlist,
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