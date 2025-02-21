import React from 'react'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'
import styles from "./DashboardStyles.module.css"

function Dashboard() {
  return (
    <div className={styles.container}>
        <Header/>
        <Footer/>
    </div>
  )
}

export default Dashboard