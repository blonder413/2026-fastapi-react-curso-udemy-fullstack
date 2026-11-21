import { useContext, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Breadcrumb, Form, Modal } from "react-bootstrap";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import AuthContext from "../../context/AuthProvider";
import type { PlateCategory } from "../../interfaces/PlateCategory";
import { create, remove, update } from "../../services/plateCategory.api";
import type { CustomAlertInterface } from "../../components/ui/CustomAlert";
import CustomAlert from "../../components/ui/CustomAlert";
import type { Action } from "../../types/Action.type";

const PlateCategory = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return <h1>No fue posible cargar el contexto</h1>;
  }
  const { checkAccess, showConfirm, setConfirmData } = context;

  const { data } = useLoaderData();

  const [id, setId] = useState<number>();
  const [name, setName] = useState("");
  const [action, setAction] = useState<Action>();
  const [show, setShow] = useState(false);
  const [customAlert, setCustomAlert] = useState<CustomAlertInterface>({
    state: false,
    title: "",
    detail: "",
    headerBg: "bg-primary",
  });

  const handleShow = async () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  const handleCreate = () => {
    setAction("create");
    setName("");
    handleShow();
  };

  const handleEdit = (data: PlateCategory) => {
    setAction("edit");
    setId(data?.id);
    setName(data.name);
    handleShow();
  };

  const handleCloseModal = () => {
    setCustomAlert((prev) => ({ ...prev, state: false }));
  };

  const handleDelete = async (id: number) => {
    showConfirm({
      title: "Eliminar",
      detail: "¿Realmente desea eliminar este registro?",
      headerBg: "bg-warning",
      isConfirm: true,
      onConfirm: async () => {
        try {
          await remove(id);
          setCustomAlert({
            state: true,
            title: "Eliminado",
            detail: "Registro eliminado exitosamente",
            headerBg: "bg-success",
          });
          setTimeout(() => {
            globalThis.location.href = location.href;
          }, 2000);
        } catch (error) {
          setCustomAlert({
            state: true,
            title: "Error",
            detail: "Error al eliminar el registro",
            headerBg: "bg-danger",
          });
        }
      },
      onClose: () => setConfirmData(null),
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name.trim() == "") {
      setCustomAlert({
        state: true,
        title: "Alerta !!!",
        detail: "El campo nombre es obligatorio",
        headerBg: "bg-danger",
      });
      setName("");
      return false;
    }
    if (action == "create") {
      const response = await create({ name: name });
      if (response.status.status_code == 201) {
        setCustomAlert({
          state: true,
          title: "Excelente !!!",
          detail: "Se creó el registro exitosamente",
          headerBg: "bg-success",
        });
        setInterval(() => {
          window.location.href = location.href;
        }, 2000);
      } else {
        setCustomAlert({
          state: true,
          title: "Alerta !!!",
          detail: "Se produjo un error inesperado",
          headerBg: "bg-danger",
        });
      }
    }
    if (action == "edit") {
      const response = await update({ id: id, name: name });
      if (response.status.status_code == 200) {
        setCustomAlert({
          state: true,
          title: "Excelente !!!",
          detail: "Se modificó el registro exitosamente",
          headerBg: "bg-success",
        });
        setInterval(() => {
          window.location.href = location.href;
        }, 2000);
      } else {
        setCustomAlert({
          state: true,
          title: "Alerta !!!",
          detail: "Se produjo un error inesperado",
          headerBg: "bg-danger",
        });
      }
    }
  };

  useEffect(() => {
    checkAccess("1");
  });

  return (
    <section className="wrapper">
      <Menu />
      <div className="main">
        <Header />
        <main className="content">
          <div className="container-fluid p-0">
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Platos categoría</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="h3 mb-3">Platos categoría</h1>
            <div className="row">
              <div className="col-12 col-lg-12  d-flex">
                <div className="card flex-fill">
                  <div className="card-header">
                    <button
                      className="btn btn-outline-primary float-end"
                      onClick={handleCreate}
                      title="Crear"
                      type="button"
                    >
                      <i className="fas fa-check"></i> Crear
                    </button>
                    <h5 className="card-title mb-0"> </h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.response.map((PlateCategory: PlateCategory) => (
                            <tr key={PlateCategory.id}>
                              <td>{PlateCategory.id}</td>
                              <td>{PlateCategory.name}</td>
                              <td>
                                <button
                                  className="btn btn-sm"
                                  onClick={() => handleEdit(PlateCategory)}
                                  title={`Editar ${PlateCategory.name}`}
                                >
                                  <i className="fas fa-edit text-primary"></i>
                                </button>
                                <button
                                  className="btn btn-sm"
                                  onClick={() => handleDelete(PlateCategory.id)}
                                  title={`Eliminar ${PlateCategory.name}`}
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
      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>{action == "create" ? "Crear" : "Editar"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="row gy-3">
              <div className="col-lg-12">
                <label className="form-label" htmlFor="nombre">
                  Nombre
                </label>
                <input
                  className="form-control"
                  id="nombre"
                  type="text"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-6"></div>
              <div className="col-6 d-flex justify-content-end">
                <button className="btn btn-primary">
                  {action == "create" ? (
                    <>
                      <i className="fas fa-plus"></i> Crear
                    </>
                  ) : (
                    <>
                      <i className="fas fa-pencil-alt"></i> Editar
                    </>
                  )}
                </button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <CustomAlert
        state={customAlert.state}
        title={customAlert.title}
        detail={customAlert.detail}
        onClose={handleCloseModal}
        headerBg={customAlert.headerBg}
      />
    </section>
  );
};

export default PlateCategory;
