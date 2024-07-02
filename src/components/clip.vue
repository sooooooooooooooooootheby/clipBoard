<template>
	<div class="clipList" ref="clipList">
		<clipList :clipListData="handleClip.clipListData" @update:data-prop="handleDataChange" />
	</div>
	<div class="bg" @click="showClipList" v-if="isClipList"></div>
	<div class="clip">
		<div class="nav">
			<div class="title" @click="showClipList">
				<svg class="icon" aria-hidden="true">
					<use xlink:href="#bookmark"></use>
				</svg>
				<span>剪贴板</span>
			</div>
			<div class="buttonNav">
				<button class="warn" v-if="put" @click="handleDel">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#delete"></use>
					</svg>
					<p>删除</p>
				</button>
				<button class="brand" @click="handleCopy">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#copy-1"></use>
					</svg>
					<p>复制</p>
				</button>
				<button class="brand" @click="handleSave">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#save"></use>
					</svg>
					<p>保存</p>
				</button><button class="brand" @click="initialized">
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#save"></use>
					</svg>
					<p>新clipBoard</p>
				</button>
			</div>
		</div>
		<div class="text">
			<v-md-editor v-model="content.text" height="100%"></v-md-editor>
		</div>
		<div class="state">
			<div class="index">No.{{ content.id }}</div>
			<span class="time">{{ content.time }}</span>
		</div>
	</div>
</template>

<script>
import { clipStore } from "@/stores/clip.js";
import clipList from "./clipList.vue";
import { gsap } from "gsap";
import autolog from "autolog.js";

export default {
	components: {
		clipList,
	},
	data() {
		const clip = clipStore();
		return {
			handleClip: clip,

			content: {
				text: "",
				id: "new",
				time: "",
			},
			isClipList: false,
			data: null,

			// 判断是否为旧的剪贴板
			put: false,
		};
	},
	methods: {
		// 获取所有的clipboard
		async getClipboard() {
			try {
				await this.handleClip.getClipboard();
			} catch (error) {
				console.error(error);
			}
		},
		// 创建一个新的clipboard
		async createClipboard() {
			try {
				await this.handleClip.createClipboard({ content: this.content.text });
				this.initialized();
			} catch (error) {
				console.error(error);
			}
		},
		// 更新clipboard
		async updateClipboard() {
			try {
				await this.handleClip.updateClipboard({ id: this.content.id, content: this.content.text });
				this.initialized();
			} catch (error) {
				console.error(error);
			}
		},
		// 删除clipboard
		async deleteClipboard() {
			try {
				await this.handleClip.deleteClipboard({ id: this.content.id });
				this.initialized();
			} catch (error) {
				console.error(error);
			}
		},
		handleSave() {
			if (this.content.text === "") {
				return autolog.log("内容不能为空", "warn", 2500);
			}
			if (this.put) {
				// 执行更新操作
				return this.updateClipboard();
			}
			this.createClipboard();
		},
		handleDel() {
			this.deleteClipboard();
		},
		showClipList() {
			if (this.isClipList) {
				this.isClipList = false;
				gsap.to(this.$refs.clipList, {
					duration: 1,
					x: -200,
					opacity: 0,
					ease: "back.out(1.4)",
				});
				this.handleClip.clipListData = null;
				return;
			}

			this.isClipList = true;
			gsap.to(this.$refs.clipList, {
				duration: 1,
				x: 400,
				opacity: 1,
				ease: "back.out(1.4)",
			});
			this.getClipboard();
		},
		handleTime() {
			// 解析时间字符串
			const date = new Date();

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
			this.content.time = `${formattedDate} ${formattedTime}`;
		},
		handleDataChange(newValue) {
			this.put = true;
			this.content.id = newValue.id;
			this.content.time = `${newValue.formattedDate} ${newValue.formattedTime}`;
			this.content.text = newValue.content;
			this.showClipList();
		},
		initialized() {
			this.put = false;
			this.content.text = "";
			this.handleTime();
			this.content.id = "new";
		},
		// 复制
		handleCopy() {
			this.$copyText(this.content.text).then(
				(e) => {
					autolog.log("复制成功", "success", 2500);
				},
				function (e) {
					autolog.log("复制失败", "error", 2500);
				}
			);
		},
	},
	mounted() {
		this.handleTime();
	},
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/components/clip.scss";
</style>
