<template>
  <main>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <a href="/questionlist"
                  ><i
                    class="fa fa-arrow-left backArr"
                    aria-hidden="true"
                    style="font-size: 1.5ch"
                  ></i
                ></a>
                <p class="mb-0">Create Question</p>
              </div>
            </div>
            <div class="card-body">
              <div class="alert alert-danger" role="alert" v-if="errormsg">
                {{ errormsg }}
              </div>
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
                    v-model="QuestionTitle"
                  />
                </div>
                <!-- Type Selete Bar-->
                <div class="col-md-9 mb-4">
                  <label class="form-control-label">Question Type</label>
                  <select
                    class="form-select"
                    aria-label="Select Week"
                    v-model="type"
                  >
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
                @click="IsText ? AddQuestion() : AddQuestionVideo()"
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
  CreateQuestion,
  CreateQuestionWithVideo,
  AddQueue,
  AddCustomrQueue,
  GetQueueByType,
  CheckSimilar,
} from "../../assets/Domain.js";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";

export default {
  setup() {
    const CurrentQueue = ref(0);
    const router = useRouter();
    const Email = localStorage.getItem("Email");
    const QueueListID = localStorage.getItem("QueueListID");
    const QuestionTitle = ref("");
    const quill = ref(null);
    const IsVideo = ref(false);
    const IsText = ref(true);
    const type = ref("theory");
    const userId = localStorage.getItem("UserID");
    let videoFile = null;
    const errormsg = ref(""); // Error message
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
    const showCurrentQueueModal = (CurrentQueue) => {
      const modalHtml = `
    <div class="modal fade" id="currentQueueModal" tabindex="-1" aria-labelledby="currentQueueModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="currentQueueModalLabel">Current Queue</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Your Current Queue in ${type.value}: <b>${CurrentQueue}</b>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

      // Append the modal HTML to the body
      document.body.insertAdjacentHTML("beforeend", modalHtml);

      // Show the modal
      const modalElement = new bootstrap.Modal(
        document.getElementById("currentQueueModal")
      );
      modalElement.show();

      // Handle the modal close event
      const modalCloseButton = document.querySelector(
        "#currentQueueModal .btn-close"
      );
      modalCloseButton.addEventListener("click", () => {
        modalElement.hide(); // Hide the modal
        document.getElementById("currentQueueModal").remove(); // Remove modal from DOM
        router.push("/questionlist"); // Navigate to /questionlist
      });

      // Also handle the modal dismissal from the backdrop
      const modalBackdrop = document.querySelector("#currentQueueModal");
      modalBackdrop.addEventListener("hidden.bs.modal", () => {
        document.getElementById("currentQueueModal").remove(); // Remove modal from DOM
        router.push("/questionlist"); // Navigate to /questionlist
      });
    };

    // showCurrentQueueModal(CurrentQueue.value);
    const GetCurrentQueue = async () => {
      const response = await fetch(
        `${GetQueueByType}/${QueueListID}/${type.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      CurrentQueue.value = data.count;
      showCurrentQueueModal(CurrentQueue.value);
    };

    const handleFileUpload = () => {
      videoFile = document.getElementById("video").files[0];
      IsVideo.value = true;
      console.log(videoFile);
    };

    const AddIntoQueue = async () => {
      const response = await fetch(AddQueue, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          QueueType: type.value,
          UserID: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    };

    const AddIntoCustomerQueue = async () => {
      const response = await fetch(AddCustomrQueue, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserID: userId,
          Status: "waiting",
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    };

    const AddQuestion = async () => {
      if (
        QuestionTitle.value === "" ||
        !quill.value ||
        quill.value.root.innerHTML === "<p><br></p>"
      ) {
        errormsg.value = "Please fill all fields";
        return;
      }
      let filteredDescription = quill.value.root.innerHTML.replace(
        /<\/?[^>]+(>|$)/g,
        ""
      );
      let simimlar = false;

      await fetch(`${CheckSimilar}/${filteredDescription}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        if (data.count > 0) {
          simimlar = true;
            const modalHtml = `
            <div class="modal fade" id="similarQuestionsModal" tabindex="-1" aria-labelledby="similarQuestionsModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="similarQuestionsModalLabel">Similar Questions Found</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <p>The following similar questions were found:</p>
                <table class="table table-bordered">
                  <thead>
                  <tr>
                    <th scope="col">QAID</th>
                    <th scope="col">Description</th>
                    <th scope="col">Text</th>
                  </tr>
                  </thead>
                  <tbody>
                  ${data.similarQuestions
                    .map(
                    (question) => `
                    <tr>
                    <td>${question.QAID}</td>
                    <td>${question.Description}</td>
                    <td>${question.Text || "N/A"}</td>
                    </tr>
                  `
                    )
                    .join("")}
                  </tbody>
                </table>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
              </div>
            </div>
            `;

            // Append the modal HTML to the body
            document.body.insertAdjacentHTML("beforeend", modalHtml);

            // Show the modal
            const modalElement = new bootstrap.Modal(
            document.getElementById("similarQuestionsModal")
            );
            modalElement.show();

            // Handle the modal close event
            const modalCloseButton = document.querySelector(
            "#similarQuestionsModal .btn-close"
            );
            modalCloseButton.addEventListener("click", () => {
            modalElement.hide(); // Hide the modal
            document.getElementById("similarQuestionsModal").remove(); // Remove modal from DOM
            });

            // Also handle the modal dismissal from the backdrop
            const modalBackdrop = document.querySelector("#similarQuestionsModal");
            modalBackdrop.addEventListener("hidden.bs.modal", () => {
            document.getElementById("similarQuestionsModal").remove(); // Remove modal from DOM
            });
          return;
        }
      });
      if (simimlar) {
        return;
      }

      //const formData = new FormData();
      //console.log(formData);
      const response = await fetch(CreateQuestion, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          QuestionTitle: QuestionTitle.value,
          Description: quill.value.root.innerHTML,
          Type: type.value,
          UserID: userId,
          QueueListID: QueueListID,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      await AddIntoCustomerQueue();
      await AddIntoQueue();
      await GetCurrentQueue();

      //router.push("/questionlist");
    };

    const AddQuestionVideo = async () => {
      const formData = new FormData();
      formData.append("QuestionTitle", QuestionTitle.value);
      formData.append("Type", type.value);
      formData.append("UserID", userId);
      formData.append("Description", null); // No description for video questions
      if (videoFile) {
        formData.append("video", videoFile);
      }
      formData.append("QueueListID", QueueListID);
      const response = await fetch(CreateQuestionWithVideo, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      router.push("/questionlist");
    };

    // Check for user authentication and initialize Quill on mount
    onMounted(() => {
      if (!Email) {
        router.push("/signin");
      }
      initQuill();
    });

    return {
      QuestionTitle,
      videoFile,
      IsVideo,
      IsText,
      type,
      errormsg,
      handleFileUpload,
      initQuill,
      AddQuestion,
      AddQuestionVideo,
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
