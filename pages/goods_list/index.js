import { request } from '../../request/index'

// pages/goods_list/index.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		tabs: [
			{
				id: 0,
				value: '综合',
				isActive: true,
			},
			{
				id: 1,
				value: '销量',
				isActive: false,
			},
			{
				id: 2,
				value: '价格',
				isActive: false,
			},
		],

		// 商品列表数据
		goodsList: [],

		//商品总页数
		totalPages: 1,
	},
	// 接口需求参数
	queryParams: {
		query: '',
		cid: '',
		pagenum: 1,
		pagesize: 10,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// console.log(options);
		this.queryParams.cid = options.cid
		this.getGoodList()
	},

	// 获取商品列表数据
	async getGoodList() {
		const res = await request({
			url: '/goods/search',
			data: this.queryParams,
		})
		// console.log(res)

		// 获取总条数
		const total = res.total
		//计算总页数 ceil向上取值
		this.totalPages = Math.ceil(total / this.queryParams.pagesize)
		// console.log(this.totalPages)

		this.setData({
			// 加载下一页数据后对数组进行拼接
			goodsList: [...this.data.goodsList, ...res.goods],
		})

		// 请求成功后关闭下拉刷新
		wx.stopPullDownRefresh()
	},

	// 标题点击事件, 从子组件传出
	handleTabItemChange(e) {
		// 获取index
		const { index } = e.detail
		// 修改原数组isActive状态
		let { tabs } = this.data
		tabs.forEach((v, i) => {
			i === index ? (v.isActive = true) : (v.isActive = false)
		})
		// 赋值到data中
		this.setData({
			tabs,
		})
	},

	// 页面上滑触底 加载下一页数据
	/*
		1. 判断是否有下一页
			* 获取总页数
			* 获取当前页码 pagenum
			* 判断是否 >= 总页数
			* 总页数 = Math.ceil(total / pagesize)

		2. 假如有则加载, 假如没有则弹出提示
	*/
	onReachBottom() {
		// 判断是否有下一页数据
		if (this.queryParams.pagenum >= this.totalPages) {
			// 没有下一页
			// console.log('无了')
			wx.showToast({
				title: '已加载全部商品',
				icon: 'none',
				image: '',
				duration: 1000,
				mask: true,
			})
		} else {
			// 还有下一页
			this.queryParams.pagenum++
			this.getGoodList()
		}
	},

	//下拉刷新操作
	onPullDownRefresh() {
		// 1.情况商品列表数组
		this.setData({
			goodsList: [],
		})
		// 2.pagenum重置
		this.queryParams.pagenum = 1

		// 3.重新获取数据
		this.getGoodList()
	},
})
