import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getColumnsCreator } from '../../core/store/creators/BoardCreators';
import { useTranslation } from 'react-i18next';
import Card from './Card';
import FormColumn from '../forms/formColumn/FormColumn';
import { StateCol } from '../../core/types/types';

import { useAppDispatch, useAppSelector } from '../../core/hooks/redux';
import { CatchedError } from '../../core/types/types';
import LoadingIcon from '../loading/LoadingIcon';

const Board = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { id } = useParams();
  const { columns } = useAppSelector((state) => state.boardReducer);
  const [showCol, setShowCol] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleShow = () => setShowCol(true);

  useEffect(() => {
    const getAllColumn = async () => {
      try {
        await dispatch(getColumnsCreator(String(id))).unwrap();
      } catch (error) {
        alert((error as CatchedError).message);
      }

      setLoading(false);
    };

    getAllColumn();
    (document.getElementById('root') as HTMLElement).style.maxHeight = '100vh';

    return () => {
      (document.getElementById('root') as HTMLElement).style.maxHeight = 'inherit';
    };
  }, [dispatch, id]);

  return (
    <>
      {loading ? (
        <LoadingIcon />
      ) : (
        <section className="columns content">
          {showCol && <FormColumn setShowCol={setShowCol} />}

          <div className="app-card-data over justify-content-start flex-nowrap">
            {columns.length
              ? columns.map((item: StateCol) => <Card column={item} key={item.id} />)
              : null}
            <Button className="create-column" variant="secondary" onClick={handleShow}>
              {t('header.create-col__button')}
            </Button>
          </div>
        </section>
      )}
    </>
  );
};

export default Board;
