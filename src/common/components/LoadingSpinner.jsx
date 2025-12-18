// common/components/LoadingSpinner.jsx
export default function LoadingSpinner({ size = "md", message = "Loading..." }) {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`${sizes[size]} border-4 border-blue-500 border-t-transparent rounded-full animate-spin`}></div>
      {message && <p className="text-gray-400">{message}</p>}
    </div>
  );
}