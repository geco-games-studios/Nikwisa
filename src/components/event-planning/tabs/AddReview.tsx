import React, { useState } from "react";

import { AppDispatch } from "@/reducers/store";
import { useDispatch } from "react-redux";
import { addReview } from "@/reducers/reviewSlice";
import ReviewForm from "@/components/forms/ReviewForm";

const AddReview: React.FC<{ storeId: number }> = ({ storeId }) => {
  const dispatch: AppDispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: { rating: number; comment: string }) => {
    setIsSubmitting(true);
    try {
      await dispatch(addReview({ storeId, reviewData: data }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReviewForm
      initialData={{ rating: 0, comment: "" }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default AddReview;
