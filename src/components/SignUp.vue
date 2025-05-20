<script setup>
import axios from 'axios';
import { onMounted, reactive } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter()

const state = reactive({
  isLoading: true
})

const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  password2:''
})

const API_URL = 'http://localhost:3000/users/'

const handleSignUp = async () => {

  const signUp = {
    name: form.name,
    username: form.username,
    email: form.email,
    password: form.password,
    password2: form.password2
  }

  try {
    const response = await axios.get(API_URL)
    const getUsers = response.data

    const userExists = getUsers.some(user => user.username === signUp.username || user.email === signUp.email)
    if(userExists){
      return alert('Username or Email already exists')
    }
    else if(signUp.password === signUp.password2) {
      const response = await axios.post(API_URL, signUp)
      if(response.status == 201) {
        // localStorage.setItem("userInfo", JSON.stringify(response.data))
        router.push('/')
      }
    } else {
      return alert('password does not matchs')
    }
  } catch (error) {
    console.error(error)
  } finally {
    state.isLoading = false
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
    <div class="flex flex-1 items-center justify-center bg-grey-50 p-6 md:p-10">
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
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Welcome!</h1>
          <p class="mt-2 text-gray-600">Please enter your details to sign up</p>
        </div>

        <form 
          @submit.prevent="handleSignUp"
          class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label htmlFor="email" class="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your Name"
                required
                v-model="form.name"
                class="mt-1 block w-full rounded-full border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="email" class="block text-sm font-medium text-gray-700">
                Username
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
              <label htmlFor="email" class="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                v-model="form.email"
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

            <div>
              <label htmlFor="password" class="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Enter your confirmation password"
                required
                v-model="form.password2"
                class="mt-1 block w-full rounded-full border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
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
          Already have an account?
          <RouterLink to="/" class="font-medium text-purple-600 hover:text-purple-500">
            Sign In
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>