import os
from fastapi import FastAPI,Request
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain import OpenAI
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import DirectoryLoader
from langchain.prompts import PromptTemplate
from pydantic import BaseModel
from typing import List, Tuple
import ast
import uvicorn
from fastapi.middleware.cors import CORSMiddleware 

class QuestionData(BaseModel):
    question: str
    history: str
    index_id: str
    prompt_template: str

openai_api_key = os.environ["OPENAI_API_KEY"] 

app = FastAPI()

origins = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
) 


llm = OpenAI(openai_api_key=openai_api_key, temperature=0.01)
embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)

class Chatbot:
    def ask(self, question, qa, history: List[Tuple[str, str]]):
        
        print(history)

        context = "".join([f"Q: {q}/nA: {a}" for q, a in history])
        
        context_section = f"Previous interactions:/n{context}"
        current_question_section = f"Question: {question}"

        query_with_context = f"{context_section}/n/n---/n/n \n\n {current_question_section}"

        result = qa({"query": query_with_context})
        answer = result['result']
        return answer
    
chatbot = Chatbot()

@app.get("/ok")
async def ok_endpoint():
    return {"message":"ok"}

@app.post("/ask")
async def ask_question(data: QuestionData):
    try:
        question = data.question
        raw_history = data.history
        index_id = data.index_id
        input_prompt = data.prompt_template
        
        parsed_history = ast.literal_eval(raw_history)

        db = FAISS.load_local(folder_path="faiss_db/faiss_db",embeddings=embeddings,index_name=index_id,allow_dangerous_deserialization=True)
        retriever = db.as_retriever()
        
        prompt_template = input_prompt + """ Don't use prefixes like 'A:', '[Character Name]:' or 'Answer:'
        ----------------
        {context}

        Question: {question}
        """

        PROMPT = PromptTemplate(
            template=prompt_template, input_variables=["context", "question"]
        )
        
        qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever, chain_type_kwargs={"prompt": PROMPT})

        response = chatbot.ask(history=parsed_history, qa=qa, question=question)

        print(response)
        return {"answer" : response}
    except Exception as e:
        print(e)
        pass

if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=8000)