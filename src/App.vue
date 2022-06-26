<template>
  <div class="main-container">
    <div class="left-bar">
      <ListItem
        v-for="(item, i) in dataJson"
        :key="`list-item-${i}`"
        :img="item.img"
        :name="item.name"
        @click="itemClickHandler(item)"
      />
    </div>
    <div
      class="right-space"
      ref="threeMount"
      @pointermove="canvasMoveHandler"
      @click="canvasClickHandler"
    >
    <Transition name="fade">
      <div class="rotate-message" v-if="showMessage">
        <div v-show="showRotateMessage">Use up/down keys to rotate the object</div>
        <div>Press esc to cancel</div>
      </div>
    </Transition>
    </div>
  </div>
</template>

<script setup>
import dataJson from '@/assets/json/data.json'
import ListItem from '@/components/ListItem.vue'
import { onMounted, ref } from 'vue'
import { init, moveObject, addObject, placeObject, keyHandler } from '@/three/'

const threeMount = ref()
onMounted(() => {
  init(threeMount.value)
  document.addEventListener('keydown', keydownHandler)
})

async function itemClickHandler(item) {
  showMessage.value = true
  showRotateMessage.value = item.isSpinnable
  addObject(item)
}

function canvasMoveHandler(e) {
  moveObject(e)
}

function canvasClickHandler() {
  showMessage.value = false
  placeObject()
}

function keydownHandler(e) {
  if (e.metaKey) return
  e.preventDefault()
  if (e.key == 'Escape') showMessage.value = false
  keyHandler(e)
}

const showMessage = ref(false)
const showRotateMessage = ref(false)

</script>

<style scoped lang="scss">
.main-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  height: 100vh;
  width: 100vw;

  &>div {
    height: 100%;
  }

  .left-bar {
    background: #e5ecee;
    border-right: 2px solid rgb(130, 162, 170);
    overflow-y: auto;
  }

  .right-space {
    position: relative;
  }
}

.rotate-message {
  position: absolute;
  background: rgba(black, 0.5);
  color: white;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px;
  text-align: center;
}
</style>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  user-select: none;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
</style>
