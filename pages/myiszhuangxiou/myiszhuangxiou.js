// pages/myiszhuangxiou/myiszhuangxiou.js
const app = getApp();
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.options == "设计师") {
      wx.setNavigationBarTitle({
        title: "我要找设计师" //页面标题为路由参数
      })
    } else if (options.options == "工长") {
      wx.setNavigationBarTitle({
        title: "我要找工长" //页面标题为路由参数
      })
    } else {
      wx.setNavigationBarTitle({
        title: "我要装修" //页面标题为路由参数
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 提交
  formSubmit: function(e) {
    var exit = e.detail.value.exit // 地址
    var name = e.detail.value.name //名字
    var phone = e.detail.value.phone //手机号
    var xuqiou = e.detail.value.xuqiou //需求
   
    if (name == "") {
      api.showWarning('名字不能为空');
      return false;
    }
    if (phone == "") {
      api.showWarning('手机号不能为空');
      return false;
    }
    if (exit == "") {
      api.showWarning('地址不能为空');
      return false;
    }
    if (xuqiou == "") {
      api.showWarning('需求不能为空');
      return false;
    }
    var aid = wx.getStorageSync("aid")
    var userid = wx.getStorageSync("userid")
    var options = wx.getStorageSync("options")
    if (options != "") {
      api.http('json/service', 'GET', {
        uid: userid,
        aid: aid,
        id: options,
        need: xuqiou,
        name: name,
        phone: phone,
        address: exit
      }, function(res) {
        console.log(res)
        api.showWarning(res.msg);
        if (res.code == 1) {
          wx.showToast({

            title: '申请成功',

            icon: 'success',

            duration: 2000
          })
          // wx.removeStorageSync("options"); //移除哪一个id
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 2000) //延迟时间 这里是1秒
        }
      })
    }
    if (options == "") {
      var workerid = wx.getStorageSync("workerid")
      api.http('json/service', 'GET', {
        uid: userid,
        aid: aid,
        id: workerid,
        need: xuqiou,
        name: name,
        phone: phone,
        address: exit
      }, function(res) {
        console.log(res)
        api.showWarning(res.msg);
        if (res.code == 1) {
          wx.showToast({

            title: '申请成功',

            icon: 'success',

            duration: 2000
          })
          // wx.removeStorageSync("options"); //移除哪一个id
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 2000) //延迟时间 这里是1秒
        }
      })
    }
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