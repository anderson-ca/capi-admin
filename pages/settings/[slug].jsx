import { useRouter } from "next/router";
import adminSettings from "../../data/adminSettings";
import RestaurantInfo from "../../components/Settings/RestaurantInfo";
import LocationAndLocale from "../../components/Settings/Location&Locale";
import SystemSettings from "../../components/Settings/SystemSettings";
import ReservationSettings from "../../components/Settings/ReservationSettings";

const SettingPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  // You can use `slug` to lookup your config or render specific components
  const setting = adminSettings.find((s) => s.slug === slug);

  if (!setting) return <p>Setting not found</p>;

  return (
    <div>
      {setting.slug === "restaurant" && <RestaurantInfo />}
      {setting.slug === "locale" && <LocationAndLocale />}
      {setting.slug === "system" && <SystemSettings />}
      {setting.slug === "reservation" && <ReservationSettings />}
    </div>
  );
};

export default SettingPage;
