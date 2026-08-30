import { useRouteError } from "react-router-dom";

const Error405 = () => {
  const error = useRouteError();

  let errorMessage = "Error desconocido";

  if (error instanceof Response) {
    errorMessage = `Error ${error.status}: ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  return (
    <main className="content text-center">
      <div className="container p-0">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item" aria-current="page">
              Ocurrió un error inesperado (500)
            </li>
          </ol>
        </nav>
        <h1 className="h3 mb-3">{errorMessage}</h1>
        <div className="row">
          <div className="col-12 col-lg-12  d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <h5 className="card-title mb-0"> </h5>
              </div>
              <div className="card-body">
                <img src="/img/404.png" alt="404" width="25%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Error405;
