"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineDashboard } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { CiShop } from "react-icons/ci";

const navItems = [
  { name: "Dashboard", icon: AiOutlineDashboard, href: "/admin/dashboard" },
  { name: "Menus", icon: BsPeople, href: "/admin/dashboard/menus" },
  { name: "Web-Editor", icon: CiShop, href: "/admin/web-editor" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div
      className="w-64 bg-white shadow-xl p-4 flex flex-col justify-between"
      style={{ minHeight: "100vh", }}
    >
      <div className="text-xl font-bold mb-6 outline-none">
        <Link href="/" className="outline-none">
          <Image src="/image/logo.png" alt="Logo" width={120} height={40} />
        </Link>
      </div>

      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <li key={item.name} className="mb-2">
                <Link
                  href={item.href}
                  className={`flex items-center p-1.5 rounded-lg text-sm border border-gray-200 transition-colors ${ active ? "bg-orange-500 text-white border-transparent font-semibold" : "text-black hover:border-orange-500 hover:text-orange-500" }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="mt-1">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
