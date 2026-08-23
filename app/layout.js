import "./globals.css";

export const metadata = {
  title: "Mis Finanzas",
  description: "Control personal de ingresos, gastos y ahorros",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}