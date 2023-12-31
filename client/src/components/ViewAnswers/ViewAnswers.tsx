import { useContext, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import UserContext from '../../context/userContext';
import apiContext from '../../context/apiContext';
import './ViewAnswers.css';
import { Link } from 'react-router-dom';

const ViewAnswers = ({ answers, question, reset, setReset }: any) => {
  const { t } = useTranslation(); // Initialize the useTranslation hook
  const [text, setText] = useState('');
  const { user: currentUser } = useContext<any>(UserContext);
  const [shareModal, setShareModal] = useState<any>(false);
  const [copyMessage, setCopyMessage] = useState<any>(false);
  // const [upvote, setUpvote] = useState(false);
  // const [downvote, setDownvote] = useState(false);
  const { apiUrl }: any = useContext(apiContext);
  const [edit, setEdit] = useState(false);

  const handleClick = () => {
    axios
      .post(`${apiUrl}/answer/${question._id}`, {
        text: text,
        user: currentUser._id,
        questionId: question._id,
      })
      .then((res) => {
        // console.log(res);
        setReset(!reset);
        setText('');
        res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAccept = (id: any) => {
    axios
      .post(`${apiUrl}/answer/accept/` + id, {
        questionId: question._id,
      })
      .then((res) => {
        console.log(res);
        setReset(!reset);
        setText('');
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const editClick = () => {
    axios
      .put(`${apiUrl}/answer/edit/` + edit, {
        text: text,
        user: currentUser._id,
        questionId: question._id,
      })
      .then((res) => {
        res;
        setText('');
        setReset(!reset);
        setEdit(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const deleteClick = (id: any) => {
    axios
      .delete(`${apiUrl}/answer/delete/` + id, {
        data: {
          user: currentUser._id,
          questionId: question._id,
        },
      })
      .then((res) => {
        console.log(res);
        setReset(!reset);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const upvoteClick = (id: any) => {
    axios
      .put(`${apiUrl}/answer/upvote/` + id, {
        user: currentUser._id,
      })
      .then((res) => {
        console.log(res);
        setReset(!reset);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const downvoteClick = (id: any) => {
    axios
      .put(`${apiUrl}/answer/downvote/` + id, {
        user: currentUser._id,
      })
      .then((res) => {
        console.log(res);
        setReset(!reset);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const toLogin = () => {
    window.location.href = '/login';
  };


  return (
    <div>
      <div className="viewQuestionAnswers">
        <div className="viewQuestionAnswersHeading">
          {question?.answers.length} {t('viewAnswers.answers')}
        </div>
        {answers?.map((item: any, idx: number) => {
          return (
            <div className="viewQuestionAnswer" key={idx} id={"answer"+idx}>
              {item?.isAccepted && (
                <div className="acceptedAnswer">
                  <i className="bx bx-badge-check"></i>
                </div>
              )}
              <div className="answerVotes">
                <button
                  onClick={() => {
                    currentUser._id ? upvoteClick(item._id) : toLogin();
                    item?.upvotes.includes(currentUser._id) 
                  }}
                >
                  <i className={'bx bx-caret-up'}></i>
                </button>
                <div className="answerVotesCount">{item?.upvotes.length - item?.downvotes.length}</div>
                <button
                  onClick={() => {
                    currentUser._id ? downvoteClick(item._id) : toLogin();
                    item?.downvotes.includes(currentUser._id) 
                  }}
                >
                  <i className={'bx bx-caret-down'}></i>
                </button>
              </div>
              <div className="answerBody">
                <div className="answerDescription">{
                  item?.text
                }</div>
                <div className="answerDetails">
                  <pre className="answerDetail">
                    {t('viewAnswers.answered')}{' '}
                    <span className="answerDetailValue">{new Date(item?.createdAt).toLocaleDateString()} from <Link to={"/profile/" + item?.user } className="answerDetailValue linked">
                      User Profile
                    </Link>
                    </span>
                  </pre>
                  {/* <pre className="answerDetail">
                    {t('viewAnswers.active')}{' '}
                    <span className="answerDetailValue">{new Date(item?.updatedAt).toLocaleDateString()}</span>
                  </pre> */}
                </div>
                <div className="answerLinks">
                  <div className="answerLink">
                    <i className="bx bx-share-alt"></i>
                    <span
                      className="answerLinkName"
                      onClick={() => {
                        setShareModal(!shareModal);
                        setCopyMessage(false);
                      }}
                    >
                      {t('viewAnswers.share')}
                    </span>
                  </div>
                  <div className="answerLink">
                    <i className="bx bxs-flag-alt"></i>
                    <Link to={"/report"} className="answerLinkName">{t('viewAnswers.report')}</Link>
                  </div>
                  <div className="answerLink">
                    <i className="bx bx-bookmark-alt"></i>
                    <Link to={"/bookmark"} className="answerLinkName">{t('viewAnswers.bookmark')}</Link>
                  </div>
                  </div>
                  <div className="viewQuestionBtns">
                    {currentUser?._id && currentUser._id === item?.user && (
                      <>
                        <button
                          className="viewQuestionBtn"
                          onClick={() => {
                            setText(item?.text);
                            setEdit(item?._id);
                            window.scrollTo(0, document.body.scrollHeight);
                          }}
                        >
                          {t('viewAnswers.edit')}
                        </button>
                        <button className="viewQuestionBtn" onClick={() => deleteClick(item?._id)}>
                          {t('viewAnswers.delete')}
                        </button>
                      </>
                    )}
                    {currentUser?._id && currentUser._id === question?.user && (
                      <button className="viewQuestionBtn" onClick={() => handleAccept(item?._id)}>
                        {item?.isAccepted ? t('viewAnswers.unaccept_answer') : t('viewAnswers.accept_answer')}
                      </button>
                    )}
                </div>
              </div>
              {shareModal && (
                <div className="shareModal">
                  <div className="shareModalContainer">
                    <div className="shareModalHeading">{t('viewAnswers.copy_link')}</div>
                    <div className="shareModalLink">{window.location.href}</div>
                    <div className="shareModalBtns">
                      <button
                        className="shareModalBtn"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          setCopyMessage(true);
                        }}
                      >
                        <i className="bx bx-copy-alt"></i> {t('viewAnswers.copy')}
                      </button>
                      <button
                        className="shareModalBtn"
                        onClick={() => {
                          setShareModal(!shareModal);
                          setCopyMessage(false);
                        }}
                      >
                        <i className="bx bx-x"></i> {t('viewAnswers.close')}
                      </button>
                    </div>
                    {copyMessage && <div className="copyMessage">{t('viewAnswers.link_copied')}</div>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {currentUser?._id && currentUser?._id !== question?.user && (
        <div className="yourAnswerBox">
          <div className="answerBoxHeading">{t('viewAnswers.your_answer')}</div>
          <div className="answerInput">
            <textarea
              className="answerInputField"
              placeholder={t('viewAnswers.type_your_answer')}
              onChange={(e) => setText(e.target.value)}
              value={text}
            ></textarea>
          </div>
          <button className="answerBtn" onClick={edit ? editClick : handleClick}>
            {edit ? t('viewAnswers.edit') : t('viewAnswers.post_your_answer')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewAnswers;
