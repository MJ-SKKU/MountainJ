import { Fragment, useState } from "react";
import { useSelector } from "react-redux";

import Button from "../components/UI/Button";
import Modal from "../components/Modal/Modal";
import ProjectList from "../components/Project/ProjectList";
import UserProfile from "../components/UI/UserProfile";
import { CreateProjModal } from "../components/Modal/CreateProjModal";

const UserPage = () => {
  let user = useSelector((state) => state.user.user);
  console.log(user);

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
            <span className="font-semibold">{user.k_name}</span>
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
        <ProjectList userInfo={user} isComplete={false} />
        <ProjectList userInfo={user} isComplete={true} />
      </main>

      {isModalOpen && (
        <Modal title="정산 생성" onClose={onCloseClick}>
          <CreateProjModal user={user} setIsModalOpen={setIsModalOpen} />
        </Modal>
      )}
    </Fragment>
  );
};

export default UserPage;
