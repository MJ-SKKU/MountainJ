import {useLocation, useNavigate} from "react-router-dom";
import { Fragment, useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { userActions } from "../../store/User";
import { API } from "../../config";
// import {useEffect} from "react";
import {projectActions} from "../../store/ProjectInfo";
import {membersActions} from "../../store/Members";
import {paysActions} from "../../store/Pays";
import {payActions} from "../../store/PayInfo";
import {resultsActions} from "../../store/Results";
import { pageStatusActions } from "../../store/PageStatus";


const Footer = () => {
  //
  const location = useLocation();
  const navigate = useNavigate();



  const [isProjectPage, setIsProjectPage] = useState(false);
  const [url, setUrl] = useState(0);

  useEffect(()=>{
    let hi = location.pathname.split("/");
    console.log(hi);
    if(hi.length==3&&hi[2]!=""){
      setIsProjectPage(true);
    }else{
      setIsProjectPage(false);
    }
  },[location.pathname]);


  const onHomeClick = () => {
    navigate("/projects");
    // window.location.replace("/projects");
  };

  return isProjectPage && (
    <footer
        className="flex justify-between items-center fixed bottom-0 right-0 left-0 w-full h-14 px-4 shadow z-50"
        style={{backgroundColor:`#E9ECF0`, textAlign:`center`}}
    >
      <div
          className="w-full text-center"
          onClick={onHomeClick}
      >
        홈으로
      </div>
    </footer>
  );
};

export default Footer;
