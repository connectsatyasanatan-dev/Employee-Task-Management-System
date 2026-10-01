import { AlertTriangle, Loader } from "lucide-react";
import Modal from "./Modal";

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // "danger" | "warning" | "primary"
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="460px">
      <div className="confirm-dialog-body">
        <div className={`confirm-icon-wrapper confirm-icon-${variant}`}>
          <AlertTriangle size={24} />
        </div>
        <p className="confirm-message">{message}</p>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className={`btn-${variant === "danger" ? "danger" : "primary"}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader size={16} className="spin" />
              <span>Processing...</span>
            </>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
