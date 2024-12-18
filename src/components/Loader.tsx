const Loader = ({ text, mode }: { text: string | null; mode: string }) => {
  return (
    <div className="flex flex-col justify-center items-center  h-full">
      <div className="loader border-t-4 border-b-4 border-gray-900 rounded-full w-16 h-16 animate-spin"></div>
      {mode == "main" ? (
        <div className="w-full h-full  text-3xl">{text}</div>
      ) : (
        <div>{text}</div>
      )}
    </div>
  );
};

export default Loader;
