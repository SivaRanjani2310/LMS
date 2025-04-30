import "./Profile.css";
import { useState, useEffect } from "react";
import phoneSVG from "../Assets/SVG/phoneSVG.svg";
import mailSVG from "../Assets/SVG/mailSVG.svg";
import axios from "axios";
import defaultPorfileSVG from "../Assets/SVG/defaultPorfileSVG.svg";
import defaultBannerSVG from "../Assets/SVG/defaultBannerSVG.svg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    username: "Default username",
    firstName: "Default firstName",
    lastName: "Default lastName",
    email: "Default email",
    phoneNumber: "Default phoneNumber",
    gender: "Default gender",
    profilePic: defaultPorfileSVG,
    profileBanner: defaultBannerSVG,
    address: "Default address",
    educationalQualification: "Default educational Qualification",
    maritalStatus: "Default marital Status",
    dob: "default dob",
    ministryExperience: "default ministry Experience",
    theologicalQualification: "default theological Qualification",
    salvationExperience: "default salvation Experience",
  });
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [selectedProfileBanner, setSelectedProfileBanner] = useState(null);
  const [selectedSignatureFile, setSelectedSignatureFile] = useState(null);
  const [selectedEducationCertFile, setSelectedEducationCertFile] =
    useState(null);
  const user = JSON.parse(localStorage.getItem("userdata"));

  useEffect(() => {
    if (localStorage.getItem("userdata") != null) {
      const user = JSON.parse(localStorage.getItem("userdata"));
      console.log(user);
      setProfileData({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.mobileNo,
        gender: user.gender,
        passportPhotoFile: user.passportPhotoFile
          ? user.passportPhotoFile
          : defaultPorfileSVG,
        profileBanner: user.profileBanner
          ? user.profileBanner
          : defaultBannerSVG,
        address: user.presentAddress,
        educationalQualification: user.educationalQualification,
        maritalStatus: user.maritalStatus,
        dob: user.dob,
        ministryExperience: user.ministryExperience,
        theologicalQualification: user.theologicalQualification,
        salvationExperience: user.salvationExperience,
        signatureFile: user.signatureFile,
        educationCertFile: user.educationCertFile,
      });
    } else {
      navigate("/login");
    }
  }, []);

  // Validation functions
  const validateName = (value) => {
    return /^[A-Za-z\s]+$/.test(value);
  };

  const validateNumber = (value) => {
    return /^\d+$/.test(value);
  };

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validateEducationalQualification = (value) => {
    return /^[A-Za-z\s]+$/.test(value);
  };

  const validateGender = (value) => {
    return /^[A-Za-z\s]+$/.test(value);
  };

  const validateMaritalStatus = (value) => {
    return /^[A-Za-z\s]+$/.test(value);
  };

  // Check if field is empty
  const isEmpty = (value) => {
    return !value || value.trim() === "";
  };

  // Form validation
  const validateForm = () => {
    let isValid = true;

    if (isEmpty(profileData.firstName)) {
      toast.error("First name is required");
      isValid = false;
    } else if (!validateName(profileData.firstName)) {
      toast.error("First name can only contain letters and spaces");
      isValid = false;
    }

    if (isEmpty(profileData.lastName)) {
      toast.error("Last name is required");
      isValid = false;
    } else if (!validateName(profileData.lastName)) {
      toast.error("Last name can only contain letters and spaces");
      isValid = false;
    }

    if (isEmpty(profileData.username)) {
      toast.error("Username is required");
      isValid = false;
    } else if (!validateName(profileData.username)) {
      toast.error("Username can only contain letters and spaces");
      isValid = false;
    }

    if (isEmpty(profileData.email)) {
      toast.error("Email is required");
      isValid = false;
    } else if (!validateEmail(profileData.email)) {
      toast.error("Please enter a valid email address");
      isValid = false;
    }

    if (isEmpty(profileData.phoneNumber)) {
      toast.error("Phone number is required");
      isValid = false;
    } else if (!validateNumber(profileData.phoneNumber)) {
      toast.error("Phone number can only contain numbers");
      isValid = false;
    }

    if (isEmpty(profileData.gender)) {
      toast.error("Gender is required");
      isValid = false;
    } else if (!validateGender(profileData.gender)) {
      toast.error("Gender can only contain letters and spaces");
      isValid = false;
    }

    if (isEmpty(profileData.address)) {
      toast.error("Address is required");
      isValid = false;
    }

    if (isEmpty(profileData.educationalQualification)) {
      toast.error("Educational qualification is required");
      isValid = false;
    } else if (
      !validateEducationalQualification(profileData.educationalQualification)
    ) {
      toast.error(
        "Educational qualification can only contain letters and spaces"
      );
      isValid = false;
    }

    if (isEmpty(profileData.maritalStatus)) {
      toast.error("Marital status is required");
      isValid = false;
    } else if (!validateMaritalStatus(profileData.maritalStatus)) {
      toast.error("Marital status can only contain letters and spaces");
      isValid = false;
    }

    if (isEmpty(profileData.dob)) {
      toast.error("Date of birth is required");
      isValid = false;
    }

    if (isEmpty(profileData.ministryExperience)) {
      toast.error("Ministry experience is required");
      isValid = false;
    }

    if (isEmpty(profileData.theologicalQualification)) {
      toast.error("Theological qualification is required");
      isValid = false;
    }

    if (isEmpty(profileData.salvationExperience)) {
      toast.error("Salvation experience is required");
      isValid = false;
    }

    return isValid;
  };

  // Handle edit/save click
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate input based on field name
    if (name === "firstName" && !validateName(value)) {
      toast.error("First name can only contain letters and spaces");
      return;
    }
    if (name === "username" && !validateName(value)) {
      toast.error("Username can only contain letters and spaces");
      return;
    }
    if (name === "lastName" && !validateName(value)) {
      toast.error("Last name can only contain letters and spaces");
      return;
    }
    if (name === "phoneNumber" && !validateNumber(value)) {
      toast.error("Phone number can only contain numbers");
      return;
    }
    if (name === "gender" && !validateGender(value)) {
      toast.error("Gender can only contain letters and spaces");
      return;
    }
    if (name === "maritalStatus" && !validateMaritalStatus(value)) {
      toast.error("Marital status can only contain letters and spaces");
      return;
    }
    if (
      name === "educationalQualification" &&
      !validateEducationalQualification(value)
    ) {
      toast.error(
        "Educational qualification can only contain letters and spaces"
      );
      return;
    }

    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  // Handle save click
  const handleSaveClick = async () => {
    if (!validateForm()) return;
window.location.reload();
    setIsEditing(false);
    const formData = new FormData();

    for (const key in profileData) {
      if (key === "emergencyContact") {
        const emergencyContact = profileData[key];
        for (const field in emergencyContact) {
          formData.append(
            `emergencyContact[${field}]`,
            emergencyContact[field]
          );
        }
      } else {
        formData.append(key, profileData[key]);
      }
    }

    if (selectedProfileImage) {
      formData.append("passportPhotoFile", selectedProfileImage);
    }
    if (selectedProfileBanner) {
      formData.append("profileBanner", selectedProfileBanner);
    }
    if (selectedSignatureFile) {
      formData.append("signatureFile", selectedSignatureFile);
    }
    if (selectedEducationCertFile) {
      formData.append("educationCertFile", selectedEducationCertFile);
    }

    try {
      const apiBaseUrl = process.env.REACT_APP_BASE_API;
      const response = await axios.put(
        `${apiBaseUrl}/api/users/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem("userdata", JSON.stringify(response.data.user));
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // Handle profile image change
  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileData((prevData) => ({
        ...prevData,
        passportPhotoFile: URL.createObjectURL(file),
      }));
      setSelectedProfileImage(file);
    }
  };

  // Handle profile banner change
  const handleProfileBannerChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileData((prevData) => ({
        ...prevData,
        profileBanner: URL.createObjectURL(file),
      }));
      setSelectedProfileBanner(file);
    }
  };

  const handleSignatureFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileData((prevData) => ({
        ...prevData,
        signatureFile: URL.createObjectURL(file),
      }));
      setSelectedSignatureFile(file);
    }
  };

  const handleEducationCertFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileData((prevData) => ({
        ...prevData,
        educationCertFile: URL.createObjectURL(file),
      }));
      setSelectedEducationCertFile(file);
    }
  };

  return (
    <div className="profileContainer">
      <div className="profileBannerBox">
        <div className="profileBGBox">
          <img
            src={
              profileData?.profileBanner
                ? profileData?.profileBanner
                : defaultBannerSVG
            }
            alt="Banner"
          />
          {isEditing && (
            <label className="custom-file-upload imageBanner">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileBannerChange}
                className="imageBannerUpload"
              />
              Choose File for Profile Banner
            </label>
          )}
        </div>
        <div className="profileHeader">
          <div className="profileImage">
            <img
              src={
                profileData?.passportPhotoFile
                  ? profileData?.passportPhotoFile
                  : defaultPorfileSVG
              }
              alt="Profile"
              className="defaultImage"
            />
            {isEditing && (
              <label className="custom-file-upload">
                <input
                  name="passportPhotoFile"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="imageUpload"
                />
                Choose File
              </label>
            )}
          </div>
          <div className="profileHeaderInfo">
            <div className="profileName">{profileData?.username}</div>
            <div className="profileEmail">{profileData?.email}</div>
          </div>
          <div className="profileEditBtn">
            <button onClick={isEditing ? handleSaveClick : handleEditClick}>
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      </div>
      <div className="profileContent">
        <div className="profileSection">
          <div className="hh5">General Information</div>

          <div className="profileDetails">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={profileData.username}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="profileDetails">
            <label>First Name</label>
            <div className="d-flex flex-column  align-items-end " style={{ width: "340px" }}>
              <input
                type="text"
                // className="w-800"
                style={{ width: "340px" }}
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="profileDetails">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="profileDetails">
            <label>Gender</label>
            <select
              name="gender"
              value={profileData.gender}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="profileDetails">
            <label>Address</label>
            <textarea
              name="address"
              value={profileData.address}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="profileSeperator"></div>
          <div className="hh5">Contact Details</div>
          <div className="profileDetails profileSPLBox">
            <img src={phoneSVG} alt="phoneNumberSVG" />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="profileDetails profileSPLBox">
            <img src={mailSVG} alt="mailSVG" />
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="profileSection">
          <div className="hh5">Other Informations</div>
          <div className="profileDetails">
            <label>Education Qualification</label>
            <input
              type="text"
              name="educationalQualification"
              value={profileData.educationalQualification}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="profileDetails">
            <label>Marital Status</label>
            <select
              name="maritalStatus"
              value={profileData.maritalStatus || ""}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          <div className="profileDetails ">
            <label>Date of Birth</label>
            <div className="d-flex flex-column align-items-end" style={{width: "340px"}}>
              <input
                type={!isEditing ? "text" : "date"}
                // className="w-800"
                style={{width: "340px"}}
                name="dob"
                value={profileData.dob ? profileData.dob.split("T")[0] : ""}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>
          <div className="profileDetails">
            <label>Ministry Experience</label>
            <textarea
              name="ministryExperience"
              value={profileData.ministryExperience}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="profileDetails">
            <label>Theological Qualification</label>
            <textarea
              name="theologicalQualification"
              value={profileData.theologicalQualification}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="profileDetails">
            <label>Salvation Experience</label>
            <textarea
              name="salvationExperience"
              value={profileData.salvationExperience}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="profileDetails">
            <label>Signature File</label>
            <div className="profileBGBox">
              <img
                src={
                  profileData?.signatureFile
                    ? profileData?.signatureFile
                    : defaultBannerSVG
                }
                alt="Banner"
              />
              {isEditing && (
                <label className="custom-file-upload text-white imageBanner">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureFileChange}
                    className="imageBannerUpload"
                  />
                  Choose File for Signature
                </label>
              )}
            </div>
          </div>
          <div className="profileDetails">
            <label>Education CertFile</label>
            <div className="profileBGBox">
              <img
                src={
                  profileData?.educationCertFile
                    ? profileData?.educationCertFile
                    : defaultBannerSVG
                }
                alt="Banner"
              />
              {isEditing && (
                <label className="custom-file-upload text-white imageBanner">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEducationCertFileChange}
                    className="imageBannerUpload"
                  />
                  Choose File for Education file
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
