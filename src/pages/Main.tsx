import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Card from '../components/card/Card';
import FormBoardCol from '../components/formBoardCol/FormBoardCol';

export const Main = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  return (
    <section className="main container pt-5">
      <Button variant="success" onClick={handleShow}>
        {t('header.create-col__button')}
      </Button>
      {show ? <FormBoardCol setShow={setShow} /> : null}
      <Card />
    </section>
  );
};
