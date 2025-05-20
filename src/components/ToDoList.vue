<script setup>
import Swal from 'sweetalert2';
import { Icon } from '@iconify/vue';
import { defineProps, toRefs, defineEmits, ref, onMounted } from 'vue';


const props = defineProps({
  task: Object
})

const { task } = toRefs(props)
const isEdit = ref(false)
let interval = null
const storedTime = localStorage.getItem(`task-${task.value.id}-time`)
// console.log("Time: ",storedTime)
const time = ref(storedTime ? parseInt(storedTime) : task.value.taskWorkingTime || 0)

const storedRunning = localStorage.getItem(`task-${task.value.id}-running`)
task.value.taskRunning = storedRunning === 'true' ? true : false

const emit = defineEmits(['saveUpdatedTask', 'saveUpdatedTask', 'removeTask'])

const changeProgress = async (taskId) => {
  if(taskId === task.value.taskId) {
    if(task.value.taskProgress === 0) {
      await Swal.fire({
        title: 'Ready to work on it?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if(result.isConfirmed) {
          Swal.fire("Let's Do Your Task!", "", "success")
          emit('saveUpdatedTask', {
            ...task.value,
            taskProgress: task.value.taskProgress + 1,
            taskRunning: true
          })
          startStop()
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info")
        }
      })
    } else if (task.value.taskProgress === 1) {
      await Swal.fire({
        title: 'Finished on it?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if(result.isConfirmed) {
          Swal.fire("Good job! Your Task Finished!", "", "success")
          emit('saveUpdatedTask', {
            ...task.value,
            taskProgress: task.value.taskProgress + 1,
            taskWorkingTime: time.value,
            taskRunning: false
          })
          localStorage.setItem(`task-${task.value.id}-running`, 'false')
          startStop()
        } else {
          Swal.fire("Continue Your Job!", "", "info")
          localStorage.setItem(`task-${task.value.id}-running`, 'true')
        }
      })
    } else if (task.value.taskProgress === 2) {
      await Swal.fire({
        title: 'Reset this task?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if(result.isConfirmed) {
          Swal.fire("Task time has been reset!", "", "success")
          emit('saveUpdatedTask', {
            ...task.value,
            taskWorkingTime: 0,
            taskProgress: 0
          })
          reset()
        } else {
          Swal.fire("Changes are not saved!", "", "info")
        }
      })
    }
  }
}

const startStop = () => {
  if(task.value.taskRunning) {
    clearInterval(interval)
    localStorage.setItem(`task-${task.value.id}-running`, 'false')
    localStorage.removeItem(`task-${task.value.id}-startTimeStamp`)
  } else {
    startTimer()
    localStorage.setItem(`task-${task.value.id}-running`, 'true')
    localStorage.setItem(`task-${task.value.id}-startTimeStamp`, Date.now())
  }
}

const startTimer = () => {
  interval = setInterval(() => {
    time.value += 1000
    localStorage.setItem(`task-${task.value.id}-time`, time.value)
  }, 1000)
}

const reset = () => {
  clearInterval(interval)
  time.value = 0
  localStorage.setItem(`task-${task.value.id}-running`, 'false')
  localStorage.setItem(`task-${task.value.id}-time`, 0)
}

const formatTime = (ms) => {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)

  return `${String(hours).padStart(2, '0')}:` +
          `${String(minutes).padStart(2, '0')}:` +
          `${String(seconds).padStart(2, '0')}`
}

const editTask = () => {
  isEdit.value = true
}

const saveTask = (taskId) => {
  if(taskId === task.value.taskId) {

    emit('saveUpdatedTask', {
      ...task.value,
      taskSeverity: parseInt(task.value.taskSeverity) 
    })
  }

  isEdit.value = false
}

const removeTask = (taskId) => {
  if(taskId === task.value.taskId) {
    emit('removeTask', {
      ...task.value
    })
    
    localStorage.removeItem(`task-${task.value.id}-time`)
    localStorage.removeItem(`task-${task.value.id}-startTimeStamp`)
    localStorage.removeItem(`task-${task.value.id}-running`)
  }
}

onMounted(() => {
  if(storedRunning === 'true') {
    startTimer()
    task.value.taskRunning = true
  }

  const startTimeStamp = localStorage.getItem(`task-${task.value.id}-startTimeStamp`)

  if(startTimeStamp && task.value.taskRunning) {
    const elapsed = Date.now() - (parseInt(startTimeStamp) + time.value)
    console.log(elapsed)
    time.value += elapsed
    console.log(time.value)
    localStorage.setItem(`task-${task.value.id}-time`, time.value)
  }
  
})


</script>

<template>
  <div class="flex justify-between items-center text-gray-600 border-b border-gray-200 min-h-full">
    <div v-if="!isEdit" class="w-1/6">{{ task.taskName}}</div>
    <input v-else class="w-1/6 border-b border-sky-500 focus:outline-none focus:cursor-text" autofocus="autofocus" v-model="task.taskName">
    <div v-if="!isEdit" class="w-1/6 text-left">
      <!-- {{ task.taskSeverity === 1 ? 'Low' : task.taskSeverity === 2 ? 'Medium' : 'High' }} -->
      <p v-if="task.taskSeverity === '1'" class="text-sky-500 uppercase">Low</p>
      <p v-else-if="task.taskSeverity === '2'" class="text-yellow-500 uppercase">Medium</p>
      <p v-else class="animate-blink text-pink-500 uppercase">High</p>
    </div>
    <div v-else class="w-1/6 border-b border-sky-500 focus:outline-none">
      <select v-model="task.taskSeverity" class="w-full">
        <option :value="1">Low</option>
        <option :value="2">Medium</option>
        <option :value="3">High</option>
      </select>
    </div>
    <div v-if="!isEdit" class="w-1/6">{{ task.taskTime }} Minutes</div>
    <input v-else class="w-1/6 border-b border-sky-500 text-center focus:outline-none focus:cursor-text" v-model="task.taskTime">
    <div class="w-1/6">
      <!-- 00:00:00 -->
      {{ formatTime(time) }}
    </div>
    <div 
      @click="changeProgress(task.taskId)"
      class="w-1/6 text-center text-white py-4 hover:cursor-pointer"
      :class="{
        'bg-gray-300': task.taskProgress === 0,
        'bg-yellow-400': task.taskProgress === 1,
        'bg-green-500': task.taskProgress === 2
      }"
    >
      {{ task.taskProgress === 0 ? 'To Do' : task.taskProgress === 1 ? 'Working On It' : 'Done' }}
    </div>
    <div 
      v-if="!isEdit" 
      class="w-1/6 flex justify-center items-center gap-4 text-center">
      <span 
        class="text-yellow-500 hover:cursor-pointer"
        @click="editTask(task.taskId)"
      >
        <Icon 
          icon="icon-park-solid:edit" 
          class="w-6 h-6"
        />
      </span>
      <span 
        class="text-red-500 hover:cursor-pointer"
        @click="removeTask(task.taskId)"
        >
        <Icon 
          icon="material-symbols:delete-rounded" 
          class="w-6 h-6"
        />
      </span>
    </div>
    <div v-else class="w-1/6 text-center flex justify-center items-center ">
      <span class="text-green-500 hover:cursor-pointer"
        @click="saveTask(task.taskId)"
      >
        <Icon 
          icon="lets-icons:save-fill" 
          class="w-6 h-6"
        />
      </span>
    </div>
  </div>
</template>