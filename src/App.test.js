import { render, screen } from "@testing-library/react";
import App from "./App";

test("lists the routes that can be opened for Figma export", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { name: "Halaman Klinik" })
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Riwayat Billing" })).toHaveAttribute(
    "href",
    "/cashier/riwayat-billing"
  );
  expect(screen.getByRole("link", { name: "Form SOAP" })).toHaveAttribute(
    "href",
    "/doctor/form-soap"
  );
  expect(screen.getAllByRole("link")).toHaveLength(17);
});
