<style>
header,
main,
footer {
  display: flex;
  margin: auto;
  width: 100%;
}

@media (min-width: 768px) {
  header,
  main,
  footer {
    width: 720px;
  }
}

@media (min-width: 992px) {
  header,
  main,
  footer {
    width: 960px;
  }
}

@media (min-width: 1200px) {
  header,
  main,
  footer {
    width: 1140px;
  }
}

header,
footer {
  flex-direction: row;
  padding: 8px;
}

main {
  flex-direction: column;
  flex-grow: 1;
  padding: 8px;
}
</style>

<template>
  <main>
    <slot />
  </main>
  <footer>
    &copy;&nbsp;2024&nbsp;
    <a href="https://marmelab.com/" target="_blank" rel="noopener noreferrer"
      >Marmelab</a
    >
  </footer>
</template>