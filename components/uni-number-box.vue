<template>
	<view class="uni-numbox">
		<view class="uni-numbox-minus" :class="{'uni-numbox-disabled': disableSubtract}" @click="_calcValue('subtract')">-</view>
		<input class="uni-numbox-value" type="number" :disabled="disabled" :value="inputValue" @blur="_onBlur">
		<view class="uni-numbox-plus" :class="{'uni-numbox-disabled': disableAdd}" @click="_calcValue('add')">+</view>
	</view>
</template>
<script>
	export default {
		name: 'uni-number-box',
		props: {
			value: {
				type: Number,
				default: 0
			},
			min: {
				type: Number,
				default: -Infinity
			},
			max: {
				type: Number,
				default: Infinity
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				inputValue: this.value
			}
		},
		computed: {
			disableSubtract() {
				return this.value <= this.min
			},
			disableAdd() {
				return this.value >= this.max
			}
		},
		watch: {
			value(val) {
				this.inputValue = val;
			},
			inputValue(val) {
				this.$emit('change', val);
				
				if(this.value){  
                if(this.value!=this.inputValue){  
                    this.inputValue = this.value;  
                }}  
			}
		},
		methods: {
			_calcValue(type) {
				const scale = this._getDecimalScale();
				let value = this.inputValue * scale;
				let step = this.step * scale;

				if (type === 'subtract') {
					value -= step
				} else if (type === 'add') {
					value += step
				}
				if (value < this.min || value > this.max) {
					return
				}
				this.inputValue = value / scale;
			},
			_getDecimalScale() {
				let scale = 1;
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + '').split('.')[1].length);
				}
				return scale;
			},
			_onBlur(event) {
				let value = event.detail.value;
				if (!value) {
					this.inputValue = 0;
					return
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
				} else if (value < this.min) {
					value = this.min
				}
				this.inputValue = value
			}
		}
	}
</script>
<style>
	.uni-numbox {
		display: inline-flex;
		flex-direction: row;
		justify-content: flex-start;
		height: 50upx;
		position: relative;
	}

	.uni-numbox::after {
		content: '';
		position: absolute;
		transform-origin: center;
		box-sizing: border-box;
		pointer-events: none;
		top: -50%;
		left: -50%;
		right: -50%;
		bottom: -50%;
		transform: scale(.5);
	}

	.uni-numbox-minus,
	.uni-numbox-plus {
		margin: 0;
		background-color: #f9f9f9;
		width: 80upx;
		height: 100%;
		line-height: 50upx;
		text-align: center;
		color: #555555;
		position: relative;
		background: #eeeeee;
		
	}

	.uni-numbox-minus {
		border-right: none;
		border-top-left-radius: 6upx;
		border-bottom-left-radius: 6upx;
	}

	.uni-numbox-plus {
		border-left: none;
		border-top-right-radius: 6upx;
		border-bottom-right-radius: 6upx;
	}

	.uni-numbox-value {
		position: relative;
		width: 80upx;
		height: 100%;
		text-align: center;
		padding: 0;
		margin-left: 2upx;
		margin-right: 2upx;
	}

	.uni-numbox-value::after {
		content: '';
		position: absolute;
		transform-origin: center;
		box-sizing: border-box;
		pointer-events: none;
		top: -50%;
		left: -50%;
		right: -50%;
		bottom: -50%;
		transform: scale(.5);
	}

	.uni-numbox-disabled {
		color: #c0c0c0;
	}
	uni-input input{
		height: 25upx;
		
	}
</style>
