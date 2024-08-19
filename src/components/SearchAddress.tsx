import React, { useState } from "react";
import SearchModal, { totalAddress } from "./SearchModal";
interface Props {
  setLocation: React.Dispatch<React.SetStateAction<totalAddress>>;
}
const SearchAddress: React.FC<Props> = ({ setLocation }) => {
  const [temp, setTemp] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setTemp("");
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      openModal();
    }
  };
  console.log("SearchAddress 렌더링");

  return (
    <div className="w-full flex justify-center">
      <input
        type="text"
        placeholder="주소입력"
        value={temp}
        onChange={(e) => {
          setTemp(e.target.value);
        }}
        onKeyDown={handleKeyPress}
        className="w-1/3"
      />
      <button
        onClick={() => {
          openModal();
        }}
      >
        주소 검색
      </button>
      <SearchModal
        isOpen={isModalOpen}
        onClose={closeModal}
        searchAddress={temp}
        setLocation={setLocation}
      />
    </div>
  );
};

export default SearchAddress;
