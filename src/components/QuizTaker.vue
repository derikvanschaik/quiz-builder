<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

const state = reactive({ quiz: null, curCardIndex: 0 });
const show = ref(false);

const correctGuess = ref(false);

const currentGuess = reactive({ selected: [] });

const logMultipleAnswer = (answer) => {
  console.log(answer)
  if(currentGuess.selected.includes(answer)){
    currentGuess.selected = currentGuess.selected.filter(g => g.answer === answer);
  }else{
    currentGuess.selected.push(answer);
  }
  
};

const checkMultipleAnswer = () => {

  let isIncorrect = false;
  for(const selectedAnswer of currentGuess.selected){
    console.log(selectedAnswer)
    if(state.quiz[state.curCardIndex].answers.filter(a => a.isAnswer).find(a => a.answer === selectedAnswer) === undefined){
        correctGuess.value = false;
        show.value = true;
        isIncorrect = true;
        
    }
  }
  if(isIncorrect){
    return;
  }
  correctGuess.value = (currentGuess.selected.length === state.quiz[state.curCardIndex].answers.filter(a => a.isAnswer).length);
  show.value = true;
};

const nextCard = () => {
  // Increment the current card index
  state.curCardIndex++;

  // Reset the show flag
  show.value = false;

  // Reset the currentGuess for the next card
  currentGuess.selected = [];
};

// TODO: remove this when backend is implemented
onMounted(() => {
  const quizJson = localStorage.getItem('quiz');
  state.quiz = JSON.parse(quizJson);
});
</script>

<template>
  <div v-if="state.quiz">
    <article :key="state.curCardIndex">
      <h4>{{ state.quiz[state.curCardIndex].question }}</h4>
      <p v-if="state.quiz[state.curCardIndex].answerType === 'basic'">
        {{ state.quiz[state.curCardIndex].answer }}
      </p>
      <div v-else>
        <div v-for="(answer) in state.quiz[state.curCardIndex].answers" :key="answer.answer">
          <p>{{ answer.answer }}</p>
          <input type="checkbox" @click="logMultipleAnswer(answer.answer)" />
        </div>
        <button @click="checkMultipleAnswer" v-if="!show">Check Answer</button>
        <div v-if="show">
            <h3 v-if="correctGuess">
                Nice job! You got that correct!
            </h3>
            <h3 v-else>
                Oops...
                Correct answer(s) was:
                <ul>
                    <li v-for="(answer) in state.quiz[state.curCardIndex].answers.filter(a => a.isAnswer)" :key="answer">
                        {{ answer.answer }}
                    </li>
                </ul>
            </h3>
        </div>
      </div>
    </article>
    <button @click="nextCard" v-if="state.curCardIndex < state.quiz.length -1 && (show || state.quiz[state.curCardIndex].answerType === 'basic')">Next</button>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>

