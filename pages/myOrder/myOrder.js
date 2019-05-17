//index.js  
//获取应用实例 
//注释:offStock //已完成
// toPayfor  //去支付
const app = getApp()
const api = require('../../utils/http.js');
Page({
  data: {
    currentTab: "",
    isLoadding: false,
    isHasShop: false,
    isHasMoredata: false,
    page: 1,
    image: app.globalData.imagesUrl,
  },
  onLoad: function (option) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var self = this;
    var state = option.showall;
    console.log(state)
    self.setData({
      currentTab: state
    })
    self.myOrderList(state);


  },
  onShow: function () {
    var self = this;
    var state = self.data.state;
    if (!state && state != 0) {
      return false;
    }
    self.myOrderList(state);
    console.log(state)
  },
  onUnload: function () {
    console.log('我要开始卸载页面了')
    // wx.switchTab({
    //   url: '../wd/wd'
    // })
  },
  swichNav: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    var self = this;
    var state = e.currentTarget.dataset.current;
    self.myOrderList(state)
    self.setData({
      currentTab: e.currentTarget.dataset.current
    })
  },
  myOrderList: function (state) {
    var self = this;
    var state = state;
    var userid = wx.getStorageSync("userid")
    var aid = wx.getStorageSync("aid")
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    api.http('centre/orderlist', 'GET', {
      userid: userid,
      state: state,
      aid: aid,
      page: 1
    }, function (res) {
      wx.hideLoading();
      console.log(res)
      if (res.code == 1) {
        if (res.order.length == 0) {
          self.setData({
            order: res.order,
            isLoadding: false,
            isHasShop: true,
            isHasMoredata: false,
            page: 1,
            state: state,
            userid: userid
          })
        } else if (res.order.length < 10) {
          self.setData({
            order: res.order,
            isLoadding: false,
            isHasShop: false,
            isHasMoredata: true,
            page: 1,
            state: state,
            userid: userid
          })
        } else if (res.order.length == 10) {
          self.setData({
            order: res.order,
            isLoadding: true,
            isHasShop: false,
            isHasMoredata: false,
            page: 1,
            state: state,
            userid: userid
          })
        }
      }
    })
  },
  onReachBottom: function () {

    var self = this;
    var userid = wx.getStorageSync("userid")
    var order = self.data.order;
    var state = self.data.state;
    var page = self.data.page;
    page++;
    var aid = wx.getStorageSync("aid")
    api.http('centre/orderlist', 'GET', {
      userid: userid,
      state: state,
      page: page,
      aid: aid
    }, function (res) {

      console.log(userid)

      if (res.code == 1) {
        var orderNew = order.concat(res.order);

        if (res.order.length < 10) {
          self.setData({
            order: orderNew,
            isLoadding: false,
            isHasShop: false,
            isHasMoredata: true,
            page: page,
            state: state,
            userid: userid
          })
        } else if (res.order.length == 10) {
          self.setData({
            order: orderNew,
            isLoadding: true,
            isHasShop: false,
            isHasMoredata: false,
            page: page,
            state: state,
            userid: userid
          })
        }
      }
    })

  },
  deletOrder: function (e) {
    wx.showLoading({
      title: '取消中..',
      mask: true
    })
    console.log('取消订单')
    var self = this;
    var userid = self.data.userid; //获取userid
    var order = self.data.order; //获取所有的信息
    var orderid = e.currentTarget.dataset.orderid; //获取orderid
    var orderindex = e.currentTarget.dataset.orderindx; //获取order的索引
    console.log(orderindex)
    api.http('centre/delorder', 'GET', {
      userid: userid,
      orderid: orderid
    }, function (res) {
      console.log(res)
      wx.hideLoading()
      if (res.code == 1) {
        order.splice(orderindex, 1)
        self.setData({
          order: order
        })
      }
    })
  },

  cancelOrder: function (e) {
    console.log(e)
    wx.showLoading({
      title: '删除中..',
      mask: true
    })
    console.log('删除订单')
    var self = this;
    var userid = self.data.userid; //获取userid
    var order = self.data.order; //获取所有的信息
    var orderid = e.currentTarget.dataset.orderid; //获取orderid
    var orderindex = e.currentTarget.dataset.orderindx; //获取order的索引

    api.http('centre/cancelorder', 'GET', {
      userid: userid,
      orderid: orderid
    }, function (res) {
      api.showWarningText(res.msg)
      console.log(res)
      wx.hideLoading()
      if (res.code == 1) {
        order.splice(orderindex, 1)
        self.setData({
          order: order
        })
      }
    })


  },
  confirmgoods: function (e) {

    var self = this;
    var userid = self.data.userid; //获取userid
    var order = self.data.order; //获取所有的信息
    var orderid = e.currentTarget.dataset.orderid; //获取orderid
    var orderindex = e.currentTarget.dataset.orderindex; //获取order的索引
    console.log('确认收货')
    console.log(orderindex)
    console.log(orderid)
    console.log(userid)

    wx.showModal({
      title: '提示',
      content: '确定你已经收到货！',
      success: function (res) {
        if (res.confirm) {
          var aid = wx.getStorageSync("aid")
          api.http('centre/notarizeorder', 'GET', {
            userid: userid,
            orderid: orderid,
            aid: aid
          }, function (res) {
            console.log(res)
            if (res.code == 1) {
              order.splice(orderindex, 1)
              self.setData({
                order: order
              })
            }
          })

        } else if (res.cancel) {

        }
      }
    })



  },
  pingjiaClick: function (e) {

    var self = this;
    var userid = self.data.userid
    var orderid = e.currentTarget.dataset.orderid;//这是orderid

    wx.navigateTo({
      url: '../myOrderDetails/myOrderDetails?orderid=' + orderid + '&isstate=3',
    })






  },
  showOrder: function (e) {
    console.log('查看订单')
    var self = this;

    var isstate = e.currentTarget.dataset.isstate
    var orderid = e.currentTarget.dataset.orderid

    wx.navigateTo({
      url: '../myOrderDetails/myOrderDetails?orderid=' + orderid + '&isstate=4',
    })
  },
  tixing: function () {
    wx.showLoading({
      title: '提醒中...',
      mask: true
    })
    setTimeout(function () {
      wx.hideLoading()
      api.showSuccess('提醒成功')
    }, 1000)
  }
  , lijifu: function (e) {
    var self = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var ordershop = e.currentTarget.dataset.ordershop;
    console.log(ordershop.id)

    var userid = wx.getStorageSync('userid')
    var ordernum = [];
    ordernum.push(ordershop.ordernum);
    var allprice = ordershop.priceall;
    var aid = wx.getStorageSync("aid");
    wx.login({
      success: function (res) {
        console.log(allprice)
        console.log(ordernum)
        console.log(res.code)
        if (res.code) {
          //发起网络请求
          api.http('card/payorder', 'GET', {
            ordernum: ordernum,
            allprice: allprice,
            js_code: res.code,
            aid: ordershop.aid,
            oid: ordershop.id
          },
            function (res) {
              console.log(res)
              api.showWarningText(res.msg)
              if (res.code == 1) {
                wx.hideLoading();
                var wxpay = res.wxpay;
                wx.requestPayment({
                  timeStamp: wxpay.timeStamp,
                  nonceStr: wxpay.nonceStr,
                  package: wxpay.package,
                  signType: 'MD5',
                  paySign: wxpay.paySign,
                  success: function (res) {
                    console.log(res)
                    api.showSuccess('申请成功');
                    wx.switchTab({
                      url: '../personalCenter/personalCenter'
                    })
                  },
                  'fail': function () {
                    console.log('取消支付')
                    wx.showToast({
                      title: '取消支付',
                      duration: 800,
                      mask: true
                    })
                  },
                  'complete': function () {
                    wx.hideLoading()
                  }
                })
              }
            })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
    // api.showWarningText('支付尚在开发,敬请期待')
    // return false;
  }// 改变支付订单状态吗
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
          slef.myOrderList(1)
        }
      })
  }
  // 改变支付订单状态吗
})