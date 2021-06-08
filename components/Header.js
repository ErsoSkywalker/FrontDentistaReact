import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const TRAER_NOMBRE = gql`
  {
    getUser {
      nombre
      apellido
    }
  }
`;

const Header = () => {
  const { data, loading, error } = useQuery(TRAER_NOMBRE);
  const router = useRouter();
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  console.log(data);
  if (loading) return null;

  if (!data) {
    return router.push("/login");
  }

  return (
    <div className="flex justify-between mb-6">
      <h1 className="mr-2">
        Hola {data.getUser.nombre + " " + data.getUser.apellido}
      </h1>
      <button
        onClick={() => cerrarSesion()}
        type="button"
        className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Header;
