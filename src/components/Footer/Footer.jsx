import React from 'react'
import styles from "./FooterStyles.module.css"

function Footer() {
  return (
    <footer className={styles.footer}>
        <p>Made with ❤️ by Travdoodle</p>
        <p>© {new Date().getFullYear()} Travdoodle. All rights reserved.</p>
    </footer>
  )
}

export default Footer