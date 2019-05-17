// pages/personalCenter/personalCenter.js
const app = getApp()
const api = require('../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isloginStatus: 2 //1登录  2 未登录 
      ,
    isVip: 2 //1工人  2 普通用户 
      ,
    isFristOnload: true,
    image: app.globalData.imagesUrl,
    register: [{
        type: 1,
        name: "装修公司"
      },
      {
        type: 2,
        name: "设计师"
      },
      {
        type: 3,
        name: "工长"
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.setData({
      modalName: null
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
    var self = this;
    self.onLoad()
    self.getUserInfoMation(); //获取用户信息
    // wx.pageScrollTo({
    //   scrollTop: 0,
    //   duration: 0
    // })
    var aid = wx.getStorageSync("aid")
    var userid = wx.getStorageSync("userid")
    api.http('centre/centre', 'GET', {
      userid: userid,
      aid: aid
    }, function(res) {
      console.log(res)
      // if(res.code == 0){
      //   api.showWarningText('用户不存在!')
      //   return false
      // }
      self.setData({
        status: res.status,
        clubid: res.user.clubid
      })
    })
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
    var self = this;
    wx.showLoading({
      title: '刷新信息...',
      mask: true
    })
    self.getUserInfoMation(); //获取用户信息
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

  },
  //退出登录
  exitLogon: function() {

      var self = this;

      var userInfomation = self.data.userInfomation;
      userInfomation.workclass = 0

      api.showSuccess('退出成功');


      self.setData({
        isloginStatus: 2,
        isVip: 2,
        status: 1,
        userInfomation: userInfomation
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })

      wx.removeStorageSync("isloginStatus");
      wx.removeStorageSync("userid");
      wx.removeStorageSync("userInfomation");
      wx.removeStorageSync("captcha");
      wx.removeStorageSync('isPhone')
      wx.removeStorageSync('userInfostatus')
      wx.removeStorageSync('tabSelectid')



    }
    //  退出登录
    ,
  getUserInfoMation: function() {
    var self = this;
    var isloginStatus = wx.getStorageSync("isloginStatus");
    isloginStatus = isloginStatus == "isloginStatus" ? "1" : "2"
    console.log(isloginStatus)
    self.setData({
      isloginStatus: isloginStatus
    })
    if (isloginStatus == 2) {
      self.setData({
        isloginStatus: 2
      })
      wx.hideLoading();
      wx.stopPullDownRefresh();
      return false;
    }
    var userid = wx.getStorageSync("userid");
    var aid = wx.getStorageSync("aid");
    api.http('centre/centre', 'GET', {
      userid: userid,
      aid: aid
    }, function(res) {

      if (res.user) {
        var userInfomation = JSON.stringify(res.user);
        wx.setStorageSync("userInfomation", userInfomation)
        console.log(res)
        wx.hideLoading()
        wx.stopPullDownRefresh();
        self.setData({
          userInfomation: res.user
        })
      } else {
        wx.removeStorageSync("isloginStatus");
        wx.removeStorageSync("userid");
        wx.removeStorageSync("userInfomation");
        wx.removeStorageSync("captcha");
        self.setData({
          isloginStatus: 2,
          isVip: 2,
          userInfomation: ""
        })
      }

    })
  },
  showModal(e) {
    this.setData({
      modalName: "RadioModal"
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  wx_applyregister: function() {
    var that = this;
    var userid = wx.getStorageSync("userid");
    api.http('json/schedule', 'GET', {
      uid: userid
    }, function(res) {
      console.log(res)
      if (res.code == 2) {
        //2: 还未申请
        that.showModal();
      } else {
        wx.navigateTo({
          url: '../registerWorker/registerWorker'
        })
      }
    })
  },
  bliub: function() {
    var that = this;
    var userid = wx.getStorageSync("userid");
    var aid = wx.getStorageSync("aid");
    var isloginStatus = wx.getStorageSync("isloginStatus")
    if (isloginStatus == "" && isloginStatus == undefined) {
      wx.navigateTo({
        url: '../registrationPage/registrationPage',
      })
    }
    api.http('json/myClub', 'GET', {
      uid: userid,
      aid: aid
    }, function(res) {
      console.log(res)
      var namec = res.name
      var clubid = res.clubid
      if (res.status == 0) {
        api.showSuccess(res.msg)
      } else if (res.status == 1) {
        wx.showLoading({
          title: '加载数据中...',
          mask: true
        })
        api.http('json/companyEdit', 'GET', {
          id: clubid
        }, function(res) {
          console.log(res)
          wx.hideLoading();
          var type = wx.getStorageSync("type_code")
          wx.setStorageSync("onpageid", "俱乐部进来的")
          wx.navigateTo({
            url: '../wx_decorationcompany/wx_decorationcompany?id=' + clubid + '&type=' + type + "&dataid=" + res.id + "&name=" + res.company.cname,
          })
        })
      } else if (res.status == 2) {
        //设计师 
        wx.setStorageSync("workerid", clubid)
        wx.navigateTo({
          url: '../personnel/personnel?id=' + clubid + '&type=' + 2 + "&name=" + namec,
        })

      } else if (res.status == 3) {
        wx.setStorageSync("workerid", clubid)
        wx.navigateTo({
          url: '../personnel/personnel?id=' + clubid + '&type=' + 3 + "&name=" + namec,
        })
        //工长
      } else if (res.status == 4) {
        //工人
        wx.navigateTo({
          url: '../clubdetails/clubdetails?id=' + clubid + "&name=" + namec,
        })
      }
    })
  },
  wx_apply: function(e) {
    console.log(e)
    var type = e.target.dataset.type;
    wx.navigateTo({
      url: '../registerWorker/registerWorker?type=' + type,
    })
  }
})