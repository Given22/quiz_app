<script lang="ts">
import { store } from "@/stores/quiz";
import { useStore } from "vuex";
import { defineComponent, ref } from "vue";

export default defineComponent({
  data: () => ({
    amount: 10,
    category: "",
    difficulty: "",
    type: "",
  }),

  setup() {
    const store = useStore();
    const count = ref(store.state);
    const inc = () => {
      store.commit("increment");
    };
    return {
      count,
      inc,
    };
  },

  methods: {
    getQuestions() {
      const URL = "https://opentdb.com/api.php?";
      const amount = this.amount ? `amount=${this.amount}` : "";
      const category = this.category ? `category=${this.category}` : "";
      const difficulty = this.difficulty ? `difficulty=${this.difficulty}` : "";
      const type = this.type ? `type=${this.type}` : "";
      const options = [amount, category, difficulty, type]
        .filter(Boolean)
        .join("&");
      // console.log(amount, category, difficulty, type);
      // console.log(`${URL}${options}`);
      // console.log("http://localhost:5173/quiz");
      fetch(`${URL}${options}`)
        .then((response) => response.json())
        .then((data) => {
          store.commit("setQuiz", {
            data: data,
          });
          this.$store.commit("saveQuiz");
        })
        .then(() => (window.location.href = "/quiz"));
    },
  },
});
</script>

<template>
  <div class="form">
    <label for="amount" class="form-title"
      >Number of Questions: {{ amount }}</label
    >
    <input
      class="form-input-range"
      type="range"
      id="amount"
      v-model="amount"
      min="1"
      max="25"
      step="1"
    />

    <label for="category" class="form-title">Select Category:</label>
    <select id="category" class="form-input" v-model="category">
      <option value="any" checked>Any Category</option>
      <option value="9">General Knowledge</option>
      <option value="10">Entertainment: Books</option>
      <option value="11">Entertainment: Film</option>
      <option value="12">Entertainment: Music</option>
      <option value="13">Entertainment: Musicals &amp; Theatres</option>
      <option value="14">Entertainment: Television</option>
      <option value="15">Entertainment: Video Games</option>
      <option value="16">Entertainment: Board Games</option>
      <option value="17">Science &amp; Nature</option>
      <option value="18">Science: Computers</option>
      <option value="19">Science: Mathematics</option>
      <option value="20">Mythology</option>
      <option value="21">Sports</option>
      <option value="22">Geography</option>
      <option value="23">History</option>
      <option value="24">Politics</option>
      <option value="25">Art</option>
      <option value="26">Celebrities</option>
      <option value="27">Animals</option>
      <option value="28">Vehicles</option>
      <option value="29">Entertainment: Comics</option>
      <option value="30">Science: Gadgets</option>
      <option value="31">Entertainment: Japanese Anime &amp; Manga</option>
      <option value="32">Entertainment: Cartoon &amp; Animations</option>
    </select>

    <label for="difficulty" class="form-title">Select Difficulty:</label>
    <select
      id="difficulty"
      class="form-input"
      name="difficulty"
      v-model="difficulty"
    >
      <option value="any">Any Difficulty</option>
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
    </select>

    <label for="type" class="form-title">Select Type:</label>
    <select id="type" class="form-input" v-model="type">
      <option value="any">Any Type</option>
      <option value="multiple">Multiple Choice</option>
      <option value="boolean">True / False</option>
    </select>
    <br />
    <button class="form-submit" @click="getQuestions">Search Quiz</button>
  </div>
</template>

<style lang="scss">
.form {
  position: absolute;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100px;
  flex-wrap: wrap;
}

.form-title {
  color: var(--color-yellow);
  font-size: 1.5rem;
}

.form-input {
  cursor: pointer;
  height: 2.5rem;
  border: 0px solid;
  color: var(--color-green-dark);
  background-color: var(--color-green-light);
  font-size: 1rem;
  font-family: "Righteous";
  border-radius: 10px;
  padding: 0.5rem;
  margin-bottom: 2rem;
  box-shadow: 0px 5px 0px rgba(0, 0, 0, 0.25);
  
}

.form-input-range {
  cursor: pointer;
  height: 2.5rem;
  border: 0px solid;
  color: var(--color-green-dark);
  background-color: var(--color-green-light);
  font-size: 1rem;
  font-family: "Righteous";
  border-radius: 10px;
  padding: 0.5rem;
  margin-bottom: 2rem;
}

.form-submit {
  cursor: pointer;
  height: 3.5rem;
  border: 0px solid;
  color: var(--color-green-dark);
  background-color: var(--color-yellow);
  font-size: 2rem;
  font-family: "Righteous";
  margin-bottom: 2rem;
  border-radius: 10px;
  padding: 0.5rem 2rem;
  box-shadow: 0px 5px 0px rgba(233, 196, 106, 0.3),
    3px 10px 5px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: translateY(5px);
    box-shadow: 0px 0px 0px rgba(233, 196, 106, 0.25),
      0px 0px 0px rgba(0, 0, 0, 0.25);
  }
}

//Styling the range input

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: grab;
  &:active{
    cursor: grabbing;
  }
}

input[type="range"]::-webkit-slider-runnable-track {
  background: var(--color-green-light);
  height: 0.5rem;
  border-radius: 10px;
  box-shadow: 0px 5px 0px rgba(0, 0, 0, 0.25);
}

input[type="range"]::-moz-range-track {
  background: var(--color-green-light);
  border-radius: 10px;
  box-shadow: 0px 5px 0px rgba(0, 0, 0, 0.25);
}

input[type="range"]::-webkit-slider-thumb {
   -webkit-appearance: none; 
  box-shadow: 0px 5px 0px rgba(0, 0, 0, 0.25);
   appearance: none;
   margin-top: -4px;
   background-color: var(--color-yellow);
   height: 1rem;
   width: 1rem;    
   border-radius: 50%;
}



@media screen and (min-width: 1024px) {
  .form-input,
  .form-input-range {
    width: 25%;
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .form-input,
  .form-input-range {
    width: 50%;
  }
}

@media screen and (max-width: 767px) {
  .form-input,
  .form-input-range {
    width: 80%;
  }
}
</style>
