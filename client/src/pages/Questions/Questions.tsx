import Question from '../../components/Question/Question';
import Sidebar from '../../components/Sidebar/Sidebar';
import axios from 'axios';
import './Questions.css';
import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import apiContext from '../../context/apiContext';
import { useTranslation } from 'react-i18next';

const Questions = () => {
  const [QuestionArray, setQuestionArray] = useState([]);
  const { apiUrl }: any = useContext(apiContext);
  const { t } = useTranslation();

  useEffect(() => {
    axios
      .get(apiUrl + '/question/')
      .then((res) => {
        setQuestionArray(res.data.reverse());
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="questionsPage">
      <Sidebar activeLink={'questions'} />
      <div className="questions">
        <div className="questionsHeader">
          <div className="questionsHeading">{t('questions.allQuestions')}</div>
          <Link to="/askquestion" className="Askbtn">
            {t('questions.askQuestion')}
          </Link>
        </div>
        <div className="questionsContainer">
          {QuestionArray.map((item: any, idx: any) => {
            return <Question data={item} key={idx} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Questions;
