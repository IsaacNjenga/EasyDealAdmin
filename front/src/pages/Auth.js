import { useState } from "react";
import signInImg from "../assets/images/sign-in.png";
import signUpImg from "../assets/images/sign-up.png";
import { Button, Card, Divider, Form, Input, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

const { Title, Text } = Typography;

const containerStyle = {
  position: "relative",
  minHeight: "100vh",
  padding: 0,
  maxWidth: "100vw",
};
const imgStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  objectFit: "contain", //from contain
  background: "linear-gradient(to right, #d6a4df, #def7e4)",
};

const innerDivStyle = {
  position: "absolute",
  margin: "auto",
  display: "flex",
  width: "100%",
  borderRadius: 12,
  border: "0px solid #fff",
  maxWidth: "85vw",
  alignContent: "center",
  alignItems: "center",
  alignSelf: "center",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  boxShadow: "0 4px 3px 0 rgba(0, 0, 0, 0), 0 2px 7px 0 rgba(0, 0, 0, 0)",
};

const cardStyle = {
  maxHeight: "95vh",
  height: 600,
  padding: 8,
  borderRadius: 0,
  background: "linear-gradient(to left, rgba(0,0,0,0.26), rgba(0,0,0,0.2))",
  borderColor: "rgba(0,0,0,0)",
  borderTopLeftRadius: 12,
  borderBottomLeftRadius: 12,
  backdropFilter: "blur(1px)",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: 5,
  marginTop: 0,
  color: "#ffffff",
};

const labelStyle = {
  marginBottom: 0,
  fontSize: 14,
  fontWeight: 500,
  marginTop: 0,
  color: "#ffffff",
};

const inputStyle = {
  marginBottom: 0,
  borderRadius: 12,
  marginTop: 0,
};

const submitBtnStyle = { padding: 18, borderRadius: 18 };

const signInTextStyle = { cursor: "pointer" };

function Auth() {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const openNotification = useNotification();
  const [isSignIn, setIsSignIn] = useState(true);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const toggleSignIn = () => {
    setIsSignIn((prev) => !prev);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const allValues = await form.getFieldsValue();

      const payload = isSignIn
        ? { email: allValues.email, password: allValues.password }
        : { ...allValues };

      const res = await axios.post(
        `${isSignIn ? "sign-in" : "sign-up"}`,
        payload
      );

      const { success, token, user } = res.data;

      if (success) {
        openNotification(
          "success",
          !isSignIn
            ? "Your account has been created successfully"
            : "Login successful",
          "Success!"
        );

        if (!isSignIn) {
          setIsSignIn(true);
          return;
        }

        login(user, token);
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "An unexpected error occurred. Please try again later.";

      openNotification("warning", errorMessage, "Error");
    } finally {
      setLoading(false);
      form.resetFields();
    }
  };

  return (
    <div style={containerStyle}>
      <img src={isSignIn ? signInImg : signUpImg} alt="img" style={imgStyle} />
      <div style={{ ...innerDivStyle, flexDirection: "row" }}>
        <div style={{ width: "50%" }}>
          <Card style={{ ...cardStyle, width: 600 }}>
            <Divider style={{ borderColor: "#fff" }}>
              <Title level={1} style={{ ...titleStyle, fontSize: 50 }}>
                {isSignIn ? "Sign In" : "Sign Up"}
              </Title>
            </Divider>
            <div>
              <Form layout="vertical" form={form} onFinish={handleSubmit}>
                {!isSignIn && (
                  <Form.Item
                    label={<span style={labelStyle}>Username</span>}
                    name={"username"}
                  >
                    <Input
                      value={values.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      style={inputStyle}
                      type="text"
                    />
                  </Form.Item>
                )}
                <Form.Item
                  label={<span style={labelStyle}>Email Address</span>}
                  name={"email"}
                >
                  <Input
                    value={values.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    style={inputStyle}
                    type="email"
                  />
                </Form.Item>
                <Form.Item
                  label={<span style={labelStyle}>Password</span>}
                  name={"password"}
                >
                  <Input.Password
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    value={values.password}
                    onChange={(e) => handleChange("email", e.target.value)}
                    style={inputStyle}
                    allowClear
                  />
                </Form.Item>
                {!isSignIn && (
                  <Form.Item
                    dependencies={["password"]}
                    hasFeedback
                    label={
                      <span style={labelStyle}>Confirm Your Password</span>
                    }
                    name={"confirmPassword"}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Passwords do not match")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      style={inputStyle}
                    />
                  </Form.Item>
                )}

                {isSignIn && (
                  <div style={{ marginTop: 0, marginBottom: 10 }}>
                    <Text style={{ color: "#fff", cursor: "pointer" }}>
                      Forgot your password?
                    </Text>
                  </div>
                )}

                <Form.Item>
                  <Button
                    block
                    loading={loading}
                    type="primary"
                    style={submitBtnStyle}
                    htmlType="submit"
                    disabled={!values.email}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    {loading
                      ? isSignIn
                        ? "Signing in..."
                        : "Signing up..."
                      : isSignIn
                      ? "Sign in"
                      : "Sign up"}
                  </Button>
                </Form.Item>

                <div
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    fontWeight: 500,
                  }}
                >
                  {isSignIn ? (
                    <Text
                      style={{
                        color: "#ffffff",
                      }}
                    >
                      Don't have an account?{" "}
                      <span onClick={toggleSignIn} style={signInTextStyle}>
                        Sign Up
                      </span>
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: "#ffffff",
                      }}
                    >
                      Already have an account?{" "}
                      <span onClick={toggleSignIn} style={signInTextStyle}>
                        Sign In
                      </span>
                    </Text>
                  )}
                </div>
              </Form>
            </div>
          </Card>
        </div>
        <div style={{ width: "50%", display: "none" }}></div>
      </div>
    </div>
  );
}

export default Auth;
