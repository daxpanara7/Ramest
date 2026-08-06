/**
 * The message under an invalid field.
 *
 * `id` must be `${inputId}-error` — the input points at it through
 * aria-describedby (see `fieldAria`), so a screen reader reads the reason when
 * focus lands rather than leaving the user with a red border and no wording.
 *
 * role="alert" so the message is announced when it appears on blur, not only
 * when the field is next focused.
 */
export default function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) return null;
  return (
    <p id={id} className="field-error" role="alert">
      {message}
    </p>
  );
}
