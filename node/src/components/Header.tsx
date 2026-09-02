const Header = () => {
  return (
    <nav className="navbar navbar-expand navbar-light navbar-bg">
      <a className="sidebar-toggle js-sidebar-toggle">
        <i className="fas fa-long-arrow-alt-left"></i>
      </a>

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
            <a className="nav-link d-none d-sm-inline-block">fecha</a>
            <a className="nav-link d-none d-sm-inline-block">
              <span className="text-dark">|</span>
            </a>
            <a className="nav-link d-none d-sm-inline-block">reloj</a>
            <a className="nav-link d-none d-sm-inline-block">
              <span className="text-dark">|</span>
            </a>
            <a className="nav-link d-none d-sm-inline-block">perfil</a>
            <a className="nav-link d-none d-sm-inline-block">
              <span className="text-dark">|</span>
            </a>
            <a
              className="nav-link dropdown-toggle d-none d-sm-inline-block"
              href="#"
              data-bs-toggle="dropdown"
            >
              <span className="text-dark">nombre</span>
              <img
                src="/img/perfil.png"
                className="avatar img-fluid rounded me-1"
              />
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              <a className="dropdown-item" title="Cerrar sesión">
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>{" "}
                Cerrar sesión
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
