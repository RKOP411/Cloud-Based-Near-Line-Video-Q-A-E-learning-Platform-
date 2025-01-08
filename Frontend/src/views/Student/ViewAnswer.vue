<template>
  <div class="card">
    <div class="card-header pb-0 px-3">
      <h6 class="mb-0">Questions Information</h6>
    </div>

    <!-- Search Bar -->
    <div class="d-flex p-3 mb-2">
      <span class="input-group-text text-body">
        <i class="fas fa-search" aria-hidden="true"></i>
      </span>
      <input type="text" class="form-control" :placeholder="'Type here...'" />
    </div>
    <!-- Search Bar End-->

    <ul class="list-group">
      <!-- List Card -->

      <li
        v-for="question in questions"
        :key="question.id"
        class="list-group-item border-0 d-flex p-4 mb-2 bg-gray-100 border-radius-lg"
      >
        <div class="d-flex flex-column">
          <h6 class="mb-3 text-sm question-header">
            {{ question.UserName }} . {{ question.UploadTime }}
          </h6>
          <h5 class="mb-1 question-title">
            {{ question.QuestionTitle }}
          </h5>
          <span class="mb-3 text-xs">
            Type:
            <span class="text-dark font-weight-bold ms-sm-2 question-type">{{
              question.Type
            }}</span>
          </span>
          <span class="mb-2 text-xs question-description">
            <!-- Question Content-->
            <div
              class="row justify-content-center"
              v-if="question.Path !== null"
            >
              <video v-if="question.Path" controls id="QuestionVideo">
                <source :src="question.Path" :type="question.Video_Type" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div v-else>
              <p class="card-text" v-html="sanitize(question.Description)"></p>
            </div>
            <!-- Question Content End -->
            <br />
            <br />
            <!-- CommentAnswer -->
            <div class="oval-surround">
              <a
                class="btn btn-link text-dark px-2 mb-1"
                href="javascript:;"
                @click="createQuill(question.QAID)"
              >
                <i class="fa fa-comment" aria-hidden="true"></i>
              </a>
              <br />
            </div>
            <br />
            <!-- Text Editor-->
            <div
              id="TextEditor"
              v-if="activeQuill === question.QAID"
              :ref="'quillEditor' + question.QAID"
              style="height: 100px; width: 800px"
            ></div>
            <!-- End of Text Editor-->
            <br />
            <button
              v-if="activeQuill === question.QAID"
              type="button"
              class="btn btn-primary"
              @click="AnswerQuestion(question.QAID)"
            >
              Answer
            </button>
            <!-- End of CommentAnswer -->
          </span>
        </div>
        <div class="ms-auto text-end d-flex">
          <a
            class="btn btn-link text-danger text-gradient px-3 mb-0"
            href="javascript:;"
          >
            <i class="far fa-trash-alt me-2" aria-hidden="true"></i>
          </a>
        </div>
      </li>

      <!--End of List Card -->
    </ul>
  </div>
</template>

<script>
import DOMPurify from 'dompurify';
export default {
  data() {
    return {
      questions: [],
    };
  },
  methods: {
    sanitize(commentHtml) {
      return DOMPurify.sanitize(commentHtml);
    },
  },
};
</script>
