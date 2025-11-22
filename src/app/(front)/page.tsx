import Link from 'next/link';
import Hero from '@/components/home/hero/hero';
import Image from '@/components/home/Image/image';
import Service from '@/components/home/service/service';
import Steps from '@/components/home/steps/steps';

export default function Home() {
  return (
    <div >
      <Hero />
      <Image />
      <Service />
      <Steps />
    </div>
  );
}