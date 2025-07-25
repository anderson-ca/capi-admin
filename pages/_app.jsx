import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import Layout from "../components/Layout";
import { Theme } from "@radix-ui/themes";
import { PopUpProvider } from "../context/PopUp";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  // Wrap every page in the dashboard chrome
  return (
    <SessionProvider session={session}>
      <Theme>
        <PopUpProvider>
          <Layout>
            <Component {...pageProps} />
            <ToastContainer />
          </Layout>
        </PopUpProvider>
      </Theme>
    </SessionProvider>
  );
}
