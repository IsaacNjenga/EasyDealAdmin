import {
  AppstoreOutlined,
  EyeOutlined,
  LikeFilled,
  MailOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useFetchClients from "../hooks/fetchClients";
import useFetchAllEmails from "../hooks/fetchAllEmails";
import useFetchAnalytics from "../hooks/fetchAnalytics";
import useFetchActivity from "../hooks/fetchActivity";
import useFetchAllOrders from "../hooks/fetchAllOrders";
import useFetchProducts from "../hooks/fetchProducts";

function DashUtils() {
  const { clients, clientsLoading } = useFetchClients();
  const { allProducts, allProductsLoading } = useFetchProducts();
  const { emails, emailsLoading } = useFetchAllEmails();
  const { summary, topViewed, summaryLoading } = useFetchAnalytics();
  const { activities, activitiesLoading } = useFetchActivity();
  const { newOrders, ordersLoading } = useFetchAllOrders();

  const unreadMessages = emails?.filter((email) => email.read === false);

  const cleanedActivities = activities.map((activity) => ({
    type: activity.type,
    message: activity.title,
    time: activity.createdAt,
  }));

  const cleanedProductTypes = allProducts.reduce((acc, product) => {
    const existingType = acc.find((item) => item.type === product.category);
    if (existingType) {
      existingType.value += 1;
    } else {
      acc.push({ type: product.category, value: 1 });
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
        value: allProducts.length.toLocaleString(),
        icon: <AppstoreOutlined />,
        color: "#1890ff",
        loading: allProductsLoading,
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
        title: "Pending Orders",
        value: newOrders.length.toLocaleString(),
        icon: <TruckOutlined />,
        color: "#52c41a",
        loading: ordersLoading,
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
    productsLoading: allProductsLoading,
    emailsLoading: emailsLoading,
    summaryLoading: summaryLoading,
  };
}
export default DashUtils;
