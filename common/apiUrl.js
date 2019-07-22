import {uniRequest} from './req.js'
import {payRequest} from './req.js'
const apiUrl = {
	//互转明细
	member_balanceTransferPagination(data){
		return uniRequest({ url:'member_balanceTransferPagination', ...data });
	},
	//批发卷互转明细
	member_integralloTransferPagination(data){
		return uniRequest({ url:'member_integralloTransferPagination', ...data });
	},
	//批发卷互转
	member_integralTransfer(data){
		return uniRequest({ url:'member_integralTransfer', ...data });
	},
	//互转
	member_balanceTransfer(data){
		return uniRequest({ url:'member_balanceTransfer', ...data });
	},
	//new mesage
	checkNewMessage(data){
		return uniRequest({ url:'message_unreadNum', ...data });
	},
	//系统信息
	getsystemInfo(data){
		return uniRequest({ url:'systemConfig_config', ...data });
	},
	//发票
	getReciept(data){
		return uniRequest({ url:'product_getProductsInvoice', ...data });
	},
	confirmDelivery(data){
		return uniRequest({ url:'order_confirmDelivery', ...data });
	},
	//提货订单 order
	order_getSelfMentionOrder(data){
		return uniRequest({ url:'order_getSelfMentionOrder', ...data });
	},
	//login
	login(data){
		return uniRequest({ url:'member_login', ...data });
	},
	//短信验证
	getCode(data){
		return uniRequest({ url:'member_getSMSCaptcha', ...data });
	},
	//图片验证
	getImgCode(data){
		return uniRequest({ url:'member_veryCode', ...data });
	},
	//提交注册
	submitRegister(data){
		return uniRequest({ url:'member_reg', ...data });
	},
	//协议
	getRegisterAgreement(data){
		return uniRequest({ url:'systemConfig_protocol', ...data });
	},
	//重设密码
	resetPsw(data){
		return uniRequest({ url:'member_forgetPwd', ...data });
	},
	//商品详情
	getGoodsdetail(data){
		return uniRequest({ url:'product_getProductDetail', ...data });
	},
	//商品分类
	getProductTree(data){
		return uniRequest({ url:'product_getCategoryByTree', ...data });
	},
	//add shopping car
	addTocar(data){
		return uniRequest({ url:'product_addShoppingCart', ...data });
	},
	//del shopping car
	delShoppingCar(data){
		return uniRequest({ url:'product_delShoppingCart', ...data });
	},
	//edit shopping car
	editShoppingcar(data){
		return uniRequest({ url:'product_editShoppingCart', ...data });
	},
	//购物车列表
	getShoppingCarList(data){
		return uniRequest({ url:'product_getShoppingCartList', ...data });
	},
	//提交订单
	submitOrder(data){
		return uniRequest({ url:'order_submit', ...data });
	},
	getAllowIntegralMoney(data){
		return uniRequest({ url:'order_getAllowIntegralMoney', ...data });
	},
	//获取订单详情
	getOrderDetail(data){
		return uniRequest({ url:'order_get', ...data });
	},
	cancelOrder(data){
		return uniRequest({ url:'order_cancel', ...data });
	},
	//获取物流 printer_getParcelInfo
	getParcelInfo(data){
		return uniRequest({ url:'printer_getParcelInfo', ...data });
	},
	//获取运费
	getExpress(data){
		return uniRequest({ url:'product_culculateProdTransportFee', ...data });
	},
	//订单获取运费
	getOrderExpress(data){
		return uniRequest({ url:'product_culculateTransportFee', ...data });
	},
	//address list
	getAddressList(data){
		return uniRequest({ url:'memberAddress_list', ...data });
	},
	//swiper 广告 home
	getSwipe(data){
		return uniRequest({ url:'ad_location', ...data });
	},
	//reset 登录密码
	resetLoginPsw(data){
		return uniRequest({ url:'member_resetPwd', ...data });
	},
	//reset 支付密码
	resetSafePsw(data){
		return uniRequest({ url:'member_resetPayPwd', ...data });
	},
	//首页产品
	getIndexProduct(data){
		return uniRequest({ url:'product_index', ...data });
	},
	//首页公告
	getHomeNotice(data){
		return uniRequest({ url:'message_notice', ...data });
	},
	//编辑收货地址
	submitAddress(data){
		return uniRequest({ url:'memberAddress_saveOrUpdate', ...data });
	},
	//获取地址
	getAddressById(data){
		return uniRequest({ url:'memberAddress_get', ...data });
	},
	//删除地址
	delAddressById(data){
		return uniRequest({ url:'memberAddress_delete', ...data });
	},
	//订单列表
	getOrderList(data){
		return uniRequest({ url:'order_pagelist', ...data });
	},
	//取消订单
	cancelOrder(data){
		return uniRequest({ url:'order_cancel', ...data });
	},
	//获取会员信息
	getMemberInfo(data){
		return uniRequest({ url:'member_findMember', ...data });
	},
	//编辑会员
	editMemberInfo(data){
		return uniRequest({ url:'member_updateBaseInfo', ...data });
	},
	//上传图片
	uploadImage(data){
		return uniRequest({ url:'upload_uploadAjaxFile', ...data });
	},
	//寄售列表
	goodsConsignment(data){
		return uniRequest({ url:'order_sellPageList', ...data });
	},
	//寄售商品
	consignProduct(data){
		return uniRequest({ url:'order_agency', ...data });
	},
	//取消寄售
	cancelConsignment(data){
		return uniRequest({ url:'order_cancelSelf', ...data });
	},
	//提现明细
	getCashList(data){
		return uniRequest({ url:'member_withdrawalRecord', ...data });
	},
	//提现申请
	applyWidthDraw(data){
		return uniRequest({ url:'member_applyWithdrawal', ...data });
	},
	//提现 detail
	getWidthDrawDetail(data){
		return uniRequest({ url:'member_withdrawalDetail', ...data });
	},
	//余额
	getLeftMoney(data){
		return uniRequest({ url:'member_findServiceCharge', ...data });
	},
	//收入明细
	getIncomeList(data){
		return uniRequest({ url:'member_balanceLogList', ...data });
	},
	// 提货列表
	getWholesaleList(data){
		return uniRequest({ url:'order_selfMentionPageList', ...data });
	},
	//分页获取待寄售提货订单列表
	getUnConsignment(data){
		return uniRequest({ url:'order_wholesalePageList', ...data });
	},
	//普通商品
	getNormalProduct(data){
		return uniRequest({ url:'product_getProductPagination', ...data });

	},
	//商品分类
	getProductSort(data){
		return uniRequest({ url:'product_getCategoryLevel1', ...data });
	},
	//零售 批发 商品列表
	getSpecialProduct(data){
		return uniRequest({ url:'product_findBatchAppProductList', ...data });
	},
	//消息
	getMessage(data){
		return uniRequest({ url:'message_page', ...data });
	},
	// 获取消息
	getMessageDetail(data){
		return uniRequest({ url:'message_getMessageById', ...data });
	},
	//积分明细
	getScoreList(data){
		return uniRequest({ url:'member_shoppingLogList', ...data });
	},
	//批发明细
	getIntegrallogList(data){
		return uniRequest({ url:'member_integrallogList', ...data });
	},
	//fans list
	getFansList(data){
		return uniRequest({ url:'member_childList', ...data });
	},
	//分享码
	getShareCode(data){
		return uniRequest({ url:'member_shareQRCode', ...data });
	},
	//banklist
	getBankList(data){
		return uniRequest({ url:'memberBank_list', ...data });
	},
	//添加银行卡
	addCard(data){
		return uniRequest({ url:'memberBank_saveOrUpdate', ...data });
	},
	//del card
	delCard(data){
		return uniRequest({ url:'memberBank_delete', ...data });
	},
	//热门搜索
	hotSearchList(data){
		return uniRequest({ url:'hotSearch_list', ...data });
	},
	// 退款
	applyRefund(data){
		return uniRequest({ url:'order_applyRefund', ...data });
	},
	//支付宝支付-获取支付参数
	useAlipay(data){
		return payRequest({ url:'aliSpService', ...data });
	},
	getOpenId(data){
		return payRequest({ url:'getOpenId', ...data });
	},
	//获取支付参数 wechat
	getWeChatParams(data){
		return payRequest({ url:'wechatPayService', ...data });
	},
	//余额支付
	payByBalance(data){
		return payRequest({ url:'balancePayService', ...data });
	},
  //分享加速详情
  orderShareDetail(data){
    return uniRequest({ url:'order_shareDetail', ...data });
  },
	// 加速助力
  orderHelp(data) {
    return uniRequest({ url:'order_help', ...data });
	}
}
module.exports =apiUrl
