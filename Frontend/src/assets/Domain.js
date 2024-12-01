const DomainName = "http://localhost:3000/";

const registerDomain = DomainName + "account/register";
const verifyEmailDomain = DomainName + "account/verifyEmail";
const GetAllForum = DomainName + "forum/GetAllforum";
const GetForumContentByID = DomainName + "forum/GetforumByID/";
const GetCommentByForumID = DomainName + "forum/GetCommentByForumID/";
const AddComment = DomainName + "forum/AddComment/";
const ForumLikes = DomainName + "forum/ForumLikes/";
const AddLike = DomainName + "forum/AddLike/";
const CheckUserLiked = DomainName + "forum/CheckUserLiked/";
const DeleteLike = DomainName + "forum/DeleteLike/";
export {
    registerDomain, verifyEmailDomain,
    GetAllForum, GetForumContentByID, GetCommentByForumID, AddComment, ForumLikes, AddLike, CheckUserLiked,DeleteLike
};