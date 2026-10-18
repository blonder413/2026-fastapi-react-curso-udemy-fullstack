import { useState } from 'react';
import { Modal } from 'react-bootstrap';

interface CustomImageProps {
  imagenUrl: string;
  titulo?: string;
  children: React.ReactNode;
}

const CustomImage = ({
  imagenUrl,
  titulo = "Vista previa",
  children,
}: CustomImageProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);


  return (
    <>
      {/* Elemento que activará el modal (puede ser cualquier cosa) */}
      <button className='btn btn-sm' onClick={handleShow} style={{ cursor: 'pointer' }}>
        {children}
      </button>

      {/* Modal para mostrar la imagen */}
      <Modal show={showModal} onHide={handleClose} centered size="sm">
        <Modal.Header closeButton />
        <Modal.Body className="text-center">
          <img
            src={imagenUrl}
            alt={titulo}
            className="img-fluid"
            style={{ maxHeight: '70vh' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomImage;
