import Layout from "@theme/Layout";
import type { ReactNode } from "react";

import { FeatureGrid, HomeHero, PackageGrid } from "../components";

/** Page d'accueil de la documentation : présentation des trois packages publiés. */
export default function Home(): ReactNode {
  return (
    <Layout>
      <HomeHero />
      <main>
        <PackageGrid />
        <FeatureGrid />
      </main>
    </Layout>
  );
}
