<template>
	<view class="colTopBottom pageBg" v-if="balance">
		<view class="background-white pd20">
			<view class="yourMoney flex-box">
				<view class="">
					<view class="white fs30 tac">
						余额
					</view>
					<view class="white fs50">
						
						<text class="fs30">￥</text>
						{{balance.userMoney}}
					</view>
				</view>
				
			</view>
			<view class="item ">
				<view class="left flex-box">
					转账金额
				</view>
				<view class="right bdb">
					<input type="digit" placeholder="请输入转账金额" @blur="checkValue" class="w100" v-model="amount" />
				</view>
			</view>
			<view class="item ">
				<view class="left flex-box">
					会员手机号
				</view>
				<view class="right bdb">
					<input type="number" placeholder="请输入会员手机号" class="w100" v-model="recipientPhone" />
				</view>
			</view>
			<view class="item">
				<view class="left flex-box">
					备注
				</view>
				<view class="right ">
					<input type="text" placeholder="请输入备注信息"  class="w100" v-model="remarks" />
				</view>
			</view>
			<view class="item">
				<view class="left flex-box">
					支付密码
				</view>
				<view class="right betweenBox">
					<input type="text" placeholder="请输入支付密码" :password='!showPassword' class="" v-model="payPwd" />
					<text class="showPw" @tap="showPassword=!showPassword">{{!showPassword?'显示':'隐藏'}}</text>
				</view>
			</view>
		</view>
		<view class="">
			<view class="btn flex-box white fs30" @tap="submitTranslate">
				确定转账
			</view>
			
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				balance:null,
				payPwd:'',
				amount:'',
				recipientPhone:'',
				remarks:'',
				showPassword:false
			};
		},
		computed: mapState([
			'memberInfo'
		]),
		onLoad() {
			this.getMoney()
		},
		watch:{
			
		},
		methods:{
			checkValue(e){
				let money = e.detail.value;
				if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，提现金额小数点后不能大于两位数字
				  money = e.detail.value;
				} else {
				  money = Number(money).toFixed(2)
				}
				console.log(money);
				if(money>this.balance.userMoney){
					money = this.balance.userMoney;
				}
				this.amount = money;
			},
			submitTranslate(){
				let str ;
				if(!this.payPwd){
					str = '请输入支付密码'
				}
				if(!this.recipientPhone){
					str = '请输入被转账人手机号码'
				}
				if(!this.amount||this.amount<=0){
					str = '请输入转账金额'
				}
				if(str){
					uni.showToast({
						title: str,
						icon:'none',
						mask: false,
						duration: 1500
					});
					return
				}
				if (!/^1[345678]\d{9}$/.test(this.recipientPhone)){
					uni.showToast({
						title: '请输入正确的手机号码',
						icon:'none',
						mask: false,
						duration: 1500
					});
					return
				}
				
				this.apiUrl.member_balanceTransfer({
					data:{
						amount:this.amount,
						payPwd:this.payPwd,
						recipientPhone:this.recipientPhone,
						remarks:this.remarks
					}
				}).then(res=>{
					if(res.data.status==1){
						uni.showToast({
							title: '转账成功',
							icon:'none',
							mask: false,
							duration: 1500
						});
						setTimeout(()=>{
							uni.navigateBack();
						},1500)
					}
				})
			},
			getMoney(data) {
				this.apiUrl.getLeftMoney({
					data: {
						memberId: this.memberInfo.id
					}
				}).then(res => {
					if (res.data.status == 1) {
						this.balance = res.data.data
					}
				})
			},
		}
	}
</script>

<style lang="less" scoped>
.item{
	display: flex;
	.left{
		flex: 1;
	}
	.right{
		flex:2;
		input{
			height: 80upx;
			display: flex;
			align-items: center;
			line-height: 80upx;
		}
	}
}
.btn{
	width:600upx;
	height:80upx;
	background:linear-gradient(90deg,rgba(83,177,250,1) 0%,rgba(56,140,235,1) 100%);
	border-radius:40px;
	margin: 40upx auto;
}
.yourMoney{
	height: 200upx;
	border-radius:10px;
	background:linear-gradient(90deg,rgba(83,177,250,1) 0%,rgba(56,140,235,1) 100%);
	.fs50{
		font-size: 50upx;
	}
}
</style>
