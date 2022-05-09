import { useTranslation } from 'react-i18next';
import '../App.css';
import img from '../assets/images/sections/main.webp';

export const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      <section className="home container pt-5">
        <div className="row">
          <div className="col-lg-5 offset-lg-1 order-2 hero-image">
            <img src={img} className="img-fluid" alt="main" />
          </div>
          <div className="col-lg-5">
            <h1 className="home__title">{t('homepage.welcome-block__title')}</h1>
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
      <section className="team container pt-5">
        <h2 className="team__title">{t('homepage.team-block__title')}</h2>
        <div className="row">
          <div className="card mb-3 profile-card" style={{ width: '840px' }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img src="#" className="card-img-top rounded-start" alt="profile-img" />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{t('homepage.team-block__Henadzi-name')}</h5>
                  <p className="card-text">{t('homepage.team-block__Henadzi-description')}</p>
                  <p className="card-text">
                    <small className="text-muted">{t('homepage.team-block__Henadzi-role')}</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card mb-3 profile-card" style={{ width: '840px' }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img src="#" className="card-img-top rounded-start" alt="profile-img" />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{t('homepage.team-block__Kirill-name')}</h5>
                  <p className="card-text">{t('homepage.team-block__Kirill-description')}</p>
                  <p className="card-text">
                    <small className="text-muted">{t('homepage.team-block__Kirill-role')}</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card mb-3 profile-card" style={{ width: '840px' }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img src="#" className="card-img-top rounded-start" alt="profile-img" />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{t('homepage.team-block__Uladzislava-name')}</h5>
                  <p className="card-text">{t('homepage.team-block__Uladzislava-description')}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      {t('homepage.team-block__Uladzislava-role')}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container pt-5">
        <h2 className="team__title">{t('homepage.course-block__title')}</h2>
        <p>{t('homepage.course-block__about')}</p>
      </section>
    </>
  );
};
