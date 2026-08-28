const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row text-muted">
          <div className="col-12 text-center">
            <p className="mb-0">
              &copy; Todos los derechos reservados {new Date().getFullYear()}|
              Desarrollado por{" "}
              <a
                className="text-muted"
                href="https://blonder413.wordpress.com/"
                target="_blank"
                title="Jonathan Morales"
              >
                <strong>Jonathan Morales</strong>
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
