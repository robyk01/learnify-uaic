
export const executeCode = async (language, sourceCode, input = "") => {
    const url = "https://emkc.org/api/v2/piston/execute"

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "language": language,       
                "version": "*",          
                "files": [
                    {
                    "content": sourceCode
                    }
                ],
                "stdin": input
            })

            
        });
        
        if (!response.ok) {
            console.error("API Error:", response.status);
            return { error: "Compiler error." };
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error(error.message)
        return {error: "Can't connect to compiler"};
    }
}