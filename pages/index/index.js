import { request } from '../../request/index'
//Page Object
Page({
	data: {
		// 轮播图数据
		swiperList: [],
		// 导航数据
		catesList: [],
		//楼层数据
		floorList: [],
	},
	//options(Object)
	onLoad: function (options) {
		this.getSwiperList()
		this.getCatesList()
		this.getFloorList()
	},

	// 获取轮播图数据
	getSwiperList() {
		// 请求轮播图数据
		request({
			url: '/home/swiperdata',
		}).then(result => {
			this.setData({
				swiperList: result,
			})
		})
	},

	// 获取导航数据
	getCatesList() {
		request({
			url: '/home/catitems',
		}).then(result => {
			this.setData({
				catesList: result,
			})
		})
	},
	// 获取楼层数据
	getFloorList() {
		request({
			url: '/home/floordata',
		}).then(result => {
			console.log(result)
			this.setData({
				floorList: result,
			})
		})
	},
})
