<template>
  <div class="list-item">
    <div class="image" :style="{ backgroundImage: `url(${img})` }" />
    <span class="title">{{ name }}</span>
  </div>

</template>

<script setup>

defineProps({
  img: String,
  name: String
})

</script>

<style lang="scss">

.list-item {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 10px;
  background: #fbfbfb;
  border: 1px solid rgb(130, 162, 170);
  margin: 10px;
  cursor: pointer;
  &:hover {
    border-color: rgb(33, 167, 129);
  }

  .title {
    font-size: 24px;
  }

  .image {
    width: 100%;
    height: 200px;
    background: no-repeat center / cover;
  }
}

</style>
