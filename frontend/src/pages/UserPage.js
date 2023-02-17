import { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { CreateProjModal } from "../components/Modal/CreateProjModal";
import Button from "../components/UI/Button";
import Modal from "../components/Modal/Modal";
import ProjectList from "../components/Project/ProjectList";
import UserProfile from "../components/UI/UserProfile";

const UserPage = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.userReducer.userObj);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (
      user === undefined ||
      JSON.stringify(user) === JSON.stringify({}) ||
      user.username === ""
    ) {
      alert("로그인을 해주세요.");
      navigate("/");
      return;
    }
  }, [navigate, user]);

  const onProjGenerate = () => {
    setIsModalOpen(true);
  };

  const onCloseClick = () => {
    setIsModalOpen(false);
  };

  return (
    user !== undefined && (
      <Fragment>
        <main className="mt-3">
          <div className="flex items-center mb-6">
            <UserProfile user_id={user.id} large={true} />
            <div className="font-scoredream text-2xl ml-3">
              <span className="font-semibold">{user.k_name}</span>
              님<br />
              안녕하세요.
            </div>
          </div>
          <Button
            className="w-full h-12 mb-10 border-none rounded-md bg-lime font-scoredream text-base"
            type="button"
            onClick={onProjGenerate}
          >
            <span className="font-medium">새로운 정산</span>
            <span className="font-light">을 생성해보세요!</span>
          </Button>
          <ProjectList isComplete={false} />
          <ProjectList isComplete={true} />
        </main>

        {isModalOpen && (
          <Modal title="정산 생성" onClose={onCloseClick}>
            <CreateProjModal setIsModalOpen={setIsModalOpen} />
          </Modal>
        )}
      </Fragment>
    )
  );
};

export default UserPage;
