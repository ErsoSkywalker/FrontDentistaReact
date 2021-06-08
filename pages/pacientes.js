import React from "react";

import { gql, useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Router from "next/router";
import Swal from "sweetalert2";
import Link from "next/link";
let idOmg = 0;
const GET_PACIENTES = gql`
  {
    getPatients {
      id
      nombre
      apellido
      estado
      deuda
    }
  }
`;

const CHANGE_PATIENT_STATUS = gql`
  mutation changeStatusPatient($idPatient: ID!) {
    changeStatusPatient(idPatient: $idPatient)
  }
`;

const Pacientes = () => {
  const [cambiarPaciente] = useMutation(CHANGE_PATIENT_STATUS, {
    update(cache) {
      const { getPatients } = cache.readQuery({
        query: GET_PACIENTES,
      });

      cache.writeQuery({
        query: GET_PACIENTES,
        data: {
          getPatients: getPatients.filter((patient) => patient.id != idOmg),
        },
      });
    },
  });

  const { data, loading, error } = useQuery(GET_PACIENTES);

  if (loading) return "Cargando...";
  const router = useRouter();
  if (!data) {
    router.push("/login");
  }

  const agregarCita = (id) => {
    Router.push({
      pathname: "/nuevaCita/[id]",
      query: { id: id },
    });
  };

  const confirmarEliminarPaciente = (id) => {
    idOmg = id;
    Swal.fire({
      title: "¿Seguro que deseas eliminar este paciente?",
      text: "Esta acción no puede deshacerse",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, borralo.",
      cancelButtonText: "Ño, gracias.",
    }).then(async (result) => {
      if (result.value) {
        try {
          const { data } = await cambiarPaciente({
            variables: {
              idPatient: id,
            },
          });

          Swal.fire("Eliminado!", data.changeStatusPatient, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <>
      <Layout>
        <h1 className="text-3xl font-light">Pacientes</h1>
        <Link href="/nuevoPaciente">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded uppercase font-bold text-sm">
            Agregar Paciente
          </a>
        </Link>
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Nombre</th>
              <th className="w-1/5 py-2">Estado</th>
              <th className="w-1/5 py-2">Deuda</th>
              <th className="w-1/5 py-2">Editar</th>
              <th className="w-1/5 py-2">Eliminar</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.getPatients.map((patient) => {
              return (
                <tr key={patient.id}>
                  <td className="border px-4 py-2 text-left">
                    {patient.nombre + " " + patient.apellido}
                  </td>
                  <td className="border px-4 py-2 text-left">
                    {patient.estado}
                  </td>
                  <td className="border px-4 py-2 text-left">
                    $ {patient.deuda} MXN
                  </td>
                  <td className="border px-4 py-2 text-left">
                    <button
                      type="button"
                      className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded font-bold uppercase"
                      onClick={() => {
                        agregarCita(patient.id);
                      }}
                    >
                      Agregar Cita
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-left">
                    <button
                      type="button"
                      className="flex justify-center items-center bg-red-600 py-2 px-4 w-full text-white rounded font-bold uppercase"
                      onClick={() => {
                        confirmarEliminarPaciente(patient.id);
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Layout>
    </>
  );
};

export default Pacientes;
