// pages/shoppingMall/shoppingMall.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchHeight: 0,
    searchTop: 0,
    activeViewItem: 0, //默认选中第一个
    isHasShopData: false,
    TabCur: 0,
    scrollLeft: 0,
    image: app.globalData.imagesUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.setStorageSync("update", 1) //代表刚进来
    var classid2 = wx.getStorageSync("classid2"); //二级分类id
    wx.setStorageSync("wx_classid", classid2) //缓存二级分类
    var self = this;
    wx.getSystemInfo({
      success: function(system) {
        //创建节点选择器
        var query = wx.createSelectorQuery();
        //选择id
        query.select('#mjltest').boundingClientRect()
        query.exec(function(res) {

          self.setData({
            searchHeight: (system.windowHeight * 1 - res[0].height * 1 - 2) + 'px',
            searchTop: res[0].height + 'px'
          })
        })
      }
    })
    var self = this;

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    return false;
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
    var update = wx.getStorageSync("update")
    if (update == "" || update == 1) { //刚进来的时候
      console.log("需要更新")
      var that = this;
      that.getshow();
      wx.getStorage({
        key: 'classidyibu', //这个是刚才在缓存数据时的关键字，保持一致
        success: function(res) { //成功后回调的函数，先打印出来
          console.log(res.data)
          if (res.data == 1) { //如果是一级分类 等于1的情况下走着里 
            wx.setStorageSync("tabSelectid", 3) //二级分类id
          } else if (res.data == 2) { //如果是一级分类 等于2的情况下走着里 
            wx.setStorageSync("tabSelectid", 4)
          } else {}

        },
      })
    } else if (update == 2) { //第二次进来的时候
      console.log("我走到2这里了")
      var that = this;
      wx.getStorage({
        key: 'classidyibu', //这个是刚才在缓存数据时的关键字，保持一致
        success: function(res) { //成功后回调的函数，先打印出来
          console.log(res.data)
          if (res.data > 2 && res.data != 100000) { //说明后台选中了其他商品
            api.http('store/two_goods', 'GET', {
              goodsclass2: res.data,
            }, function(res) {
              that.getshow();
              if (res.goods.length == 0){
                // that.setData({
                //   isHasShopData: true
                // })
              }else{
                wx.setStorageSync("tabSelectid", res.goods[0].id)
              }
            })
          } else {
            if (res.data == 1) { //如果是一级分类 等于1的情况下走着里 
              wx.setStorageSync("tabSelectid", 3) //二级分类id
              that.getshow(); //更细当前数据 
            } else if (res.data == 2) { //如果是一级分类 等于2的情况下走着里 
              wx.setStorageSync("tabSelectid", 4)
              that.getshow(); //更细当前数据 
            } else if (res.data == 100000) { //如果是品牌馆 等于2的情况下走着里 
              that.getshow();
            } else {

            }
          }
        },
      })
    } else {}

    // var activid = wx.getStorageSync("activid"); //取出是哪一个id
    // if (classid == undefined && activid == 1){
    //   let e = {
    //     currentTarget: {
    //       dataset: {
    //         indexid: 3
    //       }
    //     }
    //   }
    //   this.tabSelect(e);
    //  }else{
    //   //this.getshow();
    //  }

    // if (classid == 100000){
    //   this.getshow();
    //   console.log("值有变化需要更新")
    // }



    //处理点击主页分类,再进商城点击二级分类没有效果的方法
    //   var classid = wx.getStorageSync("classid"); //取出是哪一个id
    //   //如果 activid ==  43 代表一级分类更新当前一级分类下的商品
    //   if (classid == 1){
    //     console.log("代表一级分类更新当前一级分类下的商品")
    //     //this.getshow();
    //     let e = {
    //       currentTarget: {
    //         dataset: {
    //           indexid: 3
    //         }
    //       }
    //     }
    //     //this.tabSelect(e);
    //  } 

    //处理主页点击一级分类 在点击一级分类没有反映的方法
    // if (classid == 1){
    //   wx.setStorageSync("activid", "3")//代表刚进来
    // }

    // var activid = wx.getStorageSync("activid");
    // if (activid == 48 && classid == 48){
    //   let e = {
    //     currentTarget: {
    //       dataset: {
    //         indexid: 48
    //       }
    //     }
    //   }
    //   this.tabSelect(e);
    //   this.getshow();
    // }
    // var aa = wx.getStorageSync("tabSelectid")
    // if(aa){

    // } else {
    //   this.getshow();
    // }

    //或者你直接给e赋值成0  在tabSelect函数里面if判断  如果拿到的能拿到id值就用id  没有就赢e替代
    /**
     * this.tabSelect(0);
     * 
     * let bbb=e.currentTarget.dataset.id
     * if(e.currentTarget.dataset.id){
     *    bbb=e.currentTarget.dataset.id
     * }else{
     *    bbb=e
     * }
     */

    //去掉查看更多里面的id
    wx.removeStorageSync("brandshoplistid")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("页面隐藏")
    wx.setStorageSync("update", 2) //代表第二次进来
    wx.removeStorageSync("classid");
    wx.removeStorageSync("classidyibu"); //移除哪一个id
    // wx.removeStorageSync("classidyibu");
    //处理正在选择一级分类 主页还选择当时选择的一级分类没有效果的方法
    //var activid = wx.getStorageSync("activid");
    // if (classid == 1 && activid == 1) {
    //   let e = {
    //     currentTarget: {
    //       dataset: {
    //         indexid: 3
    //       }
    //     }
    //   }
    //   this.tabSelect(e);
    //   wx.setStorageSync("activid", "1")//代表第二次进来
    // }else{
    //   wx.setStorageSync("activid", "2")//代表第二次进来
    // }

    //wx.removeStorageSync("tabSelectid");
  },
  tabSelect(e) {
    console.log(e)
    var self = this;
    wx.setStorageSync("tabSelectid", e.currentTarget.dataset.indexid);
    self.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,

    })
    self.setData({
      goodsid: e.currentTarget.dataset.indexid
    })
    var id = e.currentTarget.dataset.id
    api.http('store/two_goods', 'GET', {
      goodsclass2: e.currentTarget.dataset.indexid,
    }, function(res) {
      wx.hideLoading();
      console.log(res)
      if (res.code == 1) {
        self.setData({
          seller: 0,
          goodsclass3: res.goods,
          //  goodsid: g_id
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

    var self = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    api.http('store/storeindex', 'GET', {}, function(res) {
      wx.stopPullDownRefresh();
      if (res.code == 1) {
        self.setData({
          goodsclass1: res.goodsclass1,
          activeViewItem: 0
        })
        api.http('store/getgoods', 'GET', {
          goodsclass: res.goodsclass1[0].id
        }, function(res) {

          if (res.code == 1) {
            self.setData({
              seller: 0,
              goodsclass2: res.goodsclass2
            })
            wx.hideLoading();
          }
        })
      } else {
        wx.hideLoading();
        self.setData({
          isHasShopData: true
        })
      }
    })






  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  goods: function(e) {
    var aid = wx.getStorageSync("aid")
    wx.navigateTo({
      url: '../productDetails/productDetails?goodid=' + e.currentTarget.dataset.goodid + "&aid=" + aid + "&status=" + "cccc"
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  selectClassfiedGood: function(e) {
    console.log(e)
    wx.setStorageSync("activid", e.currentTarget.dataset.activid)
    var self = this;
    var aid = wx.getStorageSync("aid")
    api.http('store/storeindex', 'POST', {
      aid: aid,
      goodsclass: e.currentTarget.dataset.activid
    }, function(res) {
      wx.setStorageSync("tabSelectid", res.class2) //二级分类id
    })
    wx.removeStorageSync("classid");
    var activid = e.currentTarget.dataset.activid;
    var activindex = e.currentTarget.dataset.activindex;
    var activeViewItem = self.data.activeViewItem;
    var self = this;
    console.log(activindex)
    var tabid = "";
    if (e.currentTarget.dataset.id) {
      tabid = e.currentTarget.dataset.id;
    } else {
      tabid = 0;
    }
    self.setData({
      TabCur: tabid,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })

    self.setData({
      activid2: e.currentTarget.dataset.activid
    })
    if (activindex == activeViewItem) {
      return false;
    }
    self.setData({
      activeViewItem: e.currentTarget.dataset.activindex
    })

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    if (activid == "品牌") {

      var aid = wx.getStorageSync("aid")
      api.http('store/getbrand', 'GET', {
        goodsclass: activid,
        aid: aid
      }, function(res) {
        wx.hideLoading();
        console.log(res)
        if (res.seller.length == 0) {
          self.setData({
            goodsclass2: 0,
            goodsclass3: 0,
            seller: 0,
            isHasShopData: true
          })
        } else {
          if (res.code == 1) {
            self.setData({
              goodsclass2: 0,
              goodsclass3: 0,
              seller: res.seller,
              isHasShopData: false
            })
          }
        }
      })
      return false;
    } else {
      api.http('store/getgoods', 'GET', {
        goodsclass: activid
      }, function(res) {

        wx.hideLoading();
        console.log(res.goodsclass2.length)
        if (res.goodsclass2.length == 0) {
          self.setData({
            isHasShopData: true,
            goodsclass3: 0,
            goodsclass2: 0,
            seller: 0
          })
          return false;
        } else {
          if (res.code == 1) {
            self.setData({
              seller: 0,
              goodsclass2: res.goodsclass2,
              goodsclass3: res.goodsclass2[0].goods,
              isHasShopData: false
            })
          }
        }

      })
    }
  },

  getshow: function() {
    var self = this;
    var classid = wx.getStorageSync("classid"); //取出是哪一个id
    var aid = wx.getStorageSync("aid"); //取出是哪一个id
    console.log(classid)
    api.http('store/storeindex', 'GET', {
      aid: aid
    }, function(res) {
    
      // if (res.goodsclass1.length == 0 || res.goodsclass2.length == 0){
      //   wx.hideLoading();
      //   self.setData({
      //     isHasShopData: false,
      //     goodsclass2: res.goodsclass2,
      //     goodsclass3: res.goodsclass2[0].goods,
      //     seller: 0
      //   })
      //   return false;
      // }
      console.log(res)
      var goodsid = res.goodsclass2[0].id
      self.setData({

        goodsid: goodsid
      })
      if (res.code == 1) {
        var activeViewItem = 0;
        if (classid) {

          activeViewItem = 10000;
          for (var i = 0; i < res.goodsclass1.length; i++) {

            if (classid == res.goodsclass1[i].id) {

              activeViewItem = i;
            }
          }

          let goodsclass1 = res.goodsclass1
          if (res.store.length == 0) {
            self.setData({
              goodsclass1: res.goodsclass1,
              activeViewItem: activeViewItem,
              storelist: res.store,
              isHasShopData: true
            })
          } else {
            self.setData({
              goodsclass1: res.goodsclass1,
              activeViewItem: activeViewItem,
              storelist: res.store

            })
          }

          // var activeViewItem = 0;
          // if (classid) {
          // for (var i = 0; i < goodsclass1.length; i++) {

          //   if (classid == goodsclass1[i].id) {
          //     console.log(i)
          //     activeViewItem = i;
          //   }
          // }
          //console.log(classid) //记录是哪一个id 
          // self.setData({
          //   activeViewItem: activeViewItem
          // })
          // } else {
          //   return false
          // }
          // if (activeViewItem == 10000) {
          //   var aid = wx.getStorageSync("aid")
          //   api.http('store/getbrand', 'GET', {
          //     goodsclass: "品牌",
          //     aid: aid
          //   }, function (res) {
          //     console.log(res)
          //     wx.hideLoading();
          //     if (res.code == 1) {
          //       self.setData({
          //         goodsclass2: 0,
          //         seller: res.seller
          //       })
          //     }
          //   })
          //   return false
          // }


          if (classid == 100000) {
            var aid = wx.getStorageSync("aid")
            api.http('store/getbrand', 'GET', {
              goodsclass: "品牌",
              aid: aid
            }, function(res) {

              wx.hideLoading();
              if (res.code == 1) {
                self.setData({
                  goodsclass2: 0,
                  goodsclass3: 0,

                  seller: res.seller
                })
              }
            })

            return false;
          }
          api.http('store/getgoods', 'GET', {
            goodsclass: classid
          }, function(res) {

            if (res.code == 1) {
              wx.hideLoading();
              if (res.goodsclass2.length == 0) {
                self.setData({
                  seller: 0,
                  goodsclass2: 0,
                  goodsclass3: 0,
                  isHasShopData: true,

                })
              } else {
                self.setData({
                  seller: 0,
                  goodsclass2: res.goodsclass2,
                  goodsclass3: res.goodsclass2[0].goods,
                  isHasShopData: false

                })
              }


            }

          })
          // wx.removeStorageSync("classid"); //移除哪一个id
        } else {
          wx.hideLoading();
          var aa = wx.getStorageSync("tabSelectid")

          // for (let i = 0; i < res.store.brand.length; i++) {
          //   console.log(res.store[i].brand.length)
          //   // if (store[i].brand.length){

          //   //  }
          // }
          self.setData({
            goodsclass1: res.goodsclass1,
            goodsclass2: res.goodsclass2,
            activeViewItem: "",
            goodsclass3: res.goodsclass2[0].goods,
            storelist: res.store,

            isHasShopData: false
          })
        }
      } else {
        wx.hideLoading();
        self.setData({
          isHasShopData: true
        })
      }
    })
  }


})