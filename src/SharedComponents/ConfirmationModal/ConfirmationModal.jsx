import { Button, Modal } from 'flowbite-react';
import { useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function ConfirmationModal(props) {

  return (
    <>
      <Modal show={props.openModal} size="md" onClose={() => props.setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {props.messageBody}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => props.confirmCallBack()}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => props.setOpenModal(false)}>
               {"No, cancel"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ConfirmationModal
