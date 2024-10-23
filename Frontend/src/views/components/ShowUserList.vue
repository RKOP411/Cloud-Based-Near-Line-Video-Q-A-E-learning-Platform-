<template>
    <!-- Table to display user data -->
    <table class="table table-light table-striped">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">User ID</th>
                <th scope="col">Name</th>
                <th scope="col">Role</th>
                <th scope="col">Email</th>
                <th scope="col">Password</th>
                <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
            <!-- Loop through tableData and display each user's information -->
            <tr v-for="(data, index) in tableData" :key="data.id">
                <td>{{ index + 1 }}</td>
                <td>{{ data.id }}</td>
                <td>{{ data.name }}</td>
                <td>{{ data.role }}</td>
                <td>{{ data.email }}</td>
                <td>{{ data.Password }}</td>
                <td>
                    <a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript:;">
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

<script setup>
import { ref } from 'vue'

// Define reactive tableData with initial user data
const tableData = ref([
    { id: 10001, name: 'User1', role: 'Student', email: 'Man12131@Gmail.com', Password: 'Qw1dqk4121', Lang: 'eng' },
    { id: 10002, name: 'User2', role: 'Teacher', email: 'teach2@example.com', Password: 'Pass2Word!', Lang: 'eng' },
    { id: 10003, name: 'User3', role: 'Admin', email: 'admin3@example.com', Password: 'AdminPass123', Lang: 'eng' },
    { id: 10004, name: 'User4', role: 'Student', email: 'stud4@example.com', Password: 'StudentPass456', Lang: 'chn' },
    { id: 10005, name: 'User5', role: 'Teacher', email: 'teacher5@example.com', Password: 'TeachPass789', Lang: 'chn' },
    { id: 10006, name: 'User6', role: 'Admin', email: 'admin6@example.com', Password: 'SecurePass0!', Lang: 'chn' },
    { id: 10007, name: 'User7', role: 'Student', email: 'user7@domain.com', Password: 'Qwerty987', Lang: 'eng' },
    { id: 10008, name: 'User8', role: 'Teacher', email: 'professor8@domain.com', Password: 'TeachItRight!', Lang: 'chn' },
    { id: 10009, name: 'User9', role: 'Student', email: 'learner9@domain.com', Password: 'Learning123!', Lang: 'chn' },
    { id: 10010, name: 'User10', role: 'Admin', email: 'admin10@domain.com', Password: 'AdminSecure1', Lang: 'chn' }
]);
</script>