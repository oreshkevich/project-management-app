import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { getUser } from '../../core/api/api';
import { ITaskData } from '../../core/interfaces/interfaces';
import './modal.css';

const TaskInformationModal = (props: { task: ITaskData; show: boolean; onHide: () => void }) => {
  const [user, setUser] = useState();

  async function getUserName() {
    const response = await getUser(props.task.userId);

    setUser(response.data.name);
  }

  useEffect(() => {
    getUserName();
  }, []);

  return (
    <Modal
      show={props.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="modal"
      centered
      scrollable
    >
      <Modal.Header closeButton={false}>
        <Modal.Title id="contained-modal-title-vcenter">{props.task.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Author: {user}</p>
        <p>Description:</p>
        <p>{props.task.description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskInformationModal;
