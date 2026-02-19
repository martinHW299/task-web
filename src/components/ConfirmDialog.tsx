import { Modal } from "./Modal";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal title={title} open={open} onClose={onCancel}>
      {description ? <p className="confirmDesc">{description}</p> : null}
      <div className="confirmActions">
        <button type="button" className="taskButton" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </button>
        <button type="button" className="taskButton taskButtonDanger" onClick={onConfirm} disabled={loading}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

