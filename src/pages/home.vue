<template>
  <div>
    <label>
      <input type="checkbox" v-model="useIce"/>
      使用冰块
    </label>
<!--    <div v-if="useIce" class="ice-tip">-->
<!--      粉的粗细要比普通手冲细一些-->
<!--    </div>-->
    <div>
      <label>
        咖啡粉重量（克）:
        <input type="number" v-model.number="coffeeWeight" style="color: #555555"/>
      </label>
    </div>
    <div v-if="useIce">
      <h3>冰块重量和注水信息</h3>
      <p>冰块重量: {{ iceWeight }} 克</p>
      <p>第一次注水: {{ waterWeights[0] }} 克，时间: 0 秒</p>
      <p>第二次注水: {{ waterWeights[1] }} 克，时间: {{ intervals[0] }} 秒</p>
    </div>
    <div v-else>
      <h3>注水信息</h3>
      <p>第一次注水: {{ waterWeights[0] }} 克，时间: 0 秒</p>
      <p>第二次注水: {{ waterWeights[1] }} 克，时间: {{ intervals[0] }} 秒</p>
      <p>第三次注水: {{ waterWeights[2] }} 克，时间: {{ intervals[1] }} 秒</p>
    </div>
    <div>
      <button @click="startTimer">开始计时</button>
      <button @click="resetTimer">重置计时</button>
      <p>当前时间: {{ currentTime }} 秒</p>
    </div>
  </div>
</template>

<script>
import {computed, ref, watch} from 'vue';

export default {
  setup() {
    const useIce = ref(false);
    const coffeeWeight = ref(0);
    const currentTime = ref(0);
    let timer = null;

    const iceWeight = computed(() => coffeeWeight.value * 1.5);

    const waterWeights = computed(() => {
      if (useIce.value) {
        return [coffeeWeight.value * 10, coffeeWeight.value * 5];
      } else {
        return [
          coffeeWeight.value * 3,
          coffeeWeight.value * 3,
          coffeeWeight.value * 4
        ];
      }
    });

    const intervals = computed(() => {
      if (useIce.value) {
        return [60];
      } else {
        return [45, 90];
      }
    });

    const startTimer = () => {
      resetTimer();
      timer = setInterval(() => {
        currentTime.value++;
        checkIntervals();
      }, 1000);
    };

    const resetTimer = () => {
      clearInterval(timer);
      currentTime.value = 0;
    };

    const checkIntervals = () => {
      intervals.value.forEach((interval, index) => {
        if (currentTime.value === interval) {
          playSound();
          alert(`第${index + 1}次注水时间到了！`);
        }
      });
    };

    const playSound = () => {
      const audio = new Audio('https://www.soundjay.com/button/beep-07.wav');
      audio.play();
    };

    watch([useIce, coffeeWeight], () => {
      console.log('使用冰块:', useIce.value);
      console.log('咖啡粉重量:', coffeeWeight.value);
    });

    return {
      useIce,
      coffeeWeight,
      iceWeight,
      waterWeights,
      intervals,
      currentTime,
      startTimer,
      resetTimer
    };
  }
};
</script>

<style scoped>
.ice-tip {
  color: red;
  font-weight: bold;
}
</style>


<!--<template>-->
<!--  <div class="vh-homes gap-8">-->
<!--    <div class="flex gap-12">-->
<!--      <img src="/vite.svg" class="logo" alt="Vite logo" />-->
<!--      <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />-->
<!--    </div>-->

<!--    <h1>{{ msg }}</h1>-->

<!--    <div>{{ msg }}</div>-->

<!--    <div class="selector">-->
<!--      <input type="checkbox" name="darken" id="" v-model="darken" />-->
<!--      <label for="darken">暗黑模式</label>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref, reactive } from 'vue'-->
<!--const props = defineProps({})-->

<!--const msg = ref('Hello, Vite + Vue')-->

<!--let darken = ref(false)-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--.vh-homes {-->
<!--  height: 150vh;-->
<!--  width: 100%;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--  .logo {-->
<!--    height: 96px;-->
<!--    will-change: filter;-->
<!--    transition: filter 300ms;-->
<!--  }-->
<!--  .logo:hover {-->
<!--    filter: drop-shadow(0 0 2em #646cffaa);-->
<!--  }-->
<!--  .logo.vue:hover {-->
<!--    filter: drop-shadow(0 0 2em #42b883aa);-->
<!--  }-->

<!--  .selector {-->
<!--    // background: var(&#45;&#45;primary);-->

<!--    background: $secondary;-->
<!--  }-->
<!--}-->
<!--</style>-->
