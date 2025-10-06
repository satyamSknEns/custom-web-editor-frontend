"use client";
import { usePathname } from "next/navigation";

const RouteHandler = ({ header, footer, children }) => {
  const pathname = usePathname();

  const showHeader = pathname !== "/pages/web-editor";
  const showFooter =
    pathname !== "/login" &&
    pathname !== "/register" &&
    pathname !== "/pages/web-editor";

  return (
    <>
      {showHeader && header}
      <main>{children}</main>
      {showFooter && footer}
    </>
  );
};
export default RouteHandler;
