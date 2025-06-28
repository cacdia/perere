import MapaIndex from '@/components/mapa/mapa-index';
import { andaresDoCI } from '@/lib/saci/saciUtils';

export default async function Home() {
  const andares = await andaresDoCI();
  return (
    <>
      <MapaIndex andares={andares} />
    </>
  );
}
