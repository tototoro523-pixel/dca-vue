<script setup>
const model = defineModel({
  default: null,
})

defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '0',
  },
  unit: {
    type: String,
    default: '억원',
  },
  helpText: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const handleInput = (event) => {
  const inputValue = event.target.value

  if (inputValue === '') {
    model.value = null
    return
  }

  model.value = Number(inputValue)
}
</script>

<template>
  <div class="input-field">
    <label
      :for="id"
      class="input-label"
    >
      {{ label }}
      <span
        v-if="required"
        class="required-mark"
      >
        *
      </span>
    </label>

    <div
      :class="[
        'number-input-wrapper',
        {
          'number-input-wrapper--error': errorMessage,
        },
      ]"
    >
      <input
        :id="id"
        type="number"
        inputmode="decimal"
        :value="model ?? ''"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :min="min"
        :aria-invalid="Boolean(errorMessage)"
        class="number-input"
        @input="handleInput"
      />

      <span class="number-unit">
        {{ unit }}
      </span>
    </div>

    <p
      v-if="errorMessage"
      class="input-message input-message--error"
    >
      {{ errorMessage }}
    </p>

    <p
      v-else-if="helpText"
      class="input-message"
    >
      {{ helpText }}
    </p>
  </div>
</template>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  color: var(--color-text-primary, #ffffff);
  font-size: 14px;
  font-weight: 700;
}

.required-mark {
  color: var(--color-danger, #ef4444);
}

.number-input-wrapper {
  display: flex;
  align-items: center;
  min-height: 48px;

  background-color: #242424;
  border: 1px solid #343434;
  border-radius: var(--radius-small, 12px);
}

.number-input-wrapper:focus-within {
  border-color: var(--color-primary, #2563eb);
}

.number-input-wrapper--error {
  border-color: var(--color-danger, #ef4444);
}

.number-input {
  width: 100%;
  min-width: 0;
  height: 46px;
  padding: 0 8px 0 14px;

  color: var(--color-text-primary, #ffffff);
  font-size: 16px;

  background: transparent;
  border: 0;
  outline: none;
}

.number-input::placeholder {
  color: #6b7280;
}

.number-input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.number-unit {
  flex-shrink: 0;
  padding-right: 14px;

  color: var(--color-text-secondary, #9ca3af);
  font-size: 14px;
}

.input-message {
  margin: 0;

  color: var(--color-text-secondary, #9ca3af);
  font-size: 12px;
  line-height: 1.5;
}

.input-message--error {
  color: var(--color-danger, #ef4444);
}
</style>
