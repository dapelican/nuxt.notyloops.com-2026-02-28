<script setup>
const props = defineProps({
  current_page: {
    type: Number,
    required: true,
  },
  total_pages: {
    type: Number,
    required: true,
  },
  base_path: {
    type: String,
    required: true,
  },
});

const page_number_list = computed(() => {
  const current = props.current_page;
  const total = props.total_pages;

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const array = [1];

  if (current > 3) {
    array.push('ellipsis-start');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i += 1) {
    array.push(i);
  }

  if (current < total - 2) {
    array.push('ellipsis-end');
  }

  if (total > 1) {
    array.push(total);
  }

  return array;
});
</script>

<template>
  <nav
    v-if="total_pages > 1"
    class="pagination"
  >
    <NuxtLink
      v-if="current_page > 1"
      :to="`${base_path}${current_page - 1}`"
      class="pagination-btn"
    >
      <Icon
        name="uil:angle-left-b"
        size="18"
      />
    </NuxtLink>
    <span
      v-else
      class="pagination-btn pagination-btn-disabled"
    >
      <Icon
        name="uil:angle-left-b"
        size="18"
      />
    </span>

    <template
      v-for="page_number in page_number_list"
      :key="page_number"
    >
      <span
        v-if="typeof page_number === 'string'"
        class="pagination-ellipsis"
      >
        &hellip;
      </span>
      <NuxtLink
        v-else-if="page_number !== current_page"
        :to="`${base_path}${page_number}`"
        class="pagination-btn"
      >
        {{ page_number }}
      </NuxtLink>
      <span
        v-else
        class="pagination-btn pagination-btn-active"
      >
        {{ page_number }}
      </span>
    </template>

    <NuxtLink
      v-if="current_page < total_pages"
      :to="`${base_path}${current_page + 1}`"
      class="pagination-btn"
    >
      <Icon
        name="uil:angle-right-b"
        size="18"
      />
    </NuxtLink>
    <span
      v-else
      class="pagination-btn pagination-btn-disabled"
    >
      <Icon
        name="uil:angle-right-b"
        size="18"
      />
    </span>
  </nav>
</template>

<style scoped>
.pagination {
  align-items: center;
  display: flex;
  gap: 4px;
  justify-content: center;
  padding: 1.5rem 0;
}

.pagination-btn {
  align-items: center;
  background: var(--color-pagination-bg);
  border: 1px solid var(--color-pagination-border);
  border-radius: 6px;
  color: var(--color-pagination);
  cursor: pointer;
  display: flex;
  font-size: 0.9rem;
  height: 36px;
  justify-content: center;
  min-width: 36px;
  padding: 0 8px;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}

.pagination-btn:hover:not(.pagination-btn-active):not(.pagination-btn-disabled) {
  background: var(--color-pagination-hover);
}

.pagination-btn-active {
  background: var(--color-main);
  border-color: var(--color-main);
  color: var(--color-pagination-active);
  cursor: default;
  font-weight: 600;
}

.pagination-btn-disabled {
  cursor: default;
  opacity: 0.4;
}

.pagination-ellipsis {
  color: var(--color-pagination-ellipsis);
  min-width: 24px;
  text-align: center;
}
</style>
