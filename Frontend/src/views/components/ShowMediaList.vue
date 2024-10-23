<template>
    <!-- Table to display user data -->
    <table class="table table-light table-striped">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Media ID</th>
                <th scope="col">User ID</th>
                <th scope="col">Media Type</th>
                <th scope="col">Title</th>
                <th scope="col">Content</th>
                <th scope="col">Uploaded At</th>
                <td>Action</td>

            </tr>
        </thead>
        <tbody>
            <!-- Loop through tableData and display each user's information -->
            <tr v-for="(data, index) in MediaData" :key="data.id">
                <td>{{ index + 1 }}</td>
                <td>{{ data.id }}</td>
                <td>{{ data.userId }}</td>
                <td>{{ data.mediaType }}</td>
                <td>{{ getFirstThreeWords(data.title) }}</td>
                <td>{{ getFirstFourLetters(data.content) }}</td>
                <td>{{ data.uploadedAt }}</td>
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
const MediaData = ref([
    { id: 1000, userId: 1001, mediaType: 'text', title: 'My first blog post about JavaScript', content: 'This is the content of my blog post.', uploadedAt: '2023-09-01' },
    { id: 1001, userId: 1001, mediaType: 'image', title: 'A beautiful sunset', content: 'sunset_image_url.jpg', uploadedAt: '2023-09-02' },
    { id: 1002, userId: 1110, mediaType: 'video', title: 'Tutorial on CSS Grid Layout', content: 'css_grid_video_url.mp4', uploadedAt: '2023-09-03' },
    { id: 1003, userId: 1002, mediaType: 'text', title: 'Exploring the basics of React', content: 'React is a JavaScript library...', uploadedAt: '2023-09-04' },
    { id: 1004, userId: 1002, mediaType: 'image', title: 'Delicious food I cooked', content: 'food_image_url.jpg', uploadedAt: '2023-09-05' },
    { id: 1005, userId: 1002, mediaType: 'video', title: 'Understanding APIs in web development', content: 'api_tutorial_video.mp4', uploadedAt: '2023-09-06' },
    { id: 1006, userId: 1001, mediaType: 'text', title: 'My journey into machine learning', content: 'Machine learning is...', uploadedAt: '2023-09-07' },
    { id: 1007, userId: 1212, mediaType: 'image', title: 'My travels around the world', content: 'travel_image_url.jpg', uploadedAt: '2023-09-08' },
    { id: 1008, userId: 1003, mediaType: 'video', title: 'How to use Vue.js effectively', content: 'vuejs_tutorial.mp4', uploadedAt: '2023-09-09' },
    { id: 1009, userId: 1001, mediaType: 'text', title: 'Tips for beginner coders', content: 'Coding can be challenging...', uploadedAt: '2023-09-10' }
]);

</script>

<script>
export default {
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

    }
}
</script>