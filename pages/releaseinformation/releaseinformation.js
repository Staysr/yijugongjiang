// pages/releaseinformation/releaseinformation.js
const app = getApp()
const api = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    image: app.globalData.imagesUrl,
    pindex: 0,
    arr_mac: 0,
    length: 0,
    isdisplay: false,
    //picker: ['喵喵喵', '汪汪汪', '哼唧哼唧', "321321321321312312321"],
    editdetails: "",
    verifyCodeTime: '获取验证码',
    list: [
      {
        text: '',
        imglist: '',
      }
    ],
    wx_phone: '',
    showMask: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var aid = wx.getStorageSync("aid")

    var phone = wx.getStorageSync("userInfomation")

    var pares = JSON.parse(phone)
    console.log(pares.phone)
    self.setData({
      phone: pares.phone
    })
    api.http('centre/worker', 'GET',
      {}
      , function (res) {
        console.log(res)
        self.setData({
          picker: res.worker
        })
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  PickerChange(e) {
    console.log(e);
    this.setData({
      pindex: e.detail.value
    })
  },

  //图片
  chooseImg: function (e) {
    let that = this
    wx.setStorageSync("imglistdata", 0)
    let index = e.currentTarget.dataset.index
    let list = that.data.list;
    console.log(index)

    wx.chooseImage({
      count: 1,
      success(res) {
        const tempFilePaths = res.tempFilePaths
        console.log(res.tempFilePaths)
        list[index].imglist = res.tempFilePaths;
        that.setData({
          list: list,
          tempFilePaths: res.tempFilePaths,
          //imgUrl: res.tempFilePaths
        })
      }
    })

  },
  // 动态添加
  arr_mac_list: function (e) {
    var self = this;
    let list = this.data.list
    var flag = true;
    for (var i = 0; i < list.length; i++) {
      if (list[i].text != '' && list[i].imglist != '') {

        flag = flag && false;
      } else {
        flag = true;

      }
    }

    if (flag == false) {
      var arr_mac = e.currentTarget.dataset.arr_mac
      self.setData({
        arr_mac: arr_mac + 1,
        editdetails:''
      })

      list.push(
        {
          text: '',
          imglist: ''
        }
      )
      this.setData({
        list: list
      })
    } else {
      api.showWarningText('服务详情与图片不能为空');
    }

    console.log(list)
  },
  showTap: function (e) {
    var self = this;
    let list = self.data.list;
    let index = e.currentTarget.dataset.index
    this.setData({
      showMask: false,
      index: index,
      modalName: e.currentTarget.dataset.target
    })
    for (var i = 0; i < list.length; i++) {
      if (i == index) {
        console.log(list[index].text)
        self.setData({
          showtext: list[index].text
        })
      }
    }


  },
  xxxx:function(){
    var self = this;
    wx.showModal({
      title: "提示消息",
      content: "!确认取消编辑的所有内容",
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          let list1 = [
            {
              text: ""
            }
          ]
          self.setData({
            editdetails: "",
            list: list1
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  // closeTap: function () {
  //   var that = this;
  //   that.setData({
  //     showMask: true
  //   })
  // },
  // 编辑服务详情
  showModal: function (e) {
    var self = this;
    let list = self.data.list;
    let index = e.currentTarget.dataset.index
    console.log(index)
    for (var i = 0; i < list.length; i++) {
      if (i == index) {
        console.log(list[i].text)
        self.setData({
          editdetails: list[i].text
        })
      }
    }
    this.setData({
      dindex: index,
      modalName: e.currentTarget.dataset.target
    })
  },
  //取消模态框
  hideModal(e) {
    var self = this;
    let list = self.data.list;
    var index = e.currentTarget.dataset.index;
    console.log(e)
    this.setData({
      showMask: true,
      list: list
    })
  },
  //设置显示编辑字数
  bindTextAreaBlur: function (e) {
    var self = this;
    let length_h = e.detail.value.length;

    let list = self.data.list;
    console.log(length_h)
    let index = e.currentTarget.dataset.index//this.data.index
    let text = 'list[' + index + '].text'
    list[index].text = e.detail.value;

    if (length_h >= 12) {
      //showModal
      var t_time = e.detail.value.substring(0, 7);
      self.setData({
        showtext: t_time + "....",
        //[text]: t_time + "....",
        concent: e.detail.value,
        list: list
      })
    } else {
      self.setData({
        showtext: e.detail.value,
        //[text]: e.detail.value,
        concent: e.detail.value,
        //editdetails: e.detail.value,
      })
      //this.hideModal();
    }
  },
  // 取消
  hideModalon:function(){
    this.setData({ 
      editdetails: "",
      showMask: true,
      editdetails:'',
    })
    let e = {
      currentTarget: {
        dataset: {
          indexid: true
        }
      }
    }
    this.hideModal(e);
  },
  fabiao: function (e) {
    console.log(e)
    var self = this;
    var userid = wx.getStorageSync("userid");
    var name = e.detail.value.name;
    var phone = e.detail.value.phone;
    var captcha = e.detail.value.captcha;
    var clubid = e.detail.value.clubid;
    var workyear = e.detail.value.workyear;
    var price_range = e.detail.value.price_range;
    var baseUrl = app.globalData.staticUrl//获得基本url
    var tempFilePaths = self.data.tempFilePaths;
    var list = self.data.list
    var imgurl = [];
    var text = [];
    console.log(list)
    if (name == "" || !name) {
      api.showWarningText('姓名不能为空!')
      return false;
    }
    if (phone == "" || !phone) {
      api.showWarningText('手机号不能为空!')
      return false;
    }
    if (captcha == "" || !captcha) {
      api.showWarningText('验证码不能为空!')
      return false;
    }
    var captchas = wx.getStorageSync("captcha");
    if (captchas != captcha) {
      api.showWarningText('验证码错误!')
      return false;
    }
    if (clubid == "" || !clubid) {
      api.showWarningText('选择工种不能为空!')
      return false;
    }
    if (workyear == "" || !workyear) {
      api.showWarningText('从业年限不能为空!')
      return false;
    }
    if (price_range == "" || !price_range) {
      api.showWarningText('价格区间不能为空!')
      return false;
    }
    for (var i = 0; i < list.length; i++) {
  
      if (list[i].imglist[0] && list[i].text) {
        imgurl.push(list[i].imglist[0]);
        text.push(list[i].text);
      } else {
        wx.showLoading({
          title: '详情图片不能为空',
          duration: 1000
        })

      }
    }

    console.log(imgurl);
    console.log(list)


    var aid = wx.getStorageSync("aid")
    api.http('json/addmessage', 'POST', {
      uid: userid,
      cname: name,
      clubid: clubid,
      workyear: workyear,
      price_range: price_range,
      phone: phone,
      captcha: captcha
    }, function (res) {
      console.log(res)

      var fristbaseUrl = baseUrl + "json/messageEdit"//图片提交
      //var applyid = res.applyid
      for (var i = 0; i < imgurl.length; i++) {
        //console.log(imgurl[i])
        let imgttll = wx.getStorageSync("imglistdata")
        var model = JSON.stringify(text);
        var models = JSON.parse(model);
        var textll = models[imgttll];
        imgttll++;
        console.log(textll)
        console.log(model)
        console.log(models)
        console.log(imgttll)
        wx.setStorageSync("imglistdata", imgttll)
        //console.log(model)
        wx.uploadFile({
          url: fristbaseUrl, //仅为示例，非真实的接口地址
          filePath: imgurl[i],
          name: 'pic',
          // header: {"Content-Type":"multipart/form-data"},
          header: { "content-type": "multipart/form-data" },
          formData: {
            uid: userid,
            content: textll,
          
          },
          success: function (res) {
            console.log(res)
            let data = res.data
            let dataNew = JSON.parse(data)

            console.log(dataNew)
            if (dataNew.code == 1) {
              wx.showToast({
                title: '申请成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 2
                })
              }, 2000)
            }
          }
        })
      }

    })
  },
  userphone: function (e) {
    var that = this;
    that.setData({
      wx_phone: e.detail.value
    })
  },
  //请求验证码
  commes: function (e) {
    var self = this;
    var mobile = e.currentTarget.dataset.wx_phone;
    console.log(mobile)
    self.setData({
      buttonDisable: false
    })
    // if (mobile[0] != 1 || mobile.length < 11) {
    //   api.showWarning("手机号错误")
    //   self.setData({
    //     buttonDisable: false
    //   })
    //   return false;
    // }
    var aid = wx.getStorageSync("aid")
    var phone = wx.getStorageSync("userInfomation")

    var pares = JSON.parse(phone)
    api.http('centre/captcha_offer', 'GET',
      { phone: pares.phone, aid: aid }
      , function (res) {
        api.showWarning(res.msg)
        if (res.code == 0) {
          api.showWarning(res.msg)
        }
        else if (res.code == 1) {
          changeUserCode();
          api.showSuccess(res.msg)
          wx.setStorageSync("captcha", res.captcha)
          wx.setStorageSync("mobile", mobile)
        }
      })
    function changeUserCode() {
      var c = 60;
      var intervalId = setInterval(function () {
        c = c - 1;
        self.setData({
          verifyCodeTime: c + 's后重发',
          buttonDisable: true
        })
        if (c == 0) {
          clearInterval(intervalId);
          self.setData({
            verifyCodeTime: '获取验证码',
            buttonDisable: false
          })
        }
      }, 1000)

    }

    console.log(mobile)
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
    //wx.removeStorage("imglistdata")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //wx.removeStorage("imglistdata")
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
})