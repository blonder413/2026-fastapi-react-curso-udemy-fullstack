import React, { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import { login } from "../services/login.api";
import Spinner from "../components/Spinner";
import AuthContext from "../context/AuthProvider";
import type { CustomAlertInterface } from "../components/ui/CustomAlert";
import CustomAlert from "../components/ui/CustomAlert";
import { Link } from "react-router-dom";

const Login = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return <div>No se pudo cargar el contexto</div>;
  }
  const { handleLogin } = context;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [button, setButton] = useState("block");
  const [preloader, setPreloader] = useState("none");
  const [customAlert, setCustomAlert] = useState<CustomAlertInterface>({
    state: false,
    title: "",
    detail: "",
    headerBg: "bg-primary",
  });

  const validateForm = () => {
    if (email.length == 0 || email == "") {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "El correo es obligatorio",
        headerBg: "bg-warning",
      });
      return false;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "El correo no es válido",
        headerBg: "bg-warning",
      });
      setEmail("");
      return false;
    }

    if (password.length == 0 || password == "") {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "La contraseña es obligatoria",
        headerBg: "bg-warning",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setButton("none");
    setPreloader("block");
    const response = await login({ email: email, password: password });
    if (response[1] == 200) {
      const { data } = response[0];
      handleLogin(data.id, data.name, data.token, data.profile);
      globalThis.location.href = "/";
    } else {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "Ocurrió un error inesperado",
        headerBg: "bg-danger",
      });
      globalThis.location.href = "/login";
    }
  };

  const handleCloseModal = () => {
    setCustomAlert((prev) => ({ ...prev, state: false }));
  };

  return (
    <>
      <main className="d-flex w-100">
        <div className="container d-flex flex-column">
          <div className="row vh-100">
            <div className="col-sm-12 col-md-8 col-lg-6 mx-auto d-table h-100">
              <div className="d-table-cell align-middle">
                <div className="text-center mt-4">
                  <h1 className="h2">{import.meta.env.VITE_APP_NAME}</h1>
                  <p className="lead">
                    Desarrollado con FastApi de Python, postgreSQL, SQLModel,
                    Alembic y React 19 con typescript.
                  </p>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="m-sm-4">
                      <div className="text-center">
                        <img
                          alt={`${import.meta.env.VITE_APP_NAME}`}
                          className="img-fluid rounded-circle"
                          src="/img/logo.svg"
                          width="132"
                        />
                      </div>
                      <Form id="form" noValidate onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">
                            Correo
                          </label>
                          <input
                            type="text"
                            id="email"
                            className="form-control"
                            placeholder="joedoe@example.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">
                            Contraseña
                          </label>
                          <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                            }}
                          />
                        </div>
                        <div className="text-center mt-3">
                          <div
                            className="col-12 text-center"
                            style={{ display: button }}
                          >
                            <button
                              className="btn btn-lg btn-primary"
                              id="login"
                              title="Iniciar sesión"
                            >
                              <i className="fas fa-lock-open"></i> Ingresar
                            </button>
                          </div>
                          <div
                            className="col-12 text-center"
                            style={{ display: preloader }}
                          >
                            <Spinner />
                          </div>

                          <hr />
                          <Link to="/restablecer">Restablecer contraseña</Link>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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

export default Login;
