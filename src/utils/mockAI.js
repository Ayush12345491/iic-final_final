// Mock AI Service to simulate backend responses
// In a real app, this would call an API like Gemini or OpenAI

export const generateResponse = async (promptType, text, constraints = {}) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log(`Generating ${promptType} for text length: ${text.length}`);

    switch (promptType) {
        case 'short_summary':
            return `Here is a concise summary of the provided text:

1. The text discusses the fundamental principles of thermodynamics, specifically focusing on the conservation of energy.
2. It highlights the importance of entropy in closed systems and how it inevitably increases over time.
3. Finally, it touches upon the practical applications of these laws in modern engineering and heat engines.`;

        case 'key_points':
            return `- **Thermodynamics Fundamentals** [sentence:1]
  The core subject is the study of energy and heat transfer.
- **Conservation of Energy** [sentence:3]
  Energy cannot be created or destroyed, only transformed.
- **Entropy Increase** [sentence:5]
  In any isolated system, the degree of disorder always increases.
- **Heat Engines** [sentence:8]
  Practical devices that convert thermal energy into mechanical work.
- **System Boundaries** [sentence:10]
  Defining the boundary is crucial for analyzing energy flow.
- **Equilibrium States** [sentence:12]
  Systems tend to move towards a state of thermodynamic equilibrium.
- **Irreversibility** [sentence:14]
  Real-world processes are irreversible due to friction and dissipation.`;

        case 'flashcards':
            return `Q: What is the First Law of Thermodynamics?
A: Energy cannot be created or destroyed, only transformed from one form to another.

Q: Define Entropy.
A: A measure of the amount of disorder or randomness in a system.

Q: What is an isolated system?
A: A system that does not exchange matter or energy with its surroundings.

Q: What is the purpose of a heat engine?
A: To convert thermal energy into mechanical work.

Q: What is thermodynamic equilibrium?
A: A state where there are no net macroscopic flows of matter or energy within a system.`;

        case 'mcq':
            return `1. Which law states that energy cannot be created or destroyed?
A) Zeroth Law
B) First Law
C) Second Law
D) Third Law
Answer: B

2. What property of a system always increases in an isolated system?
A) Enthalpy
B) Temperature
C) Entropy
D) Pressure
Answer: C

3. A heat engine converts thermal energy into what?
A) Chemical energy
B) Electrical energy
C) Mechanical work
D) Nuclear energy
Answer: C`;

        case 'provenance_explain':
            return `The claim "Energy is conserved" is supported by:
"The First Law of Thermodynamics states that energy cannot be created or destroyed." [chunk:1 | sentence:3]`;

        case 'explain_point':
            return `Entropy is a measure of the disorder in a system. As per the Second Law of Thermodynamics, the total entropy of an isolated system can never decrease over time, implying that natural processes tend to move towards a state of greater disorder. Source: [chunk:1 | sentence:5]`;

        default:
            return "Output type not supported in mock mode.";
    }
};
