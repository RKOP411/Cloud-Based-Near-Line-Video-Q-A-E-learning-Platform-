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
                  <a href="/tables/forum"
                    ><i class="fa fa-arrow-left backArr" aria-hidden="true"></i
                  ></a>
                  <img
                    src="../assets/img/team-0.webp"
                    alt="profile_image"
                    class="userImg"
                  />{{ items.UserName }} . {{ items.UpdatedTime }}
                  <h5 class="card-title ContentTitle">
                    {{ items.ForumTitle }}
                  </h5>
                  <p
                    class="card-text"
                    v-html="sanitizeComment(items.Description)"
                  ></p>

                  <br />
                  <i
                    class="fa fa-thumbs-up LikeIcon"
                    aria-hidden="true"
                    @click="likedStatus ? DeleteLike() : AddLike()"
                  >
                    &nbsp;{{ likeNum }}</i
                  >
                  <i class="fa fa-comment CommentIcon" aria-hidden="true"></i>
                  <i class="fa fa-share ShareIcon" aria-hidden="true"
                    >&nbsp;Share</i
                  >
                  <br />
                  <br />
                  <!--Text Editor-->
                  <div>
                    <div ref="editor" class="quill-editor"></div>
                    <br />
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="AddComment()"
                    >
                      Comment
                    </button>
                  </div>
                  <!--Text Editor-->
                  <br />
                  <br />
                  <!-- Comment Part -->

                  <div>
                    <div v-if="comments.length > 0">
                      <div
                        v-for="comment in comments"
                        :key="comment.id"
                        class="card-body comment_border"
                      >
                        <img
                          src="../assets/img/team-0.webp"
                          alt="profile_image"
                          class="comment_userImg"
                        />
                        <b style="text-decoration: underline">{{
                          comment.UserName
                        }}</b>
                        . {{ comment.SendTime }}
                        <span
                          :class="
                            comment.Role === 'Teacher'
                              ? 'badge badge-sm badge badge-sm bg-gradient-warning'
                              : 'badge badge-sm badge badge-sm bg-gradient-success'
                          "
                        >
                          {{ comment.Role }}
                        </span>
                        <p
                          class="card-text"
                          v-html="sanitizeComment(comment.Text)"
                        ></p>
                        <span class="oval-border">
                          <i
                            class="fa fa-thumbs-up LikeCommentIcon"
                            aria-hidden="true"
                            @click="
                              comment.LikedStatus
                                ? DeleteCommentLike(
                                    comment.CommentID,
                                    comment.LikedStatus
                                  )
                                : AddCommentLike(
                                    comment.CommentID,
                                    comment.LikedStatus
                                  )
                            "
                            >&nbsp; {{ comment.LikeNum }}</i
                          >
                          <i
                            class="fa fa-share ShareCommentIcon"
                            aria-hidden="true"
                            >&nbsp;Share</i
                          >
                        </span>
                      </div>
                    </div>
                    <div v-else style="text-align: center">
                      <p>No comments</p>
                    </div>
                  </div>
                  <!-- Comment Part -->
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
import {
  GetForumContentByID,
  GetCommentByForumID,
  AddComment,
  ForumLikes,
  AddLike,
  CheckUserLiked,
  DeleteLike,
  AddCommentLike,
  AddCommentLike_Num,
  CheckUserLikedComment,
  DeleteCommentLike,
  DeleteCommentLike_Num,
} from "../assets/Domain.js";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill's CSS
import DOMPurify from "dompurify";

