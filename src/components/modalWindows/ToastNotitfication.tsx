import { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../core/hooks/redux';
import { updateToastState } from '../../core/store/reducers/modalReducer';
import { FcHighPriority, FcApproval } from 'react-icons/fc';

const ToastNotification = (props: { message: string }) => {
  const SHOWTIME = 4000;

  const [show, setShow] = useState(false);
  const [isError, setError] = useState(false);

  const state = useAppSelector((state) => state.modalStateReducer.state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const changeState = () => dispatch(updateToastState(false));
    setShow(state);
    setTimeout(changeState, SHOWTIME);
  }, [state, dispatch]);

  useEffect(() => {
    if (
      props.message != 'User was created' &&
      props.message != 'Profile was edited' &&
      props.message != 'Profile was deleted'
    ) {
      setError(true);
    } else setError(false);
  }, [props.message]);

  return (
    <>
      {props.message ? (
        <ToastContainer className="p-3" position={'bottom-end'}>
          <Toast onClose={() => setShow(false)} show={show} delay={SHOWTIME} autohide>
            <Toast.Header closeButton={false}>
              {isError ? <FcHighPriority /> : <FcApproval />}
              <strong className="me-auto">{isError ? 'Error' : 'Message'}</strong>
              <small>now</small>
            </Toast.Header>
            <Toast.Body>{props.message}</Toast.Body>
          </Toast>
        </ToastContainer>
      ) : null}
    </>
  );
};

export default ToastNotification;
