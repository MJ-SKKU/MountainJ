import { Fragment, useState } from "react";

import Button from "../components/UI/Button";
import Modal from "../components/Modal/Modal";
import ProjectList from "../components/Project/ProjectList";
import UserProfile from "../components/UI/UserProfile";
import { CreateProjModal } from "../components/Modal/CreateProjModal";

const UserPage = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [isModalOpen, setIsModalOpen] = useState(false);

  const createProjectClickHandler = () => {
    setIsModalOpen(true);
  };

  const onCloseClick = () => {
    setIsModalOpen(false);
  };

  return (
    <Fragment>
      <main className="mt-24">
        <div className="flex items-center mb-6">
          <UserProfile large={true} />
          <div className="font-scoredream text-2xl ml-3">
            <span className="font-semibold">{userInfo.k_name}</span>
            님<br />
            안녕하세요.
          </div>
        </div>
        <Button
          className="w-full h-12 mb-10 border-none rounded-md bg-lime font-scoredream text-base"
          type="button"
          onClick={createProjectClickHandler}
        >
          <span className="font-medium">새로운 정산</span>
          <span className="font-light">을 생성해보세요!</span>
        </Button>
        <ProjectList userInfo={userInfo} isComplete={false} />
        <ProjectList userInfo={userInfo} isComplete={true} />
      </main>

      {isModalOpen && (
        <Modal title="정산 생성" onClose={onCloseClick}>
          <CreateProjModal user={userInfo} setIsModalOpen={setIsModalOpen} />
        </Modal>
      )}
    </Fragment>
  );
};

export default UserPage;
