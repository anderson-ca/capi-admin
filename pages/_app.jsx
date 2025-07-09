import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import Layout from "@/components/Layout";
import { Theme } from "@radix-ui/themes";
import { PopUpProvider } from "@/context/PopUp";

export default function MyApp({ Component, pageProps }) {
  // Wrap every page in the dashboard chrome
  return (
    <Theme>
      <PopUpProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PopUpProvider>
    </Theme>
  );
}
