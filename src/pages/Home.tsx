import '../App.css';
import img from '../assets/images/main.webp';

const Home = () => {
  return (
    <section className="home">
      <div className="row">
        <div className="col-lg-5 offset-lg-1 order-2 hero-image">
          <img src={img} className="img-fluid" alt="main" />
        </div>
        <div className="col-lg-5">
          <h1 className=" home__title">GoodBoard helps teams to solve work tasks efficiently.</h1>
          <p className="home__text">
            Work in a team, manage projects, write notes and assignments, go to the store and not
            only. Our interactive whiteboard will help you with all this
          </p>

          <a
            href="/signup"
            type="submit"
            data-analytics-button="greenSignupHeroButton"
            className="btn btn-wrap btn-primary btn-block px-4"
          >
            Register&nbsp;— it is free!
          </a>
        </div>
      </div>
    </section>
  );
};

export { Home };
