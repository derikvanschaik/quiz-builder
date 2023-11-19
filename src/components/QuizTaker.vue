<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

const state = reactive({ quiz: null, curCardIndex: 0 });
const show = ref(false);

const currentGuess = reactive({ selected: [] });

// toggles the selected answer value
const logMultipleAnswer = (answerIndex: number) => {
  currentGuess.selected[answerIndex] = !currentGuess.selected[answerIndex];
  
};

const checkMultipleAnswer = () => {
  show.value = true;
};

const nextCard = () => {
  // Increment the current card index
  state.curCardIndex++;

  // Reset the show flag
  show.value = false;

  // Reset the currentGuess for the next card
  if(state.curCardIndex < state.quiz.length && state.quiz[state.curCardIndex].quizCards.answerType === 'multiple'){
    // map state all to false
    currentGuess.selected = state.quiz[state.curCardIndex].answers.map( a => false);
  }else{
    currentGuess.selected = [];
  }
  
};

// TODO: remove this when backend is implemented
onMounted(() => {
  const quizJson = localStorage.getItem('quiz');
  state.quiz = JSON.parse(quizJson);

  // map state all to false
    currentGuess.selected = state.quiz[state.curCardIndex].answers.map( a => false);
});
</script>

<template>
  <div v-if="state.quiz">
    <article :key="state.curCardIndex">
      <h4>{{ state.quiz[state.curCardIndex].question }}</h4>
      <!-- BASIC SHOW ANSWER -->
      <p v-if="state.quiz[state.curCardIndex].answerType === 'basic'">
        {{ state.quiz[state.curCardIndex].answer }}
      </p>
      <!-- MULTIPLE SELECT -->
      <div v-else>
        <div v-for="(answer, index) in state.quiz[state.curCardIndex].answers" :key="answer.answer">
            <div class="guess-row">
                <input type="checkbox" @click="logMultipleAnswer(index)" />
                <p 
                        :class="{ 
                        correct: show && (state.quiz[state.curCardIndex].answers[index].isAnswer),
                        incorrect: show && !(state.quiz[state.curCardIndex].answers[index].isAnswer)
                        }"
                    >{{ answer.answer }}</p>
                <p v-if="show">
                    {{ currentGuess.selected[index] === state.quiz[state.curCardIndex].answers[index].isAnswer ? '1/1' : '0/1'}}
                </p>
            </div>
        </div>
        <button @click="checkMultipleAnswer" v-if="!show">Check Answer</button>
      </div>
    </article>
    <button @click="nextCard" v-if="state.curCardIndex < state.quiz.length -1 && (show || state.quiz[state.curCardIndex].answerType === 'basic')">Next</button>
  </div>
</template>

<style scoped>

.correct {
  color: green;
  font-weight: bold;
}

.incorrect {
  color: red;
  text-decoration: line-through;
}
</style>

