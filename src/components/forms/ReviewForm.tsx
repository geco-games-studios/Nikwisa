import React, { useState } from "react";
import { FormRow } from "@/components/FormRow";
import FormRowSelect from "@/components/forms/FormRowSelect";

interface ReviewFormProps {
  initialData: { rating: number; comment: string };
  onSubmit: (data: { rating: number; comment: string }) => void;
  isSubmitting: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (
    field: "rating" | "comment",
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const ratingOptions = [1, 2, 3, 4, 5].map((value) => ({
    id: value,
    slug: value.toString(),
    title: value.toString(),
  }));

  return (
    <div className="max-w-3xl mx-auto md:ml-0 md:mr-auto mt-8">
      <FormRowSelect
        label="Rating"
        id="rating"
        value={formData.rating || ""}
        options={ratingOptions}
        onChange={(id, value) => handleInputChange("rating", Number(value))}
      />

      <FormRow
        type="textarea"
        name="comment"
        value={formData.comment}
        handleChange={(e) => handleInputChange("comment", e.target.value)}
        labelText="Review"
        placeholder="Enter your review"
      />

      <button
        onClick={handleSubmit}
        className={`bg-[#B8902E] text-white px-4 py-2 rounded mt-4 ${
          isSubmitting ? "opacity-50" : ""
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default ReviewForm;
