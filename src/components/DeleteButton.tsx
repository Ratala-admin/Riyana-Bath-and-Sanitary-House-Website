"use client";

interface DeleteButtonProps {
  action: (formData: FormData) => Promise<void>;
  id: number;
  label?: string;
  confirmText?: string;
  className?: string;
}

export default function DeleteButton({
  action,
  id,
  label = "Delete",
  confirmText = "Are you sure?",
  className,
}: DeleteButtonProps) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={className}
        onClick={(e) => {
          if (!confirm(confirmText)) {
            e.preventDefault();
          }
        }}
      >
        {label}
      </button>
    </form>
  );
}
