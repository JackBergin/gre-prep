import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Button from "@/components/ui/Button";

describe("Button", () => {
  it("renders children and forwards click handlers", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button variant="ghost" size="sm" onClick={onClick}>
        Start drill
      </Button>
    );

    const button = screen.getByRole("button", { name: "Start drill" });
    expect(button).toHaveClass("btn", "btn--ghost");

    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
