<template>
	<view class="pageBg colTopBottom receipt">
		<view class="">
			<view class=" title-black fs30 pd20 background-white">选择发票类型</view>
			<view class="background-white pd20">
				<view class="rp-btn gray" :class="{ active: item.active }" v-for="(item, index) in typeList" :key="index" @tap="changeType(index)">{{ item.name }}</view>
			</view>
			<!-- 发票 -->
			<view class="" v-if="types == 1">
				<view class="background-white pd20">
					<radio-group @change="radioChange" class="radio-group">
						<label class="flex-box mgl20" v-for="(item, index) in items" :key="item.value" >
							<view><radio color="#FC4E29" :value="item.value" :checked="index === current" /></view>
							<view class="mgl20 fs30">{{ item.name }}</view>
						</label>
					</radio-group>
				</view>
				<view class="" v-if="current==1">
					<view class="background-white pd20 rp-list mgt20">
						<view class="left fs30">发票抬头</view>
						<input type="text" class="fs30" placeholder="请输入发票抬头" v-model="invoiceTitle" />
					</view>
					<view class="background-white pd20 rp-list">
						<view class="left fs30">统一社会信用编码</view>
						<input type="text" class="fs30" placeholder="请输入统一社会信用编码" v-model="taxpayerCode" />
					</view>
				</view>
				
			</view>
			<!-- 增值税 -->
			<view class="mgt20" v-if="types == 2">
				<view class="background-white pd20 rp-list " v-for="(item, index) in zzsList" :key="index">
					<view class="left fs30">{{ item.name }}</view>
					<input type="text" class="fs30" v-model="item.value" :placeholder="item.placeholder" value="" />
				</view>
			</view>
		</view>
		<view class="rp-confirm flex-box white fs30 active" @tap="submitReceipt">确定</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			current: 0,
			types: 0,
			invoiceTitle: '',
			taxpayerCode: '',
			zzsList: [
				{
					name: '单位名称',
					placeholder: '请输入单位名称',
					value: ''
				},
				{
					name: '纳税人识别号',
					placeholder: '请输入纳税人识别号',
					value: ''
				},
				{
					name: '单位地址',
					placeholder: '请输入单位地址',
					value: ''
				},
				{
					name: '单位电话',
					placeholder: '请输入单位电话',
					value: ''
				},
				{
					name: '开户银行',
					placeholder: '请输入开户银行',
					value: ''
				},
				{
					name: '银行账户',
					placeholder: '请输入银行账户',
					value: ''
				}
			],
			items: [
				{
					value: 'USA',
					name: '个人',
					checked: 'true'
				},
				{
					value: 'CHN',
					name: '公司'
				}
			],
			typeList: [
				{
					active: true,
					name: '不开发票'
				}
			]
		};
	},
	onShow() {
		this.typeList = [
			{
				active: true,
				name: '不开发票'
			}
		];
		uni.getStorage({
			key: 'recieptType',
			success: res => {
				res.data.forEach(item => {
					item == 2
						? this.typeList.push({
								active: false,
								name: '纸质发票'
						  })
						: '';
					item == 3
						? this.typeList.push({
								active: false,
								name: '增值税发票'
						  })
						: '';
				});
			}
		});
	},
	onLoad() {
		this.initValue();
	},
	methods: {
		initValue(){
			let receiptObj = uni.getStorageSync('receiptInfo')
			receiptObj.invoiceTitle?this.invoiceTitle = receiptObj.invoiceTitle:'';
			receiptObj.uniformSocialCreditCode?this.taxpayerCode = receiptObj.uniformSocialCreditCode:'';
			receiptObj.unitName?this.zzsList[0].value = receiptObj.unitName:'';
			receiptObj.taxpayerCode?this.zzsList[1].value = receiptObj.taxpayerCode:'';
			receiptObj.unitAddress?this.zzsList[2].value = receiptObj.unitAddress:'';
			receiptObj.unitPhone?this.zzsList[3].value = receiptObj.unitPhone:'';
			receiptObj.bankName?this.zzsList[4].value = receiptObj.bankName:'';
			receiptObj.bankAccount?this.zzsList[5].value = receiptObj.bankAccount:'';
			console.log(receiptObj);
		},
		radioChange: function(evt) {
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].value === evt.target.value) {
					this.current = i;
					console.log(this.current);
					break;
				}
			}
		},
		changeType(index) {
			let arr = this.typeList;
			arr.forEach(item => (item.active = false));
			arr[index].active = true;
			this.typeList = arr;
			this.types = index;
		},
		submitReceipt() {
			let data = null;
			if (this.types === 0) {
				//不开发票
				uni.navigateBack();
				return;
			} else if (this.types === 1) {
				//page 发票
				data = {
					invoiceStatus: 1,
					invoiceType: this.current==1?2:1,
					invoiceTitle: this.invoiceTitle,
					uniformSocialCreditCode: this.taxpayerCode
				};
				if(!this.invoiceTitle){
					uni.showToast({
						title:'请输入发票抬头',
						icon:'none',
						duration:1500
					})
					return
				}
				if(!this.taxpayerCode){
					uni.showToast({
						title:'请输入信用编码',
						icon:'none',
						duration:1500
					})
					return
				}
			} else {
				data = {
					invoiceStatus: 2,
					unitName: this.zzsList[0].value,
					taxpayerCode: this.zzsList[1].value,
					unitAddress: this.zzsList[2].value,
					unitPhone: this.zzsList[3].value,
					bankName: this.zzsList[4].value,
					bankAccount: this.zzsList[5].value
				};
			}
			// save receipt infomation in storage
			uni.setStorage({
				key: 'receiptInfo',
				data,
				success: res => {
					uni.navigateBack();
				}
			});
		}
	}
};
</script>

<style lang="less">
.rp-list {
	display: flex;

	.left {
		width: 300upx;
	}
}

.radio-group {
	display: flex;
}

.rp-confirm {
	width: 600upx;
	height: 70upx;
	background-color: #b4b4b4;
	border-radius: 35upx;
	margin: 40upx auto;

	&.active {
		background: #FC4E29;
		color: white;
	}
}

.rp-btn {
	border: solid 1px #a1a1a1;
	padding: 6upx 20upx;
	border-radius: 28upx;
	display: inline-block;
	margin-right: 30upx;

	&.active {
		color: #FC4E29;
		border: solid 1px #FC4E29;
	}
}
</style>
