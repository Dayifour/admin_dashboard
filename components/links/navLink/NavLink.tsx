"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({
  item,
}: {
  item: { image: string; path: string; title: string };
}) => {
  const pathName = usePathname();

  return (
    <Link
      className={`min-w-[100px] text-white text-lg border-none outline-none font-semibold gap-2 p-2 flex justify-center items-center ${
        pathName === item.path && "text-blue-800"
      }`}
      href={item.path}
    >
      <Image src={item.image} width={30} height={30} alt={item.title} />
      {item.title}
    </Link>
  );
};

export default NavLink;
