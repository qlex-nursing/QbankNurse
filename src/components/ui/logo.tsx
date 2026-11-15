import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="QbankNurse home"
      className="group inline-flex shrink-0 items-center gap-2.5"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E85D5D] text-white shadow-sm shadow-[#E85D5D]/20 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        <HeartPulse size={23} strokeWidth={2.2} />
      </span>

      <span className="text-[25px] font-extrabold tracking-[-1.2px] text-[#2D1B68]">
        QbankNurse<span className="text-[#5B3DF5]">.</span>
      </span>
    </Link>
  );
}