<script setup>
import Forum from "./components/Forum.vue";
// import ProjectsTable from "./components/ProjectsTable.vue";
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
        <Forum />
      </div>
    </div>
    <!-- <div class="mt-4 row">
      <div class="col-12">
        <projects-table />
      </div>
    </div> -->
  </div>
</template>
