import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { poppins } from "./fonts";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme/theme-provider";
import { APP_NAME } from "~/lib/constants";

export const metadata = {
  title: APP_NAME,
  description:
    "Reduce the amount of time and tedium on making your report cards.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${poppins.className}`}>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
