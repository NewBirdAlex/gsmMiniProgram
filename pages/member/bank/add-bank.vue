<template>
	<view class="bg ">
		
		<view class="drawForm">
			<radio-group @change="radioChange" class="flex rg_check">
				<label class="flex" style='flex:1' v-for="(item, index) in items" :key="item.value">
					<view><radio :value="item.value" :checked="index === current" /></view>
					<view>{{ item.name }}</view>
				</label>
			</radio-group>
			<view class="drawInput">
				<view class="" v-if="current==0">
					<view class="section">
						<view class="title">银行名称</view>
						<view><input placeholder="请输入银行名称" type="text" v-model="bankName" /></view>
					</view>
					<view class="section">
						<view class="title">支行信息</view>
						<view><input placeholder="请输入XX省XX市XX支行" type="text" v-model="depositBank" /></view>
					</view>
					<view class="section">
						<view class="title">开户姓名</view>
						<view><input placeholder="请输入开户姓名" type="text" v-model="name" /></view>
					</view>
					
					<view class="section">
						<view class="title">银行账号</view>
						<view><input placeholder="请输入银行账号" type="text" v-model="cartNO" /></view>
					</view>
				</view>
				
				<view class="" v-else>
					<view class="section">
						<view class="title">支付宝账号</view>
						<view><input placeholder="请输入支付宝账号" type="text" v-model="cartNO" /></view>
					</view>
					<view class="section">
						<view class="title">姓名</view>
						<view><input placeholder="请输入姓名" type="text" v-model="name" /></view>
					</view>
				</view>
			</view>
		</view>
		<view class="drawSubmit"><button formType="submit" @tap="confirm">确定</button></view>
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
	data() {
		return {
			bankName:'',
			cartNO: '',
			name: '',
			account: '',
			addflag: false,
			depositBank:'',
			items: [
				{
					value: '0',
					name: '银行卡'

				},
				{
					value: '1',
					name: '支付宝'
				}
			],
			current: 0
		};
	},
	computed: mapState(['memberInfo']),
	methods: {
		radioChange: function(evt) {
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].value === evt.target.value) {
					this.current = i;
					break;
				}
			}
		},
		confirm() {
			if (this.addflag) return;
			if(this.current==0){
				if (!this.cartNO || !this.name || !this.depositBank) {
					uni.showToast({
						title: '请输入银行名称/支行/名字',
						duration: 1500,
						icon: 'none'
					});
					return;
				}
			}else{
				if (!this.cartNO || !this.name ) {
					uni.showToast({
						title: '请输入银行名称和支行',
						duration: 1500,
						icon: 'none'
					});
					return;
				}
			}
			
			this.addflag = true;
			uni.showLoading({
				title:'请稍候',
				mask:true
			})
			this.apiUrl
				.addCard({
					data: {
						bankName:this.bankName,
						cartNO: this.cartNO,
						depositBank: this.depositBank,
						userName: this.name,
						type:this.current==0?1:2
					}
				})
				.then(res => {
					uni.hideLoading();
					this.addflag = false;
					if (res.data.status == 1) {
						uni.showToast({
							title: '添加成功',
							duration: 2000,
							icon:'none'
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 2000);
					}
				});
		}
	}
};
</script>
<style lang="less" scoped>
.rg_check {
	padding-bottom: 30upx;
}
.bg {
	height: 100%;
	width: 100%;
	position: relative;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	min-height: 90vh;
	.drawForm {
		padding: 60upx;

		form {
			display: flex;
			justify-content: center;
		}

		.drawInput {
			background-color: white;
			box-sizing: border-box;
			.section {
				border-top: solid 1upx #dfdfdf;
				&:first-child{
						border: none;
				}
				input{
					height: 48upx;
					margin-bottom: 30upx;
					font-size: 34upx;
				}
				.title {
					flex: 1;
					box-sizing: border-box;
					padding: 10upx 0;
					color: #656565;
					margin-top: 20upx;
					font-size: 26upx;
				}
			}
		}
	}

	.drawSubmit {
		margin-top: 90upx;

		text {
			display: flex;
			justify-content: center;
			color: #388ceb;
		}
		button {
			width: 600upx;
			height: 80upx;
			line-height: 80upx;
			background: #fc4e29;
			border-radius: 40px;
			font-size: 30upx;
			color: #ffffff;
		}
	}
}
</style>
