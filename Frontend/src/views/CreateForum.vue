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
                  <a
                    class="nav-link active"
                    aria-current="page"
                    href="#"
                    @click="CheangeToText"
                    >Text</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#" @click="CheangeToVideo">Video</a>
                </li>
              </ul>
              <!-- Select Bar End-->
              <div class="row">
                <div class="col-md-9 mb-4">
                  <label class="form-control-label">Question Title</label>
                  <input
                    class="form-control"
                    type="text"
                    placeholder="Title *"
                    v-model="ForumTitle"
                  />
                </div>
                <br />
                <!-- Text Content Input-->
                <div class="col-md-9 mb-3" v-if="IsText">
                  <label class="form-control-label">Description</label>
                  <!-- Text Editor -->
                  <div>
                    <div ref="editor" class="quill-editor"></div>
                    <br />
                  </div>
                  <!-- Text Editor End -->
                </div>
                <!-- Text Content Input End -->
                <!-- Video Content Input-->
                <div class="col-md-9 mb-3" v-if="IsVideo">
                  <label class="form-control-label">Video</label>
                  <div>
                    <input
                      id="video"
                      type="file"
                      accept="video/*"
                      @change="handleFileUpload"
                      required
                    />
                  </div>
                </div>
                <!-- Video Content Input End -->
              </div>
              <hr class="horizontal dark" />
              <button
                type="button"
                class="btn btn-success"
                @click="IsText ? CreateForum() : CreateForumVideo()"
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

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill's CSS
import {
  CreateForum as CreateForumEndpoint,
  CourseNumQuesstion,
  CreateForumWithVideo as CreateForumWithVideo,
} from "../assets/Domain.js";

export default {
  setup() {
    const router = useRouter();
    const params = new URLSearchParams(window.location.search);
    const CourseID = params.get("CourseID");
    const userId = localStorage.getItem("UserID");
    const Email = localStorage.getItem("Email");
    const ForumTitle = ref("");
    const quill = ref(null);
    const IsVideo = ref(false);
    const IsText = ref(true);
    let videoFile = null;
    const initQuill = () => {
      quill.value = new Quill(document.querySelector(".quill-editor"), {
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

    const handleFileUpload = () => {
      videoFile = document.getElementById("video").files[0];
      IsVideo.value = true;
      console.log(videoFile);
    };

    const CreateForum = async () => {
      if (ForumTitle.value === "") {
        alert("Please fill all the fields");
        return;
      }

      try {
        const response = await fetch(CreateForumEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserID: userId,
            CourseID: CourseID,
            ForumTitle: ForumTitle.value,
            Description: quill.value.root.innerHTML, // Use the quill ref's value
          }),
        });

        const data = await response.json();
        console.log("Data:", data);
        ForumTitle.value = ""; // Clear the title
        quill.value.root.innerHTML = ""; // Clear the quill editor
        router.push(`/tables/forum?CourseID=${CourseID}`);
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while creating the forum.");
      }

      // Update the number of questions in the course
      fetch(CourseNumQuesstion + CourseID, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
    };

    const CreateForumVideo = async () => {
      if (ForumTitle.value === "") {
        alert("Please fill all the fields");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("UserID", userId);
        formData.append("CourseID", CourseID);
        formData.append("ForumTitle", ForumTitle.value);
        formData.append("Description", null); 
        if (videoFile) {
          formData.append("video", videoFile);
        }

        const response = await fetch(CreateForumWithVideo, {
          method: "POST",
          body: formData, // Use FormData here
        });

        const data = await response.json();
        console.log("Data:", data);
        ForumTitle.value = ""; // Clear the title
        quill.value.root.innerHTML = ""; // Clear the quill editor
        //router.push(`/tables/forum?CourseID=${CourseID}`);
      } catch (error) {
        console.error("Error:", error);
      }

      // Update the number of questions in the course
        fetch(CourseNumQuesstion + CourseID, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
      });
    };

    // Check for user authentication and initialize Quill on mount
    onMounted(() => {
      if (!Email) {
        router.push("/signin");
      }
      initQuill();
    });

    return {
      ForumTitle,
      videoFile,
      IsVideo,
      IsText,
      handleFileUpload,
      CreateForum,
      initQuill,
      CreateForumVideo,
    };
  },
  methods: {
    CheangeToVideo() {
      this.IsVideo = true;
      this.IsText = false;
    },
    CheangeToText() {
      this.IsVideo = false;
      this.IsText = true;
    },
  },
  // Initialize Quill when IsText becomes true
  watch: {
    IsText(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.initQuill();
        });
      }
    },
  },
};
</script>
