import Link from 'next/link';
import styles from './page.module.css';
import Hero from '@/components/home/hero/hero';
import Image from '@/components/home/Image/image';
import Service from '@/components/home/service/service';
export default function Home() {
  return (
    <div className={styles.container}>
      <Hero />
      <Image />
      <Service />
    </div>
  );
}