import "jquery";
import "bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";

import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../customStyle.scss";
import "../style/css/feather.css";
import "../style/css/line-awesome.min.css";
import "../style/icons/tabler-icons/webfont/tabler-icons.css";
import "../style/icons/fontawesome/css/fontawesome.min.css";
import "../style/icons/fontawesome/css/all.min.css";
import "../style/fonts/feather/css/iconfont.css";
import BootstrapJs from "../components/bootstrap-js/bootstrapjs";
import { AuthProvider } from "../contexts/AuthContext";

export const metadata = {
  title: "SIDA - Super Admin Dashboard",
  description:
    "SIDA is POS System for businesses, offering seamless invoicing, project tracking, and estimates.",
  keywords:
    "super admin dashboard, admin dashboard, invoicing, business management, POS system",
  author: "SIDA Technologies",
  icons: {
    icon: "favicon.svg",
    shortcut: "favicon.svg", // Add shortcut icon for better support
    apple: "favicon.svg", // Optional: for Apple devices (place in `public/`)
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <>{children}</>
          <BootstrapJs />
        </AuthProvider>
      </body>
    </html>
  );
}
