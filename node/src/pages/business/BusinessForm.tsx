import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Form } from "react-bootstrap";
import { useLoaderData } from "react-router-dom";

import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";
import AuthContext from "../../context/AuthProvider";
import type { Category } from "../../interfaces/Category.interface";
import type { User } from "../../interfaces/User.interface";
import type { CustomAlertInterface } from "../../components/ui/CustomAlert";
import CustomAlert from "../../components/ui/CustomAlert";
import { create } from "../../services/business.api";
import type { Business } from "../../interfaces/Business";

const BusinessForm = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return <h1>No fue posible cargar el contexto</h1>;
  }
  const { checkAccess } = context;

  const { categories, users, action, id } = useLoaderData();

  const [state_id, setState_id] = useState("0");
  const [category_id, setCategory_id] = useState("0");
  const [user_id, setUser_id] = useState("0");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [customAlert, setCustomAlert] = useState<CustomAlertInterface>({
    state: false,
    title: "",
    detail: "",
    headerBg: "bg-primary",
  });

  const handleCloseModal = () => {
    setCustomAlert((prev) => ({ ...prev, state: false }));
  };

  const validateForm = () => {
    if (user_id == "0") {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "El usuario es obligatorio",
        headerBg: "bg-warning",
      });
      setUser_id("0");
      return false;
    }

    if (category_id == "0") {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "La categoría es obligatoria",
        headerBg: "bg-warning",
      });
      setCategory_id("0");
      return false;
    }

    if (name.trim() == "") {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "El nombre es obligatorio",
        headerBg: "bg-warning",
      });
      setName("");
      return false;
    }

    if (email.length == 0 || email == "") {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "El correo es obligatorio",
        headerBg: "bg-warning",
      });
      return false;
    }

    if (phone_number.trim() == "") {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "El teléfono es obligatorio",
        headerBg: "bg-warning",
      });
      setPhone_number("");
      return false;
    }

    if (address.trim() == "") {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "La dirección es obligatoria",
        headerBg: "bg-warning",
      });
      setAddress("");
      return false;
    }

    if (location.trim() == "") {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "La ubicación es obligatoria",
        headerBg: "bg-warning",
      });
      setLocation("");
      return false;
    }

    if (description.trim() == "") {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "La descripción es obligatoria",
        headerBg: "bg-warning",
      });
      setDescription("");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    if (action == 1) {
      const dto: Business = {
        category_id: parseInt(category_id),
        user_id: parseInt(user_id),
        name,
        email,
        phone_number,
        address,
        logo: "",
        location,
        description,
      };
      if (await create(dto)) {
        setCustomAlert({
          state: true,
          title: "Creado!",
          detail: "Registro creado",
          headerBg: "bg-success",
        });
      } else {
        setCustomAlert({
          state: true,
          title: "Error!",
          detail: "Ocurrió un error",
          headerBg: "bg-danger",
        });
      }
    } else {
      console.debug("editar");
    }

    setTimeout(() => {
      globalThis.location.href = "/negocios/listar";
    }, 2000);
    // TODO: Save data
  };

  useEffect(() => {
    checkAccess("1");
  }, []);

  return (
    <div className="wrapper">
      <Menu />
      <div className="main">
        <Header />
        <main className="content">
          <div className="container-fluid p-0">
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="/negocios/listar">
                Negocios
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Crear</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="h3 mb-3">Negocios</h1>
            <div className="row">
              <div className="col-12 col-lg-12  d-flex">
                <div className="card flex-fill">
                  <div className="card-body">
                    <Form onSubmit={handleSubmit}>
                      <div className="col-lg-3">
                        <label htmlFor="user_id">Usuario</label>
                        <select
                          className="form-control"
                          id="user_id"
                          value={user_id}
                          onChange={(e) => {
                            setUser_id(e.target.value);
                          }}
                        >
                          <option value="0">Seleccione...</option>
                          {users.response
                            .filter((user: User) => user.state_id === 1)
                            .map((user: User) => (
                              <option key={user.id} value={user.id}>
                                {user.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="col-lg-3">
                        <label htmlFor="category_id">Categoría</label>
                        <select
                          className="form-control"
                          id="category_id"
                          value={category_id}
                          onChange={(e) => {
                            setCategory_id(e.target.value);
                          }}
                        >
                          <option value="0">Seleccione...</option>
                          {categories.response.map((category: Category) => (
                            <option key={category.id} value={category.id}>
                              {category.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-lg-3">
                        <label htmlFor="name" className="form-label">
                          Nombre
                        </label>
                        <input
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

                      <div className="col-lg-3">
                        <label htmlFor="email" className="form-label">
                          Correo
                        </label>
                        <input
                          className="form-control"
                          type="email"
                          id="email"
                          placeholder="jdoe@email.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label htmlFor="phone_number" className="form-label">
                          Teléfono
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="phone_number"
                          placeholder="555-5555555"
                          value={phone_number}
                          onChange={(e) => {
                            setPhone_number(e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label htmlFor="address" className="form-label">
                          Dirección
                        </label>
                        <input
                          className="form-control"
                          type="address"
                          id="address"
                          placeholder="Evergreen Av. 7-42"
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label htmlFor="location" className="form-label">
                          Ubicación
                        </label>
                        <input
                          className="form-control"
                          type="location"
                          id="location"
                          placeholder=""
                          value={location}
                          onChange={(e) => {
                            setLocation(e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-lg-3">
                        <label htmlFor="description" className="form-label">
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          id="description"
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Descripción"
                          value={description}
                        ></textarea>
                      </div>

                      <div>
                        <div className="col-lg-3 d-flex justify-content-end">
                          <button className="btn btn-primary mt-3">
                            <i className="fas fa-plus"></i> Crear
                          </button>
                        </div>
                      </div>
                    </Form>
                  </div>
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

export default BusinessForm;
