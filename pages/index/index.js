//index.js
//获取应用实例
const app = getApp()
const api = require('../../utils/http.js');

Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    indexbanner: "",
    isAllElement: false, //是否加载完成了
    isFristOnload: true,
    isloginStatus: false,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    image: app.globalData.imagesUrl,

  },
  onShow: function () {
    var self = this;
    // wx.pageScrollTo({
    //   scrollTop: 0,
    //   duration: 0
    // })
    self.indexbanner(); //轮播图
    self.indexmessage() //1.3 首页公告信息
    self.indexgoods(), //1.4 首页两个分类下商品
      self.indexshow(); //1.2 首页底部商家推荐
    var isFristOnload = self.data.isFristOnload;
    if (isFristOnload) {
      return false;
    }
    var isloginStatus = wx.getStorageSync("isloginStatus");
    console.log(isloginStatus)
    isloginStatus = isloginStatus ? "true" : "false";
    console.log(isloginStatus)
    self.setData({
      isloginStatus: isloginStatus
    })
  },
  onLoad: function () {
    var self = this;
    wx.showLoading({
      title: '加载模块中...',
    })
    var isloginStatus = wx.getStorageSync("isloginStatus");
    console.log(isloginStatus)
    isloginStatus = isloginStatus ? "true" : "false";
    self.setData({
      isloginStatus: isloginStatus,
      isFristOnload: false
    })

    self.indexbanner(), //1.1获取首页轮播图
      self.indexgoods(), //1.4 首页两个分类下商品
      self.indexmessage(), //1.3 首页公告信息
      self.indexshow(); //1.2 首页底部商家推荐
    self.showModal();

  },
  //=============1.1获取首页轮播图===========
  indexbanner: function () {
    var aid = wx.getStorageSync("aid");
    var self = this;
    api.http('index/indexbanner', 'GET', {
      "aid": aid
    }, function (res) {
      console.log(res)
      self.setData({
        indexbanner: res.data
      })

      self.isLoadAllEle();

    })
  }
  //===============1.1获取首页轮播图====================
  ,
  //=============1.2 首页底部商家推荐===========
  indexshow: function () {
    var self = this;
    var aid = wx.getStorageSync("aid");
    api.http('index/indexshow', 'GET', {
      aid: aid
    }, function (res) {
      console.log(res)
      self.setData({
        indexshow: res.data
      })
      self.isLoadAllEle();

    })
  }
  //===============1.2 首页底部商家推荐====================
  ,
  //=============1.3 首页公告信息===========
  indexmessage: function () {
    var self = this;
    var aid = wx.getStorageSync("aid");
    api.http('json/new_message', 'GET', {
      aid: aid
    }, function (res) {
      console.log(res)
      var arr = res.message.length;

      console.log(arr)

      self.setData({
        indexmessage: res.message,
        mlength: arr
      })
      self.isLoadAllEle();
    })
  }
  //===============1.3 首页公告信息====================
  ,
  //=============1.4 首页两个分类下商品===========
  indexgoods: function () {
    var self = this;
    var aid = wx.getStorageSync("aid");
    api.http('index/indexgoods', 'GET', {
      aid: aid
    }, function (res) {
      console.log(res)

      self.setData({
        indexgoods: res.data
      })
      self.isLoadAllEle();
    })
  }
  //===============1.4 首页两个分类下商品====================
  ,
  navtoShopHome: function (e) {
    var self = this;
    wx.setStorageSync("classid", e.currentTarget.dataset.classid);
    wx.setStorage({
      key: 'classidyibu',//一级分类的id
      data: e.currentTarget.dataset.classid
    });
    wx.switchTab({
      url: '../shoppingMall/shoppingMall'
    })

  }


  // 判断所有商品都加在完成了在取消lloadding页面
  ,
  isLoadAllEle: function () {

    var self = this;
    //  indexbanner  indexshow  indexmessage indexgoods
    var indexbanner = self.data.indexbanner
    var indexshow = self.data.indexshow
    var indexmessage = self.data.indexmessage
    var indexgoods = self.data.indexgoods
    if (indexbanner && indexshow && indexmessage && indexgoods) {
      wx.hideLoading();
      self.setData({
        isAllElement: true
      })
      console.log('已经全部加载完成...')
    }
  }
  //判断所有商品都加在完成了在取消lloadding页面



  ,
  bindTapImg: function (e) {

    console.log('点击了banner图');
    var goodsid = e.currentTarget.dataset.goodsid;
    var sellerid = e.currentTarget.dataset.sellerid;
    var classid = e.currentTarget.dataset.classid;
    console.log(goodsid)
    console.log(sellerid)
    console.log(classid)
    if (goodsid && goodsid != 0) {
      console.log('跳转到商品详情')
      wx.navigateTo({
        url: '../productDetails/productDetails?goodid=' + goodsid
      })
      return false;
    }
    if (classid && classid != 0) {
      console.log('跳转到分类详情')
      var self = this;
      console.log(e.currentTarget.dataset.classid)
      wx.setStorageSync("classid", classid);
    
      wx.switchTab({
        url: '../shoppingMall/shoppingMall'
      })
      return false;
    }


  },
  brandhall: function (e) {
    var wx_class_id = e.currentTarget.dataset.classid
    wx.setStorageSync("classid", wx_class_id);
    wx.setStorage({
      key: 'classidyibu',
      data: wx_class_id
    });
    wx.switchTab({
      url: '../shoppingMall/shoppingMall'
    })
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '',
      path: '',
      success: function (res) {
        // 转发成功

        that.shareClick();
      },
      fail: function (res) {
        // 转发失败
      }
    }

  },
  onReady: function () {
    var aid = wx.getStorageSync("aid");
    var that = this;
    console.log(aid)
    api.http('json/notice', 'POST', {
      aid: aid
    }, function (res) {
      that.setData({
        notice: res.notice
      })
    })
    var e = "Modal"
    this.showModal(e);
    var activid = wx.getStorageSync("activid")
    if (activid == "" || activid == undefined) {
      wx.setStorageSync("activid", 43)
    }
  },
  showModal(e) {
    this.setData({
      modalName: e
    })
  },
  hideModal(e) {
    this.setData({
      modalName: "312"
    })
  },
})