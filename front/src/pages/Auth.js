import { useState } from "react";
import { Button, Card, Divider, Form, Input, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

const { Title, Text } = Typography;

const cardStyle = {
  maxHeight: "95vh",
  height: "100%",
  borderRadius: 0,
  background: "linear-gradient(to left, rgba(0,0,0,0.26), rgba(0,0,0,0.2))",
  border: "none",
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

      const { success, token, user, refreshToken } = res.data;

      if (success) {
        openNotification(
          "success",
          !isSignIn
            ? "Your account has been created successfully. Proceed to login."
            : "Login successful",
          "Success!"
        );

        if (!isSignIn) {
          setIsSignIn(true);
          return;
        }

        login(user, token, refreshToken);
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.message
          ? error.response.data.message
          : "An unexpected error occurred. Please try again later.";

      openNotification("warning", errorMessage, "Error");
    } finally {
      setLoading(false);
      form.resetFields();
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: `url(${"https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=900"}) no-repeat center center/cover`,
      }}
    >
      <div
        style={{
          position: "absolute",
          padding: 28,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          margin: "10px 0",
          border: "none",
        }}
      >
        <Card
          style={{
            margin: 0,
            border: "none",
            background: "transparent",
            borderRadius: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              padding: 0,
              margin: 0,
              border: "none",
              background: "transparent",
            borderRadius: 20,
            }}
          >
            <div
              style={{
                background: `url(${"https://images.unsplash.com/photo-1633975846872-2bed7fd995f9?w=900"}) no-repeat center center/cover`,
                width: 400,
                height: 500,
                border: "none",
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
              }}
            ></div>
            <div
              style={{
                background:
                  "linear-gradient(to right, #011b22 0%, #18839b 100%)",
                width: 500,
                height: 500,
                border: "none",
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
              }}
            >
              <Card style={{ ...cardStyle, width: "auto" }}>
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
                          onChange={(e) =>
                            handleChange("username", e.target.value)
                          }
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
                              if (
                                !value ||
                                getFieldValue("password") === value
                              ) {
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
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Auth;
