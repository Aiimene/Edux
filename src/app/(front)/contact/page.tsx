import ContactForm from '@/components/contact/contactForm';
import ContactInfo from '@/components/contact/contactInfo';
import Footer from '@/components/layout/footer/footer';
import styles from './contact.module.css';
import styles2 from '@/components/home/service/service.module.css';

export default function Contact() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles2.title}>تواصل معنا</h1>
          <p className={styles2.subtitle}>
            نحن هنا لمساعدتك. أرسل لنا رسالتك وسنرد عليك في أقرب وقت ممكن.
          </p>
        </div>
        
        <div className={styles.content}>
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
      <Footer />
    </>
  );
}

