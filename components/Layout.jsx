import Sidebar from "./Navigation/SideBar";
import Topbar from "./Navigation/TopBar";

export default function Layout({ children }) {
  return (
    <div className="h-screen flex flex-col">
      {/* Topbar should be full-width and sit above the sidebar + content */}
      <Topbar />

      {/* Below Topbar: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (fixed width) */}
        <div className="w-[220px] border-r bg-white">
          <Sidebar />
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-[#f9f9fb] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
