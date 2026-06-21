import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Input from "@/components/ui/Input";

describe("Input", () => {
  it("renders an input without a label", () => {
    render(<Input id="email" placeholder="Enter email" />);

    expect(screen.getByPlaceholderText("Enter email")).toHaveClass("input");
    expect(screen.queryByRole("label")).not.toBeInTheDocument();
  });

  it("renders a label linked to the input", () => {
    render(<Input id="name" label="Name" />);

    expect(screen.getByLabelText("Name")).toHaveAttribute("id", "name");
  });

  it("forwards input props and handles typing", async () => {
    const user = userEvent.setup();
    render(<Input id="search" aria-label="Search" />);

    const input = screen.getByRole("textbox", { name: "Search" });
    await user.type(input, "hello");

    expect(input).toHaveValue("hello");
  });
});
