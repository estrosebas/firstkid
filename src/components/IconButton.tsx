import React from "react";

type Props = {
  imgSrc: string;
  label: string;
  onClick?: () => void;
};

export default function IconButton({ imgSrc, label, onClick }: Props) {
  return (
    <button onClick={onClick} className="icon-button">
      <div className="icon-card">
        <img src={imgSrc} alt={label} />
      </div>
      <div className="icon-label">{label}</div>
    </button>
  );
}
