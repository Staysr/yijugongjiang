// pages/platRegulation/platRegulation.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityRule: "",
    isWhoCome: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    console.log(options)
    self.attention();
    var isWhoCome = options.status; //状态
    var titleArrs = ["平台规则", "平台协议", "服务介绍", "关注微信公众号"]
    var cityRules = ['<p style="color:red">你好我是平台规则</p>',
      '<p style="color:red">你好我是平台协议</p>',
      '<p style="color:red">你好我是服务介绍</p>',
      '<p style="color:red">你好我是关注微信公众号</p>'
    ]

    wx.setNavigationBarTitle({
      title: titleArrs[isWhoCome - 1]
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    var aid = wx.getStorageSync("aid")
    api.http('centre/rule', 'GET', {
      aid: aid
    }, function(res) {
      wx.hideLoading();
      console.log(res)
      if (res.code == 1) {

        self.setData({
          cityRule: isWhoCome == 1 ? res.rule : isWhoCome == 2 ? res.agreement : isWhoCome == 3 ? res.introduce : res.attention,
          isWhoCome: isWhoCome
        })
        var cityRule = isWhoCome == 1 ? res.rule : isWhoCome == 2 ? res.agreement : isWhoCome == 3 ? res.introduce : res.attention
        WxParse.wxParse('article', 'html', cityRule, self, 0);
      } else {

        api.showWarning(res.msg)

      }
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
  attention:function(){
var that  = this;
    var aid = wx.getStorageSync("aid")
    api.http('json/attention', 'GET', {
      aid: aid
    }, function (res) {
      wx.hideLoading();
      console.log(res)
      that.setData({
        wx_code:res.wx_code,

      })

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})