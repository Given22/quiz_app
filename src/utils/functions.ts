import { decode } from "html-entities";

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

  return `${pad_to_digits(seconds % 60)}.${pad_to_digits(milliseconds % 1000)}`;
};

export const pad_to_digits = (num: number, digits = 2) => {
  return num.toString().padStart(digits, "0");
};
