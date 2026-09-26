import { useLoaderData } from "react-router-dom";
import { Breadcrumb, Form, Modal } from "react-bootstrap";
import Menu from "../components/Menu";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { User as UserInterface } from "../interfaces/User.interface";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthProvider";
import type { CustomAlertInterface } from "../components/ui/CustomAlert";
import CustomAlert from "../components/ui/CustomAlert";
import type { State } from "../interfaces/State.interface";
import type { Profile } from "../interfaces/Profile.interface";
import type { Action } from "../types/Action.type";

const User = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return <h1>No fue posible cargar el contexto</h1>;
  }
  const { checkAccess } = context;
  const { data, profiles, states } = useLoaderData();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileId, setProfileId] = useState(0);
  const [stateId, setStateId] = useState(0);

  const [show, setShow] = useState(false);
  const [action, setAction] = useState<Action>("create");
  const [actionId, setActionId] = useState<number | undefined>();
  const [customAlert, setCustomAlert] = useState<CustomAlertInterface>({
    state: false,
    title: "",
    detail: "",
    headerBg: "bg-primary",
  });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseModal = () => {
    setCustomAlert((prev) => ({ ...prev, state: false }));
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

  const handleCreate = () => {
    setName("");
    setEmail("");
    setPassword("");
    setProfileId(0);
    setAction("create");
    handleShow();
    console.debug("Create");
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
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
                <Breadcrumb.Item active>Usuarios</Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="h3 mb-3">Usuarios</h1>
              <div className="row">
                <section className="col-12 d-flex">
                  <section className="card flex-fill">
                    <section className="card-header">
                      <button
                        className="btn btn-outline-primary float-end"
                        onClick={handleCreate}
                        title="Crear Registro"
                      >
                        <i className="fas fa-plus"></i> Crear
                      </button>
                    </section>
                    <section className="card-body">
                      <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                          <caption className="visually-hidden">
                            Tabla con listado de usuarios, incluye información
                            del nombre.
                          </caption>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Nombre</th>
                              <th>Perfil</th>
                              <th>Estado</th>
                              <th>Correo</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.response.map((user: UserInterface) => (
                              <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.profile}</td>
                                <td>
                                  <span
                                    className={`text-${user.state_id == 1 ? "primary" : "danger"}`}
                                  >
                                    {user.state}
                                  </span>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                  <button
                                    className="btn btn-sm"
                                    title={`Editar ${user.name}`}
                                  >
                                    <i className="fas fa-edit text-primary"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm"
                                    title={`Eliminar ${user.name}`}
                                  >
                                    <i className="fas fa-trash text-primary"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </section>
                </section>
              </div>
            </section>
          </main>
          <Footer />
        </section>
      </section>
      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>{action == "create" ? "Crear" : "Editar"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <section className="row gy-3">
              {action == "edit" && (
                <div className="col-lg-12">
                  <label htmlFor="state_id">Estado</label>
                  <select
                    className="form-control"
                    id="state_id"
                    value={stateId}
                    onChange={(e) => {
                      setStateId(e.target.value);
                    }}
                  >
                    {states.response.map((state: State) => (
                      <option key={state.id} value={state.id}>
                        {state.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="col-lg-12">
                <label htmlFor="profile_id">Perfil</label>
                <select
                  className="form-control"
                  id="profile_id"
                  value={profileId}
                  onChange={(e) => {
                    setProfileId(e.target.value);
                  }}
                >
                  {profiles.response.map((profile: Profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>
              </div>

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

              <div className="col-lg-12">
                <label htmlFor="email" className="form-label">
                  Correo
                </label>
                <input
                  autoFocus
                  className="form-control"
                  type="email"
                  id="email"
                  placeholder="joedoe@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>

              <div className="col-lg-12">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  autoFocus
                  className="form-control"
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
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

export default User;
