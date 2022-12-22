<!-- Form component for creating request to Trivia API -->

<script lang="ts">
import { store } from "@/stores/quiz";
import { defineComponent } from "vue";
import { Icon } from "@iconify/vue";

import arrayShuffle from "array-shuffle";

import Alert from "@/components/Cards/AlertCard.vue.js";

export default defineComponent({
  data: () => ({
    amount: 10,
    category: "any",
    difficulty: "any",
    type: "any",
    notFound: false,
    searching: false,
  }),
  components: {
    Alert,
    Icon,
  },
  methods: {
    // Create request to Trivia API
    get_questions() {
      const URL = "https://opentdb.com/api.php?";
      //Amount of questions
      const amount = this.amount ? `amount=${this.amount}` : "";

      // Category paremeter
      const category =
        this.category && this.category !== "any"
          ? `category=${this.category}`
          : "";

      // Difficulty parameter
      const difficulty =
        this.difficulty && this.difficulty !== "any"
          ? `difficulty=${this.difficulty}`
          : "";

      // Type parameter
      const type = this.type && this.type !== "any" ? `type=${this.type}` : "";

      // Combine all parameters into one string and filter out empty values
      const options = [amount, category, difficulty, type]
        .filter(Boolean)
        .join("&");

      // Combine URL and options and send request to Trivia API
      fetch(`${URL}${options}`)
        .then((response) => response.json())
        // check if response is successful
        .then((data) => {
          if (data.response_code !== 0) throw new Error("quiz not found");
          return data;
        })
        .then((data) => {
          store.commit("setQuiz", { data: data });
        })
        .then(() => this.$router.push("/quiz"))
        .catch((err) => {
          this.notFound = true;
          this.searching = false;
          console.error("error: ", err);
        });
    },

    // Randomize Form questions
    random_quiz() {
      // Random numer of questions
      this.amount = Math.floor(Math.random() * (25 - 1 + 1)) + 1;

      // Create array of posible categories
      const arr: string[] = ["any"];
      for (let i = 9; i <= 32; i++) {
        arr.push(i.toString());
      }

      // Randomize category
      this.category = arrayShuffle(arr)[0].toString();
    },
  },
});
</script>

<template>
  <div class="Form">
    <label for="amount" class="FormTitle"
      >Number of Questions: {{ amount }}</label
    >
    <input
      class="FormInputRange"
      type="range"
      id="amount"
      v-model="amount"
      min="1"
      max="25"
      step="1"
    />

    <label for="category" class="FormTitle">Select Category:</label>
    <select id="category" class="FormInput" v-model="category">
      <option value="any">Any Category</option>
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

    <label for="difficulty" class="FormTitle">Select Difficulty:</label>
    <select
      id="difficulty"
      class="FormInput"
      name="difficulty"
      v-model="difficulty"
    >
      <option value="any">Any Difficulty</option>
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
    </select>

    <label for="type" class="FormTitle">Select Type:</label>
    <select id="type" class="FormInput" v-model="type">
      <option value="any">Any Type</option>
      <option value="multiple">Multiple Choice</option>
      <option value="boolean">True / False</option>
    </select>
    <button class="FormRandom" @click="random_quiz">Random</button>
    <Icon
      v-if="searching"
      icon="eos-icons:loading"
      color="var(--color-yellow)"
      height="50"
    />
    <button
      v-if="!searching"
      class="FormSubmit"
      @click="get_questions(), (searching = true)"
    >
      Search Quiz
    </button>
    <Alert
      v-if="notFound"
      @click="notFound = false"
      msg="Quiz not found. Please try other options."
    />
  </div>
</template>

<style lang="scss">
// Style Form
.Form {
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

.FormTitle {
  color: var(--color-yellow);
}

.FormInput {
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

.FormInputRange {
  cursor: pointer;
  height: 2.5rem;
  border: 0px solid;
  color: var(--color-green-dark);
  background-color: var(--color-green-light);
  font-size: 1rem;
  font-family: "Righteous";
  border-radius: 10px;
  margin-bottom: 2rem;
}

.FormSubmit {
  cursor: pointer;
  z-index: 3;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0px solid;
  color: var(--color-green-dark);
  background-color: var(--color-yellow);
  font-size: 1.5rem;
  font-family: "Righteous";
  margin-bottom: 2rem;
  border-radius: 10px;
  padding: 0.5rem 2rem;
  box-shadow: 0px 5px 0px rgba(233, 196, 106, 0.3),
    3px 10px 5px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease-in-out, color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  &:hover {
    transform: translateY(5px);
    box-shadow: 0px 0px 0px rgba(233, 196, 106, 0.25),
      0px 0px 0px rgba(0, 0, 0, 0.25);
    color: var(--color-green-light);
  }
}

.FormRandom {
  color: var(--color-green-light);
  cursor: pointer;
  background-color: transparent;
  border: 0px solid;
  font-size: 1rem;
  font-family: "Righteous";
  padding: 0.5rem 2rem;
  &:hover {
    transform: scale(0.95);
  }
  &:active {
    transform: scale(0.95);
  }
}

//Styling the range input

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: grab;
  &:active {
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

// responsive design

@media screen and (min-width: 1024px) {
  .FormInput,
  .FormInputRange {
    width: 25%;
    font-size: 1rem;
    height: 2.5rem;
  }
  .FormTitle {
    font-size: 1.1rem;
  }
}

@media screen and (max-width: 1023px) and (min-width: 768px) {
  .FormInput,
  .FormInputRange {
    width: 40%;
    font-size: 1rem;
    height: 2.5rem;
  }
  .FormTitle {
    font-size: 1.1rem;
  }
}

@media screen and (max-width: 767px) {
  .FormInput,
  .FormInputRange {
    width: 80%;
    font-size: 1rem;
    height: 2.5rem;
  }

  .FormTitle {
    font-size: 1.2rem;
  }
}
</style>
