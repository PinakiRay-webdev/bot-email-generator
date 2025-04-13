import {GoogleGenAI} from '@google/genai'
import { checkValidPrompt } from './checkPrompt';
import { checkViolence } from './checkHatefull';

export const generateFORM = async (api_key , subject) =>{
    try {
        const isViolence = await checkViolence(subject);
        const isValid = await checkValidPrompt(subject);
        if(isViolence === 'true'){
            throw new Error("Sorry we don't provide violence or hatefull speech");
        }else{
            if(isValid === 'false'){
                throw new Error('Sorry!!!, we generate email only.')
            }
        }
        const ai = new GoogleGenAI({apiKey : api_key})
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents : `What could be the possible input fields for an email if the subject is ${subject}? Provide me 9 fields. NOTE: ONLY MEANINGFUL KEYWORDS I WANT, NOT DESCRIPTIONS. DO NOT GIVE ME IN BULLET POINTS. DO NOT USE APOSTROPH. Don't give me any optional field. Separate each suggestion with ',' and ensure relevance. Include 'To' and 'From' as the first two fields. Never provide 'Subject' or 'Tone'. Provide Date where date is required according to subject. otherwise exclude the date. Always include 'Reason' as the last field.`
        });
    
        const responseArray = response.text.split(',')
        console.log(responseArray)
        return responseArray   
    } catch (error) {
        const errorMesaage = error.message;
        return errorMesaage;
    }
}