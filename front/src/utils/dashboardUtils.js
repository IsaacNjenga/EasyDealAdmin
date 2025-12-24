import {
  AppstoreOutlined,
  EyeOutlined,
  LikeFilled,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useFetchClients from "../hooks/fetchClients";
import useFetchAllProducts from "../hooks/fetchAllProducts";
import useFetchAllEmails from "../hooks/fetchAllEmails";
import useFetchAnalytics from "../hooks/fetchAnalytics";
import useFetchActivity from "../hooks/fetchActivity";

function DashUtils() {
  const { clients, clientsLoading } = useFetchClients();
  const { products, productsLoading } = useFetchAllProducts();
  const { emails, emailsLoading } = useFetchAllEmails();
  const { summary, topViewed, summaryLoading } = useFetchAnalytics();
  const { activities, activitiesLoading } = useFetchActivity();

  const unreadMessages = emails?.filter((email) => email.read === false);

  const cleanedActivities = activities.map((activity) => ({
    type: activity.type,
    message: activity.title,
    time: activity.createdAt,
  }));

  const cleanedProductTypes = products.reduce((acc, product) => {
    const existingType = acc.find((item) => item.type === product.productType);
    if (existingType) {
      existingType.value += 1;
    } else {
      acc.push({ type: product.productType, value: 1 });
    }
    return acc;
  }, []);

  return {
    stats: [
      {
        title: "Total Users",
        value: clients.length.toLocaleString(),
        icon: <UserOutlined />,
        color: "#52c41a",
        loading: clientsLoading,
      },
      {
        title: "All Products",
        value: products.length.toLocaleString(),
        icon: <AppstoreOutlined />,
        color: "#1890ff",
        loading: productsLoading,
      },
      {
        title: "Total Views",
        value: summary?.totalViews?.toLocaleString(),
        icon: <EyeOutlined />,
        color: "#722ed1",
        trend: "down",
        loading: summaryLoading,
      },
      {
        title: "Total Likes",
        value: summary?.totalLikes?.toLocaleString(),
        icon: <LikeFilled style={{ color: "red" }} />,
        color: "#cf2626",
        trend: "down",
        loading: summaryLoading,
      },

      {
        title: "New Inquiries",
        value: unreadMessages.length.toLocaleString(),
        icon: <MailOutlined />,
        color: "#faad14",
        loading: emailsLoading,
      },
    ],
    topViewed: topViewed,
    recentActivities: cleanedActivities,
    activitiesLoading: activitiesLoading,
    productTypes: cleanedProductTypes,
    clientsLoading: clientsLoading,
    productsLoading: productsLoading,
    emailsLoading: emailsLoading,
    summaryLoading: summaryLoading,
  };
}
export default DashUtils;
