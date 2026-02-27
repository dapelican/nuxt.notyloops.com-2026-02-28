<script setup>
const { loggedIn: logged_in, clear } = useUserSession();
const show_mobile_menu = ref(false);
const show_submenu = ref(false);
const theme_toggle_ref = ref(null);

const toggleMobileMenu = () => {
  show_mobile_menu.value = !show_mobile_menu.value;
  if (!show_mobile_menu.value) {
    show_submenu.value = false;
  }
};

const toggleSubmenu = () => {
  show_submenu.value = !show_submenu.value;
};

const logOut = async () => {
  show_submenu.value = false;
  await $fetch('/a/log-out', { method: 'POST' });
  await clear();
  navigateTo('/a/log-in');
};
</script>

<template>
  <section v-if="logged_in">
    <nav class="navbar-mobile-1">
      <Icon
        :name="show_mobile_menu ? 'uil:times' : 'uil:bars'"
        class="mobile-menu-icon"
        @click="toggleMobileMenu"
      />
      <NuxtLink
        id="website-title"
        to="/"
        class="navbar-link"
      >
        OptiLeague
      </NuxtLink>
      <span>&nbsp;</span>
    </nav>

    <nav
      v-if="show_mobile_menu"
      id="navbar-mobile-2"
      class="navbar-mobile-2"
    >
      <span
        class="navbar-link submenu-toggle"
        @click="toggleSubmenu"
      >
        {{ $t('t_my_account') }}
        <Icon
          :name="show_submenu ? 'uil:angle-up' : 'uil:angle-down'"
          class="submenu-toggle-icon"
        />
      </span>

      <div
        v-if="show_submenu"
        class="mobile-submenu"
      >
        <div
          class="mobile-submenu-row"
          @click.self="theme_toggle_ref?.toggleTheme()"
        >
          <ThemeToggleElement
            ref="theme_toggle_ref"
            show_label
          />
        </div>

        <NuxtLink
          to="/a/connection-information"
          class="mobile-submenu-row"
          @click="toggleSubmenu"
        >
          <Icon
            name="uil:user"
            class="mobile-submenu-icon"
          />
          <span>{{ $t('t_my_connection_information') }}</span>
        </NuxtLink>

        <div
          class="mobile-submenu-row mobile-submenu-row-logout"
          @click="logOut"
        >
          <Icon
            name="uil:signout"
            class="mobile-submenu-icon"
          />
          <span>{{ $t('t_log_out') }}</span>
        </div>
      </div>
    </nav>
  </section>

  <section v-else>
    <nav class="navbar-mobile-1">
      <Icon
        :name="show_mobile_menu ? 'uil:times' : 'uil:bars'"
        class="mobile-menu-icon"
        @click="toggleMobileMenu"
      />
      <NuxtLink
        id="website-title"
        to="/"
        class="navbar-link"
      >
        OptiLeague
      </NuxtLink>
      <span>&nbsp;</span>
    </nav>

    <nav
      v-if="show_mobile_menu"
      id="navbar-mobile-2"
      class="navbar-mobile-2"
    >
      <NuxtLink
        to="/a/log-in"
        class="navbar-link"
      >
        {{ $t('t_log_in') }}
      </NuxtLink>

      <NuxtLink
        to="/a/sign-up-1"
        class="navbar-link"
      >
        {{ $t('t_sign_up') }}
      </NuxtLink>

      <ThemeToggleElement />
    </nav>
  </section>
</template>

<style scoped>
section {
  --mobile-menu-row-gap: 0.5rem;
}

#website-title {
  font-family: var(--font-brand, serif);
  font-size: 30px;
}

.mobile-submenu {
  align-items: center;
  display: flex;
  flex-direction: column;
  row-gap: var(--mobile-menu-row-gap);
  width: 100%;
}

.mobile-menu-icon {
  color: var(--color-text-on-button);
  cursor: pointer;
  font-size: 1.8rem;
}

.mobile-submenu-icon {
  font-size: 1.1rem;
}

.mobile-submenu-row {
  align-items: center;
  color: var(--color-text-on-button);
  cursor: pointer;
  display: flex;
  gap: 0.75rem;
  white-space: nowrap;
}

.mobile-submenu-row:hover {
  text-decoration: underline;
}

.mobile-submenu-row :deep(.theme-toggle) {
  color: var(--color-text-on-button);
}

.mobile-submenu-row :deep(.theme-toggle-icon) {
  color: var(--color-text-on-button);
}

.mobile-submenu-row-logout {
  color: var(--color-log-out-action-on-main-color);
  font-weight: bold;
}

.navbar-link {
  color: var(--color-text-on-button);
  cursor: pointer;
}

.navbar-link:hover {
  color: var(--color-text-on-button);
  text-decoration: underline;
}

.navbar-mobile-1 {
  align-items: center;
  background-color: var(--color-main);
  display: flex;
  justify-content: space-between;
  padding: 5px 20px;
}

.navbar-mobile-2 {
  align-items: center;
  background-color: var(--color-main);
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  row-gap: var(--mobile-menu-row-gap);
  padding-bottom: 1rem;
}

.submenu-toggle {
  align-items: center;
  display: flex;
  gap: 0.25rem;
}

.submenu-toggle-icon {
  font-size: 1.2rem;
}
</style>
