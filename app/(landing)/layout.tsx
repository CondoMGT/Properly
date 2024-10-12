import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <>
        <Navbar />

        {children}
        <Footer />
      </>
    </div>
  );
};

export default LandingLayout;
