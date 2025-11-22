import Link from 'next/link';
import Hero from '@/components/home/hero/hero';
import Image from '@/components/home/Image/image';
import Service from '@/components/home/service/service';
import Steps from '@/components/home/steps/steps';
import Billing from '@/components/home/billing/billing';
import Testimonial from '@/components/home/testimonial/testimonial';
import Action from '@/components/home/action/action';
import Footer from '@/components/layout/footer/footer';

export default function Home() {
  return (
    <div >
      <section id="hero">
        <Hero />
      </section>
      <Image />
      <section id="services">
        <Service />
      </section>
      <Steps />
      <section id="pricing">
        <Billing />
      </section>
      <Testimonial />
      <Action />
      <Footer />
    </div>
  );
}