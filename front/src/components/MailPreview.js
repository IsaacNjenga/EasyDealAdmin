import { Button, Layout, Divider, Typography, Row, Col } from "antd";
import logo from "../assets/icons/office-chair.png";

const { Title, Text } = Typography;
const { Header, Footer } = Layout;

const headerStyle = {
  zIndex: 1000,
  width: "100%",
  padding: "10px 10px",
  display: "flex",
  alignItems: "center",
  transition: "all 0.4s ease",
  transform: "translateY(0)",
  background: "rgba(0, 0, 0, 1)",
  backdropFilter: "blur(0px)",
  boxShadow: "0 0 0 rgba(0,0,0,0)",
  height: "auto",
};

const RenderHeader = () => (
  <Header style={headerStyle}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
              transition: "all 0.3s ease",
              cursor: "pointer",
              marginTop: 5,
              marginBottom: 0,
              marginRight: 5,
              boxShadow: "0 4px 16px rgba(254, 165, 73, 0.4)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <Title
            level={3}
            style={{
              width: "50%",
              transition: "all 0.3s ease",
              fontFamily: "Bebas Neue",
              letterSpacing: 2.4,
              color: "#fff",
            }}
          >
            EasyDeal Furnitures
          </Title>
        </span>
      </div>
      <div>
        <Button
          type="primary"
          style={{
            background: "#ffa34a",
            boxShadow: "0 4px 16px rgba(254, 165, 73, 0.4)",
          }}
        >
          <a
            href="https://easy-deal-furnitures.vercel.app/shop"
            target="_blank"
            rel="noopener noreferrer"
          >
            Shop Now
          </a>
        </Button>
      </div>
    </div>
  </Header>
);

const RenderFooter = () => (
  <Footer style={{ margin: 0, padding: 0 }}>
    <div style={{ background: "#000000", padding: "10px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginBottom: 40,
          gap: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignContent: "center",
            alignItems: "center",
            padding: 0,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
                transition: "all 0.3s ease",
                cursor: "pointer",
                marginTop: 5,
                marginBottom: 0,
                marginRight: 5,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "rotate(360deg) scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "rotate(0deg) scale(1)")
              }
            />
            <Title
              level={4}
              style={{
                width: "50%",
                transition: "all 0.3s ease",
                fontFamily: "Bebas Neue",
                letterSpacing: 2.4,
                color: "#fff",
              }}
            >
              EasyDeal Furnitures
            </Title>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Title
            level={4}
            style={{
              letterSpacing: 2.5,
              color: "#fea549",
              marginBottom: 0,
              fontFamily: "Bebas Neue",
            }}
          >
            VISIT OUR SHOWROOM
          </Title>
          <Text
            style={{
              letterSpacing: 1.5,
              color: "#fff",
              marginTop: 0,
              marginBottom: 0,
              fontFamily: "DM Sans",
            }}
          >
            Ngara Rd., Nairobi, Kenya
          </Text>
          <Text
            style={{
              letterSpacing: 1.5,
              color: "#fff",
              marginBottom: 0,
              marginTop: 0,
              fontFamily: "DM Sans",
            }}
          >
            Mon - Sat: 8:00am - 6:00pm
          </Text>
        </div>
      </div>

      <Divider style={{ borderColor: "#444" }} />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
          padding: 10,
        }}
      >
        <div style={{ padding: 20 }}>
          <div>
            <Text
              style={{
                fontFamily: "DM Sans",
                marginBottom: 10,
                letterSpacing: 1,
                color: "#fff",
              }}
            >
              Reach out to us in case of any issue, assistance or questions:
            </Text>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "5px auto",
                fontFamily: "DM Sans",
              }}
            >
              <li>
                <Text style={{ color: "#fff", fontFamily: "DM Sans" }}>
                  +254 722 528-672
                </Text>
              </li>
              <li>
                <Text style={{ color: "#fff", fontFamily: "DM Sans" }}>
                  +254 720 731-982
                </Text>
              </li>
              <li>
                <Text style={{ color: "#fff", fontFamily: "DM Sans" }}>
                  +254 714 738-997
                </Text>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Footer>
);
function MailPreview({ htmlContent, heading, subheading, ctaText }) {
  const data = [
    {
      key: 1,
      img: "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg",
      name: "Ergonomic Office Chair",
      price: 10000,
    },
    {
      key: 2,
      img: "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg",
      name: "Ergonomic Office Chair",
      price: 10000,
    },
    {
      key: 3,
      img: "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg",
      name: "Ergonomic Office Chair",
      price: 10000,
    },
    {
      key: 4,
      img: "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg",
      name: "Ergonomic Office Chair",
      price: 10000,
    },
  ];
  return (
    <div>
      <Title level={4} style={{ textAlign: "center" }}>
        Newsletter Preview
      </Title>
      <RenderHeader />
      <div
        style={{
          padding: 20,
          background: "linear-gradient(135deg, #fea549, #ffcc80)",
        }}
      >
        <div>
          <Title level={3} style={{ textAlign: "center" }}>
            {heading}
          </Title>
        </div>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Text>{subheading}</Text>
        </div>
        <Row gutter={[24, 24]}>
          {data.map((d) => (
            <Col sm={12} md={12} key={d.key}>
              <div
                style={{
                  background: "#FFF",
                  transition: "all 0.3s ease-in-out",
                  borderRadius: 20,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform =
                    "translateY(-1px) scale(1.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scaleX(1)")
                }
              >
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    height: "200px",
                    background:
                      "linear-gradient(135deg, #f8f9fa, #e9ecef); position: relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={d.img}
                    alt="img"
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "all 0.3s ease",
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </div>
                <div
                  style={{
                    padding: "24px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "12px",
                    textAlign: "center",
                  }}
                >
                  <Title
                    level={3}
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      margin: 0,
                      color: "#1e293b",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "center",
                    }}
                  >
                    {d.name}
                  </Title>
                  <Text
                    type="secondary"
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                      background: "linear-gradient(135deg, #0ea5a4, #0c8988)",
                      webkitBackgroundClip: "text",
                      webkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      margin: 0,
                    }}
                  >
                    KES. {d.price.toLocaleString()}
                  </Text>
                  <Button
                    style={{
                      background: "linear-gradient(135deg, #0ea5a4, #0c8988)",
                      boxShadow: "0 4px 15px rgba(14, 165, 164, 0.3)",
                      borderRadius: "12px",
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      margin: 0,
                      textAlign: "center",
                      borderColor: "transparent",
                    }}
                  >
                    <a
                      href="https://easy-deal-furnitures.vercel.app/shop"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "10px 14px",
                        color: "#fff",
                        textDecoration: "none",
                      }}
                    >
                      View Product
                    </a>
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <div style={{ textAlign: "center", margin: 20 }}>
          <Button>{ctaText}</Button>
        </div>
      </div>
      <RenderFooter />
    </div>
  );
}

export default MailPreview;
