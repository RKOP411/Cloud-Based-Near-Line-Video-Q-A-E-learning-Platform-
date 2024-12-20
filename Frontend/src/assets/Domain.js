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
const AddCommentLike = DomainName + "forum/AddCommentLike/";
const AddCommentLike_Num = DomainName + "forum/updateLike/";
const CheckUserLikedComment = DomainName + "forum/CheckUserLikedComment/";
const DeleteCommentLike = DomainName + "forum/DeleteCommentLike/";
const DeleteCommentLike_Num = DomainName + "forum/updateLike_delete/";
const GetAllCourses = DomainName + "forum/GetAllCourses";
const GetForumByCourseID = DomainName + "forum/GetForumByCourseID/";
const CreateForum = DomainName + "forum/CreateForum";
const CourseNumQuesstion = DomainName + "forum/CourseNumQuesstion/";
const CreateCourse = DomainName + "forum/CreateCourse";
export {
    registerDomain, verifyEmailDomain,
    GetAllForum, GetForumContentByID, GetCommentByForumID, AddComment, GetAllCourses, GetForumByCourseID, CreateForum, CourseNumQuesstion, CreateCourse,      
    ForumLikes, AddLike, CheckUserLiked, DeleteLike,
    AddCommentLike, AddCommentLike_Num, CheckUserLikedComment, DeleteCommentLike, DeleteCommentLike_Num
};