// pages/changePerInfor/changePerInfor.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isWhoComeOn: 0,
    name:"",
    identity:"",
    need:"",
    introduce:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    console.log(options.userid)
    var userid = options.userid;
    var isWhoComeOn = options.status;
    var infor = options.infor;
    console.log(isWhoComeOn)
    console.log(infor)
    var isWhoTextArr = ["姓名", "身份证号", "平台需求", "个人介绍"]
    var strText = isWhoTextArr[isWhoComeOn - 1];
    if (isWhoComeOn == 1)
    {
      self.setData({
        name: infor
      })
    }
    else if (isWhoComeOn == 2)
    {
      self.setData({
        need: infor
      })
    }
    else if (isWhoComeOn == 3) {
      self.setData({
        identity: infor
      })
    }
    else if (isWhoComeOn == 4) {
      self.setData({
        introduce: infor
      })
    }

    wx.setNavigationBarTitle({
      title: strText
    })
    self.setData({
      isWhoComeOn: isWhoComeOn,
      userid: userid
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
  // ===========6.0个人信息 - 修改姓名===========
  changeName: function (e) {
    var self = this;
    wx.showLoading({
      title: '修改中...',
      mask: true
    })
  
    var name = e.detail.value.name;
    if(name === "" || name == undefined)
    {
     api.showWarningText('请填写姓名!')

      return false;
    }

    var userid = self.data.userid;
  
    api.http('centre/name', 'GET', { userid: userid, name: name }
      , function (res) {
        wx.hideLoading();
      
        if (res.code == 1) {
          api.showSuccess(res.msg)
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        }
        else {
          api.showWarningText(res.msg)
        }



        console.log(res)
      })
  }
  //============ 6.0个人信息 - 修改姓名============

  ,
  // 修改需求
  changeNeed: function (e) {
    var self = this;
    wx.showLoading({
      title: '修改中...',
      mask: true
    })
    var need = e.detail.value.need;
    if (need == "" || !need) {
      api.showWarningText('请填写需求!')

      return false;
    }
    var userid = self.data.userid;
  
    api.http('centre/need', 'GET', { userid: userid, need: need }
      , function (res) {
        wx.hideLoading();
        
     

        if (res.code == 1) {
          api.showSuccess(res.msg)
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        }
        else {
          api.showWarningText(res.msg)
        }


        console.log(res)
      })
  }
  // 修改需求

  // 修改身份证号
  , changeIdeny: function (e) {
    var self = this;
    wx.showLoading({
      title: '修改中...',
      mask: true
    })
    var identity = e.detail.value.identity;
    if (identity == "" || !identity) {
      api.showWarningText('请填写身份证号!')

      return false;
    }
    var userid = self.data.userid;

    api.http('centre/identity', 'GET', { userid: userid, identity: identity }
      , function (res) {
        wx.hideLoading();
        if(res.code == 1)
        {
          api.showSuccess(res.msg)
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        }
        else
        {
          api.showWarningText(res.msg)
        }
      
        console.log(res)
      })
  }
  // 

  ,
  // 修改平台信息
  changeIntroduce: function (e) {
    var self = this;
    wx.showLoading({
      title: '修改中...',
      mask: true
    })
    var introduce = e.detail.value.introduce;
    if (introduce == "" || !introduce) {
      api.showWarningText('请填写需求!')

      return false;
    }
    var userid = self.data.userid;

    api.http('centre/getintroduce', 'GET', { userid: userid, introduce: introduce }
      , function (res) {
        wx.hideLoading();
       
 

        if (res.code == 1) {
          api.showSuccess(res.msg)
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        }
        else {
          api.showWarningText(res.msg)
        }



        console.log(res)
      })
  }
  // 修改平台信息
})