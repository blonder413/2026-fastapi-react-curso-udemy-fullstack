import { useLoaderData } from "react-router-dom";

const Menu = () => {
  const { data } = useLoaderData();

  console.debug(data);

  return (
    <section id="menu" className="menu section-bg">
      <div className="container">
        <div className="section-title">
          <img
            src=""
            alt=""
            className="img-fluid mb-3"
            style={{ maxWidth: "200px", height: "auto", borderRadius: "8px" }}
          />
          <h2>Restaurante Ejemplo Ñandú</h2>
          <p>Consulta nuestro delicioso menú</p>
        </div>

        <div className="row">
          <div className="col-lg-12 d-flex justify-content-center">
            <ul className="nav nav-tabs mb-5">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-bs-toggle="tab"
                  href="#categoria-1"
                >
                  Categoría 1
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="tab-content">
              {/* Pestaña Categoría 1 */}
              <div id="categoria-1" className="tab-pane fade show active">
                <div className="row gy-5">
                  {/* Item 1 */}
                  <div className="col-lg-6 menu-item">
                    <div className="d-flex">
                      <div className="menu-img flex-shrink-0 me-4">
                        <img
                          src="http://localhost:8000/curso-udemy/archivos/ba96549d-55a6-4b96-9f7f-5ff8813dce19.jpg"
                          alt="Lobster Bisque"
                          className="img-fluid"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <h4>Lobster Bisque</h4>
                          <div className="price text-end">$5.95</div>
                        </div>
                        <p className="ingredients">
                          Lorem, deren, tratara, filede, nerada
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
