<template>
	<div class="clipLists">
		<ul>
			<li v-for="item in listData" :key="item.id" ref="li" @click="transmitData(item)">
				<div class="time">
					<span class="mainTime">{{ item.formattedTime }}</span>
					<span class="subTime">{{ item.formattedDate }}</span>
				</div>
				<div class="interval"></div>
				<div class="content">
					<div class="index">No.{{ item.id }}</div>
					<p class="contents">
						{{ item.content }}
					</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import { clipStore } from "@/stores/clip.js";

export default {
	props: ["clipListData"],
	data() {
		const clip = clipStore();
		return {
			handleClip: clip,
			listData: [],
		};
	},
	methods: {
		handleTime(timeStr) {
			// 解析时间字符串
			const date = new Date(timeStr);

			// 获取月日时分
			const month = date.toLocaleDateString("en-us", { month: "long" });
			const day = date.getDate();
			const hour = date.getHours();
			const minutes = date.getMinutes();

			// 格式化小时和分钟
			const formattedHours = hour.toString().padStart(2, "0");
			const formattedMinutes = minutes.toString().padStart(2, "0");

			// 判断AM or PM
			const period = hour >= 12 ? "PM" : "AM";

			// 格式化后的时间字符串
			const formattedDate = `${month} ${day}`;
			const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
			return { formattedDate, formattedTime };
		},
		handleData(listData) {
			this.listData = [];
			for (let i = 0; i < listData.length; i++) {
				// 格式化时间并添加到数组中
				let { formattedDate, formattedTime } = this.handleTime(listData[i].createdAt);
				listData[i].formattedDate = formattedDate;
				listData[i].formattedTime = formattedTime;
				this.listData.push(listData[i]);
			}
		},
		transmitData(item) {
			this.$emit("update:dataProp", item);
		},
	},
	watch: {
		clipListData(newValue, oldValue) {
			if (newValue !== null) {
				this.handleData(newValue);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/components/clipList.scss";
</style>
