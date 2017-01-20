const questions = (state = [],action) => {
  switch(action.type) {
    case 'ADD_QUESTION':
      return [...state,{
        id: action.id,
        person: action.person,
        text: action.text,
        response: action.response
      }];
    case 'ANSWER_QUESTION':
      return state.map(q => {
        if (q.id != action.id) return q;
        q.response = action.response;
        return q;
      })

    default:
      return state;
  }
}

const calculateScore = (state) => {
  return state.reduce((score,q) => {
    if (q.response == 'N') {
      return score += 10;
    } else if (q.response == 'Y') {
      return score += 1;
    } 
    return score;
  },0)
}

const {createStore} = Redux;
const store = createStore(questions)

const render = () => {
  const questions = store.getState();
  const lis = questions.map(q =>{
    return `
    <li>
    ${q.person}: 
    ${q.text} - 
    ${q.response}
    </li>`
  }).join("");

  const container = document.getElementById('questions_container');
  container.innerHTML = `<ul>${lis}</ul>`;

  const score = document.getElementById('score');
  score.innerHTML = calculateScore(questions)
}

let questionId = 3
const submitQuestion = () => {
  const person = document.querySelector('input[name="person"]').value
  const question = document.querySelector('input[name="question"]').value
  const response = [...document.querySelectorAll('input[type="radio"]')].find(r => r.checked).value
  store.dispatch({
    type: 'ADD_QUESTION',
    id: questionId++,
    person: person,
    text: question,
    response: response
  })
  hideQuestionForm()
}

const showQuestionForm = () => {
  const form = document.getElementById('new_question_form');
  form.style.display = "block";
}

const hideQuestionForm = () => {
  document.querySelector('input[name="person"]').value = ''
  document.querySelector('input[name="question"]').value = ''
  const form = document.getElementById('new_question_form');
  form.style.display = "none"; 
}


store.subscribe(render)
render()

store.dispatch({
  type:'ADD_QUESTION',
  id:0,
  person: "mom",
  text: "can I have a pony?",
  response: undefined
})

store.dispatch({
  type:'ADD_QUESTION',
  id:1,
  person: "tony",
  text: "can I have a pizza?",
  response: undefined
})

store.dispatch({
  type:'ANSWER_QUESTION',
  id:1,
  response: 'Y'
})

store.dispatch({
  type:'ANSWER_QUESTION',
  id:0,
  response: 'N'
})

