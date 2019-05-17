// pages/brandShop/brandShop.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    imgUrls: ['../images/dpbanner.jpg', '../images/dpbanner.jpg', '../images/dpbanner.jpg'],
    currentTab: 0,
    isShopEle: false,
    isLoadding: false,
    isHasShop: false,
    isHasMoredata: false,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    wx.showLoading({
      title: '加载中...',
    })
    var sellerid = options.shopid;
    var shopname = options.shopname;
    var self = this;
    wx.setNavigationBarTitle({
      title: shopname
    })
    self.setData({
      sellerid: sellerid
    })
    if (options.scene) {
      let scene = decodeURIComponent(options.scene)
      var ss = scene.split("_");
      wx.setNavigationBarTitle({
        title: ss[2]
      })
      self.setData({
        sellerid: ss[1]
      })
      api.http('store/brandindex', 'GET', {
        sellerid: ss[1],
        aid: ss[0]
      }, function(res) {
        console.log(res)
        wx.hideLoading();
        if (res.code == 1) {
          self.setData({
            vr: res.vr,
            codeimg: res.codeimg,
            isLoadding: false,
            isHasShop: true,
            isHasMoredata: false
          })
          if (res.goods.length == 0) {
            self.setData({
              isLoadding: false,
              isHasShop: true,
              isHasMoredata: false
            })
          } else if (res.goods.length < 12) {
            self.setData({
              isLoadding: false,
              isHasShop: false,
              isHasMoredata: true,
              goodsclass: res.class[0].goodsclass
            })
          } else if (res.goods.length == 12) {
            self.setData({
              isLoadding: true,
              isHasShop: false,
              isHasMoredata: false,
              goodsclass: res.class[0].goodsclass
            })
          }
          self.setData({
            imgUrls: res.storepic,
            brandClass: res.class,
            goods: res.goods,
            isShopEle: true
          })
        }

      })
      return false

    }

    var aid = wx.getStorageSync("aid")
    api.http('store/brandindex', 'GET', {
      sellerid: sellerid,
      aid: aid
    }, function(res) {
      console.log(res)
      wx.hideLoading();
      if (res.code == 1) {
        self.setData({
          vr: res.vr,
          codeimg: res.codeimg,
          isLoadding: false,
          isHasShop: true,
          isHasMoredata: false
        })
        if (res.goods.length == 0) {
          self.setData({
            isLoadding: false,
            isHasShop: true,
            isHasMoredata: false
          })
        } else if (res.goods.length < 12) {
          self.setData({
            isLoadding: false,
            isHasShop: false,
            isHasMoredata: true,
            goodsclass: res.class[0].goodsclass
          })
        } else if (res.goods.length == 12) {
          self.setData({
            isLoadding: true,
            isHasShop: false,
            isHasMoredata: false,
            goodsclass: res.class[0].goodsclass
          })
        }
        self.setData({
          imgUrls: res.storepic,
          brandClass: res.class,
          goods: res.goods,
          isShopEle: true
        })
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
              console.log("授权成功");
              var imgUrl = e.currentTarget.dataset.image;
              wx.downloadFile({ //下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
                url: imgUrl,
                success: function(res) {
                  // 下载成功后再保存到本地
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath, //返回的临时文件路径，下载后的文件会存储到一个临时文件
                    success: function(res) {
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
    console.log(e)
    var address = e.currentTarget.dataset.address;
    wx.navigateTo({
      url: '../VRAddress/VRAddress?vradd=' + address,
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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
    console.log('我下拉刷新了')

    var self = this;
    var sellerid = self.data.sellerid;
    var goodsclass = self.data.goodsclass
    var page = self.data.page;
    var goods = self.data.goods;
    page++;
    var aid = wx.getStorageSync("aid")
    api.http('store/sellergoods', 'GET', {
      sellerid: sellerid,
      goodsclass: goodsclass,
      aid: aid,
      page: page
    }, function(res) {

      wx.hideLoading()
      console.log(res)
      var goodsNew = goods.concat(res.goods)
      console.log(goodsNew)
      if (res.goods.length < 12) {
        self.setData({
          goods: goodsNew,
          isLoadding: false,
          isHasShop: false,
          isHasMoredata: true,
          page: page
        })
      } else if (res.goods.length == 12) {
        self.setData({
          goods: goodsNew,
          isLoadding: true,
          isHasShop: false,
          isHasMoredata: false,
          page: page
        })
      }
    })



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  headerShop: function(e) {

    console.log(e.currentTarget.dataset.actindex)
    wx.showLoading({
      title: '加载中...',
    })
    var self = this;
    self.setData({
      currentTab: e.currentTarget.dataset.actindex,
      page: 1
    })

    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })

    var goodsclass = e.currentTarget.dataset.classid;
    var sellerid = self.data.sellerid;
    console.log(sellerid)
    console.log(goodsclass)
    var aid = wx.getStorageSync("aid")
    api.http('store/sellergoods', 'GET', {
      sellerid: sellerid,
      goodsclass: goodsclass,
      aid: aid
    }, function(res) {
      console.log(res)
      wx.hideLoading()

      if (res.goods.length == 0) {

        self.setData({
          goods: res.goods,
          isLoadding: false,
          isHasShop: true,
          isHasMoredata: false
        })

      } else if (res.goods.length < 12) {

        self.setData({
          goods: res.goods,
          isLoadding: false,
          isHasShop: false,
          isHasMoredata: true
        })

      } else if (res.goods.length == 12) {

        self.setData({
          goods: res.goods,
          isLoadding: true,
          isHasShop: false,
          isHasMoredata: false
        })

      }

    })


  }
})