// pages/brandShop/brandShop.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: -1,
    num: 1,
    minusStatus: 'disable',
    animationData: {},
    isSpecNum: -1,
    isHasShop: false, //是否有商品
    isLoadding: false, //是否开启加载状态
    isHasMoredata: false, //是否还有更多商品数据
    page: 1,
    zhezhao: false,
    shopidOld: "",
    image: app.globalData.imagesUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var self = this;

    var brandSelectStr = wx.getStorageSync("brandSelectStr"); //用户选中的商品
    if (!brandSelectStr) {
      wx.hideLoading()
      return false;
    }
    var store = JSON.parse(brandSelectStr)
    console.log(store)
    api.http('fastorder/getbrand', 'GET', {
      store: store
    }, function (res) {
      console.log(res)
      wx.hideLoading()
      if (res.code == 1) {

        var currentTab = self.isPanduanIndex(res.class, res.goods)
        if (res.goods[0].goods.length == 0) {
          self.setData({
            isHasShop: true, //是否有商品
          })
        } else {
          self.setData({
            isHasMoredata: true, //是否还有更多商品数据
          })

        }
        self.setData({
          goodsClass: res.class,//主材、辅材
          goods: res.goods,//商品
          store: store,
          currentTab: currentTab,
          nowGoods: res.goods[0].goods
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
    // 加载中的遮罩层 ，防止 点击 标题出现问题 ================
    self.setData({
      zhezhao: true
    })
    // 加载中的遮罩层 ，防止 点击 标题出现问题 ================
    console.log('触发下拉加载事件');
    var page = self.data.page;
    page++;
    console.log(page)
    var goods = self.data.goods; //选中的列表
    var classid = self.data.classid; //选中的列表
    var nowGoods = self.data.nowGoods;

    for (var i = 0; i < goods.length; i++) {
      if (goods[i].goodsclass == classid) {
        console.log('走到这里了')
        console.log(goods[i].goods)
        wx.hideLoading()
        self.setData({
          nowGoods: goods[i].goods,
          isHasShop: false, //是否有商品
          isLoadding: false, //是否开启加载状态
          isHasMoredata: true, //是否还有更多商品数据
          zhezhao: false
        })
        return false;
      }
    }
    api.http('fastorder/getgoods', 'GET', {
      goodsclass: classid,
      page: page
    }, function (res) {
      console.log(res)
      if (res.code == 1) {
        wx.hideLoading();
        var goodsNew = nowGoods.concat(res.goods)
        if (res.goods.length == 0) {
          console.log('没有数据')
          self.setData({
            isHasShop: true, //是否有商品
            isLoadding: false, //是否开启加载状态
            isHasMoredata: false, //是否还有更多商品数据,
            page: page,
            nowGoods: goodsNew,
            zhezhao: false
          })
        } else if (res.goods.length < 12) {
          console.log('有数据数据不够')
          self.setData({
            isHasShop: false, //是否有商品
            isLoadding: false, //是否开启加载状态
            isHasMoredata: true, //是否还有更多商品数据
            page: page,
            nowGoods: goodsNew,
            zhezhao: false
          })
        } else if (res.goods.length == 12) {
          console.log('可以加载')
          self.setData({
            isHasShop: false, //是否有商品
            isLoadding: true, //是否开启加载状态
            isHasMoredata: false, //是否还有更多商品数据
            page: page,
            nowGoods: goodsNew,
            zhezhao: false
          })
        }

      }

    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  headerShop: function (e) {

    var self = this;
    var currentTab = self.data.currentTab; //当前已经选中的
    var actindex = e.currentTarget.dataset.actindex; //即将选中的
    var classid = e.currentTarget.dataset.classid; //选中的id
    var goods = self.data.goods; //选中的列表
    console.log(classid)
    if (currentTab == actindex) {
      return false;
    }
    self.setData({
      currentTab: actindex,
      classid: classid,
      page: 1
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })




    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })

    console.log(goods)
    // for (var i = 0; i < goods.length; i++) {
    //   if (goods[i].goodsclass == classid) {
    //     console.log('走到这里了')
    //     console.log(goods[i].goods)
    //     wx.hideLoading()
    //     self.setData({
    //       nowGoods: goods[i].goods,
    //       isHasShop: false, //是否有商品
    //       isLoadding: false, //是否开启加载状态
    //       isHasMoredata: true, //是否还有更多商品数据
    //     })
    //     return false;
    //   }
    // }
    var sellerid = wx.getStorageSync("brandSelectStr")
    var chuanid;
    var selleridoo = JSON.parse(sellerid);
    console.log(selleridoo)


    for (var i = 0; i < selleridoo.length; i++) {
      console.log(selleridoo[i].brandid)
      if (selleridoo[i].brandid == classid) {
        console.log('赋值')
        chuanid = selleridoo[i].sellerid;
        break;
      } else {
        console.log('浮空')
        chuanid = '';
      }

    }
    console.log('传的id' + chuanid);
    api.http('fastorder/getgoods', 'GET', {
      goodsclass: classid,
      sellerid: chuanid
    }, function (res) {
      console.log(res)
      if (res.code == 1) {
        wx.hideLoading();

        if (res.goods.length == 0) {
          console.log('没有数据')
          self.setData({
            isHasShop: true, //是否有商品
            isLoadding: false, //是否开启加载状态
            isHasMoredata: false, //是否还有更多商品数据
          })
        } else if (res.goods.length < 12) {
          console.log('有数据数据不够')
          self.setData({
            isHasShop: false, //是否有商品
            isLoadding: false, //是否开启加载状态
            isHasMoredata: true, //是否还有更多商品数据
          })
        } else if (res.goods.length == 12) {
          console.log('可以加载')
          self.setData({
            isHasShop: false, //是否有商品
            isLoadding: true, //是否开启加载状态
            isHasMoredata: false, //是否还有更多商品数据
          })
        }




        self.setData({
          nowGoods: res.goods
        })
      }

    })











  },
  jionShopClick: function (e) {



    console.log('点击商品到购物车')
    var self = this;
    var shopidOld = self.data.shopidOld;
    var shopid = e.currentTarget.dataset.shopid; //新添加的商品
    var nowGoods = self.data.nowGoods;
    var goodsindex = e.currentTarget.dataset.goodsindex;
    var goddsinfor = nowGoods[goodsindex]
    console.log(nowGoods);
    console.log(goodsindex)
    console.log(goddsinfor)
    if (shopidOld != shopid) {
      self.setData({
        isSpecNum: -1,
        selectMoney: goddsinfor.discount
      })
    }
    self.setData({
      goddsinfor: goddsinfor,
      num: 1,
      minusStatus: 'disable',
      shopidOld: shopid
    })

    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'linear',
    })
    self.animation = animation;
    animation.top(0).opacity(1).step();

    var animation1 = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    })
    self.animation = animation1;
    animation1.bottom(0).step();

    self.setData({
      animationData: animation.export(),
      animationData1: animation1.export(),
    })






  },
  closeClick: function () {

    var self = this;



    var animation1 = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    })
    self.animation = animation1;
    animation1.bottom("-100%").step();
    self.setData({
      animationData1: animation1.export()
    })

    setTimeout(function () {
      var animation = wx.createAnimation({
        duration: 0,
        timingFunction: 'linear',
      })
      self.animation = animation;
      animation.top("100%").opacity(1).step();
      self.setData({
        animationData: animation.export(),

      })
    }, 300)




    return false

    var self = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    })
    self.animation = animation;
    animation.top("110%").opacity(0.5).step()
    self.setData({
      animationData: animation.export()
    })





  },

  // ----------------------------------------


  //事件处理函数
  /*点击减号*/
  bindMinus: function () {
    var num = this.data.num;
    if (num > 1) {
      num--;
    }
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  },
  /*点击加号*/
  bindPlus: function () {
    var num = this.data.num;
    num++;
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  },
  /*输入框事件*/
  bindManual: function (e) {
    var num = e.detail.value;
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  }




  // -------------------------------------------
  ,
  isPanduanIndex: function (goodsclass, goods) {

    var goodsclass = goodsclass;
    var goods = goods;
    console.log(goodsclass)
    console.log(goods)
    for (var i = 0; i < goodsclass.length; i++) {
      if (goodsclass[i].id == goods[0].goodsclass) {
        console.log(i)
        return i;
      }
    }

  },
  selectSpecs: function (e) {
    var self = this;
    var price = e.currentTarget.dataset.price;
    var specindex = e.currentTarget.dataset.specindex;

    self.setData({
      selectMoney: price,
      isSpecNum: specindex,
      num: 1,
      minusStatus: 'disable'
    })

  }

  ,
  bindclcik: function () {
    console.log('阻止默认点击了')
  }

  ,
  jionShopCar: function () {

    console.log('加入购物车!!!')

    var self = this;
    var goodsid = self.data.goddsinfor.id;
    var isSelect = self.data.isSpecNum;
    var specs = self.data.goddsinfor.specs;
    var count = self.data.num;

    api.joinShopCar(goodsid, isSelect, specs, count, function (res) {
      console.log(res)
      if (res.code == 1) {
        api.showSuccess(res.msg)
        setTimeout(function () {
          self.closeClick();
        }, 800)
      }
      else {
        api.showWarning(res.msg)
      }
    })

    return false;

  }


})