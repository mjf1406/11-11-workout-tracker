import "~/styles/globals.css";
import { ClerkProvider, GoogleOneTap } from "@clerk/nextjs";
import { poppins } from "./fonts";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme/theme-provider";
import { APP_NAME } from "~/lib/constants";

export const metadata = {
  title: APP_NAME,
  description: "Random 11-11 workouts offloads routine planning",
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
            <GoogleOneTap />
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
