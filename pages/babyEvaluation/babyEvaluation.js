// pages/babyEvaluation/babyEvaluation.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoadding: false,
    isHasShop: false,
    isHasMoredata: false,
    page:1,
    image: app.globalData.imagesUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
   


    var self =this;
    var goodsid = options.goodsid;
    self.setData({
      goodsid: goodsid
    })
     
 
    api.http('fastorder/evaluate', 'GET', { goodsid: goodsid}
   
      , function (res) {
        console.log(res)
        wx.hideLoading();

        if (res.code == 1) {

         if(res.evaluate.length==0)
         {
           self.setData({
             evaluate: res.evaluate,
             isLoadding:false,
             isHasShop:true,
             isHasMoredata:false
           })
         }
         else if(res.evaluate.length<10)
         {
           self.setData({
             evaluate: res.evaluate,
             isLoadding: false,
             isHasShop: false,
             isHasMoredata: true
           })
         }
         else if (res.evaluate.length ==10) {
           self.setData({
             evaluate: res.evaluate,
             isLoadding: true,
             isHasShop: false,
             isHasMoredata: false
           })
         }

         
          

        }


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
    
    console.log('我刷新了');
    var self =this;
    var page = self.data.page;
    var goodsid = self.data.goodsid;
  page++;
    var evaluate = self.data.evaluate;
    api.http('fastorder/evaluate', 'GET', { goodsid: goodsid,page:page }

      , function (res) {
        console.log(res)
        wx.hideLoading();
        if (res.code == 1) {
          var evaluateNew = evaluate.concat(res.evaluate);
         
          if (res.evaluate.length < 10) {
            self.setData({
              evaluate: evaluateNew,
              isLoadding: false,
              isHasShop: false,
              isHasMoredata: true,
              page: page
            })
          }
          else if (res.evaluate.length == 10) {
            self.setData({
              evaluate: evaluateNew,
              isLoadding: true,
              isHasShop: false,
              isHasMoredata: false,
              page: page
            })
          }
        }
      })



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }

  , bindImgbox:function(e){
    // console.log(img)
    console.log(e)
    var imgbox = e.currentTarget.dataset.imgbox;
    var imgitem = e.currentTarget.dataset.imgitem;
    console.log(imgbox)
    console.log(imgitem)
    wx.previewImage({
      current: imgitem,
      urls: imgbox,//内部的地址为绝对路径
      fail: function () {
        console.log('fail')
      },
      complete: function () {
        console.info("点击图片了");
      },
    })

  }
})