import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/process", async (req, res) => {

    try {

        const { text, action } = req.body;

        let prompt = "";

        switch(action){

            case "correct":

                prompt = `
Correct the grammar, spelling and punctuation.

Return only the corrected text.

${text}
`;

            break;

            case "professional":

                prompt = `
Rewrite professionally.

Return only the rewritten text.

${text}
`;

            break;

            case "casual":

                prompt = `
Rewrite casually.

Return only the rewritten text.

${text}
`;

            break;

            case "enhance":

                prompt = `
Improve this writing.

Correct grammar.

Improve clarity.

Improve sentence structure.

Return only the improved text.

${text}
`;

            break;

            default:

                prompt=text;

        }

        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "llama3.2",
                prompt: prompt,
                stream: false
            }
        );

        res.json({

            result: response.data.response

        });

    }

    catch(err){

        console.error(err.message);

        res.status(500).json({

            result:"Unable to contact Ollama."

        });

    }

});

app.listen(3000,()=>{

console.log("🚀 Server running on http://localhost:3000");

});