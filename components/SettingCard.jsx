import React from "react";
import Link from "next/link";

const SettingCard = ({ title, description, slug, configured }) => {
  return (
    <Link href={`/settings/${slug}`} className="bg-white border-2 border-[#DCDCE2] hover:border-[#FE4901] active:bg-[#f5f5f5] active:border-[2px] rounded-[10px] transition-all duration-15 flex flex-col justify-center items-start gap-[0.5rem] max-w-[20rem] w-[20rem] py-[10px] px-[15px]">
      <h1 className="text-[17px] font-[500]">{title}</h1>
      <p className="text-[14px] font-[400] text-[#2E2E3ABF] text-start">
        {description}
      </p>
    </Link>
  );
};

export default SettingCard;
