import { Form, Modal } from "react-bootstrap";
import type { Business } from "../../interfaces/Business";

interface ModalLogoProps {
  business: Business;
  show: boolean;
  handleClose: () => void;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
}

const ModalLogo = ({
  business,
  show,
  handleClose,
  handleSubmit,
}: ModalLogoProps) => {
  return (
    <Modal show={show} size="lg" onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            Editar logo a <strong>{business?.name}</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section className="row">
            <div className="col-8">
              <div className="form-group">
                <label htmlFor="photo">Foto</label>
                <input
                  className="form-control"
                  id="photo"
                  name="photo"
                  type="file"
                />
              </div>
            </div>
          </section>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary">
            <i className="fas fa-upload"></i> Subir
          </button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalLogo;
