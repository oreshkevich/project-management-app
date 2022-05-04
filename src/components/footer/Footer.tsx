import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__info">
          © {new Date().getFullYear()} Copyright Text | Developments:&nbsp;
          <a
            className="footer__link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/oreshkevich"
          >
            Henadzi
          </a>
          ,&nbsp;
          <a
            className="footer__link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/kerllsname"
          >
            Kirill
          </a>
          ,&nbsp;
          <a
            className="footer__link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/kvadratikk"
          >
            Uladzislava
          </a>
        </p>
        <a href="https://rs.school/" target="_blank" rel="noreferrer" className="footer__logo"></a>
      </div>
    </footer>
  );
}

export default Footer;
