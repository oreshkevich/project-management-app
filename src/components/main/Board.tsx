import { useState, useEffect, useCallback } from 'react';
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
import { updateToastState } from '../../core/store/reducers/modalReducer';
import ToastNotification from '../modalWindows/ToastNotitfication';

const Board = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { id } = useParams();
  const { columns } = useAppSelector((state) => state.boardReducer);
  const [showCol, setShowCol] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const handleShow = () => setShowCol(true);

  const getAllColumn = useCallback(async () => {
    try {
      await dispatch(getColumnsCreator(String(id))).unwrap();
    } catch (error) {
      setMessage((error as CatchedError).message);
      dispatch(updateToastState(true));
    }

    setLoading(false);
  }, [id, dispatch]);

  useEffect(() => {
    getAllColumn();
  }, [getAllColumn]);

  return (
    <>
      {loading ? (
        <LoadingIcon />
      ) : (
        <section>
          <Button variant="success" onClick={handleShow} style={{ width: '100%' }}>
            {t('header.create-col__button')}
          </Button>
          {showCol && <FormColumn setShowCol={setShowCol} />}

          <div className="app-card-data pt-3">
            {columns.length
              ? columns.map((item: StateCol) => (
                  <Card column={item} key={item.id} getAllColumn={getAllColumn} />
                ))
              : null}
          </div>
        </section>
      )}
      <ToastNotification message={message} />
    </>
  );
};

export default Board;
