import type { KeyboardEvent } from "react";

const handleRowKeyDown = (
  event: KeyboardEvent<HTMLElement>,
  action: () => void
) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
};

export { handleRowKeyDown };
