<template>
    <nav class="bottom-navigation">
        
        <router-link
        to="/"
        class="naviation-item"
        exact-active-class="active"
        >
        <span class="navigation-icon">⌂</span>
        <span>홈</span>
        </router-link>
        
        <router-link
        to="/analysis"
        class="naviation-item"
        exact-active-class="active"
        >
        <span class="navigation-icon">⌕</span>
        <span>분석</span>
        </router-link>
        
        <router-link
        to="/history"
        class="naviation-item"
        exact-active-class="active"
        >
        <span class="navigation-icon">▤</span>
        <span>기록</span>
        </router-link>
        <router-link
        to="/guide"
        class="naviation-item"
        exact-active-class="active"
        >
        <span class="navigation-icon">ⓘ</span>
        <span>안내</span>
        </router-link>
    </nav>

</template>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 100;

  display: grid;
  grid-template-columns: repeat(4, 1fr);

  width: min(100%, var(--mobile-width));
  height: calc(72px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);

  background-color: var(--color-surface);
  border-top: 1px solid #2a2a2a;

  transform: translateX(-50%);
}

.navigation-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  color: var(--color-text-secondary);
  font-size: 12px;
  text-decoration: none;
}

.navigation-icon {
  font-size: 22px;
}

.navigation-item.active {
  color: var(--color-primary);
  font-weight: 700;
}
</style>