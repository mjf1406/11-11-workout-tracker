import "~/styles/globals.css";
import { ClerkProvider, GoogleOneTap } from "@clerk/nextjs";
import { poppins } from "./fonts";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme/theme-provider";
import { APP_NAME } from "~/lib/constants";
import ReactQueryProvider from "./providers";

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
            <ReactQueryProvider>
              <GoogleOneTap />
              <main>{children}</main>
              <Toaster />
            </ReactQueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
