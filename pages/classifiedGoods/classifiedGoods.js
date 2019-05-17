// pages/classifiedGoods/classifiedGoods.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isWhoEle: 0, //0 代表一个都没有选中   1:价格  2:销量  3:上架时间  4:评价
    isWhoEleTop: true,
    isHasShop: false, //是否有商品
    isLoadding: false, //是否开启加载状态
    isHasMoredata: false, //是否还有更多商品数据
    page: 1,
    image: app.globalData.imagesUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '商品加载中...',
      mask: true
    })
    console.log(options)
    var tabsell = wx.getStorageSync("tabSelectid")
    if (tabsell == "" || tabsell == undefined) {
      wx.setStorageSync("tabSelectid", options.goodsclass2)
    } else {
      var self = this;
      // goodid
      var goodsclass2 = options.goodsclass2
      self.setData({
        goodsclass2: goodsclass2
      })
      var goodsObject = {
        goodsclass2: goodsclass2
      }
      self.getShopList(goodsObject); //获取全部数据
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    console.log(e)
    var that = this;
    that.setData({
      modalName: 2
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.setStorageSync("update", 3) //代表第三次进来
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
    var self = this;
    var goodsObject = self.data.goodsObject;
    goodsObject.page++;
    var goods = self.data.goods;
    var goodsclass2 = goodsObject.goodsclass2
    var page = goodsObject.page
    var aid = wx.getStorageSync("aid")

    api.http('store/moregoods', 'GET', {
        goodsclass2: goodsclass2,
        page: page,
        aid: aid
      },
      function(res) {
        console.log(res)
        wx.hideLoading();
        if (res.code == 1) {

          var goodsNew = goods.concat(res.goods);
          if (res.goods.length < 12) {
            self.setData({
              goods: goodsNew,
              isLoadding: false, //是否开启加载状态
              isHasMoredata: true, //是否还有更多商品数据
            })
          } else if (res.goods.length == 12) {
            self.setData({
              goods: goodsNew,
              isLoadding: true, //是否开启加载状态
              isHasMoredata: false, //是否还有更多商品数据
            })
          }



        }
      })





  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  moern: function() {
    wx.removeStorageSync("brandshoplistid")
    var that = this;
    var aid = wx.getStorageSync("aid")
    var tabSelectid = wx.getStorageSync("tabSelectid")
    api.http('store/moregoods', 'GET', {
        goodsclass2: tabSelectid,
        aid: aid,
      },
      function(res) {
        console.log(res)
        wx.hideLoading();
        that.setData({
          goods: res.goods,
          modalName: 2,
          isWhoEle: 0, //0 代表一个都没有选中   1:价格  2:销量  3:上架时间  4:评价
          isLoadding: false, //是否开启加载状态
          isHasMoredata: false, //是否还有更多商品数据
        })
      })
  },
  shopGoodsSort: function(e) {
    var self = this;
    var goodsclass2 = self.data.goodsclass2;
    var sortindex = e.currentTarget.dataset.sortindex; //当前标签的索引 1:价格  2:销量  3:上架时间  4:评价
    var isWhoEleOld = self.data.isWhoEle;
    var isWhoEleNew = sortindex;

    console.log(isWhoEleOld)
    console.log(isWhoEleNew == 1 ? "价格" : isWhoEleNew == 2 ? "销量" : isWhoEleNew == 3 ? "上架时间" : isWhoEleNew == 4 ? "评价" : "没有这个数据")

    if (isWhoEleOld != isWhoEleNew) {

      var price = 1
      var sum = 1
      var creattime = 1
      var evaluate = 1

      self.setData({
        price: price,
        sum: sum,
        creattime: creattime,
        evaluate: evaluate
      })

      console.log('切换排序的规则' + isWhoEleNew);
      self.setData({
        isWhoEle: isWhoEleNew,
        isWhoEleTop: true
      })
      if (isWhoEleNew == 1) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          price: 1
        }
        self.getShopList(goodsObject); //获取全部数据
      }
      if (isWhoEleNew == 2) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          sum: 1
        }
        self.getShopList(goodsObject); //获取全部数据
      }
      if (isWhoEleNew == 3) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          creattime: 1
        }
        self.getShopList(goodsObject); //获取全部数据
      }
      if (isWhoEleNew == 4) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          evaluate: 1
        }
        self.getShopList(goodsObject); //获取全部数据
      }

    } else {

      console.log('切换倒序正序');

      var price = self.data.price;
      var sum = self.data.sum;
      var creattime = self.data.creattime;
      var evaluate = self.data.evaluate;

      price = price == 1 ? 2 : 1
      sum = sum == 1 ? 2 : 1
      creattime = creattime == 1 ? 2 : 1
      evaluate = evaluate == 1 ? 2 : 1


      console.log(price)
      console.log(sum)
      console.log(creattime)
      console.log(evaluate)
      self.setData({
        isWhoEle: isWhoEleOld,
        isWhoEleTop: !self.data.isWhoEleTop,
        price: price,
        sum: sum,
        creattime: creattime,
        evaluate: evaluate
      })






      if (isWhoEleNew == 1) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          price: price
        }
        self.getShopList(goodsObject); //获取全部数据
      }
      if (isWhoEleNew == 2) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          sum: sum
        }
        self.getShopList(goodsObject); //获取全部数据
      }
      if (isWhoEleNew == 3) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          creattime: creattime
        }
        self.getShopList(goodsObject); //获取全部数据
      }
      if (isWhoEleNew == 4) {
        var goodsObject = {
          goodsclass2: goodsclass2,
          evaluate: evaluate
        }
        self.getShopList(goodsObject); //获取全部数据
      }
    }



  },
  brandShoplist: function(e) {
    var self = this;
    var brandshoplistid = e.currentTarget.dataset.brandshoplistid
    wx.setStorageSync("brandshoplistid", brandshoplistid)
    var aid = wx.getStorageSync("aid")
    var tabSelectid = wx.getStorageSync("tabSelectid")
    api.http('store/moregoods', 'GET', {
        goodsclass2: tabSelectid,
        aid: aid,
        sellerid: brandshoplistid
        //price: goodsObject.price
      },
      function(res) {
        console.log(res)
        wx.hideLoading();
        self.setData({
          goods: res.goods,
          modalName: 2,
          isLoadding: false, //是否开启加载状态
          isHasMoredata: false, //是否还有更多商品数据
        })
      })

  },
  getShopList: function(goodsObject) {
    console.log(goodsObject)
    var self = this;
    var goodsclass2 = goodsObject.goodsclass2;
    console.log(goodsObject)
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    var brandshoplistid = wx.getStorageSync("brandshoplistid")
    if (brandshoplistid == "" || brandshoplistid == undefined) {
      var aid = wx.getStorageSync("aid")
      var tabSelectid = wx.getStorageSync("tabSelectid")
      //价格
      if (goodsObject.price) {
        api.http('store/moregoods', 'GET', {
            goodsclass2: tabSelectid,
            aid: aid,
            price: goodsObject.price
          },
          function(res) {
            console.log(res)
            wx.hideLoading();


            if (res.code == 1) {
              wx.setNavigationBarTitle({
                title: res.classname
              })
              goodsObject.page = 1;
              wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
              })
              if (res.goods.length == 0) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: true, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })


              } else if (res.goods.length < 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: true, //是否还有更多商品数据
                })


              } else if (res.goods.length == 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: true, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })

              }

            }
          })
      } else if (goodsObject.sum) {
        //销量
        api.http('store/moregoods', 'GET', {
            goodsclass2: tabSelectid,
            aid: aid,
            sum: goodsObject.sum
          },
          function(res) {
            console.log(res)
            wx.hideLoading();


            if (res.code == 1) {
              wx.setNavigationBarTitle({
                title: res.classname
              })
              goodsObject.page = 1;
              wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
              })
              if (res.goods.length == 0) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: true, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })


              } else if (res.goods.length < 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: true, //是否还有更多商品数据
                })


              } else if (res.goods.length == 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: true, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })

              }

            }
          })
      } else if (goodsObject.creattime) {
        //上架时间
        api.http('store/moregoods', 'GET', {
            goodsclass2: tabSelectid,
            aid: aid,
            creattime: goodsObject.creattime
          },
          function(res) {
            console.log(res)
            wx.hideLoading();


            if (res.code == 1) {
              wx.setNavigationBarTitle({
                title: res.classname
              })
              goodsObject.page = 1;
              wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
              })
              if (res.goods.length == 0) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: true, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })


              } else if (res.goods.length < 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: true, //是否还有更多商品数据
                })


              } else if (res.goods.length == 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: true, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })

              }

            }
          })
      } else if (goodsObject.evaluate) {
        //评价
        api.http('store/moregoods', 'GET', {
            goodsclass2: tabSelectid,
            aid: aid,
            creattime: goodsObject.evaluate
          },
          function(res) {
            console.log(res)
            wx.hideLoading();


            if (res.code == 1) {
              wx.setNavigationBarTitle({
                title: res.classname
              })
              goodsObject.page = 1;
              wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
              })
              if (res.goods.length == 0) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: true, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })


              } else if (res.goods.length < 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: true, //是否还有更多商品数据
                })


              } else if (res.goods.length == 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: true, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })

              }

            }
          })
      } else {
        api.http('store/moregoods', 'GET', {
            goodsclass2: tabSelectid,
            aid: aid
          },
          function(res) {
            console.log(res)
            wx.hideLoading();
            for (var i = 0; i < res.goods.length; i++) {
              if (res.goods[i].name.length > 7) {
                var sty = res.goods[i].name.substring(0, 7)


              }
            }
            if (res.code == 1) {
              wx.setNavigationBarTitle({
                title: res.classname
              })
              goodsObject.page = 1;
              wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
              })
              if (res.goods.length == 0) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: true, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })


              } else if (res.goods.length < 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: true, //是否还有更多商品数据
                })
              } else if (res.goods.length == 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: true, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })

              }

            }
          })
      }

    } else {
      var aid = wx.getStorageSync("aid")
      var tabSelectid = wx.getStorageSync("tabSelectid")




      //价格
      if (goodsObject.price) {
        api.http('store/moregoods', 'GET', {
            goodsclass2: tabSelectid,
            aid: aid,
            sellerid: brandshoplistid,
            price: goodsObject.price
          },
          function(res) {
            console.log(res)
            wx.hideLoading();


            if (res.code == 1) {
              wx.setNavigationBarTitle({
                title: res.classname
              })
              goodsObject.page = 1;
              wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
              })
              if (res.goods.length == 0) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: true, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })


              } else if (res.goods.length < 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: true, //是否还有更多商品数据
                })


              } else if (res.goods.length == 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: true, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })

              }

            }
          })
      } else if (goodsObject.sum) {
        //销量
        api.http('store/moregoods', 'GET', {
            goodsclass2: tabSelectid,
            aid: aid,
            sellerid: brandshoplistid,
            sum: goodsObject.sum
          },
          function(res) {
            console.log(res)
            wx.hideLoading();


            if (res.code == 1) {
              wx.setNavigationBarTitle({
                title: res.classname
              })
              goodsObject.page = 1;
              wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
              })
              if (res.goods.length == 0) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: true, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })


              } else if (res.goods.length < 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: true, //是否还有更多商品数据
                })


              } else if (res.goods.length == 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: true, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })

              }

            }
          })
      } else if (goodsObject.creattime) {
        //上架时间
        api.http('store/moregoods', 'GET', {
            goodsclass2: tabSelectid,
            aid: aid,
            sellerid: brandshoplistid,
            creattime: goodsObject.creattime
          },
          function(res) {
            console.log(res)
            wx.hideLoading();


            if (res.code == 1) {
              wx.setNavigationBarTitle({
                title: res.classname
              })
              goodsObject.page = 1;
              wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
              })
              if (res.goods.length == 0) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: true, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })


              } else if (res.goods.length < 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: true, //是否还有更多商品数据
                })


              } else if (res.goods.length == 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: true, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })

              }

            }
          })
      } else if (goodsObject.evaluate) {
        //评价
        api.http('store/moregoods', 'GET', {
            goodsclass2: tabSelectid,
            aid: aid,
            sellerid: brandshoplistid,
            creattime: goodsObject.evaluate
          },
          function(res) {
            console.log(res)
            wx.hideLoading();


            if (res.code == 1) {
              wx.setNavigationBarTitle({
                title: res.classname
              })
              goodsObject.page = 1;
              wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
              })
              if (res.goods.length == 0) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: true, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })


              } else if (res.goods.length < 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: true, //是否还有更多商品数据
                })


              } else if (res.goods.length == 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: true, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })

              }

            }
          })
      } else {
        api.http('store/moregoods', 'GET', {
            goodsclass2: tabSelectid,
            aid: aid,
            sellerid: brandshoplistid,
            price: goodsObject.price
          },
          function(res) {
            console.log(res)
            wx.hideLoading();


            if (res.code == 1) {
              wx.setNavigationBarTitle({
                title: res.classname
              })
              goodsObject.page = 1;
              wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
              })
              if (res.goods.length == 0) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: true, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })


              } else if (res.goods.length < 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: false, //是否开启加载状态
                  isHasMoredata: true, //是否还有更多商品数据
                })


              } else if (res.goods.length == 12) {

                self.setData({
                  goods: res.goods,
                  goodsObject: goodsObject,
                  storelist: res.store,
                  isHasShop: false, //是否有商品
                  isLoadding: true, //是否开启加载状态
                  isHasMoredata: false, //是否还有更多商品数据
                })

              }

            }
          })
      }
    }
  }
})