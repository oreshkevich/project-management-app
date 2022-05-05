import { useTranslation } from 'react-i18next';
import '../App.css';
import img from '../assets/images/sections/main.webp';

const Home = () => {
  const { t } = useTranslation();

  return (
    <section className="container content home d-flex align-items-center">
      <div className="row">
        <div className="col-lg-5 offset-lg-1 order-2 hero-image">
          <img src={img} className="img-fluid" alt="main" />
        </div>
        <div className="col-lg-5">
          <h1 className=" home__title">{t('homepage.welcome-block__title')}</h1>
          <p className="home__text">{t('homepage.welcome-block__title-description')}</p>

          <a
            href="/signup"
            type="submit"
            data-analytics-button="greenSignupHeroButton"
            className="btn btn-wrap btn-primary btn-block px-4"
          >
            {t('homepage.welcome-block__button')}
          </a>
        </div>
      </div>
    </section>
  );
};

export { Home };
