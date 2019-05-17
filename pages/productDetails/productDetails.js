// pages/productDetails/productDetails.js
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    imgUrls: ['../images/b0.png', '../images/b0.png', '../images/b0.png'],
    num: 1,
    minusStatus: 'disable',
    userComStat: 5, // 1:一份
    isSelect: -1,
    shopmoney: "",
    isShowZhaiBi: false,
    isshare: "",
    image: app.globalData.imagesUrl,
    btuBottom: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    //const scene = decodeURIComponent(options.scene)
    //console.log(options)
    // var stt  = "1_33";
    // var ss = stt.split("_");
    // console.log(ss[0])
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    console.log(options)
    var self = this;
    var goodsid = options.goodid;
    var status = options.status;
    var aid = options.aid;
    console.log('商品id:' + goodsid)
    var isshare = options.isshare;
    console.log('分享出来的id' + isshare)
    if (isshare == 10) {
      console.log('我已经设置上值了')
      self.setData({
        isshare: isshare
      })
    }
    var userid = wx.getStorageSync("userid");
    var userInfomation = wx.getStorageSync("userInfomation");
    if (userid) {
      self.setData({
        userid: userid
      })
    }
    if (userInfomation) {
      var userInfomation = wx.getStorageSync("userInfomation");
      var userInfostatus = wx.getStorageSync("userInfostatus");
      var workclass = userInfomation.clubid + userInfostatus;
      userInfomation = JSON.parse(userInfomation)
      if (userInfomation.workclass != 0) {
        console.log('你是工人');
        self.setData({
          isShowZhaiBi: true,
          workclass: workclass
        })
      } else {
        console.log('你是普通人');
        self.setData({
          isShowZhaiBi: false
        })
      }
    } else {

      self.setData({
        isShowZhaiBi: false
      })
    }


    console.log(userid)
    if (options.scene) {
      let scene = decodeURIComponent(options.scene)
      var ss = scene.split("_");

      api.http('fastorder/goodsdetail', 'GET', {
        goodsid: ss[1],
        aid: ss[0]
      }, function (res) {
        console.log(res)
        wx.hideLoading()
        if (res.code == 1) {
          var userInfomation = wx.getStorageSync("userInfomation");
          var userInfostatus = wx.getStorageSync("userInfostatus");
          var workclass = userInfomation.clubid + userInfostatus;
          self.setData({

            goodspic: res.goodspic,
            goods: res.goods,
            goodsspecs: res.goodsspecs,
            recommendgoods: res.recommendgoods,
            evaluate: res.evaluate,
            storename: res.storename,
            storelogo: res.storelogo,
            count: res.count,
            code: res.code_wx,
            shopmoney: res.goods.discount,
            vr: res.vr,
            phone: res.phone,
            workclass: workclass
          })
          WxParse.wxParse('article', 'html', res.goods.cont, self, 0);
        }

      })
     return false
    }
    if (status == "cccc") {
      api.http('fastorder/goodsdetail', 'GET', {
        goodsid: goodsid,
        aid: aid
      }, function(res) {
        console.log(res)
        wx.hideLoading()
        if (res.code == 1) {
          var userInfomation = wx.getStorageSync("userInfomation");
          var userInfostatus = wx.getStorageSync("userInfostatus");
          var workclass = userInfomation.clubid + userInfostatus;
          self.setData({

            goodspic: res.goodspic,
            goods: res.goods,
            goodsspecs: res.goodsspecs,
            recommendgoods: res.recommendgoods,
            evaluate: res.evaluate,
            storename: res.storename,
            storelogo: res.storelogo,
            count: res.count,
            code: res.code_wx,
            shopmoney: res.goods.discount,
            vr: res.vr,
            phone: res.phone,
            workclass: workclass
          })
          WxParse.wxParse('article', 'html', res.goods.cont, self, 0);
        }

      })
    } else {
      var aid = wx.getStorageSync("aid");
      api.http('fastorder/goodsdetail', 'GET', {
        goodsid: goodsid,
        aid: aid
      }, function(res) {
        console.log(res)
        wx.hideLoading()
        if (res.code == 1) {
          var userInfomation = wx.getStorageSync("userInfomation");
          var userInfostatus = wx.getStorageSync("userInfostatus");
          var workclass = userInfomation.clubid + userInfostatus;
          self.setData({

            goodspic: res.goodspic,
            goods: res.goods,
            goodsspecs: res.goodsspecs,
            recommendgoods: res.recommendgoods,
            evaluate: res.evaluate,
            storename: res.storename,
            storelogo: res.storelogo,
            count: res.count,
            code: res.code_wx,
            shopmoney: res.goods.discount,
            vr: res.vr,
            phone: res.phone,
            workclass: workclass
          })
          WxParse.wxParse('article', 'html', res.goods.cont, self, 0);
        }

      })
    }


    wx.getSystemInfo({
      success: res => {
        console.log('手机信息res' + res.model)
        let modelmes = res.model;
        if (modelmes.search('iPhone') != -1) {
          self.setData({
            btuBottom: true
          })
        } else {
          self.setData({
            btuBottom: false
          })
        }
      }
    })

  },
  //点击开始的时间  
  timestart: function(e) {
    var _this = this;
    _this.setData({
      timestart: e.timeStamp
    });
  },
  //点击结束的时间
  timeend: function(e) {
    var _this = this;
    _this.setData({
      timeend: e.timeStamp
    });
  },
  saveImg: function(e) {
    var _this = this;
    var times = _this.data.timeend - _this.data.timestart;
    if (times > 300) {
      console.log("长按");
      wx.getSetting({
        success: function(res) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function(res) {
              wx.showLoading({
                title: '保存中...',
                mask: true
              })
              console.log("授权成功");
              var imgUrl = e.currentTarget.dataset.image;
              wx.downloadFile({ //下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
                url: imgUrl,
                success: function(res) {
                  // 下载成功后再保存到本地
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath, //返回的临时文件路径，下载后的文件会存储到一个临时文件
                    success: function(res) {
                      wx.hideLoading();
                      wx.showToast({
                        title: '成功保存到相册',
                        icon: 'success'
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  },
  goAddress: function(e) {
    var address = e.currentTarget.dataset.address;
    wx.navigateTo({
      url: '../VRAddress/VRAddress?vradd=' + address,
    })
  },
  calling: function(e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone, //此号码并非真实电话号码，仅用于测试
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // var self=this;
    // var isshare = self.data.isshare;
    // console.log(isshare)
    // if (isshare==10)
    // {
    //   console.log('我进这个方法了')
    //       wx.switchTab({
    //         url: '../index/index',
    //       })
    // }
    console.log('页面消失了')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var self = this;
    var isshare = self.data.isshare;
    console.log(isshare)
    if (isshare == 10) {
      console.log('我进这个方法了')
      wx.switchTab({
        url: '../index/index',
      })
      return false;
    }
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
  onShareAppMessage: function(res) {

    console.log('点击了分析那个')
    var self = this;
    var goods = self.data.goods;
    var goodspic = self.data.goodspic;
    console.log(goodspic[0])
    var userid = wx.getStorageSync('userid')

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }

    return {
      title: goods.name,
      path: '/pages/registrationPage/registrationPage?pid=' + userid + '&goodsid=' + goods.id,
      imageUrl: goodspic[0].pic
    }

  },
  selectActive: function(e) {


      console.log(e)
      var self = this;
      var shopindex = e.currentTarget.dataset.shopindex; //当前的索引
      var shopname = e.currentTarget.dataset.shopname; //规格name
      var shopid = e.currentTarget.dataset.shopid; //规格id
      var shopprice = e.currentTarget.dataset.shopprice; //规格id
      var bi = e.currentTarget.dataset.bi; //反的宅币
      var isSelect = self.data.isSelect; //选中的是第几个币
      var userInfomation = wx.getStorageSync("userInfomation");
      var userInfostatus = wx.getStorageSync("userInfostatus");
      userInfomation = JSON.parse(userInfomation);
      var workclass = userInfomation.clubid + userInfostatus;
      console.log(userInfomation.clubid)
      console.log(userInfostatus)
      if (isSelect == shopindex) {
        return false;
      }

      self.setData({
        isSelect: shopindex,
        shopmoney: shopprice,
        giveCurrent: bi,
        giveCurrentNew: bi,
        num: 1,
        workclass: workclass
      })



    }


    ,
  //事件处理函数
  /*点击减号*/
  bindMinus: function() {
    var self = this;
    var isSelect = self.data.isSelect
    if (isSelect < 0) {
      return false;
    }
    var num = this.data.num;
    if (num > 1) {
      num--;
    }
    var minusStatus = num > 1 ? 'normal' : 'disable';
    var giveCurrentNew = self.data.giveCurrentNew;
    this.setData({
      num: num,
      minusStatus: minusStatus,
      giveCurrent: num * giveCurrentNew
    })
  },
  /*点击加号*/
  bindPlus: function() {
    var self = this;
    var isSelect = self.data.isSelect
    if (isSelect < 0) {
      api.showWarningText('请选择商品规格!')
      return false;
    }
    var num = this.data.num;
    num++;
    var giveCurrentNew = self.data.giveCurrentNew;
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus,
      giveCurrent: num * giveCurrentNew
    })
  },
  /*输入框事件*/
  bindManual: function(e) {
    var self = this;
    var num = e.detail.value;

    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  },
  jionShopCar: function() {

    console.log("加入购物车!")
    var self = this;
    var goodsid = self.data.goods.id;
    var isSelect = self.data.isSelect;
    var count = self.data.num;
    var goodsspecs = self.data.goodsspecs


    // specname = goodsspecs[isSelect]

    console.log(goodsid)
    // console.log(specname)
    console.log(count)


    api.joinShopCar(goodsid, isSelect, goodsspecs, count, function(res) {
      console.log(res)
      if (res.code == 1) {
        api.showSuccess(res.msg)

      } else {
        api.showWarning(res.msg)
      }
    })





  },
  shareSdk: function() {

    console.log('转发内容啊')
    var self = this;
    var userid = self.data.userid;
    if (!userid) {
      wx.navigateTo({
        url: '../registrationPage/registrationPage'
      })
      return false;
    }
  },
  backHome: function() {

    wx.switchTab({
      url: '../index/index',
    })

  }

})