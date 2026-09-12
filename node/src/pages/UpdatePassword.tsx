import { useState } from "react";
import Footer from "../components/Footer";
import type { CustomAlertInterface } from "../components/ui/CustomAlert";
import CustomAlert from "../components/ui/CustomAlert";
import { Form } from "react-bootstrap";
import Spinner from "../components/Spinner";
import { Link, useParams } from "react-router-dom";
import { updatePassword } from "../services/recovery.api";

const UpdatePassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [button, setButton] = useState("");
  const [preloader, setPreloader] = useState("none");
  const [customAlert, setCustomAlert] = useState<CustomAlertInterface>({
    state: false,
    title: "",
    detail: "",
    headerBg: "bg-primary",
  });

  const validateForm = () => {
    if (password.length == 0 || password == "") {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "La contraseña es obligatorio",
        headerBg: "bg-warning",
      });
      return false;
    }

    if (password != confirmPassword) {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "Las contraseñas no coinciden",
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

    if (!token) {
      setCustomAlert({
        state: true,
        title: "Error",
        detail: "Error al procesar el token de recuperación",
        headerBg: "bg-danger",
      });
    }
    if ((await updatePassword({ token: token, password: password })) == 200) {
      setCustomAlert({
        state: true,
        title: "Creado",
        detail: "Registro creado exitosamente",
        headerBg: "bg-sucess",
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
    }, 200);
  };

  const handleCloseModal = () => {
    setCustomAlert((prev) => ({ ...prev, state: false }));
  };

  return (
    <div className="wrapper">
      <div className="main">
        <main className="content">
          <div className="container-fluid p-0">
            <div className="d-flex flex-column align-items-center">
              <h1 className="h3 mb-3">Restablecer contraseña</h1>

              <div className="row w-100 justify-content-center">
                <div className="col-12 col-sm-10 col-md-6 col-lg-4">
                  <Form id="form" noValidate onSubmit={handleSubmit}>
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

                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirmar contraseña
                      </label>

                      <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
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
                          title="Guardar"
                        >
                          <i className="fas fa-lock-open"></i> Guardar
                        </button>
                      </div>

                      <div
                        className="col-12 text-center"
                        style={{ display: preloader }}
                      >
                        <Spinner />
                      </div>

                      <hr />

                      <Link to="/login">Iniciar sesión</Link>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <CustomAlert
        state={customAlert.state}
        title={customAlert.title}
        detail={customAlert.detail}
        onClose={handleCloseModal}
        headerBg={customAlert.headerBg}
      />
    </div>
  );
};

export default UpdatePassword;
