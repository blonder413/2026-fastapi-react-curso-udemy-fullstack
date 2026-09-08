import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import type { User } from "../interfaces/User.interface";
import { findOne } from "../services/user.api";
import { errorSession } from "../helpers/helpers";
import AuthContext from "../context/AuthProvider";

const Header = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return <div>No se ha cargado el context</div>;
  }
  const { logout } = context;

  const [valorMenu, setValorMenu] = useState("hide");
  const [iconMenu, setIconMenu] = useState("fa-long-arrow-alt-left");
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [user, setUser] = useState<User>();

  const getCurrentDate = () => {
    dayjs.locale("es");
    const date = new Date();
    let day = dayjs(date).format("ddd");
    day = day.charAt(0).toUpperCase() + day.slice(1);
    const formattedDate =
      day +
      " " +
      dayjs(date).format("DD") +
      " de " +
      dayjs(date).format("MMM") +
      " " +
      dayjs(date).format("YYYY");
    return formattedDate;
  };

  const setMenu = () => {
    const e = document.getElementsByClassName("js-sidebar")[0];
    (e.classList.toggle("collapsed"),
      e.addEventListener("transitionend", function () {
        window.dispatchEvent(new Event("resize"));
        if (valorMenu == "show") {
          setValorMenu("hide");
          setIconMenu("fa-long-arrow-alt-left");
        } else {
          setValorMenu("show");
          setIconMenu("fa-long-arrow-alt-right");
        }
      }));
  };

  useEffect(() => {
    setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
  }, []);

  useEffect(() => {
    const findUser = async () => {
      const id = localStorage.getItem("menu_id");
      if (id) {
        try {
          const [data, status] = await findOne(Number(id));
          if (status == 200) {
            setUser(data.response);
            localStorage.setItem("menu_profile_id", data.response.profile_id);
          } else {
            errorSession();
          }
        } catch (error) {
          errorSession();
        }
      }
    };
    findUser();
  }, []);

  return (
    <nav className="navbar navbar-expand navbar-light navbar-bg">
      <button
        className="btn btn-link p-0 border-0 text-decoration-none sidebar-toggle"
        onClick={setMenu}
        title={valorMenu}
      >
        <i className={`fas ${iconMenu} align-self-center`}></i>
      </button>

      <div className="navbar-collapse collapse">
        <ul className="navbar-nav navbar-align">
          <li className="nav-item dropdown">
            <a
              className="nav-icon dropdown-toggle d-inline-block d-sm-none"
              href="#"
              data-bs-toggle="dropdown"
            >
              <i className="fas fa-long-arrow-alt-down align-middle"></i>
            </a>
            <a className="nav-link d-none d-sm-inline-block">
              {getCurrentDate()}
            </a>
            <a className="nav-link d-none d-sm-inline-block">
              <span className="text-dark">|</span>
            </a>
            <a className="nav-link d-none d-sm-inline-block">{time}</a>
            <a className="nav-link d-none d-sm-inline-block">
              <span className="text-dark">|</span>
            </a>
            <a className="nav-link d-none d-sm-inline-block">{user?.profile}</a>
            <a className="nav-link d-none d-sm-inline-block">
              <span className="text-dark">|</span>
            </a>
            <a
              className="nav-link dropdown-toggle d-none d-sm-inline-block"
              href="#"
              data-bs-toggle="dropdown"
            >
              <span className="text-dark">{user?.name}</span>
              <img
                src="/img/perfil.png"
                className="avatar img-fluid rounded me-1"
              />
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              <button
                className="dropdown-item"
                onClick={logout}
                title="Cerrar sesión"
              >
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>{" "}
                Cerrar sesión
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
