import { Breadcrumb, Form, Modal } from "react-bootstrap";
import { Link, useLoaderData } from "react-router-dom";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import type { Plate } from "../../interfaces/Plate.interface";
import type { PlateCategory } from "../../interfaces/PlateCategory";
import type { CustomAlertInterface } from "../../components/ui/CustomAlert";
import CustomAlert from "../../components/ui/CustomAlert";
import { create, remove } from "../../services/plate.api";
import type { CreatePlateDto } from "../../dto/CreatePlate.dto";

const Plate = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return <h1>No fue posible cargar el contexto</h1>;
  }
  const { checkAccess, setConfirmData, showConfirm } = context;
  const { bussiness, categories, data } = useLoaderData();
  const [category, setCategory] = useState("0");
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [price, setPrice] = useState("");
  const [show, setShow] = useState(false);
  const [customAlert, setCustomAlert] = useState<CustomAlertInterface>({
    state: false,
    title: "",
    detail: "",
    headerBg: "bg-primary",
  });

  const handleCloseModal = () => {
    setCustomAlert((prev) => ({ ...prev, state: false }));
  };

  const handleClose = () => setShow(false);

  const handleCreate = () => {
    setName("");
    setShow(true);
  };

  const validateForm = () => {
    if (category == "0") {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "La categoría es obligatoria",
        headerBg: "bg-warning",
      });
      setCategory("0");
      return false;
    }
    if (name == "" || name == "0") {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "El nombre es obligatorio",
        headerBg: "bg-warning",
      });
      setName("");
      return false;
    }
    if (price == "" || price == "0") {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "El precio es obligatorio",
        headerBg: "bg-warning",
      });
      setPrice("");
      return false;
    }
    if (ingredients == "" || ingredients == "0") {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "Los ingredientes son obligatorios",
        headerBg: "bg-warning",
      });
      setIngredients("");
      return false;
    }
    return true;
  };

  const validateFile = (fileInput: File) => {
    if (!fileInput || fileInput.size === 0) {
      setCustomAlert({
        state: true,
        title: "Alerta",
        detail: "Debe seleccionar un archivo",
        headerBg: "bg-danger",
      });
      return false;
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(fileInput.type)) {
      setCustomAlert({
        state: true,
        title: "Error",
        detail: "Solo se permiten imágenes jpeg, png",
        headerBg: "bg-danger",
      });
      return false;
    }

    const maxSize = 5 * 1024 * 1024;
    if (fileInput.size > maxSize) {
      setCustomAlert({
        state: true,
        title: "Error",
        detail: "Solo se permite máximo 5MB",
        headerBg: "bg-danger",
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

    const formData = new FormData(e.currentTarget);
    const fileInput = formData.get("photo") as File;
    const isValidFile = validateFile(fileInput);

    if (!isValidFile) {
      return;
    }

    const dto: CreatePlateDto = {
      plates_category_id: +category,
      business_id: bussiness.response.id,
      name: name,
      ingredients: ingredients,
      price: +price,
      file: fileInput,
    };
    try {
      const response = await create(dto);
      if (response?.status?.status_code == 201) {
        setCustomAlert({
          state: true,
          title: "Creado",
          detail: "Plato creado exitosamente",
          headerBg: "bg-success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
    } catch (e) {
      setCustomAlert({
        state: true,
        title: "Error",
        detail: `Error al crear el plato: ${e}`,
        headerBg: "bg-danger",
      });
    }
  };

  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <div className="row gy-3">
          <div className="col-lg-12">
            <label htmlFor="category">
              Categoría (
              <span className="text-danger" aria-hidden="true">
                *
              </span>
              )
            </label>
            <select
              className="form-control"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="0">Seleccione...</option>
              {categories.response.map((category: PlateCategory) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row gy-3">
          <div className="col-lg-12">
            <label className="form-label" htmlFor="name">
              Nombre (
              <span className="text-danger" aria-hidden="true">
                *
              </span>
              )
            </label>
            <input
              className="form-control"
              id="name"
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="row gy-3">
          <div className="col-lg-12">
            <label className="form-label" htmlFor="price">
              Precio (
              <span className="text-danger" aria-hidden="true">
                *
              </span>
              )
            </label>
            <input
              className="form-control"
              id="price"
              type="text"
              placeholder="Precio"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </div>
          <div className="row gy-3">
            <div className="col-lg-12">
              <label className="form-label" htmlFor="name">
                Ingredientes (
                <span className="text-danger" aria-hidden="true">
                  *
                </span>
                )
              </label>
              <textarea
                className="form-control"
                id="ingredients"
                placeholder="Ingredientes"
                value={ingredients}
                onChange={(e) => {
                  setIngredients(e.target.value);
                }}
              ></textarea>
            </div>
          </div>
          <div className="row gy-3">
            <div className="col-lg-12">
              <label className="form-label" htmlFor="name">
                Foto
              </label>
              <input
                className="form-control"
                id="photo"
                name="photo"
                type="file"
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-6"></div>
          <div className="col-6 d-flex justify-content-end">
            <button className="btn btn-primary">
              <i className="fas fa-plus"></i> Crear
            </button>
          </div>
        </div>
      </Form>
    );
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

  useEffect(() => {
    checkAccess("2");
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
              <Breadcrumb.Item active>
                Mi negocio: <strong>nombre</strong>
              </Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="h3 mb-3">
              Mi negocio: <strong>nombre</strong>
            </h1>
            <p>
              <Link
                to={`/carta/${bussiness.response.slug}`}
                target="_blank"
                title="Ir a mi negocio"
              >
                Ir a mi negocio{" "}
                <i className="fas fa-external-link-square-alt"></i>
              </Link>
            </p>
            <div className="row">
              <div className="col-12 col-lg-12  d-flex">
                <div className="card flex-fill">
                  <div className="card-header">
                    <a
                      className="btn btn-outline-primary float-end"
                      title="Crear"
                      onClick={handleCreate}
                    >
                      <i className="fas fa-plus"></i> Crear
                    </a>
                    <h5 className="card-title mb-0"> </h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped table-hover">
                        <thead>
                          <tr>
                            <th>Platos categoría</th>
                            <th>Nombre</th>
                            <th>Ingredientes</th>
                            <th>Precio</th>
                            <th>Foto</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.response.map((plate: Plate) => (
                            <tr>
                              <td>{plate.id}</td>
                              <td>{plate.name}</td>
                              <td>{plate.ingredients}</td>
                              <td>{plate.price}</td>
                              <td>
                                <img
                                  src={plate.photo}
                                  alt={plate.name}
                                  width={100}
                                />
                              </td>
                              <td>
                                <button
                                  className="btn text-danger"
                                  onClick={() => {
                                    handleDelete(plate.id);
                                  }}
                                  title={`Eliminar ${plate.name}`}
                                >
                                  <i className="fas fa-trash"></i>
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
          <Modal.Title>
            <h1>Crear</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderForm()}</Modal.Body>
      </Modal>
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

export default Plate;
