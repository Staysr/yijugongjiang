// pages/searchList/searchList.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeListName: true,
    shopPage: 1,
    adminPage: 1,
    admin: [],
    goods: [],
    isFristClick: false
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
    var self = this;
    var keyWord = self.data.keyWord;
    var activeListName = self.data.activeListName;
    var shopPage = self.data.shopPage;
    var adminPage = self.data.adminPage;
    var goods = self.data.goods;
    var admin = self.data.admin;
    var page = ""
    if (activeListName) {
      shopPage++;
      page = shopPage;
    }
    else {
      adminPage++;
      page = adminPage;
    }
    console.log(page)


    var aid = wx.getStorageSync("aid")
    api.http('store/searchgoods', 'GET',
      {
        name: keyWord,
        page: page,
        aid:aid

      }
      , function (res) {
        console.log(res)
        if (res.code == 1) {



          if (activeListName) {
            console.log('商品');
            var goodsNew = goods.concat(res.goods)
            if (res.goods.length >= 10) {

              self.setData({
                goods: goodsNew,
                isLoadding: true,
                shopPage: page
              })
            }
            else {
              self.setData({
                isShopLoadding: false,
                shopPage: page,
                goods: goodsNew
              })
            }

          }
          else {
            console.log('店铺');
            var adminNew = admin.concat(res.admin)
            if (res.admin.length >= 10) {
              self.setData({
                admin: adminNew,
                isLoadding: true,
                adminPage: page
              })
            }
            else {
              self.setData({
                admin: adminNew,
                isAdminLoadding: false,
                adminPage: page
              })
            }




          }




        }
      })
















  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
  ,
  // 切换搜索商品名称===============================
  changSearchName: function () {
    var self = this;
    var activeListName = self.data.activeListName;
    self.setData({
      activeListName: !activeListName
    })

    // =================滚动到页面顶部============
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    // ================滚动页面顶部========================




  }
  // 切换搜索商品名称结束===============================
  , searchgoods: function (keyword) {

  }
  , searchInput: function (e) {
    var self = this;
    self.setData({
      keyWord: e.detail.value
    })
  }
  , formSubmit: function (e) {
    var name = e.detail.value.name
    wx.showLoading({
      title: '搜索中...',
      mask: true
    })
    var self = this;
    self.setData({
      shopPage: 1,
      adminPage: 1
    })
    var aid = wx.getStorageSync("aid")

    var activeListName = self.data.activeListName;//true 是商品  false 是店铺
    api.http('store/searchgoods', 'GET',
      {
        name:name,
        aid:aid
      }
      , function (res) {
        wx.hideLoading();
        console.log(res)





        if (res.code == 1) {
          if (activeListName) {
            if (res.goods.length == 0) {
              api.showWarning('没有该商品!')
            }
          }
          else {
            if (res.admin.length == 0) {
              api.showWarning('没有该店铺!')
            }
          }

          if (res.goods.length >= 10) {
            self.setData({
              goods: res.goods,
              isShopLoadding: true
            })
          }
          else {
            self.setData({
              goods: res.goods,
              isShopLoadding: false
            })
          }
          if (res.admin.length >= 10) {
            self.setData({
              admin: res.admin,
              isAdminLoadding: true
            })
          }
          else {
            self.setData({
              admin: res.admin,
              isAdminLoadding: false
            })
          }


        }


      })



  }
})