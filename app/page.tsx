import styles from "./page.module.css"; // Import the CSS module

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <header className={styles.hero}>
        <div className="container mx-auto">
          <h1 className={styles["hero-title"]}>
            Manage Your Condo Issues Effortlessly with Properly
          </h1>
          <p className={styles["hero-text"]}>
            Properly helps condo managers and tenants report, track, and resolve
            issues in real-time. Stay on top of tasks and keep your condo
            running smoothly.
          </p>
          <a href="/signup" className={styles["cta-button"]}>
            Get Started Now
          </a>
        </div>
      </header>
      <section className={styles["features-section"]}>
        <h2 className={styles["features-title"]}>How Properly Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className={styles.feature}>
            <i id="icon" className="fa-regular fa-flag fa-2xl"></i>
            <h3 className={styles["feature-title"]}>Easy Issue Reporting</h3>
            <p className={styles["feature-text"]}>
              Tenants can report problems with a message or photo, directly from
              the app—whether it&apos;s a broken AC or a dirty hallway.
            </p>
          </div>
          <div className={styles.feature}>
            <i id="icon" className="fa-regular fa-clock fa-2xl"></i>
            <h3 className={styles["feature-title"]}>Real-Time Tracking</h3>
            <p className={styles["feature-text"]}>
              Tenants can see live updates as property managers work on the
              problem, ensuring full transparency.
            </p>
          </div>
          <div className={styles.feature}>
            <i id="icon" className="fa-solid fa-list-check fa-2xl"></i>
            <h3 className={styles["feature-title"]}>
              Task Management for Managers
            </h3>
            <p className={styles["feature-text"]}>
              Property managers receive notifications, manage tasks by urgency,
              and assign workers to fix issues seamlessly.
            </p>
          </div>
        </div>
      </section>
      <section className={styles["cta-section"]}>
        <h2 className={styles["cta-title"]}>
          Make Condo Management Effortless with Properly
        </h2>
        <p className={styles["cta-text"]}>
          Whether you&apos;re a tenant reporting an issue or a property manager
          fixing it, Properly is the tool you need for streamlined condo
          management.
        </p>
        <a href="/signup" className={styles["cta-signup-button"]}>
          Sign Up Today
        </a>
      </section>
    </div>
  );
}
