import { Link, useLoaderData } from "react-router-dom";
import { Breadcrumb, Modal } from "react-bootstrap";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import type { Business } from "../../interfaces/Business";
import CustomImage from "../../components/ui/CustomImage";
import { findOne } from "../../services/business.api";

const Business = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return <h1>No fue posible cargar el contexto</h1>;
  }
  const { checkAccess } = context;

  const { data } = useLoaderData();

  const [businessDetail, setBusinessDetail] = useState<Business | null>(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAccess("1");
  });

  const [show, setShow] = useState(false);
  const handleShow = async (id: number) => {
    setShow(true);
    try {
      setLoading(true);
      const [data] = await findOne(id);
      if (data.status.status_code !== 200) {
        setError("Error al cargar la inforamción")
      } else {
        setBusinessDetail(data.response);
        setShow(true);
        setError(null);
      }
    } catch {
      setError("Error al cargar la información")
    } finally {
      setLoading(false);
    }
  }
  const handleClose = () => {
    setShow(false);
  }

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
                                  onClick={()=>handleShow(business.id)}
                                  title={`Ver Detalle ${business.name}`}
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
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          {loading && "Cargando..."}
          {!loading && error && <span className="text-danger">Error</span>}
          {!loading && !error && (businessDetail?.name ?? "Sin Información...")}
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className=".card.mb-3">
              <table className="table table-bordered table-striped">
                <tbody>
                  {error ? (
                    <tr>
                      <td className="text-center text-danger" colSpan={2}>
                        {error}
                      </td>
                    </tr>
                  ) : (
                    <>
                      <tr>
                        <th className="bg-light" style={{ width: "30%" }}>ID</th>
                        <td>{businessDetail?.id}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">Nombre</th>
                        <td>{businessDetail?.name}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">Categoría</th>
                        <td>{businessDetail?.category}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">Correo</th>
                        <td>{businessDetail?.email}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">Teléfono</th>
                        <td>{businessDetail?.phone_number}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">Dirección</th>
                        <td>{businessDetail?.address}</td>
                      </tr>
                      <tr>
                        <th className="bg-light">Descripción</th>
                        <td>{businessDetail?.description}</td>
                        </tr>
                        <tr>
                          <th className="bg-light">Mapa</th>
                          <td>
                            <iframe loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={businessDetail?.location} width={600} height={600}></iframe>
                          </td>
                        </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          ) }
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Business;
