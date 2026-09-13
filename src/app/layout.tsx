import "./globals.css";

export const metadata = {
  title: "Agri AI Farm Manager",
  description: "Your Personal AI Farm Manager",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
