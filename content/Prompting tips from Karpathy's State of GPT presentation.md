---
publish: true
---

Tags: #prompt #gpt #llm #ai 

![[Pasted image 20230602135701.png]]

Youtube video [of his presentation](https://www.youtube.com/watch?v=bZQun8Y4L2A)

# Key Takeaways 


1. **Reinforcement Learning from Human Feedback (RLHF)**: GPT-4 uses RLHF, which is preferred by humans over Supervised Fine-Tuning (SFT) models. RLHF models are better at generating tokens that humans prefer. However, they can sometimes produce more "peaky" results, meaning they output samples with lower variation than the base model.

2. **Prompt Engineering**: The speaker emphasizes the importance of prompt engineering, which involves designing detailed prompts that guide the model to produce desired outputs. This includes showing the model how to work step-by-step, asking it to check its work, and even instructing it to use tools like calculators for tasks it's not good at.

3. **Retrieval-Augmented Generation**: This technique involves retrieving relevant information and adding it to the prompt to improve the model's performance. This can be done by indexing and embedding relevant documents, storing them in a vector store, and retrieving them when needed.

4. **Fine-Tuning**: Fine-tuning involves changing the weights of the model to better suit a specific task. This can be done using techniques like Laura, which only trains small, sparse pieces of the model, making it more efficient.

5. **Constraint Prompting**: This technique involves forcing the model to generate outputs that follow a certain template. This can be done by manipulating the probabilities of different tokens that the model generates.

6. **Use Cases and Limitations**: The speaker suggests using GPT-4 in low-stakes applications and always combining it with human oversight due to its limitations, such as bias, fabrication of information, reasoning errors, and susceptibility to attacks.

7. **GPT-4's Capabilities**: Despite its limitations, GPT-4 is praised for its vast knowledge across many areas and its ability to generate inspiring and creative text.

Overall, the video provides a comprehensive overview of GPT-4's capabilities and the techniques used to optimize its performance, while also acknowledging its limitations and the need for careful application and human oversight.



# Prompting tips

Sure, here are the key details regarding prompting techniques or tips mentioned in the talk:

1. **Detailed Prompts**: The speaker emphasizes the importance of designing detailed prompts that guide the model to produce desired outputs. 
   - Quote: "Use prompts that are very detailed. They have lots of task content, relevant information and instructions."

2. **Showing Work Step-by-Step**: The speaker suggests showing the model how to work step-by-step, which can help spread out the reasoning across more tokens and improve the model's performance.
   - Quote: "Especially if your tasks require reasoning, you can't expect the transformer to do too much reasoning per token. You have to really spread out the reasoning across more and more tokens."

3. **Asking the Model to Check Its Work**: The speaker recommends asking the model to check its work, as it can help ensure the accuracy of the output.
   - Quote: "But it turns out that especially for the bigger models like GPT-4, you can just ask it 'did you meet the assignment?'"

4. **Instructing the Model to Use Tools**: The speaker suggests instructing the model to use tools like calculators for tasks it's not good at. This can help offload difficult tasks and improve the model's performance.
   - Quote: "You may even want to tell the transformer in a prompt you are not very good at mental arithmetic. Whenever you need to do very large number addition, multiplication, or whatever, instead, use this calculator."

5. **Retrieval-Augmented Generation**: This technique involves retrieving relevant information and adding it to the prompt to improve the model's performance.
   - Quote: "Retrieve and add any relevant context and information to these prompts."

6. **Few-Shot Examples**: The speaker recommends experimenting with few-shot examples, which involves giving the model examples of the desired output.
   - Quote: "Experiment with few-shot examples. What this refers to is, you don't just want to tell, you want to show whenever it's possible."

7. **Asking for a Strong Solution**: The speaker suggests asking the model for a strong solution, which can help guide the model to produce a high-quality output.
   - Quote: "Basically, feel free to ask for a strong solution. Say something like, you are a leading expert on this topic. Pretend you have IQ 120, etc."

8. **Constraint Prompting**: This technique involves forcing the model to generate outputs that follow a certain template. This can be done by manipulating the probabilities of different tokens that the model generates.
   - Quote: "This is basically techniques for forcing a certain template in the outputs of LLMs."

9. **Chains and Reflection**: The speaker suggests thinking about potential chains and reflection and how to glue them together. This can help create more complex and accurate outputs.
   - Quote: "Think about potential chains and reflection and how you glue them together and how you can potentially make multiple samples and so on."