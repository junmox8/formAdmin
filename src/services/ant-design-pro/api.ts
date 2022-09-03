// @ts-ignore
/* eslint-disable */
import { request } from "umi";

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

/**
 * 当前用户的权限，如果为空代表没登录
 * current user access， if is '', user need login
 * 如果是 pro 的预览，默认是有权限的
 */
let access =
  ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === "site" ? "admin" : "";

const getAccess = () => {
  return access;
};
/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  if (!getAccess()) access = "admin";
  if (localStorage.getItem("type") == "1")
    return {
      success: true,
      data: {
        name: "超级管理员",
        access: "admin",
      },
    };
  else {
    return {
      success: true,
      data: {
        name: "普通管理员",
        access: "admin",
      },
    };
  }
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  access = "";
  localStorage.removeItem("token");
  return { data: {}, success: true };
}

/** 登录接口 POST /api/login/account */
export async function login(
  body: API.LoginParams,
  options?: { [key: string]: any }
) {
  return request<API.LoginResult>("/api/login/account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>("/api/notices", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any }
) {
  return request<API.RuleList>("/api/rule", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>("/api/rule", {
    method: "PUT",
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>("/api/rule", {
    method: "POST",
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>("/api/rule", {
    method: "DELETE",
    ...(options || {}),
  });
}
