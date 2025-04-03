<template>
    <!-- Table to display user data -->
    <table class="table table-light table-striped">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Media ID</th>
                <th scope="col">User ID</th>
                <th scope="col">Video Type</th>
                <th scope="col">Title</th>
                <th scope="col">Upload Date</th>
                <th scope="col">Path</th>
                <td>Action</td>

            </tr>
        </thead>
        <tbody>
            <!-- Loop through tableData and display each user's information -->
            <tr v-for="(data, index) in MediaData" :key="data.id">
                <td>{{ index + 1 }}</td>
                <td>{{ data.MediaID }}</td>                
                <td>{{ data.UserID }}</td>
                <td>{{ data.Video_Type }}</td>
                <td>{{ getFirstThreeWords(data.Title) }}</td>
                <td>{{ data.UploadDate }}</td>
                <td>{{ getFirstFourLetters(data.Path) }}</td>
                    <a class="btn btn-link text-danger  px-3 mb-0 " href="javascript:;">
                        <i class="far fa-trash-alt me-2" aria-hidden="true"></i>
                    </a>
                    <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;">
                        <i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true"></i>
                    </a>
                
            </tr>
        </tbody>
    </table>
</template>

<script>
import { ref } from 'vue'
import {
    getMedia
} from "../../assets/Domain.js";

// Define reactive tableData with initial user data

export default {
    data() {
        return {
            MediaData: ref([]), // Initialize tableData as a reactive reference
        };
    },

    methods: {
        getFirstThreeWords(data) {
            if (data.split(' ').length <= 2) {
                return data;
            }
            return data.split(' ').slice(0, 2).join(' ') + '...';
        },
        getFirstFourLetters(str) {
            if(str.length <= 4) {
                return str;
            }
            return str.substring(0, 4)+'...'; // Get the first 4 letters
        },
        async getAllMedia() {
            try {
                const response = await fetch(getMedia);
                const data = await response.json();
                this.MediaData = data;
            } catch (error) {
                console.error('Error fetching media data:', error);
            }
        }

    },
    mounted() {
        this.getAllMedia();
    }
}
</script>