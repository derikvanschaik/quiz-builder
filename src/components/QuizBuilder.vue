<script setup lang="ts">
import { ref, reactive } from 'vue';

// State
const state = reactive({
  newQuestion: '', 
  newAnswer: '',
  title: '',
  step: 1,
  cardIndex: 0,
  quizCards: [],
});

// Methods
const nextStep = () => {
  state.step = 2;
};

const prevStep = () => {
  state.step = 1;
};

const addCard = () => {
  state.quizCards.push({ question: state.newQuestion, answer: state.newAnswer});
  state.cardIndex = state.quizCards.length;
  state.newAnswer = '';
  state.newQuestion = '';
};

const prevCard = () => {
  state.cardIndex--;
}
const nextCard = () =>{
  state.cardIndex++;
}

// const removeCard = (index: number) => {
//   state.quizCards.splice(index, 1);
// };

const submitQuiz = () => {
  // Implement logic to submit the quiz data
  state.step = 3;

};
</script>


<template>
  <div>
    <button v-if="state.step == 2" @click="prevStep" class="back-button contrast outline">Back</button>

    <div v-if="state.step === 1">
      <!-- Step 1: Create Title of Quiz -->
      <h3>Step 1: Quiz Topic</h3>
      <input v-model="title" placeholder="Enter quiz title" />
      <button @click="nextStep" class="contrast outline">Next</button>
    </div>
    <div v-else-if="state.step === 2">
      <!-- Step 2: Create Quiz Card -->
      <div class="quiz-header">
        <h3 class="quiz-header-title">Step 2: Create Quiz Cards | <span class="progress-chip">Question [{{state.cardIndex + 1}}]/{{state.quizCards.length}}</span> </h3>
        <button @click="addCard" class="create-card contrast outline" :disabled="state.newAnswer === '' || state.newQuestion === ''" >Create New Card</button>
      </div>
      <div class="quiz-card">
        <label>Question:</label>
        <input 
          v-if="state.cardIndex < state.quizCards.length" 
          v-model="state.quizCards[state.cardIndex].question" 
          placeholder="Enter question" />
        <input 
          v-else 
          v-model="state.newQuestion" 
          placeholder="Enter question" />
        
        <label>Answer:</label>
        <input 
          v-if="state.cardIndex < state.quizCards.length" 
          v-model="state.quizCards[state.cardIndex].answer" 
          placeholder="Enter answer" />
        <input 
          v-else
          v-model="state.newAnswer" 
          placeholder="Enter answer" />
      </div>
      <div class="actions">
        <button :disabled="state.cardIndex <= 0" @click="prevCard" class="action-button contrast outline">Previous Question</button>
        <button :disabled="state.cardIndex >= state.quizCards.length" @click="nextCard" class="action-button contrast outline">Next Question</button>
        <button @click="submitQuiz" class="action-button contrast outline" :disabled="state.quizCards.length === 0">Submit Quiz</button>
      </div>
    </div>
    <!-- Created card! -->
    <div v-else>
      <h4>Congrats on building your quiz!</h4>
      <div v-for="quiz in state.quizCards" :key="quiz.question">
        <article>
          <h6>{{ quiz.question}}</h6>
          <p>{{quiz.answer}}</p>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-header{
  display: flex;
  align-items: start;
}
.quiz-header-title{
  width: 80%;
  margin-right: 10px;
}
.create-card{
  width: fit-content;
}
.quiz-card {
  margin-bottom: 10px;
}
.actions{
  display: flex;
}
.action-button{
  width: 30%;
  margin-right: 10px;
}
.remove-card{
  background: red;
  width: fit-content;
}
.back-button{
  width: fit-content;
  padding-left: 100px;
  padding-right: 100px;
}
.progress-chip{
  font-style: italic;
  font-weight: normal;
  font-size: 18px;
}
</style>
