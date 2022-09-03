import { login } from "@/services/login/login";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { Alert, message, Tabs } from "antd";
import React, { useState } from "react";
import { FormattedMessage, history, SelectLang, useIntl, useModel } from "umi";
import styles from "./index.less";

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const { initialState, setInitialState } = useModel("@@initialState");

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const msg = await login(values.username, values.password);
      if (msg.code == 200) {
        localStorage.setItem("token", msg.data.token);
        localStorage.setItem("type", msg.data.admin.identity);
        localStorage.setItem("name", msg.data.admin.username);
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: "pages.login.success",
          defaultMessage: "登录成功！",
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        history.push("/");
      }
      // 如果失败去设置用户错误信息
      setUserLoginState({ currentAuthority: "guest", status: "error" });
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: "pages.login.failure",
        defaultMessage: "登录失败，请重试！",
      });
      message.error(defaultLoginFailureMessage);
    }
  };
  const { status } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="XXX xxxxx"
          subTitle={intl.formatMessage({
            id: "pages.layouts.userLayout.title2",
            defaultMessage: "08-21初版",
          })}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs activeKey={"account"}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: "pages.login.accountLogin.tab",
                defaultMessage: "账户密码登录",
              })}
            />
          </Tabs>

          {status === "error" && (
            <LoginMessage
              content={intl.formatMessage({
                id: "pages.login.accountLogin.errorMessage",
                defaultMessage: "账户或密码错误",
              })}
            />
          )}
          {
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: "large",
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: "pages.login.username.placeholder2",
                  defaultMessage: "用户名",
                  // : admin or user
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: "pages.login.password.placeholder2",
                  defaultMessage: "密码",
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          }
          <div
            style={{
              marginBottom: 24,
            }}
          ></div>
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
