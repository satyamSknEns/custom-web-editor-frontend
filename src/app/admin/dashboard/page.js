import StatCard from "./components/cards/statCard";
import DonutChartCard from "./components/cards/donutChartCard";
import LineChartCard from "./components/cards/lineChartCard";
import PerformanceCard from "./components/cards/performanceCard";
import WelcomeHeader from "./components/welcomeHeader";

export default function DashboardPage() {
  return (
    <>
      <WelcomeHeader />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <PerformanceCard />
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-12 gap-4 mb-6">
            <div className="col-span-6 md:col-span-4">
              <StatCard
                label="ORDERS"
                value={34}
                color="bg-gradient-to-br from-red-400 to-red-200"
                textColor="text-red-600"
              />
            </div>
            <div className="col-span-6 md:col-span-4">
              <StatCard
                label="USERS"
                value={110}
                color="bg-gradient-to-br from-purple-400 to-purple-200"
                textColor="text-purple-600"
              />
            </div>
            <div className="col-span-6 md:col-span-4">
              <StatCard
                label="STORES"
                value={2547}
                color="bg-gradient-to-br from-orange-400 to-orange-200"
                textColor="text-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <StatCard
                label="PRODUCTS"
                value={226764}
                color="bg-gradient-to-br from-yellow-400 to-yellow-200"
                textColor="text-yellow-500"
              />
            </div>
            <div className="col-span-6">
              <StatCard
                label="SALES"
                value={0}
                color="bg-gradient-to-br from-sky-400 to-sky-200"
                textColor="text-sky-600"
              />
            </div>
          </div>
        </div>

        <div className="col-span-12 grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-12 lg:col-span-4">
            <DonutChartCard />
          </div>

          <div className="col-span-12 lg:col-span-8">
            <LineChartCard />
          </div>
        </div>
      </div>
    </>
  );
}
