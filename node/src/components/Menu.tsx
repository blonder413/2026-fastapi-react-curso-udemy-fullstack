const Menu = () => {
  return (
    <div id="sidebar" className="sidebar js-sidebar">
      <div className="sidebar-content js-simplebar">
        <a href="" className="sidebar-brand">
          <span className="align-middle">
            <img src="/img/loguito.png" alt="logo" style={{ width: "150px" }} />
          </span>
        </a>
        <ul className="sidebar-nav">
          <li className="sidebar-header">Administración</li>
          <li className="sidebar-item">
            <a href="" className="sidebar-link" title="Administrar perfiles">
              <i className="align-middle fas fa-list"></i>
              <span className="align-middle">Perfil</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="" className="sidebar-link" title="Administrar usuarios">
              <i className="align-middle fas fa-users"></i>
              <span className="align-middle">Usuarios</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="" className="sidebar-link" title="Administrar categorías">
              <i className="align-middle fas fa-list"></i>
              <span className="align-middle">Categorías</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="" className="sidebar-link" title="Administrar negocios">
              <i className="align-middle fas fa-list-alt"></i>
              <span className="align-middle">Negocios</span>
            </a>
          </li>
          <li className="sidebar-header">Mi Negocio</li>
          <li className="sidebar-item">
            <a href="" className="sidebar-link" title="Administrar mi negocio">
              <i className="align-middle fas fa-list-alt"></i>
              <span className="align-middle">Mi Negocio</span>
            </a>
          </li>

        </ul>
      </div>
    </div>
  );
};

export default Menu;
