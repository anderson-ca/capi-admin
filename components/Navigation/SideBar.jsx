import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DropdownMenu } from "radix-ui";

const SideBar = () => {
  return (
    <div className="border-r border-[#DCDCE2] h-full py-[1.1rem]">
      <ul className="flex flex-col gap-[1.5rem]">
        <li className="w-full px-[1.1rem] py-[0.5rem] hover:bg-[#efeeee]">
          <Link
            className="flex items-center gap-[1.1rem] no-underline"
            href="/dashboard"
          >
            <Image
              src="/side-nav/gauge.png"
              alt="sidebar-icon"
              width={18}
              height={18}
            />
            <p className="text-[#81819a] text-[1rem] font-[600]">Dashboard</p>
          </Link>
        </li>
        <li className="w-full px-[1.1rem] py-[0.5rem] hover:bg-[#efeeee]">
          <Link
            className="flex items-center gap-[1.1rem] no-underline"
            href="/reservations"
          >
            <Image
              src="/side-nav/calendar.png"
              alt="sidebar-icon"
              width={18}
              height={18}
            />
            <p className="text-[#81819a] text-[1rem] font-[600]">
              Reservations
            </p>
          </Link>
        </li>
        <li className="w-full px-[1.1rem] py-[0.5rem] hover:bg-[#efeeee]">
          <Link
            className="flex items-center gap-[1.1rem] no-underline"
            href="/costumers"
          >
            <Image
              src="/side-nav/customers.png"
              alt="sidebar-icon"
              width={18}
              height={18}
            />
            <p className="text-[#81819a] text-[1rem] font-[600]">Customers</p>
          </Link>
        </li>
        <li className="w-full px-[1.1rem] py-[0.5rem] hover:bg-[#efeeee] no-underline">
          <Link
            className="flex items-center gap-[1.1rem] no-underline"
            href="/"
          >
            <Image
              src="/side-nav/fork.png"
              alt="sidebar-icon"
              width={18}
              height={18}
            />
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <p className="text-[#81819a] text-[1rem] font-[600]">
                  Restaurant
                </p>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content>
                  <DropdownMenu.Item>
                    <p className="text-[#81819a] text-[0.8rem] font-[600] pt-[0.5rem]">
                      Menu Items
                    </p>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    <p className="text-[#81819a] text-[0.8rem] font-[600] pt-[0.5rem]">
                      Mealtimes
                    </p>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    <p className="text-[#81819a] text-[0.8rem] font-[600] pt-[0.5rem]">
                      Dinning Areas
                    </p>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </Link>
        </li>
        <li className="w-full px-[1.1rem] py-[0.5rem] hover:bg-[#efeeee] no-underline">
          {/* <DropdownMenu /> */}
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
