<template>
  <div class="card">
    <!-- Course Information-->
    <div class="row align-items-center">
      <div class="col">
        <h5 style="margin-left: 20px; font-size: x-large">Course Name</h5>
      </div>
      <div class="col-auto" style="margin-right: 20px">
        <select class="form-select" aria-label="Select Week">
          <option selected>Select Week</option>
          <option value="1">Week 1</option>
          <option value="2">Week 2</option>
          <option value="3">Week 3</option>
        </select>
      </div>
    </div>
    <!-- Course Information End-->
    <div class="card-header pb-0 px-3">
      <div class="row" style="background-color: #f8f8f8">
        <div class="col-auto">
          <div class="avatar avatar-xl position-relative">
            <img
              src="../../assets/img/team-3.jpg"
              alt="profile_image"
              class="shadow-sm w-70 border-radius-lg"
            />
          </div>
        </div>
        <div class="col-auto my-auto">
          <div class="h-100">
            <h5 class="mb-1">Sayo Kravits</h5>
            <span class="badge badge-sm bg-gradient-success">Online</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Queue -->
    <div class="container mt-2">
      <div class="row mt-4 justify-content-between">
        <div class="col-6 col-md-3">
          <div class="card queue-a text-white">
            <div class="card-body text-center">
              <h5 class="card-title">Theory</h5>
              <p class="card-text" id="currentSizeA">Current Size: 5</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card queue-b text-white">
            <div class="card-body text-center">
              <h5 class="card-title">Lab Work</h5>
              <p class="card-text" id="currentSizeB">Current Size: 3</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card queue-c text-white">
            <div class="card-body text-center">
              <h5 class="card-title">Debugging</h5>
              <p class="card-text" id="currentSizeC">Current Size: 8</p>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card queue-d text-white">
            <div class="card-body text-center">
              <h5 class="card-title">Assignments</h5>
              <p class="card-text" id="currentSizeD">Current Size: 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Queue End -->

    <!-- Timer-->
    <div class="mt-4 text-center" id="timerDisplay">
      <h3>Time Remaining: <span id="timeRemaining">1:00</span> minutes</h3>
    </div>
    <!-- Timer End -->

    <!-- Search Bar -->
    <div class="d-flex p-2 mb-1">
      <span class="input-group-text text-body">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
      <input type="text" class="form-control" :placeholder="'Type here...'" />
    </div>
    <!-- Search Bar End-->
    <div class="card-body pt-1 p-3">
      <div class="d-flex justify-content-end">
        <argon-button
          type="button"
          class="btn btn-success mb-3"
          title="Ask Question"
        >
          <i class="fa fa-plus" aria-hidden="true"></i>
        </argon-button>
      </div>
      <ul class="list-group">
        <!-- List Card -->

        <li
          v-for="question in questions"
          :key="question.id"
          class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg"
        >
          <div class="d-flex flex-column">
            <h6 class="mb-3 text-sm">{{ question.UserName }}</h6>
            <span class="mb-2 text-xs">
              Type:
              <span class="text-dark font-weight-bold ms-sm-2">{{ question.type }}</span>
            </span>
            <span class="mb-2 text-xs">
              Description:
              <span class="text-dark ms-sm-2 font-weight-bold">{{ question.QuestionTitle }}</span>
            </span>
          </div>
          <div class="ms-auto text-end d-flex">
            <a class="btn btn-link text-dark px-3 mb-0" href="javascript:;">
              <i class="fa fa-eye text-dark me-2" aria-hidden="true"></i>
            </a>
          </div>
        </li>
        <!--End of List Card -->
      </ul>
    </div>
  </div>
</template>
<script>
import { GetAllQuestion } from "../../assets/Domain.js";

export default {
  data() {
    return {
      questions: [],
    };
  },
  methods: {
    async getQuestions() {
      fetch(GetAllQuestion)
        .then((response) => response.json())
        .then((data) => {
          this.questions = data;
          console.log(this.questions);
          console.log(data);
        });
    },
  },
  mounted() {
    this.getQuestions();
  },
};
</script>

<style setup>
.queue-a {
  background-color: #28a745 !important;
  padding: 1px;
  margin-bottom: 5px;
} /* Green */
.queue-b {
  background-color: #17a2b8 !important;
  padding: 1px;
  margin-bottom: 5px;
} /* Teal */
.queue-c {
  background-color: #ffc107 !important;
  padding: 1px;
  margin-bottom: 5px;
} /* Yellow */
.queue-d {
  background-color: #dc3545 !important;
  padding: 1px;
  margin-bottom: 5px;
} /* Red */
</style>
