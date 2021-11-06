import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Divider, Modal, useModal } from "@nextui-org/react";
import React from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";

export default function CreateCompletionButton() {
  const { setVisible, bindings } = useModal();

  return (
    <>
      <Button
        flat
        icon={<FontAwesomeIcon icon={faPlusCircle} />}
        onClick={() => setVisible(true)}
        size="small"
      >
        New Model
      </Button>
      <CreateCompletionModal {...bindings} />
    </>
  );
}

function CreateCompletionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const form = useForm({ defaultValues: { training: "", validation: "" } });

  const onSubmit = form.handleSubmit(async ({ training, validation }) => {
    await mutate("fine-tune");
    onClose();
  });

  return (
    <Modal {...{ open, onClose }}>
      <form onSubmit={onSubmit}>
        <Modal.Body></Modal.Body>
        <Divider />
        <Modal.Footer justify="space-between">
          <Button auto bordered onClick={onClose}>
            Close
          </Button>
          <Button
            auto
            iconRight={<FontAwesomeIcon icon={faChevronRight} />}
            loading={form.formState.isSubmitting}
            type="submit"
          >
            Create Model
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
