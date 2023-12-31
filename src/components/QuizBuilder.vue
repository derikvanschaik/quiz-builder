<script setup lang="ts">
import { ref, reactive } from 'vue'
import { type AnswerType, type MultipleAnswerType, type Quiz } from './QuizTypes'

// State
const state = reactive({
  newQuestion: '',
  newAnswer: '',
  // used in multiple select and multiple choice
  additional: ref<MultipleAnswerType[]>([]),
  isAnswer: false,

  title: '',
  step: 1,
  cardIndex: 0,
  answerType: ref<AnswerType>('basic'),
  quizCards: ref<Quiz[]>([])
})

const initState = () => {
  state.newQuestion = ''
  state.newAnswer = ''
  state.additional = []
  state.isAnswer = false
  state.title = ''
  state.step = 1
  state.cardIndex = 0
  state.answerType = 'basic'
  state.quizCards = []
}

// Methods
const nextStep = () => {
  state.step = 2
}

const prevStep = () => {
  state.step = 1
}

const addCard = () => {
  if (state.answerType === 'basic') {
    state.quizCards.push({
      question: state.newQuestion,
      answer: state.newAnswer,
      answers: [],
      answerType: 'basic'
    })
  } else {
    state.quizCards.push({
      question: state.newQuestion,
      answer: '',
      answers: state.additional,
      answerType: 'multiple'
    })
  }

  console.log(state.quizCards)

  state.cardIndex = state.quizCards.length
  state.newAnswer = ''
  state.newQuestion = ''
  state.answerType = 'basic'
  state.additional = []
}

const prevCard = () => {
  state.cardIndex--
}
const nextCard = () => {
  state.cardIndex++
}

const addMultipleAnswer = () => {
  state.additional.push({ answer: state.newAnswer, isAnswer: state.isAnswer })
  state.newAnswer = ''
  state.isAnswer = false
}

const disableCreateButton = () => {
  // don't allow to create when browsing cards
  if (state.cardIndex < state.quizCards.length) {
    return false
  }

  if (state.answerType === 'basic') {
    return state.newAnswer === '' || state.newQuestion === ''
  }
  // must have more than one answer and must have at least one correct answer
  const hasAtLeastOneAnswer = state.additional.length > 0
  const hasAtLeastOneAnswerMarkedAsCorrect =
    state.additional.filter((a) => a.isAnswer === true).length > 0
  return state.newQuestion === '' || !(hasAtLeastOneAnswer && hasAtLeastOneAnswerMarkedAsCorrect)
}

// const removeCard = (index: number) => {
//   state.quizCards.splice(index, 1);
// };

const submitQuiz = () => {
  // Implement logic to submit the quiz data
  state.step = 3

  // TODO: CREATE BACKEND
  localStorage.setItem('quiz', JSON.stringify(state.quizCards))
}
</script>

<template>
  <div>
    <button v-if="state.step == 2" @click="prevStep" class="back-button contrast outline">
      Back
    </button>

    <div v-if="state.step === 1">
      <!-- Step 1: Create Title of Quiz -->
      <h3>Step 1: Quiz Topic</h3>
      <input v-model="state.title" placeholder="Enter quiz title" />
      <button @click="nextStep" class="contrast outline">Next</button>
    </div>
    <div v-else-if="state.step === 2">
      <!-- Step 2: Create Quiz Card -->
      <div class="quiz-header">
        <h3 class="quiz-header-title">
          Step 2: Create Quiz Cards
          <span class="progress-chip" v-if="state.cardIndex < state.quizCards.length">
            Question [{{ state.cardIndex + 1 }}]/{{ state.quizCards.length }}</span
          >
          <span class="progress-chip" v-else>New Question</span>
        </h3>
        <button
          @click="addCard"
          class="create-card contrast outline"
          :disabled="disableCreateButton()"
        >
          Create New Card
        </button>
      </div>

      <!-- CARD THAT ALREADY EXISTS IN DECK -->
      <div class="quiz-card" v-if="state.cardIndex < state.quizCards.length">
        <!-- basic answer -->
        <div v-if="state.quizCards[state.cardIndex].answerType === 'basic'">
          <label>Question:</label>
          <input v-model="state.quizCards[state.cardIndex].question" placeholder="Enter question" />

          <label>Answer:</label>
          <input v-model="state.quizCards[state.cardIndex].answer" placeholder="Enter answer" />
        </div>

        <!-- multiple answer (multiple select or choice) -->
        <div v-else>
          <label>Question:</label>
          <input v-model="state.quizCards[state.cardIndex].question" placeholder="Enter question" />

          <label>Answers:</label>
          <div
            v-for="(answer, index) in state.quizCards[state.cardIndex].answers"
            :key="answer"
            class="multiple-select-answer"
          >
            <input
              type="checkbox"
              v-model="state.quizCards[state.cardIndex].answers[index].isAnswer"
            />
            <input v-model="state.quizCards[state.cardIndex].answers[index].answer" />
          </div>
        </div>
      </div>

      <!-- NEW CARD -->
      <div v-else>
        <label>Question:</label>
        <input v-model="state.newQuestion" placeholder="Enter question" />
        <!-- Choose Answer type -->
        <label>Answer Type:</label>
        <select v-model="state.answerType">
          <option value="basic">Basic</option>
          <option value="multiple">Multiple</option>
        </select>

        <!-- basic question : one question and answer -->
        <div v-if="state.answerType === 'basic'">
          <label>Answer</label>
          <input v-model="state.newAnswer" placeholder="Enter answer" />
        </div>
        <!-- multiple choice -->
        <div v-else-if="state.answerType === 'multiple'">
          <label>Answers:</label>
          <div v-for="(add, index) in state.additional" :key="add" class="multiple-select-answer">
            <input type="checkbox" v-model="state.additional[index].isAnswer" />
            <input v-model="state.additional[index].answer" />
          </div>

          <fieldset>
            <label for="is-answer">
              <input type="checkbox" id="is-answer" name="is-answer" v-model="state.isAnswer" />
              Select If Correct
            </label>
            <input v-model="state.newAnswer" placeholder="Enter new answer" />
          </fieldset>

          <button @click="addMultipleAnswer">Add Answer</button>
        </div>
      </div>

      <div class="actions">
        <button
          :disabled="state.cardIndex <= 0"
          @click="prevCard"
          class="action-button contrast outline"
        >
          Previous Question
        </button>
        <button
          :disabled="state.cardIndex >= state.quizCards.length"
          @click="nextCard"
          class="action-button contrast outline"
        >
          Next Question
        </button>
        <button
          @click="submitQuiz()"
          class="action-button contrast outline"
          :disabled="state.quizCards.length === 0"
        >
          Submit Quiz
        </button>
      </div>
    </div>

    <!-- Created cards! -->
    <div v-else>
      <h4>Congrats on building your quiz!</h4>
      <button @click="initState()">Build Another Quiz</button>
    </div>
  </div>
</template>

<style scoped>
.quiz-header {
  display: flex;
  align-items: start;
}
.quiz-header-title {
  width: 80%;
  margin-right: 10px;
}
.create-card {
  width: fit-content;
}
.quiz-card {
  margin-bottom: 10px;
}
.actions {
  display: flex;
}
.action-button {
  width: 30%;
  margin-right: 10px;
}
.remove-card {
  background: red;
  width: fit-content;
}
.back-button {
  width: fit-content;
  padding-left: 100px;
  padding-right: 100px;
}
.progress-chip {
  font-style: italic;
  font-weight: normal;
  font-size: 18px;
}
.multiple-select-answer {
  display: flex;
  align-items: start;
}
</style>
