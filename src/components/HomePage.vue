<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavbarMenu from './NavbarMenu.vue';
import ToDoLists from './ToDoLists.vue';

const router = useRouter()

onMounted(() => {
  let user = localStorage.getItem('userInfo')

  if(!user) {
    router.push('/sign-in')
  }
})
</script>

<template>
  <div class="bg-gray-100 min-h-screen">
    <NavbarMenu />
    <ToDoLists />
  </div>
</template>