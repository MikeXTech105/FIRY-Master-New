import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function DashboardLayout({ children }: any) {
  return (
    <div className="flex h-screen">

      <Sidebar />

      <div className="flex flex-col flex-1">

        <Header />

        <main className="p-6 bg-gray-100 flex-1">
          {children}
        </main>

      </div>

    </div>
  );
}