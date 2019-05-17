// pages/myBalance/myBalance.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeLineShow: true,
    pagePush: 1,
    pagePop: 1,
    isShopLoaddingPush:false,
    isFristPush:false,
    isFristPop: false,
       isfrist: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.showLoading({
      title: '加载中...',
    })
    var pagePush = self.data.pagePush;//收入的page
    var pagePop = self.data.pagePop;//支出的page
    self.getMoneyincome(pagePush);//获取收入
    self.saveMoneydisburse(pagePop);//支出记录
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
    var self =this;
    var isfrist = self.data.isfrist;
    console.log(isfrist)
    if (isfrist)
    {
      return false;
    }
    console.log('我是提现的东西')
   
    var pagePush = self.data.pagePush;//收入的page
    var pagePop = self.data.pagePop;//支出的page
    self.getMoneyincome(pagePush);//获取收入
    self.saveMoneydisburse(pagePop);//支出记录

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
var self =this;
    self.setData({
      isfrist: false  ,pagePush: 1,
      pagePop: 1
    })
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
    var pagePush = self.data.pagePush;//收入的page
    var pagePop = self.data.pagePop;//支出的page
    pagePush++;
    pagePop++;
    var activeLineShow = self.data.activeLineShow;//判断当前是收入还是支出
    if (activeLineShow)
    {
      self.getMoneyincomePush(pagePush);//获取收入
    }
    else
    {
      self.saveMoneydisbursePop(pagePop);//支出记录
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changeBalanceStatus1: function () {
    var self = this;
    self.setData({
      activeLineShow: true
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  changeBalanceStatus2: function () {
    var self = this;
    self.setData({
      activeLineShow: false
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  }
  , getMoneyincomePush:function(page){
    

    var pagePush = page;
    var self = this;
    var userid = wx.getStorageSync("userid");//userid
    var aid = wx.getStorageSync("aid");//userid
    var incomePush = self.data.incomePush;//收入信息

    console.log(page);
    console.log(incomePush);
    console.log('刷新了收入记录');

    api.http('centre/moneyincome', 'GET',
      {
        userid: userid,
        page: pagePush,
        aid:aid
      }
      , function (res) {
       
        if (res.code == 1) {
          var incomePushNew = incomePush.concat(res.income)
          if (res.income.length == 0) {
            self.setData({
              money: res.money,
              incomePush: incomePushNew,
              isShopLoaddingPush: false,
              pagePush: pagePush
            })
          }
          else if (res.income.length < 10) {
            self.setData({
              money: res.money,
              incomePush: incomePushNew,
              isShopLoaddingPush: false,
              pagePush: pagePush
            })
          }
          else if (res.income.length == 10) {
            self.setData({
              money: res.money,
              incomePush: incomePushNew,
              isShopLoaddingPush: true,
              pagePush: pagePush
            })
          }
        }
      })

  
  }
  , saveMoneydisbursePop: function (page){


    var pagePop = page;
    var self = this;
    var userid = wx.getStorageSync("userid");//userid
    var incomePop = self.data.incomePop;//收入信息

    console.log(page);
    console.log(incomePop);
    console.log('刷新了支出记录')

    api.http('centre/moneydisburse', 'GET',
      {
        userid: userid,
        page: pagePop
      }
      , function (res) {

        if (res.code == 1) {
          var incomePopNew = incomePop.concat(res.income)
          if (res.income.length == 0) {
            self.setData({
              money: res.money,
              incomePop: incomePopNew,
              isShopLoaddingPop: false,
              pagePop: pagePop
            })
          }
          else if (res.income.length < 10) {
            self.setData({
              money: res.money,
              incomePop: incomePopNew,
              isShopLoaddingPop: false,
              pagePop: pagePop
            })
          }
          else if (res.income.length == 10) {
            self.setData({
              money: res.money,
              incomePop: incomePopNew,
              isShopLoaddingPop: true,
              pagePop: pagePop
            })
          }
        }
      })


  }
  , getMoneyincome: function (pagePush) {
    var page = pagePush;
    var self = this;
    var userid = wx.getStorageSync("userid");//userid
    api.http('centre/moneyincome', 'GET',
      {
        userid: userid,
        page: pagePush
      }
      , function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.code == 1) {
            
          if (res.income.length==0)
          {
            self.setData({
              money: res.money,
              incomePush: res.income,
              isShopLoaddingPush:false,
              isFristPush:true
            })
          }
          else if (res.income.length <10)
          {
            self.setData({
              money: res.money,
              incomePush: res.income,
              isShopLoaddingPush: false
            })
          }
          else if (res.income.length ==10) {
            self.setData({
              money: res.money,
              incomePush: res.income,
              isShopLoaddingPush: true
            })
          }


         
        }
      })
  }
  , saveMoneydisburse: function (pagePop) {
    var page = pagePop;
    var self = this;
    var userid = wx.getStorageSync("userid");//userid
    api.http('centre/moneydisburse', 'GET',
      {
        userid: userid,
        page: pagePop
      }
      , function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.code == 1) {
          if (res.income.length == 0) {
            self.setData({
              money: res.money,
              incomePop: res.income,
              isShopLoaddingPop: false,
              isFristPop:true
            })
          }
          else if (res.income.length < 10) {
            self.setData({
              money: res.money,
              incomePop: res.income,
              isShopLoaddingPop: false
            })
          }
          else if (res.income.length == 10) {
            self.setData({
              money: res.money,
              incomePop: res.income,
              isShopLoaddingPop: true
            })
          }




        }
      })
  }

  

})