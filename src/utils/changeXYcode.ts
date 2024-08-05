const RE = 6371.00877; // 지구 반경(km)
const GRID = 5.0; // 격자 간격(km)
const SLAT1 = 30.0; // 투영 위도1(degree)
const SLAT2 = 60.0; // 투영 위도2(degree)
const OLON = 126.0; // 기준점 경도(degree)
const OLAT = 38.0; // 기준점 위도(degree)
const XO = 43; // 기준점 X좌표(GRID)
const YO = 136; // 기준점 Y좌표(GRID)

export interface Coordinate {
  lat: number;
  lng: number;
  x: number;
  y: number;
}

export function dfs_xy_conv(code: string, v1: number, v2: number): Coordinate {
  const DEGRAD = Math.PI / 180.0;
  const RADDEG = 180.0 / Math.PI;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  const rs: Coordinate = {};
  const theta = Number(v2) * DEGRAD - olon;

  if (code === "toXY") {
    rs.lat = Number(v1);
    rs.lng = Number(v2);
    let ra = Math.tan(Math.PI * 0.25 + Number(v1) * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);
    let adjustedTheta = theta;

    if (adjustedTheta > Math.PI) adjustedTheta -= 2.0 * Math.PI;
    if (adjustedTheta < -Math.PI) adjustedTheta += 2.0 * Math.PI;

    adjustedTheta *= sn;
    rs.x = Math.floor(ra * Math.sin(adjustedTheta) + XO + 0.5);
    rs.y = Math.floor(ro - ra * Math.cos(adjustedTheta) + YO + 0.5);
  } else {
    rs.x = Number(v1);
    rs.y = Number(v2);
    const xn = rs.x - XO;
    const yn = ro - rs.y + YO;
    const ra = Math.sqrt(xn * xn + yn * yn);
    let alat = Math.pow((re * sf) / ra, 1.0 / sn);
    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

    let theta: number;

    if (Math.abs(xn) <= 0.0) {
      theta = 0.0;
    } else {
      if (Math.abs(yn) <= 0.0) {
        theta = Math.PI * 0.5;
        if (xn < 0.0) theta = -theta;
      } else {
        theta = Math.atan2(xn, yn);
      }
    }
    const alon = theta / sn + olon;
    rs.lat = alat * RADDEG;
    rs.lng = alon * RADDEG;
  }

  return rs;
}
