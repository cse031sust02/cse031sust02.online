import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HomeSections } from "@/components/sections/HomeSections";
import { getProfile } from "@/lib/content/load-profile";

export default function Home() {
  const profile = getProfile();
  return (
    <>
      <SiteHeader handle={profile.basics.handle} />
      <main id="main" className="mx-auto flex max-w-5xl flex-col gap-10 px-4 pb-16">
        <HomeSections profile={profile} />
      </main>
      <SiteFooter profile={profile} />
    </>
  );
}
