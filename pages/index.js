import Layout from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const GET_CITAS = gql`
  query getCitas {
    getCitas {
      id
      Patient {
        nombre
        apellido
      }
      DateArranged
      cost
    }
  }
`;

export default function Home() {
  const { data, loading, error } = useQuery(GET_CITAS);

  if (loading) return "Cargando...";
  const router = useRouter();
  if (!data) {
    router.push("/login");
  }

  return (
    <div>
      <Layout>
        <h1 className="text-3xl font-light">Citas</h1>
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Nombre</th>
              <th className="w-1/5 py-2">Costo</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.getCitas.map((cita) => {
              console.log(cita.DateArranged);
              const dateNice = new Date(cita.DateArranged);
              console.log(dateNice.toLocaleDateString());
              return (
                <tr key={cita.id}>
                  <td className="border px-4 py-2 text-left">
                    {cita.Patient.nombre + " " + cita.Patient.apellido}
                  </td>
                  <td className="border px-4 py-2 text-left">
                    $ {cita.cost} MXN
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Layout>
    </div>
  );
}
