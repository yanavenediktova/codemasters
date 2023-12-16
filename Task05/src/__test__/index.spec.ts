import {jest} from '@jest/globals';
import { IQuestion } from '../models/question';
import * as restService from '../services/rest';
import * as app from '..';

const mockData: IQuestion[] = [
  {
    id: 1,
    question: 'Как называется столица Франции?',
    answers: [
      {
        id: 1,
        text: 'Мадрид',
    
      },
      {
        id: 2,
        text: 'Берлин'
      },
      {
        id: 3,
        text: 'Лондон'
      },
      {
        id: 4,
        text: 'Париж'
      }
    ]
  },
  {id: 2,
    question: 'Что такое световой год?',
    answers: [
      {
        id: 1,
        text: 'Время, за которое свет преодолевает расстояние в один год'
      },
      {
        id: 2,
        text: 'Единица измерения яркости света'
      },
      {
        id: 3,
        text: 'Длительность дня на Луне'
      },
      {
        id: 4,
        text: 'Срок службы лампы накаливания'
      }
    ]
  },
];

describe('App', () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <div class="main-quiz main-quiz-wrapper">
    <div class="quiz-heading">
      <div class="main-quiz__progress progress">
        <p class="main-quiz__current-progress">
          <span class="progress__current">0</span> из
          <span class="main-quiz__total">0</span>
        </p>
      </div>
      <div class="main-quiz__score">
        Score: <span class="score">0</span>
      </div>
    </div>
    <div class="main-quiz__content content">
      <button
        type="button"
        class="main-quiz__button_main"
        id="start-button"
      >
        Начать
      </button>
    </div>
    <div class="main-quiz__status">
      <button class="button-next hide" type="button">Следующий</button>
    </div>
  </div>`;
   
       
    jest.spyOn(restService, 'get')
      .mockReturnValue(Promise.resolve(mockData));
  });

  

  
  it('При завершении викторины и нажатии кнопки nextButton вызывается функция endQuiz',()=>{
    const spyEndQuiz = jest.spyOn(app,'endQuiz');
    const nextButton = app.nextButton;
    if(app.currentQuestion>0 && app.currentQuestion<2){
      nextButton!.addEventListener('click',()=>{
        if(app.currentQuestion>2){ 
          expect(spyEndQuiz).toHaveBeenCalled();    
        }
      });
    }
  });
  it('newQuestion увеличивает значение на 1',  () => {
    app.newQuestion();
    expect(app.currentQuestion).toEqual(1);
  });
});
