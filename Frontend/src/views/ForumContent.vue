<template>
  <main>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">Forum Content</p>
              </div>
            </div>
            <div class="card-body">
              <div class="card">
                <div class="card-body">
                  <a href="/tables/forum"><i class="fa fa-arrow-left backArr" aria-hidden="true"></i></a>
                  <img
                    src="../assets/img/team-1.jpg"
                    alt="profile_image"
                    class="userImg"
                  />{{ items.UserName }} . {{ items.UpdatedTime }}
                  <h5 class="card-title ContentTitle">
                    {{ items.ForumTitle }}
                  </h5>
                  <p class="card-text">
                    {{ items.Description }}
                  </p>
                  <br />
                  <i class="fa fa-thumbs-o-up LikeIcon" aria-hidden="true">{{
                    items.LikeNum
                  }}</i>
                  <i class="fa fa-comment-o CommentIcon" aria-hidden="true"></i>
                  <i class="fa fa-share ShareIcon" aria-hidden="true">Share</i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { GetForumContentByID } from "../assets/Domain.js";

const params = new URLSearchParams(window.location.search);
const ForumID = params.get("ForumID");

export default {
  data() {
    return {
      items: [],
    };
  },
  methods: {
    async getForumContent() {
      const response = await fetch(GetForumContentByID + ForumID, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      this.items = data;
      let date = new Date(this.items.UpdatedTime);
      let currentDate = new Date();
      let timeDifference = currentDate - date;

      // Calculate the time differences in various units
      let seconds = Math.floor(timeDifference / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      let days = Math.floor(hours / 24);
      let weeks = Math.floor(days / 7);
      let months = Math.floor(days / 30); // Approximation
      let years = Math.floor(days / 365); // Approximation

      // Determine the appropriate time unit to display
      let lastUpdatedTime;
      if (years > 0) {
        lastUpdatedTime = years + " year" + (years === 1 ? "" : "s") + " ago";
      } else if (months > 0) {
        lastUpdatedTime =
          months + " month" + (months === 1 ? "" : "s") + " ago";
      } else if (weeks > 0) {
        lastUpdatedTime = weeks + " week" + (weeks === 1 ? "" : "s") + " ago";
      } else if (days > 0) {
        lastUpdatedTime = days + " day" + (days === 1 ? "" : "s") + " ago";
      } else if (hours > 0) {
        lastUpdatedTime = hours + " hour" + (hours === 1 ? "" : "s") + " ago";
      } else if (minutes > 0) {
        lastUpdatedTime =
          minutes + " minute" + (minutes === 1 ? "" : "s") + " ago";
      } else {
        lastUpdatedTime = "Just now";
      }

      // Update the item with the formatted time
      this.items.UpdatedTime = lastUpdatedTime;
      console.log(this.items.UpdatedTime);
    },
  },
  mounted() {
    this.getForumContent();
  },
};
</script>

<style>
.userImg {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 10px;
}
.backArr {
  font-size: 20px;
  margin: 5px;
  background-color: #f8f9fe;
  border-radius: 50%;
}

.backArr:hover {
  cursor: pointer;
  background-color: #e9ecef;
}

.ContentTitle {
  font-size: 2dvw;
  font-weight: bold;
}

.LikeIcon {
  font-size: 25px;
  margin: 5px;
  margin-left: 14px;
}

.LikeIcon:hover {
  cursor: pointer;
  color: green;
}

.CommentIcon {
  font-size: 25px;
  margin: 5px;
  margin-left: 40px;
}
.CommentIcon:hover {
  cursor: pointer;
  color: #e9ecef;
}

.ShareIcon {
  font-size: 25px;
  margin: 5px;
  margin-left: 40px;
}
.ShareIcon:hover {
  cursor: pointer;
  color: #e9ecef;
}
</style>
