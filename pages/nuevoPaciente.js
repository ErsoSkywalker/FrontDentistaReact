import Layout from "../components/Layout";
import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import router from "next/router";

const CREAR_PACIENTE = gql`
  mutation createNewPatient($input: PatientInput!) {
    createNewPatient(input: $input) {
      id
    }
  }
`;
const NuevoPaciente = () => {
  const [crearPaciente] = useMutation(CREAR_PACIENTE);

  const [mensaje, guardarMensaje] = useState(null);
  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      contacto: "",
      tipoContacto: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es necesario"),
      apellido: Yup.string().required("El apellido es necesario"),
      contacto: Yup.string().required("El contacto es necesario"),
      tipoContacto: Yup.string().required("El tipo de contacto es necesario"),
    }),
    onSubmit: async (valores) => {
      console.log(valores);
      const { nombre, apellido, tipoContacto, contacto } = valores;
      try {
        //Crear paciente

        const { data } = await crearPaciente({
          variables: {
            input: {
              nombre,
              apellido,
              contacto: [
                {
                  typeContact: tipoContacto,
                  contact: contacto,
                },
              ],
            },
          },
        });

        guardarMensaje("Guardando....");
        console.log(data);
        setTimeout(() => {
          guardarMensaje(null);
          router.push("/pacientes");
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
        <h1 className="text-3xl font-light">Nuevo Paciente</h1>
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
                  htmlFor="nombre"
                >
                  Nombre
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="nombre"
                  type="text"
                  placeholder="Nombre"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="apellido"
                >
                  Apellido
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="apellido"
                  type="text"
                  placeholder="Apellido"
                  value={formik.values.apellido}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="contacto"
                >
                  Contacto
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="contacto"
                  type="text"
                  placeholder="Contacto"
                  value={formik.values.contacto}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="tipoContacto"
                >
                  Tipo de Contacto
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="tipoContacto"
                  type="text"
                  placeholder="Tipo de Contacto"
                  value={formik.values.tipoContacto}
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

export default NuevoPaciente;
