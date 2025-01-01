<template>
  <main>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <a href="/questionlist"
                    ><i class="fa fa-arrow-left backArr" aria-hidden="true" style="font-size:1.5ch;"></i
                  ></a> <p class="mb-0">Create Question</p>
              </div>
            </div>
            <div class="card-body">
              <!-- Select Bar-->
              <ul class="nav nav-tabs mb-3">
                <li class="nav-item">
                  <a
                    :class="['nav-link', IsText ? 'active' : '']"
                    aria-current="page"
                    href="#"
                    @click="CheangeToText"
                    >Text</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    :class="['nav-link', IsVideo ? 'active' : '']"
                    href="#"
                    @click="CheangeToVideo"
                    >Video</a
                  >
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
                <!-- Type Selete Bar-->
                <div class="col-md-9 mb-4">
                  <label class="form-control-label">Question Type</label>
                  <select class="form-select" aria-label="Select Week">
                    <option value="theory" selected>Theory</option>
                    <option value="lab-work">Lab Work</option>
                    <option value="debugging">Debugging</option>
                    <option value="assignments">Assignments</option>
                  </select>
                </div>
                <!-- Type Selete Bar End-->
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

export default {
  setup() {
    const router = useRouter();
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
      initQuill,
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
