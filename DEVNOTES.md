# Mohammad Nusairat Notes for Code Reviewers...

Dear Code Reviewers @Orchids,

Thank you for the opportunity to complete this take-home challenge! I’d like to share a few technical notes and reflections that guided my design choices:

### Thought Process Behind Using GPT-4o and Prompt Design
After experimenting with a few different models (Claude, Gemini, etc.), I chose **GPT-4o** due to its strong performance in generating clean, semantic HTML with inline styling—critical for this cloning use case. I used a **temperature of 0.5** to balance creativity with consistency, and capped **max_tokens at 4000** to prevent truncation for larger websites while avoiding bloated output.

The system prompt was kept minimal and purposeful: "*You are a helpful AI that generates HTML websites from scraped content.*" The main prompt included the scraped HTML, CSS, Markdown, and links to give the model a multi-faceted view of the source site. This structure improved fidelity significantly compared to single-modality prompts.

Compared to other models, GPT-4o is fine-tuned for generating **clean, semantic HTML with consistent inline styling**—a crucial requirement for producing visually faithful clones. In side-by-side testing, GPT-4o produced fewer hallucinated elements and cleaner DOM hierarchies than Claude or Gemini, *particularly when given multi-modality context like Markdown + CSS*.

GPT-4o also brings prompt flexibility. It handled large, structured prompts well, even when including several different types of scraped content (HTML, CSS, Markdown, Links). Gemini struggled with prompt length, and Claude occasionally ignored the structural cues.

This is not to say that GPT-4o is perfect. One of the biggest roadblocks is actually the generative nature of ChatGPT, because it can sometimes produce varying results when cloning more complicated websites. Therefore after weighing the pros and the cons, I decided to go with GPT-4o.

### Hyperbrowser Usage and Prompt Strategy
To scrape design context, I leveraged the **Hyperbrowser SDK** due to its reliable DOM capture and metadata support. I experimented with including screenshots in the prompt (by extracting image URLs / converting to base64), but found that this actually *reduced accuracy*! The model either ignored the visual data or became distracted by too much prompt noise. Ultimately, excluding screenshots improved results by keeping the prompt clean and focused on the structural elements.

### Final Pipeline Outcome
The pipeline I settled on—scraping HTML, Markdown, and links via Hyperbrowser and then passing it to GPT-4o with a structured, focused prompt—proved to be the most accurate and scalable approach I could create **within the limited time I had**. It consistently replicated layout, fonts, and spacing for most standard websites.

### IMPORTANT NOTE !!!
When attempting large websites that have huge amounts of tokens, like [lovable.dev](https://lovable.dev/) (~116,000 tokens), the app automatically truncates the input to keep below the 30,000 token limit set by the gpt api. This will be reflected in the cloned website. 

### Ideas for Improvement
If I had more time, here are a few areas I would explore further:

- Try Hyperbrowsers `useVision` to allows the agent to analyze screenshots of the webpage for better contextual understanding.

- Extract computed styles or critical CSS, then try and reduce the noise before feeding to GPT.

- Maybe try building a **two-stage agentic pipeline**: first generating layout structure, then styling layer—to reduce bloated or inconsistent output. Could use different AI for their specific strengths (GPT, Claude, gemini, etc.) and monitor resulsts. This could possibly yield optimally accurate results if implemented correctly.

Thanks again for your time and consideration! I hope this gives insight into my approach, and and I’m excited about the opportunity to contribute disrupting the entire no code website building space with Orchids!

Best,  
Mohammad Nusairat