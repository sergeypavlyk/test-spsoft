import Select from "@/components/ui/select";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Select component", () => {
  it("should render the placeholder and allow selecting an option", () => {
    const options = [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
    ];

    const { getByRole, getByText } = render(
      <Select options={options} placeholder="Choose an option" />
    );

    expect(getByText("Choose an option")).toBeInTheDocument();

    const selectElement = getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "1" } });

    expect(selectElement).toHaveValue("1");
    expect(getByText("Option 1")).toBeInTheDocument();
  });
});
