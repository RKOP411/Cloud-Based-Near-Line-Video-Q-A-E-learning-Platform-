<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import Quill from "quill";
import { CreateForum as createForumAPI } from "../assets/Domain.js";

const router = useRouter();
let Email = localStorage.getItem("Email");

if (Email === null || Email === "") {
  router.push("/signin");
}

const editor = ref(null);
const ForumTitle = ref("");
const params = new URLSearchParams(window.location.search);
const CourseID = params.get("CourseID");
let quill;

const initQuill = () => {
  quill = new Quill(editor.value, {
    theme: "snow",
    modules: {
      toolbar: [
        ["bold", "italic", "underline"],
        ["link", "image"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    },
  });
};

const CreateForum = () => {
  if (quill.root.innerHTML === "" || ForumTitle.value === "") {
    alert("Please fill all the fields");
    return;
  }
  fetch(createForumAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      UserID: localStorage.getItem("UserID"),
      CourseID: CourseID.value,
      ForumTitle: ForumTitle.value,
      Description: quill.root.innerHTML,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Forum Created");
      } else {
        alert("Forum Creation Failed");
      }
    });
};

onMounted(() => {
  initQuill();
});
</script>
<template>
  <main>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">Create Forum</p>
              </div>
            </div>
            <div class="card-body">
              <!-- Select Bar-->
              <ul class="nav nav-tabs mb-3">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#"
                    >Text</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Video</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Link</a>
                </li>
              </ul>
              <!-- Select Bar End-->
              <div class="row">
                <div class="col-md-9 mb-4">
                  <label for="example-text-input" class="form-control-label"
                    >Forum Title</label
                  >
                  <input
                    class="form-control"
                    type="text"
                    v-model="ForumTitle"
                    placeholder="Title *"
                  />
                </div>
                <br />
                <!-- Contant Input-->
                <div class="col-md-9 mb-3">
                  <label for="example-text-input" class="form-control-label"
                    >Description</label
                  >
                  <!--Text Editor-->
                  <div>
                    <div ref="editor" class="quill-editor"></div>
                    <br />
                  </div>
                  <!--Text Editor-->
                </div>
                <!-- Contant Input End-->
              </div>
              <hr class="horizontal dark" />
              <button
                type="button"
                class="btn btn-success"
                @click="CreateForum"
              >
                Send
              </button>
            </div>
            <hr class="horizontal dark" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
