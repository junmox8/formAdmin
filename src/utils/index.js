import COS from "cos-js-sdk-v5";
import { getSecretKey } from "@/services/img/index";
import { message } from "antd";
export const uploadFile = async (file, fileName) => {
  const result = await getSecretKey();
  const data = result.data;
  const { expiredTime, key, startTime, id, token } = data;
  const cos = new COS({
    getAuthorization: (options, callback) => {
      const obj = {
        TmpSecretId: id,
        TmpSecretKey: key,
        XCosSecurityToken: token,
        ExpiredTime: expiredTime,
      };
      callback(obj);
    },
  });
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: "slide-1257191112",
        Region: "ap-nanjing",
        Key: "/slide" + fileName,
        StorageClass: "STANDARD",
        Body: file,
        onProgress: (progressData) => {
          console.log(JSON.stringify(progressData));
        },
      },
      (err, data) => {
        if (err) {
          message.error("上传图片失败");
          reject(err);
        } else {
          message.success("上传文件成功");
          const url = cos.getObjectUrl({
            Bucket: "slide-1257191112",
            Region: "ap-nanjing",
            Key: "/slide" + fileName,
          });
          resolve(url);
        }
      }
    );
  });
};
