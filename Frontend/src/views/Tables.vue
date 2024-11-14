<script setup>
import Forum_Course from "./components/Forum_Course.vue";
import { useRouter } from "vue-router";
const router = useRouter();
let Email = localStorage.getItem("Email");

if (Email === null || Email === "") {
  router.push("/signin");
}



</script>
<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <Forum_Course />
      </div>
    </div>
  </div>
</template>
