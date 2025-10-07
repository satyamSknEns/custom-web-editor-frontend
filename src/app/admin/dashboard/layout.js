import Sidebar from "./components/sideBar";
import DashboardHeader from "./components/welcomeHeader";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-hidden h-full p-3">
      <DashboardHeader />
        <div className={`relative overflow-y-scroll h-[90%] py-5 px-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-orange-100 [&::-webkit-scrollbar-thumb]:bg-orange-200`}>{children}</div>
      </main>
    </div>
  );
}
