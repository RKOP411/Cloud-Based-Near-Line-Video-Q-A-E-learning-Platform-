<script setup>
import BillingCard from "../components/BillingCard.vue";
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
                <billing-card />
            </div>
        </div>
    </div>
</template>
