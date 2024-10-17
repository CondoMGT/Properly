import Image from "next/image";
import Link from "next/link";
import React from "react";

export const ProperlyLogo = () => {
  return (
    <div className="flex justify-center items-center">
      <Link
        href="/"
        className="text-custom-1 text-2xl font-bold font-kyiv flex items-center"
      >
        <Image
          src="/logo.svg"
          alt="Properly"
          width={28}
          height={28}
          className="w-7 h-7"
        />
        Properly
      </Link>
    </div>
  );
};
