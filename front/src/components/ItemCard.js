import { Carousel, Button, Typography, Row, Col, Card, Tooltip } from "antd";
import { DeleteOutlined, EditFilled, EyeOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNotification } from "../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const { Title, Text } = Typography;

function ItemCard({
  dataSource,
  isMobile,
  viewItem,
  setLoading,
  productsRefresh,
}) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const openNotification = useNotification();

  return (
    <div style={{ margin: 10, padding: 15 }}>
      <Row gutter={[24, 24]}>
        {dataSource.map((b) => (
          <Col key={b._id} xs={24} sm={12} md={6}>
            <motion.div
              whileHover="hover"
              initial="rest"
              animate="rest"
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.02 },
              }}
              style={{ borderRadius: 0, overflow: "hidden" }}
            >
              <Card
                style={{
                  borderRadius: 0,
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  border: "1px solid #ffffff7e00",
                }}
                cover={
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: 320, // Consistent image height
                      overflow: "hidden",
                      borderRadius: 0,
                    }}
                    className="card-image-container"
                  >
                    {/* Carousel */}
                    <Carousel autoplay autoplaySpeed={4000} dots={false}>
                      {(Array.isArray(b.img) ? b.img : [b.img]).map(
                        (img, i) => (
                          <div key={i}>
                            <img
                              src={img}
                              alt={"img"}
                              style={{
                                width: "100%",
                                height: "320px",
                                objectFit: "cover",
                                display: "block",
                                borderRadius: 0,
                              }}
                            />
                          </div>
                        )
                      )}
                    </Carousel>

                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        height: "100%",
                        background: "rgba(0,0,0,0.02)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "15px",
                      }}
                    >
                      {b.discount > 0 && (
                        <Button
                          style={{
                            background: "#89cdbf",
                            color: "#fff",
                            border: "none",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                            fontFamily: "DM Sans",
                            borderRadius: 1,
                          }}
                        >
                          -{b.discount}%
                        </Button>
                      )}
                    </div>

                    {/* Slide-up Overlay */}
                    <motion.div
                      variants={{
                        rest: { y: "100%", opacity: 0 },
                        hover: { y: "0%", opacity: 1 },
                      }}
                      transition={{
                        duration: 0.45,
                        ease: [0.25, 0.8, 0.25, 1],
                      }}
                      className="overlay-buttons"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "100%",
                        background: "rgba(0,0,0,0.02)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "15px",
                      }}
                    >
                      {/* Top Right Buttons */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 10,
                        }}
                      >
                        <Tooltip title={"Delete"} placement="right">
                          <Button
                            shape="circle"
                            onClick={async () => {
                              setLoading(true);
                              try {
                                const res = await axios.delete(
                                  `delete-product?id=${b._id}`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );
                                if (res.data.success) {
                                  openNotification(
                                    "success",
                                    "An item has been deleted successfully",
                                    "Deleted!"
                                  );
                                  productsRefresh();
                                }
                              } catch (error) {
                                console.log(error);
                                openNotification(
                                  "error",
                                  "This item could not be deleted",
                                  "Failed!"
                                );
                              } finally {
                                setLoading(false);
                              }
                            }}
                            icon={<DeleteOutlined />}
                            style={{
                              background: "white",
                              color: "#333",
                              border: "none",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            }}
                          />
                        </Tooltip>{" "}
                        <Tooltip title="Edit" placement="right">
                          <Button
                            shape="circle"
                            icon={<EditFilled />}
                            onClick={() => navigate(`/update-product/${b._id}`)}
                            style={{
                              background: "white",
                              color: "#333",
                              border: "none",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="View" placement="right">
                          <Button
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => viewItem(b)}
                            style={{
                              background: "white",
                              color: "#333",
                              border: "none",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            }}
                          />
                        </Tooltip>
                      </div>

                      {/* Bottom Add to Cart Button */}
                      {/* <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <motion.div
                          variants={{
                            rest: { y: 20, opacity: 0 },
                            hover: { y: 0, opacity: 1 },
                          }}
                          transition={{
                            duration: 0.3,
                            ease: "easeOut",
                          }}
                        >
                          <Button
                            onClick={() => {
                              if (isInCart(b)) {
                                removeFromCart(b._id);
                              } else {
                                addToCart(b);
                                openNotification(
                                  "success",
                                  "An item has been added to your cart",
                                  "Success!"
                                );
                              }
                            }}
                            type="primary"
                            style={{
                              border: "1px solid black",
                              borderRadius: 6,
                              fontFamily: "DM Sans",
                              letterSpacing: 2,
                              padding: "20px 28px",
                              fontWeight: "bold",
                              background: "white",
                              color: "#333",
                            }}
                          >
                            {isInCart(b) ? "REMOVE FROM CART" : "ADD TO CART"}
                          </Button>
                        </motion.div>
                      </div> */}
                    </motion.div>
                  </div>
                }
              >
                <Card.Meta
                  title={
                    <Title
                      level={4}
                      style={{
                        marginTop: 10,
                        marginBottom: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontFamily: "DM Sans",
                      }}
                    >
                      {b.name}
                    </Title>
                  }
                  description={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 18,
                          fontFamily: "DM Sans",
                          color: "#444",
                        }}
                      >
                        KES.{" "}
                        {b.discount > 0 ? (
                          <>
                            <span style={{ textDecoration: "line-through" }}>
                              {b.price.toLocaleString()}
                            </span>{" "}
                            <span>
                              {(
                                ((100 - b.discount) * b.price) /
                                100
                              ).toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span>{b.price.toLocaleString()}</span>
                        )}
                      </Text>
                      {isMobile && (
                        <Button
                          onClick={() => viewItem(b)}
                          style={{
                            background: "white",
                            border: "1px solid #444",
                            fontSize: 18,
                            fontFamily: "DM Sans",
                            color: "#444",
                          }}
                        >
                          View
                        </Button>
                      )}
                    </div>
                  }
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ItemCard;
