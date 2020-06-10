// pages/goods_detail/index.js
import { request } from '../../request/index'
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		goodsObj: {},
	},

	// 商品对象
	goodsInfo: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { goods_id } = options
		console.log(goods_id)
		this.getGoodsDetail(goods_id)
	},

	// 获取商品详情数据
	async getGoodsDetail(goods_id) {
		const goodsObj = await request({
			url: '/goods/detail',
			data: { goods_id },
		})

		this.goodsInfo = goodsObj

		this.setData({
			goodsObj: {
				goods_name: goodsObj.goods_name,
				goods_price: goodsObj.goods_price,
				// iphone部分手机不支持webp图片格式
				// 1. 找后端修改
				// 2. 临时自己改 确保后台存在 .webp => .jpg 用正则表达式
				goods_introduce: goodsObj.goods_introduce.replace(
					/\.webp/g,
					'.jpg',
				),
				pics: goodsObj.pics,
			},
		})
	},

	// 点击轮播图放大预览 wx.previewImage
	handlePreviewImage(e) {
		//1. 构造要预览的数组
		const urls = this.goodsInfo.pics.map(v => v.pics_mid)
		//2. 接收传递过来的图片url
		const current = e.currentTarget.dataset.url

		wx.previewImage({
			current,
			urls,
		})
	},

	// 加入购物车思路
	/*
		1.因为无后端接口, 所以使用小程序缓存还储存购物车数据
		2.先绑定点击事件
		3.获取缓存中购物车的数据 数组格式(对象也行)
		4.先判断当前商品是否已经存在购物车里
		5.已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组填充回缓存
		6.不存在 直接给购物车数组添加新元素 新元素自带购买数量属性 num 重新把购物车数组填充回缓存
		7.弹出提示
	*/

	// 加入购物车点击事件
	handleCartAdd() {
		// console.log('购物车')
		// 获取缓存中的购物车数组 第一次获取为空数组
		let cart = wx.getStorageSync('cart') || []
		// 判断商品对象是否存在购物车数组
		let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
		if (index === -1) {
			// 不存在(第一次添加) 新属性num
			this.goodsInfo.num = 1
			this.goodsInfo.checked = true
			cart.push(this.goodsInfo)
		} else {
			// 存在 num++
			cart[index].num++
		}
		// 购物车数组填充回缓存
		wx.setStorageSync('cart', cart)
		// 填充完毕后提示用户加入购物车成功
		wx.showToast({
			title: '加入成功!',
			icon: 'success',
			duration: 1500,
			mask: true,
		})
	},
})
