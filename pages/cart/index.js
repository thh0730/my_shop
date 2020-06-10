// pages/cart/index.js
import {
	getSetting,
	chooseAddress,
	openSetting,
	showModal,
	showToast,
} from '../../utils/asyncWx.js'
Page({
	// 点击获取收货地址
	/*
    1.绑定点击事件
    2.内置api获取用户地址(在用户点击取消之后无法触发第二次)

    new: 
    获取用户对小程序所授予的获取地址的权限状态 scope
    1. 假设用户点击确定 authSetting scope.address: true
       直接调用收货地址api
    2. 假设用户从来没有调用过收货地址api scope undefined
       直接调用收货地址api 
    3. 假设用户点击取消 authSetting scope.address: false

    4. 把获取到的收货地址存入本地存储

    解决方案: 诱导用户自己打开授权设置页面(wx.openSetting), 当用户重新给与获取地址权限时, 调用获取地址api
    
  */

	// 页面加载完毕 判断是否有地址 有则显示地址 无则显示获取地址按钮
	/*
    1. 重新获取等待太久不推荐使用onLoad   用onShow
    2. 获取本地存储中的地址数据
    3. 把数据设置给data中的一个变量
  */

	/*
		onShow
		  * 回到详情页面 给cart数组对象添加一个checked的属性 默认true
			1.获取缓存中的购物车数组
			2.把购物车数据填充到data中
	*/

	/*
		全选实现
		1.onShow获取购物车数组
		2.根据购物车中商品数据 所有商品都被选中 checked=true 使用数组every() 每个checked=true 才返回true 有一个false 就返回false
	*/

	/*
		总价格和总数量
		1.商品都需要被选中 才计算
		2.获取购物车数组
		3.遍历
		4.判断商品是否被选中
		5.总价格 += 商品单价 * 商品数量
		6.总数量 += 商品数量
		7.通过计算后设置回data

		优化: 使用多个循环消耗性能 可以将allChecked默认设置为true 通过商品计算来处理状态变化
	*/

	/*
		点击结算
			1.判断有没有收货地址信息
			2.判断用户有没有选购商品
			3.验证通过则跳转到支付页面
	*/

	data: {
		address: {},
		cartInfo: [],
		allChecked: false,
		totalPrice: 0,
		totalNum: 0,
	},

	onShow() {
		// 获取缓存中的收货地址信息
		const address = wx.getStorageSync('address')
		// 获取缓存中的购物车数据
		const cartInfo = wx.getStorageSync('cart') || []

		this.setData({
			address,
		})

		// 调用数据计算
		this.setCartInfo(cartInfo)
	},

	async handleChooseAdress() {
		try {
			// 1.获取权限状态
			const res1 = await getSetting()
			const scopeAddress = res1.authSetting['scope.address']
			// 2.判断权限状态
			if (scopeAddress === false) {
				await openSetting()
			}
			// 3.调用收货地址api
			let address = await chooseAddress()
			// 拼接收货地址
			address.all =
				address.provinceName +
				address.cityName +
				address.countyName +
				address.detailInfo

			// 4.将获取的地址存入缓存
			wx.setStorageSync('address', address)
		} catch (error) {
			console.log(error)
		}
	},

	// 商品选中
	handleItemCheck(e) {
		// 获取被修改状态的商品id
		const goods_id = e.currentTarget.dataset.id
		// 获取购物车数组
		let { cartInfo } = this.data
		// 找到被修改的商品对象
		let index = cartInfo.findIndex(v => v.goods_id === goods_id)
		// 状态取反
		cartInfo[index].checked = !cartInfo[index].checked
		// 重新设置回data和缓存中
		this.setCartInfo(cartInfo)
	},

	// 设置购物车状态同时 重新计算底部工具栏数据 全选 总价格 购买的数量
	setCartInfo(cartInfo) {
		// 全选优化
		let allChecked = true
		// 总价格 总数量
		let totalPrice = 0
		let totalNum = 0
		cartInfo.forEach(v => {
			if (v.checked) {
				totalPrice += v.num * v.goods_price
				totalNum += v.num
			} else {
				allChecked = false
			}
		})

		// 判断数组是否为空
		allChecked = cartInfo.length != 0 ? allChecked : false

		// 给data中的address对象赋值
		this.setData({
			cartInfo,
			allChecked,
			totalPrice,
			totalNum,
		})
		wx.setStorageSync('cart', cartInfo)
	},

	// 商品全选
	handleItemAllCheck() {
		// 1.获取data中的数据
		let { cartInfo, allChecked } = this.data
		// 2.修改值
		allChecked = !allChecked
		// 3.循环修改cartInfo数组中的商品选中状态checked
		cartInfo.forEach(v => (v.checked = allChecked))
		// 4.修改后的值填充回data与缓存中
		this.setCartInfo(cartInfo)
	},

	// 商品数量编辑
	async handleItemNumEdit(e) {
		// 获取传递的参数
		const { operation, id } = e.currentTarget.dataset
		// 获取购物车数组
		let { cartInfo } = this.data
		// 找到需要修改的商品index
		const index = cartInfo.findIndex(v => v.goods_id === id)

		//如果当数量为1, 用户仍点击-1 弹窗提示
		if (cartInfo[index].num === 1 && operation === -1) {
			const res = await showModal({ content: '是否要删除该商品？ ' })
			if (res.confirm) {
				cartInfo.splice(index, 1)
				this.setCartInfo(cartInfo)
			}
		} else {
			// 数量修改 operation 值为-1 就是减一 为1 就是加一
			cartInfo[index].num += operation

			// 设置回缓存与data
			this.setCartInfo(cartInfo)
		}
	},

	// 结算功能
	async handelPay() {
		// 判断收货地址
		const { address, totalNum } = this.data
		// 有userName就肯定有地址
		if (!address.userName) {
			await showToast({ title: '您还没有选择收货地址!' })
			return
		}

		//判断是否有商品
		if (totalNum === 0) {
			await showToast({ title: '您还没有选购商品!' })
			return
		}

		// 验证通过 跳转支付页面
		wx.navigateTo({
			url: '/pages/pay/index',
		})
	},
})
