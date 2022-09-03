import { request } from "umi";
export const add = (
  contact,
  currentTime,
  endTime,
  instruction,
  location,
  manager,
  startTime,
  title,
  img
) => {
  return request(
    `/volunteer/back/recruit/addRecruit?contact=${contact}&displayTime=${currentTime}&endTime=${endTime}&instruction=${instruction}&location=${location}&manager=${manager}&startTime=${startTime}&title=${title}&coverImg=${img}`,
    {
      method: "POST",
    }
  );
};
export const get = () => {
  return request("/volunteer/back/recruit/getRecruits");
};
export const del = (id) => {
  return request("/volunteer/back/recruit/removeRecruit?recruitId=" + id, {
    method: "POST",
  });
};
