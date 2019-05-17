// pages/publicationEvaluation/publicationEvaluation.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userComStat: 5, // 1:一份
    startComsText: "非常好",
    userUploadsImg: [""],
    image: app.globalData.imagesUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    var self = this;
    var shopinfo = options.shopinfo;
    shopinfo = JSON.parse(shopinfo)
    console.log(shopinfo)
    self.setData({
      shopinfo: shopinfo
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

  },
  userComStart: function(e) {
    var self = this;
    var comTextArr = ["非常差", "差", "一般", "好", "非常好"];

    self.setData({
      userComStat: e.currentTarget.dataset.starindex,
      startComsText: comTextArr[e.currentTarget.dataset.starindex - 1]
    })

    console.log(e.currentTarget.dataset.starindex)
  },
  addUserImg: function(e) {
      var self = this;
      var isindex = e.currentTarget.dataset.isindex; //是否修改
      var userUploadsImg = self.data.userUploadsImg;



      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
          // console.log(tempFilePaths)

          if (isindex < userUploadsImg.length - 1) {
            console.log('修改')
            userUploadsImg[isindex] = res.tempFilePaths
            self.setData({
              userUploadsImg: userUploadsImg
            })
          } else {
            console.log('新增')
            userUploadsImg.pop();
            userUploadsImg.push(res.tempFilePaths)
            userUploadsImg.push("")
            console.log(userUploadsImg)
            self.setData({
              userUploadsImg: userUploadsImg
            })
          }



        }
      })


    }

    ,
  removeUpload: function(e) {
    var self = this;
    var userUploadsImg = self.data.userUploadsImg;

    userUploadsImg.splice(e.currentTarget.dataset.activeindex, 1);

    self.setData({
      userUploadsImg: userUploadsImg
    })
    console.log('删除某一个')
  },
  tijiaoBtn: function() {
    var self = this;
    console.log('提交')
    var userid = wx.getStorageSync("userid")
    var state = self.data.userComStat; //多好评分
    var content = self.data.content; //评价内容
    var shopinfo = self.data.shopinfo; //商品信息
    var userUploadsImg = self.data.userUploadsImg; //商品图片
    var goodsid = shopinfo.goodsid; //商品id
    var specname = shopinfo.specname; //规格名称
    var orderid = shopinfo.orderid; //订单id
    var baseUrl = app.globalData.staticUrl; //基本url
    console.log("评分:" + state)
    console.log("内容:" + content)
    console.log("userid:" + userid)
    console.log("商品id:" + goodsid)
    console.log("订单id:" + orderid)
    console.log("规格名称:" + specname)
    console.log(userUploadsImg)
    if (content == "" || content.length<5 )
    {
      api.showWarningText('评价内容长度不够!')
      return false;
    }
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    api.http('centre/evaluate', 'GET', {
      userid: userid,
      state: state,
      content: content,
      goodsid: goodsid,
      specsname: specname,
      orderid: orderid
    }, function(res) {
      wx.hideLoading();
      if(res.code == 1)
      {
        upLoadImg(0,res.evaid)
      }
      else
      {
        api.showWarningText(res.msg)
      }
      console.log(res)
    })


    return false;


    function upLoadImg(i, evaid) {
      var evaid = evaid;
      var secondbaseUrl = baseUrl + "centre/evapic"
      if (!userUploadsImg[i][0]) {
        wx.hideLoading();
        api.showSuccess('提交成功')
        setTimeout(function(){
          wx.navigateBack({
            delta:"2"
          })
        },200)
        return false;
      }
      wx.uploadFile({
        url: secondbaseUrl, //仅为示例，非真实的接口地址
        filePath: userUploadsImg[i][0],
        name: 'pic',
        header: {
          "content-type": "multipart/form-data"
        }, formData: {
          'evaid': evaid
        },
        success: function(res) {
          i++
          console.log(res)
          return upLoadImg(i,evaid)
        }
      })
    }







  },
  inputText: function(e) {
    console.log(e.detail.value)
    var self = this;
    var content = e.detail.value;
    self.setData({
      content: content
    })
  }
})