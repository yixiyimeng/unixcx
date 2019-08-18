<template>
	<view class='custom_null-data'>
    <image class="nullBg" :style="{marginTop:marginTop+'upx'}" mode="widthFix" src="/static/images/nullDataBg.png" />
    <view class="tipsText">{{tipsText}}</view>
</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			marginTop:{
				type:[String,Number],
				default:320
			},
			tipsText:{
				type:String,
				default:'暂无数据'
			}
		}
	}
</script>

<style>
.custom_nullData{
  width:100%;
}
.nullBg{
  width:500upx;
  height: 500upx;
  margin:320upx 125upx 80upx 125upx;
}
.tipsText{
  width:100%;
  box-sizing: border-box;
  font-size: 28upx;
  color:#ccc;
  text-align: center;
}
</style>
