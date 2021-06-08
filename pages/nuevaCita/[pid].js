import Layout from "../../components/Layout";
import { gql, useQuery, useMutation } from "@apollo/client";
import React, { useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useFormik } from "formik";

const CREAR_CITA = gql`
  mutation createNewCita($input: CitaInput!) {
    createNewCita(input: $input) {
      id
    }
  }
`;

const nuevaCita = () => {
  const [crearCita] = useMutation(CREAR_CITA);

  const [mensaje, guardarMensaje] = useState(null);
  const router = useRouter();
  const { query } = router;

  const formik = useFormik({
    initialValues: {
      fecha: "",
      costo: "",
      tipo: "",
      pieza: "",
    },
    validationSchema: Yup.object({
      fecha: Yup.string().required("La fecha es necesaria"),
      costo: Yup.string().required("El costo es necesario"),
      tipo: Yup.string().required("El tipo es necesario"),
      pieza: Yup.string().required("La pieza es necesaria"),
    }),
    onSubmit: async (valores) => {
      console.log(valores);

      const { fecha, costo, tipo, pieza } = valores;

      console.log(fecha);
      console.log(costo);
      console.log(query.pid);

      try {
        const { data } = await crearCita({
          variables: {
            input: {
              Patient: query.pid,
              DateArranged: fecha,
              cost: costo,
              conceptos: [{ tipoTratamiento: tipo, piezas: pieza }],
            },
          },
        });
        guardarMensaje("Guardando....");
        console.log(data);
        setTimeout(() => {
          guardarMensaje(null);

          router.push("/");
        }, 3000);
      } catch (error) {
        guardarMensaje("F....");
        console.log(error);
        setTimeout(() => {
          guardarMensaje(null);
        }, 3000);
      }
    },
  });

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{mensaje}</p>
      </div>
    );
  };

  return (
    <>
      <Layout>
        <h1 className="text-3xl font-light">Nueva Cita</h1>

        {mensaje && mostrarMensaje()}

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-lg">
            <form
              className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="fecha"
                >
                  Fecha
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="fecha"
                  type="date"
                  placeholder="Fecha"
                  value={formik.values.fecha}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="costo"
                >
                  Costo
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="costo"
                  type="number"
                  placeholder="Costo"
                  value={formik.values.costo}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="tipo"
                >
                  Tipo
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="tipo"
                  type="text"
                  placeholder="Tipo"
                  value={formik.values.tipo}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="pieza"
                >
                  Pieza
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="pieza"
                  type="text"
                  placeholder="Pieza"
                  value={formik.values.pieza}
                  onChange={formik.handleChange}
                />
              </div>

              <input
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                value="Guardar Cambios"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default nuevaCita;
