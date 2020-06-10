/*
  购物车页面获取收货地址api封装
*/

/*
  使用promise异步处理 getSetting()
*/
export const getSetting = () => {
	return new Promise((res, rej) => {
		wx.getSetting({
			success: result => {
				res(result)
			},
			fail: err => {
				rej(err)
			},
		})
	})
}

/*
  使用promise异步处理 chooseAddress()
*/
export const chooseAddress = () => {
	return new Promise((res, rej) => {
		wx.chooseAddress({
			success: result => {
				res(result)
			},
			fail: err => {
				rej(err)
			},
		})
	})
}

/*
  使用promise异步处理 openSetting()
*/
export const openSetting = () => {
	return new Promise((res, rej) => {
		wx.openSetting({
			success: result => {
				res(result)
			},
			fail: err => {
				rej(err)
			},
		})
	})
}

/*
	使用promise异步处理 wx弹窗提示组件 showModal
	@params {object} param0 参数
*/
export const showModal = ({ content }) => {
	return new Promise((res, rej) => {
		wx.showModal({
			title: '提示',
			content: content,
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#000000',
			confirmText: '确定',
			confirmColor: '#3CC51F',
			success: result => {
				res(result)
			},
			fail: err => {
				rej(err)
			},
		})
	})
}

/*
	使用promise异步处理 wx弹窗提示组件 showToast
	@params {object} param0 参数
*/
export const showToast = ({ title }) => {
	return new Promise((res, rej) => {
		wx.showToast({
			title: title,
			icon: 'none',
			duration: 1500,
			success: result => {
				res(result)
			},
			fail: err => {
				rej(err)
			},
		})
	})
}
