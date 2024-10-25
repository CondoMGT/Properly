import Footer from "@/components/navs/landing/footer";
import Navbar from "@/components/navs/landing/navbar";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex flex-col pt-6">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default LandingLayout;
