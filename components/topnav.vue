<template>
	<view class="custom_nav" :style="{ height: height * 2 + 20 + 'px' }">
		<view v-if="isShowBack == 'true'" class="back" @click="back_history"><view class="img"></view></view>
		<view class="custom_title">{{ innerTitle }}</view>
	</view>
</template>

<script>
export default {
	props: {
		innerTitle: {
			type: String,
			value: '头部标题'
		},
		isShowBack: {
			type: String,
			value: 'true'
		}
	},
	data() {
		return {};
	},
	methods: {
		back_history: function() {
			wx.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style>
.custom_nav {
	width: 100%;
	height: 120rpx;
	background: #789eeb;
	color: #fff;
	z-index: 9999999;
	position: fixed;
	overflow: hidden;
	left: 0;
	top: 0;
	right: 0;
}
.back {
	position: absolute;
	left: 28rpx;
	top: 60rpx;
	width: 50rpx;
	height: 50rpx;
	overflow: visible;
}
.img {
	width: 18rpx;
	height: 18rpx;
	border-top: 2px solid #fff;
	border-left: 2px solid #fff;
	transform: rotate(-45deg);
	margin-top: 10rpx;
}
.custom_title {
	font-size: 28rpx;
	width: 100%;
	text-align: center;
	color: #fff;
	height: 80rpx;
	line-height: 80rpx;
	margin-top: 40rpx;
}
</style>
