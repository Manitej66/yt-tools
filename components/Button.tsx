import React from "react";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = (props: ButtonProps) => {
  return (
    <button
      className="bg-blue-600 disabled:opacity-60 hover:bg-blue-700 text-white py-3 px-4 rounded"
      {...props}
    >
      {props.children}
    </button>
  );
};
