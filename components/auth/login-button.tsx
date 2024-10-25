"use client";

import { useRouter } from "next/navigation";

const LoginButton = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const logout = () => {
    router.push("/auth/login");
  };

  return (
    <span className="w-full cursor-pointer" onClick={logout}>
      {children}
    </span>
  );
};

export default LoginButton;
