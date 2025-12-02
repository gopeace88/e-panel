<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item class="pa-4">
        <v-list-item-title class="text-h6 font-weight-bold">
          스마트 분전반
        </v-list-item-title>
        <v-list-item-subtitle>관제 시스템</v-list-item-subtitle>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          color="primary"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ currentTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-bell" variant="text"></v-btn>
      <v-btn icon="mdi-account-circle" variant="text"></v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer app class="bg-grey-lighten-3">
      <v-row justify="center" no-gutters>
        <v-col class="text-center" cols="12">
          <span class="text-caption">&copy; 2024 스마트 분전반 관제 시스템</span>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const drawer = ref(true)
const route = useRoute()

const currentTitle = computed(() => route.meta.title || '스마트 분전반')

const menuItems = [
  { title: '대시보드', icon: 'mdi-view-dashboard', to: '/' },
  { title: 'QR 스캔', icon: 'mdi-qrcode-scan', to: '/scan' },
  { title: '분전반 목록', icon: 'mdi-format-list-bulleted', to: '/panels' },
  { title: '점검 스케줄', icon: 'mdi-calendar-check', to: '/schedule' },
  { title: '작업 이력', icon: 'mdi-history', to: '/history' },
  { title: '보고서', icon: 'mdi-file-chart', to: '/reports' },
]
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
}
</style>
