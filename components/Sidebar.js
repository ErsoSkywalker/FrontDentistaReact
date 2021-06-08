import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();

  return (
    <>
      <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
        <div>
          <p className="text-white font-black text-5xl">Dentist Manager</p>
        </div>

        <nav className="mt-5 list-none">
          <li className={router.pathname === "/" ? "bg-blue-800 p-3" : "p-3"}>
            <Link href="/">
              <a className="text-white mb-2 block text-2xl">Citas</a>
            </Link>
          </li>

          <li
            className={
              router.pathname === "/pacientes" ? "bg-blue-800 p-3" : "p-3"
            }
          >
            <Link href="/pacientes">
              <a className="text-white mb-2 block text-2xl">Pacientes</a>
            </Link>
          </li>
        </nav>
      </aside>
    </>
  );
};
/*<li
            className={
              router.pathname === "/dentista" ? "bg-blue-800 p-3" : "p-3"
            }
          >
            <Link href="/dentista">
              <a className="text-white mb-2 block text-2xl">Dentista</a>
            </Link>
          </li>*/
export default Sidebar;
