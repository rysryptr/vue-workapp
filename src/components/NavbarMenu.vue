<script setup>
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';

const router = useRouter()

const user = localStorage.getItem('userInfo')
const name = JSON.parse(user || '{}').name || 'Guest';

// const name = JSON.parse(user).name || 'Guest'

const logout = () => {
  localStorage.clear()
  router.push('/')
}
</script>
<template>
  <nav class="bg-white w-full px-2 shadow-md">
    <div class="max-w-7xl mx-auto flex h-20 items-center justify-between">
      <RouterLink to="/">
        <div class="w-72 ">
          <span class="text-violet-600 font-bold text-2xl">W</span>
          <span class="text-gray-900 font-bold text-2xl">APP</span>
        </div>
      </RouterLink>
      <div>
        <span class="text-gray-600 font-medium text-sm">Hi, {{ name }}</span>
        <a href="#" @click="logout" class="text-black font-semibold p-3 text-sm">Logout</a>
      </div>
    </div>
  </nav>
</template>