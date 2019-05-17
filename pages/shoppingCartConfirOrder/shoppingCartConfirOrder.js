// pages/shoppingCartConfirOrder/shoppingCartConfirOrder.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clubid: 0, //0代表是普通人  1 代表的是工人
    isNBtn: true,
    isselected: 1,
    currenty: 0,
    isChangeCurrentyShow: false,
    image: app.globalData.imagesUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var cardShopObj = options.cardShopObj;
    console.log(cardShopObj);
    var cardShopObj = JSON.parse(cardShopObj);
    if (!cardShopObj) {
      wx.showWarningText('网络繁忙,稍后重试!')
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 800)
      return false;
    }
    // var aid = wx.getStorageSync("aid")
    var userInfomation = wx.getStorageSync("userInfomation");
    var userInfostatus = wx.getStorageSync("userInfostatus");
    var clubid = 0;
    var status = 0;
    userInfomation = JSON.parse(userInfomation);
    console.log(userInfomation)
    if (userInfomation.clubid != 0) {
      clubid = userInfomation.clubid;
    } else {
      clubid = 0;
    }
    var workclass = clubid + userInfostatus;

    api.http('card/settleaccounts', 'GET', cardShopObj,
      function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.code == 1) {
          var isSeller = true;
          var card = res.card;
          for (var i = 0; i < card.length; i++) {

            var allmoney = 0;
            if (card[i].sellerid != 0) {
              isSeller = false
            }
            for (var y = 0; y < card[i].goods.length; y++) {

              allmoney += card[i].goods[y].price * card[i].goods[y].count;
            }

            card[i].priceall = allmoney.toFixed(2)

          }
          self.totalCalculation(card, res.money, 0, res.bi, 0, res.zhaibi)
          self.setData({
            address: res.address,
            card: card,
            money: res.money,
            zhaibi: res.zhaibi,
            isSeller: isSeller,
            workclass: workclass,
            bi: res.bi
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
  , //事件处理函数
  /*点击减号*/
  bindMinus: function () {
    var self = this;
    var card = self.data.card;
    var money = self.data.money;
    var bi = self.data.bi;
    var isselected = self.data.isselected;
    isselected = isselected == 2 ? 1 : 2
    var currenty = self.data.currenty;
    var zhaibi = self.data.zhaibi;
    console.log('减号')
    if (currenty > 0) {
      currenty--;
    }
    var minusStatus = currenty > 0 ? 'normal' : 'disable';
    self.totalCalculation(card, money, currenty, bi, isselected, zhaibi)
    this.setData({
      currenty: currenty,
      minusStatus: minusStatus
    })
  },
  /*点击加号*/
  bindPlus: function () {
    var self = this;
    var card = self.data.card;
    var money = self.data.money;
    var bi = self.data.bi;
    var isselected = self.data.isselected;
    isselected = isselected == 2 ? 1 : 2
    var currenty = self.data.currenty;
    var zhaibi = self.data.zhaibi;
    if (currenty >= zhaibi) {
      api.showWarningText('你的宅币已超过上限!')
      return false;
    }
    currenty++;
    var minusStatus = currenty > 0 ? 'normal' : 'disable';
    var isReturn = self.totalCalculation(card, money, currenty, bi, isselected, zhaibi)
    if (!isReturn) {
      return false;
    }
    this.setData({
      currenty: currenty,
      minusStatus: minusStatus
    })
  }
  , //事件处理函数
  /*点击减号*/
  bindMinusB: function () {
    var self = this;
    var currentyNew = self.data.currentyNew;
    console.log('减号')
    if (currentyNew > 0) {
      currentyNew--;
    }
    var minusStatus = currentyNew > 0 ? 'normal' : 'disable';
    this.setData({
      currentyNew: currentyNew,
      minusStatus: minusStatus
    })

  },
  /*点击加号*/
  bindPlusB: function () {
    var self = this;
    var currentyNew = self.data.currentyNew;
    console.log('减号')
    currentyNew++;
    var minusStatus = currentyNew > 0 ? 'normal' : 'disable';
    this.setData({
      currentyNew: currentyNew,
      minusStatus: minusStatus
    })

  }
  ,
  /*输入框事件*/
  bindManual: function (e) {
    var self = this;
    var currenty = self.data.currenty; //记录一下旧币
    self.setData({
      isChangeCurrentyShow: true,
      oldcurrenty: currenty,
      currentyNew: currenty
    })
  }
  ,
  isUserBanner: function () {
    console.log('使用余额')
    var self = this;
    var card = self.data.card;
    var money = self.data.money;
    var currenty = self.data.currenty;
    var bi = self.data.bi;
    var zhaibi = self.data.zhaibi;
    var isselected = 2

    self.totalCalculation(card, money, currenty, bi, 1, zhaibi)
    self.setData({
      isselected: isselected
    })
  },
  isUserNoBanner: function () {
    console.log('不使用余额')
    var self = this;
    var card = self.data.card;
    var money = self.data.money;
    var currenty = self.data.currenty;
    var bi = self.data.bi;
    var zhaibi = self.data.zhaibi;
    var isselected = 1;
    self.totalCalculation(card, money, currenty, bi, 2, zhaibi)
    var self = this;
    self.setData({
      isselected: isselected
    })
  },
  okBtnHide: function () {
    var self = this;
    var currentyNew = self.data.currentyNew;
    var card = self.data.card;
    var bi = self.data.bi; //余额比例
    var money = self.data.money;
    var isSelect = self.data.isselected;
    isSelect = isSelect == 2 ? 1 : 2
    var zhaibi = self.data.zhaibi;
    var needCurrenty = self.data.needCurrenty;
    console.log('最多使用的宅币:' + needCurrenty)
    console.log('想用的宅币数量:' + currentyNew)
    if (currentyNew * 1 > needCurrenty * 1) {
      api.showWarningText('最多使用' + needCurrenty + '个宅币代替余额支付!')
      return false;
    }
    var isReturn = self.totalCalculation(card, money, currentyNew, bi, isSelect, zhaibi);
    if (!isReturn) {
      return false;
    }

    self.setData({
      currenty: currentyNew,
      isChangeCurrentyShow: false
    })
  },
  calceBtn: function () {
    var self = this;
    var oldcurrenty = self.data.oldcurrenty;

    self.setData({
      currenty: oldcurrenty,
      isChangeCurrentyShow: false
    })

  },
  bindinputselect: function (e) {
    var self = this;
    self.setData({
      currentyNew: e.detail.value
    })
  }
  ,
  totalCalculation: function (card, money, currenty, bi, isselected, zhaibi) {

    var self = this;
    var card = card;
    var shopAllMoney = 0;
    var currenty = currenty; //当前的设置余额
    var bi; //= bi; //余额比例
    console.log(card)
    if (bi) {
      bi = bi;
    } else {
      bi = self.data.bi;
    }
    console.log("currenty"+currenty)
    var money = money;
    var needBalace = 0;
    var isSelect = isselected;
    var zhaibi = zhaibi;
    var allMoneyLast = 0;
    var needCurrenty = 0;//最大可使用多少宅币
    for (var i = 0; i < card.length; i++) {
      if (card[i].sid == 0) {
        shopAllMoney = card[i].priceall * 1; // 计算上品牌店铺商品的总价格
        for (var y = 0; y < card[i].goods.length; y++) {
          needCurrenty += card[i].goods[y].bi * card[i].goods[y].count;  // 计算最多可用多少个宅比

        }

      }
    }

    // 使用余额
    if (currenty * 1 > zhaibi * 1) {
      api.showWarningText('你拥有的宅比不足!')
      return false;
    }

    console.log("最大宅币" + needCurrenty)
    console.log("余额" + currenty)
    if (currenty > needCurrenty) {
      api.showWarningText('可使用宅比已经达到最大使用限额!')
      return false;
    }
    var biBlance = (currenty * bi).toFixed(2) * 1; //使用宅币兑换的支付的余额
    var moreShopAllMoeny = shopAllMoney - biBlance;//还需要支付多少钱

    console.log("biBlance" + biBlance)
    // 余额支付
    if (money >= moreShopAllMoeny) {
      needBalace = moreShopAllMoeny;
    } else if (money < moreShopAllMoeny) {
      needBalace = money;
    }
    if (isSelect == 1) {
      moreShopAllMoeny = moreShopAllMoeny - needBalace;
    } else if (isSelect == 2) {
      moreShopAllMoeny = moreShopAllMoeny - 0;
    } else {
      moreShopAllMoeny = moreShopAllMoeny - 0;
    }

    for (var i = 0; i < card.length; i++) {
      if (card[i].sid == 0) {
        allMoneyLast += moreShopAllMoeny * 1;
      }
      else {
        allMoneyLast += card[i].priceall * 1
      }
    }

    console.log("最多可已使用:" + needCurrenty + "币");//最多可使用多少个币
    console.log("合计金额:" + shopAllMoney) //商品总价格
    console.log('使用宅比抵扣多少钱:' + biBlance) //币抵多少余额
    console.log('还需要支付多少钱:' + moreShopAllMoeny)//还需要支付多少钱
    console.log('余额支付多少钱:' + needBalace)//余额需要支付多少钱
    console.log('合计金额:' + allMoneyLast)//余额需要支付多少钱
    if (needBalace < 0 || moreShopAllMoeny < 0 ||  allMoneyLast < 0) {
      self.setData({
        needBalace: 0,
        moreShopAllMoeny: 0,
        needCurrenty: needCurrenty,
        biBlance: biBlance,
        currenty: currenty,
        allMoneyLast: 0
      })
   }else{
    self.setData({
      needBalace: (needBalace * 1).toFixed(2),
      moreShopAllMoeny: (moreShopAllMoeny * 1).toFixed(2),
      needCurrenty: needCurrenty,
      biBlance: biBlance,
      allMoneyLast: (allMoneyLast * 1).toFixed(2)
    })

    console.log(self.data.card)

    return true;
  }
  }
  , payMoeny: function () {


    //  ---code
    var self = this;
    var allprice = self.data.allMoneyLast;//合计金额
    var card = self.data.card; //购物车商品
    var usebi = self.data.currenty;//使用了多少个币
    var isselected = self.data.isselected;//是否使用了
    var needBalace = self.data.needBalace;//余额支付多少钱
    var moreShopAllMoeny = self.data.moreShopAllMoeny;//还需要支付多少
    var userid = wx.getStorageSync("userid");
    var aid = wx.getStorageSync("aid");
    var addressid = self.data.address.id;
    console.log(addressid)
    if (!addressid) {
      api.showWarningText('请选择收货地址!')
      return false;
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    for (var i = 0; i < card.length; i++) {
      if (card[i].sid == 0) {
        if (isselected == 2) {
          card[i].userid = userid;
          card[i].addressid = addressid;
          card[i].wxpay = moreShopAllMoeny;
          card[i].money = needBalace;
          card[i].zhaibi = usebi;
        }
        else {
          card[i].userid = userid;
          card[i].addressid = addressid;
          card[i].wxpay = moreShopAllMoeny;
          card[i].money = 0;
          card[i].zhaibi = usebi;
        }
      }
      else {
        card[i].userid = userid;
        card[i].addressid = addressid;
        card[i].wxpay = card[i].priceall;
        card[i].money = 0;
        card[i].zhaibi = 0;
      }

    }
    console.log(allprice)
    console.log(card)
    wx.login({
      success: function (res) {

        console.log(res)
       // var js_code = wx.getStorageSync("code")
          api.http('card/createorder', 'GET', {
            userid: userid,
            aid: aid,
            priceall: allprice,
            data: card,
            js_code: res.code
          },
            function (res) {
            console.log(res)
              //return false;
              var allPrice = res.allprice;
              var ordernum = res.ordernum;
              api.showWarningText(res.msg)
              if (res.code == 1) {
                var wxpay = res.wxpay
                console.log(res.wxpay.timeStamp)
                wx.requestPayment({
                  timeStamp: wxpay.timeStamp,
                  nonceStr: wxpay.nonceStr,
                  package: wxpay.package,
                  signType: 'MD5',
                  paySign: wxpay.paySign,
                  success: function (res) {
                    console.log(res)
                    //self.payOrderChangeStatus(userid, ordernum)
                    wx.showToast({
                      title: '支付成功',
                      icon: 'none',
                      duration: 1000
                    })
                    setTimeout(function () {
                      wx.switchTab({
                        url: '../shoppingCart/shoppingCart'
                      })
                    }, 100) //延迟时间 这里是1秒

                  },
                  'fail': function () {
                    console.log('取消支付')
                    wx.showToast({
                      title: '取消支付',
                      duration: 800,
                      mask: true
                    })
                    setTimeout(function () {
                      wx.switchTab({
                        url: '../shoppingCart/shoppingCart'
                      })
                    }, 100) //延迟时间 这里是1秒
                  },
                  complete: function () {
                    wx.hideLoading()
                  }
                })
                return false;
              }
              else if (res.code == 2) {
                console.log('余额支付!')
                //self.payOrderChangeStatus(userid, ordernum)
                wx.showToast({
                  title: '支付成功',
                  icon: 'none',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '../shoppingCart/shoppingCart'
                  })
                }, 100) //延迟时间 这里是1秒
              }
              else {

              }

            })

        },fail:function(res){
          wx.hideLoading();
          console.log(res)
        }
      
    })

  }

  // 改变支付订单状态吗
  , payOrderChangeStatus: function (userid, ordernum) {
    var userid = userid;
    var ordernum = ordernum;
    api.http('card/payOrderChangeStatus', 'GET',
      {
        userid: userid
        ,
        ordernum: ordernum
      },
      function (res) {
        console.log(res);

        if (res.code == 1) {

          api.showSuccess("支付成功")
          setTimeout(function () {
            wx.navigateBack({
              delta: "1"
            })
          }, 1000)
        }

      })

  }
  // 改变支付订单状态吗
})