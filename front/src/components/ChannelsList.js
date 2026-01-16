import { ChannelList } from "stream-chat-react";
import { useAuth } from "../contexts/AuthContext";
import { Typography } from "antd";
import { useChat } from "../contexts/ChatContext";
import { useState } from "react";
import { useNotification } from "../contexts/NotificationContext";
import UsersQueryModal from "./UsersQueryModal";

// const { Search } = Input;
const { Title } = Typography;

function ChannelsList() {
  const { user } = useAuth();
  const { client, setActiveChannel } = useChat();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const openNotification = useNotification();

  const sort = { last_message_at: -1 };

  const filters = {
    type: "messaging",
    members: { $in: [user?._id] },
  };

  const options = { limit: 10 };

  const createDM = async (recipientId) => {
    if (!client) return;

    const channel = client.channel("messaging", {
      members: [user?._id, recipientId],
    });

    await channel.watch();

    setActiveChannel(channel);
  };

  return (
    <div>
      {/* Create channel */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10px 8px",
        }}
      >
        <Title style={{ margin: 0, color: "#fff" }} level={3}>
          Messages
        </Title>
        {/* <Tooltip title="Create channel">
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setOpen(true)}
          />
        </Tooltip> */}
      </div>

      <ChannelList filters={filters} sort={sort} options={options} />

      <UsersQueryModal
        open={open}
        setOpen={setOpen}
        username={username}
        setUsername={setUsername}
        createDM={createDM}
        openNotification={openNotification}
      />
    </div>
  );
}

export default ChannelsList;
