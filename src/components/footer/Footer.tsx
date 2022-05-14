import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './footer.css';

const Footer = () => {
  const { t } = useTranslation();

  const [scroll, setScroll] = useState(false);

  const handleScroll = () => {
    window.scrollY > 56 ? setScroll(true) : setScroll(false);
  };

  window.addEventListener('scroll', handleScroll);

  return (
    <footer className={scroll ? 'footer scroll' : 'footer'}>
      <div className="footer__content">
        <p className="footer__info">
          © {new Date().getFullYear()} {t('footer.footer-text')}:&nbsp;
          <a
            className="footer__link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/oreshkevich"
          >
            {t('footer.team-Henadzi')}
          </a>
          ,&nbsp;
          <a
            className="footer__link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/kerllsname"
          >
            {t('footer.team-Kirill')}
          </a>
          ,&nbsp;
          <a
            className="footer__link"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/kvadratikk"
          >
            {t('footer.team-Uladzislava')}
          </a>
        </p>
        <a href="https://rs.school/" target="_blank" rel="noreferrer" className="footer__logo"></a>
      </div>
    </footer>
  );
};

export default Footer;
