<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-lg-2 ms-auto d-flex justify-content-end">
        <select
          class="form-select text-white bg-primary"
          id="optionsSelect"
          @change="handleDurationChange"
          v-model="optionsSelect"
          style="width: 100px; margin-bottom: 3px"
        >
          <option selected value="total">Total</option>
          <option value="month">Month</option>
          <option value="week">Week</option>
        </select>
      </div>
      <div>
        <select
          class="form-select form-select-lg mb-3"
          @change="handleCourseChange"
          id="courseSelect"
          v-model="selectedCourseID"
        >
          <option
            v-for="(course, index) in Course"
            :key="index"
            :value="course.CourseID"
          >
            {{ course.CourseName }}
          </option>
        </select>
      </div>
      <table
        class="table table-bordered table-striped"
        style="
          background-color: #ffffff;
          border-radius: 0.5rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        "
      >
        <thead class="thead-dark">
          <tr>
            <th scope="col">KeyWord</th>
            <th scope="col">Count</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in keywords" :key="index">
            <td>{{ item.keyword }}</td>
            <td>{{ item.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { countKeywords } from "../../assets/KeyWord.js";
import { ref } from "vue";
import { GetCourses, getAllQuestionByCourseID } from "../../assets/Domain.js";

export default {
  name: "ShowKeyWord_DashBoard",
  data() {
    return {
      optionsSelect: "total",
      selectedCourseID: ref(""),
      keywords: ref([]),
      Course: [],
      UserID: localStorage.getItem("UserID"),
    };
  },
  methods: {
    async fetchCourses() {
      fetch(`${GetCourses}/${this.UserID}`)
        .then((response) => response.json())
        .then((data) => {
          this.Course = data;
          if (this.Course.length > 0) {
            this.selectedCourseID = this.Course[0].CourseID;
          }
          //   console.log("selectedCourseID: " + this.selectedCourseID);
          this.getPushedData();
          this.fetchKeywords();
        });
    },
    async fetchKeywords() {
      fetch(
        `${getAllQuestionByCourseID}/${this.selectedCourseID}/${this.optionsSelect}`
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          let questionTitle = data.map((item) =>
            String(item.QuestionTitle || "")
          );
          let Description = data.map((item) => String(item.Description || ""));
          const questionKeywords = countKeywords(questionTitle.join(" "));
          const descriptionKeywords = countKeywords(Description.join(" "));

          // Combine the keyword counts from both question titles and descriptions
          const combinedKeywords = { ...questionKeywords };
          for (const [key, value] of Object.entries(descriptionKeywords)) {
            combinedKeywords[key] = (combinedKeywords[key] || 0) + value;
          }

          //console.log("Combined Keywords: ", combinedKeywords);
          let sortKeywords = Object.entries(combinedKeywords)
            .map(([keyword, count]) => ({ keyword, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Only take the top 10 keywords

          this.keywords = sortKeywords;
        });
    },
    handleDurationChange(event) {
      this.optionsSelect = event.target.value;
    },
    handleCourseChange(event) {
      this.selectedCourseID = event.target.value;
    },
    getPushedData() {
      if (
        this.$route.query.selectedCourseID &&
        this.$route.query.optionsSelect
      ) {
        this.selectedCourseID = this.$route.query.selectedCourseID;
        this.optionsSelect = this.$route.query.optionsSelect;
        console.log(
          "selectedCourseID: " + this.selectedCourseID,
          "optionsSelect: " + this.optionsSelect
        );
      }
    },
  },
  mounted() {
    this.fetchCourses();
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}

.table {
  margin-top: 20px;
  border: none;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
  padding: 12px;
}

.thead-dark th {
  background-color: #343a40;
  color: #ffffff;
  font-weight: bold;
  font-size: 1.1rem;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f2f2f2;
}

.table-striped tbody tr:nth-of-type(even) {
  background-color: #ffffff;
}

.table-bordered {
  border: 1px solid #dee2e6;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
}

.table tbody tr:hover {
  background-color: #e9ecef; /* Highlight on hover */
}
</style>
