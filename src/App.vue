<template>
    <div class="container">
        <clip />
        <!-- <file /> -->
    </div>
</template>

<script>
import clip from "@/components/clip.vue";
import file from "@/components/file.vue";

export default {
    components: {
        clip,
        file,
    },
};
</script>

<style lang="scss" scoped>
.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    --color: #e1e1e1;
    background-color: #f3f3f3;
    background-image: linear-gradient(0deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%, transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%, transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%, transparent);
    background-size: 55px 55px;
}
</style>
