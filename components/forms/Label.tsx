import React from "react";

export default function Label({
  children,
  label,
  required,
}: {
  children: React.ReactNode;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="block my-4">
      <div className="font-bold mb-2 text-sm">
        {label}
        {required && <span className="text-blue-500 ml-1">*</span>}
      </div>
      {children}
    </label>
  );
}
