import { request } from '../../request/index'
// pages/category/index.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		// 左侧菜单数据
		leftMenuList: [],
		// 右侧内容数据
		rightContent: [],
		// 接口返回数据
		cates: [],
		// 左侧菜单被点击
		currentIndex: 0,
		// 右侧内容切换置顶
		scrollTop: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 将分类数据存入本地存储中, 优化页面加载速度
		const cates = wx.getStorageSync('cates')

		// 判断
		if (!cates) {
			// 不存在 重新请求
			this.getCates()
		} else {
			// 存在旧数据 判断是否过期
			// 5分钟过期
			if (Date.now() - cates.time > 3 * 100000) {
				// 数据过期 重新请求
				this.getCates()
			} else {
				console.log('可以使用旧数据')
				this.cates = cates.data
				// 构造左侧滚动菜单数据
				let leftMenuList = this.cates.map(v => v.cat_name)

				// 构造左侧滚动菜单数据
				let rightContent = this.cates[0].children
				this.setData({
					leftMenuList,
					rightContent,
				})
			}
		}
	},

	// 获取分类数据
	async getCates() {
		// request({
		// 	url: '/categories',
		// }).then(res => {
		// 	// 接口数据储存
		// 	this.cates = res.data.message

		// 	// 将接口的数据存入本地存储中
		// 	wx.setStorageSync('cates', { time: Date.now(), data: this.cates })

		// 	// 构造左侧滚动菜单数据
		// 	let leftMenuList = this.cates.map(v => v.cat_name)

		// 	// 构造左侧滚动菜单数据
		// 	let rightContent = this.cates[0].children
		// 	this.setData({
		// 		leftMenuList,
		// 		rightContent,
		// 	})
		// })
		const res = await request({ url: '/categories' })
		// 接口数据储存
		this.cates = res

		// 将接口的数据存入本地存储中
		wx.setStorageSync('cates', { time: Date.now(), data: this.cates })

		// 构造左侧滚动菜单数据
		let leftMenuList = this.cates.map(v => v.cat_name)

		// 构造左侧滚动菜单数据
		let rightContent = this.cates[0].children
		this.setData({
			leftMenuList,
			rightContent,
		})
	},

	//左侧菜单点击事件
	handleItemTap(e) {
		/*
			1.获取被点击标题身上的索引
			2.给data中的currentIndex赋值
			3.根据不同索引来渲染右侧商品的内容
		*/

		const { index } = e.currentTarget.dataset

		let rightContent = this.cates[index].children

		this.setData({
			currentIndex: index,
			rightContent,
			scrollTop: 0,
		})
	},
})
