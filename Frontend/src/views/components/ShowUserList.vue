<template>
  <!-- Table to display user data -->
  <table class="table table-light table-striped">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">User ID</th>
        <th scope="col">User Name</th>
        <th scope="col">Email</th>
        <th scope="col">Gender</th>
        <th scope="col">T_rank</th>
        <th scope="col">Action</th>
      </tr>
    </thead>
    <tbody>
      <!-- Loop through tableData and display each user's information -->
      <tr v-for="(data, index) in tableData" :key="data.id">
        <td>{{ index + 1 }}</td>
        <td>{{ data.UserID }}</td>
        <td>{{ data.UserName }}</td>
        <td>{{ data.Email }}</td>
        <td>{{ data.Status }}</td>
        <td>{{ data.T_rank }}</td>

        <td>
          <a
            class="btn btn-link text-danger text-gradient px-3 mb-0"
            href="javascript:;"
          >
            <i class="far fa-trash-alt me-2" aria-hidden="true"></i>
          </a>
          <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;">
            <i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true"></i>
          </a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref } from "vue";
import {
    getUser
} from "../../assets/Domain.js";

// Define reactive tableData with initial user data

export default {
  data() {
    return {
      tableData: ref([]), // Initialize tableData as a reactive reference
    };
  },
  methods: {
    async getAllUsers() {
      try {

    fetch(getUser)
        .then((response) => response.json())
        .then((data) => {
          this.tableData = data; // Assign fetched data to tableData
          console.log(this.tableData);
        });

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
  },
  mounted() {
    this.getAllUsers(); // Fetch user data when the component is mounted
  },
};
</script>
