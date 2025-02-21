import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../AuthStore/AuthStore';
import styles from "./LoginStyles.module.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const initialValues = {
    email: '',  // Change from email to identifier
    password: '',
    };


  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await login(values, navigate); // Pass navigate to login
    } catch (error) {
      console.error('Error occurred:', error);
    }
    
    setSubmitting(false);
    resetForm();
  };

  return (
    <div className={styles.loginContainer}> {/* Updated class name */}
      <div className={styles.header}>
              <div className={styles.logo}>Travdoodle</div>
              <Link to="/sign-up">
                <button className={styles.loginButton}>Sign Up</button>
              </Link>
            </div>
      <h2 className={styles.loginTitle}>Login</h2> {/* Updated class name */}
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className={styles.loginForm}> {/* Updated class name */}
            <div className={styles.formField}>
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" className={styles.formInput} />{/* Updated class name */}
              <ErrorMessage name="email" component="div" className={styles.errorMessage} />
            </div>
            <div className={styles.formField}>
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" className={styles.formInput} /> {/* Updated class name */}
              <ErrorMessage name="password" component="div" className={styles.errorMessage} />
            </div>
            <button type="submit" disabled={isSubmitting} className={styles.formButton}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
      <div className={styles.signupLink}>
        Don't have an account? <Link to="/sign-up">Sign up</Link>
      </div>
      <footer className={styles.footer}>
              <p>Made with ❤️ by Travdoodle</p>
              <p>© {new Date().getFullYear()} Travdoodle. All rights reserved.</p>
        </footer>
    </div>
  );
}

export default Login;
