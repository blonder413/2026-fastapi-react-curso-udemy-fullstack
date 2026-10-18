import { Link, useLoaderData } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { useContext, useEffect } from "react";
import AuthContext from "../../context/AuthProvider";
import type { Business } from "../../interfaces/Business";
import CustomImage from "../../components/ui/CustomImage";

const Business = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return <h1>No fue posible cargar el contexto</h1>;
  }
  const { checkAccess } = context;

  const { data } = useLoaderData();

  useEffect(() => {
    checkAccess("1");
  });

  return (
    <div className="wrapper">
      <Menu />

      <div className="main">
        <Header />
        <main className="content">
          <div className="container-fluid p-0">
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Negocios</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="h3 mb-3">Negocios</h1>

            <div className="row">
              <div className="col-12 col-lg-12  d-flex">
                <div className="card flex-fill">
                  <div className="card-header">
                    <a
                      className="btn btn-outline-primary float-end"
                      title="Crear"
                    >
                      <i className="fas fa-plus"></i> Crear
                    </a>
                  </div>

                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Estado</th>
                            <th>Categoría</th>
                            <th>Nombre</th>
                            <th>Logo</th>
                            <th>Detalle</th>
                            <th>Carta</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.response.map((business: Business) => (
                            <tr key={business.id}>
                              <td>{business.id}</td>
                              <td>
                                <span
                                  className={`text-${business.state_id == 1 ? "primary" : "danger"}`}
                                >
                                  {business.state}
                                </span>
                              </td>
                              <td>{business.category}</td>
                              <td>{business.name}</td>
                              <td className="text-center">
                                <CustomImage imagenUrl={business.logo} titulo={`Logo ${business.name}`} >
                                  <i className="fas fa-image" title={business.name}></i>
                                </CustomImage>
                              </td>
                              <td className="text-center">
                                <button
                                  className="btn btn-sm"
                                  title="Ver imagen"
                                >
                                  <i className="fas fa-search"></i>
                                </button>
                              </td>
                              <td className="text-center">
                                <a
                                  className="btn btn-sm"
                                  href={`/carta/${business.slug}`}
                                  target="_blank"
                                  title="Ver imagen"
                                >
                                  <i className="fas fa-bars"></i>
                                </a>
                              </td>
                              <td>{business.date}</td>
                              <td>
                                <button
                                  className="btn btn-sm"
                                  onClick={() => {}}
                                  title={`Editar logo ${business.name}`}
                                >
                                  <i className="fas fa-upload text-primary"></i>
                                </button>
                                <Link
                                  className="btn btn-sm"
                                  to={`/negocio/formulario?accion=2&id=${business.id}`}
                                  title={`Editar ${business.name}`}
                                >
                                  <i className="fas fa-edit text-primary"></i>
                                </Link>
                                <button
                                  className="btn btn-sm"
                                  onClick={() => {}}
                                  title={`Eliminar ${business.name}`}
                                >
                                  <i className="fas fa-trash text-primary"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Business;
