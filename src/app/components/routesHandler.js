"use client";
import { usePathname } from "next/navigation";

const RouteHandler = ({ header, footer, children }) => {
  const pathname = usePathname();

  const showHeader = !pathname.startsWith("/admin");
  const showFooter =
    pathname !== "/login" &&
    pathname !== "/register" &&
    !pathname.startsWith("/admin");

  return (
    <>
      {showHeader && header}
      <main>{children}</main>
      {showFooter && footer}
    </>
  );
};
export default RouteHandler;
