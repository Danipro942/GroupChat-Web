import { Box, Modal } from "@mui/material";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  handleModel: (open: boolean) => void;
  open: boolean;
};

const ModalComponent = ({ children, handleModel, open }: Props) => {
  const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    bgcolor: "var(--primary-color)",
    border: "2px solid var(--primary-color)",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    <Modal
      open={open}
      onClose={() => handleModel(open)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box>
        <Box sx={{ ...styleModal }}>{children}</Box>
      </Box>
    </Modal>
  );
};

export default ModalComponent;
