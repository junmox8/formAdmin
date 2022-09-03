import { request } from "umi";
export const postQuestionNaire = (questionnaire) => {
  return request("/volunteer/back/questionnaire", {
    method: "POST",
    data: {
      title: questionnaire.title,
      content: questionnaire.content,
      startTime: questionnaire.startTime,
      endTime: questionnaire.endTime,
      introduction: questionnaire.introduction,
    },
  });
};
export const getQuestionNaire = () => {
  return request("/volunteer/back/questionnaire");
};
export const deleteQuestionNaire = (id) => {
  return request("/volunteer/back/questionnaire?id=" + id, {
    method: "DELETE",
  });
};
export const getTheNaireAnswer = (id) => {
  return request(
    "/volunteer/back/answer/questionnaire/id?questionnaireId=" + id
  );
};
export const getNaireDetail = (id) => {
  return request("/volunteer/back/answer/answer/id?answerId=" + id);
};
export const getTheNaire = (id) => {
  return request("/volunteer/back/questionnaire/id?id=" + id);
};
