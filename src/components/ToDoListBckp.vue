<script setup>
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
import ToDoList from './ToDoList.vue';
import ChartsPage from './ChartsPage.vue';

const API_URL = 'http://localhost:3000/tasks';
const userId = JSON.parse(localStorage.getItem('userInfo')).id;
const isModalOpen = ref(false);
const modalTitle = ref('');
const isLoading = ref(false);
const state = reactive({ tasks: [] });
const formData = reactive({ taskName: '', taskTime: '' });
const chartRefreshKey = ref(0)

const openModal = () => {
  isModalOpen.value = true;
  Object.assign(formData, { taskName: '', taskTime: '' });
};
const closeModal = () => (isModalOpen.value = false);

const fetchTask = async () => {
  try {
    const { data } = await axios.get(`${API_URL}?taskUserId=${userId}`);
    state.tasks = data;
  } catch (error) {
    console.error(error);
  }
};

const fetchLatestTaskId = async () => {
  try {
    const response = await axios.get(API_URL)
    const sorted = response.data.sort((a, b) => b.taskId - a.taskId)

    return sorted.length > 0 ? sorted[0].taskId + 1 : 1
  } catch (error) {
    console.error(error);
  }
}

const handleSubmit = async () => {
  try {
    const newTaskId = await fetchLatestTaskId()
  
    await axios.post(API_URL, { ...formData, taskId: newTaskId, taskUserId: userId, taskWorkingTime: 0, taskRunning: false, taskProgress: 0 });
    chartRefreshKey.value++
    closeModal();
    fetchTask();
  } catch (error) {
    console.error(error)
  }
};

const updateTask = async (updatedTask) => {
  try {
    isLoading.value = true;
    await axios.put(`${API_URL}/${updatedTask.id}`,updatedTask)
    chartRefreshKey.value++
    fetchTask();
  } catch (error) {
    console.error("Updating task error: ", error);
  } finally {
    isLoading.value = false;
  }
};

const removeTask = async (removedTask) => {
  try {
    await axios.delete(`${API_URL}/${removedTask.id}`);
    chartRefreshKey.value++
    fetchTask();
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchTask);
</script>

<template>
  <div class="flex w-full mx-auto">
    <div class="bg-white max-w-7xl w-full mx-auto rounded-xl p-8 mt-4">
      <div class="flex justify-between items-center">
        <p class="text-gray-600 font-bold">To Do List</p>
        <button @click="openModal" class="text-white bg-violet-600 hover:bg-violet-800 text-sm font-semibold py-3 px-4 rounded-full">Add Task</button>
      </div>
      <div v-if="state.tasks.length" class="flex flex-col mt-8 p-4 border border-gray-200 rounded-3xl">
        <div class="flex text-center mb-2">
          <div class="w-1/6 font-bold">Task Name</div>
          <div class="w-1/6 font-bold">Task Severity</div>
          <div class="w-1/6 font-bold">Task Time</div>
          <div class="w-1/6 font-bold">Actual Time</div>
          <div class="w-1/6 font-bold">Task Progress</div>
          <div class="w-1/6 font-bold">Actions</div>
        </div>
        <ToDoList 
          v-for="task in state.tasks" 
          :key="task.taskId" 
          :task="task" 
          @saveUpdatedTask="updateTask" 
          @removeTask="removeTask" />
      </div>
      <div v-else class="mt-8 p-4 border border-gray-200 rounded-3xl flex justify-center text-gray-500 text-sm">What do you want to do today?</div>
    </div>
    
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-bold mb-4">{{ modalTitle }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Task Name</label>
            <input v-model="formData.taskName" type="text" required class="border p-2 w-full rounded">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Task Severity</label>
            <select v-model="formData.taskSeverity" type="text" required class="border p-2 w-full rounded">
              <option value="1" selected="selected">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Task Time</label>
            <input v-model="formData.taskTime" type="text" required class="border p-2 w-full rounded">
          </div>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">Submit</button>
          <button type="button" @click="closeModal" class="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
        </form>
      </div>
    </div>

    <div class="bg-white max-w-xl mx-auto rounded-xl p-8 mt-4">
      <ChartsPage :refresh-key="chartRefreshKey"/>
    </div>
  </div>
</template>
