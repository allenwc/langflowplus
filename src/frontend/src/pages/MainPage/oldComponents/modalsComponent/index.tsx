// Modals.tsx
import TemplatesModal from "@/modals/templatesModal";
import DeleteConfirmationModal from "../../../../modals/deleteConfirmationModal";
import { useTranslation } from "react-i18next";

interface ModalsProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  openDeleteFolderModal: boolean;
  setOpenDeleteFolderModal: (value: boolean) => void;
  handleDeleteFolder: () => void;
}

const ModalsComponent = ({
  openModal = false,
  setOpenModal = () => { },
  openDeleteFolderModal = false,
  setOpenDeleteFolderModal = () => { },
  handleDeleteFolder = () => { },
}: ModalsProps) => {
  const { t } = useTranslation();
  return (
    <>
      {openModal && <TemplatesModal open={openModal} setOpen={setOpenModal} />}
      {openDeleteFolderModal && (
        <DeleteConfirmationModal
          open={openDeleteFolderModal}
          setOpen={setOpenDeleteFolderModal}
          onConfirm={() => {
            handleDeleteFolder();
            setOpenDeleteFolderModal(false);
          }}
          description={t('delete_confirmation_modal.folder')}
          note={t('delete_confirmation_modal.note_delete_folder')}
        >
          <></>
        </DeleteConfirmationModal>
      )}
    </>
  );
};

export default ModalsComponent;

