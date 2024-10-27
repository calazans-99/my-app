"use client";
import Image from 'next/image';
import { useState } from "react";
import styled from "styled-components";

export default function Cabecalho() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => {
    setActiveModal(null);
  };

  const openModal = (modal: string) => {
    setActiveModal(modal);
  };

  return (
    <header className="cabecalho">
      <div className='logo-container'>
        <Image 
          className='cabecalho-logo'
          src={'/assets/globo.png'}  
          alt={'logo'} 
          width={200} 
          height={200} 
        />
        <h3>ANÁLISE E DESENVOLVIMENTO<br />DE SISTEMAS</h3>
      </div>

      <nav className="info">
        <button onClick={() => openModal("checkpoint")}>Checkpoint</button>
        <button onClick={() => openModal("challenge")}>Challenge</button>
        <button onClick={() => openModal("globalSolution")}>Global Solution</button>
      </nav>

      {activeModal === "checkpoint" && (
        <Modal onClose={closeModal} title="Checkpoint">
          <p>Avaliações intermediárias para acompanhamento do progresso</p>
        </Modal>
      )}
      {activeModal === "challenge" && (
        <Modal onClose={closeModal} title="Challenge">
          <p>Avaliações em formato de desafios, com foco em resolução de problemas com entregas programadas</p>
        </Modal>
      )}
      {activeModal === "globalSolution" && (
        <Modal onClose={closeModal} title="Global Solution">
          <p>Projetos ou avaliações integradoras, que envolvem a aplicação global dos conhecimentos adquiridos</p>
        </Modal>
      )}
    </header>
  );
}

interface ModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, title, children }) => {
  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Fechar Modal">X</CloseButton>
        <h2>{title}</h2>
        {children}
      </ModalContent>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #0e0e0e;
  color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;
