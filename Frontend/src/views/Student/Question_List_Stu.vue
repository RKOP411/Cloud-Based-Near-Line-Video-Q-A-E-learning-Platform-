<script setup>

import QuestionList from "../components/QuestionList_Stu.vue";
import { useRouter } from "vue-router";
const router = useRouter();
let Email = localStorage.getItem("Email");

if (Email === null || Email === "") {
  router.push("/signin");
}

</script>
<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <QuestionList />
      </div>
    </div>
  </div>
</template>
