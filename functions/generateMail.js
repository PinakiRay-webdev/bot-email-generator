import { GoogleGenAI } from "@google/genai";
import { makeTranslate } from "./Translate";

export const generateMail = async (apikey, subject, dynamicData) => {
  if (!apikey || !subject || !dynamicData) {
    throw new Error("Missing required parameters for email generation.");
  }

  const googleAI = new GoogleGenAI({ apiKey: apikey });

  const content = Object.entries(dynamicData)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");

  const translatedSubject = await makeTranslate(subject); //for translation

  const response = await googleAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Write a professional email with the following details:
    Subject: ${translatedSubject}
    Details: ${content}

    The email should include:
    - A proper greeting (e.g., "Dear [Recipient]")
    - A clear introduction explaining the purpose of the email
    - A body with the provided details formatted into sentences/paragraphs`,
  });

  console.log(response.text)
  return response.text
};
