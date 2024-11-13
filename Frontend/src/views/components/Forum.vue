<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex align-items-center">
        <h6>Forum</h6>
        <argon-button type="button" class="btn btn-success mb-3 ms-auto">
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
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ item.ForumTitle }}</h6>
                    <p class="text-xs text-secondary mb-0">{{ item.UserName }}</p>
                  </div>
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
export default {
  data() {
    return {
      items: [
        {
          ForumTitle: "What is NPC problems",
          UserName: "John Michael",
          LastUpdated: "10-14 22:32",
          UpdatedTime: "23/04/2024",
          Replies: 10,
        },
        {
          ForumTitle: "No problem",
          UserName: "Tommy",
          LastUpdated: "10-24 22:32",
          UpdatedTime: "23/04/2024",
          Replies: 1,
        },
        {
          ForumTitle: "What is java ",
          UserName: "Chris",
          LastUpdated: "10-24 22:32",
          UpdatedTime: "23/04/2024",
          Replies: 10,
        },
      ],
    };
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
