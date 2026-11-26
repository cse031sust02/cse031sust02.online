import type { Profile } from "@/lib/content/schema";
import { About } from "./About";
import { Contact } from "./Contact";
import { Credentials } from "./Credentials";
import { Experience } from "./Experience";
import { Hero } from "./Hero";
import { Products } from "./Products";
import { Skills } from "./Skills";
import { TwinTeaser } from "./TwinTeaser";

/** All home-page sections, in order, rendered from a profile. */
export function HomeSections({ profile }: { profile: Profile }) {
  return (
    <>
      <Hero profile={profile} />
      <About profile={profile} />
      <Experience profile={profile} />
      <Products profile={profile} />
      <Skills profile={profile} />
      <TwinTeaser profile={profile} />
      <Credentials profile={profile} />
      <Contact profile={profile} />
    </>
  );
}
