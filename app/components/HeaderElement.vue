<template>
  <div class="desktop-only">
    <HeaderDesktopElement />
  </div>
  <div class="mobile-only">
    <HeaderMobileElement />
  </div>
</template>

<style scoped>
@media (max-width: 1199px) {
  .desktop-only {
    display: none;
  }
}

@media (min-width: 1200px) {
  .mobile-only {
    display: none;
  }
}
</style>
