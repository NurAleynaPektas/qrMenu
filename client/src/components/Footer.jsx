import React from "react";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        {/* SOL TARAF — QrMenu */}
        <div className={s.left}>
          <p className={s.brand}>QrMenu © {new Date().getFullYear()}</p>
        </div>

        {/* SAĞ TARAF — Made by + Icons */}
        <div className={s.right}>
          <p className={s.made}>
            Made by <span>Nur Aleyna PEKTAŞ</span>
          </p>

          <div className={s.icons}>
            {/* MAIL ICON */}
            <a href="mailto:nuraleynaaaa@gmail.com" className={s.iconLink}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={s.icon}
                viewBox="0 0 24 24"
              >
                <path
                  d="M20 4H4C2.9 4 2 4.9 2 6v12c0 
                1.1.9 2 2 2h16c1.1 0 2-.9 
                2-2V6c0-1.1-.9-2-2-2zm0 
                4-8 5-8-5V6l8 5 8-5v2z"
                />
              </svg>
            </a>

            {/* GITHUB ICON */}
            <a
              href="https://github.com/NurAleynaPektas"
              target="_blank"
              rel="noreferrer"
              className={s.iconLink}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={s.icon}
              >
                <path
                  d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 
                3.29 9.38 7.86 10.9.58.11.79-.25.79-.56v-2.02c-3.2.69-3.87-1.54-3.87-1.54-.53-1.37-1.3-1.74-1.3-1.74-1.06-.73.08-.72.08-.72 
                1.17.08 1.79 1.21 1.79 1.21 1.04 1.79 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 
                0-1.26.45-2.3 1.19-3.11-.12-.29-.52-1.45.11-3.02 0 
                0 .97-.31 3.18 1.19a10.9 10.9 0 
                0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19.64 
                1.57.24 2.73.12 3.02.74.81 1.18 1.85 1.18 3.11 
                0 4.43-2.68 5.41-5.24 5.7.42.36.8 1.08.8 
                2.18v3.23c0 .31.21.68.8.56A10.99 10.99 
                0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"
                />
              </svg>
            </a>

            {/* LINKEDIN ICON */}
            <a
              href="https://www.linkedin.com/in/nur-aleyna-pekta%C5%9F-16b401332/"
              target="_blank"
              rel="noreferrer"
              className={s.iconLink}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={s.icon}
                viewBox="0 0 24 24"
              >
                <path
                  d="M20.45 20.45h-3.55v-5.55c0-1.32-.03-3.02-1.84-3.02-1.85 
                0-2.13 1.44-2.13 2.92v5.65H9.38V9h3.41v1.56h.05c.48-.9 
                1.65-1.84 3.39-1.84 3.63 0 4.3 2.39 
                4.3 5.5v6.23zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 
                2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.57V9h3.55v11.45z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
