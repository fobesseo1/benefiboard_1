// app/_components/LoadingSpinner.tsx
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        <div className="animate-spin rounded-full h-48 w-48 border-t-2 border-b-2 border-gray-900"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center ">
          <img src="/logo-benefiboard.svg" alt="logo" className="w-16 h-6" />
          <h2 className="text-xl text-gray-200 animate-pulse">loading...</h2>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
