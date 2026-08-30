import {Link} from "react-router-dom"

const Menu = () => {
  return (
    <div id="sidebar" className="sidebar js-sidebar">
      <div className="sidebar-content js-simplebar">
        <Link to="/" className="sidebar-brand">
          <span className="align-middle">
            <img src="/img/loguito.png" alt="logo" style={{ width: "150px" }} />
          </span>
        </Link>
        <ul className="sidebar-nav">
          <li className="sidebar-header">Administración</li>
          <li className="sidebar-item">
            <Link to="/perfiles" className="sidebar-link" title="Administrar perfiles">
              <i className="align-middle fas fa-list"></i>
              <span className="align-middle">Perfil</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/usuarios" className="sidebar-link" title="Administrar usuarios">
              <i className="align-middle fas fa-users"></i>
              <span className="align-middle">Usuarios</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/negocios/categorias" className="sidebar-link" title="Administrar categorías">
              <i className="align-middle fas fa-list"></i>
              <span className="align-middle">Categorías</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/negocios/listar" className="sidebar-link" title="Administrar negocios">
              <i className="align-middle fas fa-list-alt"></i>
              <span className="align-middle">Negocios</span>
            </Link>
          </li>
          <li className="sidebar-header">Mi Negocio</li>
          <li className="sidebar-item">
            <Link to="/mi-negocio" className="sidebar-link" title="Administrar mi negocio">
              <i className="align-middle fas fa-list-alt"></i>
              <span className="align-middle">Mi Negocio</span>
            </Link>
          </li>

        </ul>
      </div>
    </div>
  );
};

export default Menu;
