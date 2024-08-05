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
  return (
    <div>
      <input
        type="text"
        placeholder="원하시는 주소를 입력해주세요"
        value={temp}
        onChange={(e) => {
          setTemp(e.target.value);
        }}
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
