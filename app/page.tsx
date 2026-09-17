import { getServices, getTherapists, getPrograms } from "@/lib/kv";
import SportMassageLanding from "@/components/landing/SportMassageLanding";

export default async function HomePage() {
  const services = await getServices();
  const therapists = await getTherapists();
  const programs = await getPrograms();

  return (
    <SportMassageLanding
      services={services}
      therapists={therapists}
      programs={programs}
    />
  );
}
