import { Footer } from "@/components/footer";
import { Header } from "@/components/nav";

const ManagersPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navbar */}
      <Header />
      <div className="flex-1 container px-2 py-6 mx-auto">Managers Page</div>
      <Footer className="bg-gray-100 dark:bg-gray-300 mt-16" />
    </div>
  );
};

export default ManagersPage;
