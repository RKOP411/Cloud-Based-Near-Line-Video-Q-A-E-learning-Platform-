<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex align-items-center">
        <h6>Forum</h6>
        <argon-button type="button" class="btn btn-success mb-3 ms-auto" @click="redirectToCreateForum()">
          <i class="fa fa-plus" aria-hidden="true"></i>
        </argon-button>
      </div>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Discussion
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Latest reply
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Start At
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Replies
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>

            <tr v-if="items.length === 0">
              <td colspan="5" class="text-center">No Forum</td>
            </tr>
            
            <tr v-for="(item, index) in items" :key="index">
              <td>
                <div class="d-flex px-2 py-1">
                  <div>
                    <i
                      class="avatar-sm me-3 fa fa-star star"
                      aria-hidden="true"
                      style="font-size: 20px"
                    ></i>
                  </div>
                  <a :href="`/tables/forum/forumcontent?ForumID=${item.ForumID}`">
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm">{{ item.ForumTitle }}</h6>
                      <p class="text-xs text-secondary mb-0">
                        {{ item.UserName }}
                      </p>
                    </div>
                  </a>
                </div>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">{{
                  item.LastUpdated
                }}</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">{{
                  item.UpdatedTime
                }}</span>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">{{
                  item.Replies
                }}</span>
              </td>
              <td class="align-middle">
                <a
                  href="javascript:;"
                  class="text-secondary font-weight-bold text-xs"
                  data-toggle="tooltip"
                  data-original-title="Edit user"
                  ><i class="fa fa-th-list" aria-hidden="true"></i
                ></a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <br />
</template>
<script>
import { GetForumByCourseID } from "../assets/Domain.js";
import { ref } from 'vue';
const params = new URLSearchParams(window.location.search);
const CourseID = ref(params.get("CourseID"));

export default {
  data() {
    return {
      items: [],
    };
  },
  methods: {
    async getForum() {
      const response = await fetch(GetForumByCourseID + CourseID.value, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      this.items = Array.isArray(data) ? data : [];

      this.items.forEach((item) => {
        let date = new Date(item.UpdatedTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        item.UpdatedTime = `${year}/${month}/${day}`;

        date = new Date(item.LastUpdated);

        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-
        ${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:
        ${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

        item.LastUpdated = formattedDate;
      });
    },
    redirectToCreateForum() {
        this.$router.push(`/tables/forum/createforum?CourseID=${CourseID.value}`);
    }
  },
  mounted() {
    this.getForum();
  },
};
</script>

<style>
.star {
  align-items: center;
  justify-content: center;
  display: flex;
}
.star-clicked {
  color: #f0ad4e;
}
</style>
