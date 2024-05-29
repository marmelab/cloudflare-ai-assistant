<style>
* {
  box-sizing: border-box;
}

html {
  height: 100%;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

html,
body,
#__nuxt {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  line-height: 1.5;
}

body,
#__nuxt {
  flex-grow: 1;
}
</style>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
