import axios from "axios";
const KAKAO_RESTAPI_KEY = import.meta.env.VITE_KAKAO_RESTAPI_KEY;
import { totalAddress } from "../components/SearchModal";
export const xyToAddress = async (address: totalAddress) => {
  const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${address.lng}&y=${address.lat}`;
  console.log(KAKAO_RESTAPI_KEY);
  const res = await axios.get(url, {
    headers: {
      Authorization: `KakaoAK ${KAKAO_RESTAPI_KEY}`,
    },
  });
  let temp = {
    ...address,
    regionName:
      res.data.documents[1].region_2depth_name +
      " " +
      res.data.documents[1].region_3depth_name,
  };
  return temp;
};
