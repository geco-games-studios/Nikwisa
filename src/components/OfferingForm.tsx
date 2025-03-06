"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormRow } from "./FormRow"; // Assuming FormRow is the same for both forms
import { OfferingFormProps } from "@/types/types";

export default function OfferingForm({
  initialData,
  isEdit = false,
}: OfferingFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    image: initialData?.image || "",
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEdit ? `/api/services/${initialData?.id}` : "/api/services";
    const method = isEdit ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      router.push("/services"); // Go back to the services page
    } catch (error) {
      console.error("Failed to save service", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      {/* Service Form */}
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-4">
          {isEdit ? "Edit Service" : "Add Service"}
        </h2>

        <FormRow
          type="text"
          name="name"
          value={formData.name}
          handleChange={handleChange}
          labelText="Service Name"
          placeholder="Enter service name"
        />

        <FormRow
          type="textarea"
          name="description"
          value={formData.description}
          handleChange={handleChange}
          labelText="Description"
          placeholder="Enter service description"
        />

        <FormRow
          type="number"
          name="price"
          value={formData.price}
          handleChange={handleChange}
          labelText="Price"
          placeholder="Enter service price"
        />

        <div className="form-row">
          <label htmlFor="image" className="form-label">
            Store Image
          </label>
          <input type="file" id="image" className="form-input" />
        </div>

        <button
          type="submit"
          className="bg-[#B8902E] text-white py-2 px-4 rounded mt-4"
        >
          {isEdit ? "Update Service" : "Add Service"}
        </button>
      </form>
    </div>
  );
}
