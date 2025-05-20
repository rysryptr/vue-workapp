<script setup>
import axios from 'axios';
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const form = reactive({
  username: '',
  password: ''
})

const handleSignIn = async () => {
  
  const signIn = {
    username: form.username,
    password: form.password
  }

  try {
    const response = await axios.get(`http://localhost:3000/users?username=${signIn.username}&password=${signIn.password}`)
    
    if(response.status == 200 && response.data.length > 0) {
      localStorage.setItem('userInfo', JSON.stringify(response.data[0]))
      router.push('/home')
    } else {
      return alert('Invalid Credential')
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  const user = localStorage.getItem('userInfo')

  if(user) {
    router.push('/')
  }
})
</script>

<template>
  <div class="flex min-h-screen flex-col md:flex-row">
    <div class="flex flex-1 items-center justify-center p-6 md:p-10">
      <div class="max-w-md">
        <img
          src="../assets/illustration-login.jpg"
          alt="Illustration of person working with documents"
          width="600"
          height="600"
          class="h-auto w-full"
        />
      </div>
    </div>

    <div class="flex flex-1 flex-col items-center justify-center p-6 md:p-10">
      <div class="w-full max-w-md space-y-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Welcome back</h1>
          <p class="mt-2 text-gray-600">Please enter your details to sign in</p>
        </div>

        <form 
          @submit.prevent="handleSignIn"
          class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label htmlFor="username" class="block text-sm font-medium text-gray-700">
                username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                required
                v-model="form.username"
                class="mt-1 block w-full rounded-full border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                v-model="form.password"
                class="mt-1 block w-full rounded-full border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
            </div>

            <div class="flex items-center justify-end">
              <div class="text-sm">
                <a href="#" class="font-medium text-purple-600 hover:text-purple-500">
                  Forgot password?
                </a>
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="w-full rounded-full bg-purple-600 px-4 py-3 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Sign in
          </button>
        </form>

        <div class="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <RouterLink 
            to="/sign-up"
            href="#" class="font-medium text-purple-600 hover:text-purple-500">
            Sign up
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>