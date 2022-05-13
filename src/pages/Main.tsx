import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Card from '../components/main/Card';
import FormColumn from '../components/formColumn/FormColumn';
import { useEffect, useState } from 'react';
import Board from '../components/main/Board';
import { getBoards, getColumns } from '../core/api/api';
import { BoardData } from '../core/types/types';

interface IColData {
  title: string;
  id: string;
  order: number;
}

export const Main = () => {
  const [showCol, setShowCol] = useState(false);
  const { t } = useTranslation();
  const handleShow = () => setShowCol(true);
  const [boards, setBoards] = useState<Array<BoardData>>();
  const [columns, setColumns] = useState<Array<IColData>>();

  async function getAllBoards() {
    const response = await getBoards();

    setBoards(response.data);

    console.log(response);
    localStorage.setItem('bardsId', response.data[0].id);
  }

  async function getAllColumn() {
    const response = await getColumns();
    setColumns(response.data);
    console.log(response.data);
  }

  useEffect(() => {
    getAllBoards();
    getAllColumn();
  }, []);

  return (
    <section className="main container pt-5">
      {boards?.map((item: BoardData) => (
        <Board data={item} key={item.id} />
      ))}
      <Button variant="success" onClick={handleShow}>
        {t('header.create-col__button')}
      </Button>
      {showCol ? <FormColumn setShowCol={setShowCol} /> : null}

      <div className="app-card-data">
        {columns?.map((item: IColData) => (
          <Card data={item} key={item.id} />
        ))}
      </div>
    </section>
  );
};
