import type { Answers, Quiz } from "@/types/types";

export const check_answer = (question: string, quiz: Quiz[], answers: Answers) => {
  const que = quiz.find((Q) => Q.question === question);
  if (!answers[question]) return;
  if (que && que.correct_answer === answers[question]) return true;
  return false;
};

// check all questions and calculate percentage of correct answers
export const check_answers = (quiz: Quiz[], answers: Answers) => {
  let correctAnswers = 0;
  quiz.forEach((Q: Quiz) => {
    if (check_answer(Q.question, quiz, answers)) {
      correctAnswers++;
    }
  });

  const percents = Math.floor((correctAnswers / quiz.length) * 100);
  return {correctAnswers, percents};
};
