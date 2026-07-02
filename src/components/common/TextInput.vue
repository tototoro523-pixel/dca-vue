<script setup>
const model = defineModel({
  default: '',
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
    default: '',
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
  disabled: {
    type: Boolean,
    default: false,
  },
})

const handleInput = (event) => {
  model.value = event.target.value.replace(/[^가-힣a-zA-Z\s]/g, '')
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

    <input
      :id="id"
      type="text"
      :value="model"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :aria-invalid="Boolean(errorMessage)"
      class="text-input"
      @input="handleInput"
    />

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

.text-input {
  width: 100%;
  min-height: 48px;
  padding: 0 14px;

  color: var(--color-text-primary, #ffffff);
  font-size: 16px;

  background-color: #242424;
  border: 1px solid #343434;
  border-radius: var(--radius-small, 12px);
  outline: none;
}

.text-input:focus {
  border-color: var(--color-primary, #2563eb);
}

.text-input[aria-invalid='true'] {
  border-color: var(--color-danger, #ef4444);
}

.text-input::placeholder {
  color: #6b7280;
}

.text-input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
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
