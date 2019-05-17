// pages/club/club.js
const app = getApp()
const api = require('../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    page: 1,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    image: app.globalData.imagesUrl,
    TabCur: 0,
    scrollLeft: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    wx.showLoading({
      title: '加载中',
    })
    self.indexbanner(); //俱乐部轮播图
    self.indexshow(); //俱乐部的信息

    var aid = wx.getStorageSync("aid")
    wx.setStorageSync("zgstype", 1)
    api.http('json/isclub', 'GET', {
      aid: aid,
      type: 1
    }, function(res) {
      self.setData({
        club: res.club,
        isHasData: true
      })
      console.log(res)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    var self = this;
    var zgsclass = [{
        id: 1,
        name: "装修公司",
        type: 1,
      },
      {
        id: 2,
        name: "设计师",
        type: 2,
      },
      {
        id: 3,
        name: "工长",
        type: 3,
      }
    ]
    console.log(zgsclass)
    self.setData({
      zgsclass: zgsclass
    })


  },
  tabSelect(e) {
    console.log(e)
    wx.setStorageSync("zgstype", e.currentTarget.dataset.type)
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })

    var aid = wx.getStorageSync("aid")
    var self = this;
    api.http('json/isclub', 'GET', {
      aid: aid,
      type: e.currentTarget.dataset.type
    }, function(res) {
      self.setData({
        club: res.club,
        isHasData: true
        
      })
      console.log(res)
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  indexshow: function() {
    var that = this;
    var aid = wx.getStorageSync("aid")
    api.http('index/indexshow', 'GET', {
      aid: aid
    }, function(res) {

      console.log(res)
    })
  },
  // 首页推荐分类详情
  wx_details: function(e) {
    var type = e.currentTarget.dataset.id
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    if (e.currentTarget.dataset.type == 1) {
      wx.showLoading({
        title: '加载数据中...',
        mask: true
      })
      api.http('json/companyEdit', 'GET', {
        id: type
      }, function(res) {
        console.log(res.id)
        wx.hideLoading();
        var type = wx.getStorageSync("type_code")
        wx.setStorageSync("onpageid", "俱乐部进来的")
        wx.navigateTo({
          url: '../wx_decorationcompany/wx_decorationcompany?id=' + id + '&type=' + type + "&dataid=" + res.id + "&name=" +name,
        })
      })
      wx.setStorageSync("type_code", id)
      // wx.setStorageSync("onpageid", "俱乐部进来的")
    } else if (e.currentTarget.dataset.type == 2) {
      wx.navigateTo({
        url: '../personnel/personnel?id=' + id + "&name=" + name,
      })
      wx.setStorageSync("type", 2)
    } else {
      wx.navigateTo({
        url: '../personnel/personnel?id=' + id + "&name=" + name,
      })
      wx.setStorageSync("type", 3)
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let club = this.data.club
    console.log('第一层', this.data.comment)
    var self = this;
    var page = self.data.page; //分页
    page++;
    var aid = wx.getStorageSync("aid")
    var users = self.data.users;
    var name = self.data.name;
    var zgstype = wx.getStorageSync("zgstype")
    api.http('json/isclub', 'GET', {
      aid: aid,
      page: page,
      type: zgstype
    }, function(res) {

      console.log(res)
      if (res.code == 1) {
        if (res.club.length == 0) {
          self.setData({
            isLoadding: false,
            isHasData: true
          })
          return false;
        } else {
          var isLoadding = res.club.length >= 1 ? true : false;
          let arr = res.club
          arr.map((val, index, arr) => {
            club.push(val)
          })
          console.log('第三层', club)
          self.setData({
            club: club,
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
  onShareAppMessage: function() {

  },
  //=============1.1获取首页轮播图===========
  indexbanner: function() {
      var self = this;
      var aid = wx.getStorageSync("aid")
      api.http('index/indexbanner', 'GET', {
        aid: aid
      }, function(res) {
        console.log(res)
        self.setData({
          indexbanner: res.data
        })
        self.userClub();
      })
    }
    //===============1.1获取首页轮播图====================

    //========== 1.6 俱乐部（index/user）==========
    ,
  userClub: function() {
      console.log("俱乐部");
      var self = this;
      var page = self.data.page; //分页
      var aid = wx.getStorageSync("aid")
      api.http('json/club', 'GET', {
        page: page,
        aid: aid
      }, function(res) {
        console.log(res)
        wx.hideLoading();
        if (res.code == 1) {
          self.setData({
            clubclass: res.clubclass,

          })
          return false;
        }


      })
    }
    //========== 1.6 俱乐部（index/user）==========
    ,
  formSubmit: function(e) {
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
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var page = 1;
    api.http('index/club', 'GET', {
      lick: name,
      page: page
    }, function(res) {
      console.log(res)
      if (res.code == 1) {
        wx.hideLoading()
        self.setData({
          users: res.users,
          page: 1,
          name: name
        })
        if (res.users.length == 0) {
          self.setData({
            isLoadding: false,
            isHasData: true
          })
          return false;
        } else if (res.users.length < 15) {
          self.setData({
            isLoadding: false,
            isHasData: true
          })
        } else {
          self.setData({
            isLoadding: true,
            isHasData: false
          })
        }
      }
    })

    position: fixed;
  },
  clubclasstype:function(e){
    wx.navigateTo({
      url: '../clubList/clubList?userid=' + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name,
    })
  },
  //设计师工长
  navtoShopHome: function(e) {
    // var self = this;
    // console.log(e)
    // var classid = e.currentTarget.dataset.classid;
    wx.navigateTo({
      url: '../decorationcompany/decorationcompany',
    })
  },
  navtoShopHome1: function(e) {
    var self = this;
    console.log(e)
    var classid = e.currentTarget.dataset.classid;
    wx.navigateTo({
      url: '../personnelList/personnelList?classid=' + classid,
    })
  }
})