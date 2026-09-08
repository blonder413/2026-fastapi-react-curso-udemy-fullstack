import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

export interface CustomAlertInterface {
  state: boolean;
  title: string;
  detail: string;
  onClose?: () => void;
  onConfirm?: () => void;
  headerBg?: string;
  isConfirm?: boolean;
  confirmText?: string;
  cancelText?: string;
}

const CustomAlert = (data: CustomAlertInterface) => {
  const [show, setShow] = useState(data.state);

  const handleClose = () => {
    setShow(false);
    data.onClose?.();
  };

  const handleConfirm = () => {
    setShow(false);
    data.onConfirm?.();
  };

  const headerClass = data.headerBg ? data.headerBg : "bg-primary";
  const confirmText = data.confirmText ?? "Aceptar";
  const cancelText = data.cancelText ?? "Cancelar";

  useEffect(() => {
    setShow(data.state);
  }, [data.state]);

  return (
    <Modal onHide={handleClose} show={show} size="sm">
      <Modal.Header
        closeButton
        className={headerClass}
        style={{ borderBottom: "none" }}
      >
        <Modal.Title className="text-white">{data.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">{data.detail}</div>
      </Modal.Body>
      <Modal.Footer>
        {data.isConfirm && (
          <Button onClick={handleClose} title={cancelText} variant="secondary">
            {cancelText}
          </Button>
        )}
        <Button
          onClick={data.isConfirm ? handleConfirm : handleClose}
          variant="primary"
        >
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomAlert;
