let ajaxTimes = 0

export const request = params => {
	// 请求次数计数
	ajaxTimes++
	// 加载
	wx.showLoading({
		title: '加载中',
		mask: true,
	})

	// 定义接口公共部分
	const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'

	return new Promise((resolve, reject) => {
		wx.request({
			...params,
			url: baseUrl + params.url,
			success: result => {
				resolve(result.data.message)
			},
			fail: err => {
				reject(err)
			},
			complete: () => {
				ajaxTimes--
				if (ajaxTimes === 0) {
					// 关闭loading图标
					wx.hideLoading()
				}
			},
		})
	})
}
