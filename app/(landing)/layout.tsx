import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <Navbar />

      <div className="px-4 py-6 max-w-6xl 2xl:max-w-screen-2xl mx-auto ">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default LandingLayout;
