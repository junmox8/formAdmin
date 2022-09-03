import { request } from "umi";
export const upLoadSlide = (fileStreams) => {
  return request("/volunteer/back/slide/upLoadSlideStream", {
    method: "POST",
    data: {
      fileStreams,
    },
  });
};
export const getSlide = () => {
  return request("/volunteer/back/slide/getSlides", {});
};
export const getSecretKey = () => {
  return request(
    "/volunteer/back/cos/getCosTemporaryKey?bucket=slide-1257191112&region=ap-nanjing"
  );
};
export const handUpImg = (str) => {
  return request("/volunteer/back/slide/addSlide?slideUrl=" + str, {
    method: "POST",
  });
};
export const getImg = () => {
  return request("/volunteer/back/slide/getSlides");
};
