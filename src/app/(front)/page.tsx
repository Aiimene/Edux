import Link from 'next/link';
import styles from './page.module.css';
import Hero from '@/components/home/hero/hero';

export default function Home() {
  return (
    <div className={styles.container}>
      <Hero />

    </div>
  );
}