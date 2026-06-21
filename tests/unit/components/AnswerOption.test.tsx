import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AnswerOption from "@/components/quiz/AnswerOption";

describe("AnswerOption", () => {
  it("applies selected styling and handles clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<AnswerOption label="Option A" selected={false} onClick={onClick} />);

    const button = screen.getByRole("button", { name: "Option A" });
    expect(button).toHaveClass("answer-option");
    expect(button).not.toHaveClass("answer-option--selected");

    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("applies review state classes", () => {
    const { rerender } = render(
      <AnswerOption label="Correct choice" selected={false} correct onClick={() => {}} />
    );

    expect(screen.getByRole("button")).toHaveClass("answer-option--correct");

    rerender(
      <AnswerOption label="Wrong choice" selected correct={false} incorrect onClick={() => {}} />
    );
    expect(screen.getByRole("button")).toHaveClass("answer-option--incorrect");

    rerender(<AnswerOption label="Chosen" selected onClick={() => {}} />);
    expect(screen.getByRole("button")).toHaveClass("answer-option--selected");
  });

  it("respects disabled state", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<AnswerOption label="Locked" selected={false} disabled onClick={onClick} />);

    const button = screen.getByRole("button", { name: "Locked" });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
