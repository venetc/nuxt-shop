<template>
  <div class="text-3xl">
    <div
      v-for="product in 20"
      :key="product.toString"
    >
      Product {{ product }} page {{ $route.query }}
    </div>
  </div>
</template>
