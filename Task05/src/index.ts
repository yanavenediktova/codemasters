import * as restService from './services/rest';
import { IAnswer } from './models/answer';
import { IQuestion } from './models/question';
import './styles/normalize.css';
import './styles/quiz.css';
import { ICorrectAnswer } from './models/correct-answer';


const quizHeader: HTMLElement = document.querySelector('.quiz-heading')!;
const scoreCurrentQuestion: HTMLElement =
  document.querySelector('.progress__current')!;
const scoreCurrentQuiz: HTMLElement =
  document.querySelector('.main-quiz__total')!;
const scoreNumber: HTMLElement = document.querySelector('.score')!;
const quizcontentElement: HTMLElement = document.querySelector('.main-quiz__content')!;
export const nextButton: HTMLButtonElement =
  document.querySelector('.button-next')!;

export let currentQuestion: number = 0;
export let totalScore: number = 0;
export let quizHeaderTitle: HTMLElement;

window.addEventListener('DOMContentLoaded', async () => {
  const dataQuiz = await restService.get<IQuestion[]>('questions');
  scoreCurrentQuiz.innerHTML = `${dataQuiz.length}`;
});


 
startQuiz();

export function createAnswerButton(answer: IAnswer): string {
  const button = document.createElement('button');
  button.innerHTML = answer.text;
  button.type = 'button';
  button.classList.add('main-quiz__button_secondary');
  button.dataset.id = answer.id.toString();
  return button.outerHTML;
}


export function createQuestionsForHTML(question: IQuestion, answers: IAnswer[]) {

  const questionText = `<h3 class="content__question">${question.question}</h3>`;
  console.log(createAnswerButton(answers[1]));
  const elemListOfAnswers = answers.reduce((accum, currentValue) =>
    `${accum}
    <li class="content__answer">
      ${createAnswerButton(currentValue)}
    </li>
  `, '');
  const ListOfAnswers = `<ul class="content__answers">${elemListOfAnswers}</ul>`;
  return `
  ${questionText}
  ${ListOfAnswers}
  `;
}


export async function addQuestionsToHTML(question: string) {
  const currenttQuestion = await restService.get<IQuestion>(`questions/${question}`);
  quizcontentElement.classList.add('main-quiz__content--included');
  quizHeaderTitle = document.querySelector('.main-quiz__title')!;
  const questionNumber = `<h2 class="main-quiz__title">Question №${currenttQuestion.id}</h2>`;
  if(quizHeaderTitle){
    if (quizHeaderTitle.classList.contains('hide')) quizHeaderTitle.classList.remove('hide');
    quizHeaderTitle.innerHTML = '';
    quizHeaderTitle.innerHTML = `Question №${currenttQuestion.id}`;
    
  } else quizHeader.insertAdjacentHTML(
    'afterbegin',
    `${questionNumber}`
  );
 
 
  quizcontentElement.innerHTML = createQuestionsForHTML(currenttQuestion, currenttQuestion.answers);
}

export async function whichButtonIsClicked(question: string) {
  let dataId: number;
  const answersForQuestion = document.querySelectorAll('.main-quiz__button_secondary')! as NodeListOf<HTMLButtonElement>;
  answersForQuestion.forEach((event) => event.addEventListener('click',()=>{
    dataId = Number(event!.getAttribute('data-id'));
    checkCorrectAnswer(question,dataId);
  }));
  
}
export async function checkCorrectAnswer(question: string, userAnswer: number){
  const currenttQuestion = await restService.get<IQuestion>(`questions/${question}`);
  console.log(currenttQuestion.id);
  const correctAnswer = await restService.get<ICorrectAnswer>(`answers/${currenttQuestion.id}`);
  const answersForQuestion = document.querySelectorAll('.main-quiz__button_secondary')! as NodeListOf<HTMLButtonElement>;

  console.log(userAnswer);
  if(userAnswer === correctAnswer.correctIndex){
    answersForQuestion.forEach((elem)=>{
      if (Number(elem!.getAttribute('data-id')) === correctAnswer.correctIndex){
        elem.classList.add('correct-answer');
      }
    }
    );
    totalScore +=1;
    scoreNumber.textContent = String(totalScore);
  } else {
    answersForQuestion.forEach((elem)=>{
      if (Number(elem!.getAttribute('data-id')) === correctAnswer.correctIndex){
        elem.classList.add('correct-answer');
      }
    }
    );
    answersForQuestion[userAnswer-1].classList.add('wrong-answer');
  }
  answersForQuestion.forEach((button) => {
    button.disabled = true;
  });

  nextButton.classList.remove('hide');
  nextButton.classList.add('show-button');
}


export function newQuestion() {
  currentQuestion++;
}

export async function endQuiz() {
  quizcontentElement.innerHTML = '';
  const data: IQuestion[] = await restService.get(`questions`);
  scoreCurrentQuestion.textContent = `${data.length}`;
  if(quizHeaderTitle) quizHeaderTitle.classList.add('hide');
  
  quizcontentElement.classList.remove('main-quiz__content--included');
  const results = `
    <h3>Your score:</h3>
    <div class="main-quiz__progress progress main-quiz__progress_end">
      <span class="progress__current">${totalScore}</span> из
      <span class="main-quiz__total">${data.length}</span>
    </div>
  `;
  const replayButton = `
    <button type="button" class="main-quiz__button_main" id="start-button">Пройти квиз снова</button>
  `;

  quizcontentElement.insertAdjacentHTML(
    'afterbegin',
    `
    ${results}
    ${replayButton}
  `
  );
  startQuiz();
}

export async function generateQuiz(){
  scoreCurrentQuestion.textContent = String(currentQuestion);
  await addQuestionsToHTML(String(currentQuestion));
  whichButtonIsClicked(String(currentQuestion));
}
nextButton?.addEventListener('click', async function (e) {
  const dataQuiz = await restService.get<IQuestion[]>('questions');
  const target = e.target as Element;
  target.classList.remove('show-button');
  target.classList.add('hide');

  newQuestion();
  if (currentQuestion > dataQuiz.length) {
    endQuiz();
  } else {
    scoreCurrentQuestion.textContent = String(currentQuestion);
    await addQuestionsToHTML(String(currentQuestion));
    whichButtonIsClicked(String(currentQuestion));
  }
}); 
export function startQuiz(){
  const startButton = document.getElementById('start-button')! as  HTMLElement;
  
  startButton?.addEventListener('click', () => {
    currentQuestion = 0;
    totalScore = 0;
    scoreNumber.textContent = '0';
    startButton.classList.add('hide');
    newQuestion();  
    generateQuiz();
  });
}  





