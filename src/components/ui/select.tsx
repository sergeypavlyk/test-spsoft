"use client";

import { cn } from "@/lib/utils";
import React, { SelectHTMLAttributes, forwardRef, useState } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

interface CustomSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  required?: boolean;
  className?: string;
  register?: UseFormRegister<any>;
  error?: FieldError | string;
  options: Array<{ label: string; value: string | number }>;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, CustomSelectProps>(
  (props, ref) => {
    const {
      className,
      required,
      register,
      error,
      value,
      onChange,
      options,
      placeholder,
      ...selectProps
    } = props;

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const closeDropdown = () => setIsOpen(false);

    const wrapperStyles = cn("relative flex flex-col", className);

    const dropdownStyles = cn(
      "h-[72px] w-full border px-6 truncate lg:text-h5 max-lg:text-h6 font-bold bg-transparent focus:border-border-gray-300 focus:outline-none border-gray-300 rounded-none uppercase appearance-none leading-none placeholder-gray-300/50",
      error && "border-red",
      value || isOpen ? "text-black" : "text-gray-300/50"
    );

    const chevronStyles = cn(
      "absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300",
      !isOpen && "rotate-180"
    );

    return (
      <div className={wrapperStyles}>
        <select
          {...register}
          {...selectProps}
          ref={ref}
          onClick={toggleDropdown}
          onBlur={closeDropdown}
          onChange={onChange}
          className={dropdownStyles}
          required={required}
          value={value}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {required ? `${placeholder}*` : placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className={chevronStyles}>
          <ChevronIcon />
        </span>
      </div>
    );
  }
);

Select.displayName = "Select";

const ChevronIcon = () => (
  <svg
    width="9"
    height="4"
    viewBox="0 0 9 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.5 -3.93402e-07L9 4L0 4L4.5 -3.93402e-07Z" fill="black" />
  </svg>
);

export default Select;
