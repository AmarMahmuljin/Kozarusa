import Head from 'next/head';
import Header from '@components/header/header';
import styles from '@styles/home.module.css';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>test</title>
        <meta name="description" content="Kozarusa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main className={styles.main}>
        <span>
          <h1>Welcome!</h1>
        </span>

        <div className={styles.description}>
          <p>
            test test
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;