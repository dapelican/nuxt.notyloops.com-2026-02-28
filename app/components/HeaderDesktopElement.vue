<script setup>
const { loggedIn: logged_in, clear } = useUserSession();
const show_submenu = ref(false);
const submenu_container_ref = ref(null);
const theme_toggle_ref = ref(null);

const toggleSubmenu = () => {
  show_submenu.value = !show_submenu.value;
};

const logOut = async () => {
  show_submenu.value = false;
  await $fetch('/a/log-out', { method: 'POST' });
  await clear();
  navigateTo('/a/log-in');
};

const handleClickOutside = (event) => {
  if (submenu_container_ref.value && !submenu_container_ref.value.contains(event.target)) {
    show_submenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <section v-if="logged_in">
    <nav class="navbar-desktop">
      <NuxtLink
        id="website-title"
        to="/"
        class="navbar-link"
      >
        OptiLeague
      </NuxtLink>

      <div class="navbar-desktop-subgroup">
        <NuxtLink
          :to="CONNECTED_USER_LANDING_PAGE"
          class="navbar-link"
        >
          {{ $t('t_manage_notes') }}
        </NuxtLink>

        <NuxtLink
          to="/manage-tags/page/1"
          class="navbar-link"
        >
          {{ $t('t_manage_tags') }}
        </NuxtLink>

        <NuxtLink
          to="/review"
          class="navbar-link"
        >
          {{ $t('t_review') }}
        </NuxtLink>

        <NuxtLink
          to="/share"
          class="navbar-link"
        >
          {{ $t('t_share') }}
        </NuxtLink>

        <section
          ref="submenu_container_ref"
          class="submenu-container"
        >
          <span
            class="navbar-link"
            @click="toggleSubmenu"
          >{{ $t('t_my_account') }}</span>

          <div
            v-if="show_submenu"
            class="submenu"
          >
            <div
              class="submenu-row"
              @click.self="theme_toggle_ref?.toggleTheme()"
            >
              <ThemeToggleElement
                ref="theme_toggle_ref"
                show_label
              />
            </div>

            <NuxtLink
              to="/a/connection-information"
              class="submenu-row"
              @click="toggleSubmenu"
            >
              <Icon
                name="uil:user"
                class="submenu-logout-icon"
              />
              <span>{{ $t('t_my_connection_information') }}</span>
            </nuxtlink>

            <div
              class="submenu-row submenu-row-logout"
              @click="logOut"
            >
              <Icon
                name="uil:signout"
                class="submenu-logout-icon"
              />
              <span>{{ $t('t_log_out') }}</span>
            </div>
          </div>
        </section>
      </div>
    </nav>

    <div class="navbar-desktop-spacer" />
  </section>

  <section v-else>
    <nav class="navbar-desktop-logged-out">
      <NuxtLink
        id="website-title"
        to="/"
        class="navbar-link"
      >
        OptiLeague
      </NuxtLink>

      <div class="navbar-desktop-subgroup">
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
      </div>

      <div class="navbar-desktop-subgroup">
        <ThemeToggleElement />
      </div>
    </nav>

    <div class="navbar-desktop-spacer" />
  </section>
</template>

<style scoped>
#website-title {
  font-family: var(--font-brand, serif);
  font-size: 30px;
}

.navbar-desktop {
  align-items: center;
  background-color: var(--color-main);
  display: flex;
  column-gap: 4rem;
  flex-wrap: wrap;
  justify-content: center;
  padding: 5px 10px;
  row-gap: 1rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.navbar-desktop-logged-out {
  align-items: center;
  background-color: var(--color-main);
  display: flex;
  column-gap: 10rem;
  flex-wrap: wrap;
  justify-content: center;
  padding: 5px 30px;
  row-gap: 1rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.navbar-desktop-spacer {
  height: 3rem;
}

.navbar-desktop-subgroup {
  align-items: center;
  column-gap: 2rem;
  display: flex;
}

.navbar-link {
  color: var(--color-text-on-button);
  cursor: pointer;
}

.navbar-link:hover {
  color: var(--color-text-on-button);
  text-decoration: underline;
}

.submenu-container {
  position: relative;
}

.submenu {
  background-color: var(--color-background-contrasting);
  border: 1px solid var(--color-card-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--color-card-box-shadow);
  min-width: 200px;
  padding: 0.4rem 0;
  position: absolute;
  right: 0;
  top: calc(100% + 0.75rem);
  z-index: 1001;
}

.submenu-row {
  align-items: center;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  gap: 0.75rem;
  padding: 0.55rem 1rem;
  white-space: nowrap;
}

.submenu-row:hover {
  background-color: var(--color-background);
}

.submenu-row :deep(.theme-toggle-icon) {
  color: var(--color-text);
}

.submenu-row :deep(.theme-toggle) {
  color: var(--color-text);
}

.submenu-row-logout {
  color: var(--color-dangerous-action);
}

.submenu-logout-icon {
  font-size: 1.1rem;
}

.user-icon {
  color: white;
  cursor: pointer;
  font-size: 1.3rem;
}

.user-icon-container {
  align-items: center;
  border: 1px solid white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  padding: 0.5rem;
}
</style>
