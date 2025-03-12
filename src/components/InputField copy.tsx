import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  disabled?: boolean;
  className?: string; // Add this line
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  hidden,
  disabled,
  className,
  inputProps,
}: InputFieldProps) => {
  return (
    // <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
    //   <label className="text-xs text-gray-500">{label}</label>
    //   <input
    //     type={type}
    //     {...register(name)}
    //     className={`ring-[1.5px] p-2 rounded-md text-sm w-full ${
    //       disabled
    //         ? "bg-gray-100 cursor-not-allowed ring-gray-200"
    //         : "ring-gray-300"
    //     }`}
    //     defaultValue={defaultValue}
    //     disabled={disabled} // Apply the disabled prop
    //     {...inputProps}
    //   />
    //   {error?.message && (
    //     <p className="text-xs text-red-400">{error.message.toString()}</p>
    //   )}
    // </div>
    <div
      className={
        hidden ? "hidden" : `flex flex-col gap-2 w-full ${className || ""}`
      }
    >
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        {...register(name)}
        className={`ring-[1.5px] p-2 rounded-md text-sm w-full ${
          disabled
            ? "bg-gray-100 cursor-not-allowed ring-gray-200"
            : "ring-gray-300"
        }`}
        defaultValue={defaultValue}
        disabled={disabled}
        {...inputProps}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
