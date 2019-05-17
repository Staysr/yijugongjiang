// pages/shoppingCart/shoppingCart.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCellShopGoods: true,
    num: 1,
    isAlert: false,
    allCard: 0,
    allMoney: 0.00,
    isNolist: false,
    image: app.globalData.imagesUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    wx.showLoading({
      title: '刷新中...',
      mask:true
    })
    self.getShopCarList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log(123)
    var self = this;
    var card = self.data.card;
    var cardShopArr = [];
    if(!card)
    {
      return false;
    }
    var userid = wx.getStorageSync("userid")
    for (var i = 0; i < card.length; i++) {
      for (var y = 0; y < card[i].goods.length; y++) {
        console.log(card[i].goods)
        var cardShopObj = {
          id: card[i].goods[y].cardid,
          count: card[i].goods[y].count,
          state: card[i].goods[y].state
        }
        cardShopArr.push(cardShopObj)
      }
    }
    var aid = wx.getStorageSync("aid")
    api.http('card/cardrecord', 'GET', {

        card: cardShopArr,
        aid:aid
      },
      function(res) {

      })


  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log(123)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

    }

    , //事件处理函数
  /*点击减号*/
  bindMinus: function(e) {
    var self = this;
    var fristIndex = e.currentTarget.dataset.fristindex; //当前商店的索引
    var secondIndex = e.currentTarget.dataset.secondindex; //当前的商品的索引
    var shopid = e.currentTarget.dataset.shopid; //商品id
    var card = self.data.card; //所有的商品
    var count = e.currentTarget.dataset.count; //当前的商品数量
    if (count > 1) {
      count--;
    }
    console.log(fristIndex)
    console.log(secondIndex)

    console.log(card[fristIndex])
    card[fristIndex].goods[secondIndex].count = count;

    // 调用计算的钱数方法=========
    var allMoney = api.shopCarGetMoney(card);
    // 调用计算的钱数方法=========
    this.setData({
      card: card,
      allMoney: allMoney.toFixed(2)
    })
  },
  /*点击加号*/
  bindPlus: function(e) {
    var self = this;
    var fristIndex = e.currentTarget.dataset.fristindex; //当前商店的索引
    var secondIndex = e.currentTarget.dataset.secondindex; //当前的商品的索引
    var card = self.data.card; //所有的商品
    var count = e.currentTarget.dataset.count; //当前的商品数量
    var shopstate = e.currentTarget.dataset.shopstate; //商品状态
    count++;
    console.log(fristIndex)
    console.log(secondIndex)
    console.log(card[fristIndex])
    card[fristIndex].goods[secondIndex].count = count;
    // 调用计算的钱数方法=========
    var allMoney = api.shopCarGetMoney(card);
    // 调用计算的钱数方法=========
    this.setData({
      card: card,
      allMoney: allMoney.toFixed(2)
    })
  },
  /*输入框事件*/
  bindManual: function(e) {
      var num = e.detail.value;
      var minusStatus = num > 1 ? 'normal' : 'disable';
      this.setData({
        num: num,
        minusStatus: minusStatus
      })
    }

    ,
  selectShopW: function(e) {
    console.log('点击选中')
    var self = this;
    var fristIndex = e.currentTarget.dataset.fristindex; //当前商店的索引
    var secondIndex = e.currentTarget.dataset.secondindex; //当前的商品的索引
    var shopstate = e.currentTarget.dataset.shopstate; //当前的商品是否选中
    var allCard = 1;
    console.log(shopstate)
    var card = self.data.card; //所有的商品
    card[fristIndex].goods[secondIndex].state = 1;

    for (var i = 0; i < card.length; i++) {
      card[i].isSelect = 1;
      console.log(card[i])
      for (var y = 0; y < card[i].goods.length; y++) {
        if (card[i].goods[y].state == 0) {
          card[i].isSelect = 0;
          continue;
        }
      }
    }
    for (var a = 0; a < card.length; a++) {
      if (card[a].isSelect == 0) {
        allCard = 0;
        continue;
      }
    }

    // 调用计算的钱数方法=========
    var allMoney = api.shopCarGetMoney(card);
    // 调用计算的钱数方法=========
    this.setData({
      card: card,
      allCard: allCard,
      allMoney: allMoney.toFixed(2)
    })
  },
  selectShopX: function(e) {
    console.log('取消选中')
    var self = this;
    var fristIndex = e.currentTarget.dataset.fristindex; //当前商店的索引
    var secondIndex = e.currentTarget.dataset.secondindex; //当前的商品的索引
    var shopstate = e.currentTarget.dataset.shopstate; //当前的商品是否选中
    var allCard = 1;
    console.log(shopstate)
    var card = self.data.card; //所有的商品
    card[fristIndex].goods[secondIndex].state = 0;


    for (var i = 0; i < card.length; i++) {
      card[i].isSelect = 1;
      console.log(card[i])
      for (var y = 0; y < card[i].goods.length; y++) {
        if (card[i].goods[y].state == 0) {
          card[i].isSelect = 0;
          continue;
        }
      }
    }

    for (var a = 0; a < card.length; a++) {
      if (card[a].isSelect == 0) {
        allCard = 0;
        continue;
      }
    }
    // 调用计算的钱数方法=========
    var allMoney = api.shopCarGetMoney(card);
    // 调用计算的钱数方法=========
    this.setData({
      card: card,
      allCard: allCard,
      allMoney: allMoney.toFixed(2)
    })
  },
  fristCardW: function(e) {
    console.log('全部选中')
    var self = this;
    var cardindex = e.currentTarget.dataset.cardindex; //当前商店的索引
    var card = self.data.card; //当前的商品数
    var allCard = 1;

    card[cardindex].isSelect = 1;
    console.log(cardindex)
    for (var y = 0; y < card[cardindex].goods.length; y++) {
      card[cardindex].goods[y].state = 1;
      console.log(y)
    }
    console.log(card)


    for (var a = 0; a < card.length; a++) {
      if (card[a].isSelect == 0) {
        allCard = 0;
        continue;
      }
    }

    // 调用计算的钱数方法=========
    var allMoney = api.shopCarGetMoney(card);
    // 调用计算的钱数方法=========
    this.setData({
      card: card,
      allCard: allCard,
      allMoney: allMoney.toFixed(2)
    })
  },
  fristCardX: function(e) {

    console.log('全部取消')
    var self = this;
    var cardindex = e.currentTarget.dataset.cardindex; //当前商店的索引
    var card = self.data.card; //当前的商品数
    var allCard = 1;
    card[cardindex].isSelect = 0;
    for (var y = 0; y < card[cardindex].goods.length; y++) {
      card[cardindex].goods[y].state = 0
    }

    for (var a = 0; a < card.length; a++) {
      if (card[a].isSelect == 0) {
        allCard = 0;
        continue;
      }
    }
    // 调用计算的钱数方法=========
    var allMoney = api.shopCarGetMoney(card);
    // 调用计算的钱数方法=========
    this.setData({
      card: card,
      allCard: allCard,
      allMoney: allMoney.toFixed(2)
    })

  },
  allCardShopW: function() {

    console.log('全部选中');
    var self = this;
    var card = self.data.card;

    for (var i = 0; i < card.length; i++) {
      console.log(i)
      card[i].isSelect = 1;
      for (var y = 0; y < card[i].goods.length; y++) {
        console.log(y)
        card[i].goods[y].state = 1;
      }
    }
    // 调用计算的钱数方法=========
    var allMoney = api.shopCarGetMoney(card);
    // 调用计算的钱数方法=========
    this.setData({
      card: card,
      allCard: 1,
      allMoney: allMoney.toFixed(2)
    })

  },
  allCardShopX: function() {

    console.log('全部取消')
    var self = this;
    var card = self.data.card;
    for (var i = 0; i < card.length; i++) {
      console.log(i)
      card[i].isSelect = 0;
      for (var y = 0; y < card[i].goods.length; y++) {
        console.log(y)
        card[i].goods[y].state = 0;
      }
    }
    // 调用计算的钱数方法=========
    var allMoney = api.shopCarGetMoney(card);
    // 调用计算的钱数方法=========
    this.setData({
      card: card,
      allCard: 0,
      allMoney: allMoney.toFixed(2)
    })
  },
  settleaccounts: function() {

      console.log('点击结算按钮');
      var self = this;
      var card = self.data.card;
      var userid = wx.getStorageSync("userid");
    var aid = wx.getStorageSync("aid");
      var cardShopArr=[]
      for (var i = 0; i < card.length; i++) {
        for (var y = 0; y < card[i].goods.length; y++) { 
     
          if (card[i].goods[y].state == 1)
          {
            var cardShopObj = {
              id: card[i].goods[y].cardid,
              count: card[i].goods[y].count,
              state: card[i].goods[y].state
            }
            cardShopArr.push(cardShopObj)
          }

        }  
      }
    var cardShopObj = {
      userid: userid,
      aid: aid,
      cardid: cardShopArr
    }

    if(cardShopObj.cardid.length <=0)
    {
      api.showWarning('请勾选商品!')
      return false;
    }
    else
    {
      cardShopObj = JSON.stringify(cardShopObj)
      wx.navigateTo({
        url: '../shoppingCartConfirOrder/shoppingCartConfirOrder?cardShopObj=' + cardShopObj
      })
    }
    console.log(cardShopObj)



  }

    ,
  deleteShopCar: function() {
    //  console.log('删除商品');
      wx.showLoading({
        title: '删除中...',
        mask: true
      })
      var userid = wx.getStorageSync("userid")
      var self = this;
      var card = self.data.card;
    //console.log(card)
    

      var shopCarArr = [];

      for (var i = 0; i < card.length; i++) {

        for (var y = 0; y < card[i].goods.length; y++) {


          if (card[i].goods[y].state == 1) {

            shopCarArr.push(card[i].goods[y].cardid)
            card[i].goods.splice(y, 1)
            y--;
          }
        }
      } 
   
    console.log(shopCarArr)
    //let  shopCarArrint = [];
    // for (let h = 0; h < shopCarArr.length;h++){
      //  let shopCarArrint = JSON.parse(shopCarArr[h])
    var aid = wx.getStorageSync("aid")
      api.http('card/carddel', 'GET', {

        cardid: shopCarArr,
          aid:aid

        },
        function(res) {
          console.log(res)
          wx.hideLoading()
          if (res.code == 1) {

            var isNolist = false;
            for (var i = 0; i < card.length; i++) {

              if (card[i].goods.length == 0) {
                card.splice(i, 1)
                i--;
              }

            }

            if (card.length == 0) {

              isNolist = true

            }


            self.setData({
              card: card,
              allCard: 0,
              allMoney:0.00,
              isNolist: isNolist
            })
          }
        })
    // }

    }



    ,
  getShopCarList: function() {

    var self = this;
    var userid = wx.getStorageSync("userid");
    var isloginStatus = wx.getStorageSync("isloginStatus");
    if (!userid || !isloginStatus)
    {
      self.setData({
        isDenglu: true
      })
      }
    else
    {
      self.setData({
        isDenglu: false
      })
    }
    self.setData({
      userid: userid
    })
   
    var aid = wx.getStorageSync("aid")
    api.http('card/cardlist', 'GET', {
        userid: userid,
        aid:aid
      },
      function(res) {
        console.log(res)
        wx.hideLoading()
        if (res.code == 1) {
          var card = res.card;

          var allCard = 1;
          var isNolist = false;
          for (var i = 0; i < card.length; i++) {
            card[i].isSelect = 1;
            console.log(card[i])
            for (var y = 0; y < card[i].goods.length; y++) {
              if (card[i].goods[y].state == 0) {
                card[i].isSelect = 0;
                continue;
              }
            }
          }
          console.log("长度"+card.length)
          // 全选按钮判断
          for (var a = 0; a < card.length; a++) {
            if (card[a].isSelect == 0) {
              allCard = 0;
              continue;
            }
          }
          if (res.card.length == 0) {
            allCard = 0;
            isNolist = true
          }
          // 调用计算的钱数方法=========
          var allMoney = api.shopCarGetMoney(card);
          // 调用计算的钱数方法=========
          // 全选按钮判断
          self.setData({
            card: res.card,
            allCard: allCard,
            allMoney: allMoney.toFixed(2),
            isNolist: isNolist
          })
        }
      })

  }
  , goshop:function(){



  }

})