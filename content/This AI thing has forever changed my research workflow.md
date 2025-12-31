---
publish: true
---

Recordings with stakeholders: transcribed with Whisper API

Searching documents: Use OpenAI embeddings (with pinecone and langchain backends) semantic search

Synthesizing document: GPT-4

Translation: GPT-4

For example:

MP3 interview record --> Whisper AI transcription --> Transcribe embedded in langchain --> GPT provides synthesis

I do note that the problem with embedding is that some information might be lost. AI may not be able to pick "important issues". However, for large datasets this is still godsend.

So how can we mitigate the above problem? For now, I use recoll to crawl everything. As researchers, we've done the fieldwork and interviews, we know which ones are "insights". If there is anything that the AI is missing, I do regular keyword search with recoll.

There are better search engines that use NLP such as Jina.ai. But I don't have time to implement them yet -- maybe in the near future