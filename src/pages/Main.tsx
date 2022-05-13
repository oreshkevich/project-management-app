import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Card from '../components/main/Card';
import FormColumn from '../components/formColumn/FormColumn';
import { useEffect, useState } from 'react';
import Board from '../components/main/Board';
import { getBoards, getColumns } from '../core/api/api';
import { BoardData } from '../core/types/types';

export const Main = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [boards, setBoards] = useState<Array<BoardData>>();

  // async function getAllBoards() {
  //   const response = await getBoards();

  //   setBoards(response.data);
  //   console.log(response.data);
  // }
  // async function getAllColumn() {
  //   const response = await getColumns();

  //   console.log(response.data);
  // }

  // useEffect(() => {
  //   getAllBoards();
  //   getAllColumn();
  // }, []);

  return (
    <section className="main container pt-5">
      {boards?.map((item: BoardData) => (
        <Board data={item} key={item.id} />
      ))}
      <Button variant="success" onClick={handleShow}>
        {t('header.create-col__button')}
      </Button>
      {show ? <FormColumn setShow={setShow} /> : null}
      <Card />
    </section>
  );
};
