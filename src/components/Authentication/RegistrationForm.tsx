import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/reducers/store";
import { registerUser } from "@/reducers/authSlice";
import Alert from "@/components/forms/Alert"; // Import the Alert component

const RegistrationForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "", // Add this field
    role: "client",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [alertMessage, setAlertMessage] = useState<string | null>(null); // State for alert message
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null); // State for alert type

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.username) errors.username = "Username is required";
    if (!formData.email) errors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (!formData.phone_number)
      errors.phone_number = "Phone number is required";
    if (!formData.password) errors.password = "Password is required";
    if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      // Create a new object without confirmPassword
      const { ...registrationData } = formData;

      const resultAction = await dispatch(registerUser(registrationData));
      if (registerUser.fulfilled.match(resultAction)) {
        setAlertMessage("Registration successful!");
        setAlertType("success");
        router.push("/signin");
      }
    } catch {
      setAlertMessage("Registration failed: An unknown error occurred.");
      setAlertType("error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white border-t-[5px] border-[#B88E2F] rounded-lg shadow-lg p-8 my-12 mx-auto"
      >
        <h3 className="text-center text-4xl font-semibold">Register</h3>

        {/* Display Alert based on success or error */}
        {alertMessage && <Alert message={alertMessage} type={alertType!} />}

        {error && (
          <div className="mb-4 p-3 rounded-md text-center bg-red-100 text-red-800">
            {error}
          </div>
        )}

        <div className="form-row mt-6">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-yellow-500 ${
              validationErrors.username ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.username}
            onChange={handleChange}
          />
          {validationErrors.username && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.username}
            </p>
          )}
        </div>

        <div className="form-row mt-6">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-yellow-500 ${
              validationErrors.email ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.email}
            onChange={handleChange}
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.email}
            </p>
          )}
        </div>

        <div className="form-row mt-6">
          <label htmlFor="phone_number" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-yellow-500 ${
              validationErrors.phone_number
                ? "border-red-500"
                : "border-gray-300"
            }`}
            value={formData.phone_number}
            onChange={handleChange}
          />
          {validationErrors.phone_number && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.phone_number}
            </p>
          )}
        </div>

        <div className="form-row mt-6">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-yellow-500 ${
              validationErrors.password ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.password}
            onChange={handleChange}
          />
          {validationErrors.password && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.password}
            </p>
          )}
        </div>
        <div className="form-row mt-6">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring focus:ring-yellow-500 ${
              validationErrors.confirmPassword
                ? "border-red-500"
                : "border-gray-300"
            }`}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {validationErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full bg-[#B88E2F] text-white py-3 rounded-md mt-6 ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="text-center mt-4">
          <span className="text-slate-400">Already a member? </span>
          <a href="/signin" className="text-yellow-500 hover:underline">
            Signin
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;
