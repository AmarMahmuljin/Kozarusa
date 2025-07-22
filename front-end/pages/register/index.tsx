import Header from "@components/header/header";
import RegisterForm from "@components/register/registerForm";
import Head from "next/head";

const Register: React.FC = () => {
  return (
    <>
      <Head>
        <title>User Signup</title>
      </Head>
      <Header />
        <main>
            <RegisterForm />
        </main>
    </>
  );
};

export default Register;