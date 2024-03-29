import { decode } from "html-entities";
import { URL } from "@/utils/constans";
import { store } from "@/stores/quiz";

export const decode_text = (str: string) => {
  return decode(str);
};

export const convert_ms_to_time = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${pad_to_digits(hours % 24)}:${pad_to_digits(
    minutes % 60
  )}:${pad_to_digits(seconds % 60)}`;
};

export const convert_ms_to_sec = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000);

  return `${seconds % 60}.${pad_to_digits(milliseconds % 1000, 3)}`;
};

export const pad_to_digits = (num: number, digits = 2) => {
  return num.toString().padStart(digits, "0");
};

export const create_url = (
  amount: number,
  category: string,
  difficulty: string,
  type: string
) => {
  //Amount of questions
  const amountText = amount ? `amount=${amount}` : "";

  // Category paremeter
  const categoryText =
    category && category !== "any" ? `category=${category}` : "";

  // Difficulty parameter
  const difficultyText =
    difficulty && difficulty !== "any" ? `difficulty=${difficulty}` : "";

  // Type parameter
  const typeText = type && type !== "any" ? `type=${type}` : "";

  // Combine all parameters into one string and filter out empty values
  const options = [amountText, categoryText, difficultyText, typeText]
    .filter(Boolean)
    .join("&");
  return `${URL}${options}`;
};

export const get_questions = async (
  amount: number,
  category: string,
  difficulty: string,
  type: string
) => {
  // Combine URL and options and send request to Trivia API
  return await fetch(create_url(amount, category, difficulty, type))
    .then((response) => response.json())
    // check if response is successful
    .then((data) => {
      if (data.response_code !== 0) throw new Error("quiz not found");
      return data;
    })
    .then((data) => {
      store.commit("setQuiz", { data: data });
    })
    .then(() => {
      store.commit("setStatsQuiz", {
        questionNumber: amount,
        category: category,
        difficulty: difficulty,
        type: type,
      });
    })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.error("error: ", err);
    });
};
