import { ChapterHud } from "@/components/layout/ChapterHud";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { ScrollRefresh } from "@/components/providers/ScrollRefresh";
import { Particles } from "@/components/fx/Particles";
import { ArticlesFeature } from "@/components/sections/ArticlesFeature";
import { Download } from "@/components/sections/Download";
import { Field } from "@/components/sections/Field";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Philippines } from "@/components/sections/Philippines";
import { Problem } from "@/components/sections/Problem";
import { ProductMoment } from "@/components/sections/ProductMoment";
import { QrDownload } from "@/components/sections/QrDownload";
import { QuickSearch } from "@/components/sections/QuickSearch";
import { SearchFaster } from "@/components/sections/SearchFaster";
import { Showcase } from "@/components/sections/Showcase";
import { TablesFeature } from "@/components/sections/TablesFeature";
import { WhyPocketPec } from "@/components/sections/WhyPocketPec";

export default function Page() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Problem />
        <SearchFaster />
        <Showcase />
        <ArticlesFeature />
        <TablesFeature />
        <QuickSearch />
        <Field />
        <ProductMoment />
        <WhyPocketPec />
        <Philippines />
        <Download />
        <QrDownload />
        <FinalCta />
      </main>
      <Footer />
      <ChapterHud />
      <Particles />
      <div className="fx-grain" aria-hidden />
      <ScrollRefresh />
    </>
  );
}
