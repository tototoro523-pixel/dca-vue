<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value),
  },

  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  loading: {
    type: Boolean,
    default: false,
  },

  fullWidth: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (props.disabled || props.loading) {
    return
  }

  emit('click', event)
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading"
    :class="[
      'base-button',
      `base-button--${variant}`,
      {
        'base-button--full': fullWidth,
      },
    ]"
    @click="handleClick"
  >
    <span v-if="loading">처리 중...</span>
    <slot v-else />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 48px;
  padding: 0 20px;

  color: #ffffff;
  font-size: 16px;
  font-weight: 700;

  border: 1px solid transparent;
  border-radius: var(--radius-medium, 16px);
  cursor: pointer;

  transition:
    opacity 0.2s ease,
    transform 0.1s ease;
}

.base-button--full {
  width: 100%;
}

.base-button--primary {
  color: #ffffff;
  background-color: var(--color-primary, #2563eb);
}

.base-button--secondary {
  color: var(--color-primary, #2563eb);
  background-color: transparent;
  border-color: var(--color-primary, #2563eb);
}

.base-button:hover:not(:disabled) {
  opacity: 0.9;
}

.base-button:active:not(:disabled) {
  transform: scale(0.98);
}

.base-button:disabled {
  color: #6b7280;
  background-color: #2a2a2a;
  border-color: #2a2a2a;
  cursor: not-allowed;
  opacity: 0.65;
}
</style>