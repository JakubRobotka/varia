<template>
  <div id="container">
    <SkipToContent
      class="absolute px-2 py-2 m-2 bg-teal-500 text-white shadow-md"
      contentId="#main"
    >
      Skip to Main Content
    </SkipToContent>
    <nav id="nav" aria-labelledby="main-nav-label">
      <span id="main-nav-label" data-varia-visually-hidden="true"
        >main navigation</span
      >
      <router-link to="/">Home</router-link>
      <router-link to="/buttons" :aria-current="isCurrentRoute('Buttons')">
        Buttons
      </router-link>
      <router-link
        to="/disclosures"
        :aria-current="isCurrentRoute('Disclosures')"
      >
        Disclosures
      </router-link>
      <router-link
        to="/accordions"
        :aria-current="isCurrentRoute('Accordions')"
      >
        Accordions
      </router-link>
      <router-link to="/popovers" :aria-current="isCurrentRoute('Popovers')">
        Popovers
      </router-link>
      <router-link to="/dialogs" :aria-current="isCurrentRoute('Dialogs')">
        Dialogs
      </router-link>
      <router-link to="/focustraps" :aria-current="isCurrentRoute('FousTraps')">
        FocusTraps
      </router-link>
      <router-link to="/listbox" :aria-current="isCurrentRoute('ListBox')">
        ListBox
      </router-link>
      <router-link to="/tabs" :aria-current="isCurrentRoute('Tabs')">
        Tabs
      </router-link>
    </nav>
    <main
      id="main"
      class="text-left mx-auto"
      aria-labelledby="main-content-label"
      aria-describedby="main-content-description"
    >
      <VisuallyHidden id="main-content-label">
        Main Content Area
      </VisuallyHidden>
      <VisuallyHidden id="main-content-description">
        <template v-if="$route.meta.description">
          {{
            $route.meta.description ||
              `This page contains examples for ${$route.name} components`
          }}
        </template>
        <template v-else>
          This area contains the demonstration of each page's component or
          feature
        </template>
      </VisuallyHidden>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { SkipToContent, VisuallyHidden } from '@varia/widgets'
export default defineComponent({
  name: 'App',
  components: {
    SkipToContent,
    VisuallyHidden,
  },
  setup() {
    const route = useRoute()
    return {
      isCurrentRoute: (name: string) =>
        route.name === name ? 'page' : undefined,
    }
  },
})
</script>

<style>
#container {
  display: flex;
  margin: 0;
  min-height: 100vh;
}

#nav {
  padding: 30px;
  flex: 0 0 250px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  display: block;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#main {
  margin: 30px;
  max-width: 980px;
  flex: 1 1 auto;
}
</style>
