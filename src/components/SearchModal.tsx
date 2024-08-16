import axios from "axios";
import React, { useEffect, useState } from "react";
import DaumPostcodeEmbed from "react-daum-postcode";
import { dfs_xy_conv } from "../utils/changeXYcode";
import { Coordinate } from "../utils/changeXYcode";
const KAKAO_RESTAPI_KEY = import.meta.env.KAKAO_RESTAPI_KEY;

export interface totalAddress extends Coordinate {
  addressName?: string;
  regionName?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchAddress: string;
  setLocation: (data: totalAddress) => void;
}

const SearchModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  searchAddress,
  setLocation,
}) => {
  let [roadAdd, setRoadAdd] = useState("");

  // 주소검색 api에서 받은 데이터로 위도 경도를 받아오는 메소드
  const getData = async (data: string) => {
    const url = "https://dapi.kakao.com/v2/local/search/address.json";
    const query = `${data}`;
    const res = await axios.get(url, {
      params: { query: query },
      headers: {
        Authorization: `KakaoAK ${KAKAO_RESTAPI_KEY}`,
      },
    });
    const temp: totalAddress = {
      ...dfs_xy_conv(
        "toXY",
        res.data.documents[0].road_address.y,
        res.data.documents[0].road_address.x
      ),
    };
    temp.addressName = res.data.documents[0].road_address.address_name;
    temp.regionName =
      res.data.documents[0].road_address.region_2depth_name +
      " " +
      res.data.documents[0].road_address.region_3depth_name;

    setLocation(temp);
  };
  useEffect(() => {
    if (roadAdd) {
      getData(roadAdd);
    }
  }, [roadAdd]);

  if (!isOpen) return null; // 모달이 열리지 않은 경우 아무것도 렌더링하지 않음
  return (
    <div style={overlayStyle}>
      <div style={modalStyle} className="md:w-1/2">
        <DaumPostcodeEmbed
          onClose={onClose}
          defaultQuery={searchAddress}
          onComplete={(data) => setRoadAdd(data.roadAddress)}
        />
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

// 스타일 정의
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle: React.CSSProperties = {
  background: "white",
  padding: "20px",
  borderRadius: "5px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
};

export default SearchModal;
