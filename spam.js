const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsImlhdCI6MTc2NDM0ODYwOCwiZXhwIjoxNzY0MzUyMjA4fQ.OPov80cRZzayRLQaHNCzNZkIHFjALTeiAtCVUj8z3FM";

async function main() {
    let counter = 0;
    while (true) {
        try {
            await fetch("http://localhost:3000/auth/me", {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            });

            counter++;
            console.log("requested:  " + counter + ' times');
        } catch (err) {
            console.error("error:", err.message);
        }
    }
}

main();