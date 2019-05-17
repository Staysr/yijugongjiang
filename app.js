 //app.js

App({
  onLaunch: function () {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          console.log(res.hasUpdate)
          console.log('更新成功')
        })
    // wx.login({
    //   success: function (res) {
    //     var code = res.code;
    //     wx.setStorageSync('code', code)
    //   }
    // })

        updateManager.onUpdateReady(function () {

          wx.showModal({ 
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })

        updateManager.onUpdateFailed(function () {
          // 新的版本下载失败
          wx.showModal({
            title: '更新提示',
            content: '新版本下载失败',
            showCancel: false
          })
        })
    wx.getSystemInfo({



      
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    //地区id
    wx.setStorageSync("aid",1)
  }
  ,
  globalData: {
    // http://192.168.2.235/api.php/  本机地址
    // http://www.jiancai.com/api.php/
    // http://www.xiaodong.com/api.php/ 我的地址
    // http://stambe.hbqianze.com/api.php/ 测试版服务器地址
    // http://www.yijugongjiang.com     新的域名
    ColorList: [{
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    },
    ],
    //staticUrl: 'https://www.yijugongjiang.com/api.php/',//请求服务器基本地址
    staticUrl: 'https://www.yijugongjiang.com/api.php/',//请求服务器基本地址
    imagesUrl: 'https://www.yijugongjiang.com/Public/wx_img/',//请求服务器图片地址
    
  }
})




