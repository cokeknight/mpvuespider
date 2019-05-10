import * as Api from 'src/services/api'

declare var window: any
declare var navigator: any
declare var BMap: any


function getGeolocation() {
  if (mpvuePlatform === 'h5') {
    return new Promise(function (resolve) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async function(p) {
            let latitude = p.coords.latitude// 获取坐标点纬度
            let longitude = p.coords.longitude// 获取坐标点经度
            // 以指定的经度与纬度创建一个坐标点
            const city = await Api.getGeolocation({ lat: latitude, lon: longitude })
            resolve(city)
          }
          , function res(e) {
            let geolocation = new BMap.Geolocation()
            geolocation.getCurrentPosition(async function(r) {
              const myGeo = new BMap.Geocoder()
              myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), async data => {
                if (data.addressComponents) {
                  const result = data.addressComponents
                  const location = {
                    creditLongitude: r.point.lat, // 经度
                    creditLatitude: r.point.lng, // 纬度
                    creditProvince: result.province || '', // 省
                    creditCity: result.city || '', // 市
                    creditArea: result.district || '', // 区
                    creditStreet: (result.street || '') + (result.streetNumber || '') // 街道
                  }
                  const city = await Api.getGeolocation({ lat: location.creditLongitude, lon: location.creditLatitude })
                  resolve(city)
                }
              })
            })
            // switch (e.code) {
            // case e.TIMEOUT:
            //   // window.alert('定位失败，请求获取用户位置超时')
            //   break
            // case e.PERMISSION_DENIED:
            //   window.alert('您拒绝了使用位置服务功能，查询已取消')
            //   break
            // case e.POSITION_UNAVAILABLE:
            //   window.alert('抱歉，暂时无法为您所在的星球提供位置服务')
            //   break
            // case e.UNKNOWN_ERROR:
            //   window.alert('发生一个位置错误')
            //   break
            // }
          }, {
            // 指示浏览器获取高精度的位置，默认false
            enableHighAcuracy: true,
            // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
            timeout: 5000,
            // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置
            maximumAge: 2000
          }
        )
      } else {
        window.alert('不支持')
      }
    })
  } else {
    return new Promise(function (resolve) {
      wx.getLocation({
        type: 'wgs84',
        async success(res) {
          const latitude = res.latitude
          const longitude = res.longitude
          console.log(res)
          const city = await Api.getGeolocation({ lat: latitude, lon: longitude })
          resolve(city)
        },
        fail(error) {
          console.log(error)
        }
      })
    })
  }
}
export default getGeolocation
