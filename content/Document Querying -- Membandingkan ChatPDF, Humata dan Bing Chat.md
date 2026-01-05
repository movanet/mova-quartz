---
publish: true
dg-publish: true
permalink: published-document-querying-membandingkan-chat-pdf-humata-dan-bing-chat
---

Tags: #AITools #research #noCode 


Salah satu model #AITools yang banyak dipergunakan sebagai alat bantu riset saat ini adalah "Document Querying". Pada intinya pengguna bisa mengupload dokumen (pdf atau lainnya) dan kemudian menggunakan AI sebagai alat bantu untuk memahami dokumen tersebut. Saya bukan ahli AI, tapi saya kira tools seperti Humata dan ChatPDF menggunakan teknik [Embedding](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings), dimana dokumen yang ada dipotong potong dan kemudian dianalisis keterkaitannya. 

Saya akan membandingkan 3 #AITools yang *gratisan* dan sudah jadi -- alias #noCode --sehingga pengguna tidak perlu ribet coding. Ketiga #AITools tersebut adalah Humata, ChatPDF dan BingChat. Humata dan ChatPDF punya model freemium, artinya kalau ukuran PDFnya besar atau halamannya banyak (seperti UU Cipta Kerja), anda harus bayar. Sementara BingChat gratis, namun aksesnya masih terbatas (saya mendapat early access). 

Saya akan menggunakan [paper saya](https://deliverypdf.ssrn.com/delivery.php?ID=179007082000074113066122081099003011008035001029052027018027027126006116098066097070031119115055051016105083113123097124088068044036091040041106075009119113028025067007073125123095002067073025006070084117082100015091001087086081011125004122027027017&EXT=pdf&INDEX=TRUE) yang sudah saya kirimkan ke ConsRev dan saya presentasikan dalam sebuah konferensi. Saya menggunakan paper saya sendiri supaya  bisa menilai akurasi #AITools tersebut dalam menafsirkan tulisan saya. Saya akan memberi mereka pertanyaan (prompt) yang sama. 

Prompt: Can you provide examples of water conflicts cited by the paper?


1. [Humata](https://app.humata.ai/)


Answer: 

>Yes, here are some examples of water conflicts cited in the paper: 1. Conflict over water quantity: The paper cites conflicts over water quantity in Northern Aceh, Indonesia, where farmers experienced conflict due to a lack of coordination in water distribution among farmers, inadequate water during drought season, lack of maintenance of irrigation infrastructure, or unilateral action from upstream farmers in lessening or preventing water flow downstream. 2. Conflict over water quality: The paper cites conflicts over water quality in Indonesia, where there is a conflict between rice farming and aquaculture, where brackish water seeps into paddy fields and damages rice plants. Another example is the decrease of water quality due to aquaculture/floating net cages (keramba jaring apung) in dams. 3. Conflict over spatial development with implications for water security: The paper cites conflicts over spatial development with implications for water security in Sidoarjo, Indonesia, where Islamic Boarding Schools resist an industrial project from a company to control several springs. Conflict also occurs between farmers themselves, for example, in Southern Sumatera conflict occurred between water for rice fields and inland fishery.


Screenshot Humata

![[Pasted image 20230321182234.png]]

2. [Bing Chat](https://www.bing.com/new)

Answer:

> Yes, the paper cites several examples of water conflicts in Indonesia. In Southern Sumatera, utilization of water for inland fishery in the upstream area led to water scarcity in the downstream and precipitated conflict among farmers. Development of hydropower has caused the submersion of rice fields in Southeastern Sulawesi and led to protest from affected farmers. In Northern Sumatera, development of hydropower caused agricultural fields to be submerged and disturbed the livelihood of smallholder farmers. In Sidoarjo, conflict between farmers arose when one village closed water channels, which caused rice fields on another village to be submerged.

3. [ChatPDF](https://www.chatpdf.com/)

Answer:

> The paper mentions that conflict in water resources has been reported between water users and uses, such as between agriculture and drinking water, between agriculture and fisheries, and between local farmers and industries. However, it does not provide specific examples of water conflicts in Indonesia. Instead, the paper focuses on discussing the strengths and limitations of the Constitutional Court's "6 Basic Principles" in resolving water conflicts in Indonesia.

Screenshot ChatPDF

![[Pasted image 20230321182903.png]]

Siapa pemenangnya?

Jawaban Humata paling akurat, sementara ChatPDF tidak memberikan jawaban seperti yang saya inginkan. Jawaban Bing juga akurat, sayangnya jawabannya pendek. Selain itu, Humata juga memberikan halaman letak teks yang dia jawab beserta *highlight*nya. 

Screenshot Bing Chat

![[Pasted image 20230321183147.png]]

Saya kemudian bertanya lagi ke Bing: can you provide another examples cited by the paper?

Answer:

> The paper mentions several examples of water conflicts in Indonesia. In Southern Sumatera, utilization of water for inland fishery in the upstream area led to water scarcity in the downstream and precipitated conflict among farmers1. In West Sumatra, hydropower projects compete with irrigation needs. In Karanganyar, Central Java, some conflict arises between tourism local government and the private sector. In Klaten, Central Java, conflict occurred between smallholder farmers and companies. In Pandeglang, Banten, the religious community from Islamic Boarding Schools – led by their religious leaders (Kyai) – resist an industrial project from a company to control several springs. Conflict also occurs between farmers themselves, for example, in Southern Sumatera conflict occurred between water for rice fields and inland fishery.

Jadi jawaban Bing cukup lumayan.

Selanjutnya, saya bertanya pada Bing: 
which laws or court decisions are cited by this paper?

Bing menjawab:

![[Pasted image 20230321183718.png]]

Lalu saya berikan pertanyaan yang sama kepada Humata; dia menjawab:

![[Pasted image 20230321183808.png]]

Lagi-lagi, jawaban humata lebih akurat. Dia cuma salah menyebutkan 1 buku menjadi "law", mungkin karena judul bukunya Water Law.

Kalau ada waktu, minggu depan saya akan membahas beberapa model #AITools #DocumentQuerying yang #lowCode