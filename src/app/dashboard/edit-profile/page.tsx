"use client";

import FormRow from "@/components/forms/FormRow";
import { useState } from "react";

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  address: string;
  profile_picture: File | null;
}

const defaultProfileData: ProfileData = {
  first_name: "",
  last_name: "",
  email: "",
  date_of_birth: "",
  gender: "",
  address: "",
  profile_picture: null,
};

const EditProfilePage: React.FC = () => {
  const [profileData, setProfileData] =
    useState<ProfileData>(defaultProfileData);
  const [, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setProfileData((prev) => ({ ...prev, profile_picture: file }));
    }
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    if (!profileData.first_name)
      newErrors.first_name = "First name is required.";
    if (!profileData.last_name) newErrors.last_name = "Last name is required.";
    if (!profileData.email) newErrors.email = "Email is required.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateFields();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      console.log("Profile data submitted:", profileData);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-4">Update Profile</h2>

        <FormRow
          type="text"
          name="first_name"
          value={profileData.first_name}
          handleChange={(e) => handleInputChange("first_name", e.target.value)}
          labelText="First Name"
          placeholder="Enter your first name"
        />
        <FormRow
          type="text"
          name="last_name"
          value={profileData.last_name}
          handleChange={(e) => handleInputChange("last_name", e.target.value)}
          labelText="Last Name"
          placeholder="Enter your last name"
        />
        <FormRow
          type="email"
          name="email"
          value={profileData.email}
          handleChange={(e) => handleInputChange("email", e.target.value)}
          labelText="Email"
          placeholder="Enter your email"
        />
        <FormRow
          type="date"
          name="date_of_birth"
          value={profileData.date_of_birth}
          handleChange={(e) =>
            handleInputChange("date_of_birth", e.target.value)
          }
          labelText="Date of Birth"
        />
        <FormRow
          type="text"
          name="gender"
          value={profileData.gender}
          handleChange={(e) => handleInputChange("gender", e.target.value)}
          labelText="Gender"
          placeholder="Enter your gender"
        />
        <FormRow
          type="text"
          name="address"
          value={profileData.address}
          handleChange={(e) => handleInputChange("address", e.target.value)}
          labelText="Address"
          placeholder="Enter your address"
        />

        <div className="mb-6">
          <label
            htmlFor="profile_picture"
            className="block text-base font-medium text-gray-700"
          >
            Profile Picture
          </label>
          <input
            type="file"
            id="profile_picture"
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          className={`bg-[#B8902E] text-white py-2 px-4 rounded mt-4 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;

// "use client";

// import FormRow from "@/components/forms/FormRow";
// import { useState } from "react";

// const defaultProfileData = {
//   first_name: "",
//   last_name: "",
//   email: "",
//   date_of_birth: "",
//   gender: "",
//   address: "",
//   profile_picture: null,
// };

// const page: React.FC = () => {
//   const [profileData, setProfileData] = useState(defaultProfileData);
//   const [errors, setErrors] = useState<any>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleInputChange = (field: string, value: any) => {
//     setProfileData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.length) {
//       const file = e.target.files[0];
//       setProfileData((prev) => ({ ...prev, profile_picture: file }));
//     }
//   };

//   const validateFields = () => {
//     const newErrors: any = {};
//     if (!profileData.first_name)
//       newErrors.first_name = "First name is required.";
//     if (!profileData.last_name) newErrors.last_name = "Last name is required.";
//     if (!profileData.email) newErrors.email = "Email is required.";
//     return newErrors;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validateFields();
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length > 0) return;

//     // Submit logic (e.g., sending data to API)
//     setIsSubmitting(true);
//     try {
//       console.log("Profile data submitted:", profileData);
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-8">
//       <form onSubmit={handleSubmit}>
//         <div>
//           <h2 className="text-lg font-bold mb-4">Update Profile</h2>

//           <FormRow
//             type="text"
//             name="first_name"
//             value={profileData.first_name}
//             handleChange={(e) =>
//               handleInputChange("first_name", e.target.value)
//             }
//             labelText="First Name"
//             placeholder="Enter your first name"
//           />
//           <FormRow
//             type="text"
//             name="last_name"
//             value={profileData.last_name}
//             handleChange={(e) => handleInputChange("last_name", e.target.value)}
//             labelText="Last Name"
//             placeholder="Enter your last name"
//           />
//           <FormRow
//             type="email"
//             name="email"
//             value={profileData.email}
//             handleChange={(e) => handleInputChange("email", e.target.value)}
//             labelText="Email"
//             placeholder="Enter your email"
//           />
//           <FormRow
//             type="date"
//             name="date_of_birth"
//             value={profileData.date_of_birth}
//             handleChange={(e) =>
//               handleInputChange("date_of_birth", e.target.value)
//             }
//             labelText="Date of Birth"
//           />
//           <FormRow
//             type="text"
//             name="gender"
//             value={profileData.gender}
//             handleChange={(e) => handleInputChange("gender", e.target.value)}
//             labelText="Gender"
//             placeholder="Enter your gender"
//           />
//           <FormRow
//             type="text"
//             name="address"
//             value={profileData.address}
//             handleChange={(e) => handleInputChange("address", e.target.value)}
//             labelText="Address"
//             placeholder="Enter your address"
//           />

//           <div className="mb-6">
//             <label
//               htmlFor="profile_picture"
//               className="block text-base font-medium text-gray-700"
//             >
//               Profile Picture
//             </label>
//             <input
//               type="file"
//               id="profile_picture"
//               className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               onChange={handleImageChange}
//             />
//           </div>

//           <button
//             type="submit"
//             className={`bg-[#B8902E] text-white py-2 px-4 rounded mt-4 ${
//               isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Updating..." : "Update Profile"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default page;
