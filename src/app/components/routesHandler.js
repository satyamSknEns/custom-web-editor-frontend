"use client";
import { usePathname } from "next/navigation";

const RouteHandler = ({ header, footer, children }) => {
  const pathname = usePathname();

  const showHeader =
    pathname !== "/pages/web-editor" && pathname !== "/pages/page-preview";
  const showFooter =
    pathname !== "/login" &&
    pathname !== "/register" &&
    pathname !== "/pages/web-editor" &&
    pathname !== "/pages/page-preview";

  return (
    <>
      {showHeader && header}
      <main>{children}</main>
      {showFooter && footer}
    </>
  );
};
export default RouteHandler;
