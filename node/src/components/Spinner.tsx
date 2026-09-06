import React from "react";

interface SpinnerProps {
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ text }) => (
  <div className="text-center my-4">
    <output className="spinner-border text-warning" aria-label="Cargando...">
      <span className="visually-hidden">Cargando...</span>
    </output>
    {text && <div>{text}</div>}
  </div>
);

export default Spinner;
