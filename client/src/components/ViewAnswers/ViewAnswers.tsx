import { useContext, useState } from "react";
import UserContext from "../../context/userContext";
import axios from "axios";
import "./ViewAnswers.css"
import apiContext from "../../context/apiContext";

const ViewAnswers = ({ answers, question, reset, setReset }: any) => {
    const [text, setText] = useState("");
    const { user: currentUser } = useContext<any>(UserContext);
    const [shareModal, setShareModal] = useState<any>(false);
    const [copyMessage, setCopyMessage] = useState<any>(false);
    const [upvote, setUpvote] = useState(false);
    const [downvote, setDownvote] = useState(false);
    const {apiUrl}:any = useContext(apiContext)
    // console.log(question?.user,currentUser._id)
    const [edit, setEdit] = useState(false);
    const handleClick = () => {
        axios
            .post(`${apiUrl}/answer/${question._id}`, {
                text: text,
                user: currentUser._id,
                questionId: question._id,
            })
            .then((res) => {
                console.log(res);
                setReset(!reset);
                setText("");
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
                setText("");
            })
            .catch((err) => {
                console.log(err.message);
            });
    };
    const editClick = () => {
        axios.put(`${apiUrl}/answer/edit/` + edit,{
            text: text,
            user: currentUser._id,
            questionId: question._id,
        })
        .then((res) => {
            res
            setText("")
            setReset(!reset)
            setEdit(false)
        })
        .catch((err) => {
            console.log(err.message)
        })
    };
    const deleteClick = (id:any) => {
        axios.delete(`${apiUrl}/answer/delete/` + id,
        {
            data: {
                user: currentUser._id,
                questionId: question._id,
            }
        })
        .then((res) => {
            console.log(res)
            setReset(!reset)
            window.location.reload()
        })
        .catch((err) => {
            console.log(err.message)
        })
    };
    const upvoteClick = (id:any) => {
        axios.put(`${apiUrl}/answer/upvote/` + id,{
            user: currentUser._id,
        })
        .then((res) => {
            console.log(res)
            setReset(!reset)
        })
        .catch((err) => {
            console.log(err.message)
        })
    };
    const downvoteClick = (id:any) => { 
        axios.put(`${apiUrl}/answer/downvote/` + id,{
            user: currentUser._id,
        })
        .then((res) => {
            console.log(res)
            setReset(!reset)
        })
        .catch((err) => {
            console.log(err.message)
        })
    };
    const toLogin = () => {
        window.location.href = "/login"
    }
    return (
        <div>
            <div className="viewQuestionAnswers">
                <div className="viewQuestionAnswersHeading">
                    {question?.answers.length} Answers
                </div>
                {answers?.map((item: any, idx: number) => {
                    // {console.log(item)}
                    // {console.log(currentUser._id, item?.user)}
                    
                       
                    
                    return (

                        <div className="viewQuestionAnswer" key={idx}>
                            {item?.isAccepted && <div className="acceptedAnswer">
                                <i className='bx bx-badge-check'></i>
                            </div>}
                            <div className="answerVotes">
                                <button onClick={()=>{
                                    currentUser._id ? upvoteClick(item._id): toLogin()
                                    item?.upvotes.includes(currentUser._id) ? setUpvote(false) : setUpvote(true); 
                                }}><i className={upvote ? "bx bx-caret-up active" : "bx bx-caret-up"}></i></button>
                                <div className="answerVotesCount">{item?.upvotes.length - item?.downvotes.length}</div>
                                <button onClick={()=>{
                                    currentUser._id ? downvoteClick(item._id): toLogin()
                                    item?.downvotes.includes(currentUser._id) ? setDownvote(false) : setDownvote(true);
                                }}><i className={downvote ? "bx bx-caret-down active" : "bx bx-caret-down"}></i></button>
                            </div>
                            <div className="answerBody">
                                <div className="answerDescription">{item?.text}</div>
                                <div className="answerDetails">
                                    <pre className="answerDetail">Answered{" "}<span className="answerDetailValue">{new Date(item?.createdAt).toLocaleDateString()}</span></pre>
                                    <pre className="answerDetail">Active{" "}<span className="answerDetailValue">{new Date(item?.updatedAt).toLocaleDateString()}</span></pre>
                                </div>
                                <div className="answerLinks">
                                    <div className="answerLink">
                                        <i className="bx bx-share-alt"></i>
                                        <span className="answerLinkName" onClick={() => {
                                            setShareModal(!shareModal);
                                            setCopyMessage(false);
                                         }}>Share</span>
                                    </div>
                                    <div className="answerLink">
                                        <i className="bx bxs-flag-alt"></i>
                                        <span className="answerLinkName">Report</span>
                                    </div>
                                    <div className="answerLink">
                                        <i className="bx bx-bookmark-alt"></i>
                                        <span className="answerLinkName">Bookmark</span>
                                    </div>
                                    <div className="viewQuestionBtns">
                                        {currentUser?._id && currentUser._id === item?.user && (
                                            <>
                                                <button className="viewQuestionBtn"
                                                    onClick={() => { 
                                                        setText(item?.text)
                                                        setEdit(item?._id)
                                                        window.scrollTo(0,document.body.scrollHeight)
                                                }}
                                                >Edit</button>
                                                <button className="viewQuestionBtn" onClick={()=>{deleteClick(item?._id)}}>Delete</button>
                                            </>
                                        )}
                                        {currentUser?._id && currentUser._id === question?.user && (
                                            <button className="viewQuestionBtn"
                                                onClick={() => handleAccept(item?._id)}
                                            >
                                                {item?.isAccepted ? "Unaccept Answer" : "Accept Answer"}</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {shareModal && (
                    <div className="shareModal">
                        <div className="shareModalContainer">
                            <div className="shareModalHeading">Copy link</div>
                            <div className="shareModalLink">{window.location.href}</div>
                            <div className="shareModalBtns">
                                <button
                                    className="shareModalBtn"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        setCopyMessage(true);
                                    }}
                                >
                                    <i className="bx bx-copy-alt"></i> Copy
                                </button>
                                <button
                                    className="shareModalBtn"
                                    onClick={() => {
                                        setShareModal(!shareModal);
                                        setCopyMessage(false);
                                    }}
                                >
                                    <i className="bx bx-x"></i>
                                    Close
                                </button>
                            </div>
                            {copyMessage && (
                                <div className="copyMessage">Link copied to clipboard!</div>
                            )}
                        </div>
                    </div>
                )}
            { currentUser?._id && currentUser?._id !== question?.user && (
                <div className="yourAnswerBox">
                    <div className="answerBoxHeading">Your Answer</div>
                    <div className="answerInput">
                        <textarea
                            className="answerInputField"
                            placeholder="Type your answer here"
                            onChange={(e) => setText(e.target.value)}
                            value={text}
                        ></textarea>
                    </div>
                    <button className="answerBtn" onClick={edit ? editClick :handleClick}>
                        {edit ? "Edit" : "Post"} Your Answer
                    </button>
                </div>
            )}
        </div>
    )
}

export default ViewAnswers