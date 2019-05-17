// pages/myOrderDetails/myOrderDetails.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: app.globalData.imagesUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  var self =this;
wx.showLoading({
  title: '加载中...',
  mask:true
})
  var orderid = options.orderid;
   
  var isstate = options.isstate;
  var userid = wx.getStorageSync("userid")
   self.setData({
     isstate: isstate,
     userid: userid,
     orderid: orderid
   })
   var aid = wx.getStorageSync("aid")
  api.http('centre/orderdetail', 'GET', {
      orderid: orderid,
    aid: aid
    }, function (res) {
      console.log(res)
      wx.hideLoading()
      if(res.code == 1)
      {
        self.setData({
          order:res.order
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
    var self =this
    var isstate = self.data.isstate
    var orderid = self.data.orderid
    console.log(isstate)
    console.log(orderid)
    if (!isstate && !orderid)
    {
      return false
    }
    if (isstate == 3)
    {
      var aid = wx.getStorageSync("aid")
      api.http('centre/orderdetail', 'GET', {
        orderid: orderid,
        aid: aid
      }, function (res) {
        console.log(res)
        wx.hideLoading()
        if (res.code == 1) {
          self.setData({
            order: res.order
          })
        }
      })
    }
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
  ,
   copyText:function(){
    var self =this;
     var ordernum = self.data.order.ordernum 
     wx.setClipboardData({
       data: ordernum,
       success: function (res) {
         wx.getClipboardData({
           success: function (res) {
             console.log(res.data) // data
           }
         })
       }
     })


  }



  ,
  cancelOrder:function(e){
    console.log('删除订单')
    var self = this;
    var userid = self.data.userid;//获取userid
    var orderid = e.currentTarget.dataset.orderid;//获取orderid
    var orderindex = e.currentTarget.dataset.orderindex;//获取order的索引
    api.http('centre/cancelorder', 'GET', {
      userid: userid,
      orderid: orderid
    }, function (res) {

       console.log(res)
     if(res.code == 1)
     {

      //  let pages = getCurrentPages();//当前页面
      //  // 选择城市地址进行选择城市
      //  let prevPage = pages[pages.length - 2];//上一页面
      //  prevPage.setData({//直接给上移页面赋值
      //    address: selectAddresslist
      //  });
       wx.navigateBack({
         delta: 1
       })



     }


    
    })
  }
  , confirmgoods:function(e){

    console.log('确认收货')
    var self = this;
    var userid = self.data.userid; //获取userid
 
    var orderid = e.currentTarget.dataset.orderid; //获取orderid
    console.log(userid)
  console.log(orderid)
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
              wx.navigateBack({
                delta:1
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })





   

  }
  , deletOrder:function(e){
    console.log('取消订单')
    var self = this;
    var userid = self.data.userid; //获取userid
    var orderid = e.currentTarget.dataset.orderid; //获取orderid
    api.http('centre/delorder', 'GET', {
      userid: userid,
      orderid: orderid
    }, function (res) {
      console.log(res)
      if (res.code == 1) {
        wx.navigateBack({
          delta:1
        })
      }
    })
  }

  , pingjiaClick:function(e){
    
    var  self =this;
    console.log(1)
    var specname = e.currentTarget.dataset.specname; //规格名字
    var orderid = e.currentTarget.dataset.orderid;//订单id
    var goodsid = e.currentTarget.dataset.goodsid;//商品id
    var shopInfor={
      specname: specname,
      orderid: orderid,
      goodsid: goodsid
    }
    shopInfor =JSON.stringify(shopInfor);
    console.log(shopInfor)
    if(shopInfor)
    {
      
      wx.navigateTo({
        url: '../publicationEvaluation/publicationEvaluation?shopinfo='+shopInfor
      })

    }


  },
  tixing: function () {
    wx.showLoading({
      title: '提醒中...',
      mask:true
    })
    setTimeout(function () {
      wx.hideLoading()
      api.showSuccess('提醒成功')
    }, 1000)
  }, lijifu: function (e) {
wx.showLoading({
  title: '加载中...',
  mask:true
})
    var self = this;
    var ordershop = e.currentTarget.dataset.ordershop;
    console.log(ordershop)
    var userid = wx.getStorageSync('userid')
    var ordernum = [];
    ordernum.push(ordershop.ordernum);
    var allprice = ordershop.priceall;
    wx.login({
      success: function (res) {
        console.log(allprice)
        console.log(ordernum)
        console.log(res.code)
        if (res.code) {
          //发起网络请求
          api.http('card/payOrder', 'GET', {
            ordernum: ordernum,
            allprice: allprice,
            js_code: res.code
          },
            function (res) {
              console.log(res)

              var timeStamp = res.timeStamp;
              var nonceStr = res.nonceStr;
              var prepayid = res.package;
              var paySign = res.paySign;
              wx.requestPayment({
                'timeStamp': timeStamp,
                'nonceStr': nonceStr,
                'package': prepayid,
                'signType': 'MD5',
                'paySign': paySign,
                'success': function (res) {
                  console.log(res)
                  self.payOrderChangeStatus(userid, ordernum)
                }
                , 'fail': function () {
                  
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
            })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
 
    // api.showWarningText('支付尚在开发,敬请期待')
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