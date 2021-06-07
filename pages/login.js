import { useFormik } from "formik";

import React, { useState } from "react";
import Layout from "../components/Layout";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const AUTENTICAR_DENTISTA = gql`
  mutation autenticateDentist($input: AuthInput!) {
    autenticateDentist(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const router = useRouter();

  const [autenticarDentista] = useMutation(AUTENTICAR_DENTISTA);
  const [mensaje, guardarMensaje] = useState(null);
  const formik = useFormik({
    initialValues: {
      usuario: "",
      password: "",
    },
    validationSchema: Yup.object({
      usuario: Yup.string().required("El username es necesario"),
      password: Yup.string().required("Necesitas llenar el password"),
    }),
    onSubmit: async (valores) => {
      console.log(valores);

      const { usuario, password } = valores;

      try {
        const { data } = await autenticarDentista({
          variables: {
            input: {
              usuario,
              password,
            },
          },
        });
        console.log(data);
        guardarMensaje("Autenticando....");
        const { token } = data.autenticateDentist;
        localStorage.setItem("token", token);
        setTimeout(() => {
          guardarMensaje(null);
          router.push("/");
        }, 3000);
      } catch (error) {
        guardarMensaje(error.message.replace("GraphQL error: ", ""));
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
        <h1 className="text-center text-2xl text-white front-light">Login</h1>

        {mensaje && mostrarMensaje()}

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="usuario"
                >
                  Usuario
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="usuario"
                  type="text"
                  placeholder="Username"
                  value={formik.values.usuario}
                  onChange={formik.handleChange}
                />
              </div>

              {formik.errors.usuario ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.usuario}</p>
                </div>
              ) : null}

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
              </div>

              {formik.errors.password ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.password}</p>
                </div>
              ) : null}

              <input
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                value="Iniciar Sesión"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;
