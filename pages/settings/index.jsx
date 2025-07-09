import React from "react";
import Link from "next/link";
import Image from "next/image";
import SettingCard from "../../components/SettingCard";
import adminSettings from "../../data/adminSettings";

const settings = () => {
  return (
    <div>
      <ul className="flex flex-row flex-wrap gap-[1rem] rounded-[10px] p-[1rem]">
        {adminSettings.map((setting) => (
          <SettingCard
            key={setting.slug}
            title={setting.title}
            description={setting.description}
            slug={setting.slug}
            configured={setting.configured}
          />
        ))}
      </ul>
    </div>
  );
};

export default settings;
