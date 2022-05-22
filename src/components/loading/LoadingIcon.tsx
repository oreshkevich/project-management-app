import { Spinner } from 'react-bootstrap';

const LoadingIcon = () => {
  return (
    <div className="content d-flex justify-content-center mt-5 pt-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingIcon;
