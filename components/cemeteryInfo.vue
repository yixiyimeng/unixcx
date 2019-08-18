<template>
	<navigator open-type="redirect" class="section" @click="cemeteryInfo" hover-class="none" :url="`/pages/cemetery/index?id=${CemeteryItem.Id}`" :id="CemeteryItem.Id">
		<view class="leftImg"><image mode="widthFix" :src="cemeteryItem.img" /></view>
		<view class="rightInfo">
			<view class="title">
				{{ cemeteryItem.title }}
				<view v-if="cemeteryItem.djs == 'Y'" class="openDjs"><image src="/static/images/iconDjs.png" /></view>
			</view>
			<view class="details">{{ cemeteryItem.intro }}</view>
			<view class="tel">
				<image mode="widthFix" src="/static/images/tel.png" />
				{{ cemeteryItem.tel }}
			</view>
			<view class="address">
				<image mode="widthFix" src="/static/images/position.png" />
				{{ cemeteryItem.addr }}
			</view>
		</view>
		<view class="stars" v-if="cemeteryItem.star > 0">
			<uni-rate :value="cemeteryItem.star" size="12" margin="4"></uni-rate>
		</view>
	</navigator>
</template>

<script>
import uniRate from '@/components/uni-rate/uni-rate.vue';
export default {
	components: { uniRate },
	data() {
		return {};
	},
	props: {
		cemeteryItem: {
			type: Object,
			default:{}
		}
	},

	methods: {
		cemeteryInfo() {}
	}
};
</script>

<style>
.section {
	box-sizing: border-box;
	width: 100%;
	border-bottom: 1px solid #e5e5e5;
	padding: 30upx 0;
	overflow: hidden;
	position: relative;
}
.leftImg {
	width: 150upx;
	height: 150upx;
	overflow: hidden;
	float: left;
	background-color: #e7e7e7;
	border-radius: 10upx;
	position: relative;
}
.leftImg image {
	width: 150upx;
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
}
.rightInfo {
	width: 520upx;
	float: right;
	height: 150upx;
	overflow: visible;
}
.title {
	font-size: 28upx;
	height: 50upx;
	line-height: 50upx;
	color: #000;
}
.details {
	font-size: 24upx;
	height: 40upx;
	line-height: 40upx;
	color: #333;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.tel,
.address {
	height: 30upx;
	line-height: 30upx;
	font-size: 22upx;
	color: #999;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.address {
	clear: both;
}
.tel image,
.address image {
	width: 18upx;
	height: 25upx;
	float: left;
	margin: 2upx 15upx 5upx 0;
}
.stars{
  width:150upx;
  height: 22upx;
  position: absolute;
  top:40upx;
  right: 30upx;
  text-align: right;
  box-sizing: border-box;
  overflow: hidden;
}
/* .stars image{
  width:22rpx;
  height: 22rpx;
  margin-left:10rpx;
  float:right;
}
.stars image:last-child{
  margin-right:0;
} */
.location {
	width: 300upx;
	height: 80upx;
	line-height: 80upx;
	margin-top: 40upx;
	font-size: 28upx;
	color: #fff;
	float: left;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 9999999;
	box-sizing: border-box;
}
.location image {
	width: 25upx;
	height: 33upx;
	margin: 24upx 10upx 23upx 30upx;
	float: left;
	box-sizing: border-box;
}
.openDjs {
	width: 102upx;
	height: 30upx;
	box-sizing: border-box;
	display: inline-block;
	clear: both;
	margin-left: 5upx;
	overflow: visible;
	position: relative;
}
.openDjs image {
	width: 102upx;
	height: 48upx;
	position: absolute;
	left: 0;
	top: -12upx;
}
</style>
