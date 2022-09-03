import { request } from "umi";
export const getFeedback = (fileStreams) => {
  return request("/volunteer/back/feedback/getFeedbacks", {});
};
export const handUp = (text, id) => {
  return request(
    "/volunteer/back/feedback/checkFeedback?checkComment=" +
      text +
      "&feedbackId=" +
      id,
    {
      method: "POST",
    }
  );
};
export const getById = (id) => {
  return request("/volunteer/back/feedback/getFeedbackById?feedbackId=" + id);
};
