import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "clip",
            component: () => import("@/components/clip.vue"),
        },
        {
            path: "/file",
            name: "file",
            component: () => import("@/components/file.vue"),
        },
    ],
});

export default router;