const params = new URLSearchParams(window.location.search);
const ForumID = params.get("ForumID");
export default {
  data() {
    return {
      items: [],
      comments: [],
      likeNum: 0,
      likedStatus: false,
    };
  },
  methods: {
    DeleteLike() {
      const userId = localStorage.getItem("UserID");
      const forumId = ForumID;
      if (this.likedStatus == true) {
        fetch(DeleteLike + userId + "/" + forumId, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserID: localStorage.getItem("UserID"),
            ForumID: ForumID,
          }),
        }).then((response) => {
          if (response.status === 200) {
            this.likedStatus = false;
            document.querySelector(".LikeIcon").style.color = "";
            this.GetForumLikes();
          }
        });
      }
    },
    AddLike() {
      if (this.likedStatus == false) {
        fetch(AddLike, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserID: localStorage.getItem("UserID"),
            ForumID: ForumID,
          }),
        }).then((response) => {
          if (response.status === 200) {
            this.likedStatus = true;
            document.querySelector(".LikeIcon").style.color = "green";
            this.GetForumLikes();
          }
        });
      }
    },
    CheckUserLiked() {
      const userId = localStorage.getItem("UserID");
      const forumId = ForumID;

      fetch(CheckUserLiked + userId + "/" + forumId, {
        // Correct URL formatting
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            document.querySelector(".LikeIcon").style.color = "green"; // Change the icon color if liked
            this.likedStatus = true;
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },

    GetForumLikes() {
      fetch(ForumLikes + ForumID, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            //console.log(data[0]);
            this.likeNum = data[0].Likes;
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    sanitizeComment(commentHtml) {
      return DOMPurify.sanitize(commentHtml);
    },
    initQuill() {
      this.quill = new Quill(this.$refs.editor, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            ["link", "image"],
            [{ list: "ordered" }, { list: "bullet" }],
          ],
        },
      });
    },
    async getForumContent() {
      const response = await fetch(GetForumContentByID + ForumID, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      this.items = data;
      // Update the item with the formatted time
      this.items.UpdatedTime = this.Calculate_LastUpdate(
        this.items.UpdatedTime
      );
    },

    AddCommentLike(CommentID, LikedStatus) {
      if (LikedStatus === false) {
        fetch(AddCommentLike, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CommentID: CommentID,
            UserID: localStorage.getItem("UserID"),
          }),
        }).then((response) => {
          if (response.status === 200) {
            this.getComment();
          }
        });

        fetch(AddCommentLike_Num + CommentID, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          if (response.status === 200) {
            this.getComment();
          }
        });
      }
    },
    DeleteCommentLike(CommentID, LikedStatus) {
      const userId = localStorage.getItem("UserID");
      if (LikedStatus === true) {
        fetch(DeleteCommentLike + userId + "/" + CommentID, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CommentID: CommentID,
            UserID: localStorage.getItem("UserID"),
          }),
        }).then((response) => {
          if (response.status === 200) {
            this.getComment();
          }
        });

        fetch(DeleteCommentLike_Num + CommentID, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          if (response.status === 200) {
            this.getComment();
          }
        });
        document.querySelector(".LikeCommentIcon").style.color = "";
      }
    },

    async CheckUserLikedComment(CommentID) {
      let likedStatus = false;
      const userId = localStorage.getItem("UserID");
      try {
        const response = await fetch(
          CheckUserLikedComment + userId + "/" + CommentID,
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
        if (data[0]) {
          document.querySelector(".LikeCommentIcon").style.color = "green";
          likedStatus = true;
        }
      } catch (error) {
        console.error("Error:", error);
      }
      return likedStatus;
    },
    async getComment() {
      const response = await fetch(GetCommentByForumID + ForumID, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      this.comments = data;
      for (let i = 0; i < this.comments.length; i++) {
        this.comments[i].LikedStatus = await this.CheckUserLikedComment(
          this.comments[i].CommentID
        );
        this.comments[i].SendTime = this.Calculate_LastUpdate(
          this.comments[i].SendTime
        );
        // console.log(this.comments[i].LikedStatus);
      }
    },

    Calculate_LastUpdate(time) {
      let date = new Date(time);
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

      return lastUpdatedTime;
    },

    AddComment() {
      if (this.quill.root.innerHTML !== "<p><br></p>") {
        fetch(AddComment, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ForumID: ForumID,
            UserID: localStorage.getItem("UserID"),
            Text: this.quill.root.innerHTML.replace(/\\n/g, ""),
          }),
        }).then((response) => {
          if (response.status === 200) {
            this.quill.root.innerHTML = "<p><br></p>";
            this.getComment();
          }
        });
      } else {
        alert("Please enter your comment");
      }
    },
  },
  mounted() {
    this.GetForumLikes();
    this.CheckUserLiked();
    this.getForumContent();
    this.getComment();
    this.initQuill();
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
.comment_userImg {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin: 10px;
}
.comment_border {
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-radius: 2%;
}
.comment_border:hover {
  background-color: #f8f9fe;
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

.LikeCommentIcon {
  font-size: 15px;
  margin: 5px;
}
.LikeCommentIcon:hover {
  cursor: pointer;
  color: green;
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

.ShareCommentIcon {
  font-size: 15px;
  margin: 5px;
  margin-left: 30px;
}

.ShareCommentIcon:hover {
  cursor: pointer;
  color: #e9ecef;
}

.editor {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 10px;
  min-height: 150px;
  cursor: text;
}
.toolbar button {
  margin-right: 5px;
}
</style>
