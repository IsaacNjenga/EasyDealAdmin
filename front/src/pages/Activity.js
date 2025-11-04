import React from "react";
import useFetchActivity from "../hooks/fetchActivity";
import { Button, Table, Typography } from "antd";
import { format, formatDistanceToNowStrict } from "date-fns";

const { Text } = Typography;

function Activity() {
  const { activities, activitiesLoading, activitiesRefresh } =
    useFetchActivity();

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => (
        <Text style={{ fontFamily: "DM Sans", textAlign: "center" }}>
          {text?.charAt(0).toUpperCase() + text?.slice(1)}
        </Text>
      ),
    },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => {
        if (!text) return "-";
        const parsedDate = new Date(text);
        if (isNaN(parsedDate)) return "-";
        return (
          <div>
            <Text style={{ fontFamily: "DM Sans" }}>
              {`${formatDistanceToNowStrict(parsedDate)} ago`}
            </Text>
            <br />
            <Text type="secondary" style={{ fontFamily: "DM Sans" }}>
              {format(parsedDate, "dd/MM/yyyy")}
            </Text>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Button onClick={activitiesRefresh}>Refresh</Button>
      <Table
        columns={columns}
        dataSource={activities}
        loading={activitiesLoading}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
        size="medium"
        style={{ fontFamily: "DM Sans" }}
      />
    </div>
  );
}

export default Activity;
