import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <title>sealed unit survey</title>
          <link
            rel="icon"
            type="image/png"
            href="/favicon-96x96.png?v=20260421"
            sizes="96x96"
          />
          <link
            rel="icon"
            type="image/svg+xml"
            href="/favicon.svg?v=20260421"
          />
          <link rel="shortcut icon" href="/favicon.ico?v=20260421" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png?v=20260421"
          />
          <meta name="apple-mobile-web-app-title" content="usurvey" />
          <link rel="manifest" href="/site.webmanifest?v=20260421" />
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
