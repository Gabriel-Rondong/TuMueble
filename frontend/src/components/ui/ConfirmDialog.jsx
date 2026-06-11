import Modal from "./Modal"

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Confirmar", danger = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-tm-muted text-sm leading-relaxed mb-5">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={() => { onConfirm(); onClose() }}
          className={`flex-1 text-sm py-2.5 rounded-lg font-semibold transition-colors ${
            danger
              ? "bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25"
              : "btn-gold"
          }`}
        >
          {confirmLabel}
        </button>
        <button
          onClick={onClose}
          className="flex-1 btn-ghost text-sm border border-tm-border py-2.5"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  )
}