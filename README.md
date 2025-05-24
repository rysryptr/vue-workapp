# workapp

Vue WorkApp is a simple timer-based task management appilcation that helps users get work finished in a more focus and structured way.  

## 🚀 Features

- Register and login
- Create, edit, and delete task based on user
- Timer for actual task time
- Automatic local storage

## ➡️ Workflow

- When you open this project, you'll be directed to the sign in page
- If you do not have an account, you can go to sign up page
- Then if you have registered, you can sign in with username and password
- After logged in, you'll be directed to the home page
- The home page contains severity chart, progress chart, and task lists
- You can add task list by input: Task Name, Severity, and Time in minutes
- After you added a task, the task will be sorted by task severity from High, Medium, and Low. After that, the task also sorted by progress: Working on it, To Do, and Done
- On each task has actual time, it means your actual time to finish your activity
- Actual time run when you update the progress from 'To Do' to 'Working on It'
- While the actual time running, you can refresh and close the browser page. And the timer still running.
- If you finished your activity, you can click 'Working on it' button and it will be 'Done' progress and stop the timer. You can also reset the actual time and status by clicked 'Done' progress.
- You can change the Task Name, Task Severity, Task Time
- And also you can delete the task.


## 🛠️ Technologies

- Vue 3
- Tailwindcss
- Sweetalert2
- Chartjs
- json-server

## 📦 Installation

``` 
bash
git clone https://github.com/rysryptr/vue-workapp.git
cd vue-workapp
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
