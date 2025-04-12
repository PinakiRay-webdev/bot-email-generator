// import dotenv from 'dotenv';
// dotenv.config();
import { GoogleGenAI } from "@google/genai";

const api_key = 'AIzaSyD3zc4ljExAj6QhaCw3v_VYMYPbEf8eIp0'

const ai = new GoogleGenAI({apiKey: api_key})

export const makeTranslate = async (text) =>{
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `Translate ${text} into english. NOTE: ONLY MEANINGFUL TRANSLATION I WANT, NOT DESCRIPTIONS. GIVE ME ONLY ONE SUGGESTION`
        })

        const resultedText = response.text;
        console.log(resultedText)
        return resultedText.trim()
    } catch (error) {
        console.log(error)
    }
}