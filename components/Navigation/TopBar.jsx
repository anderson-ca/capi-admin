import Image from "next/image";
import Link from "next/link";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between bg-white px-6 border-b-2 border-[#DCDCE2] w-full z-10">
      <Tooltip id="top-nav-tooltip" />
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        {/* future: date range picker, notifications, user avatar… */}
        <ul className="flex flex-row gap-[1.5rem] items-center">
          <li
            className="p-[0.5rem] hover:bg-[#efeeee]"
            data-tooltip-id="top-nav-tooltip"
            data-tooltip-content="Storefront"
          >
            <Image src="/top-nav/cart.png" height={18} width={18} alt="" />
          </li>
          <li
            className="p-[0.5rem] hover:bg-[#efeeee]"
            data-tooltip-id="top-nav-tooltip"
            data-tooltip-content="Help"
          >
            <Image src="/top-nav/question.png" height={18} width={18} alt="" />
          </li>
          <li
            className="p-[0.5rem] hover:bg-[#efeeee]"
            data-tooltip-id="top-nav-tooltip"
            data-tooltip-content="Notifications"
          >
            <Image src="/top-nav/bell.png" height={18} width={18} alt="" />
          </li>
          <li
            className="p-[0.5rem] hover:bg-[#efeeee]"
            data-tooltip-id="top-nav-tooltip"
            data-tooltip-content="Settings"
          >
            <Link href="/settings">
              <Image src="/top-nav/gear.svg" height={18} width={18} alt="" />
            </Link>
          </li>
          <li className="px-[1.1rem]">
            <Image src="/top-nav/user.png" height={25} width={25} alt="" />
          </li>
        </ul>
      </div>
    </header>
  );
}
