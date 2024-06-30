<template>
	<div class="container">
		<router-view />
		<div class="switch">
			<router-link to="/" :class="{ select: isClip }">剪贴板</router-link>
			<router-link to="/file" :class="{ select: isFile }">文件夹</router-link>
			<div class="bg" ref="bg"></div>
		</div>
	</div>
</template>

<script>
import clip from "@/components/clip.vue";
import file from "@/components/file.vue";
import { gsap } from "gsap";

export default {
	components: {
		clip,
		file,
	},
	data() {
		return {
			isClip: true,
			isFile: false,
		};
	},
	watch: {
		"$route.path": {
			handler(newPath) {
				this.isClip = /^\/$/.test(newPath);
				this.isFile = /^\/file$/.test(newPath);
			},
		},
		isClip(newValue, oldValue) {
			if (!newValue) {
				gsap.to(this.$refs.bg, {
					duration: 0.4,
					x: 74,
				});
				return;
			}
			gsap.to(this.$refs.bg, {
				duration: 0.4,
				x: 0,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/App.scss";
</style>
