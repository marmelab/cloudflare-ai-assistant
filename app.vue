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

a {
  color: #006596;
}

a:hover {
  text-decoration: none;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  padding: 0;
  margin: 0;
}

form {
  flex-grow: 1;
}

form,
label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  gap: 4px;
}

input,
textarea,
button {
  border-radius: 4px;
  font-size: 1rem;
}

input,
textarea {
  padding: 4px;
}

input,
button {
  height: 32px;
  vertical-align: middle;
  line-height: 26px;
}

button {
  background-color: #006596;
  color: #ffffff;
  border: 0;
  cursor: pointer;
  text-align: center;
  padding: 4px 8px;
}

button:disabled {
  background-color: #526172;
  cursor: not-allowed;
}
</style>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
