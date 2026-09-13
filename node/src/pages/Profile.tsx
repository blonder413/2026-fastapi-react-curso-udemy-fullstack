import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Menu from "../components/Menu";
import AuthContext from "../context/AuthProvider";
import { Breadcrumb, Form, Modal } from "react-bootstrap";
import { create, findAll, remove, update } from "../services/profile.api";
import { useLoaderData } from "react-router-dom";
import type { Profile } from "../interfaces/Profile.interface";
import Footer from "../components/Footer";
import type { CustomAlertInterface } from "../components/ui/CustomAlert";
import CustomAlert from "../components/ui/CustomAlert";

export const loader = async () => {
  const data = await findAll();
  return [data];
};

const Profile = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return <h1>No fue posible cargar el contexto</h1>;
  }
  const { checkAccess, setConfirmData, showConfirm } = context;
  const [data] = useLoaderData();
  const [show, setShow] = useState(false);
  const [action, setAction] = useState(1);
  const [actionId, setActionId] = useState<number | undefined>();
  const [name, setName] = useState("");
  const [customAlert, setCustomAlert] = useState<CustomAlertInterface>({
    state: false,
    title: "",
    detail: "",
    headerBg: "bg-primary",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCreate = () => {
    setAction(1);
    handleShow();
  };

  const handleEdit = (profile: Profile) => {
    setAction(2);
    setActionId(profile.id);
    setName(profile.name);
    handleShow();
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
          setInterval(() => {
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

  const validateForm = () => {
    if (name.trim() == "") {
      setName("");
      setCustomAlert({
        state: true,
        title: "Error",
        detail: "El nombre es obligatorio",
        headerBg: "bg-danger",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      return false;
    }
    if (action == 1) {
      if ((await create({ name: name })) == 201) {
        setCustomAlert({
          state: true,
          title: "Creado",
          detail: "Registro creado exitosamente",
          headerBg: "bg-success",
        });
      } else {
        setCustomAlert({
          state: true,
          title: "Error",
          detail: "Error al crear el registro",
          headerBg: "bg-danger",
        });
      }
      setInterval(() => {
        globalThis.location.href = location.href;
      }, 2000);
    } else {
      if ((await update({ id: actionId, name: name })) == 200) {
        setCustomAlert({
          state: true,
          title: "Editado",
          detail: "Registro editado exitosamente",
          headerBg: "bg-success",
        });
        setInterval(() => {
          globalThis.location.href = location.href;
        }, 2000);
      } else {
        setCustomAlert({
          state: true,
          title: "Error",
          detail: "Error al editar el registro",
          headerBg: "bg-danger",
        });
      }
    }
  };

  const renderButton = () => {
    return (
      <button className="btn btn-primary">
        {action == 1 ? (
          <>
            <i className="fas fa-plus"></i> Crear
          </>
        ) : (
          <>
            <i className="fas fa-pencil-alt"></i> Editar
          </>
        )}
      </button>
    );
  };

  const handleCloseModal = () => {
    setCustomAlert((prev) => ({ ...prev, state: false }));
  };

  useEffect(() => {
    checkAccess("1");
  });

  return (
    <>
      <section className="wrapper">
        <Menu />
        <section className="main">
          <Header />
          <main className="content">
            <section className="container-fluid p-0">
              <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Perfiles</Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="h3 mb-3">Perfiles</h1>
              <section className="row">
                <section className="col-12 d-flex">
                  <section className="card flex-fill">
                    <section className="card-header">
                      <button
                        className="btn btn-outline-primary float-end"
                        onClick={handleCreate}
                        title="Crear"
                      >
                        <i className="fas fa-plus"></i> Crear
                      </button>
                    </section>
                    <section className="card-body">
                      <section className="table-responsive">
                        <table className="table table-bordered table-hover table-stripe">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.response.map((profile: Profile) => (
                              <tr key={profile.id}>
                                <td>{profile.id}</td>
                                <td>{profile.name}</td>
                                <td className="text-center">
                                  <button
                                    className="btn btn-sm"
                                    onClick={() => handleEdit(profile)}
                                    title="Editar"
                                  >
                                    <i className="fas fa-edit text-primary"></i>
                                  </button>

                                  <button
                                    className="btn btn-sm"
                                    onClick={() => handleDelete(profile.id)}
                                    title="Eliminar"
                                  >
                                    <i className="fas fa-trash text-primary"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </section>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </main>
          <Footer />
        </section>
      </section>
      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>{action == 1 ? "Crear" : "Editar"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <section className="row gy-3">
              <div className="col-lg-12">
                <label htmlFor="name" className="form-label">
                  Nombre
                </label>
                <input
                  autoFocus
                  className="form-control"
                  type="text"
                  id="name"
                  placeholder="Joe Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
            </section>
            <hr />
            <div className="row">
              <div className="col-6"></div>
              <div className="col-6 d-flex justify-content-end">
                {renderButton()}
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
    </>
  );
};

export default Profile;
