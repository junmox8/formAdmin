import { request } from "umi";
export const postArticle = (time, img, url, title) => {
  return request(
    "/volunteer/back/news/addNews?adTime=" +
      time +
      "&imageUrl=" +
      img +
      "&newsUrl=" +
      url +
      "&title=" +
      title,
    {
      method: "POST",
    }
  );
};
export const getArticle = () => {
  return request("/volunteer/back/news/getNews");
};
export const deleteArticle = (id) => {
  return request("/volunteer/back/news/removeNews?newsId=" + id, {
    method: "POST",
  });
};
