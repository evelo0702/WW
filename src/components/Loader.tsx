const Loader = ({ text }: { text: string | null }) => {
  return (
    <div className="flex flex-col justify-center items-center  h-full">
      <div className="loader border-t-4 border-b-4 border-gray-900 rounded-full w-16 h-16 animate-spin"></div>
      {text}
    </div>
  );
};

export default Loader;
