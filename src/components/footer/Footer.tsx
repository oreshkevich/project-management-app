import React from 'react';
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__info">
          © {new Date().getFullYear()} Copyright Text | Developments:
          <a
            className="footer__link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/oreshkevich"
          >
            Henadzi
          </a>
          ,
          <a
            className="footer__link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/kerllsname"
          >
            Kirill
          </a>
          ,
          <a
            className="footer__link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/kvadratikk"
          >
            Uladzislava
          </a>
        </div>
        <a href="https://rs.school/" target="_blank" rel="noreferrer" className="footer__logo"></a>
      </div>
    </footer>
  );
}

export { Footer };
