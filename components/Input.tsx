import React from "react";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
}

export const Input = (props: InputProps) => {
  return (
    <input
      className="w-full bg-transparent px-4 py-2 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
      {...props}
    />
  );
};
