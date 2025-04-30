import axios from "axios";

const baseUrl = "https://law-lms.onrender.com";
const Token = JSON.parse(localStorage.getItem("loginData"));

axios.defaults.headers.common["Authorization"] = `Bearer ${Token?.token}`;

// ================================= Authentication section ========================

// Register
export const AuthRegister = async (data) => {
  try {
    const res = await axios.post(`${baseUrl}/api/auth/signup`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to register";
  }
};

// Login
export const AuthLogin = async (data) => {
  try {
    const res = await axios.post(`${baseUrl}/api/auth/login`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to login";
  }
};

// Logout
export const Logout = async () => {
  try {
    const res = await axios.post(`${baseUrl}/api/auth/logout`);
    localStorage.clear();
    return res.data.message;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to logout";
  }
};

// ================================= Authentication section ========================

// ================================= User section ========================

// Get all users
export const GetAllUsers = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/users`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch users";
  }
};

// Update user by ID
export const UpdateUserById = async (userId, userData) => {
  try {
    const res = await axios.put(`${baseUrl}/api/users/${userId}`, userData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update user";
  }
};

// Update user approval status
export const UpdateUserApproval = async (userId, isApproved) => {
  try {
    const res = await axios.put(`${baseUrl}/api/users/approve/${userId}`, { isApproved });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update approval status";
  }
};

// Delete user by ID
export const DeleteUserById = async (userId) => {
  try {
    const res = await axios.delete(`${baseUrl}/api/users/${userId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to delete user";
  }
};

// ================================= User section ========================

// ================================= Course section ========================

// Get all courses
export const GetAllCourses = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/courses`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch courses";
  }
};

// Get course by ID
export const GetCourseById = async (id) => {
  try {
    const res = await axios.get(`${baseUrl}/api/courses/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch course";
  }
};

// Add new course
export const AddNewCourseApi = async (courseData) => {
  try {
    const res = await axios.post(`${baseUrl}/api/courses`, courseData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to add course";
  }
};

// Update course by ID
export const UpdateCourseById = async (courseData, id) => {
  try {
    const res = await axios.put(`${baseUrl}/api/courses/${id}`, courseData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update course";
  }
};

// Delete course by ID
export const DeleteCourseById = async (id) => {
  try {
    const res = await axios.delete(`${baseUrl}/api/courses/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to delete course";
  }
};

// ================================= Course section ========================

// ================================= Upload file section ========================

// Without type
export const UploadFile = async (file) => {
  try {
    const res = await axios.post(`${baseUrl}/api/upload`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to upload file";
  }
};

// With type
export const UploadFileWithType = async (file) => {
  try {
    const res = await axios.post(`${baseUrl}/api/upload/type`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to upload file";
  }
};

// ================================= Upload file section ========================

// ================================= Announcement section ========================

// Create announcement
export const CreateAnnouncement = async (announcementData) => {
  try {
    const res = await axios.post(`${baseUrl}/api/announcements`, announcementData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to create announcement";
  }
};

// Get all announcements
export const GetAllAnnouncements = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/announcements/all`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch announcements";
  }
};

// Get announcement by ID
export const GetAnnouncementById = async (id) => {
  try {
    const res = await axios.get(`${baseUrl}/api/announcements/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch announcement";
  }
};

// Update announcement
export const UpdateAnnouncement = async (id, updateData) => {
  try {
    const res = await axios.put(`${baseUrl}/api/announcements/${id}`, updateData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to update announcement";
  }
};

// ================================= Announcement section ========================

// ================================= Forum section ========================

// Add forum post
export const addFormPost = async (post) => {
  try {
    const res = await axios.post(`${baseUrl}/api/forum`, post, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to add forum post";
  }
};

// Get all forum posts
export const getAllFormPost = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/forum`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch forum posts";
  }
};

// Get forum post by ID
export const getFormPost = async (id) => {
  try {
    const res = await axios.get(`${baseUrl}/api/forum/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to fetch forum post";
  }
};

// Edit forum post
export const editFormPost = async (id, post) => {
  try {
    const res = await axios.post(`${baseUrl}/api/forum/${id}`, post, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to edit forum post";
  }
};

// Add forum post comment
export const addFormPostComment = async (id, payload) => {
  try {
    const res = await axios.post(`${baseUrl}/api/forum/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to add comment";
  }
};

// Add comment reply
export const addFormCommentReplay = async (postId, commentId, payload) => {
  try {
    const res = await axios.post(
      `${baseUrl}/api/forum/${postId}/replay/${commentId}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || "Failed to add comment reply";
  }
};

// ================================= Forum section ========================