// import dotenv from 'dotenv';
// dotenv.config();
import { GoogleGenAI } from "@google/genai";

const api_key = 'AIzaSyD3zc4ljExAj6QhaCw3v_VYMYPbEf8eIp0'

const ai = new GoogleGenAI({apiKey: api_key})

const makeTranslate = async (text) =>{
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `Translate the following text into English only: "${text}". If the text is already in English, return it unchanged. Provide only the translated text without additional comments or suggestions.`
        })

        const resultedText = response.text;
        console.log(resultedText)
        return resultedText.trim()
    } catch (error) {
        console.log(error)
    }
}

makeTranslate('client ke liye interview mail')