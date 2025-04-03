<template>
  <div id="app">
    <ul class="ip-data">
      <li v-for="(value, key) in ipData" :key="key">{{ key }}: {{ value }}</li>
    </ul>

    <h1>Todo App</h1>

    <div id="task-form">
      <input v-model="newTask" type="text" placeholder="Enter task title" />
      <button @click="createTask">Add Task</button>
    </div>

    <h2>Task List</h2>
    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id">
        {{ task.title }}
        <button @click="deleteTask(task.id)" class="delete-btn">🗑</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  name: "App",
  setup() {
    const newTask = ref("");
    const tasks = ref([]);
    const ipData = ref({});

    const apiUrl = import.meta.env.VITE_API_URL; // Use the environment variable

    // Fetch tasks when the app is mounted
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${apiUrl}/tasks`);
        tasks.value = response.data.tasks;
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    // Create a new task
    const createTask = async () => {
      if (!newTask.value) {
        alert("Please enter a task title");
        return;
      }

      try {
        const response = await axios.post(`${apiUrl}/task`, {
          title: newTask.value,
        });
        fetchTasks(); // Refresh the task list
      } catch (error) {
        console.error("Error creating task:", error);
      }

      newTask.value = ""; // Clear the input field
    };

    // Delete a task
    const deleteTask = async (taskId) => {
      try {
        const response = await axios.delete(`${apiUrl}/task/${taskId}`);
        fetchTasks(); // Refresh the task list after deleting
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    };

    const getIPDestination = async () => {
      try {
        const response = await axios.get(`${apiUrl}`);
        ipData.value = response.data;
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    // Fetch tasks on component mount
    onMounted(fetchTasks);
    onMounted(() => {
      getIPDestination();
    });

    return { newTask, tasks, createTask, deleteTask, ipData };
  },
};
</script>

<style scoped>
body {
  font-family: "Arial", sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f4f8;
}

#app {
  text-align: center;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 36px;
  color: #4a90e2;
  margin-bottom: 20px;
}

#task-form {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

input {
  padding: 15px;
  font-size: 18px;
  /* width: 70%; */
  width: 300px;
  margin-right: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: lightblue;
  color: black;
}

#task-form button {
  padding: 15px 40px;
  font-size: 16px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

#task-form button:hover {
  background-color: #4cae4c;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.task-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.task-list li {
  padding: 12px 20px;
  font-size: 18px;
  background-color: #f9f9f9;
  margin: 10px 0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: darkorange;
}

.ip-data {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.ip-data li {
  padding: 12px 20px;
  font-size: 18px;
  background-color: #f9f9f9;
  margin: 10px 0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: black;
}

li button {
  background-color: lightgray;
}
</style>
