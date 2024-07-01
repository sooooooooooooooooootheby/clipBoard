import { defineStore } from "pinia";
import axios from "axios";
import autolog from "autolog.js";
const autologOutTime = 2500;

export const fileStore = defineStore({
	id: "file",
	store: () => {
		return {
			fileListData: [],
            code: null,
		};
	},
	actions: {
		// 获取所有的file
		async getFileList() {
			try {
				const res = await axios.get("/files");
				if (res.data.length === 0) {
					return autolog.log("文件列表为空", autologOutTime);
				}
				this.fileListData = res.data;
			} catch (error) {
				console.log(error);
			}
		},
        // 删除指定的file
        async deleteFile({ id }) {
			try {
				const res = await axios.delete(`/files/${id}`);
				autolog.log("删除成功", "success", autologOutTime);
                this.code = true;
			} catch (error) {
				console.log(error);
				autolog.log("删除失败", "error", autologOutTime);
			}
		},
	},
});
