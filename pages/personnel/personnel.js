// pages/personnel/personnel.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    case_id: 1,
    currentTab: 0, //预设当前项的值
    scrollLeft: 0,
    x_currentTab: 0,
    max: 50,
    page: 1,
    image: app.globalData.imagesUrl,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var type = wx.getStorageSync("type")
    var self = this;
    if (options.type == 2) {
      wx.setNavigationBarTitle({
        title: options.name + "设计师详情"//页面标题为路由参数
      })
      self.setData({
        gong: "我要找设计师"

      })
    } else {
      wx.setNavigationBarTitle({
        title: options.name + "工长详情"//页面标题为路由参数
      })
      self.setData({
        gong: "我要找工长"

      })
    }
    if (options.scene) {
      let scene = decodeURIComponent(options.scene)
      var ss = scene.split("_");
      wx.setStorageSync("workerid", ss[0])
      if (ss[1] == 2) {
        wx.setNavigationBarTitle({
          title: ss[2] + "设计师详情"//页面标题为路由参数
        })
        self.setData({
          gong: "我要找设计师"

        })
      } else {
        wx.setNavigationBarTitle({
          title: ss[2] + "工长详情"//页面标题为路由参数
        })
        self.setData({
          gong: "我要找工长"

        })
      }
      api.http('json/workerEdit', 'GET', {
        id: ss[0]
      }, function (res) {
        console.log(res)
        let casea = res.case;
        var xiaoqu = res.xiaoqu;
        var arr = [];
        for (let i = 0; i < casea.length; i++) {
          for (let g = 0; g < casea[i].case.length; g++) {
            arr.push({
              id: casea[i].case[g].id,
              pic: casea[i].case[g].pic,
              title: casea[i].case[g].title
            })
            self.setData({
              caseab: arr
            })
            console.log(arr)
          }

        }
        var slist = [];
        var wlist = [];
        for (var k = 0; k < xiaoqu.length; k++) {
          if (xiaoqu[k].type == "1") {
            slist.push(xiaoqu[k]);
          } else if (xiaoqu[k].type == "2") {
            wlist.push(xiaoqu[k]);
          }
        }
        console.log(res.honor)
        self.setData({
          type: type,
          phone: res.phone,
          info: res.info,
          wcase: res.case,
          slist: slist,
          wlist: wlist,
          xiaoqu: res.xiaoqu,
          honor: res.honor

        })

        self.comment()

      })
    
      return false
    }

    var id = wx.getStorageSync("workerid")
    wx.setStorageSync("options", options.id)

    api.http('json/workerEdit', 'GET', {
      id: id
    }, function (res) {
      console.log(res)
      let casea = res.case;
      var xiaoqu = res.xiaoqu;
      var arr = [];
      for (let i = 0; i < casea.length; i++) {
        for (let g = 0; g < casea[i].case.length; g++) {
          arr.push({
            id: casea[i].case[g].id,
            pic: casea[i].case[g].pic,
            title: casea[i].case[g].title
          })
          self.setData({
            caseab: arr
          })
          console.log(arr)
        }

      }
      var slist = [];
      var wlist = [];
      for (var k = 0; k < xiaoqu.length; k++) {
        if (xiaoqu[k].type == "1") {
          slist.push(xiaoqu[k]);
        } else if (xiaoqu[k].type == "2") {
          wlist.push(xiaoqu[k]);
        }
      }
      console.log(res.honor)
      self.setData({
        type: type,
        phone: res.phone,
        info: res.info,
        wcase: res.case,
        slist: slist,
        wlist: wlist,
        xiaoqu: res.xiaoqu,
        honor: res.honor

      })

      self.comment()

    })

  },
  //点击开始的时间  
  timestart: function (e) {
    var _this = this;
    _this.setData({
      timestart: e.timeStamp
    });
  },
  //点击结束的时间
  timeend: function (e) {
    var _this = this;
    _this.setData({
      timeend: e.timeStamp
    });
  },
  //长按保存
  saveImg: function (e) {
    var _this = this;
    var times = _this.data.timeend - _this.data.timestart;
    if (times > 300) {
      console.log("长按");
      wx.getSetting({
        success: function (res) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function (res) {
              wx.showLoading({
                title: '保存中...',
                mask: true
              })
              console.log("授权成功");
              var imgUrl = e.currentTarget.dataset.image;
              wx.downloadFile({ //下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
                url: imgUrl,
                success: function (res) {
                  // 下载成功后再保存到本地
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath, //返回的临时文件路径，下载后的文件会存储到一个临时文件
                    success: function (res) {
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
  backHome: function () {

    wx.switchTab({
      url: '../index/index',
    })

  },
  // 分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function (res) {
        var userid = wx.getStorageSync("userid")
        wx.setStorageSync("pid", userid)
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  swichNav: function (e) {
    console.log(e);
    var self = this;
    var current = e.currentTarget.dataset.current;
    var stype = e.currentTarget.dataset.type;
    console.log(stype)
    if (stype == "case") {
      self.setData({
        currentTab: current
      })
    } else if (stype == "xiaoqu") {
      self.setData({
        x_currentTab: current
      })
    }

  },
  getInput: function (e) { //方法1
    var pingjia = e.detail.value;
    var that = this;
    var length = parseInt(pingjia.length);
    if (length > this.data.max) return;
    that.setData({
      pingjia: pingjia,
      wx_ooloer: length
    })
  },
  calling: function (e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  infotitle: function (e) {
    var id = e.currentTarget.dataset.id;
		var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../infotitle/infotitle?id=' + id + '&name='+name,
    })
  },
  seeimages: function (e) {
    console.log(e)
    var image = e.currentTarget.dataset.image
    var content = e.currentTarget.dataset.content
    wx.setStorageSync("contentdata", content)
    wx.navigateTo({
      url: "../personnedata/personnedata?title=" + image
    })

  },
  // 我要找设计师
  shejis: function () {
    var type = wx.getStorageSync("type")
    if (type == 2) {
      wx.navigateTo({
        url: "../myiszhuangxiou/myiszhuangxiou?options=" + "设计师"
      })
      return false;
    } else {
      wx.navigateTo({
        url: "../myiszhuangxiou/myiszhuangxiou?options=" + "工长"
      })
    }
  },
  comment: function () {
    var that = this;
    var id = wx.getStorageSync("workerid");
    console.log(id)
    api.http('json/comment', 'GET', {
      id: id
    }, function (res) {
      console.log(res)
      that.setData({
        comment: res.comment,
      })
      //that.onReachBottom(id);
    })
  },
  pingjia: function (e) {
    var self = this;
    var id = wx.getStorageSync("workerid")
    var uid = wx.getStorageSync("userid")
    if (e.currentTarget.dataset.pingjia == undefined || e.currentTarget.dataset.pingjia == "") {
      api.showWarningText('评论不能为空!')
      return false
    }
    api.http('json/addcomment', 'GET', {
      id: id,
      uid: uid,
      content: e.currentTarget.dataset.pingjia
    }, function (res) {
      // var arr = [];
      // var name = wx.getStorageSync("userInfomation")
      // var userInfomation = JSON.parse(name);
      // var timestamp = util.formatData2(new Date());
      // console.log(timestamp)
      // console.log(name)
      // arr.push({
      //   content: e.currentTarget.dataset.pingjia,
      //   name: userInfomation.name,
      //   head: userInfomation.pic,
      //   add_time: timestamp
      // })
      self.setData({
        //comment: arr,
        searchinput: "",
        wx_ooloer: 0,
        pingjia:""
      })
      console.log(res)
      if (res.code == 1) {
        wx.showToast({

          title: '评价成功',

          icon: 'success',

          duration: 2000
        })
        self.comment();

      }

    })
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
    var id = wx.getStorageSync("workerid");
    var page = self.data.page;
    let comment = self.data.comment
    console.log('第一层', self.data.comment)
    page++;
    api.http('json/comment', 'GET', {
      id: id,
      page: page
    }, function (res) {
      if (res.code == 1) {
        if (res.comment.length == 0) {
          self.setData({
            isLoadding: false,
            isHasData: true
          })
          return false;
        }
        else {
          console.log('第二层', res.comment)
          var isLoadding = res.comment.length >= 1 ? true : false;
          let arr = res.comment
          arr.map((val, index, arr) => {
            comment.push(val)
          })
          console.log('第三层', comment)
          // var comment = that.data.moment;
          self.setData({
            comment: comment,
            isLoadding: isLoadding,
            isHasData: false,
            page: page
          })
          console.log('第四层', self.data.comment)


        }

      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})