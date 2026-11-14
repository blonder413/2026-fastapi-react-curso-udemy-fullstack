import { useLoaderData } from "react-router-dom";
import type { Plate } from "../interfaces/Menu.interface";
import CategoryMenu from "../components/CategoryMenu";

const Menu = () => {
  const { data } = useLoaderData();
  const categories = Array.from(
    new Set(
      data.response.plates.map(
        (plate: Plate) => plate.plate_category,
      ) as string,
    ),
  );
  const business = data.response;

  return (
    <section id="menu" className="menu section-bg">
      <div className="container">
        <div className="section-title text-center">
          <img
            src={business.logo}
            alt={business.name}
            className="img-fluid mb-3 mt-3"
            style={{ maxWidth: "200px", height: "auto", borderRadius: "8px" }}
          />
          <h2>{business.name}</h2>
          <p>{business.description}</p>
        </div>

        <CategoryMenu categories={categories} />

        <div className="row">
          <div className="col-lg-12">
            <div className="tab-content">
              {categories.map((category, index) => (
                <div
                  key={index}
                  id={`categoria-${index + 1}`}
                  className={`tab-pane fade ${index == 0 ? "show active" : ""}`}
                >
                  <div className="row gy-5">
                    {business.plates
                      .filter(
                        (plate: Plate) => plate.plate_category == category,
                      )
                      .map((plate: Plate) => (
                        <div className="col-lg-6 g-3" key={plate.id}>
                          <div className="menu-item">
                            <div className="d-flex">
                              <div className="menu-img flex-shrink-0 me-4">
                                <img
                                  src={plate.photo}
                                  alt={plate.name}
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
                                  <h4>{plate.name}</h4>
                                  <div className="price text-end">
                                    ${plate.price}
                                  </div>
                                </div>
                                <p className="ingredients">
                                  {plate.ingredients}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
