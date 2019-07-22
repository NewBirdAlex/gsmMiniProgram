<template>
	<view class="mpvue-picker">
		<view :class="{'pickerMask':showPicker}" @click="maskClick" catchtouchmove="true"></view>
		<view class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showPicker}">
			<view class="mpvue-picker__hd">
				<view class="mpvue-picker__action" @click="pickerCancel">取消</view>
				<view class="mpvue-picker__action" @click="pickerConfirm">确定</view>
			</view>
			<picker-view indicator-style="height: 40px;" class="mpvue-picker-view" :value="pickerValue" @change="pickerChange">
				<block>
					<picker-view-column>
						<view class="picker-item" v-for="(item,index) in provinceDataList" :key="index">{{item.name}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="picker-item" v-for="(item,index) in cityDataList" :key="index">{{item.name}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="picker-item" v-for="(item,index) in areaDataList" :key="index">{{item.name}}</view>
					</picker-view-column>
				</block>
			</picker-view>
		</view>
	</view>
</template>

<script>
	import {baseUrl} from '@/common/req.js'
	import { mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				pickerValue: [0, 0, 0],
				provinceDataList: [],
				cityDataList: [],
				areaDataList: [],
				area:null
			};
		},
		computed: mapState(['wholeCity']),
		created() {
			
			if(this.wholeCity){
				let citydata = this.wholeCity;
				this.area = citydata;
				this.provinceDataList = citydata;
				this.cityDataList = citydata[0].children;
				this.areaDataList = this.cityDataList[0].children;
			}else{
				uni.request({
					url: baseUrl+'/tab_getDistrictTree.action'
				}, ).then(res => {
					console.log(res)
					if(res[1].data.status ==1){
						this.$store.commit('saveCity',res[1].data.data);
						let citydata = res[1].data.data;
						this.area = citydata;
						this.provinceDataList = citydata;
						this.cityDataList = citydata[0].children;
						this.areaDataList = this.cityDataList[0].children;
					}
				})
			}
			
		},
		props: {
			/* 是否显示控件 */
			showPicker: {
				type: Boolean,
				default: false
			},
			/* 默认值 */
			pickerValueDefault: {
				type: Array,
				default: [0, 0, 0]
			}
		},
		methods: {
			show() {
				setTimeout(() => {
					this.showPicker = true;
				}, 0);
			},
			maskClick() {
				this.pickerCancel();
			},
			pickerCancel() {
				this.showPicker = false;
				this._$emit('onCancel');
			},
			pickerConfirm(e) {
				this.showPicker = false;
				this._$emit('onConfirm');
			},
			showPickerView() {
				this.showPicker = true;
			},
			handPickValueDefault() {
				if (this.pickerValueDefault !== [0, 0, 0]) {
					if (this.pickerValueDefault[0] > provinceData.length - 1) {
						this.pickerValueDefault[0] = provinceData.length - 1;
					}
					if (this.pickerValueDefault[1] > cityData[this.pickerValueDefault[0]].length - 1) {
						this.pickerValueDefault[1] = cityData[this.pickerValueDefault[0]].length - 1;
					}
					if (this.pickerValueDefault[2] > areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length - 1) {
						this.pickerValueDefault[2] = areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length - 1;
					}
				}
			},
			pickerChange(e) {
				let changePickerValue = e.mp.detail.value;
				if (this.pickerValue[0] !== changePickerValue[0]) {
					console.log('first level')
					// 第一级发生滚动
					this.cityDataList = this.area[changePickerValue[0]].children;
					this.areaDataList = this.cityDataList[changePickerValue[1]].children;
					changePickerValue[1] = 0;
					changePickerValue[2] = 0;
				} else if (this.pickerValue[1] !== changePickerValue[1]) {
					// 第二级滚动
					this.areaDataList =
						this.area[changePickerValue[0]].children[changePickerValue[1]].children;
					changePickerValue[2] = 0;
				}
				this.pickerValue = changePickerValue;
				this._$emit('onChange');
			},
			_$emit(emitName) {
				let pickObj = {
					label: this._getLabel(),
					value: this.pickerValue,
					cityCode: this._getCityCode()
				};
				this.$emit(emitName, pickObj);
			},
			_getLabel() {
				let pcikerLabel =
					this.provinceDataList[this.pickerValue[0]].name +
					'-' +
					this.cityDataList[this.pickerValue[1]].name +
					'-' +
					this.areaDataList[this.pickerValue[2]].name;
				return pcikerLabel;
			},
			_getCityCode() {
				let cId = this.provinceDataList[this.pickerValue[0]].id;
				let	pId = this.provinceDataList[this.pickerValue[0]].children[this.pickerValue[1]].id;
				let dId = this.provinceDataList[this.pickerValue[0]].children[this.pickerValue[1]].children[this.pickerValue[2]].id;
				let cityIds = [cId,pId,dId];
				return cityIds;
			}
		}
	};
</script>

<style>
	.pickerMask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	.mpvue-picker-content {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: all 0.3s ease;
		transform: translateY(100%);
		z-index: 3000;
	}

	.mpvue-picker-view-show {
		transform: translateY(0);
	}

	.mpvue-picker__hd {
		display: flex;
		padding: 9px 15px;
		background-color: #fff;
		position: relative;
		text-align: center;
		font-size: 17px;
	}

	.mpvue-picker__hd:after {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #e5e5e5;
		color: #e5e5e5;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
	}

	.mpvue-picker__action {
		display: block;
		flex: 1;
		color: #1aad19;
	}

	.mpvue-picker__action:first-child {
		text-align: left;
		color: #888;
	}

	.mpvue-picker__action:last-child {
		text-align: right;
	}

	.picker-item {
		text-align: center;
		line-height: 40px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mpvue-picker-view {
		position: relative;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 238px;
		background-color: rgba(255, 255, 255, 1);
	}
</style>
