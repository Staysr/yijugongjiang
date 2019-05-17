// pages/wx_decorationcompany/wx_decorationcompany.js
const app = getApp();
const api = require('../../utils/http.js');
const util = require('../../utils/utils.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    TabCur1: 0,
    scrollLeft: 0,
    page: 1,
    comment: 5,
    max: 50,
    image: app.globalData.imagesUrl,
    wx_type: [{
      id: 0,
      name: "案例",
    },
    {
      id: 1,
      name: "设计师",

    },
    {
      id: 2,
      name: "工长",
    }
    ],
    VerticalNavTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var onpageid = wx.getStorageSync("onpageid")
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.name //页面标题为路由参数
    })
    
    if (options.scene) {
      let scene = decodeURIComponent(options.scene)
      var ss = scene.split("_");
      wx.setNavigationBarTitle({
        title: ss[3]//页面标题为路由参数
      })
      api.http('json/caseclass_info', 'GET', {
        id: ss[0],
        classid: ss[1],
        type: 1
      }, function (res) {
        console.log(res)
        that.setData({
          caseab: res.case
        })

      })
  
      return false
    }

    if (onpageid == "俱乐部进来的") {
      wx.setStorageSync("options", options.id)
      wx.setStorageSync("optionscode", options.id)
      var that = this;
      that.indexboor(options);
      that.comment(options);
      var that = this;
      var id = wx.getStorageSync("optionscode") //装修公司id
      //var classid = e.currentTarget.dataset.classid//分类id
      var type = wx.getStorageSync("type_code") //装修公司id
      api.http('json/caseclass_info', 'GET', {
        id: id,
        classid: options.dataid,
        type: 1
      }, function (res) {
        wx.removeStorageSync("onpageid")
        console.log(res)
        that.setData({
          caseab: res.case
        })

      })
    } else {
      wx.setStorageSync("type_code", options.type)
      wx.setStorageSync("options", options.id)
      wx.setStorageSync("optionscode", options.id)
      var that = this;
      that.indexboor(options);
      that.comment(options);
      var that = this;
      var id = wx.getStorageSync("optionscode") //装修公司id
      //var classid = e.currentTarget.dataset.classid//分类id
      var type = wx.getStorageSync("type_code") //装修公司id
      api.http('json/caseclass_info', 'GET', {
        id: id,
        classid: options.dataid,
        type: 1
      }, function (res) {
        console.log(res)
        that.setData({
          caseab: res.case
        })

      })
    }
    if (options.info == "123456") {
      console.log("我是分享进来的")
     
      console.log(userid)
      wx.setStorageSync("pid", options.pid)
    }
  },

  tabSelect(e) {
    console.log(e)
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50,
      tabcurid: e.currentTarget.dataset.tabcurid
    })

  },
  tabSelect1(e) {
    console.log(e)
    this.setData({
      TabCur1: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
    var that = this;
    that.class_data(e)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //分类详情
  class_data: function (e) {
    var that = this;
    var id = wx.getStorageSync("optionscode") //装修公司id
    var classid = e.currentTarget.dataset.classid //分类id
    var type = wx.getStorageSync("type_code") //装修公司id
    api.http('json/caseclass_info', 'GET', {
      id: id,
      classid: classid,
      type: 1
    }, function (res) {
      console.log(res)
      that.setData({
        caseab: res.case
      })


    })

  },
  backHome: function () {

    wx.switchTab({
      url: '../index/index',
    })

  },
  //首页的轮播图
  indexboor: function (options) {
    var that = this;
    that.onShow(options);
    api.http('json/companyEdit', 'GET', {
      id: options.id
    }, function (res) {
      console.log(res)
      let casea = res.case;
      var arr = [];
      for (let i = 0; i < casea.length; i++) {
        for (let g = 0; g < casea[i].case.length; g++) {
          arr.push({
            id: casea[i].case[g].id,
            pic: casea[i].case[g].pic,
            title: casea[i].case[g].title
          })
          that.setData({
            //caseab: arr
          })
          console.log(arr)
        }

      }

      that.setData({
        banner: res.banner,
        case: res.case,
        stylist: res.stylist,
        worker: res.worker,
        phone: res.phone,
        company: res.company
      })
      WxParse.wxParse('article', 'html', res.company.wb_company, that, 5);
    })
  },
  infotitle: function (e) {
    var id = e.currentTarget.dataset.id;
		var title = e.currentTarget.dataset.name;
     console.log(e)
    wx.navigateTo({
			url: '../infotitle/infotitle?id=' + id + '&name='+title,
    })
  },
  seeimages: function (e) {
    var image = e.currentTarget.dataset.image
    wx.previewImage({
      current: image, // 当前显示图片的http链接
      urls: [image] // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
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
              console.log("授权成功");
              var imgUrl = e.currentTarget.dataset.image;
              wx.downloadFile({ //下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
                url: imgUrl,
                success: function (res) {
                  // 下载成功后再保存到本地
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath, //返回的临时文件路径，下载后的文件会存储到一个临时文件
                    success: function (res) {
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
  // 分享
 
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
  
    var demand = "123456"
    var userid = wx.getStorageSync("userid")
    return {
      title: "分享",
      path: '/pages/wx_decorationcompany/wx_decorationcompany',
    }

   
  },
  // 客服
  phone: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone // 仅为示例，并非真实的电话号码
    })
  },
  //我要装修
  myiszhuangxiou: function (e) {
    var options = wx.getStorageSync("options")
    wx.navigateTo({
      url: '../myiszhuangxiou/myiszhuangxiou?options=' + options
    })
  },
  // 评价
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
  pingjia: function (e) {
    console.log(e)
    var that = this;
    var isloginStatus = wx.getStorageSync("isloginStatus")
    if (isloginStatus == "" || isloginStatus == undefined) {
      wx.navigateTo({
        url: '../registrationPage/registrationPage',
      })
      return false;
    }
    var id = wx.getStorageSync("options")
    var uid = wx.getStorageSync("userid")
    if (e.currentTarget.dataset.pingjia == undefined || e.currentTarget.dataset.pingjia=='') {
      api.showWarningText('评论不能为空!')
      return false
    }
    api.http('json/addcomment', 'GET', {
      id: id,
      uid: uid,
      content: e.currentTarget.dataset.pingjia
    }, function (res) {
      console.log(res)
      if (res.code == 1) {
        that.setData({
          //comment: arr,
          searchinput: "",
          wx_ooloer: 0,
          pingjia:""
        })
        wx.showToast({

          title: '评价成功',

          icon: 'success',

          duration: 2000
        })
      }
      that.comment();

    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  //跳转,到详情
  personnel: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    wx.setStorageSync("workerid", id)
    if (e.currentTarget.dataset.codeid == 2) {
      wx.setStorageSync("type", 2)
      wx.navigateTo({
        url: '../personnel/personnel?id=' + id + '&type=' + 2 + "&name=" + name,
      })
    } else {
      wx.setStorageSync("type", 3)
      wx.navigateTo({
        url: '../personnel/personnel?id=' + id + '&type=' + 3 + "&name=" + name,
      })
    }
  },
  comment: function () {
    var that = this;
    var id = wx.getStorageSync("options")
    api.http('json/comment', 'GET', {
      id: id
    }, function (res) {
      console.log(res)
      that.setData({
        comment: res.comment,
      })
    })
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
  onReach: function () {
    var self = this;
    var id = wx.getStorageSync("options")
    var page = self.data.page;
    let comment = this.data.comment
    console.log('第一层', this.data.comment)
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
  onShareAppMessage() {
   


  },

})