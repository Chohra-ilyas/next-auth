import { BsExclamationTriangle, BsCheckCircle } from "react-icons/bs";

interface AlertProps {
  type: "success" | "error";
  message: string;
}

const Alert = ({ type, message }: AlertProps) => {
  const colorClasses =
    type === "success"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <div
      role="alert"
      className={`flex items-center p-4 rounded-md ${colorClasses}`}
    >
      {type === "success" && (
        <BsCheckCircle className="text-green-600 text-xl" />
      )}
      {type === "error" && (
        <BsExclamationTriangle className="text-red-600 text-xl" />
      )}
      <span className="ml-2">{message}</span>
    </div>
  );
};

export default Alert;
