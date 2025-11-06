import {
  Avatar,
  Button,
  Input,
  Spin,
  Table,
  Dropdown,
  Tag,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
//import { emailData, replyData } from "../assets/data/data";
import { format } from "date-fns";
import ViewMessage from "../components/ViewMessage";
import ViewReply from "../components/ViewReply";
import {
  CarryOutFilled,
  CarryOutOutlined,
  ClockCircleFilled,
  ClockCircleOutlined,
  MessageFilled,
  MessageOutlined,
  StarFilled,
  StarOutlined,
  MoreOutlined,
  MailOutlined,
} from "@ant-design/icons";
import useFetchAllEmails from "../hooks/fetchAllEmails";
import useFetchAllReplies from "../hooks/fetchAllReplies";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "../assets/css/emails.css";
import { useNotification } from "../contexts/NotificationContext";

const { Title, Text } = Typography;
const { Search } = Input;

const miniBtns = [
  {
    key: 1,
    label: "Unread",
    color: "red",
    icon: ClockCircleFilled,
    icon2: ClockCircleOutlined,
  },
  {
    key: 2,
    label: "Read",
    color: "blue",
    icon: CarryOutFilled,
    icon2: CarryOutOutlined,
  },
  {
    key: 3,
    label: "Starred",
    color: "gold",
    icon: StarFilled,
    icon2: StarOutlined,
  },
  {
    key: 4,
    label: "Sent",
    color: "purple",
    icon: MessageFilled,
    icon2: MessageOutlined,
  },
];

function Emails() {
  const { token } = useAuth();
  const { emails, emailsLoading, emailsRefresh } = useFetchAllEmails();
  const { replies } = useFetchAllReplies();
  const openNotification = useNotification();
  const emailData = useMemo(() => (emails ? emails : []), [emails]);
  const replyData = useMemo(() => (replies ? replies : []), [replies]);
  const [openModal, setOpenModal] = useState(false);
  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(1);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [mail, setMail] = useState([]);

  const { readMessages, unreadMessages, starredMessages, repliedMessages } =
    useMemo(() => {
      return {
        readMessages: emailData?.filter((m) => m.read),
        unreadMessages: emailData?.filter((m) => !m.read),
        starredMessages: emailData?.filter((m) => m.starred),
        repliedMessages: replyData,
      };
    }, [emailData, replyData]);

  const viewMessage = async (record) => {
    setLoading(true);
    await updateEmail(record._id, { read: true });
    setContent(record);
    setOpenModal(true);
    setTimeout(() => {
      setLoading(false);
    }, 0);
    emailsRefresh();
  };

  const viewReply = async (message) => {
    console.log(message);
    setLoading(true);
    setContent(message);
    setOpenReplyModal(true);
    setTimeout(() => {
      setLoading(false);
    }, 0);
    //repliesRefresh();
  };

  const updateEmail = async (id, updateData) => {
    try {
      const res = await axios.put(`mail-update?id=${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        //console.log("success");
      }
    } catch (error) {
      console.error("Failed to update mail", error);
      openNotification(
        "error",
        "Failed to update order. Try again",
        "There was an error"
      );
    }
  };

  const handleMenuClick = async (e, record) => {
    const { key } = e;
    setActiveDropdownId(null); // close after click

    if (key === "toggle-read") {
      await updateEmail(record._id, { read: !record.read });
    } else if (key === "toggle-star") {
      await updateEmail(record._id, { starred: !record.starred });
    }

    emailsRefresh(); // refresh the list
  };

  const baseColumns = [
    {
      title: "",
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar style={{ background: "brown" }}>{text.charAt(0)}</Avatar>
          <Text style={{ fontFamily: "Raleway" }}>{text}</Text>
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "email_address",
      key: "email_address",
      render: (text) => (
        <Text style={{ fontFamily: "Raleway", color: "#1677ff" }}>{text}</Text>
      ),
    },
    {
      title: "",
      key: "message",
      render: (_, record) => {
        const subject = record.subject || "(No Subject)";
        const message = record.message || "";

        return (
          <div
            style={{
              fontFamily: "Raleway",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <span style={{ fontWeight: 600, color: "#202124", marginRight: 4 }}>
              {subject}
            </span>
            <span style={{ color: "#5f6368" }}> - {message}</span>
          </div>
        );
      },
      width: "50%",
    },

    {
      title: "",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (
        <Text style={{ fontFamily: "Roboto" }}>
          {format(new Date(text), "LLL d")}
        </Text>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },

    {
      title: "",
      key: "item-action",
      render: (record) => (
        <Dropdown
          menu={{
            items: [
              {
                label: record.read ? (
                  <span style={{ color: "red" }}>
                    <MailOutlined style={{ color: "red" }} /> Mark as Unread
                  </span>
                ) : (
                  <span style={{ color: "green" }}>
                    <CarryOutOutlined style={{ color: "green" }} /> Mark as Read
                  </span>
                ),
                key: "toggle-read",
              },
              {
                label: record.starred ? (
                  <span style={{ color: "gold", fontWeight: 500 }}>
                    <StarOutlined style={{ color: "gold", fontWeight: 500 }} />{" "}
                    Unstar
                  </span>
                ) : (
                  <span style={{ color: "gold", fontWeight: 500 }}>
                    <StarFilled style={{ color: "gold" }} /> Star this mail
                  </span>
                ),
                key: "toggle-star",
              },
            ],
            onClick: (e) => handleMenuClick(e, record),
          }}
          trigger={["click"]}
          open={activeDropdownId === record._id}
          onOpenChange={(nextOpen) =>
            setActiveDropdownId(nextOpen ? record._id : null)
          }
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  const replyColumns = [
    {
      title: "",
      key: "sender",
      render: (record) => {
        const msg = record.original_message;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar style={{ background: "brown" }}>
              {msg.full_name.charAt(0)}
            </Avatar>
            <Text style={{ fontFamily: "Raleway" }}>{msg.full_name}</Text>
          </div>
        );
      },
    },
    {
      title: "",
      key: "email",
      render: (record) => (
        <Text style={{ fontFamily: "Raleway", color: "#1677ff" }}>
          {record.original_message.email_address}
        </Text>
      ),
    },
    {
      title: "",
      key: "message",
      render: (_, record) => {
        const subject = record.original_message.subject || "(No Subject)";
        const message = record.original_message.message || "";

        return (
          <div
            style={{
              fontFamily: "Raleway",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <span style={{ fontWeight: 600, color: "#202124", marginRight: 4 }}>
              {subject}
            </span>
            <span style={{ color: "#5f6368" }}> - {message}</span>
          </div>
        );
      },
      width: "50%",
    },
    {
      title: "",
      key: "createdAt",
      render: (record) => (
        <Text style={{ fontFamily: "Roboto" }}>
          {format(new Date(record.createdAt), "LLL d")}
        </Text>
      ),
    },
  ];

  useEffect(() => {
    emailsRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  const getFilteredData = () => {
    switch (selectedTab) {
      case 1:
        return unreadMessages;
      case 2:
        return readMessages;
      case 3:
        return starredMessages;
      case 4:
        return repliedMessages;
      default:
        return emailData;
    }
  };

  const getFilteredLength = (tabKey) => {
    switch (tabKey) {
      case 1:
        return unreadMessages;
      case 2:
        return readMessages;
      case 3:
        return starredMessages;
      case 4:
        return repliedMessages;
      default:
        return emailData;
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase().trim();
    setSearchValue(value);
    if (!value) {
      setMail([]);
      return;
    }

    const source = selectedTab === 4 ? repliedMessages : emailData;

    const filteredSearchData = source.filter((item) => {
      const values =
        selectedTab === 4
          ? Object.values(item.original_message)
          : Object.values(item);
      return values.some(
        (val) => typeof val === "string" && val.toLowerCase().includes(value)
      );
    });

    setMail(filteredSearchData);
  };

  if (loading)
    return <Spin fullscreen tip="Loading. Please wait..." size="large" />;

  return (
    <>
      <div style={{ margin: 5, padding: 5 }}>
        <div style={{ margin: "10px 0" }}>
          <Search
            placeholder="Search..."
            size="large"
            loading={loading}
            enterButton
            onChange={handleSearch}
            style={{ width: "100%", height: 50 }}
          />
        </div>
        <div
          style={{
            display: "flex",
            margin: "10px 0",
            marginTop: 0,
            gap: 8,
            alignItems: "center",
          }}
        >
          {miniBtns.map((btn) => (
            <Tag
              color={btn.color}
              key={btn.key}
              onClick={() => setSelectedTab(btn.key)}
              style={{
                fontSize: 14,
                padding: "10px 14px",
                cursor: "pointer",
                fontFamily: "DM Sans",
                background: selectedTab === btn.key ? btn.color : "",
                color: selectedTab === btn.key ? "white" : "",
                borderRadius: 20,
                transition: "all 0.2s ease-in-out",
              }}
            >
              {selectedTab === btn.key ? <btn.icon /> : <btn.icon2 />}
              <span>
                {btn.label} [{getFilteredLength(btn.key)?.length || 0}]
              </span>
            </Tag>
          ))}
        </div>

        <div>
          {searchValue && (
            <div style={{ marginBottom: 20, marginTop: 0 }}>
              <Title level={5} style={{ fontFamily: "Roboto" }}>
                Results for "{searchValue}"
              </Title>
            </div>
          )}
        </div>
        <Table
          dataSource={searchValue ? mail : getFilteredData()}
          columns={selectedTab === 4 ? replyColumns : baseColumns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          size="small"
          loading={emailsLoading}
          style={{ fontFamily: "Raleway" }}
          onRow={(record) => ({
            onClick: () => {
              if (selectedTab === 4) {
                // For replies
                viewReply(record);
              } else {
                viewMessage(record);
              }
            },
          })}
        />
      </div>
      <ViewMessage
        setOpenModal={setOpenModal}
        openModal={openModal}
        loading={loading}
        content={content}
      />
      <ViewReply
        setOpenModal={setOpenReplyModal}
        openModal={openReplyModal}
        loading={loading}
        content={content}
      />
    </>
  );
}

export default Emails;
