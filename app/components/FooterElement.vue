<template>
  <hr class="separator-2">

  <div class="desktop-only">
    <FooterDesktopElement />
  </div>

  <div class="mobile-only">
    <FooterMobileElement />
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
