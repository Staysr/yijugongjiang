// pages/quickOrder/quickOrder.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

    shopItems: {
      showNum: 7,
      brandArr: []
    },
    image: app.globalData.imagesUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.setData({
      brand: ""
    })
    wx.removeStorageSync("brandSelectStr");
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var aid = wx.getStorageSync("aid")
    api.http('fastorder/filtrate', 'GET',
      { aid: aid }
      , function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.code == 1) {

          var brand = res.brand;
          for (var i = 0; i < brand.length; i++) {
            brand[i].isShowNum = 7;
            for (var y = 0; y < brand[i].seller.length; y++) {
              brand[i].seller[y].isSelect = false;
            }
          }
          self.setData({
            brand: brand
          })
        }
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
    this.onLoad();
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
  , allShopItem: function (e) {
    console.log('展开全部');
    var self = this;
    console.log(e)

    var activeindex = e.currentTarget.dataset.activeindex;
    var barnd = self.data.brand;
    console.log(activeindex);
    barnd[activeindex].isShowNum = 999;
    self.setData({
      brand: barnd
    })
  }
  , selectBrand: function (e) {
    var self = this;
    var brand = self.data.brand;//所有的商品
    var nowselect = e.currentTarget.dataset.nowselect;//当前是否是选中状态
    // var brandArr = self.data.brandArr;//选中的商店
    var brandArr = wx.getStorageSync("brandSelectStr");
    var brandindex = e.currentTarget.dataset.brandindex;//牌子的索引
    var shopindex = e.currentTarget.dataset.shopindex;//商店的索引
    var brandid = brand[brandindex].id;//牌子的id
    var sellerid = brand[brandindex].seller[shopindex].sellerid;//商店的id

    if (!brandArr) {
      brandArr = [];  //如果获取的数组为空的话将数组初始化 ----
    }
    else {
      brandArr = JSON.parse(brandArr)
    }
    var brandObject = {  // 将信息生成为一个对象保存气起来
      brandid: brandid,
      sellerid: sellerid
    }

    //在添加的商品的数组中选择=============不是第一次选中的情况下======GO===
    for (var i = 0; i < brandArr.length; i++) {

      if (brandid == brandArr[i].brandid) {

        brandArr[i] = brandObject;

        for (var a = 0; a < brand[brandindex].seller.length; a++) {
          brand[brandindex].seller[a].isSelect = false;
        }


        if (nowselect) {
          brand[brandindex].seller[shopindex].isSelect = false;
          console.log('取消当前标签')
          console.log(i)
          brandArr.splice(i, 1);
        }
        else {
          brand[brandindex].seller[shopindex].isSelect = true;
        }

        var brandSelectStr = JSON.stringify(brandArr);
        wx.setStorageSync("brandSelectStr", brandSelectStr);

        self.setData({
          brandArr: brandArr,
          brand: brand
        })
        return false;
      }
    }
    //在添加的商品的数组中选择=============不是第一次选中的情况下======GO===

    // 如果是第一次选中=====GO============
    brandArr.push(brandObject);
    brand[brandindex].seller[shopindex].isSelect = true;
    var brandSelectStr = JSON.stringify(brandArr);
    wx.setStorageSync("brandSelectStr", brandSelectStr);
    self.setData({
      brandArr: brandArr,
      brand: brand
    })
    // 如果是第一次选中======GO===========
  }
  ,
  isOkNav: function () {

    console.log('确定开始跳转!')
    var brandSelectStr = wx.getStorageSync("brandSelectStr")

    //console.log(brandSelectStr)
    if (brandSelectStr && brandSelectStr.length > 5) {
      wx.navigateTo({
        url: '../quickOrderList/quickOrderList',
      })
    }
    else {
      api.showWarning('请选择品牌!')
    }
  }
})