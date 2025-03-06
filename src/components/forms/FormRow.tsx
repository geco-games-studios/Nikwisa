import React from "react";

interface FormRowProps {
  type: string;
  name: string;
  value: string | number;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  labelText?: string;
  placeholder?: string;
}

const FormRow: React.FC<FormRowProps> = ({
  type,
  name,
  value,
  handleChange,
  labelText,
  placeholder,
}) => (
  <div className="mb-6">
    <label htmlFor={name} className="block text-base font-medium text-gray-700">
      {labelText}
    </label>
    {type === "textarea" ? (
      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-4 mt-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    )}
  </div>
);

export default FormRow;
