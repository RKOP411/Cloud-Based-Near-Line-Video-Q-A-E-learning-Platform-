<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";

import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];

const store = useStore();
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});
</script>
<template>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
              class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Forgot Password</h4>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <argon-input
                      id="email"
                      type="email"
                      placeholder="Email"
                      name="email"
                      v-model="email"
                      size="lg"
                    />
                  </div>

                  <div class="text-center">
                    <argon-button
                      class="mt-4"
                      variant="gradient"
                      color="success"
                      fullWidth
                      size="lg"
                      @click="sendEmail()"
                      >Reset Password</argon-button
                    >
                  </div>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Don't have an account?
                    <a
                      href="/signup"
                      class="text-success text-gradient font-weight-bold"
                      >Sign up</a
                    >
                  </p>
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg&quot;);
                  background-size: cover;
                "
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >
                  "An investment in knowledge pays the best interest."
                </h4>
                <br />
                <p class="text-white position-relative">— Benjamin Franklins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<script>
import { VerifyEmail } from "../assets/Verify.js";
import { changePasswordByEmail } from "../assets/Domain.js";
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  setup() {
    const router = useRouter();
    return { router };
  },
  name: "ForgetPassword",
  components: {
    ArgonInput,
    ArgonButton,
  },
  data() {
    return {
      email: ref(""),
    };
  },
  methods: {
    async sendEmail() {
      const data = await VerifyEmail(this.email);
      if (data.length !== 0) {
        alert("Password: " + data[0]?.Password);
        const newPassword = prompt("Enter your new password:");
        if (newPassword) {
          // console.log(newPassword === null);
          // console.log(newPassword);
          await fetch(`${changePasswordByEmail}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Email: this.email,
              NewPassword: newPassword,
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to update password");
              }
              return response.text();
            })
            .then((message) => {
              alert(message);
            })
            .then(() => {
              alert("Your password has been successfully updated.");
              this.$router.push("/signin");
            })
            .catch((error) => {
              console.error("Error:", error);
              alert("Error updating password.");
            });
        } else {
          alert("Password update canceled.");
        }
      } else {
        alert("Email not found");
      }
    },
  },
};
</script>
