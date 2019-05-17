// pages/decorationcompany/decorationcompany.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: app.globalData.imagesUrl,
    isWhoEle: 0, //0 代表一个都没有选中   2:口碑  3:成交量
    isWhoEleTop: true,
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
   
    that.decoration() //首页轮播图
    that.onReachBottom();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //获取全部数据
  decoration: function () {
    var that = this;
    var aid = wx.getStorageSync("aid")
    api.http('json/companyList', 'GET', {
      aid: aid
    }, function (res) {
      console.log(res)
      if (res.code == 1) {
        that.setData({
          companylist: res.companylist,
          isWhoEleTop: false,
          isWhoEle: 1,
        })
      }
    })
  },
  wx_details: function (e) {
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    var name = e.currentTarget.dataset.name
    wx.showLoading({
      title: '加载数据中...',
      mask: true
    })
    api.http('json/companyEdit', 'GET', {
      id: id
    }, function (res) {
      console.log(res.id)
      wx.hideLoading();
      wx.setStorageSync("onpageid", "俱乐部进来的")
      var type = wx.getStorageSync("type_code")
      wx.navigateTo({
        url: '../wx_decorationcompany/wx_decorationcompany?id=' + id + '&type=' + type + "&dataid=" + res.id + "&name=" + name,
      })
    })
    // return false;
  },
  shopGoodsSort: function (e) {
    var self = this;
    var goodsclass2 = self.data.goodsclass2;
    var sortindex = e.currentTarget.dataset.sortindex; //当前标签的索引 1:价格  2:销量  3:上架时间  4:评价
    wx.setStorageSync("sortindex", e.currentTarget.dataset.sortindex)
    var isWhoEleOld = self.data.isWhoEle;
    var isWhoEleNew = sortindex;

    console.log(isWhoEleOld)
    console.log(isWhoEleNew == 1 ? "价格" : isWhoEleNew == 2 ? "销量" : isWhoEleNew == 3 ? "上架时间" : isWhoEleNew == 4 ? "评价" : "没有这个数据")

    if (isWhoEleOld != isWhoEleNew) {

      var price = 1
      var sum = 1
      var creattime = 1
      var evaluate = 1

      self.setData({
        price: price,
        sum: sum,
        creattime: creattime,
        evaluate: evaluate
      })

      console.log('切换排序的规则' + isWhoEleNew);
      self.setData({
        isWhoEle: isWhoEleNew,
        isWhoEleTop: true
      })
      if (isWhoEleNew == 1) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          price: 1
        }
        self.getShopList(goodsObject); //获取全部数据
      }
      if (isWhoEleNew == 2) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          sum: 1
        }
        self.getShopList(goodsObject); //获取全部数据
      }
      if (isWhoEleNew == 3) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          creattime: 1
        }
        self.getShopList(goodsObject); //获取全部数据
      }
      if (isWhoEleNew == 4) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          evaluate: 1
        }
        self.getShopList(goodsObject); //获取全部数据
      }


    } else {

      console.log('切换倒序正序');

      var price = self.data.price;
      var sum = self.data.sum;
      var creattime = self.data.creattime;
      var evaluate = self.data.evaluate;

      price = price == 1 ? 2 : 1
      sum = sum == 1 ? 2 : 1
      creattime = creattime == 1 ? 2 : 1
      evaluate = evaluate == 1 ? 2 : 1


      console.log(price)
      console.log(sum)
      console.log(creattime)
      console.log(evaluate)
      self.setData({
        isWhoEle: isWhoEleOld,
        isWhoEleTop: !self.data.isWhoEleTop,
        price: price,
        sum: sum,
        creattime: creattime,
        evaluate: evaluate
      })






      if (isWhoEleNew == 1) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          price: price
        }
        self.getShopList(goodsObject); //获取全部数据
      }
      if (isWhoEleNew == 2) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          sum: sum
        }
        self.getShopList(goodsObject); //获取全部数据
      }
      if (isWhoEleNew == 3) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          creattime: creattime
        }
        self.getShopList(goodsObject); //获取全部数据
      }
      if (isWhoEleNew == 4) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          evaluate: evaluate
        }
        self.getShopList(goodsObject); //获取全部数据
      }
    }



  },
  getShopList: function (goodsObject) {
    console.log(goodsObject)
    var self = this;
    var goodsObject = goodsObject;
    var goodsclass2 = goodsObject.goodsclass2;
    console.log(goodsObject)
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    var aid = wx.getStorageSync("aid")
    var sortindex = wx.getStorageSync("sortindex")
    if (sortindex == 2) {
      api.http('json/companyList', 'GET', {
        praise: goodsObject.sum,
        aid: aid
      },
        function (res) {
          console.log(res)
          wx.removeStorageSync("sortindex");
          wx.hideLoading();
          self.setData({
            companylist: res.companylist,
            isHasShop: true, //是否有商品
            isLoadding: false, //是否开启加载状态
            isHasMoredata: false, //是否还有更多商品数据
          })
        })
    }
    if (sortindex == 3) {
      api.http('json/companyList', 'GET', {
        turnover: goodsObject.creattime,
        aid: aid
      },
        function (res) {
          console.log(res)
          wx.removeStorageSync("sortindex");
          wx.hideLoading();
          self.setData({
            companylist: res.companylist,
            isHasShop: true, //是否有商品
            isLoadding: false, //是否开启加载状态
            isHasMoredata: false, //是否还有更多商品数据
          })
        })
    }
    /**
     *  // if (res.code == 1) {
      //   wx.setNavigationBarTitle({
      //     title: res.classname
      //   })
      //   goodsObject.page = 1;
      //   wx.pageScrollTo({
      //     scrollTop: 0,
      //     duration: 0
      //   })
      //   if (res.goods.length == 0) {

      //     self.setData({
      //       goods: res.goods,
      //       goodsObject: goodsObject,
      //       isHasShop: true,//是否有商品
      //       isLoadding: false,//是否开启加载状态
      //       isHasMoredata: false,//是否还有更多商品数据
      //     })
      //   }
      //   else if (res.goods.length < 12) {
      //     self.setData({
      //       goods: res.goods,
      //       goodsObject: goodsObject,
      //       isHasShop: false,//是否有商品
      //       isLoadding: false,//是否开启加载状态
      //       isHasMoredata: true,//是否还有更多商品数据
      //     })
      //   }
      //   else if (res.goods.length == 12) {
      //     self.setData({
      //       goods: res.goods,
      //       goodsObject: goodsObject,
      //       isHasShop: false,//是否有商品
      //       isLoadding: true,//是否开启加载状态
      //       isHasMoredata: false,//是否还有更多商品数据
      //     })
      //   }
      // }
     * 
     */
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
    var that = this;
    var aid = wx.getStorageSync("aid")
    let page = that.data.page;
    page++;
    let vrlist = this.data.vrlist
    api.http('json/companyList', 'GET', {
      aid: aid,
      page: page
    }, function (res) {
      if (res.code == 1) {
        if (res.companylist.length == 0) {
          that.setData({
            isLoadding: false,
            isHasData: true
          })
          return false;
        }
        console.log(res)
        var isLoadding = res.companylist.length >= 1 ? true : false;
        let arr = res.companylist
        arr.map((val, index, arr) => {
          companylist.push(val)
        })
        console.log('第三层', companylist)
        // var comment = that.data.moment;
        that.setData({
          companylist: companylist,
          isLoadding: isLoadding,
          isHasData: false,
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