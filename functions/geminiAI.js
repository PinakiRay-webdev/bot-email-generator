import {GoogleGenAI} from '@google/genai'


export const generateFORM = async (api_key , subject) =>{
    const ai = new GoogleGenAI({apiKey : api_key})
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents : `What could be the possible input fields for an email if the subject is ${subject}. Provide me 6 fields. NOTE: ONLY MEANINGFULL KEYWORDS I WANT NOT DESCRIPTION. DO NOT GIVE ME IN BULLET POINTS. Don't give me any optional field. seperate each suggestion with ','. Include to and from also. And always mention reason in the last. Give importance to date also specically end date over number of days and start date over end date. First and second must be To and Whom. Never provide subject and tone. Mention date only when date is required for the subject, otherwise don't`
    });

    const responseArray = response.text.split(',')
    return responseArray
}
