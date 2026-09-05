import React, { useState } from "react";
import { Form } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateForm = () => {
    if (email.length == 0 || email == "") {
      alert("El correo es obligatorio");
      return;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      alert("El correo no es válido");
      setEmail("");
      return false;
    }

    if (password.length == 0 || password == "") {
      alert("La contraseña es obligatorio");
      return;
    }
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    validateForm();

    console.log(email, password);
  };

  return (
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
                        <div className="col12 text-center">
                          <button
                            className="btn btn-lg btn-primary"
                            id="login"
                            title="Iniciar sesión"
                          >
                            <i className="fas fa-lock-open"></i> Ingresar
                          </button>
                        </div>
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
  );
};

export default Login;
